// TSK-0490: the client gets only the view of a task. Its identifier reveals
// nothing about the task, no packet carries a trap, a solution path, a node or a
// seed before the first attempt, and every picture is drawn by code from the
// task's parameters, under a strict schema (REQ-1218, REQ-1220, REQ-1222,
// REQ-1230).
import { describe, expect, it } from "vitest";
import { forbiddenFields } from "../helpers/packets.js";
import {
  clientView,
  clientViewSchema,
  opaqueId,
  parsePictureParams,
  renderPicture,
  stripIds,
  type ServerTask,
} from "../../src/render/view.js";
import { baseSeed } from "../../src/math/rng.js";

const secret = Buffer.from("test-secret-not-a-real-key");

/** A task as the server holds it, from one template and one seed. */
const task = (i: number): ServerTask => {
  const seed = baseSeed(`sess-${i}`, "A1.sum", 0);
  return {
    taskId: `task-${i}`,
    node: "A1",
    templateId: "A1.sum",
    seed: Buffer.from(seed).toString("hex"),
    text: `Сколько будет ${i} + 1?`,
    svg: renderPicture({ count: 3 + (i % 5) }),
    options: null,
    traps: [{ id: "trap-add-one", value: `${i + 2}` }],
    correctAnswer: `${i + 1}`,
    shortSolution: [`${i} + 1 = ${i + 1}`],
  };
};

describe("REQ-1218: an identifier reveals nothing about its task", () => {
  it("gives two tasks from one template and seed different identifiers", () => {
    const a = opaqueId(secret, "task-1");
    const b = opaqueId(secret, "task-2");
    expect(a).not.toBe(b);
    for (const id of [a, b]) {
      expect(id).toMatch(/^[0-9a-f]{32}$/);
      for (const hidden of ["A1", "A1.sum", "sum"])
        expect(id.includes(hidden)).toBe(false);
    }
  });

  it("depends on the server secret, so the identifier isn't derivable from the task", () => {
    expect(opaqueId(secret, "task-1")).not.toBe(
      opaqueId(Buffer.from("another-secret"), "task-1"),
    );
  });
});

describe("REQ-1220, REQ-1222: no packet carries a trap, a solution or a seed before the first attempt", () => {
  it("serialises 1,000 client-bound payloads with none of the hidden fields", () => {
    for (let i = 0; i < 1000; i++) {
      const view = clientView(task(i), secret);
      const json = JSON.stringify(view);
      expect(forbiddenFields(view)).toEqual([]);
      expect(json).not.toContain("trap-add-one");
      expect(json).not.toContain("correctAnswer");
      expect(json).not.toContain(task(i).seed);
      expect(json).not.toContain("A1.sum");
      expect(json).not.toContain(`${i} + 1 = ${i + 1}`);
    }
  });

  it("validates the view and refuses a field outside the schema", () => {
    const view = clientView(task(1), secret);
    expect(() => clientViewSchema.parse(view)).not.toThrow();
    expect(() =>
      clientViewSchema.parse({ ...view, correctAnswer: "2" }),
    ).toThrow();
  });
});

describe("REQ-1230: every picture is drawn by code from the task's parameters", () => {
  it("draws the same SVG from the same parameters, with no node or template named", () => {
    const svg = renderPicture({ count: 4 });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toBe(renderPicture({ count: 4 }));
    expect(svg.includes(' id="')).toBe(false);
    expect(svg.includes(' class="')).toBe(false);
    expect(svg.includes("A1")).toBe(false);
  });

  it("refuses a picture parameter outside the schema", () => {
    expect(parsePictureParams({ count: 4 })).toEqual({ count: 4 });
    expect(() => parsePictureParams({ count: 4, node: "A1" })).toThrow();
  });

  it("strips frameId and anchorId from anything it draws", () => {
    expect(stripIds({ frameId: "f", anchorId: "a", count: 2 })).toEqual({
      count: 2,
    });
  });
});
