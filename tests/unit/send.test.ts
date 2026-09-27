// TSK-0310: every body the server sends is parsed by its strict schema first.
import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { AnswerOut } from "../../src/shared/api.js";
import { send } from "../../src/server/send.js";

const reply = {
  outcome: "clean" as const,
  streak: 1,
  grants: [],
  threads: 0,
  feedback: { correctAnswer: "7" },
  shortSolution: ["3 + 4 = 7"],
  battleLine: "Узел распутан начисто.",
};

describe("send parses the body before it leaves", () => {
  it("sends a body its schema accepts", async () => {
    const app = new Hono().get("/", (c) => send(c, AnswerOut, reply));
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(reply);
  });

  it("fails with 500 and sends nothing of a body with a field outside its schema", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = new Hono().get("/", (c) =>
      send(c, AnswerOut, { ...reply, node: "A1" } as never),
    );
    const res = await app.request("/");
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).toBe('{"error":"packet_invalid"}');
    expect(body).not.toContain("A1");
    expect(errors).toHaveBeenCalledWith(
      expect.stringContaining("packet_invalid"),
    );
    errors.mockRestore();
  });
});
