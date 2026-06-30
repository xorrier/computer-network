import type { Chapter } from "@/types/journey";

/**
 * Chapter 2 — connect two computers with a single wire, send bits across it,
 * then expose the two problems that wire creates: no structure/identity, and
 * cabling that explodes as you add more computers.
 */
export const chapter02: Chapter = {
  id: "ch02",
  number: 2,
  slug: "two-computers",
  question: "How do two computers physically talk?",
  title: "The first wire",
  promise: "You'll build the simplest possible network: two machines and a link.",
  bridge:
    "A single wire works for two computers — but the moment you add more friends, the cables explode, and the receiver still can't tell where a message starts or who it's from. We need each computer to have a name, and one shared connector instead of a tangle of wires.",
  beats: [
    {
      id: "b1-second",
      say: [
        "Meet a second computer. Same as the first: it turns bits into signals and signals back into bits.",
        "You want to send it a simple message: *hi*. How do we get your computer's signals into *its* wire?",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "Computer A", x: 28, y: 48, highlight: true },
          { id: "pc-b", kind: "computer", label: "Computer B", x: 72, y: 48 },
        ],
        caption: "Two machines, no connection yet.",
      },
    },
    {
      id: "b2-wire",
      say: [
        "The answer is delightfully simple: run a *wire* between them.",
        "This is the smallest possible network in the world — two computers joined by a single physical link.",
      ],
      reveal: "A link is a physical path that carries bits between two machines.",
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "Computer A", x: 28, y: 48 },
          { id: "pc-b", kind: "computer", label: "Computer B", x: 72, y: 48 },
        ],
        links: [{ id: "l-ab", from: "pc-a", to: "pc-b", label: "a single wire" }],
        caption: "One wire = the simplest network there is.",
      },
    },
    {
      id: "b3-send",
      say: [
        "Now watch the message travel. Computer A flips its voltage high and low in the pattern for “hi”.",
        "Computer B simply *watches the wire* and reads the highs and lows back into bits. The message arrives.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "Computer A", x: 28, y: 48, highlight: true },
          { id: "pc-b", kind: "computer", label: "Computer B", x: 72, y: 48 },
        ],
        links: [{ id: "l-ab", from: "pc-a", to: "pc-b", active: true }],
        signals: [{ id: "s1", linkId: "l-ab", from: "pc-a", label: "bits", color: "var(--accent)" }],
        caption: "Bits flowing from A to B as voltage changes.",
      },
    },
    {
      id: "b4-structure",
      say: [
        "It works! But look closer at B's problem: it sees an *endless* stream of highs and lows.",
        "Where does the message start? Where does it end? And if other computers existed, *who* is this even from?",
        "Raw bits on a wire have no structure and no identity. Hold that thought — it returns very soon.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "Computer A", x: 28, y: 48 },
          { id: "pc-b", kind: "computer", label: "Computer B", x: 72, y: 48, highlight: true },
        ],
        links: [{ id: "l-ab", from: "pc-a", to: "pc-b", active: true }],
        signals: [{ id: "s1", linkId: "l-ab", from: "pc-a", color: "var(--accent)" }],
        caption: "…1011010010110100… where does it begin?",
      },
    },
    {
      id: "b5-scale",
      say: [
        "Now the bigger problem. Add a third computer, and you need a wire to *each* of the others.",
        "Four computers need six wires. Ten need forty-five. A hundred computers would need nearly *five thousand* cables.",
        "Connecting every machine directly clearly cannot scale.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 30, y: 26 },
          { id: "pc-b", kind: "computer", label: "B", x: 70, y: 26 },
          { id: "pc-c", kind: "computer", label: "C", x: 78, y: 72 },
          { id: "pc-d", kind: "computer", label: "D", x: 22, y: 72 },
        ],
        links: [
          { id: "l-ab", from: "pc-a", to: "pc-b" },
          { id: "l-ac", from: "pc-a", to: "pc-c" },
          { id: "l-ad", from: "pc-a", to: "pc-d" },
          { id: "l-bc", from: "pc-b", to: "pc-c" },
          { id: "l-bd", from: "pc-b", to: "pc-d" },
          { id: "l-cd", from: "pc-c", to: "pc-d" },
        ],
        caption: "4 computers already need 6 cables. This explodes fast.",
      },
    },
    {
      id: "b6-check",
      say: ["Let's name the two problems our single wire created."],
      interaction: {
        prompt: "What two problems must we solve before going further?",
        choices: [
          {
            id: "c1",
            label: "Bits are too slow, and wires are too expensive",
            correct: false,
            feedback: "Speed and cost matter, but they're not the core issue here. Think about identity and scale.",
          },
          {
            id: "c2",
            label: "Messages need structure & identity, and direct cabling doesn't scale",
            correct: true,
            feedback: "Exactly. We need each computer to have a name, and one shared connector instead of a wire to everyone.",
          },
          {
            id: "c3",
            label: "Computers can't read voltage, and signals fade",
            correct: false,
            feedback: "Reading voltage already works — B received the message. The real gaps are identity and scalability.",
          },
        ],
      },
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 30, y: 26 },
          { id: "pc-b", kind: "computer", label: "B", x: 70, y: 26 },
          { id: "pc-c", kind: "computer", label: "C", x: 78, y: 72 },
          { id: "pc-d", kind: "computer", label: "D", x: 22, y: 72 },
        ],
        links: [
          { id: "l-ab", from: "pc-a", to: "pc-b" },
          { id: "l-ac", from: "pc-a", to: "pc-c" },
          { id: "l-ad", from: "pc-a", to: "pc-d" },
          { id: "l-bc", from: "pc-b", to: "pc-c" },
          { id: "l-bd", from: "pc-b", to: "pc-d" },
          { id: "l-cd", from: "pc-c", to: "pc-d" },
        ],
      },
    },
    {
      id: "b7-bridge",
      say: [
        "So a wire gets bits from A to B — but it can't tell B who sent them, and it can't connect a whole room of computers.",
        "Our next move: give every computer a permanent *name* so messages can be addressed. That name is the MAC address.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 30, y: 30, badge: "who am I?" },
          { id: "pc-b", kind: "computer", label: "B", x: 70, y: 30, badge: "who are you?" },
          { id: "hub", kind: "switch", label: "one shared connector?", x: 50, y: 70, dim: true },
        ],
        caption: "Coming up: identities, and a single shared connector.",
      },
    },
  ],
};
