import type { Chapter } from "@/types/journey";

// Network 1 (left island)
const A = { id: "pc-a", kind: "computer" as const, label: "A", x: 10, y: 30 };
const B = { id: "pc-b", kind: "computer" as const, label: "B", x: 24, y: 20 };
const C = { id: "pc-c", kind: "computer" as const, label: "C", x: 38, y: 30 };
const SW1 = { id: "sw1", kind: "switch" as const, label: "Switch", x: 24, y: 62 };

// Network 2 (right island)
const D = { id: "pc-d", kind: "computer" as const, label: "D", x: 62, y: 30 };
const E = { id: "pc-e", kind: "computer" as const, label: "E", x: 90, y: 30 };
const SW2 = { id: "sw2", kind: "switch" as const, label: "Switch", x: 76, y: 62 };

const NET1_LINKS = [
  { id: "l-a", from: "pc-a", to: "sw1" },
  { id: "l-b", from: "pc-b", to: "sw1" },
  { id: "l-c", from: "pc-c", to: "sw1" },
];
const NET2_LINKS = [
  { id: "l-d", from: "pc-d", to: "sw2" },
  { id: "l-e", from: "pc-e", to: "sw2" },
];

/**
 * Chapter 6 — a switch is master of its own network, but two separate networks
 * are islands. Flooding can't (and shouldn't) cross between them, and MAC
 * addresses are flat, so they can't scale to the whole world. This motivates a
 * layered address (IP) and a device that connects networks (a router).
 */
export const chapter06: Chapter = {
  id: "ch06",
  number: 6,
  slug: "another-network",
  question: "Why can't a switch reach another network?",
  title: "Two islands that can't talk",
  promise: "You'll see why separate networks need more than a switch to connect.",
  bridge:
    "So here's the wall we've hit. A switch is brilliant *inside* one network, but it has no idea another network even exists, and flooding the whole world can't work. We need two new things: an address that names *which network* a computer is on (not just its card), and a device that stands at the border between networks and passes messages across. That address is the *IP address*, and that border device is the *router*.",
  beats: [
    {
      id: "b1-happy",
      say: [
        "Here's the network you just built: three computers and a switch that delivers every frame to exactly the right port.",
        "Inside this little world, everything works perfectly. Call it *Network 1*.",
      ],
      stage: {
        nodes: [
          { ...A, badge: "Net 1" },
          { ...B, badge: "Net 1" },
          { ...C, badge: "Net 1" },
          { ...SW1, highlight: true },
        ],
        links: NET1_LINKS,
        caption: "One switch rules its own little network.",
      },
    },
    {
      id: "b2-island",
      say: [
        "Now, somewhere else — another building, another office — sits a *completely separate* network.",
        "Network 2 has its own switch and its own computers, D and E. The two networks have never met. No wire connects them.",
        "They are two islands in the sea.",
      ],
      reveal: "A network is a self-contained island of devices.",
      stage: {
        nodes: [
          { ...A, badge: "Net 1" },
          { ...B, badge: "Net 1" },
          { ...C, badge: "Net 1" },
          { ...SW1, label: "Switch · Net 1" },
          { ...D, badge: "Net 2" },
          { ...E, badge: "Net 2" },
          { ...SW2, label: "Switch · Net 2" },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Two separate networks, no connection between them.",
      },
    },
    {
      id: "b3-cantreach",
      say: [
        "A wants to send a message to D. But D isn't in this switch's table — it has never seen D, because D lives on the other island.",
        "With an unknown destination, the switch does the only thing it can: it *floods* its own ports.",
        "The flood fills Network 1… and stops dead at the switch's edge. There's no wire to Network 2, so D never hears a thing.",
      ],
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "wants → D" },
          { ...B, badge: "flood…" },
          { ...C, badge: "flood…" },
          { ...SW1, label: "Switch · Net 1" },
          { ...D, dim: true, badge: "never hears it" },
          { ...E, dim: true },
          { ...SW2, label: "Switch · Net 2", dim: true },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw1", active: true },
          { id: "l-b", from: "pc-b", to: "sw1", active: true },
          { id: "l-c", from: "pc-c", to: "sw1", active: true },
          ...NET2_LINKS,
        ],
        signals: [
          { id: "s-a", linkId: "l-a", from: "pc-a", label: "to D", color: "var(--accent)" },
          { id: "s-b", linkId: "l-b", from: "sw1", label: "flood", color: "var(--warn)" },
          { id: "s-c", linkId: "l-c", from: "sw1", label: "flood", color: "var(--warn)" },
        ],
        caption: "The flood can't leave the island. D is unreachable.",
      },
    },
    {
      id: "b4-justwire",
      say: [
        "“Fine,” you say, “let's just run one cable between the two switches!”",
        "Now a single flood from A spills across the wire and reaches *every* device on *both* networks — most of which didn't want it.",
        "Now imagine not two networks but *millions*. Every broadcast would flood the entire planet, and every switch would need a table listing every device on Earth. That collapses instantly.",
      ],
      reveal: "Joining everything into one flat network can't scale.",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "to D" },
          { ...B, badge: "flood…" },
          { ...C, badge: "flood…" },
          { ...SW1, label: "Switch · Net 1" },
          { ...D, badge: "flood…" },
          { ...E, badge: "flood…" },
          { ...SW2, label: "Switch · Net 2" },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw1", active: true },
          { id: "l-b", from: "pc-b", to: "sw1", active: true },
          { id: "l-c", from: "pc-c", to: "sw1", active: true },
          { id: "l-d", from: "pc-d", to: "sw2", active: true },
          { id: "l-e", from: "pc-e", to: "sw2", active: true },
          { id: "l-sw", from: "sw1", to: "sw2", active: true, label: "one big flat network?" },
        ],
        signals: [
          { id: "s-a", linkId: "l-a", from: "pc-a", label: "to D", color: "var(--accent)" },
          { id: "s-b", linkId: "l-b", from: "sw1", label: "flood", color: "var(--warn)" },
          { id: "s-c", linkId: "l-c", from: "sw1", label: "flood", color: "var(--warn)" },
          { id: "s-sw", linkId: "l-sw", from: "sw1", color: "var(--err)" },
          { id: "s-d", linkId: "l-d", from: "sw2", label: "flood", color: "var(--warn)" },
          { id: "s-e", linkId: "l-e", from: "sw2", label: "flood", color: "var(--warn)" },
        ],
        caption: "One shout reaches everyone. Multiply by millions — it drowns.",
      },
    },
    {
      id: "b5-domain",
      say: [
        "The lesson: flooding is fine *inside* one small network — that area is called a *broadcast domain*.",
        "But a broadcast must *stop* at the edge of its network. It can't be allowed to leak into the whole world.",
        "And the deeper problem is the address itself. A MAC address is *flat* — “card #00:1A:2B:00:00:0A” — it says nothing about *which network* the card is on. To route between networks, we need an address that names the network too.",
      ],
      reveal: "A broadcast domain: floods stay inside one network and stop at its edge.",
      stage: {
        nodes: [
          { ...A, badge: "Net 1" },
          { ...B, badge: "Net 1" },
          { ...C, badge: "Net 1" },
          { ...SW1, label: "Switch · Net 1" },
          { ...D, badge: "Net 2" },
          { ...E, badge: "Net 2" },
          { ...SW2, label: "Switch · Net 2" },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Keep the islands separate — but find a smart way to bridge them.",
      },
    },
    {
      id: "b6-check",
      say: ["A quick check on the limit we just found."],
      interaction: {
        prompt: "Why can't switches alone connect every computer on Earth into one network?",
        choices: [
          {
            id: "c1",
            label: "Switches are too slow to handle that much traffic",
            correct: false,
            feedback: "Speed isn't the core issue. The real problem is flooding and flat addressing, not raw speed.",
          },
          {
            id: "c2",
            label: "Every broadcast would flood the whole world, and MAC addresses don't say which network a device is on",
            correct: true,
            feedback:
              "Exactly. Flat MAC addresses plus world-wide flooding can't scale. We need a layered address and a device to separate networks.",
          },
          {
            id: "c3",
            label: "Switches can only ever have a fixed number of ports",
            correct: false,
            feedback:
              "Port count is a physical detail you can work around. The fundamental wall is broadcasting and flat addressing.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...A, badge: "Net 1" },
          { ...B, badge: "Net 1" },
          { ...C, badge: "Net 1" },
          { ...SW1, label: "Switch · Net 1" },
          { ...D, badge: "Net 2" },
          { ...E, badge: "Net 2" },
          { ...SW2, label: "Switch · Net 2" },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Two islands, and no good way yet to cross between them.",
      },
    },
    {
      id: "b7-bridge",
      say: [
        "We've found the wall: switches master a single network, but the world is made of *millions* of networks.",
        "We need an address with two parts — *which network*, and *which host inside it* — so a message can be aimed at a network it has never seen.",
        "And we need a device that sits on the border between networks and passes messages across by reading that network part. Meet the router.",
      ],
      stage: {
        nodes: [
          { ...A, dim: true, badge: "Net 1" },
          { ...B, dim: true, badge: "Net 1" },
          { ...C, dim: true, badge: "Net 1" },
          { ...SW1, label: "Switch · Net 1", dim: true },
          { ...D, dim: true, badge: "Net 2" },
          { ...E, dim: true, badge: "Net 2" },
          { ...SW2, label: "Switch · Net 2", dim: true },
          { id: "rt", kind: "router", label: "a border device?", x: 50, y: 80, dim: true },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Coming up: IP addresses and the router that joins networks.",
      },
    },
  ],
};
