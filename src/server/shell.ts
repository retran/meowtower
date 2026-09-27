import type { Hono } from "hono";
import { lang, t } from "../shared/i18n.js";
import { iconPng } from "./icon.js";

const escape = (s: string): string =>
  s.replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);

// The client shell the iPad installs as a home-screen app (REQ-2500).
// ADR-0150's screens replace the body; the head is what installing needs.
function page(): string {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escape(t("ui.app.name"))}</title>
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icon-512.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="${escape(t("ui.app.shortName"))}">
</head>
<body>
<main>${escape(t("ui.app.starting"))}</main>
</body>
</html>
`;
}

export function mountShell(app: Hono): void {
  const icon = iconPng(512);
  app.get("/", (c) => c.html(page()));
  app.get("/manifest.webmanifest", (c) =>
    c.body(
      JSON.stringify({
        name: t("ui.app.name"),
        short_name: t("ui.app.shortName"),
        lang,
        start_url: "/",
        display: "standalone",
        background_color: "#fdf1e6",
        theme_color: "#f6c6cf",
        icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
      }),
      200,
      { "content-type": "application/manifest+json; charset=utf-8" },
    ),
  );
  app.get("/icon-512.png", (c) =>
    c.body(new Uint8Array(icon), 200, { "content-type": "image/png" }),
  );
}
