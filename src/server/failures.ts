/**
 * Raises a named failure state (SPC-0010, SPC-0020). Until TSK-0080 gives the
 * parent notices, the state goes to the server's log, where
 * `docker compose logs` shows it.
 */
export function raise(state: string, detail: string): void {
  console.error(`${state}: ${detail}`);
}
