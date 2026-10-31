// The shell's styles. ADR-0150's design system replaces them; until then
// they set the two interfaces apart and give every control a focus ring.
export const STYLE = `
/* The spacing scale and radii copy design/design-system/tokens.css, which
   the image doesn't carry; ADR-0150 loads the tokens themselves. */
:root {
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --radius-sm: 12px;
  --radius-lg: 26px;
  --touch-min: 56px;
  --paper: #fdf1e6;
  --card: #fffaf6;
  --ink: #3b2a33;
  --accent: #b8476a;
  --focus: #1f5fbf;
  color-scheme: light;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: system-ui, sans-serif;
  line-height: 1.4;
}
main { margin: 0 auto; }
h1 { font-size: 1.6em; line-height: 1.2; }
.frac { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; line-height: 1.15; margin: 0 0.15em; }
.frac > span { padding: 0 0.2em; }
.frac > span:first-child { border-bottom: 2px solid currentColor; }
.badge { font-size: 1.6em; font-weight: 700; line-height: 1.2; }
.battle { opacity: 0.75; }
.task { font-size: 1.1em; }
/* Things that belong together sit closer than the blocks of a screen. */
.entry, .result, .hints { display: flex; flex-direction: column; gap: var(--space-2); }
.hints:empty, .preview:empty, .picked:empty, .format:empty { display: none; }
.hint { padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); background: var(--paper); }
.note { padding: var(--space-3) var(--space-4); border-left: 4px solid var(--accent); border-radius: var(--space-2); background: var(--paper); }
.solution { margin: 0; padding-left: 1.4em; display: flex; flex-direction: column; gap: var(--space-2); }
.heading { font-weight: 600; }
.options { display: flex; flex-wrap: wrap; gap: var(--space-3); }
.option { font-size: 1.15em; min-width: var(--touch-min); min-height: var(--touch-min); }
.option[aria-pressed="true"] { background: var(--accent); color: var(--card); }
.option:disabled { opacity: 0.4; }
.format { font-size: 0.85em; opacity: 0.8; }
.preview, .picked { font-size: 1.2em; }
.right { font-weight: 600; }
.picture { margin: 0; text-align: center; }
.picture svg { display: block; margin: 0 auto; max-width: 100%; max-height: 40vh; height: auto; }
h1, p, fieldset, form { margin: 0; }

/* One card a screen, its blocks one gap apart. */
section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--card);
  border: 2px solid var(--accent);
  border-radius: var(--radius-lg);
}
.actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.control[data-action="play-submit"], .control[data-action="play-next"] { background: var(--accent); color: #fff; font-weight: 600; }
.status:empty, .code:empty { display: none; }
.devices { display: flex; flex-direction: column; gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
.devices li { min-height: var(--touch-min); display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-3); }
.devices li > span:first-child { flex: 1; }
.tag { padding: 0 var(--space-2); border-radius: var(--radius-sm); background: var(--paper); }
.code { font-size: 1.4em; font-weight: 700; }

.control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-5);
  border: 2px solid var(--accent);
  border-radius: var(--radius-sm);
  background: #fff;
  color: var(--ink);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5) var(--space-4);
  border: 2px solid var(--accent);
  border-radius: var(--radius-sm);
}
legend { padding: 0 var(--space-2); }
.choice { display: flex; align-items: center; gap: var(--space-3); }

form { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-3); }
input:not([type="radio"]) {
  max-width: 100%;
  padding: 0 var(--space-4);
  border: 2px solid var(--accent);
  border-radius: var(--radius-sm);
  background: #fff;
  font: inherit;
}
:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }

/* The tablet interface: large touch targets in one column. */
[data-interface="tablet"] main { max-width: 720px; padding: var(--space-7) var(--space-6); font-size: 22px; }
[data-interface="tablet"] section { padding: var(--space-6); }
[data-interface="tablet"] .option { flex: 1 1 auto; min-height: 64px; }
[data-interface="tablet"] .control,
[data-interface="tablet"] input:not([type="radio"]) { min-height: var(--touch-min); }
[data-interface="tablet"] form,
[data-interface="tablet"] form > * { align-self: stretch; }
[data-interface="tablet"] .choice { min-height: var(--touch-min); }
[data-interface="tablet"] input[type="radio"] { width: 24px; height: 24px; }

/* Upright, one column with the buttons in a grid of two, and the main action on its own row. */
@media (orientation: portrait) {
  [data-interface="tablet"] main { padding: var(--space-6) var(--space-5); max-width: none; }
  [data-interface="tablet"] .actions { display: grid; grid-template-columns: 1fr 1fr; }
  [data-interface="tablet"] .actions > :first-child:not(:last-child):nth-last-child(odd) { grid-column: 1 / -1; }
  [data-interface="tablet"] .picture svg { max-height: 34vh; }
}

/* On its side the page is short: the picture stands left of the task, and the buttons share one row. */
@media (orientation: landscape) {
  [data-interface="tablet"] main { padding: var(--space-5) var(--space-6); max-width: 1180px; }
  [data-interface="tablet"] section { padding: var(--space-5) var(--space-6); gap: var(--space-4); }
  [data-interface="tablet"] .actions { flex-direction: row; }
  [data-interface="tablet"] .actions > * { flex: 1 1 0; white-space: nowrap; }
  [data-interface="tablet"] .picture svg { max-height: 62vh; }
  [data-interface="tablet"] section:has(> .picture),
  [data-interface="tablet"] section:has(.solution) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: var(--space-6);
    align-content: start;
  }
  [data-interface="tablet"] section:has(> .picture) > *,
  [data-interface="tablet"] section:has(.solution) > * { grid-column: 2; }
  [data-interface="tablet"] section:has(> .picture) > h1,
  [data-interface="tablet"] section:has(.solution) > h1,
  [data-interface="tablet"] section > .actions { grid-column: 1 / -1; }
  [data-interface="tablet"] section > .picture { grid-column: 1; grid-row: 2 / span 6; align-self: center; }
  [data-interface="tablet"] section:has(.solution) > * { grid-column: 1; }
  [data-interface="tablet"] section:has(.solution) > h1,
  [data-interface="tablet"] section:has(.solution) > .actions { grid-column: 1 / -1; }
  [data-interface="tablet"] section > .result:has(.solution) { grid-column: 2; grid-row: 2 / span 4; }
}

/* The computer interface: a compact row, driven by keyboard or mouse. */
[data-interface="computer"] main { max-width: 1100px; padding: var(--space-7) var(--space-6); font-size: 21px; }
[data-interface="computer"] [data-action="play-leave"] { margin-left: auto; }
[data-interface="computer"] section { padding: var(--space-7); }
[data-interface="computer"] .control,
[data-interface="computer"] input:not([type="radio"]) { min-height: 50px; }
[data-interface="computer"] .choice { min-height: 40px; }
`;
