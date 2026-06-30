import { motion, AnimatePresence } from "framer-motion";

interface MacTableRow {
  port: string;
  mac: string;
  /** Just learned this entry — pulse it. */
  fresh?: boolean;
}

interface MacTableProps {
  rows: MacTableRow[];
  note?: string;
}

/**
 * A switch's MAC-address table (a.k.a. CAM table): the live map of
 * "which MAC address lives on which port". The switch builds this by
 * watching the *source* address of every frame it sees. It is the single
 * idea that turns a dumb hub into a smart switch.
 */
export function MacTable({ rows, note }: MacTableProps) {
  return (
    <div className="mactable">
      <div className="mactable-title">Switch · MAC address table</div>
      <div className="mactable-head">
        <span>Port</span>
        <span>MAC address</span>
      </div>
      <div className="mactable-body">
        {rows.length === 0 ? (
          <div className="mactable-empty">empty — the switch hasn't learned anything yet</div>
        ) : (
          <AnimatePresence>
            {rows.map((r) => (
              <motion.div
                key={r.port + r.mac}
                className={"mactable-row" + (r.fresh ? " is-fresh" : "")}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <span className="mt-port">{r.port}</span>
                <span className="mt-mac mono">{r.mac}</span>
                {r.fresh && <span className="mt-tag">just learned</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      {note && <p className="mactable-note">{note}</p>}
    </div>
  );
}
