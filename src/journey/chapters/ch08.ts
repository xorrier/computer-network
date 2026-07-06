import type { Chapter } from "@/types/journey";

// Network 1 (192.168.1.0/24)
const A = { id: "pc-a", kind: "computer" as const, label: "A", x: 9, y: 28 };
const B = { id: "pc-b", kind: "computer" as const, label: "B", x: 22, y: 18 };
const C = { id: "pc-c", kind: "computer" as const, label: "C", x: 35, y: 28 };
const SW1 = { id: "sw1", kind: "switch" as const, label: "Switch · Net 1", x: 24, y: 58 };

// Router on the border
const RT = { id: "rt", kind: "router" as const, label: "Router", x: 50, y: 58 };

// Network 2 (10.0.0.0/24)
const D = { id: "pc-d", kind: "computer" as const, label: "D", x: 65, y: 28 };
const E = { id: "pc-e", kind: "computer" as const, label: "E", x: 91, y: 28 };
const SW2 = { id: "sw2", kind: "switch" as const, label: "Switch · Net 2", x: 76, y: 58 };

const BASE_LINKS = [
  { id: "l-a", from: "pc-a", to: "sw1" },
  { id: "l-b", from: "pc-b", to: "sw1" },
  { id: "l-c", from: "pc-c", to: "sw1" },
  { id: "l-r1", from: "sw1", to: "rt" },
  { id: "l-r2", from: "rt", to: "sw2" },
  { id: "l-d", from: "pc-d", to: "sw2" },
  { id: "l-e", from: "pc-e", to: "sw2" },
];

const IP_A = "192.168.1.10";
const IP_D = "10.0.0.20";
const GW1 = "192.168.1.1"; // router's Net 1 interface
const GW2 = "10.0.0.1"; // router's Net 2 interface

/**
 * Chapter 8 — the router finally joins the two islands. It has one interface
 * (and IP) on each network, and a routing table mapping destination networks to
 * outgoing interfaces. It forwards by the *network part* of the destination IP.
 * The big reveal: the IP stays constant end-to-end while the MAC frame is
 * rewritten at each hop.
 */
export const chapter08: Chapter = {
  id: "ch08",
  number: 8,
  slug: "the-router",
  question: "What problem does a router solve?",
  title: "The device that joins networks",
  promise: "You'll watch a packet finally cross from one network to another.",
  bridge:
    "A packet just crossed from one network to a completely different one — the two islands are joined. But we only have two networks and one router. The real Internet is *millions* of networks and routers, and no single router could possibly list a route to every network on Earth. How do packets find their way across the whole planet, and how does your home get an address the rest of the world can reach? That's the Internet itself.",
  beats: [
    {
      id: "b1-border",
      say: [
        "Here's the device that breaks the deadlock: a *router*. We place it on the border between the two networks.",
        "Unlike a computer, a router has a foot in *both* networks — one interface (and IP) on each side.",
        "On Network 1 it's 192.168.1.1. On Network 2 it's 10.0.0.1. It genuinely belongs to both.",
      ],
      reveal: "A router has one interface — and one IP — on each network it joins.",
      stage: {
        nodes: [
          { ...A, badge: IP_A },
          { ...B },
          { ...C },
          { ...SW1 },
          { ...RT, highlight: true, badge: `${GW1} | ${GW2}` },
          { ...D, badge: IP_D },
          { ...E },
          { ...SW2 },
        ],
        links: BASE_LINKS,
        caption: "One router, standing in both networks at once.",
      },
    },
    {
      id: "b2-gateway",
      say: [
        "Each computer is told one extra thing: its *default gateway* — the router's address on its own network.",
        "The rule is simple. If a destination is on *my* network, talk to it directly. If it's *remote*, hand the packet to my gateway and let the router deal with it.",
        "For A, the gateway is 192.168.1.1 — the router's near side.",
      ],
      reveal: "Default gateway: where a computer sends anything bound for another network.",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "gateway → 192.168.1.1" },
          { ...B },
          { ...C },
          { ...SW1 },
          { ...RT, badge: GW1 },
          { ...D, badge: IP_D },
          { ...E },
          { ...SW2 },
        ],
        links: BASE_LINKS,
        caption: "“If it's not local, send it to the router.”",
      },
    },
    {
      id: "b2b-arp",
      say: [
        "One catch before A can send: it knows the gateway's *IP* (192.168.1.1), but a frame needs a destination *MAC*. How does A learn it?",
        "A shouts a broadcast to the whole local network: *“who has 192.168.1.1?”* This little question is called *ARP* (Address Resolution Protocol).",
        "The router recognizes its own IP and replies, *“that's me — here's my MAC.”* A caches that answer, so it only has to ask once.",
      ],
      reveal: "ARP finds the MAC for a known IP by asking the local network.",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "who has .1?" },
          { ...B, badge: "not me" },
          { ...C, badge: "not me" },
          { ...SW1 },
          { ...RT, highlight: true, badge: "that's me → my MAC" },
          { ...D, dim: true },
          { ...E, dim: true },
          { ...SW2, dim: true },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw1", active: true },
          { id: "l-b", from: "pc-b", to: "sw1", active: true },
          { id: "l-c", from: "pc-c", to: "sw1", active: true },
          { id: "l-r1", from: "sw1", to: "rt", active: true },
          { id: "l-r2", from: "rt", to: "sw2" },
          { id: "l-d", from: "pc-d", to: "sw2" },
          { id: "l-e", from: "pc-e", to: "sw2" },
        ],
        signals: [
          { id: "s-arp-a", linkId: "l-a", from: "pc-a", label: "ARP", color: "var(--warn)" },
          { id: "s-arp-b", linkId: "l-b", from: "sw1", label: "who has .1?", color: "var(--warn)" },
          { id: "s-arp-c", linkId: "l-c", from: "sw1", label: "who has .1?", color: "var(--warn)" },
          { id: "s-arp-r", linkId: "l-r1", from: "sw1", label: "who has .1?", color: "var(--warn)" },
        ],
        caption: "ARP: broadcast the IP, learn the MAC that owns it.",
      },
    },
    {
      id: "b3-handoff",
      say: [
        "A wants to reach D at 10.0.0.20. Different network — so A sends the packet toward its gateway.",
        "Here's the subtle, beautiful part. The *frame* is addressed to the router's MAC (the next hop). But the *packet* inside still says destination IP 10.0.0.20 — D, the final goal.",
        "The MAC gets you to the next door; the IP names the final house.",
      ],
      reveal: "Frame MAC = next hop. Packet IP = final destination. Two addresses, two jobs.",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "frame→router · ip→D" },
          { ...B, dim: true },
          { ...C, dim: true },
          { ...SW1 },
          { ...RT, badge: GW1 },
          { ...D, badge: IP_D },
          { ...E, dim: true },
          { ...SW2 },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw1", active: true },
          { id: "l-b", from: "pc-b", to: "sw1" },
          { id: "l-c", from: "pc-c", to: "sw1" },
          { id: "l-r1", from: "sw1", to: "rt", active: true },
          { id: "l-r2", from: "rt", to: "sw2" },
          { id: "l-d", from: "pc-d", to: "sw2" },
          { id: "l-e", from: "pc-e", to: "sw2" },
        ],
        signals: [
          { id: "s-a", linkId: "l-a", from: "pc-a", label: "to D", color: "var(--accent)" },
          { id: "s-r", linkId: "l-r1", from: "sw1", label: "to D", color: "var(--accent)" },
        ],
        caption: "A hands the packet to the router — IP destination unchanged.",
      },
    },
    {
      id: "b4-lookup",
      say: [
        "The router reads the destination IP's *network part*: 10.0.0.",
        "It checks its routing table — a map of which network reaches out of which interface.",
        "10.0.0.0/24 matches the interface facing Network 2. Decision made: forward the packet out that side.",
      ],
      reveal: "A router forwards by matching the destination's network in its routing table.",
      stage: {
        nodes: [
          { ...A, badge: IP_A },
          { ...B, dim: true },
          { ...C, dim: true },
          { ...SW1 },
          { ...RT, highlight: true, badge: "reading 10.0.0.x" },
          { ...D, badge: IP_D },
          { ...E, dim: true },
          { ...SW2 },
        ],
        links: BASE_LINKS,
        inset: "routetable",
        insetRouteTable: {
          rows: [
            { dest: "192.168.1.0/24", via: "interface 1 (direct)" },
            { dest: "10.0.0.0/24", via: "interface 2 (direct)", fresh: true },
          ],
          note: "Destination 10.0.0.20 matches 10.0.0.0/24 → send out interface 2.",
        },
        caption: "Match the network, pick the interface.",
      },
    },
    {
      id: "b5-deliver",
      say: [
        "Now on Network 2, the router does one more thing: it wraps the same packet in a *new* frame, this time addressed to D's MAC.",
        "Switch 2 sees a familiar local MAC and delivers it straight to D. Arrived!",
        "Look back at the whole trip: the destination IP (10.0.0.20) never changed, but the frame's MAC was rewritten at every hop. That layering is what lets one packet cross any number of networks.",
      ],
      reveal: "Across the journey, IP stays constant; the MAC frame is rebuilt hop by hop.",
      stage: {
        nodes: [
          { ...A, dim: true, badge: IP_A },
          { ...B, dim: true },
          { ...C, dim: true },
          { ...SW1 },
          { ...RT, badge: GW2 },
          { ...D, highlight: true, badge: "✓ frame→D · ip→D" },
          { ...E, dim: true },
          { ...SW2 },
        ],
        links: [
          { id: "l-a", from: "pc-a", to: "sw1" },
          { id: "l-b", from: "pc-b", to: "sw1" },
          { id: "l-c", from: "pc-c", to: "sw1" },
          { id: "l-r1", from: "sw1", to: "rt" },
          { id: "l-r2", from: "rt", to: "sw2", active: true },
          { id: "l-d", from: "pc-d", to: "sw2", active: true },
          { id: "l-e", from: "pc-e", to: "sw2" },
        ],
        signals: [
          { id: "s-r2", linkId: "l-r2", from: "rt", label: "to D", color: "var(--ok)" },
          { id: "s-d", linkId: "l-d", from: "sw2", label: "to D", color: "var(--ok)" },
        ],
        caption: "Delivered across the border — IP constant, frame rebuilt.",
      },
    },
    {
      id: "b6-check",
      say: ["A quick check on how the router makes its decision."],
      interaction: {
        prompt: "When a packet for 10.0.0.20 arrives, what does the router use to decide where to send it?",
        choices: [
          {
            id: "c1",
            label: "The frame's destination MAC address",
            correct: false,
            feedback: "The MAC only names the next hop on the local wire. To choose a direction between networks, the router looks at the IP.",
          },
          {
            id: "c2",
            label: "The network part of the destination IP, matched against its routing table",
            correct: true,
            feedback: "Exactly. The router matches 10.0.0 to a routing-table entry and forwards out the matching interface.",
          },
          {
            id: "c3",
            label: "It floods the packet out every interface",
            correct: false,
            feedback: "That's hub/switch broadcast behaviour. A router forwards deliberately, using its routing table — no flooding.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...A, badge: IP_A },
          { ...B },
          { ...C },
          { ...SW1 },
          { ...RT, badge: `${GW1} | ${GW2}` },
          { ...D, badge: IP_D },
          { ...E },
          { ...SW2 },
        ],
        links: BASE_LINKS,
        caption: "Routers think in networks, not individual cards.",
      },
    },
    {
      id: "b7-bridge",
      say: [
        "You've just built an internetwork: two networks, joined by a router that forwards by IP. This is the seed of the whole Internet.",
        "But one router with two networks is a village. The real Internet is *millions* of networks, and no router can list them all.",
        "How do packets cross continents through routers that have never heard of your network — and how does your home get an address the world can find? That's the Internet itself.",
      ],
      stage: {
        nodes: [
          { ...A, dim: true, badge: IP_A },
          { ...B, dim: true },
          { ...C, dim: true },
          { ...SW1, dim: true },
          { ...RT, dim: true, badge: `${GW1} | ${GW2}` },
          { ...D, dim: true, badge: IP_D },
          { ...E, dim: true },
          { ...SW2, dim: true },
          { id: "cloud", kind: "cloud", label: "millions of networks?", x: 50, y: 86, dim: true },
        ],
        links: BASE_LINKS,
        caption: "Coming up: how millions of networks become one Internet.",
      },
    },
  ],
};
