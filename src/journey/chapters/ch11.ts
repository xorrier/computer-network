import type { Chapter } from "@/types/journey";

// Progressive cast. Only the resolver exists at first; each tier of the
// hierarchy is revealed as the resolver actually walks to it.
const YOU = { id: "you", kind: "browser" as const, label: "Your browser", x: 12, y: 60 };
const RES = { id: "res", kind: "dns" as const, label: "Your resolver", x: 34, y: 60 };
const ROOT = { id: "root", kind: "dns" as const, label: "Root (.)", x: 44, y: 18 };
const TLD = { id: "tld", kind: "dns" as const, label: ".com servers", x: 66, y: 18 };
const AUTH = { id: "auth", kind: "dns" as const, label: "google.com's server", x: 88, y: 18 };

const IP = "142.250.72.14";

/**
 * Chapter 11 — DNS resolution. The resolver turns a name into an IP by walking
 * the name's own hierarchy: root → TLD → authoritative server. Answers are
 * cached with a TTL so repeat lookups are instant. This closes the name/address
 * gap opened in Chapter 10 and hands the browser a real IP to connect to.
 */
export const chapter11: Chapter = {
  id: "ch11",
  number: 11,
  slug: "how-dns-works",
  question: "How does a name become an address?",
  title: "DNS: the Internet's directory",
  promise: "You'll watch google.com get turned into an IP, one step down the hierarchy at a time.",
  bridge:
    "Your browser finally holds a real address: 142.250.72.14. It knows *where* google's server lives. But knowing the address isn't the same as talking to it — packets can arrive out of order, or not at all. Before any web page is sent, the two computers must agree to talk and promise to catch anything that gets lost. Next, we open a *reliable connection*: the TCP handshake.",
  beats: [
    {
      id: "b1-resolver",
      say: [
        "Last chapter you were stuck: you have the name *google.com*, but the network needs an IP.",
        "You don't do the searching yourself. Your computer hands the name to a specialist called a *resolver* — usually run by your ISP, or a public one like 8.8.8.8.",
        "The resolver's entire job: take a name, come back with an address. So it gets to work.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "google.com" },
          { ...RES },
        ],
        links: [{ id: "l-yr", from: "you", to: "res", active: true, label: "find google.com's IP" }],
        signals: [{ id: "s-ask", linkId: "l-yr", from: "you", label: "google.com?", color: "var(--accent-2)" }],
        caption: "Your computer delegates the lookup to a resolver.",
      },
    },
    {
      id: "b2-cache",
      say: [
        "Before asking anyone, the resolver checks its own memory — a *cache* of names it looked up recently.",
        "A cache hit would be instant. But right now the cache is empty: it has never looked up google.com.",
        "Cache miss. There's no shortcut this time — the resolver has to go find the answer from scratch.",
      ],
      stage: {
        nodes: [
          { ...YOU, badge: "google.com" },
          { ...RES, highlight: true },
        ],
        links: [{ id: "l-yr", from: "you", to: "res" }],
        inset: "dnscache",
        insetDnsCache: { rows: [], note: "Cache miss — google.com isn't here. Time to go ask." },
        caption: "First stop is always the resolver's own memory.",
      },
    },
    {
      id: "b3-root",
      say: [
        "Remember the name is a hierarchy, read right to left. The resolver starts at the very top: the *root* servers.",
        "There are only a handful of root servers, and every resolver knows them by heart.",
        "Root doesn't store google.com's IP. But it knows exactly who is in charge of the *.com* part — and points the resolver there.",
      ],
      stage: {
        nodes: [
          { ...YOU, badge: "google.com" },
          { ...RES, highlight: true },
          { ...ROOT },
        ],
        links: [
          { id: "l-yr", from: "you", to: "res" },
          { id: "l-rr", from: "res", to: "root", active: true, label: "→ go ask the .com servers" },
        ],
        signals: [{ id: "s-root", linkId: "l-rr", from: "res", label: "who runs .com?", color: "var(--accent-2)" }],
        caption: "The root doesn't know the answer — it knows who does.",
      },
    },
    {
      id: "b4-tld",
      say: [
        "So the resolver goes one step down, to the *.com* servers — the TLD tier.",
        "They don't store every website's IP either. That would be a colossal, ever-changing list.",
        "But they *do* know which server is *authoritative* for google.com — the one place that holds google's own records. Down one more level.",
      ],
      stage: {
        nodes: [
          { ...YOU, badge: "google.com" },
          { ...RES, highlight: true },
          { ...ROOT, dim: true },
          { ...TLD },
        ],
        links: [
          { id: "l-yr", from: "you", to: "res" },
          { id: "l-rr", from: "res", to: "root", dashed: true },
          { id: "l-rt", from: "res", to: "tld", active: true, label: "→ ask google.com's own server" },
        ],
        signals: [{ id: "s-tld", linkId: "l-rt", from: "res", label: "where's google.com?", color: "var(--accent-2)" }],
        caption: "Each tier hands off a smaller, more specific question.",
      },
    },
    {
      id: "b5-auth",
      say: [
        "Finally the resolver reaches google.com's *authoritative* server — the one place that actually holds the answer.",
        "It replies with the real address: 142.250.72.14.",
        "Notice the pattern: root → .com → google.com. The resolver walked the name's hierarchy from the top down, and each server only had to know one small piece.",
      ],
      reveal: "DNS resolves a name by walking its hierarchy: root → TLD → authoritative server.",
      stage: {
        nodes: [
          { ...YOU, badge: "google.com" },
          { ...RES, highlight: true },
          { ...ROOT, dim: true },
          { ...TLD, dim: true },
          { ...AUTH },
        ],
        links: [
          { id: "l-yr", from: "you", to: "res" },
          { id: "l-rr", from: "res", to: "root", dashed: true },
          { id: "l-rt", from: "res", to: "tld", dashed: true },
          { id: "l-ra", from: "res", to: "auth", active: true, label: IP },
        ],
        signals: [{ id: "s-auth", linkId: "l-ra", from: "auth", label: IP, color: "var(--ok)" }],
        caption: "Only the authoritative server holds the real record.",
      },
    },
    {
      id: "b6-payoff",
      say: [
        "The resolver hands the IP back to your browser — and stores it in its cache with a time limit called a *TTL*.",
        "Your browser finally has 142.250.72.14. The name/address gap is closed.",
        "And the next time anyone asks for google.com, the resolver answers instantly from cache — no root, no .com, no walk at all.",
      ],
      reveal: "Answers are cached with a TTL, so repeat lookups skip the whole journey.",
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: IP },
          { ...RES },
        ],
        links: [
          { id: "l-yr", from: "you", to: "res", active: true, label: "here's your address" },
        ],
        signals: [{ id: "s-back", linkId: "l-yr", from: "res", label: IP, color: "var(--ok)" }],
        inset: "dnscache",
        insetDnsCache: {
          rows: [{ name: "google.com", ip: IP, ttl: "300s", fresh: true }],
          note: "Cached for 300 seconds — the next lookup is instant.",
        },
        caption: "One walk, then it's remembered.",
      },
    },
    {
      id: "b7-check",
      say: ["A quick check on why DNS usually feels instant."],
      interaction: {
        prompt: "You visit google.com again a few seconds later. What does the resolver do?",
        choices: [
          {
            id: "c1",
            label: "It walks root → .com → google.com's server all over again",
            correct: false,
            feedback: "That's exactly what caching avoids. The full walk only happens on a miss.",
          },
          {
            id: "c2",
            label: "It answers instantly from its cache, skipping the whole hierarchy",
            correct: true,
            feedback: "Right. Until the TTL expires, the answer is already in the cache — that's why DNS feels instant almost every time.",
          },
          {
            id: "c3",
            label: "It asks your browser for the IP it used last time",
            correct: false,
            feedback: "The browser doesn't know the IP — that's why it asked the resolver in the first place.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...YOU, badge: IP },
          { ...RES, highlight: true },
        ],
        links: [{ id: "l-yr", from: "you", to: "res", active: true }],
        inset: "dnscache",
        insetDnsCache: {
          rows: [{ name: "google.com", ip: IP, ttl: "300s" }],
          note: "Cache hit — instant answer, no walk needed.",
        },
        caption: "Names for humans, numbers for machines — and a directory in between.",
      },
    },
  ],
};
