import { useCallback, useEffect, useRef, useState } from "react";

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2;

interface UseStepPlayerOptions {
  stepCount: number;
  /** Base duration of a single step in milliseconds at 1x speed. */
  stepDurationMs?: number;
  autoPlay?: boolean;
}

export interface StepPlayer {
  index: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  /** 0..1 progress of the current step's animation. */
  progress: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  goTo: (index: number) => void;
  setSpeed: (s: PlaybackSpeed) => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Drives stepped, timed playback for a lesson. Each step animates for
 * `stepDurationMs / speed`, then auto-advances while playing. Progress is
 * exposed so the canvas can drive packet motion in sync with the timeline.
 */
export function useStepPlayer({
  stepCount,
  stepDurationMs = 3200,
  autoPlay = false,
}: UseStepPlayerOptions): StepPlayer {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const isFirst = index === 0;
  const isLast = index === stepCount - 1;

  const clearLoop = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
  };

  // Animation loop: advances `progress` and auto-advances steps.
  useEffect(() => {
    if (!isPlaying) {
      clearLoop();
      return;
    }
    const duration = stepDurationMs / speed;

    const tick = (now: number) => {
      if (startRef.current === null) {
        // Resume mid-step from current progress.
        startRef.current = now - progress * duration;
      }
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (p >= 1) {
        startRef.current = null;
        setIndex((i) => {
          if (i >= stepCount - 1) {
            setIsPlaying(false);
            return i;
          }
          setProgress(0);
          return i + 1;
        });
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return clearLoop;
    // We intentionally exclude `progress` so resuming doesn't restart the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, index, stepCount, stepDurationMs]);

  const play = useCallback(() => {
    if (index >= stepCount - 1 && progress >= 1) {
      setIndex(0);
      setProgress(0);
    }
    setIsPlaying(true);
  }, [index, progress, stepCount]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    startRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((p) => !p);
    startRef.current = null;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(stepCount - 1, i));
      setIndex(clamped);
      setProgress(0);
      startRef.current = null;
    },
    [stepCount],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const restart = useCallback(() => {
    setIndex(0);
    setProgress(0);
    startRef.current = null;
    setIsPlaying(true);
  }, []);

  return {
    index,
    isPlaying,
    speed,
    progress,
    play,
    pause,
    toggle,
    next,
    prev,
    restart,
    goTo,
    setSpeed,
    isFirst,
    isLast,
  };
}
