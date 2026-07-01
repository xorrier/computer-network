import type { Chapter, RoadmapEntry } from "@/types/journey";
import { chapter01 } from "./chapters/ch01";
import { chapter02 } from "./chapters/ch02";
import { chapter03 } from "./chapters/ch03";
import { chapter04 } from "./chapters/ch04";
import { chapter05 } from "./chapters/ch05";
import { chapter06 } from "./chapters/ch06";
import { chapter07 } from "./chapters/ch07";
import { chapter08 } from "./chapters/ch08";
import { chapter09 } from "./chapters/ch09";
import { chapter10 } from "./chapters/ch10";
import { chapter11 } from "./chapters/ch11";
import { chapter12 } from "./chapters/ch12";
import { chapter13 } from "./chapters/ch13";
import { chapter14 } from "./chapters/ch14";

export const CHAPTERS: Chapter[] = [chapter01, chapter02, chapter03, chapter04, chapter05, chapter06, chapter07, chapter08, chapter09, chapter10, chapter11, chapter12, chapter13, chapter14];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function getNextChapter(currentNumber: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.number === currentNumber + 1);
}

/** Story acts — the three movements of the journey, for the sidebar. */
export interface Act {
  id: string;
  title: string;
  blurb: string;
  chapters: number[];
}

export const ACTS: Act[] = [
  { id: "foundations", title: "Foundations", blurb: "One machine, then two", chapters: [1, 2, 3, 4] },
  { id: "networks", title: "Networks", blurb: "Many machines, joined", chapters: [5, 6, 7, 8, 9] },
  { id: "web", title: "The Web", blurb: "Typing google.com", chapters: [10, 11, 12, 13, 14] },
];


/**
 * The full story map. Only chapters with authored beats are "ready"; the rest
 * are visible so the learner can see where the journey leads, but locked.
 */
export const ROADMAP: RoadmapEntry[] = [
  { number: 1, question: "What is a computer, and what is data?", concept: "bits & signals", slug: "what-is-a-computer", status: "ready" },
  { number: 2, question: "How do two computers physically talk?", concept: "the link / wire", slug: "two-computers", status: "ready" },
  { number: 3, question: "Why does each computer need an identity?", concept: "addressing", slug: "computer-identity", status: "ready" },
  { number: 4, question: "What is a MAC address?", concept: "hardware identity", slug: "mac-address", status: "ready" },
  { number: 5, question: "The hub shouts to everyone — what is a switch?", concept: "switching", slug: "the-switch", status: "ready" },
  { number: 6, question: "Why can't a switch reach another network?", concept: "broadcast domains", slug: "another-network", status: "ready" },
  { number: 7, question: "What is an IP address?", concept: "logical addressing", slug: "ip-address", status: "ready" },
  { number: 8, question: "What problem does a router solve?", concept: "routing", slug: "the-router", status: "ready" },
  { number: 9, question: "How do millions of networks connect?", concept: "Internet & ISPs", slug: "the-internet", status: "ready" },
  { number: 10, question: "I typed google.com — what is that name?", concept: "names vs addresses", slug: "names-vs-addresses", status: "ready" },
  { number: 11, question: "How does DNS find the address?", concept: "DNS resolution", slug: "how-dns-works", status: "ready" },
  { number: 12, question: "How is a reliable connection made?", concept: "TCP handshake", slug: "tcp-handshake", status: "ready" },
  { number: 13, question: "Why is HTTPS secure?", concept: "TLS", slug: "tls-https", status: "ready" },
  { number: 14, question: "How does the page finally appear?", concept: "HTTP & rendering", slug: "http-and-rendering", status: "ready" },
];
