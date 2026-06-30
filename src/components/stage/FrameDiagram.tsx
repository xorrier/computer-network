import { motion } from "framer-motion";

interface FrameDiagramProps {
  dst: string;
  src: string;
  payload: string;
}

/**
 * Visualizes an Ethernet frame: the raw payload wrapped with destination and
 * source MAC addresses, a type field, and an error-check (CRC). This is how
 * bits on the wire gain both *structure* (clear start/end) and *identity*.
 */
export function FrameDiagram({ dst, src, payload }: FrameDiagramProps) {
  const fields = [
    { key: "Dst MAC", value: dst, cls: "f-dst", hint: "who it's for" },
    { key: "Src MAC", value: src, cls: "f-src", hint: "who sent it" },
    { key: "Type", value: "0x0800", cls: "f-type", hint: "what's inside" },
    { key: "Payload", value: payload, cls: "f-pay", hint: "your data" },
    { key: "CRC", value: "✓ check", cls: "f-crc", hint: "error check" },
  ];

  return (
    <div className="framecard">
      <div className="framecard-title">An Ethernet frame</div>
      <div className="framecard-row">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            className={"frame-field " + f.cls}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12 }}
          >
            <span className="ff-key">{f.key}</span>
            <span className="ff-val mono">{f.value}</span>
            <span className="ff-hint">{f.hint}</span>
          </motion.div>
        ))}
      </div>
      <p className="framecard-note">
        The data is wrapped with <strong>to</strong> and <strong>from</strong> addresses — now
        every computer knows whether a message is meant for it.
      </p>
    </div>
  );
}
