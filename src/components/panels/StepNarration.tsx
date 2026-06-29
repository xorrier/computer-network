import { motion, AnimatePresence } from "framer-motion";
import type { LessonStep } from "@/types/network";
import { OSI_BY_ID } from "@/data/osiLayers";

interface StepNarrationProps {
  step: LessonStep;
  index: number;
  total: number;
}

export function StepNarration({ step, index, total }: StepNarrationProps) {
  const layer = OSI_BY_ID[step.layer];
  return (
    <div className="narration">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="narration-top">
            <span className="narration-step mono">
              Step {index + 1} of {total}
            </span>
            <span
              className="narration-layer"
              style={{ "--layer": layer.color } as React.CSSProperties}
            >
              L{layer.number} · {layer.name}
            </span>
          </div>
          <h2 className="narration-title">{step.title}</h2>
          <p className="narration-text">{step.narration}</p>

          {step.facts && step.facts.length > 0 && (
            <div className="narration-facts">
              {step.facts.map((f) => (
                <div className="fact" key={f.label}>
                  <span className="fact-label">{f.label}</span>
                  <span className="fact-value mono">{f.value}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
