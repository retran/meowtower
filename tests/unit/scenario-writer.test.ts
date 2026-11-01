// REQ-8198, REQ-8236: the pipeline writes a scenario as a structured reply, and a broken one is
// written again with its faults named, then given up.
import { describe, expect, it } from "vitest";
import type { Gateway } from "../../src/server/gateway/gateway.js";
import { writeScenario } from "../../src/story/writer.js";

const scene = (i: number, n: number) => {
  const next = i === n - 1 ? "e0" : `s${String(i + 1)}`;
  return {
    id: `s${String(i)}`,
    text: `Scene ${String(i)}`,
    options: [{ label: "Go on", next }],
    check: {
      why: "hard",
      clean: next,
      partial: next,
      alt: i === n - 1 ? "e1" : next,
    },
  };
};
const scenario = (n: number) => ({
  id: "s1",
  premise: "p",
  start: "s0",
  scenes: Array.from({ length: n }, (_, i) => scene(i, n)),
  endings: [
    { id: "e0", outcome: "free" },
    { id: "e1", outcome: "lost" },
  ],
});

const replies = (...texts: string[]) => {
  const users: string[] = [];
  let i = 0;
  const gateway: Gateway = {
    call: (request) => {
      users.push(request.user);
      const text = texts[i++];
      return Promise.resolve(
        text === undefined
          ? { ok: false, reason: "failed" }
          : { ok: true, text },
      );
    },
  } as unknown as Gateway;
  return { gateway, users };
};
const ask = {
  bucket: "a1",
  lang: "ru" as const,
  brief: "autumn",
  minChecks: 5,
};

describe("writing a scenario", () => {
  it("returns a scenario that passes", async () => {
    const { gateway } = replies(JSON.stringify(scenario(15)));
    expect((await writeScenario(gateway, ask))?.id).toBe("s1");
  });

  it("writes again with the faults named when one fails", async () => {
    const { gateway, users } = replies(
      JSON.stringify(scenario(14)),
      JSON.stringify(scenario(15)),
    );
    expect((await writeScenario(gateway, ask))?.scenes).toHaveLength(15);
    expect(users[1]).toContain("scene_count");
  });

  it("gives up after two failures", async () => {
    const { gateway } = replies("not json", JSON.stringify(scenario(14)));
    expect(await writeScenario(gateway, ask)).toBeNull();
  });

  it("gives up when the model fails", async () => {
    const { gateway } = replies();
    expect(await writeScenario(gateway, ask)).toBeNull();
  });
});
