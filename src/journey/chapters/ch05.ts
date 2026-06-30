import type { Chapter } from "@/types/journey";

const MAC_A = "00:1A:2B:00:00:0A";
const MAC_B = "00:1A:2B:00:00:0B";
const MAC_C = "00:1A:2B:00:00:0C";

// Shared node positions: three computers around a central box.
const A = { id: "pc-a", kind: "computer" as const, label: "A", x: 20, y: 24 };
const B = { id: "pc-b", kind: "computer" as const, label: "B", x: 50, y: 18 };
const C = { id: "pc-c", kind: "computer" as const, label: "C", x: 80, y: 24 };

const LINKS = [
  { id: "l-a", from: "pc-a", to: "sw" },
  { id: "l-b", from: "pc-b", to: "sw" },
  { id: "l-c", from: "pc-c", to: "sw" },
];

/**
 * Chapter 5 — replace the dumb hub with a switch. The single new idea: the
 * switch *learns* which MAC lives on which port by reading the source address
 * of every frame. First send floods (it knows nothing yet); after learning, it
 * forwards each frame only to the port that owns the destination MAC.
 */
export const chapter05: Chapter = {
  id: "ch05",
  number: 5,
  slug: "the-switch",
  question: "The hub shouts to everyone — what is a switch?",
  title: "A box that learns who lives where",
  promise: "You'll see how a switch sends each frame to exactly the right computer.",
  bridge:
    "Beautiful — inside this little network, frames now go straight to the right computer, privately and efficiently. But notice every device still shares one flat space: the switch knows A, B and C only because they're all plugged into it. What happens when you want to reach a computer in a *different* building, on a *different* network the switch has never seen? A MAC table can't hold every device on Earth. We need a bigger idea about where things live.",
  beats: [
    {
      id: "b1-swap",
      say: [
        "Let's throw out the hub and plug everyone into a *switch* instead.",
        "It looks almost the same — three computers, one central box. The difference is on the inside.",
        "A switch keeps a little table: *which MAC address lives on which port*. Right now that table is completely empty — it was just powered on and knows nothing.",
      ],
      reveal: "A switch has ports, and a table mapping MAC → port.",
      stage: {
        nodes: [
          { ...A, badge: MAC_A },
          { ...B, badge: MAC_B },
          { ...C, badge: MAC_C },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66, highlight: true },
        ],
        links: LINKS,
        inset: "mactable",
        insetMacTable: {
          rows: [],
          note: "Each cable plugs into a numbered port. The switch will fill this in by itself.",
        },
        caption: "Same shape as the hub — but with a memory.",
      },
    },
    {
      id: "b2-firstsend",
      say: [
        "A wants to send a frame to C. The frame says “to C, from A”.",
        "The switch reads the frame as it arrives on *port 1*. The source is A — so the switch writes down its first fact: *MAC A is on port 1*.",
        "But it still doesn't know where C is. With no entry for C, it has no choice: this first time it must *flood* the frame out every other port, just like the old hub.",
      ],
      reveal: "Unknown destination ⇒ the switch floods (sends to all ports).",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "sends → C" },
          { ...B, badge: "flood…" },
          { ...C, badge: "flood…" },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66 },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw", active: true },
          { id: "l-b", from: "pc-b", to: "sw", active: true },
          { id: "l-c", from: "pc-c", to: "sw", active: true },
        ],
        signals: [
          { id: "s-a", linkId: "l-a", from: "pc-a", label: "to C", color: "var(--accent)" },
          { id: "s-b", linkId: "l-b", from: "sw", label: "flood", color: "var(--warn)" },
          { id: "s-c", linkId: "l-c", from: "sw", label: "flood", color: "var(--ok)" },
        ],
        inset: "mactable",
        insetMacTable: {
          rows: [{ port: "Port 1", mac: MAC_A, fresh: true }],
          note: "Learned from the source address of the very first frame.",
        },
        caption: "It floods once — but it just learned where A lives.",
      },
    },
    {
      id: "b3-reply",
      say: [
        "C got the frame and replies: “to A, from C”.",
        "This frame arrives on *port 3*. The switch reads the source — C — and records its second fact: *MAC C is on port 3*.",
        "And because it already knows A is on port 1, it sends C's reply *only* out port 1. B never sees it.",
      ],
      stage: {
        nodes: [
          { ...A, badge: "← reply" },
          { ...B, dim: true, badge: "(nothing)" },
          { ...C, highlight: true, badge: "replies → A" },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66 },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw", active: true },
          { id: "l-b", from: "pc-b", to: "sw" },
          { id: "l-c", from: "pc-c", to: "sw", active: true },
        ],
        signals: [
          { id: "s-c", linkId: "l-c", from: "pc-c", label: "to A", color: "var(--accent)" },
          { id: "s-a", linkId: "l-a", from: "sw", label: "to A", color: "var(--accent)" },
        ],
        inset: "mactable",
        insetMacTable: {
          rows: [
            { port: "Port 1", mac: MAC_A },
            { port: "Port 3", mac: MAC_C, fresh: true },
          ],
          note: "Two facts learned. B isn't in the table yet — and didn't need to hear this.",
        },
        caption: "The reply goes straight to A. B is left in peace.",
      },
    },
    {
      id: "b4-known",
      say: [
        "Now A sends to C *again*. This time the table already says *C is on port 3*.",
        "The switch looks up C, finds port 3, and forwards the frame out *only* that port.",
        "B hears nothing. No flooding, no wasted wire, no leaking private data. This is the whole magic: *learn from the source, forward by the destination*.",
      ],
      reveal: "Known destination ⇒ the switch forwards to exactly one port (unicast).",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "sends → C" },
          { ...B, dim: true, badge: "(nothing)" },
          { ...C, badge: "✓ receives" },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66 },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw", active: true },
          { id: "l-b", from: "pc-b", to: "sw" },
          { id: "l-c", from: "pc-c", to: "sw", active: true },
        ],
        signals: [
          { id: "s-a", linkId: "l-a", from: "pc-a", label: "to C", color: "var(--accent)" },
          { id: "s-c", linkId: "l-c", from: "sw", label: "to C", color: "var(--accent)" },
        ],
        inset: "mactable",
        insetMacTable: {
          rows: [
            { port: "Port 1", mac: MAC_A },
            { port: "Port 3", mac: MAC_C },
          ],
          note: "Destination C is known → forward out port 3 only.",
        },
        caption: "Precise delivery. Compare this to the hub shouting at everyone.",
      },
    },
    {
      id: "b5-contrast",
      say: [
        "So a hub and a switch look identical from the outside, but behave completely differently.",
        "A *hub* copies every frame to every port, always. Every machine hears every conversation, and the wire is shared.",
        "A *switch* floods only when it doesn't yet know a destination; once learned, every frame takes a private, direct path. The table fills in within the first moments of traffic.",
      ],
      stage: {
        nodes: [
          { ...A, badge: MAC_A },
          { ...B, badge: MAC_B },
          { ...C, badge: MAC_C },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66 },
        ],
        links: LINKS,
        inset: "mactable",
        insetMacTable: {
          rows: [
            { port: "Port 1", mac: MAC_A },
            { port: "Port 2", mac: MAC_B },
            { port: "Port 3", mac: MAC_C },
          ],
          note: "After a little traffic, the switch knows where everyone lives.",
        },
        caption: "Hub = shout. Switch = whisper to the right port.",
      },
    },
    {
      id: "b6-check",
      say: ["Quick check on how the switch makes its decision."],
      interaction: {
        prompt:
          "A frame arrives for a destination MAC the switch already has in its table. What does the switch do?",
        choices: [
          {
            id: "c1",
            label: "Flood it out every port to be safe",
            correct: false,
            feedback:
              "That's what a hub does, and what a switch only does when the destination is unknown. Here it already knows the port.",
          },
          {
            id: "c2",
            label: "Look up the destination's port and forward the frame out only that port",
            correct: true,
            feedback:
              "Exactly. A known destination means a direct, single-port delivery — efficient and private.",
          },
          {
            id: "c3",
            label: "Drop the frame because it isn't addressed to the switch",
            correct: false,
            feedback:
              "A switch forwards frames between computers — it isn't the final destination, so it doesn't drop them.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...A, badge: MAC_A },
          { ...B, badge: MAC_B },
          { ...C, badge: MAC_C },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66 },
        ],
        links: LINKS,
        inset: "mactable",
        insetMacTable: {
          rows: [
            { port: "Port 1", mac: MAC_A },
            { port: "Port 2", mac: MAC_B },
            { port: "Port 3", mac: MAC_C },
          ],
        },
      },
    },
    {
      id: "b7-bridge",
      say: [
        "You've upgraded the network from a noisy shared wire to a smart switch that delivers each frame precisely.",
        "But every computer here is known only because it's plugged into this one switch. Its table maps MACs that all sit in the *same* local network.",
        "What if C lived in another building, on a network this switch has never met? MAC addresses are flat — there's no way to say “that machine is over *there*.” We need a new kind of address that describes *where* a network is.",
      ],
      stage: {
        nodes: [
          { ...A, dim: true, badge: MAC_A },
          { ...B, dim: true, badge: MAC_B },
          { ...C, dim: true, badge: MAC_C },
          { id: "sw", kind: "switch", label: "Switch", x: 50, y: 66, dim: true },
          { id: "far", kind: "computer", label: "?? another network", x: 50, y: 90, dim: true },
        ],
        links: LINKS,
        caption: "Coming up: reaching computers beyond your own network.",
      },
    },
  ],
};
