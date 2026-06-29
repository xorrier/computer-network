import { Link, useLocation } from "react-router-dom";

export function TopBar() {
  const { pathname } = useLocation();
  const onLesson = pathname.startsWith("/lesson");

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="NetAcademy home">
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="16" r="3" fill="var(--accent)" />
          <circle cx="6" cy="9" r="2.2" fill="var(--accent-2)" />
          <circle cx="26" cy="9" r="2.2" fill="var(--accent-2)" />
          <circle cx="6" cy="23" r="2.2" fill="var(--accent-3)" />
          <circle cx="26" cy="23" r="2.2" fill="var(--accent-3)" />
          <g stroke="var(--border-strong)" strokeWidth="1.4">
            <line x1="16" y1="16" x2="6" y2="9" />
            <line x1="16" y1="16" x2="26" y2="9" />
            <line x1="16" y1="16" x2="6" y2="23" />
            <line x1="16" y1="16" x2="26" y2="23" />
          </g>
        </svg>
        <span className="brand-name">
          Net<strong>Academy</strong>
        </span>
      </Link>

      <nav className="topnav">
        <Link to="/" className={!onLesson ? "is-active" : ""}>
          Home
        </Link>
        <Link to="/lesson/packet-journey" className={onLesson ? "is-active" : ""}>
          Lessons
        </Link>
      </nav>

      <span className="topbar-tag">Learn networks by watching packets move</span>
    </header>
  );
}
