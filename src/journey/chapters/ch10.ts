import type { Chapter } from "@/types/journey";

const YOU = { id: "you", kind: "browser" as const, label: "Your browser", x: 20, y: 44 };
const SRV = { id: "srv", kind: "server" as const, label: "google's server", x: 80, y: 44 };

const GAP_LINK = { id: "l-gap", from: "you", to: "srv", dashed: true };

/**
 * Chapter 10 — the name/address gap. Humans type memorable names; machines can
 * only send packets to IP addresses. Names are stable and hierarchical; a
 * single global list can't scale. This frames the exact problem DNS solves next.
 */
export const chapter10: Chapter = {
  id: "ch10",
  number: 10,
  slug: "names-vs-addresses",
  question: "I typed google.com — what is that name?",
  title: "Names for humans, numbers for machines",
  promise: "You'll see why we type names, and why a computer still can't use one directly.",
  bridge:
    "So a name is a friendly label, and the machine underneath needs an IP address. Between the two sits a gap that *something* must close: give it “google.com”, get back “142.250.72.14”. A single giant list can't do it for the whole planet. We need a fast, shared, worldwide directory — organized by those dots in the name. That directory is DNS.",
  beats: [
    {
      id: "b1-wall",
      say: [
        "You open your browser, type *google.com*, and press Enter. Simple — for you.",
        "But your computer is stuck. Everything it learned to do — frames, IP, routing — needs an *IP address* as the destination.",
        "“google.com” is just text. The computer has no idea which server on Earth that points to.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "google.com" },
          { ...SRV, dim: true, badge: "?.?.?.?" },
        ],
        links: [{ ...GAP_LINK, label: "where do I even send this?" }],
        caption: "A name means nothing to the network — yet.",
      },
    },
    {
      id: "b2-whynames",
      say: [
        "Why not just type the number, then? Because the number is 142.250.72.14 — and nobody remembers that.",
        "Worse, it *changes*. Big services move between servers and data centres constantly, so the IP behind a site isn't fixed.",
        "A *name* stays the same even when the address behind it changes. Names are for humans; numbers are for machines.",
      ],
      reveal: "A name is memorable and stable; the IP behind it can change freely.",
      stage: {
        nodes: [
          { ...YOU, badge: "google.com (never changes)" },
          { ...SRV, badge: "142.250.72.14 (may change)" },
        ],
        links: [{ ...GAP_LINK, label: "same name, different numbers over time" }],
        caption: "One steady name in front of an address that can move.",
      },
    },
    {
      id: "b3-structure",
      say: [
        "A name isn't random text — it has structure, and you read it *right to left*.",
        "“.com” is a huge group of sites. “google” is one organization inside it. “www” is a specific machine that organization runs.",
        "It's a hierarchy, like an address that goes country → city → house. Hold onto that shape — it's the secret to searching efficiently.",
      ],
      reveal: "A domain name is a right-to-left hierarchy: TLD → domain → host.",
      stage: {
        nodes: [],
        inset: "hostname",
        insetHostname: { name: "www.google.com" },
        caption: "Broad on the right, specific on the left.",
      },
    },
    {
      id: "b4-gap",
      say: [
        "So here's the whole problem in one picture. On one side, a name you can remember. On the other, the IP the network actually needs.",
        "In between is a gap — and something has to translate across it: hand it a name, get back an address.",
        "Your computer needs a *phonebook* for the Internet.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "google.com" },
          { ...SRV, highlight: true, badge: "142.250.72.14" },
        ],
        links: [{ ...GAP_LINK, label: "name  →  ???  →  IP" }],
        caption: "Close this gap and the browser can finally send its packet.",
      },
    },
    {
      id: "b5-onelist",
      say: [
        "The obvious idea: keep one giant file listing every name and its IP, and give a copy to every computer. Early networks actually did this.",
        "But think about the scale — *hundreds of millions* of names, changing every second, on every device on Earth.",
        "One file can't be updated fast enough or shared widely enough. The directory has to be *distributed* and *hierarchical* — exactly like the name itself.",
      ],
      reveal: "One global list can't scale — the directory must be distributed and hierarchical.",
      stage: {
        nodes: [
          { ...YOU, badge: "google.com" },
          { ...SRV, badge: "142.250.72.14" },
        ],
        links: [{ ...GAP_LINK, label: "one giant list? ✗ can't scale" }],
        caption: "A single phonebook for the planet is impossible to maintain.",
      },
    },
    {
      id: "b6-check",
      say: ["A quick check on why names exist at all."],
      interaction: {
        prompt: "Why do we type names like google.com instead of the IP address directly?",
        choices: [
          {
            id: "c1",
            label: "Names travel across the network faster than numbers",
            correct: false,
            feedback: "Speed isn't it — the network still uses the IP underneath. Names are for people, not for wire speed.",
          },
          {
            id: "c2",
            label: "Names are easy to remember and stay the same even when the IP behind them changes",
            correct: true,
            feedback: "Exactly. A stable, memorable name hides an IP that can move between servers at any time.",
          },
          {
            id: "c3",
            label: "Computers can't understand IP addresses",
            correct: false,
            feedback: "It's the opposite — computers only understand IP addresses. It's humans who need the names.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...YOU, badge: "google.com" },
          { ...SRV, badge: "142.250.72.14" },
        ],
        links: [{ ...GAP_LINK, label: "name ↔ IP" }],
        caption: "Names for humans, numbers for machines.",
      },
    },
    {
      id: "b7-bridge",
      say: [
        "You now know the split: you speak in names, the network moves on numbers, and a translator has to sit between them.",
        "That translator must be fast enough for billions of lookups a day and organized by the dots in every name.",
        "It already exists, quietly running every time you open a site. It's called DNS — and next, we'll watch it turn a name into an address, step by step.",
      ],
      stage: {
        nodes: [
          { ...YOU, dim: true, badge: "google.com" },
          { id: "dns", kind: "dns", label: "the translator?", x: 50, y: 44, dim: true },
          { ...SRV, dim: true, badge: "142.250.72.14" },
        ],
        links: [
          { id: "l-yd", from: "you", to: "dns", dashed: true },
          { id: "l-ds", from: "dns", to: "srv", dashed: true },
        ],
        caption: "Coming up: DNS, the Internet's directory.",
      },
    },
  ],
};
