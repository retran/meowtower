// What the account code sends mail through (ADR-3320). The `log` mailer writes the message to the
// server's output, so the game works at home with no mail account; a mailer that sends through a
// provider joins it when the owner chooses one.
export interface Mailer {
  send(to: string, subject: string, text: string): Promise<void>;
}

/** Writes the mail where `docker compose logs meowtower` shows it. */
export function logMailer(
  write: (line: string) => void = (line) => {
    console.log(line);
  },
): Mailer {
  return {
    send: (to, subject, text) => {
      write(`mail to ${to}: ${subject}\n${text}`);
      return Promise.resolve();
    },
  };
}
