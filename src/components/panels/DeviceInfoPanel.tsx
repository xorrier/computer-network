import { motion, AnimatePresence } from "framer-motion";
import type { DeviceKind } from "@/types/network";
import { DEVICE_INFO } from "@/data/deviceInfo";
import { OSI_BY_ID } from "@/data/osiLayers";
import { DeviceGlyph } from "@/components/network/DeviceGlyphs";

interface DeviceInfoPanelProps {
  kind: DeviceKind | null;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="di-section">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

export function DeviceInfoPanel({ kind, onClose }: DeviceInfoPanelProps) {
  const info = kind ? DEVICE_INFO[kind] : null;
  const layer = info ? OSI_BY_ID[info.layer] : null;

  return (
    <AnimatePresence>
      {kind && info && layer && (
        <>
          <motion.div
            className="drawer-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="device-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label={`${info.title} details`}
          >
            <header className="di-header">
              <svg viewBox="-70 -60 140 120" className="di-glyph" aria-hidden>
                <DeviceGlyph kind={kind} active />
              </svg>
              <div>
                <h2>{info.title}</h2>
                <span className="di-layer-pill" style={{ "--layer": layer.color } as React.CSSProperties}>
                  Layer {layer.number} · {layer.name}
                </span>
              </div>
              <button className="di-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </header>

            <div className="di-body">
              <Section title="Definition">
                <p>{info.definition}</p>
              </Section>
              <Section title="Purpose">
                <p>{info.purpose}</p>
              </Section>
              <Section title="Real-world analogy">
                <p className="di-analogy">{info.analogy}</p>
              </Section>
              <Section title="Responsibilities">
                <ul>
                  {info.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Internal data structures">
                <div className="di-chips">
                  {info.dataStructures.map((d) => (
                    <span key={d} className="di-chip">
                      {d}
                    </span>
                  ))}
                </div>
              </Section>
              <Section title="Example packet">
                <pre className="di-code">{info.examplePacket.replace(/\\n/g, "\n")}</pre>
              </Section>
              <Section title="Common misconceptions">
                <ul>
                  {info.misconceptions.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Interview questions">
                <ul>
                  {info.interviewQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Try it on Linux">
                <div className="di-cmds">
                  {info.linuxCommands.map((c) => (
                    <code key={c}>{c}</code>
                  ))}
                </div>
              </Section>
              <Section title="Wireshark filters">
                <div className="di-cmds">
                  {info.wireshark.map((c) => (
                    <code key={c}>{c}</code>
                  ))}
                </div>
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
