// The event queue's store (SPC-0010, SPC-0030, REQ-6506): the one place the
// client opens IndexedDB. It holds the entries a device made and the server
// hasn't acknowledged: answers, grouping sets, `looks_set`, `glossary_opened`
// and `plan_draft`, in the order they were made. An entry is committed before
// it is sent, so every call that writes resolves only once its transaction
// has committed. How the queue sends and retries belongs to ADR-0030's task.

/** The five kinds of entry the queue holds (ADR-0030, ADR-0370 entry 45). */
export type QueueKind =
  "answer" | "grouping_set" | "looks_set" | "glossary_opened" | "plan_draft";

export interface QueueEntry {
  /** The key the server's log holds the entry under once it has it. */
  idemKey: string;
  kind: QueueKind;
  /** Position in the order the player made the entries. */
  order: number;
  /** When the entry was made, in milliseconds, so the settings can tell a stuck one. */
  queuedAt: number;
  body: unknown;
}

const DB_NAME = "meowtower-queue";
const STORE = "entries";

let opened: Promise<IDBDatabase> | undefined;

/** Opens the store once; the one database this device holds. */
export function openQueue(): Promise<IDBDatabase> {
  opened ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, {
        keyPath: "idemKey",
      });
      store.createIndex("order", "order", { unique: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return opened;
}

/** Resolves when `tx` has committed, or rejects with why it didn't. */
const committed = (tx: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

const result = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

/** Writes an entry after the last one and resolves once it has committed. */
export async function enqueue(
  kind: QueueKind,
  idemKey: string,
  body: unknown,
): Promise<QueueEntry> {
  const db = await openQueue();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  const last = await new Promise<QueueEntry | undefined>((resolve, reject) => {
    const cursor = store.index("order").openCursor(null, "prev");
    cursor.onsuccess = () =>
      resolve(cursor.result ? (cursor.result.value as QueueEntry) : undefined);
    cursor.onerror = () => reject(cursor.error);
  });
  const entry: QueueEntry = {
    idemKey,
    kind,
    order: (last?.order ?? 0) + 1,
    queuedAt: Date.now(),
    body,
  };
  store.put(entry);
  await committed(tx);
  return entry;
}

/** Every entry the server hasn't acknowledged, in the order they were made. */
export async function entries(): Promise<QueueEntry[]> {
  const db = await openQueue();
  const all = await result(
    db.transaction(STORE).objectStore(STORE).index("order").getAll(),
  );
  return all as QueueEntry[];
}

/** Removes an entry once the server has acknowledged it. */
export async function remove(idemKey: string): Promise<void> {
  const db = await openQueue();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(idemKey);
  await committed(tx);
}
