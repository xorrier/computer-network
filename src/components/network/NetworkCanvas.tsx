import { useMemo } from "react";
import { motion } from "framer-motion";
import type { CableLink, DeviceNode, LessonStep } from "@/types/network";
import { DeviceGlyph } from "./DeviceGlyphs";
import { layerColor } from "@/data/osiLayers";

const VIEW_W = 1000;
const VIEW_H = 560;

interface Point {
  x: number;
  y: number;
}

function toCanvas(d: DeviceNode): Point {
  return { x: (d.x / 100) * VIEW_W, y: (d.y / 100) * VIEW_H };
}

/** Position along a multi-point polyline at parameter t in [0,1]. */
function pointAlongPath(points: Point[], t: number): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0]!;
  const segLengths: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segLengths.push(len);
    total += len;
  }
  const target = t * total;
  let acc = 0;
  for (let i = 0; i < segLengths.length; i++) {
    const len = segLengths[i]!;
    if (acc + len >= target || i === segLengths.length - 1) {
      const localT = len === 0 ? 0 : (target - acc) / len;
      const a = points[i]!;
      const b = points[i + 1]!;
      return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
    }
    acc += len;
  }
  return points[points.length - 1]!;
}

interface NetworkCanvasProps {
  devices: DeviceNode[];
  links: CableLink[];
  step: LessonStep;
  progress: number;
  onSelectDevice: (id: string) => void;
  selectedDeviceId?: string;
}

export function NetworkCanvas({
  devices,
  links,
  step,
  progress,
  onSelectDevice,
  selectedDeviceId,
}: NetworkCanvasProps) {
  const byId = useMemo(() => {
    const map = new Map<string, DeviceNode>();
    devices.forEach((d) => map.set(d.id, d));
    return map;
  }, [devices]);

  const packetColor = step.packet?.color ?? layerColor(step.layer);

  // Compute the device points the packet travels through this step.
  const pathPoints = useMemo<Point[]>(() => {
    if (!step.packet) return [];
    return step.packet.path
      .map((id) => byId.get(id))
      .filter((d): d is DeviceNode => Boolean(d))
      .map(toCanvas);
  }, [step.packet, byId]);

  const activeLinkIds = useMemo(() => {
    if (!step.packet) return new Set<string>();
    const ids = new Set<string>();
    const path = step.packet.path;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const link = links.find(
        (l) => (l.from === a && l.to === b) || (l.from === b && l.to === a),
      );
      if (link) ids.add(link.id);
    }
    return ids;
  }, [step.packet, links]);

  const packetPos = pathPoints.length ? pointAlongPath(pathPoints, progress) : null;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="network-canvas"
      role="img"
      aria-label="Interactive network diagram"
    >
      <defs>
        <radialGradient id="packet-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={packetColor} stopOpacity={0.9} />
          <stop offset="100%" stopColor={packetColor} stopOpacity={0} />
        </radialGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />

      {/* Cables */}
      <g>
        {links.map((link) => {
          const a = byId.get(link.from);
          const b = byId.get(link.to);
          if (!a || !b) return null;
          const pa = toCanvas(a);
          const pb = toCanvas(b);
          const active = activeLinkIds.has(link.id);
          return (
            <g key={link.id}>
              <line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={active ? packetColor : "rgba(255,255,255,0.14)"}
                strokeWidth={active ? 4 : 2.5}
                strokeLinecap="round"
                opacity={active ? 0.55 : 1}
              />
              {active && (
                <line
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={packetColor}
                  strokeWidth={1.5}
                  strokeDasharray="2 10"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.6s" repeatCount="indefinite" />
                </line>
              )}
            </g>
          );
        })}
      </g>

      {/* Devices */}
      <g>
        {devices.map((d) => {
          const p = toCanvas(d);
          const isActive = step.activeDeviceId === d.id;
          const isSelected = selectedDeviceId === d.id;
          return (
            <g
              key={d.id}
              transform={`translate(${p.x} ${p.y})`}
              className="device-node"
              onClick={() => onSelectDevice(d.id)}
              role="button"
              tabIndex={0}
              aria-label={`${d.label} (${d.kind})`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDevice(d.id);
                }
              }}
            >
              {isActive && (
                <circle r={62} fill="none" stroke={packetColor} strokeWidth={2} opacity={0.5}>
                  <animate attributeName="r" values="52;70;52" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {isSelected && (
                <rect x={-70} y={-58} width={140} height={116} rx={16} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.7} />
              )}
              <DeviceGlyph kind={d.kind} active={isActive} />
              <text
                y={70}
                textAnchor="middle"
                fontFamily="var(--font-sans)"
                fontSize={15}
                fontWeight={600}
                fill={isActive ? "var(--text-0)" : "var(--text-2)"}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Packet */}
      {packetPos && step.packet && (
        <g transform={`translate(${packetPos.x} ${packetPos.y})`}>
          <circle r={34} fill="url(#packet-glow)" />
          <motion.g
            initial={false}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <rect x={-26} y={-15} width={52} height={30} rx={7} fill={packetColor} stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} />
            <text
              textAnchor="middle"
              y={5}
              fontFamily="var(--font-mono)"
              fontSize={13}
              fontWeight={700}
              fill="#06121f"
            >
              {step.packet.label}
            </text>
          </motion.g>
        </g>
      )}
    </svg>
  );
}
