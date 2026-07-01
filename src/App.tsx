import { Routes, Route, Navigate } from "react-router-dom";
import { LessonLayout } from "@/components/layout/LessonLayout";
import { JourneyHome } from "@/pages/JourneyHome";
import { ChapterPage } from "@/pages/ChapterPage";

export function App() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<JourneyHome />} />
          <Route element={<LessonLayout />}>
            <Route path="/chapter/:slug" element={<ChapterPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
