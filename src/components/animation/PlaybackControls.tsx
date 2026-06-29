import type { StepPlayer, PlaybackSpeed } from "./useStepPlayer";

const SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 1, 2];

function Icon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor" } as const;
  switch (name) {
    case "play":
      return (
        <svg {...common}>
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    case "pause":
      return (
        <svg {...common}>
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      );
    case "prev":
      return (
        <svg {...common}>
          <path d="M7 6h2v12H7zM20 6v12l-9-6z" />
        </svg>
      );
    case "next":
      return (
        <svg {...common}>
          <path d="M15 6h2v12h-2zM4 6l9 6-9 6z" />
        </svg>
      );
    case "restart":
      return (
        <svg {...common}>
          <path d="M12 5V2L7 7l5 5V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8z" />
        </svg>
      );
    default:
      return null;
  }
}

interface PlaybackControlsProps {
  player: StepPlayer;
  stepCount: number;
}

export function PlaybackControls({ player, stepCount }: PlaybackControlsProps) {
  return (
    <div className="playback">
      <div className="playback-buttons">
        <button className="pb-btn" onClick={player.restart} title="Restart" aria-label="Restart">
          <Icon name="restart" />
        </button>
        <button
          className="pb-btn"
          onClick={player.prev}
          disabled={player.isFirst}
          title="Previous step"
          aria-label="Previous step"
        >
          <Icon name="prev" />
        </button>
        <button
          className="pb-btn pb-btn--primary"
          onClick={player.toggle}
          title={player.isPlaying ? "Pause" : "Play"}
          aria-label={player.isPlaying ? "Pause" : "Play"}
        >
          <Icon name={player.isPlaying ? "pause" : "play"} />
        </button>
        <button
          className="pb-btn"
          onClick={player.next}
          disabled={player.isLast}
          title="Next step"
          aria-label="Next step"
        >
          <Icon name="next" />
        </button>
      </div>

      <div className="playback-progress" aria-hidden>
        <span className="mono playback-counter">
          {String(player.index + 1).padStart(2, "0")} / {String(stepCount).padStart(2, "0")}
        </span>
        <div className="playback-track">
          {Array.from({ length: stepCount }).map((_, i) => (
            <button
              key={i}
              className={
                "playback-tick" +
                (i < player.index ? " is-done" : "") +
                (i === player.index ? " is-current" : "")
              }
              style={
                i === player.index
                  ? ({ "--fill": `${player.progress * 100}%` } as React.CSSProperties)
                  : undefined
              }
              onClick={() => player.goTo(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="playback-speed" role="group" aria-label="Playback speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={"speed-btn" + (player.speed === s ? " is-active" : "")}
            onClick={() => player.setSpeed(s)}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
