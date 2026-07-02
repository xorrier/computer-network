import { useParams, Link } from "react-router-dom";
import { getChapterBySlug } from "@/journey/journeyRegistry";
import { ChapterView } from "@/journey/ChapterView";

export function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = slug ? getChapterBySlug(slug) : undefined;

  if (!chapter) {
    return (
      <div className="lesson-missing">
        <h2>This chapter is still being written.</h2>
        <p style={{ color: "var(--text-2)" }}>
          We're building each chapter carefully, in order. Check back soon.
        </p>
        <Link className="btn btn--primary" to="/">
          ← Back to the journey
        </Link>
      </div>
    );
  }

  return (
    <div className="chapter-page">
      <div className="chapter-page-head">
        <div className="chapter-titleblock">
          <span className="chapter-kicker mono">Chapter {chapter.number}</span>
          <h1>{chapter.title}</h1>
          <p>{chapter.promise}</p>
        </div>
      </div>
      <ChapterView key={chapter.slug} chapter={chapter} />
    </div>
  );
}
