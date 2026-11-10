// The first profile belongs to no account until someone at the Mac claims it (ADR-3320,
// REQ-8500). The claim runs as a command on the Mac, so a person at the Mac is the only one who can
// take it; the account it joins is the address she then signs in with.
import { randomUUID } from "node:crypto";
import type { Db } from "../db/index.js";
import { normaliseEmail } from "./store.js";

export class ClaimRefused extends Error {
  constructor(reason: string) {
    super(`claim_refused: ${reason}`);
    this.name = "ClaimRefused";
  }
}

export interface Claimed {
  readonly accountId: string;
  readonly profileId: string;
}

/**
 * Gives the profile in `schema` to the account of `rawEmail`, making the account where there is
 * none. The address is verified at the first sign-in, as any other. A profile that an account
 * already owns is not given away: a repeat by the same address returns the same profile.
 */
export async function claimFirstProfile(
  db: Db,
  rawEmail: string,
  label: string,
  schema: string,
  now: number,
): Promise<Claimed> {
  const email = normaliseEmail(rawEmail);
  if (!email) throw new ClaimRefused("the address is not an email");
  const name = label.trim();
  if (name === "" || name.length > 40)
    throw new ClaimRefused("the label is 1 to 40 characters");
  return await db.transaction(async (): Promise<Claimed> => {
    const stamp = new Date(now).toISOString();
    const taken = (await db
      .prepare(
        `SELECT p.id AS profile, a.id AS account, a.email AS email
           FROM profiles p JOIN accounts a ON a.id = p.account_id WHERE p.schema_name = ?`,
      )
      .get(schema)) as
      { profile: string; account: string; email: string } | undefined;
    if (taken) {
      if (taken.email !== email)
        throw new ClaimRefused(`${schema} already belongs to ${taken.email}`);
      return { accountId: taken.account, profileId: taken.profile };
    }
    let account = (await db
      .prepare("SELECT id FROM accounts WHERE email = ?")
      .get(email)) as { id: string } | undefined;
    if (!account) {
      account = { id: randomUUID() };
      await db
        .prepare(
          "INSERT INTO accounts (id, email, verified_at, created_at) VALUES (?, ?, NULL, ?)",
        )
        .run(account.id, email, stamp);
    }
    const profileId = randomUUID();
    await db
      .prepare(
        "INSERT INTO profiles (id, account_id, label, schema_name, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .run(profileId, account.id, name, schema, stamp);
    return { accountId: account.id, profileId };
  })();
}
