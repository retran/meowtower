// The parent's notices as lines (SPC-0010): a failed backup until the next good one, the storage
// ceiling once data/ passes it, and the recompute's and the log's failures. The overview of the
// Parent Room shows them (ADR-3470).
import { t } from "../shared/i18n.js";
import { readNotices } from "./backups.js";

export function noticeLines(dir: string | null): string[] {
  if (!dir) return [];
  const notices = readNotices(dir);
  return [
    notices.backup_failed
      ? t("parent.notice.backupFailed", { at: notices.backup_failed.at })
      : null,
    notices.storage_ceiling
      ? t("parent.notice.storageCeiling", {
          gb: String(notices.storage_ceiling.gb),
        })
      : null,
    notices.recompute_failed
      ? t("parent.notice.recomputeFailed", {
          at: notices.recompute_failed.at,
          version: notices.recompute_failed.version,
        })
      : null,
    notices.recompute_slow
      ? t("parent.notice.recomputeSlow", {
          seconds: String(Math.round(notices.recompute_slow.ms / 1000)),
        })
      : null,
    notices.log_large ? t("parent.notice.logLarge") : null,
    notices.log_write_failed
      ? t("parent.notice.logWriteFailed", {
          at: notices.log_write_failed.at,
        })
      : null,
  ].filter((l): l is string => l !== null);
}
