import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter } from "@/types/journey";
import { Stage } from "@/components/stage/Stage";
import { getNextChapter } from "@/journey/journeyRegistry";
import { markComplete } from "@/journey/progress";

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
  const bodyRef = useRef<HTMLDivElement>(null);

  const beat = chapter.beats[beatIndex]!;
  const isLastBeat = beatIndex === chapter.beats.length - 1;
  const allSaid = revealed >= beat.say.length;

  // Unlock the next chapter once this one is finished.
  useEffect(() => {
    if (finished) markComplete(chapter.number);
  }, [finished, chapter.number]);

  const chosen = useMemo(
    () => beat.interaction?.choices.find((c) => c.id === picked) ?? null,
    [beat.interaction, picked],
  );
  const solved = !beat.interaction || (chosen?.correct ?? false);
  const showInteraction = Boolean(beat.interaction) && allSaid;
  const canContinue = allSaid && solved;

  // Keep the newest content in view above the footer as the beat grows.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [revealed, showInteraction, picked, beatIndex]);

  const goToBeat = (i: number) => {
    setBeatIndex(i);
    setRevealed(1);
    setPicked(null);
  };

  // Step backward one narration line; at the first line, jump to the previous
  // beat fully revealed.
  const goPrev = () => {
    if (revealed > 1) {
      setRevealed((r) => r - 1);
      return;
    }
    if (beatIndex > 0) {
      const prev = beatIndex - 1;
      setBeatIndex(prev);
      setRevealed(chapter.beats[prev]!.say.length);
      setPicked(null);
    }
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

        <div className="narrator-body" ref={bodyRef}>
          <div className="say">
            <AnimatePresence initial={false}>
              {beat.say.slice(0, revealed).map((line, i) => (
                <motion.p
                  key={beat.id + "-" + i}
                  className={"say-p" + (i === revealed - 1 ? " is-latest" : "")}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="beat-progress" aria-hidden="true">
            <div
              className="beat-progress-fill"
              style={{ width: `${(((beatIndex + (allSaid ? 1 : 0)) / chapter.beats.length) * 100).toFixed(1)}%` }}
            />
          </div>
          <div className="transport">
            <button
              className="transport-btn"
              onClick={goPrev}
              disabled={beatIndex === 0 && revealed <= 1}
              aria-label="Previous"
              title="Previous"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19 5.5v13a1 1 0 0 1-1.5.86L9 13.7V18a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v4.3l8.5-5.66A1 1 0 0 1 19 5.5z" />
              </svg>
            </button>

            {isLastBeat && allSaid && solved ? (
              <button className="transport-open" onClick={() => setFinished(true)}>
                {nextChapter ? "Open next chapter →" : "Finish →"}
              </button>
            ) : (
              <button
                className="transport-btn"
                onClick={handlePrimary}
                disabled={showInteraction && !solved}
                aria-label="Forward"
                title="Forward"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M5 5.5v13a1 1 0 0 0 1.5.86L15 13.7V18a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v4.3L6.5 4.64A1 1 0 0 0 5 5.5z" />
                </svg>
              </button>
            )}
          </div>
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
              <span className="bridge-eyebrow">
                {nextChapter ? `Chapter ${chapter.number} complete` : "Journey complete"}
              </span>
              <h2>{nextChapter ? "But this creates a new problem…" : "You just built the Internet."}</h2>
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
