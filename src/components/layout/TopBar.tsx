import { Link, useLocation } from "react-router-dom";

export function TopBar() {
  const { pathname } = useLocation();

  // The homepage is intentionally almost empty — no chrome.
  if (pathname === "/") return null;

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="NetAcademy home">
        <span className="brand-name">
          Net<strong>Academy</strong>
        </span>
      </Link>

      <nav className="topnav">
        <Link to="/">Journey</Link>
      </nav>
    </header>
  );
}
