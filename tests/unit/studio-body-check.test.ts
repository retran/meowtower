// REQ-8306, REQ-8600 (ADR-3360): an edit of an encounter passes the code's check before it is stored,
// and a fault names the field, the value it holds and the value it must hold. A save checks the
// shape of what is there and not that every field is filled, so an unfinished encounter can be kept.
import { describe, expect, it } from "vitest";
import { checkEncounterBody } from "../../src/server/studio/body-check.js";

const around = { self: "e1", siblings: ["e1", "e2", "e3"] };
const check = (body: unknown) => checkEncounterBody(body, around);

describe("REQ-8306: what an encounter's body may hold", () => {
  it("accepts an empty body and a whole one", () => {
    expect(check({})).toBeNull();
    expect(
      check({
        place: "A rope bridge",
        situation: "The ropes are wet.",
        goal: "Cross before dark",
        pressure: "The light is going",
        checks: 2,
        people: [{ name: "Marta", aim: "wants the bridge cut" }],
        exits: [{ when: "she crosses", next: "e2" }],
      }),
    ).toBeNull();
  });

  it("refuses a body that is not an object and a field the form does not have", () => {
    expect(check("text")).toMatchObject({ field: "body", code: "not_object" });
    expect(check({ colour: "red" })).toMatchObject({
      field: "colour",
      code: "unknown_field",
    });
  });
});

describe("REQ-8600: a fault names the field, what it holds and what it needs", () => {
  it("names a text that is not text", () => {
    expect(check({ place: 5 })).toEqual({
      field: "place",
      code: "not_text",
      held: "5",
      need: "text",
    });
  });

  it("names a text that is too long, with its length and the limit", () => {
    expect(check({ goal: "x".repeat(700) })).toEqual({
      field: "goal",
      code: "too_long",
      held: "700",
      need: "600",
    });
  });

  it("names a count outside its range, and one that is not whole", () => {
    expect(check({ checks: 7 })).toEqual({
      field: "checks",
      code: "out_of_range",
      held: "7",
      need: "0 to 6",
    });
    expect(check({ checks: 1.5 })).toMatchObject({
      field: "checks",
      code: "not_whole_number",
      held: "1.5",
    });
  });

  it("names an exit that leads nowhere in this adventure, and one that leads to itself", () => {
    expect(check({ exits: [{ when: "she runs", next: "zz" }] })).toEqual({
      field: "exits.0.next",
      code: "unknown_encounter",
      held: "zz",
      need: "an encounter of this adventure",
    });
    expect(check({ exits: [{ when: "she waits", next: "e1" }] })).toMatchObject(
      { field: "exits.0.next", code: "own_exit" },
    );
  });

  it("names an exit with no condition and a person with no name, by their place in the list", () => {
    expect(
      check({
        exits: [
          { when: "she runs", next: "e2" },
          { when: " ", next: "e3" },
        ],
      }),
    ).toMatchObject({ field: "exits.1.when", code: "empty", need: "text" });
    expect(check({ people: [{ name: "", aim: "" }] })).toMatchObject({
      field: "people.0.name",
      code: "empty",
    });
  });
});
