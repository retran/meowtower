// ./meowtower restore runs this in the stopped server's container: the live
// database becomes the newest snapshot.
import { restoreNewest } from "./snapshots.js";

const snapshots = process.env["MEOWTOWER_SNAPSHOTS"] ?? "/data/snapshots";
const live =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
console.log(`restored ${restoreNewest(snapshots, live)}`);
