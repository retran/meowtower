// The dated price table of ADR-3100: the direct route reports tokens and no cost, and every route
// reserves from these prices. US dollars per million tokens, read from Anthropic's page on 2026-10-31.
export interface Price {
  readonly input: number;
  readonly output: number;
}

const PRICES: Readonly<Record<string, Price>> = {
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-opus-5-5": { input: 4, output: 20 },
};

/** A model missing from the table reserves at the dearest price, so a budget errs on the safe side. */
const UNKNOWN: Price = { input: 10, output: 50 };

export const priceOf = (model: string): Price =>
  PRICES[model.replace(/^anthropic\//, "").replace(/\./g, "-")] ?? UNKNOWN;

export const costOf = (
  model: string,
  inputTokens: number,
  outputTokens: number,
): number => {
  const price = priceOf(model);
  return (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
};
