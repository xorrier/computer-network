import { useParams, Link } from "react-router-dom";
import { getLessonBySlug } from "@/lessons/lessonRegistry";
import { LessonView } from "@/lessons/LessonView";

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? getLessonBySlug(slug) : undefined;

  if (!lesson) {
    return (
      <div className="lesson-missing">
        <h2>Lesson not found</h2>
        <Link className="btn btn--primary" to="/">
          ← Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <div className="lesson-page-head">
        <div>
          <span className="lesson-chapter mono">Chapter {lesson.chapter}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
        <span className="lesson-hint">Tip: click any device to inspect it</span>
      </div>
      <LessonView lesson={lesson} />
    </div>
  );
}
