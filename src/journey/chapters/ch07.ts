import type { Chapter } from "@/types/journey";

const MAC_A = "00:1A:2B:00:00:0A";

// Network 1 (192.168.1.0/24)
const A = { id: "pc-a", kind: "computer" as const, label: "A", x: 10, y: 30 };
const B = { id: "pc-b", kind: "computer" as const, label: "B", x: 24, y: 20 };
const C = { id: "pc-c", kind: "computer" as const, label: "C", x: 38, y: 30 };
const SW1 = { id: "sw1", kind: "switch" as const, label: "Switch · Net 1", x: 24, y: 62 };

// Network 2 (10.0.0.0/24)
const D = { id: "pc-d", kind: "computer" as const, label: "D", x: 62, y: 30 };
const E = { id: "pc-e", kind: "computer" as const, label: "E", x: 90, y: 30 };
const SW2 = { id: "sw2", kind: "switch" as const, label: "Switch · Net 2", x: 76, y: 62 };

const NET1_LINKS = [
  { id: "l-a", from: "pc-a", to: "sw1" },
  { id: "l-b", from: "pc-b", to: "sw1" },
  { id: "l-c", from: "pc-c", to: "sw1" },
];
const NET2_LINKS = [
  { id: "l-d", from: "pc-d", to: "sw2" },
  { id: "l-e", from: "pc-e", to: "sw2" },
];

const IP_A = "192.168.1.10";
const IP_B = "192.168.1.11";
const IP_C = "192.168.1.12";
const IP_D = "10.0.0.20";
const IP_E = "10.0.0.21";

/**
 * Chapter 7 — solve Chapter 6's addressing wall with the IP address: a second,
 * *logical* address layered on top of the MAC. Its key power is structure — a
 * network part and a host part — so a computer can tell, just by looking, that
 * a destination lives on a different network. That sets up the router.
 */
export const chapter07: Chapter = {
  id: "ch07",
  number: 7,
  slug: "ip-address",
  question: "What is an IP address?",
  title: "An address that knows which network you're on",
  promise: "You'll learn the layered address that can point at a network it has never seen.",
  bridge:
    "Huge step: every computer now has an address that says *which network* it belongs to, and A can look at D's IP and instantly tell “that's somewhere else.” But knowing D is far away isn't the same as reaching it — A still has no path off its own island. It needs a device sitting on the border that reads the network part of every packet and forwards it toward the right network. That device, at last, is the *router*.",
  beats: [
    {
      id: "b1-second",
      say: [
        "Computer A already has a MAC address — the permanent name burned into its card.",
        "Now we give it a *second* address, a flexible one assigned by the network: its *IP address*, like 192.168.1.10.",
        "The MAC says *who* the card is. The IP will say *where on the network* it lives.",
      ],
      reveal: "An IP address is a logical address layered on top of the MAC.",
      stage: {
        nodes: [{ ...A, highlight: true, badge: MAC_A }],
        inset: "ip",
        insetIp: { ip: IP_A, prefix: 24 },
        caption: "Two addresses now: the hardware MAC, and the logical IP.",
      },
    },
    {
      id: "b2-split",
      say: [
        "Here's what makes an IP address special: it comes in *two parts*.",
        "An IPv4 address is 32 bits — four numbers, each 0–255. The front is the *network* part (which network you're on); the back is the *host* part (which computer on it).",
        "A *subnet mask*, written as the /24 prefix, marks where the split falls: here the first three numbers are the network (192.168.1), and the last is the host (.10).",
      ],
      reveal: "IP = network part + host part. The subnet mask (/24) marks the split.",
      stage: {
        nodes: [],
        inset: "ip",
        insetIp: { ip: IP_A, prefix: 24 },
        caption: "Network = which street. Host = which house.",
      },
    },
    {
      id: "b3-twonets",
      say: [
        "Now give everyone an IP. All of Network 1 shares the network number 192.168.1 — only the last number differs.",
        "Network 2, the other island, uses a totally different network number: 10.0.0. So D is 10.0.0.20, E is 10.0.0.21.",
        "The network part of the address is what tells the two islands apart.",
      ],
      stage: {
        nodes: [
          { ...A, badge: IP_A },
          { ...B, badge: IP_B },
          { ...C, badge: IP_C },
          { ...SW1 },
          { ...D, badge: IP_D },
          { ...E, badge: IP_E },
          { ...SW2 },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Net 1 = 192.168.1.x · Net 2 = 10.0.0.x.",
      },
    },
    {
      id: "b4-different",
      say: [
        "Now the payoff. A wants to reach D. A compares network parts: *my* network is 192.168.1, but D's is 10.0.0.",
        "Different network! Instantly, A *knows* D is not a neighbour — it lives on another network entirely.",
        "A flat MAC address could never tell you this. The IP's structure makes “near or far?” a question you can answer just by reading the address.",
      ],
      reveal: "Comparing network parts tells a computer if a destination is local or remote.",
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "192.168.1.10" },
          { ...B, dim: true, badge: IP_B },
          { ...C, dim: true, badge: IP_C },
          { ...SW1 },
          { ...D, highlight: true, badge: "10.0.0.20" },
          { ...E, dim: true, badge: IP_E },
          { ...SW2 },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "192.168.1 ≠ 10.0.0 → D is on a different network.",
      },
    },
    {
      id: "b5-aim",
      say: [
        "And because the address *names* the network, A can aim a packet at a network it has never visited.",
        "It writes the destination as “network 10.0.0, host .20” — a complete set of directions, independent of any MAC table.",
        "The address itself carries the map. Now we just need something that can follow it across the border.",
      ],
      stage: {
        nodes: [
          { ...A, highlight: true, badge: "→ 10.0.0.20" },
          { ...B, dim: true },
          { ...C, dim: true },
          { ...SW1 },
          { ...D, badge: "10.0.0.20" },
          { ...E, dim: true },
          { ...SW2 },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "The packet is addressed to a network A has never seen.",
      },
    },
    {
      id: "b6-check",
      say: ["A quick check on how IP addresses are structured."],
      interaction: {
        prompt: "How can computer A tell that 10.0.0.20 is on a different network than itself (192.168.1.10)?",
        choices: [
          {
            id: "c1",
            label: "It looks up 10.0.0.20 in its MAC table",
            correct: false,
            feedback: "A MAC table only covers the local network and uses hardware addresses — it can't describe remote networks.",
          },
          {
            id: "c2",
            label: "It compares the network parts: 192.168.1 vs 10.0.0 — they differ, so D is remote",
            correct: true,
            feedback: "Exactly. The network part of the IP address makes “local or remote?” answerable just by reading it.",
          },
          {
            id: "c3",
            label: "It can't tell — all IP addresses look the same",
            correct: false,
            feedback: "The whole point of IP is structure: a network part and a host part you can compare.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...A, badge: IP_A },
          { ...B, badge: IP_B },
          { ...C, badge: IP_C },
          { ...SW1 },
          { ...D, badge: IP_D },
          { ...E, badge: IP_E },
          { ...SW2 },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Same network number = neighbours. Different = remote.",
      },
    },
    {
      id: "b7-bridge",
      say: [
        "So IP addresses give every packet a destination that names a network, and a way to tell local from remote.",
        "But A is still trapped on its island — it can see that D is far away, yet it has no road to get there.",
        "We need a device that sits between networks, reads the network part of each packet, and forwards it toward the right one. It's finally time to meet the router.",
      ],
      stage: {
        nodes: [
          { ...A, dim: true, badge: IP_A },
          { ...B, dim: true, badge: IP_B },
          { ...C, dim: true, badge: IP_C },
          { ...SW1, dim: true },
          { ...D, dim: true, badge: IP_D },
          { ...E, dim: true, badge: IP_E },
          { ...SW2, dim: true },
          { id: "rt", kind: "router", label: "the border device?", x: 50, y: 84, dim: true },
        ],
        links: [...NET1_LINKS, ...NET2_LINKS],
        caption: "Coming up: the router that reads IP and crosses between networks.",
      },
    },
  ],
};
