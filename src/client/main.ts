// The client shell (TSK-0100, SPC-0010): one code base, two interfaces. The
// first start picks one from the device, the settings switch it, and a hash
// route shows each registered screen.
import { device } from "./api.js";
import { focusField, installKeys } from "./controls.js";
import { openQueue } from "./event-queue.js";
import {
  applyInterface,
  detectInterface,
  type Interface,
} from "./interface.js";
import { SCREENS, type Shell } from "./screens.js";
import { loadStrings, t } from "./strings.js";
import { STYLE } from "./style.js";

/**
 * Asks the browser to keep this device's storage, so the unsent entries of the
 * queue survive pressure (SPC-0010), opens the queue's store, and registers
 * the service worker that caches code and pictures.
 */
function keepStorage(): void {
  void navigator.storage?.persist?.().catch(() => false);
  void openQueue().catch(() => undefined);
  if ("serviceWorker" in navigator)
    void navigator.serviceWorker
      .register("/sw.js", { type: "module" })
      .catch(() => undefined);
}

/**
 * The game needs its server (REQ-6510): with no reply the client says so, shows no task and no
 * pairing field, and starts again by itself when the browser reports the connection back.
 */
function showOffline(): void {
  const main = document.querySelector("main");
  if (!main) return;
  const retry = document.createElement("button");
  retry.type = "button";
  retry.dataset["action"] = "retry";
  retry.textContent = t("ui.offline.retry");
  retry.addEventListener("click", () => location.reload());
  const title = document.createElement("h1");
  title.textContent = t("ui.offline.title");
  const body = document.createElement("p");
  body.textContent = t("ui.offline.body");
  main.replaceChildren(title, body, retry);
  document.body.dataset["screen"] = "offline";
  addEventListener("online", () => location.reload(), { once: true });
}

async function boot(): Promise<void> {
  keepStorage();
  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.append(style);
  // The screen lab opens a child's screen in another language with `?lang=` (REQ-8300).
  const asked = new URLSearchParams(location.search).get("lang");
  if (asked && /^(ru|en|nl)$/.test(asked))
    document.documentElement.lang = asked;
  await loadStrings(document.documentElement.lang || "ru");

  const found = await device();
  if (found.state === "offline") {
    showOffline();
    return;
  }
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

  installKeys();
  const main = document.querySelector("main");
  if (!main) return;
  const show = (): void => {
    const path = location.hash.replace(/^#/, "") || "/";
    const screen = SCREENS.find((s) => s.path === path) ?? SCREENS[0];
    if (!screen) return;
    const shown = screen.render(shell);
    main.replaceChildren(shown);
    focusField(shown);
    document.title = t("ui.app.name");
    document.body.dataset["screen"] = screen.path;
  };
  addEventListener("hashchange", show);
  show();
}

void boot();
