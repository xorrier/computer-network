import { motion } from "framer-motion";

interface StackCardProps {
  view: "layers" | "wrap" | "unwrap";
  active?: string[];
  note?: string;
}

/**
 * The capstone visual: every idea in the course placed onto one layered model —
 * the TCP/IP stack — plus an encapsulation ("wrap") / decapsulation ("unwrap")
 * animation of a message travelling down and back up the stack.
 */

interface Layer {
  id: string;
  tcp: string;
  story: string;
  pdu: string;
  color: string;
}

// Top of the stack (Application) first, bottom (Physical) last.
const LAYERS: Layer[] = [
  {
    id: "app",
    tcp: "Application",
    story: "HTTP “GET /”, DNS names, the TLS lock",
    pdu: "Data",
    color: "var(--accent)",
  },
  {
    id: "transport",
    tcp: "Transport",
    story: "TCP: ports, seq/ack, the handshake",
    pdu: "Segment",
    color: "var(--accent-2)",
  },
  {
    id: "internet",
    tcp: "Internet",
    story: "IP addresses, routers, the default route",
    pdu: "Packet",
    color: "var(--accent-3)",
  },
  {
    id: "link",
    tcp: "Link",
    story: "Ethernet frame, MAC addresses, the switch",
    pdu: "Frame",
    color: "var(--accent-4)",
  },
  {
    id: "physical",
    tcp: "Physical",
    story: "High/low voltage — the bits on the wire",
    pdu: "Bits",
    color: "var(--text-2)",
  },
];

// The four nesting headers, outermost (Link) to innermost (Application).
const NEST = [
  { id: "link", label: "Ethernet frame", sub: "src/dst MAC", color: "var(--accent-4)" },
  { id: "internet", label: "IP packet", sub: "src/dst IP", color: "var(--accent-3)" },
  { id: "transport", label: "TCP segment", sub: "ports · seq/ack", color: "var(--accent-2)" },
];

function LayersView({ active }: { active: Set<string> }) {
  return (
    <div className="stack-layers">
      {LAYERS.map((l, i) => {
        const on = active.size === 0 || active.has(l.id);
        return (
          <motion.div
            key={l.id}
            className={"stack-row" + (on ? " is-on" : " is-off")}
            style={{ borderLeftColor: l.color }}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: on ? 1 : 0.32, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="stack-cell stack-tcp" style={{ color: l.color }}>
              {l.tcp}
            </div>
            <div className="stack-cell stack-story">{l.story}</div>
            <div className="stack-cell stack-pdu" style={{ color: l.color }}>
              {l.pdu}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function NestView({ active, unwrap }: { active: Set<string>; unwrap: boolean }) {
  // Build from innermost outward so the JSX nests correctly.
  let content = (
    <motion.div
      className={"nest-core" + (active.has("app") ? " is-on" : "")}
      style={{ borderColor: "var(--accent)" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 }}
    >
      <span className="nest-tag" style={{ color: "var(--accent)" }}>
        HTTP data
      </span>
      <span className="nest-payload mono">GET /</span>
    </motion.div>
  );

  // Wrap transport, internet, link (innermost of NEST is last item).
  [...NEST].reverse().forEach((layer, idx) => {
    const on = active.has(layer.id);
    const prev = content;
    content = (
      <motion.div
        key={layer.id}
        className={"nest-box" + (on ? " is-on" : "")}
        style={{ borderColor: layer.color }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12 + idx * 0.1 }}
      >
        <span className="nest-tag" style={{ color: layer.color }}>
          + {layer.label} <span className="nest-sub">({layer.sub})</span>
        </span>
        {prev}
      </motion.div>
    );
  });

  return (
    <div className="stack-nest">
      <div className={"nest-flow" + (unwrap ? " is-up" : "")}>
        {unwrap ? "▲ decapsulating — each layer reads and strips its own header" : "▼ encapsulating — each layer adds its own header"}
      </div>
      {content}
      <div className="nest-wire">
        {active.has("physical") ? "⟶ on the wire as bits (Physical)" : "⟶ then sent as bits"}
      </div>
    </div>
  );
}

export function StackCard({ view, active, note }: StackCardProps) {
  const set = new Set(active ?? []);
  return (
    <div className="stackcard">
      <div className="stackcard-title">The network stack</div>
      {view === "layers" ? (
        <>
          <div className="stack-head">
            <span className="stack-head-tcp">TCP/IP layer</span>
            <span className="stack-head-story">what you built</span>
            <span className="stack-head-pdu">unit</span>
          </div>
          <LayersView active={set} />
        </>
      ) : (
        <NestView active={set} unwrap={view === "unwrap"} />
      )}
      {note && <p className="stackcard-note">{note}</p>}
    </div>
  );
}
