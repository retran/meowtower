// The shell's styles. ADR-0150's design system replaces them; until then
// they set the two interfaces apart and give every control a focus ring.
export const STYLE = `
:root {
  --paper: #fdf1e6;
  --ink: #3b2a33;
  --accent: #b8476a;
  --focus: #1f5fbf;
  color-scheme: light;
}
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: system-ui, sans-serif;
}
main { margin: 0 auto; padding: 16px; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
.control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent);
  border-radius: 12px;
  background: #fff;
  color: var(--ink);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}
fieldset { border: 2px solid var(--accent); border-radius: 12px; }
.choice { display: flex; align-items: center; gap: 8px; }
input { font: inherit; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }

/* The tablet interface: large touch targets in one column. */
[data-interface="tablet"] main { max-width: 640px; font-size: 22px; }
[data-interface="tablet"] .actions { flex-direction: column; }
[data-interface="tablet"] .control { min-height: 64px; padding: 0 24px; }
[data-interface="tablet"] .choice { min-height: 56px; }

/* The computer interface: a compact row, driven by keyboard or mouse. */
[data-interface="computer"] main { max-width: 880px; font-size: 17px; }
[data-interface="computer"] .control { min-height: 40px; padding: 0 16px; }
[data-interface="computer"] .choice { min-height: 32px; }
`;
