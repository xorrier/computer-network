import { Link, useParams } from "react-router-dom";
import { ACTS, ROADMAP } from "@/journey/journeyRegistry";
import { isUnlocked, useCompleted } from "@/journey/progress";
import type { RoadmapEntry } from "@/types/journey";

const BY_NUMBER = new Map<number, RoadmapEntry>(ROADMAP.map((e) => [e.number, e]));

export function Sidebar() {
  const { slug } = useParams<{ slug: string }>();
  const completed = useCompleted();

  const doneCount = ROADMAP.filter((e) => completed.has(e.number)).length;
  const pct = Math.round((doneCount / ROADMAP.length) * 100);

  return (
    <nav className="sidebar" aria-label="Chapters">
      <Link to="/" className="sb-brand">
        <span className="sb-brand-mark" aria-hidden>
          ◍
        </span>
        <span className="sb-brand-text">
          <span className="sb-brand-name">NetAcademy</span>
          <span className="sb-brand-tag">Build the internet, one idea at a time.</span>
        </span>
      </Link>

      <div className="sb-journey-head">
        <span className="sb-journey-meta mono">
          {ROADMAP.length} lessons · {pct}%
        </span>
      </div>
      <div className="sb-progress-track" aria-hidden>
        <div className="sb-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <ol className="sb-timeline">
        {ACTS.map((act) => (
          <li key={act.id} className="sb-act">
            <div className="sb-act-row">
              <span className="sb-act-label">{act.title}</span>
              <span className="sb-act-blurb">{act.blurb}</span>
            </div>

            {act.chapters.map((num) => {
              const entry = BY_NUMBER.get(num);
              if (!entry) return null;
              const unlocked = isUnlocked(num, completed);
              const done = completed.has(num);
              const current = Boolean(entry.slug && entry.slug === slug);
              const state = current ? "current" : done ? "done" : unlocked ? "open" : "locked";

              const inner = (
                <>
                  <span className="sb-rail">
                    <span className={"sb-dot sb-dot--" + state} aria-hidden>
                      {done ? "✓" : state === "locked" ? "🔒" : num}
                    </span>
                  </span>
                  <span className="sb-node-body">
                    <span className="sb-node-title">{entry.question}</span>
                    <span className="sb-node-concept">{entry.concept}</span>
                  </span>
                </>
              );

              return (
                <div key={num} className={"sb-node is-" + state}>
                  {unlocked && entry.slug ? (
                    <Link
                      to={`/chapter/${entry.slug}`}
                      className="sb-node-link"
                      aria-current={current ? "page" : undefined}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="sb-node-link" aria-disabled>
                      {inner}
                    </div>
                  )}
                </div>
              );
            })}
          </li>
        ))}
      </ol>
    </nav>
  );
}
