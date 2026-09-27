import { Hono } from "hono";
import { lang, t } from "../shared/i18n.js";

const escape = (s: string): string =>
  s.replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);

// The Parent Room's listener, published on the Mac's loopback only (REQ-2510).
// ADR-0180 fills the room; ADR-0020's export routes mount here and nowhere else.
export function createParentApp(): Hono {
  const app = new Hono();
  app.get("/", (c) =>
    c.html(
      `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
        `<title>${escape(t("parent.room.title"))}</title></head>` +
        `<body><h1>${escape(t("parent.room.title"))}</h1></body></html>`,
    ),
  );
  return app;
}
