// The parameter file of the knowledge model (ADR-0060, REQ-0986). A file takes effect
// only after this validator confirms, for every answer form and every number of steps
// of the catalogue, that pGuess + pSlip < 1 and that each learning rate is below
// 1 - pSlip / (1 - pGuess). A bad file never loads: the server keeps the active one.
import { z } from "zod";

export class ModelParamsInvalid extends Error {
  constructor(message: string) {
    super(`model_params_invalid: ${message}`);
    this.name = "ModelParamsInvalid";
  }
}

const Level = z.enum(["1F", "1S", "stretch"]);

export const ModelParams = z
  .object({
    version: z.string().min(1),
    pInit: z.record(z.string(), z.record(Level, z.number().min(0).max(1))),
    pLearnPractice: z.number().min(0).max(1),
    pLearnFeedback: z.number().min(0).max(1),
    pGuessFree: z.number().min(0).max(1),
    slipBase: z.number().min(0).max(1),
    pSlipMin: z.number().min(0).max(1),
    halfLife: z
      .object({
        initialDays: z.number().positive(),
        growth: z.number().min(1),
        capDays: z.number().positive(),
        minGapDays: z.number().min(0),
      })
      .strict(),
  })
  .strict();

export type ModelParamsT = z.infer<typeof ModelParams>;

/** The answer forms the catalogue holds: free input, and a choice of 2 to 4 options. */
export const ANSWER_FORMS: readonly {
  name: string;
  form: "free" | "choice";
  options: number;
}[] = [
  { name: "free", form: "free", options: 0 },
  { name: "choice2", form: "choice", options: 2 },
  { name: "choice3", form: "choice", options: 3 },
  { name: "choice4", form: "choice", options: 4 },
];
/** The number of steps the catalogue's templates can have (1 to 6). */
export const STEP_COUNTS = [1, 2, 3, 4, 5, 6] as const;

/** pGuess of an answer form: the free-input value, or 1 over the number of options. */
export const pGuessOf = (
  p: ModelParamsT,
  form: "free" | "choice",
  options: number,
): number => (form === "free" ? p.pGuessFree : 1 / options);

/** pSlip of a template with `steps` steps: max(pSlipMin, 1 - slipBase^steps) (ADR-0060). */
export const pSlipOf = (p: ModelParamsT, steps: number): number =>
  Math.max(p.pSlipMin, 1 - p.slipBase ** steps);

/**
 * Validates a parameter file for every answer form and step count. The first broken
 * bound is raised with its template and the bound it breaks.
 */
export function validateParams(value: unknown): ModelParamsT {
  const parsed = ModelParams.safeParse(value);
  if (!parsed.success)
    throw new ModelParamsInvalid(
      parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    );
  const p = parsed.data;
  for (const form of ANSWER_FORMS)
    for (const steps of STEP_COUNTS) {
      const g = pGuessOf(p, form.form, form.options);
      const s = pSlipOf(p, steps);
      const template = `${form.name}/${steps} steps`;
      if (g + s >= 1)
        throw new ModelParamsInvalid(
          `template ${template}: pGuess + pSlip = ${(g + s).toFixed(4)} is 1 or more`,
        );
      const bound = 1 - s / (1 - g);
      for (const [name, rate] of [
        ["pLearnPractice", p.pLearnPractice],
        ["pLearnFeedback", p.pLearnFeedback],
      ] as const)
        if (!(rate < bound))
          throw new ModelParamsInvalid(
            `template ${template}: ${name} = ${rate} is not below the bound ${bound.toFixed(4)}`,
          );
    }
  return p;
}

/** Loads the v1 file from its text, validated before it takes effect. */
export function loadParams(text: string): ModelParamsT {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    throw new ModelParamsInvalid(`not JSON: ${(error as Error).message}`);
  }
  return validateParams(value);
}
