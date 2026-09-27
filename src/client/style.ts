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
.status:empty { display: none; }

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
[data-interface="tablet"] .actions { flex-direction: column; }
[data-interface="tablet"] .control,
[data-interface="tablet"] input:not([type="radio"]) { min-height: var(--touch-min); }
[data-interface="tablet"] form,
[data-interface="tablet"] form > * { align-self: stretch; }
[data-interface="tablet"] .choice { min-height: var(--touch-min); }
[data-interface="tablet"] input[type="radio"] { width: 24px; height: 24px; }

/* The computer interface: a compact row, driven by keyboard or mouse. */
[data-interface="computer"] main { max-width: 880px; padding: var(--space-7) var(--space-6); font-size: 17px; }
[data-interface="computer"] section { padding: var(--space-6) var(--space-7); }
[data-interface="computer"] .control,
[data-interface="computer"] input:not([type="radio"]) { min-height: 40px; }
[data-interface="computer"] .choice { min-height: 32px; }
`;
