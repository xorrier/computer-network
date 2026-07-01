import { motion, AnimatePresence } from "framer-motion";

interface DnsRow {
  /** The name that was looked up, e.g. "google.com". */
  name: string;
  /** The IP that name resolved to. */
  ip: string;
  /** Time-to-live before the entry expires, e.g. "300s". */
  ttl?: string;
  /** Just added — pulse it. */
  fresh?: boolean;
}

interface DnsCacheProps {
  rows: DnsRow[];
  note?: string;
}

/**
 * The resolver's DNS cache: names it has already looked up, mapped to the IP it
 * found, kept for a limited time (TTL). A cache hit skips the whole root → TLD →
 * authoritative walk — which is why DNS feels instant most of the time.
 */
export function DnsCache({ rows, note }: DnsCacheProps) {
  return (
    <div className="dnscache">
      <div className="dnscache-title">Resolver · DNS cache</div>
      {rows.length === 0 ? (
        <div className="dnscache-empty">empty — nothing looked up yet</div>
      ) : (
        <>
          <div className="dnscache-head">
            <span>Name</span>
            <span>IP address</span>
            <span>TTL</span>
          </div>
          <div className="dnscache-body">
            <AnimatePresence>
              {rows.map((r) => (
                <motion.div
                  key={r.name}
                  className={"dnscache-row" + (r.fresh ? " is-fresh" : "")}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <span className="dc-name mono">{r.name}</span>
                  <span className="dc-ip mono">{r.ip}</span>
                  <span className="dc-ttl">{r.ttl ?? "—"}</span>
                  {r.fresh && <span className="dc-tag">cached</span>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
      {note && <p className="dnscache-note">{note}</p>}
    </div>
  );
}
