import { motion, AnimatePresence } from "framer-motion";
import type { LessonStep } from "@/types/network";
import { OSI_BY_ID } from "@/data/osiLayers";

interface PacketInspectorProps {
  step: LessonStep;
}

/**
 * Shows the live packet as nested encapsulation: outermost headers wrap the
 * inner payload, mirroring how each layer adds its own header.
 */
export function PacketInspector({ step }: PacketInspectorProps) {
  const packet = step.packet;

  return (
    <div className="inspector">
      <div className="panel-heading">
        <h3>Packet Inspector</h3>
        <span className="panel-sub">Live encapsulation</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {!packet ? (
            <p className="inspector-empty">No packet in flight during this step.</p>
          ) : (
            <div className="encap">
              {(packet.headers ?? []).map((h) => {
                const layer = OSI_BY_ID[h.layer];
                return (
                  <div
                    key={h.name}
                    className="encap-header"
                    style={{ "--layer": layer.color } as React.CSSProperties}
                  >
                    <div className="encap-header-top">
                      <span className="encap-name">{h.name}</span>
                      <span className="encap-layer mono">L{layer.number}</span>
                    </div>
                    <div className="encap-fields">
                      {h.fields.map((f) => (
                        <div className="encap-field" key={f.key}>
                          <span className="ef-key mono">{f.key}</span>
                          <span className="ef-val mono">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {packet.payload && (
                <div className="encap-payload">
                  <span className="encap-name">Payload</span>
                  <code>{packet.payload}</code>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
