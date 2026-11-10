// ./meowtower claim <email> [label]: the first profile joins the account of that address
// (ADR-3320, REQ-8500). It runs in the game's container, on the Mac.
import { claimFirstProfile } from "./accounts/claim.js";
import { openAccounts } from "./accounts/store.js";

const [email, ...rest] = process.argv.slice(2);
const url = process.env["MEOWTOWER_DATABASE_URL"];
if (!email || !url) throw new Error("usage: ./meowtower claim <email> [label]");
const schema = process.env["MEOWTOWER_SCHEMA"] ?? "p_1";
const accounts = await openAccounts(url);
try {
  const done = await claimFirstProfile(
    accounts,
    email,
    rest.join(" ") || "First",
    schema,
    Date.now(),
  );
  console.log(
    `claimed ${schema} for ${email}: profile ${done.profileId}; sign in with an emailed code to see it`,
  );
} finally {
  await accounts.close();
}
