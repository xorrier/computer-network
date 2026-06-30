import { Link } from "react-router-dom";
import { ROADMAP } from "@/journey/journeyRegistry";

export function JourneyHome() {
  return (
    <div className="journey-home">
      <section className="jhero">
        <span className="jhero-eyebrow">A guided story · zero assumptions</span>
        <h1 className="jhero-title">
          Build the internet <span className="grad">from one computer up.</span>
        </h1>
        <p className="jhero-sub">
          No jargon. No diagrams you don't understand yet. We start with a single lonely
          machine and, one question at a time, discover why every part of the internet had to
          be invented — ending with what really happens when you type <strong>google.com</strong>.
        </p>
        <div className="jhero-actions">
          <Link className="btn btn--primary" to="/chapter/what-is-a-computer">
            Begin Chapter 1 →
          </Link>
          <a className="btn btn--ghost" href="#map">
            See the whole journey
          </a>
        </div>
      </section>

      <section id="map" className="story-map">
        <div className="story-map-head">
          <h2>The journey</h2>
          <p>Each question is forced by the answer to the one before it.</p>
        </div>

        <ol className="story-path">
          {ROADMAP.map((entry) => {
            const ready = entry.status === "ready";
            const inner = (
              <>
                <span className="sp-num mono">{String(entry.number).padStart(2, "0")}</span>
                <span className="sp-body">
                  <span className="sp-q">{entry.question}</span>
                  <span className="sp-concept">{entry.concept}</span>
                </span>
                <span className={"sp-status" + (ready ? " is-ready" : "")}>
                  {ready ? "Start →" : "Soon"}
                </span>
              </>
            );
            return (
              <li key={entry.number} className={"story-node" + (ready ? " is-ready" : " is-locked")}>
                {ready && entry.slug ? (
                  <Link to={`/chapter/${entry.slug}`} className="sp-link">
                    {inner}
                  </Link>
                ) : (
                  <div className="sp-link">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
