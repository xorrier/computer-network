import type { DeviceKind } from "@/types/network";

/**
 * All network devices are drawn programmatically as SVG.
 * Each glyph is centered on (0,0) and fits roughly within a 120 x 100 box,
 * so it can be dropped into a <g transform="translate(x,y)"> on the canvas.
 */

interface GlyphProps {
  active?: boolean;
}

const SCREEN = "#0b1020";

function Browser({ active }: GlyphProps) {
  return (
    <g>
      <rect x={-52} y={-40} width={104} height={80} rx={10} fill="var(--bg-2)" stroke={active ? "var(--accent)" : "var(--border-strong)"} strokeWidth={active ? 3 : 1.5} />
      <rect x={-52} y={-40} width={104} height={22} rx={10} fill="var(--bg-3)" />
      <rect x={-52} y={-29} width={104} height={11} fill="var(--bg-3)" />
      <circle cx={-42} cy={-29} r={3} fill="var(--accent-3)" />
      <circle cx={-32} cy={-29} r={3} fill="var(--accent-4)" />
      <circle cx={-22} cy={-29} r={3} fill="var(--accent)" />
      <rect x={-12} y={-34} width={58} height={10} rx={5} fill={SCREEN} />
      <rect x={-44} y={-8} width={88} height={6} rx={3} fill="rgba(255,255,255,0.16)" />
      <rect x={-44} y={4} width={62} height={6} rx={3} fill="rgba(255,255,255,0.1)" />
      <rect x={-44} y={16} width={74} height={6} rx={3} fill="rgba(255,255,255,0.1)" />
      <rect x={-44} y={28} width={40} height={6} rx={3} fill="rgba(255,255,255,0.1)" />
    </g>
  );
}

function Switch({ active }: GlyphProps) {
  return (
    <g>
      <rect x={-58} y={-26} width={116} height={52} rx={9} fill="var(--bg-2)" stroke={active ? "var(--accent)" : "var(--border-strong)"} strokeWidth={active ? 3 : 1.5} />
      <g fill="var(--layer-datalink)">
        {[-44, -28, -12, 4, 20, 36].map((x) => (
          <rect key={x} x={x} y={8} width={11} height={11} rx={2} opacity={0.85} />
        ))}
      </g>
      <g fill="rgba(255,255,255,0.5)">
        {[-44, -28, -12, 4, 20, 36].map((x) => (
          <circle key={x} cx={x + 5.5} cy={-12} r={2.4} />
        ))}
      </g>
      <path d="M -30 -2 H 30" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
    </g>
  );
}

function Router({ active }: GlyphProps) {
  return (
    <g>
      <circle cx={0} cy={0} r={40} fill="var(--bg-2)" stroke={active ? "var(--accent)" : "var(--border-strong)"} strokeWidth={active ? 3 : 1.5} />
      <g stroke="var(--layer-network)" strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M -16 -6 H 14 M 8 -12 L 16 -6 L 8 0" />
        <path d="M 16 10 H -14 M -8 4 L -16 10 L -8 16" />
      </g>
      <g fill="var(--layer-network)">
        <circle cx={-26} cy={26} r={3} />
        <circle cx={26} cy={-26} r={3} />
      </g>
    </g>
  );
}

function Server({ active }: GlyphProps) {
  return (
    <g>
      {[-30, 0, 30].map((y, i) => (
        <g key={y}>
          <rect x={-40} y={y - 13} width={80} height={26} rx={6} fill="var(--bg-2)" stroke={active ? "var(--accent)" : "var(--border-strong)"} strokeWidth={active ? 2.5 : 1.5} />
          <circle cx={-28} cy={y} r={3.5} fill={i === 0 ? "var(--ok)" : "var(--accent-2)"} />
          <circle cx={-16} cy={y} r={3.5} fill="rgba(255,255,255,0.25)" />
          <rect x={6} y={y - 3} width={26} height={6} rx={3} fill="rgba(255,255,255,0.18)" />
        </g>
      ))}
    </g>
  );
}

function Dns({ active }: GlyphProps) {
  return (
    <g>
      <rect x={-44} y={-34} width={88} height={68} rx={10} fill="var(--bg-2)" stroke={active ? "var(--accent)" : "var(--border-strong)"} strokeWidth={active ? 3 : 1.5} />
      <text x={0} y={-8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={16} fontWeight={700} fill="var(--accent-2)">
        DNS
      </text>
      <rect x={-32} y={6} width={64} height={7} rx={3.5} fill="rgba(255,255,255,0.18)" />
      <rect x={-32} y={18} width={44} height={7} rx={3.5} fill="rgba(255,255,255,0.1)" />
    </g>
  );
}

function LoadBalancer({ active }: GlyphProps) {
  return (
    <g>
      <rect x={-44} y={-34} width={88} height={68} rx={10} fill="var(--bg-2)" stroke={active ? "var(--accent)" : "var(--border-strong)"} strokeWidth={active ? 3 : 1.5} />
      <g stroke="var(--accent-4)" strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M -22 0 H 0" />
        <path d="M 0 0 L 20 -16 M 0 0 L 20 0 M 0 0 L 20 16" />
      </g>
      <circle cx={-22} cy={0} r={4} fill="var(--accent-4)" />
    </g>
  );
}

function Cloud({ active }: GlyphProps) {
  return (
    <g>
      <path
        d="M -50 16 a 22 22 0 0 1 6 -42 a 26 26 0 0 1 50 -6 a 20 20 0 0 1 18 14 a 18 18 0 0 1 -4 34 Z"
        fill="var(--bg-2)"
        stroke={active ? "var(--accent)" : "var(--border-strong)"}
        strokeWidth={active ? 3 : 1.5}
      />
      <g fill="rgba(255,255,255,0.18)">
        <circle cx={-18} cy={2} r={3} />
        <circle cx={0} cy={2} r={3} />
        <circle cx={18} cy={2} r={3} />
      </g>
    </g>
  );
}

const GLYPHS: Record<DeviceKind, (p: GlyphProps) => JSX.Element> = {
  browser: Browser,
  switch: Switch,
  router: Router,
  server: Server,
  dns: Dns,
  loadbalancer: LoadBalancer,
  cloud: Cloud,
};

export function DeviceGlyph({ kind, active }: { kind: DeviceKind; active?: boolean }) {
  const Glyph = GLYPHS[kind];
  return <Glyph active={active} />;
}
