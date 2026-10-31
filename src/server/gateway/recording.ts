// `verify` stores each reply under the hash of its request, and `replay` answers from those files and
// opens no connection (ADR-0100), so no automated check calls a model.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Route, RouteReply, RouteRequest, Routes } from "./routes.js";

export const RECORDINGS = "tests/recordings";

const fileOf = (dir: string, route: Route, request: RouteRequest): string =>
  join(
    dir,
    `${createHash("sha256")
      .update(JSON.stringify(route.body(request)))
      .digest("hex")}.json`,
  );

export function replayRoute(inner: Route, dir: string): Route {
  return {
    body: inner.body,
    call(request) {
      const file = fileOf(dir, inner, request);
      if (!existsSync(file)) throw new Error("recording_missing");
      return Promise.resolve(
        JSON.parse(readFileSync(file, "utf8")) as RouteReply,
      );
    },
    hasModel: () => Promise.resolve(true),
  };
}

export function recordRoute(inner: Route, dir: string): Route {
  return {
    ...inner,
    async call(request) {
      const reply = await inner.call(request);
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        fileOf(dir, inner, request),
        `${JSON.stringify(reply, null, 2)}\n`,
      );
      return reply;
    },
  };
}

const each = (routes: Routes, wrap: (r: Route) => Route): Routes => ({
  anthropic: wrap(routes.anthropic),
  openrouter: wrap(routes.openrouter),
});

export const replaying = (routes: Routes, dir = RECORDINGS): Routes =>
  each(routes, (r) => replayRoute(r, dir));

export const recording = (routes: Routes, dir = RECORDINGS): Routes =>
  each(routes, (r) => recordRoute(r, dir));
