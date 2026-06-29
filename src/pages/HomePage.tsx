import { Link } from "react-router-dom";
import { LESSONS } from "@/lessons/lessonRegistry";
import { OSI_LAYERS } from "@/data/osiLayers";

export function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">Interactive · Animation-first</span>
          <h1 className="hero-title">
            See the internet <span className="grad">actually work.</span>
          </h1>
          <p className="hero-sub">
            Stop memorizing diagrams. Watch a real request travel from your browser through
            DNS, switches, routers, and load balancers — one animated packet at a time.
          </p>
          <div className="hero-actions">
            <Link className="btn btn--primary" to="/lesson/packet-journey">
              Start the journey →
            </Link>
            <a
              className="btn btn--ghost"
              href="#chapters"
            >
              Browse chapters
            </a>
          </div>
          <div className="hero-layers">
            {OSI_LAYERS.map((l) => (
              <span
                key={l.id}
                className="hero-layer-chip"
                style={{ "--layer": l.color } as React.CSSProperties}
              >
                {l.number} · {l.shortName}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-art" aria-hidden>
          <svg viewBox="0 0 320 260">
            <defs>
              <radialGradient id="hg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgba(94,234,212,0.18)" />
                <stop offset="100%" stopColor="rgba(94,234,212,0)" />
              </radialGradient>
            </defs>
            <rect width="320" height="260" fill="url(#hg)" rx="20" />
            {[
              [40, 60],
              [160, 40],
              [280, 80],
              [60, 190],
              [180, 210],
              [280, 180],
              [160, 130],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={i === 6 ? 9 : 6} fill={i === 6 ? "var(--accent)" : "var(--accent-2)"} />
              </g>
            ))}
            <g stroke="var(--border-strong)" strokeWidth="1.5" fill="none">
              <line x1="160" y1="130" x2="40" y2="60" />
              <line x1="160" y1="130" x2="160" y2="40" />
              <line x1="160" y1="130" x2="280" y2="80" />
              <line x1="160" y1="130" x2="60" y2="190" />
              <line x1="160" y1="130" x2="180" y2="210" />
              <line x1="160" y1="130" x2="280" y2="180" />
            </g>
            <circle r="5" fill="var(--accent-4)">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M160,130 L280,80" />
            </circle>
            <circle r="5" fill="var(--accent-3)">
              <animateMotion dur="3s" repeatCount="indefinite" path="M160,130 L60,190" />
            </circle>
          </svg>
        </div>
      </section>

      <section id="chapters" className="chapters">
        <div className="section-head">
          <h2>Chapters</h2>
          <p>Each chapter zooms into one step of the journey.</p>
        </div>
        <div className="chapter-grid">
          {LESSONS.map((lesson) => (
            <Link key={lesson.id} to={`/lesson/${lesson.slug}`} className="chapter-card">
              <div className="chapter-card-top">
                <span className="chapter-num mono">Ch {lesson.chapter}</span>
                <span className={`chapter-diff diff-${lesson.difficulty.toLowerCase()}`}>
                  {lesson.difficulty}
                </span>
              </div>
              <h3>{lesson.title}</h3>
              <p>{lesson.subtitle}</p>
              <div className="chapter-meta">
                <span>{lesson.steps.length} steps</span>
                <span>·</span>
                <span>{lesson.durationMin} min</span>
              </div>
            </Link>
          ))}
          <div className="chapter-card chapter-card--soon">
            <div className="chapter-card-top">
              <span className="chapter-num mono">Ch 2+</span>
              <span className="chapter-diff diff-soon">Coming soon</span>
            </div>
            <h3>DNS, ARP, TCP, TLS & more</h3>
            <p>Deep-dive chapters that zoom into each step of the journey.</p>
            <div className="chapter-meta">
              <span>In development</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
