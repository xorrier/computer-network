import { Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { HomePage } from "@/pages/HomePage";
import { LessonPage } from "@/pages/LessonPage";

export function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
