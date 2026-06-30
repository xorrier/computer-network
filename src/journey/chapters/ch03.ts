import type { Chapter } from "@/types/journey";

const A = { id: "pc-a", kind: "computer" as const, label: "A" };
const B = { id: "pc-b", kind: "computer" as const, label: "B" };
const C = { id: "pc-c", kind: "computer" as const, label: "C" };

/**
 * Chapter 3 — fix the cable explosion with one shared connector (a hub), and
 * discover the new problem it creates: on a shared wire, everyone hears
 * everything. That forces the idea of a unique identity per computer.
 */
export const chapter03: Chapter = {
  id: "ch03",
  number: 3,
  slug: "computer-identity",
  question: "Why does each computer need an identity?",
  title: "Everyone hears everything",
  promise: "You'll see why messages must carry a “from” and a “to”.",
  bridge:
    "Now we know every computer needs a unique, permanent name so messages can be addressed. But what should that name be? Where does it come from, and how do we guarantee that no two computers on Earth ever share one? Meet the MAC address.",
  beats: [
    {
      id: "b1-recap",
      say: [
        "Last chapter we hit a wall: connecting every computer directly needs a wire for every pair.",
        "Three computers, three wires. Four need six. A hundred would need nearly five thousand. This cannot scale.",
      ],
      stage: {
        nodes: [
          { ...A, x: 30, y: 28 },
          { ...B, x: 70, y: 28 },
          { ...C, x: 50, y: 74 },
        ],
        links: [
          { id: "l-ab", from: "pc-a", to: "pc-b" },
          { id: "l-ac", from: "pc-a", to: "pc-c" },
          { id: "l-bc", from: "pc-b", to: "pc-c" },
        ],
        caption: "A tangle of point-to-point wires.",
      },
    },
    {
      id: "b2-hub",
      say: [
        "Here's a cheaper idea: instead of wiring every pair, give everyone *one* cable to a single shared box.",
        "This box is called a *hub*. Now N computers need only N cables — not N². The explosion is gone.",
      ],
      reveal: "A shared connector (hub) means N cables, not N².",
      stage: {
        nodes: [
          { ...A, x: 22, y: 26 },
          { ...B, x: 50, y: 20 },
          { ...C, x: 78, y: 26 },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64, highlight: true },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub" },
          { id: "l-bh", from: "pc-b", to: "hub" },
          { id: "l-ch", from: "pc-c", to: "hub" },
        ],
        caption: "One shared box, one cable each.",
      },
    },
    {
      id: "b3-broadcast",
      say: [
        "But a hub is gloriously dumb. It does not think — it just *repeats*.",
        "When A sends bits in, the hub copies them straight back out to *every* other port. Watch: A's message reaches both B and C.",
      ],
      stage: {
        nodes: [
          { ...A, x: 22, y: 26, highlight: true },
          { ...B, x: 50, y: 20 },
          { ...C, x: 78, y: 26 },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64 },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub", active: true },
          { id: "l-bh", from: "pc-b", to: "hub", active: true },
          { id: "l-ch", from: "pc-c", to: "hub", active: true },
        ],
        signals: [
          { id: "s-ah", linkId: "l-ah", from: "pc-a", color: "var(--accent)" },
          { id: "s-hb", linkId: "l-bh", from: "hub", color: "var(--warn)" },
          { id: "s-hc", linkId: "l-ch", from: "hub", color: "var(--warn)" },
        ],
        caption: "A speaks → the hub shouts it to everyone.",
      },
    },
    {
      id: "b4-problem",
      say: [
        "See the problem? A wanted to talk to C — but B received the message too.",
        "B has no idea this wasn't meant for it. And C has no idea who sent it. On a shared wire there is no privacy and no sender.",
        "Each computer urgently needs a way to answer two questions: *is this for me?* and *who is it from?*",
      ],
      stage: {
        nodes: [
          { ...A, x: 22, y: 26 },
          { ...B, x: 50, y: 20, highlight: true, badge: "for me??" },
          { ...C, x: 78, y: 26, badge: "from who??" },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64 },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub" },
          { id: "l-bh", from: "pc-b", to: "hub" },
          { id: "l-ch", from: "pc-c", to: "hub" },
        ],
        caption: "Chaos: nobody can tell who a message belongs to.",
      },
    },
    {
      id: "b5-check",
      say: ["Let's make sure the core problem is crystal clear."],
      interaction: {
        prompt: "On a hub, when A sends a message intended for C, who physically receives the signal?",
        choices: [
          {
            id: "c1",
            label: "Only C — the hub delivers it precisely",
            correct: false,
            feedback: "Not yet. A hub makes no decisions — it has no idea who C is. It copies bits to everyone.",
          },
          {
            id: "c2",
            label: "Every computer on the shared wire (A, B, and C's ports)",
            correct: true,
            feedback: "Right. The hub blindly repeats to all ports. That's exactly why we need addresses.",
          },
          {
            id: "c3",
            label: "Only the hub keeps it",
            correct: false,
            feedback: "The hub doesn't keep messages — it immediately repeats them out to every other port.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...A, x: 22, y: 26 },
          { ...B, x: 50, y: 20 },
          { ...C, x: 78, y: 26 },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64 },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub" },
          { id: "l-bh", from: "pc-b", to: "hub" },
          { id: "l-ch", from: "pc-c", to: "hub" },
        ],
      },
    },
    {
      id: "b6-identity",
      say: [
        "The fix is simple to state: give every computer a *unique identity* — a name no one else shares.",
        "Then every message can carry two labels: the *destination* (who it's for) and the *source* (who sent it).",
        "Each computer reads the destination label and asks one question: “Is that me?” If not, it ignores the message.",
      ],
      reveal: "Every computer needs a unique address; messages carry to + from.",
      stage: {
        nodes: [
          { ...A, x: 22, y: 26, badge: "identity?" },
          { ...B, x: 50, y: 20, badge: "identity?" },
          { ...C, x: 78, y: 26, badge: "identity?" },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64 },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub" },
          { id: "l-bh", from: "pc-b", to: "hub" },
          { id: "l-ch", from: "pc-c", to: "hub" },
        ],
        caption: "Each machine needs a name of its own.",
      },
    },
    {
      id: "b7-bridge",
      say: [
        "So identity is the missing piece. But a name only works if it's *guaranteed unique* — two computers with the same name would be chaos all over again.",
        "How do we hand out billions of names that never collide? The answer is built right into the hardware: the MAC address.",
      ],
      stage: {
        nodes: [
          { ...A, x: 22, y: 26, dim: true },
          { ...B, x: 50, y: 20, dim: true },
          { ...C, x: 78, y: 26, dim: true },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64, dim: true },
        ],
        inset: "mac",
        insetMac: "00:1A:2B:3C:4D:5E",
        caption: "Coming up: a globally unique hardware name.",
      },
    },
  ],
};
