import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter } from "@/types/journey";
import { Stage } from "@/components/stage/Stage";
import { getNextChapter } from "@/journey/journeyRegistry";

interface ChapterViewProps {
  chapter: Chapter;
}

export function ChapterView({ chapter }: ChapterViewProps) {
  const navigate = useNavigate();
  const [beatIndex, setBeatIndex] = useState(0);
  // How many narration paragraphs of the current beat are revealed.
  const [revealed, setRevealed] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const beat = chapter.beats[beatIndex]!;
  const isLastBeat = beatIndex === chapter.beats.length - 1;
  const allSaid = revealed >= beat.say.length;

  const chosen = useMemo(
    () => beat.interaction?.choices.find((c) => c.id === picked) ?? null,
    [beat.interaction, picked],
  );
  const solved = !beat.interaction || (chosen?.correct ?? false);
  const showInteraction = Boolean(beat.interaction) && allSaid;
  const canContinue = allSaid && solved;

  const goToBeat = (i: number) => {
    setBeatIndex(i);
    setRevealed(1);
    setPicked(null);
  };

  const handlePrimary = () => {
    if (!allSaid) {
      setRevealed((r) => r + 1);
      return;
    }
    if (!canContinue) return;
    if (isLastBeat) {
      setFinished(true);
      return;
    }
    goToBeat(beatIndex + 1);
  };

  const nextChapter = getNextChapter(chapter.number);

  return (
    <div className="chapter">
      <div className="chapter-main">
        <Stage model={beat.stage} />
      </div>

      <aside className="narrator">
        <div className="narrator-head">
          <span className="narrator-chapter mono">
            Chapter {chapter.number} · Beat {beatIndex + 1}/{chapter.beats.length}
          </span>
          <h2 className="narrator-q">{chapter.question}</h2>
        </div>

        <div className="narrator-body">
          <div className="say">
            <AnimatePresence initial={false}>
              {beat.say.slice(0, revealed).map((line, i) => (
                <motion.p
                  key={beat.id + "-" + i}
                  className={"say-p" + (i === revealed - 1 ? " is-latest" : "")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  dangerouslySetInnerHTML={{ __html: emphasize(line) }}
                />
              ))}
            </AnimatePresence>
          </div>

          {beat.reveal && allSaid && (
            <motion.div
              className="reveal-banner"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <span className="reveal-key">🔓 Unlocked</span>
              <span>{beat.reveal}</span>
            </motion.div>
          )}

          {showInteraction && beat.interaction && (
            <div className="interaction">
              <p className="interaction-prompt">{beat.interaction.prompt}</p>
              <div className="choices">
                {beat.interaction.choices.map((c) => {
                  const isPicked = picked === c.id;
                  const state = !isPicked ? "" : c.correct ? " is-correct" : " is-wrong";
                  return (
                    <button
                      key={c.id}
                      className={"choice" + state}
                      onClick={() => setPicked(c.id)}
                      disabled={solved && !isPicked}
                    >
                      <span className="choice-label">{c.label}</span>
                      <AnimatePresence>
                        {isPicked && (
                          <motion.span
                            className="choice-feedback"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {c.feedback}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="narrator-foot">
          <div className="beat-dots">
            {chapter.beats.map((b, i) => (
              <button
                key={b.id}
                className={"beat-dot" + (i === beatIndex ? " is-active" : "") + (i < beatIndex ? " is-done" : "")}
                onClick={() => goToBeat(i)}
                aria-label={`Go to beat ${i + 1}`}
              />
            ))}
          </div>
          <button className="continue-btn" onClick={handlePrimary} disabled={showInteraction && !solved}>
            {!allSaid ? "Continue" : isLastBeat ? "Finish chapter →" : "Next →"}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {finished && (
          <motion.div className="bridge-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bridge-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
            >
              <span className="bridge-eyebrow">Chapter {chapter.number} complete</span>
              <h2>But this creates a new problem…</h2>
              <p className="bridge-text">{chapter.bridge}</p>
              <div className="bridge-actions">
                <button className="btn btn--ghost" onClick={() => { setFinished(false); goToBeat(0); }}>
                  Replay chapter
                </button>
                {nextChapter ? (
                  <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/chapter/${nextChapter.slug}`)}
                  >
                    Chapter {nextChapter.number}: {nextChapter.question} →
                  </button>
                ) : (
                  <button className="btn btn--primary" onClick={() => navigate("/")}>
                    Back to the map →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Wrap *emphasis* in styled spans (lightweight, no markdown lib). */
function emphasize(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*([^*]+)\*/g, '<em class="say-em">$1</em>');
}
