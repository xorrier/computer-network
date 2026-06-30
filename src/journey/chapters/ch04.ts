import type { Chapter } from "@/types/journey";

const MAC_A = "00:1A:2B:00:00:0A";
const MAC_B = "00:1A:2B:00:00:0B";
const MAC_C = "00:1A:2B:00:00:0C";

/**
 * Chapter 4 — make identity concrete with the MAC address, wrap the raw bits
 * in an Ethernet frame (structure + to/from), and replay the shared-wire send
 * so the learner sees B drop the frame and C accept it.
 */
export const chapter04: Chapter = {
  id: "ch04",
  number: 4,
  slug: "mac-address",
  question: "What is a MAC address?",
  title: "A name burned into the hardware",
  promise: "You'll learn the address every network card is born with.",
  bridge:
    "Addresses ended the chaos — but notice the hub is still dumb. It copies every frame to every computer, even though only one of them wants it. That's wasteful and not private. What if a device could *learn* which computer sits on which port, and forward a frame only to the right one? That device is a switch.",
  beats: [
    {
      id: "b1-nic",
      say: [
        "Every computer talks to the network through a *network card* (a NIC).",
        "At the factory, each card is stamped with a permanent identity it will carry for life: its *MAC address*.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "Computer A", x: 50, y: 44, highlight: true, badge: MAC_A },
        ],
        caption: "One card, one lifelong address.",
      },
    },
    {
      id: "b2-format",
      say: [
        "A MAC address is 48 bits, usually written as six pairs of hex digits.",
        "The first three pairs identify the *manufacturer* (the OUI). The last three are a *unique serial* that maker assigns to that one card.",
        "Together they make an address that, in practice, no other card on Earth shares.",
      ],
      reveal: "MAC = 48-bit, globally unique hardware address.",
      stage: {
        nodes: [],
        inset: "mac",
        insetMac: MAC_A,
        caption: "Manufacturer prefix + unique device id.",
      },
    },
    {
      id: "b3-everyone",
      say: [
        "So now give all three computers their hardware addresses. Each one is different and permanent.",
        "Finally, every machine on the shared wire has a name we can put on a message.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 22, y: 26, badge: MAC_A },
          { id: "pc-b", kind: "computer", label: "B", x: 50, y: 20, badge: MAC_B },
          { id: "pc-c", kind: "computer", label: "C", x: 78, y: 26, badge: MAC_C },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64 },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub" },
          { id: "l-bh", from: "pc-b", to: "hub" },
          { id: "l-ch", from: "pc-c", to: "hub" },
        ],
        caption: "Three machines, three unique MAC addresses.",
      },
    },
    {
      id: "b4-frame",
      say: [
        "Remember B's old complaint — an endless stream of bits with no start, no end, no sender?",
        "We solve structure and identity in one move: wrap the data in a *frame*.",
        "A frame puts the destination MAC and source MAC right at the front, then the data, then a checksum to catch errors.",
      ],
      reveal: "An Ethernet frame wraps data with to/from MAC + an error check.",
      stage: {
        nodes: [],
        inset: "frame",
        insetFrame: { dst: MAC_C, src: MAC_A, payload: "hi" },
        caption: "Bits, finally given structure and identity.",
      },
    },
    {
      id: "b5-replay",
      say: [
        "Now replay A talking to C — but this time the frame says “to C, from A”.",
        "The hub still shouts it to everyone. But watch what each computer does when it reads the destination address.",
        "B sees “to C”, checks its own address, and *drops* the frame. C sees “to C”, matches, and *accepts* it. Order from chaos.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 22, y: 26, highlight: true, badge: "sends → C" },
          { id: "pc-b", kind: "computer", label: "B", x: 50, y: 20, badge: "✗ not me — drop" },
          { id: "pc-c", kind: "computer", label: "C", x: 78, y: 26, badge: "✓ it's me — keep" },
          { id: "hub", kind: "hub", label: "Hub", x: 50, y: 64 },
        ],
        links: [
          { id: "l-ah", from: "pc-a", to: "hub", active: true },
          { id: "l-bh", from: "pc-b", to: "hub", active: true },
          { id: "l-ch", from: "pc-c", to: "hub", active: true },
        ],
        signals: [
          { id: "s-ah", linkId: "l-ah", from: "pc-a", label: "to C", color: "var(--accent)" },
          { id: "s-hb", linkId: "l-bh", from: "hub", label: "to C", color: "var(--warn)" },
          { id: "s-hc", linkId: "l-ch", from: "hub", label: "to C", color: "var(--ok)" },
        ],
        caption: "Everyone hears it, but only C keeps it.",
      },
    },
    {
      id: "b6-check",
      say: ["One quick check on how a computer uses the destination MAC."],
      interaction: {
        prompt: "B receives a frame whose destination MAC is C's. What does B do?",
        choices: [
          {
            id: "c1",
            label: "Forward it on to C",
            correct: false,
            feedback: "No — B is just an end computer, not a forwarder. It only cares about frames addressed to itself.",
          },
          {
            id: "c2",
            label: "Read the destination, see it isn't its own MAC, and drop it",
            correct: true,
            feedback: "Exactly. Each computer compares the destination MAC to its own and ignores frames that aren't for it.",
          },
          {
            id: "c3",
            label: "Accept and open it anyway",
            correct: false,
            feedback: "That would break privacy. A well-behaved card discards frames not addressed to it.",
          },
        ],
      },
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 22, y: 26, badge: MAC_A },
          { id: "pc-b", kind: "computer", label: "B", x: 50, y: 20, badge: MAC_B },
          { id: "pc-c", kind: "computer", label: "C", x: 78, y: 26, badge: MAC_C },
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
      id: "b7-bridge",
      say: [
        "We did it: bits have structure, computers have names, and messages reach the right machine.",
        "But the hub is wasteful — it still copies every frame to *everyone*, who then throw most away. That wastes the wire and leaks every message to every machine.",
        "What if one device could *remember* which MAC lives on which port, and send a frame only where it belongs?",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "A", x: 22, y: 26, dim: true },
          { id: "pc-b", kind: "computer", label: "B", x: 50, y: 20, dim: true },
          { id: "pc-c", kind: "computer", label: "C", x: 78, y: 26, dim: true },
          { id: "sw", kind: "switch", label: "a smarter box?", x: 50, y: 64, dim: true },
        ],
        caption: "Coming up: a device that learns and forwards precisely.",
      },
    },
  ],
};
