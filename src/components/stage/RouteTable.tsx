import { motion, AnimatePresence } from "framer-motion";

interface RouteRow {
  /** Destination network, e.g. "10.0.0.0/24". */
  dest: string;
  /** Where to send packets for that network, e.g. "interface 2 (direct)". */
  via: string;
  /** Just learned/used — pulse it. */
  fresh?: boolean;
}

interface RouteTableProps {
  rows: RouteRow[];
  note?: string;
}

/**
 * A router's routing table: the map of "destination network → where to send it
 * next". A router forwards a packet by matching the *network part* of the
 * destination IP against this table — the core job that joins networks.
 */
export function RouteTable({ rows, note }: RouteTableProps) {
  return (
    <div className="routetable">
      <div className="routetable-title">Router · routing table</div>
      <div className="routetable-head">
        <span>Destination network</span>
        <span>Send via</span>
      </div>
      <div className="routetable-body">
        <AnimatePresence>
          {rows.map((r) => (
            <motion.div
              key={r.dest}
              className={"routetable-row" + (r.fresh ? " is-fresh" : "")}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <span className="rt-dest mono">{r.dest}</span>
              <span className="rt-via">{r.via}</span>
              {r.fresh && <span className="rt-tag">match</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {note && <p className="routetable-note">{note}</p>}
    </div>
  );
}
