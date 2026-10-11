// Readability of a story frame (ADR-0040, REQ-0701, REQ-0790 to REQ-0798). A
// frame is measured in sentences, words and risk terms, and each limit of the
// table is read against those measures. The frequency list and the risk terms
// come from the caller: the list is assembled from a corpus and the glossary
// arrives with ADR-0160, so this module holds neither.

export interface Lexicon {
  /** The words familiar to the player's age band, lower-cased. */
  readonly frequency: ReadonlySet<string>;
  /** The risk terms, lower-cased. */
  readonly riskTerms: readonly string[];
}

export interface Metrics {
  readonly sentences: number;
  readonly words: number;
  readonly meanWords: number;
  readonly longest: number;
  readonly questionLast: boolean;
  readonly questionEarlier: boolean;
  readonly outsideShare: number;
  readonly risk: number;
}

const sentencesOf = (text: string): string[] =>
  text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

const wordsOf = (sentence: string): string[] =>
  sentence.toLowerCase().match(/\p{L}+/gu) ?? [];

/** The measures of a frame, read against the lexicon. */
export function frameMetrics(text: string, lexicon: Lexicon): Metrics {
  const sentences = sentencesOf(text);
  const perSentence = sentences.map(wordsOf);
  const all = perSentence.flat();
  const outside = all.filter((w) => !lexicon.frequency.has(w)).length;
  const last = sentences[sentences.length - 1] ?? "";
  const earlier = sentences.slice(0, -1);
  return {
    sentences: sentences.length,
    words: all.length,
    meanWords: sentences.length === 0 ? 0 : all.length / sentences.length,
    longest: Math.max(0, ...perSentence.map((w) => w.length)),
    questionLast: last.endsWith("?"),
    questionEarlier: earlier.some((s) => s.includes("?")),
    outsideShare: all.length === 0 ? 0 : outside / all.length,
    risk: lexicon.riskTerms.filter((t) => all.includes(t.toLowerCase())).length,
  };
}

/**
 * The limits a frame of `k` steps breaks (REQ-0790 to REQ-0798, REQ-0701).
 * An empty result means the frame is readable.
 */
export function frameViolations(
  text: string,
  k: number,
  lexicon: Lexicon,
): string[] {
  const m = frameMetrics(text, lexicon);
  const broken: string[] = [];
  if (m.sentences > k + 1) broken.push("sentences_over_k_plus_1");
  if (m.longest > 14) broken.push("sentence_over_14_words");
  if (!m.questionLast || m.questionEarlier) broken.push("question_not_last");
  if (m.meanWords > 10) broken.push("mean_over_10");
  if (m.outsideShare > 0.1) broken.push("outside_over_10_percent");
  if (m.risk > 2) broken.push("risk_over_2");
  return broken;
}
