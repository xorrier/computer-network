import { motion } from "framer-motion";

/**
 * Shows how a human message becomes bits and then physical signals.
 * Pure SVG/CSS, generated from the input text's character codes.
 */
interface BinaryEncoderProps {
  text: string;
}

function toBits(ch: string): string {
  return ch.charCodeAt(0).toString(2).padStart(8, "0");
}

export function BinaryEncoder({ text }: BinaryEncoderProps) {
  const chars = text.slice(0, 4).split("");
  const firstBits = chars.length ? toBits(chars[0]!) : "00000000";

  // Build a square-wave path for the first character's 8 bits.
  const unit = 30;
  const high = 8;
  const low = 44;
  let d = `M 0 ${low}`;
  firstBits.split("").forEach((bit, i) => {
    const y = bit === "1" ? high : low;
    const x0 = i * unit;
    const x1 = (i + 1) * unit;
    d += ` L ${x0} ${y} L ${x1} ${y}`;
  });

  return (
    <div className="binenc">
      <div className="binenc-row">
        <span className="binenc-label">You write</span>
        <div className="binenc-chars">
          {chars.map((c, i) => (
            <motion.span
              key={i}
              className="binenc-char"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              {c === " " ? "␣" : c}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="binenc-arrow">↓ the computer encodes each character</div>

      <div className="binenc-row">
        <span className="binenc-label">It stores</span>
        <div className="binenc-bitsgroup">
          {chars.map((c, ci) => (
            <div className="binenc-byte" key={ci}>
              {toBits(c)
                .split("")
                .map((b, bi) => (
                  <motion.span
                    key={bi}
                    className={"binenc-bit " + (b === "1" ? "is-one" : "is-zero")}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + ci * 0.25 + bi * 0.04 }}
                  >
                    {b}
                  </motion.span>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="binenc-arrow">↓ each bit becomes a voltage on the wire</div>

      <div className="binenc-wave">
        <svg viewBox={`-4 0 ${8 * unit + 8} 52`} preserveAspectRatio="xMidYMid meet">
          <line x1={0} y1={low} x2={8 * unit} y2={low} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          <motion.path
            d={d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={3}
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.6 }}
          />
          {firstBits.split("").map((b, i) => (
            <text
              key={i}
              x={i * unit + unit / 2}
              y={low + 9}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={7}
              fill={b === "1" ? "var(--accent)" : "var(--text-3)"}
            >
              {b}
            </text>
          ))}
          <text x={8 * unit + 2} y={high + 2} fontFamily="var(--font-mono)" fontSize={7} fill="var(--text-3)">
            high = 1
          </text>
          <text x={8 * unit + 2} y={low + 2} fontFamily="var(--font-mono)" fontSize={7} fill="var(--text-3)">
            low = 0
          </text>
        </svg>
      </div>
    </div>
  );
}
