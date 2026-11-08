// ./meowtower restore runs this in the stopped server's container: the live database becomes the
// newest snapshot, for a Postgres profile or for a SQLite file.
import { restoreNewestProfile } from "./pg-backup.js";
import { restoreNewest } from "./snapshots.js";

const snapshots = process.env["MEOWTOWER_SNAPSHOTS"] ?? "/data/snapshots";
const url = process.env["MEOWTOWER_DATABASE_URL"];
if (url) {
  const schema = process.env["MEOWTOWER_SCHEMA"] ?? "p_1";
  console.log(`restored ${await restoreNewestProfile(url, schema, snapshots)}`);
} else {
  const live =
    process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
  console.log(`restored ${restoreNewest(snapshots, live)}`);
}
