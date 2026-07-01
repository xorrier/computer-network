import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

/**
 * Docs-style two-pane shell for the learning experience: a persistent chapter
 * sidebar on the left and the active chapter on the right. The sidebar can be
 * collapsed for a distraction-free "focus mode".
 */
export function LessonLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className={"lesson-shell" + (open ? "" : " is-collapsed")}>
      <aside className="lesson-aside">
        <Sidebar />
      </aside>

      <button
        className="lesson-aside-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide chapters" : "Show chapters"}
        title={open ? "Hide chapters" : "Show chapters"}
      >
        {open ? "‹" : "›"}
      </button>

      <div className="lesson-content">
        <Outlet />
      </div>
    </div>
  );
}
