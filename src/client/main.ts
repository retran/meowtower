// The client shell (TSK-0100, SPC-0010): one code base, two interfaces. The
// first start picks one from the device, the settings switch it, and a hash
// route shows each registered screen.
import { device } from "./api.js";
import {
  applyInterface,
  detectInterface,
  type Interface,
} from "./interface.js";
import { SCREENS, type Shell } from "./screens.js";
import { loadStrings, t } from "./strings.js";
import { STYLE } from "./style.js";

async function boot(): Promise<void> {
  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.append(style);
  await loadStrings(document.documentElement.lang || "ru");

  const found = await device();
  const shell: Shell = {
    paired: found.state === "paired",
    revoked: found.state === "revoked",
    // An unpaired device's switch lives in memory only: the browser's storage
    // holds no game data (SPC-0010, REQ-2542), and pairing sends the choice.
    current: found.state === "paired" ? found.kind : detectInterface(),
    setPaired(value) {
      shell.paired = value;
      if (value) shell.revoked = false;
    },
    setRevoked(value) {
      shell.revoked = value;
      if (value) shell.paired = false;
    },
    setInterface(chosen: Interface) {
      shell.current = chosen;
    },
  };
  applyInterface(shell.current);
  // The keyboard test reads the registered routes from here.
  document.documentElement.dataset["routes"] = JSON.stringify(
    SCREENS.map((s) => s.path),
  );

  const main = document.querySelector("main");
  if (!main) return;
  const show = (): void => {
    const path = location.hash.replace(/^#/, "") || "/";
    const screen = SCREENS.find((s) => s.path === path) ?? SCREENS[0];
    if (!screen) return;
    main.replaceChildren(screen.render(shell));
    document.title = t("ui.app.name");
    document.body.dataset["screen"] = screen.path;
  };
  addEventListener("hashchange", show);
  show();
}

void boot();
