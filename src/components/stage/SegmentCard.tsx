import { motion } from "framer-motion";

interface SegmentCardProps {
  seq: string;
  ack?: string;
  /** Which control flags are set, e.g. ["SYN"], ["SYN","ACK"], ["ACK"]. */
  flags: string[];
  payload?: string;
  note?: string;
}

const ALL_FLAGS = ["SYN", "ACK", "FIN"];

/**
 * Visualizes a TCP segment: the sequence/acknowledgement numbers and control
 * flags that turn best-effort IP packets into a reliable, ordered conversation.
 * Highlighting the set flags across beats makes the SYN → SYN-ACK → ACK
 * handshake concrete.
 */
export function SegmentCard({ seq, ack, flags, payload, note }: SegmentCardProps) {
  const fields = [
    { key: "Seq #", value: seq, cls: "s-seq", hint: "my byte counter" },
    { key: "Ack #", value: ack ?? "—", cls: "s-ack", hint: "next I expect" },
    { key: "Data", value: payload ?? "(none yet)", cls: "s-data", hint: "your bytes" },
  ];

  return (
    <div className="segmentcard">
      <div className="segmentcard-title">A TCP segment</div>
      <div className="segment-flags">
        {ALL_FLAGS.map((f) => {
          const on = flags.includes(f);
          return (
            <motion.span
              key={f}
              className={"seg-flag" + (on ? " is-on" : "")}
              initial={false}
              animate={{ scale: on ? 1 : 0.92, opacity: on ? 1 : 0.35 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {f}
            </motion.span>
          );
        })}
      </div>
      <div className="segmentcard-row">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            className={"segment-field " + f.cls}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="sf-key">{f.key}</span>
            <span className="sf-val mono">{f.value}</span>
            <span className="sf-hint">{f.hint}</span>
          </motion.div>
        ))}
      </div>
      {note && <p className="segmentcard-note">{note}</p>}
    </div>
  );
}
