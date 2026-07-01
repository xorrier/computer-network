import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StageModel } from "@/types/journey";
import { DeviceGlyph } from "@/components/network/DeviceGlyphs";
import { BinaryEncoder } from "./BinaryEncoder";
import { MacCard } from "./MacCard";
import { FrameDiagram } from "./FrameDiagram";
import { MacTable } from "./MacTable";
import { IpCard } from "./IpCard";
import { RouteTable } from "./RouteTable";
import { NameCard } from "./NameCard";
import { DnsCache } from "./DnsCache";
import { SegmentCard } from "./SegmentCard";

const VIEW_W = 1000;
const VIEW_H = 600;

interface StageProps {
  model: StageModel;
  onSelectNode?: (id: string) => void;
}

function px(x: number) {
  return (x / 100) * VIEW_W;
}
function py(y: number) {
  return (y / 100) * VIEW_H;
}

export function Stage({ model, onSelectNode }: StageProps) {
  const centers = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    model.nodes.forEach((n) => map.set(n.id, { x: px(n.x), y: py(n.y) }));
    return map;
  }, [model.nodes]);

  const linkById = useMemo(() => {
    const map = new Map<string, { from: string; to: string }>();
    (model.links ?? []).forEach((l) => map.set(l.id, { from: l.from, to: l.to }));
    return map;
  }, [model.links]);

  return (
    <div className={"stage" + (model.nodes.length > 0 && model.inset ? " is-stacked" : "")}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="stage-svg" role="img" aria-label="Network scene">
        <defs>
          <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width={VIEW_W} height={VIEW_H} fill="url(#dots)" />

        {/* Links */}
        <g>
          <AnimatePresence>
            {(model.links ?? []).map((link) => {
              const a = centers.get(link.from);
              const b = centers.get(link.to);
              if (!a || !b) return null;
              return (
                <motion.g key={link.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={link.active ? "var(--accent)" : "rgba(255,255,255,0.22)"}
                    strokeWidth={link.active ? 4 : 3}
                    strokeLinecap="round"
                    strokeDasharray={link.dashed ? "8 9" : undefined}
                    opacity={link.active ? 0.6 : 1}
                  />
                  {link.label && (
                    <text
                      x={(a.x + b.x) / 2}
                      y={(a.y + b.y) / 2 - 12}
                      textAnchor="middle"
                      fontFamily="var(--font-sans)"
                      fontSize={15}
                      fill="var(--text-2)"
                    >
                      {link.label}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>

        {/* Signals (bits flowing along a link) */}
        <g>
          {(model.signals ?? []).map((sig) => {
            const link = linkById.get(sig.linkId);
            if (!link) return null;
            const startId = sig.from;
            const endId = link.from === sig.from ? link.to : link.from;
            const a = centers.get(startId);
            const b = centers.get(endId);
            if (!a || !b) return null;
            const color = sig.color ?? "var(--accent)";
            return [0, 0.45, 0.9].map((delay, i) => (
              <motion.g
                key={sig.id + i}
                initial={{ x: a.x, y: a.y, opacity: 0 }}
                animate={{ x: [a.x, b.x], y: [a.y, b.y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "linear", delay, times: [0, 0.1, 0.9, 1] }}
              >
                <circle r={8} fill={color} />
                {sig.label && i === 0 && (
                  <text x={0} y={-14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fill={color}>
                    {sig.label}
                  </text>
                )}
              </motion.g>
            ));
          })}
        </g>

        {/* Nodes */}
        <g>
          <AnimatePresence>
            {model.nodes.map((node) => {
              const c = centers.get(node.id)!;
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: node.dim ? 0.4 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ cursor: onSelectNode ? "pointer" : "default" }}
                  onClick={() => onSelectNode?.(node.id)}
                >
                  <g transform={`translate(${c.x} ${c.y})`}>
                    {node.highlight && (
                      <circle r={64} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={0.5}>
                        <animate attributeName="r" values="54;72;54" dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <motion.g
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    >
                      <DeviceGlyph kind={node.kind} active={node.highlight} />
                    </motion.g>
                    {node.label && (
                      <text
                        y={72}
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                        fontSize={17}
                        fontWeight={600}
                        fill={node.dim ? "var(--text-3)" : "var(--text-0)"}
                      >
                        {node.label}
                      </text>
                    )}
                    {node.badge && (
                      <text
                        y={92}
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize={13}
                        fill="var(--accent)"
                      >
                        {node.badge}
                      </text>
                    )}
                  </g>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>
      </svg>

      {model.inset && (
        <div className="stage-inset">
          {model.inset === "binary" && <BinaryEncoder text={model.insetText ?? "hi"} />}
          {model.inset === "mac" && <MacCard mac={model.insetMac ?? "00:1A:2B:3C:4D:5E"} />}
          {model.inset === "frame" && (
            <FrameDiagram
              dst={model.insetFrame?.dst ?? "…"}
              src={model.insetFrame?.src ?? "…"}
              payload={model.insetFrame?.payload ?? "hi"}
            />
          )}
          {model.inset === "mactable" && (
            <MacTable rows={model.insetMacTable?.rows ?? []} note={model.insetMacTable?.note} />
          )}
          {model.inset === "ip" && (
            <IpCard ip={model.insetIp?.ip ?? "192.168.1.10"} prefix={model.insetIp?.prefix ?? 24} />
          )}
          {model.inset === "routetable" && (
            <RouteTable rows={model.insetRouteTable?.rows ?? []} note={model.insetRouteTable?.note} />
          )}
          {model.inset === "hostname" && (
            <NameCard name={model.insetHostname?.name ?? "www.google.com"} />
          )}
          {model.inset === "dnscache" && (
            <DnsCache rows={model.insetDnsCache?.rows ?? []} note={model.insetDnsCache?.note} />
          )}
          {model.inset === "segment" && (
            <SegmentCard
              seq={model.insetSegment?.seq ?? "seq=0"}
              ack={model.insetSegment?.ack}
              flags={model.insetSegment?.flags ?? []}
              payload={model.insetSegment?.payload}
              note={model.insetSegment?.note}
            />
          )}
        </div>
      )}

      {model.caption && <div className="stage-caption">{model.caption}</div>}
    </div>
  );
}
