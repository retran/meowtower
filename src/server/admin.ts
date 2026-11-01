// The Parent Room as an admin page (ADR-3100): figures first, then the two audits. It is drawn on the
// server, because this listener answers on the Mac's loopback only and carries no client bundle.
import { lang, t } from "../shared/i18n.js";
import {
  dashboard,
  llmAudit,
  playAudit,
  type LlmRow,
  type PlayRow,
} from "./audit.js";
import type { Db } from "./database.js";

const ROWS = 200;

const STYLE = `
:root { --paper: #fdf1e6; --card: #fffaf6; --ink: #3b2a33; --accent: #b8476a; --line: #e7d6ca; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --paper: #231a1f; --card: #2e2329; --ink: #f4e8e0; --accent: #e88aa8; --line: #4a3a42; color-scheme: dark; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: system-ui, sans-serif; line-height: 1.4; }
main { max-width: 1200px; margin: 0 auto; padding: 16px; }
nav { display: flex; flex-wrap: wrap; gap: 16px; }
nav a { color: var(--accent); }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; padding: 0; list-style: none; }
.card { padding: 12px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--card); }
.card b { display: block; font-size: 1.6em; font-variant-numeric: tabular-nums; }
.scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; background: var(--card); }
th, td { padding: 8px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
pre { max-width: 70ch; white-space: pre-wrap; overflow-wrap: anywhere; }
`;

const escape = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const card = (label: string, value: string): string =>
  `<li class="card"><b>${escape(value)}</b>${escape(label)}</li>`;

const table = (heads: readonly string[], rows: readonly string[]): string =>
  `<div class="scroll"><table><thead><tr>${heads
    .map((h) => `<th scope="col">${escape(h)}</th>`)
    .join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;

const cell = (value: string | number | null): string =>
  `<td>${escape(String(value ?? ""))}</td>`;

const llmRow = (r: LlmRow): string =>
  `<tr>${[
    r.at,
    r.role,
    `${r.route}:${r.model}`,
    r.outcome,
    r.input_tokens,
    r.output_tokens,
    r.cost_usd.toFixed(5),
    r.latency_ms,
  ]
    .map(cell)
    .join("")}<td><details><summary>${escape(
    t("parent.admin.open"),
  )}</summary><pre>${escape(r.request)}</pre><pre>${escape(
    r.response,
  )}</pre></details></td></tr>`;

const playRow = (r: PlayRow): string =>
  `<tr>${[
    r.at,
    r.templateId,
    r.source,
    r.text,
    r.answer,
    r.correctAnswer,
    r.verdict,
    r.hints,
  ]
    .map(cell)
    .join("")}</tr>`;

/** The admin page, with the parent's notices above the figures. */
export function adminPage(
  db: Db,
  now: Date,
  notices: readonly string[],
): string {
  const d = dashboard(db, now);
  const share =
    d.answered === 0 ? 0 : Math.round((d.correct / d.answered) * 100);
  const frameRows = d.frames.map(
    (f) => `<tr>${[f.status, f.step, f.count].map(cell).join("")}</tr>`,
  );
  return (
    `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${escape(t("parent.room.title"))}</title><style>${STYLE}</style></head><body><main>` +
    `<h1>${escape(t("parent.room.title"))}</h1>` +
    notices.map((l) => `<p role="alert">${escape(l)}</p>`).join("") +
    `<nav><a href="#play">${escape(t("parent.admin.playAudit"))}</a>` +
    `<a href="#llm">${escape(t("parent.admin.llmAudit"))}</a></nav>` +
    `<ul class="cards">` +
    card(t("parent.admin.tasks"), String(d.tasks)) +
    card(t("parent.admin.correct"), `${share.toString()}%`) +
    card(t("parent.admin.live"), String(d.live)) +
    card(t("parent.admin.calls"), String(d.calls)) +
    card(t("parent.admin.failed"), String(d.failed)) +
    card(t("parent.admin.month"), `$${d.monthUsd.toFixed(2)}`) +
    `</ul>` +
    `<h2>${escape(t("parent.admin.frames"))}</h2>` +
    table(
      [
        t("parent.admin.status"),
        t("parent.admin.step"),
        t("parent.admin.count"),
      ],
      frameRows,
    ) +
    `<h2 id="play">${escape(t("parent.admin.playAudit"))}</h2>` +
    table(
      [
        t("parent.admin.at"),
        t("parent.admin.template"),
        t("parent.admin.source"),
        t("parent.admin.text"),
        t("parent.admin.answer"),
        t("parent.admin.right"),
        t("parent.admin.verdict"),
        t("parent.admin.hints"),
      ],
      playAudit(db, ROWS).map(playRow),
    ) +
    `<h2 id="llm">${escape(t("parent.admin.llmAudit"))}</h2>` +
    table(
      [
        t("parent.admin.at"),
        t("parent.admin.role"),
        t("parent.admin.model"),
        t("parent.admin.outcome"),
        t("parent.admin.tokensIn"),
        t("parent.admin.tokensOut"),
        t("parent.admin.cost"),
        t("parent.admin.latency"),
        t("parent.admin.body"),
      ],
      llmAudit(db, ROWS).map(llmRow),
    ) +
    `</main></body></html>`
  );
}
