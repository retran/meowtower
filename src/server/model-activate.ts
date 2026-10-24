// The activation of a candidate model (ADR-0510, REQ-7506): the candidate and the active version
// are replayed over the log, and `model_activated` is written only when the candidate predicts the
// held-out attempts with lower log-loss and lower calibration error. The server is the log's only
// writer, so the parent's command reaches this through the parent listener.
import { appendEvents } from "../engine/events/append.js";
import { allEvents } from "../engine/events/read.js";
import {
  decideActivation,
  type EvalGraph,
  evaluateModel,
  type Figures,
  gateRuns,
} from "../engine/model/evaluate.js";
import { loadParams, type ModelParamsT } from "../engine/model/params.js";
import type { Db } from "./database.js";

export interface ActivationContext {
  readonly graph: EvalGraph;
  readonly zone: string;
  /** The parameters of the model in use, or null before any model is active. */
  readonly active: () => ModelParamsT | null;
}

export interface Activation {
  readonly accepted: boolean;
  readonly modelVersion: string;
  readonly previous: string | null;
  readonly reasons: readonly string[];
  readonly figures: { active: Figures | null; candidate: Figures };
}

/** Evaluates the candidate file text and writes `model_activated` when it passes. */
export function activateModel(
  db: Db,
  candidateText: string,
  context: ActivationContext,
): Activation {
  const candidate = loadParams(candidateText);
  const active = context.active();
  const log = [...allEvents(db)];
  const figures = (p: ModelParamsT): Figures =>
    evaluateModel(context.graph, log, p, context.zone);
  const candidateFigures = figures(candidate);
  const previous = active?.version ?? null;
  const result = (
    accepted: boolean,
    reasons: readonly string[],
    activeFigures: Figures | null,
  ): Activation => ({
    accepted,
    modelVersion: candidate.version,
    previous,
    reasons,
    figures: { active: activeFigures, candidate: candidateFigures },
  });
  if (active !== null && !gateRuns(active.version, candidate.version))
    return result(
      false,
      [`model ${candidate.version} is already active`],
      null,
    );
  const activeFigures = active === null ? null : figures(active);
  const decision = decideActivation(
    activeFigures ?? undefined,
    candidateFigures,
  );
  if (!decision.accepted) return result(false, decision.reasons, activeFigures);
  appendEvents(db, [
    {
      type: "model_activated",
      v: 1,
      origin: "server",
      payload: {
        modelVersion: candidate.version,
        previous,
        heldOutAttempts: candidateFigures.n,
        figures: {
          active: activeFigures && {
            logLoss: activeFigures.logLoss,
            ece: activeFigures.ece,
          },
          candidate: {
            logLoss: candidateFigures.logLoss,
            ece: candidateFigures.ece,
          },
        },
      },
    },
  ]);
  return result(true, decision.reasons, activeFigures);
}
