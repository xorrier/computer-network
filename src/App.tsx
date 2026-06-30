import { Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { JourneyHome } from "@/pages/JourneyHome";
import { ChapterPage } from "@/pages/ChapterPage";

export function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<JourneyHome />} />
          <Route path="/chapter/:slug" element={<ChapterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
