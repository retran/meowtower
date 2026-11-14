// The sandbox's state levers (ADR-3280, REQ-8288): the parent sets a state of the game in the
// sandbox. A state the game keeps as an event is set by writing that event, the way play writes it.
// A node's level and the rank have no event that sets them, because the model computes both from
// the answers, so a lever writes their projection row, and the next full recompute of the sandbox
// computes them from its log again.
import { z } from "zod";
import { appendEvents } from "../../engine/events/append.js";
import { RANKS } from "../../engine/model/rank.js";
import { SHIPPED } from "../../shared/i18n.js";
import type { Db } from "../db/index.js";

const text = z.string().min(1).max(80);
const count = z.number().int().min(0).max(100000);

export const Lever = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("language"), value: z.enum(SHIPPED) }).strict(),
  z.object({ kind: z.literal("gender"), value: z.enum(["f", "m"]) }).strict(),
  z
    .object({
      kind: z.literal("creepiness"),
      value: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("friendship"),
      familiarId: text,
      points: count,
      level: count,
    })
    .strict(),
  z
    .object({
      kind: z.literal("item"),
      rewardId: text,
      rewardKind: text,
      amount: count,
    })
    .strict(),
  z
    .object({
      kind: z.literal("nodeLevel"),
      node: text,
      level: z.number().int().min(1).max(5),
    })
    .strict(),
  z.object({ kind: z.literal("rank"), rank: z.enum(RANKS) }).strict(),
]);
export type Lever = z.infer<typeof Lever>;

/** Sets one state in the sandbox's database; the caller has checked that it is the sandbox's. */
export async function setLever(db: Db, lever: Lever, now: Date): Promise<void> {
  const at = now.toISOString();
  const event = (type: string, payload: object) =>
    appendEvents(db, [{ type, v: 1, payload, origin: "server" }]);
  switch (lever.kind) {
    case "language":
    case "gender":
    case "creepiness":
      await event("settings_changed", { key: lever.kind, value: lever.value });
      return;
    case "friendship":
      await event("familiar_friendship", {
        familiarId: lever.familiarId,
        points: lever.points,
        level: lever.level,
      });
      return;
    case "item":
      await event("reward_granted", {
        source: "lever",
        kind: lever.rewardKind,
        rewardId: lever.rewardId,
        amount: lever.amount,
      });
      return;
    case "nodeLevel":
      await db
        .prepare("DELETE FROM node_levels WHERE node = ?")
        .run(lever.node);
      await db
        .prepare("INSERT INTO node_levels VALUES (?, ?, 'lever', 0, '[]', ?)")
        .run(lever.node, lever.level, at);
      return;
    case "rank":
      await db.prepare("DELETE FROM rank_state").run();
      await db
        .prepare("INSERT INTO rank_state VALUES (1, ?, 'lever', 0, '[]', ?)")
        .run(lever.rank, at);
      return;
  }
}
