// REQ-8502: an account is an email the parent proved by entering a code sent to it. The code lives
// 10 minutes, works once, is kept as a hash, and five wrong tries lock the address for 15 minutes.
import { afterAll, beforeAll, expect, it } from "vitest";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import type { Mailer } from "../../src/server/accounts/mailer.js";
import {
  CODE_GAP_MS,
  CODE_LIFETIME_MS,
  LOCK_MS,
  checkCode,
  issueCode,
  normaliseEmail,
  openAccounts,
} from "../../src/server/accounts/store.js";
import { oncePerRun } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const schema = `t_${String(process.pid)}_acct`;
let db: Db;
beforeAll(async () => {
  db = await openAccounts(URL, schema);
});
afterAll(async () => {
  await db.close();
  await dropSchema(URL, schema);
});

/** A mailer that keeps what it was asked to send, and the code in it. */
function inbox(): Mailer & { last: () => { to: string; code: string } } {
  const sent: { to: string; code: string }[] = [];
  return {
    send: (to, _subject, text) => {
      sent.push({ to, code: /\b(\d{6})\b/.exec(text)?.[1] ?? "" });
      return Promise.resolve();
    },
    last: () => sent.at(-1) ?? { to: "", code: "" },
  };
}
const T0 = Date.UTC(2026, 10, 8, 12, 0, 0);

oncePerRun("the parent's sign-in code", () => {
  it("makes the account when the right code arrives, once", async () => {
    const mail = inbox();
    expect(await issueCode(db, mail, "Parent@Example.org ", T0)).toEqual({
      result: "sent",
    });
    expect(mail.last().to).toBe("parent@example.org");
    const first = await checkCode(
      db,
      "parent@example.org",
      mail.last().code,
      T0 + 1000,
    );
    expect(first.result).toBe("ok");
    // A used code is gone, and the same address finds the same account next time.
    expect(
      await checkCode(db, "parent@example.org", mail.last().code, T0 + 2000),
    ).toEqual({ result: "expired" });
    await issueCode(db, mail, "parent@example.org", T0 + CODE_GAP_MS + 5000);
    const again = await checkCode(
      db,
      "parent@example.org",
      mail.last().code,
      T0 + CODE_GAP_MS + 6000,
    );
    expect(
      again.result === "ok" && first.result === "ok" && again.account.id,
    ).toBe(first.result === "ok" ? first.account.id : "");
  });

  it("keeps a hash, never the code", async () => {
    const mail = inbox();
    await issueCode(db, mail, "hash@example.org", T0);
    const row = (await db
      .prepare("SELECT code_hash FROM sign_in_codes WHERE email = ?")
      .get("hash@example.org")) as { code_hash: string };
    expect(row.code_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.code_hash).not.toContain(mail.last().code);
  });

  it("refuses an expired code and a code for another address", async () => {
    const mail = inbox();
    await issueCode(db, mail, "late@example.org", T0);
    expect(
      await checkCode(
        db,
        "late@example.org",
        mail.last().code,
        T0 + CODE_LIFETIME_MS,
      ),
    ).toEqual({ result: "expired" });
    await issueCode(db, mail, "one@example.org", T0);
    const code = mail.last().code;
    expect(await checkCode(db, "two@example.org", code, T0 + 1000)).toEqual({
      result: "expired",
    });
  });

  it("locks the address after five wrong tries, for 15 minutes, then lets a new code in", async () => {
    const mail = inbox();
    await issueCode(db, mail, "lock@example.org", T0);
    const right = mail.last().code;
    const wrongCode = right === "000000" ? "111111" : "000000";
    for (let i = 1; i < 5; i++)
      expect(
        await checkCode(db, "lock@example.org", wrongCode, T0 + i),
      ).toEqual({
        result: "wrong",
      });
    expect(await checkCode(db, "lock@example.org", wrongCode, T0 + 5)).toEqual({
      result: "locked",
      retryAt: T0 + 5 + LOCK_MS,
    });
    // Even the right code is refused while it lasts, and no new code is sent.
    expect(
      (await checkCode(db, "lock@example.org", right, T0 + 6)).result,
    ).toBe("locked");
    expect(await issueCode(db, mail, "lock@example.org", T0 + 7)).toMatchObject(
      {
        result: "locked",
      },
    );
    await issueCode(db, mail, "lock@example.org", T0 + 5 + LOCK_MS + 1);
    expect(
      (
        await checkCode(
          db,
          "lock@example.org",
          mail.last().code,
          T0 + 5 + LOCK_MS + 2,
        )
      ).result,
    ).toBe("ok");
  });

  it("asks a second code within 30 seconds to wait, and refuses what is no address", async () => {
    const mail = inbox();
    await issueCode(db, mail, "gap@example.org", T0);
    expect(await issueCode(db, mail, "gap@example.org", T0 + 1000)).toEqual({
      result: "too_soon",
      retryAt: T0 + CODE_GAP_MS,
    });
    expect(await issueCode(db, mail, "not an address", T0)).toEqual({
      result: "invalid",
    });
    expect(normaliseEmail("a@b")).toBeNull();
  });
});
