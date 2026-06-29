import type { Lesson } from "@/types/network";
import { packetJourneyLesson } from "./packetJourney";

export const LESSONS: Lesson[] = [packetJourneyLesson];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
