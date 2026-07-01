import type { Chapter } from "@/types/journey";

const YOU = { id: "you", kind: "computer" as const, label: "You", x: 9, y: 26 };
const HOME = { id: "home", kind: "router" as const, label: "Home router", x: 9, y: 60 };
const ISP1 = { id: "isp1", kind: "router" as const, label: "Your ISP", x: 29, y: 60 };
const NET = { id: "net", kind: "cloud" as const, label: "The Internet", x: 50, y: 36 };
const ISP2 = { id: "isp2", kind: "router" as const, label: "Server's ISP", x: 72, y: 60 };
const SRV = { id: "srv", kind: "server" as const, label: "Web server", x: 91, y: 36 };

const L_YH = { id: "l-yh", from: "you", to: "home" };
const L_HI = { id: "l-hi", from: "home", to: "isp1" };
const L_IN = { id: "l-in", from: "isp1", to: "net" };
const L_NI = { id: "l-ni", from: "net", to: "isp2" };
const L_IS = { id: "l-is", from: "isp2", to: "srv" };

const FULL_LINKS = [L_YH, L_HI, L_IN, L_NI, L_IS];

/**
 * Chapter 9 — zoom out from one router to the whole Internet. No router knows
 * every network; each keeps a *default route* pointing at a bigger network
 * upstream. Millions of independent networks (ISPs) chained by routers pass
 * each other's packets, and a packet reaches anywhere by many small hop-by-hop
 * decisions. Public vs private addressing gets a first look.
 */
export const chapter09: Chapter = {
  id: "ch09",
  number: 9,
  slug: "the-internet",
  question: "How do millions of networks connect?",
  title: "One Internet from many networks",
  promise: "You'll see how a packet reaches any server on Earth without anyone knowing the whole map.",
  bridge:
    "So a packet can now travel from your bedroom to a server on the other side of the planet, guided by IP addresses and a chain of routers. But be honest — you have never once typed 142.250.72.14 into your browser. You type *google.com*. Somewhere, a name has to become an address. What is that name, and who turns it into a number?",
  beats: [
    {
      id: "b1-default",
      say: [
        "Your home network can't possibly store a route to every network on Earth. So it doesn't try.",
        "It keeps just one catch-all rule, the *default route*: “anything that isn't local, send to my ISP.”",
        "Local traffic stays home; everything else goes out the front door to your Internet provider.",
      ],
      reveal: "Default route (0.0.0.0/0): send anything unknown to your ISP.",
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "192.168.1.10" },
          { ...HOME },
          { ...ISP1 },
        ],
        links: [L_YH, L_HI],
        inset: "routetable",
        insetRouteTable: {
          rows: [
            { dest: "192.168.1.0/24", via: "local network (direct)" },
            { dest: "0.0.0.0/0", via: "→ your ISP (default)", fresh: true },
          ],
          note: "0.0.0.0/0 matches everything — the fallback when nothing else does.",
        },
        caption: "One tiny table runs your whole home network.",
      },
    },
    {
      id: "b2-upstream",
      say: [
        "Your ISP's router is bigger, but it doesn't know every network either.",
        "So it plays the same trick: it has its *own* default route, pointing to an even larger provider above it.",
        "Networks nest like this — home, to local ISP, to regional provider, to the giant backbones that span continents.",
      ],
      reveal: "Every network passes what it doesn't know to a bigger one upstream.",
      stage: {
        nodes: [
          { ...YOU, badge: "192.168.1.10" },
          { ...HOME },
          { ...ISP1, highlight: true },
          { ...NET },
        ],
        links: [L_YH, L_HI, L_IN],
        caption: "Don't know it? Pass it upward to someone who might.",
      },
    },
    {
      id: "b3-mesh",
      say: [
        "Zoom all the way out. The Internet isn't one machine or one company — it's *millions* of independent networks.",
        "Each is run by someone different: your ISP, a university, Google, a government. They agree to carry each other's packets.",
        "Routers are the junctions where these networks meet. That web of agreements, and nothing more, is “the Internet.”",
      ],
      reveal: "The Internet: millions of independent networks, joined by routers.",
      stage: {
        nodes: [
          { ...YOU, badge: "192.168.1.10" },
          { ...HOME },
          { ...ISP1 },
          { ...NET, highlight: true },
          { ...ISP2 },
          { ...SRV, badge: "142.250.72.14" },
        ],
        links: FULL_LINKS,
        caption: "No owner, no central map — just networks agreeing to connect.",
      },
    },
    {
      id: "b4-journey",
      say: [
        "Now watch a packet travel from you to that distant server.",
        "Home router → your ISP → across the backbone → the server's ISP → the server. Each router makes just *one* local decision: “which neighbour gets this closer?”",
        "No single router knows the entire route. The path emerges from many small, independent choices — and it just works.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "192.168.1.10" },
          { ...HOME },
          { ...ISP1 },
          { ...NET },
          { ...ISP2 },
          { ...SRV, highlight: true, badge: "142.250.72.14" },
        ],
        links: [
          { ...L_YH, active: true },
          { ...L_HI, active: true },
          { ...L_IN, active: true },
          { ...L_NI, active: true },
          { ...L_IS, active: true },
        ],
        signals: [
          { id: "s1", linkId: "l-yh", from: "you", label: "to server", color: "var(--accent)" },
          { id: "s2", linkId: "l-hi", from: "home", color: "var(--accent)" },
          { id: "s3", linkId: "l-in", from: "isp1", color: "var(--accent)" },
          { id: "s4", linkId: "l-ni", from: "net", color: "var(--accent)" },
          { id: "s5", linkId: "l-is", from: "isp2", label: "arrives", color: "var(--ok)" },
        ],
        caption: "Many small hops add up to a trip across the world.",
      },
    },
    {
      id: "b5-publicprivate",
      say: [
        "One puzzle: your address is 192.168.1.10 — but *millions* of homes use that exact same private number. How is that not chaos?",
        "Because it's *private* — it only means anything inside your own network. The outside world never sees it.",
        "Your ISP gives your home one *public* IP, unique on the whole Internet. That single public address is the return address the rest of the world actually uses.",
      ],
      reveal: "Private IPs are reused inside homes; one public IP represents you to the world.",
      stage: {
        nodes: [
          { ...YOU, badge: "private 192.168.1.10" },
          { ...HOME, highlight: true, badge: "public 203.0.113.7" },
          { ...ISP1 },
          { ...NET },
          { ...ISP2 },
          { ...SRV, badge: "142.250.72.14" },
        ],
        links: FULL_LINKS,
        caption: "Private inside the house; one public address facing the street.",
      },
    },
    {
      id: "b6-check",
      say: ["A quick check on how the Internet scales."],
      interaction: {
        prompt: "How does your home router reach a network it has never heard of?",
        choices: [
          {
            id: "c1",
            label: "It stores a route to every network on Earth",
            correct: false,
            feedback: "Impossible — there are far too many networks. Home routers keep almost no routes at all.",
          },
          {
            id: "c2",
            label: "It sends the packet to its default route — up to the ISP — and lets bigger networks handle it",
            correct: true,
            feedback: "Exactly. The default route passes unknown destinations upstream, where routers know more of the map.",
          },
          {
            id: "c3",
            label: "It broadcasts the packet to the entire Internet",
            correct: false,
            feedback: "Broadcasts never cross networks — that was the whole reason routers exist. Routing is deliberate, not a shout.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...YOU, badge: "192.168.1.10" },
          { ...HOME },
          { ...ISP1 },
          { ...NET },
          { ...ISP2 },
          { ...SRV, badge: "142.250.72.14" },
        ],
        links: FULL_LINKS,
        caption: "Small routers lean on bigger ones. That's how it scales.",
      },
    },
    {
      id: "b7-bridge",
      say: [
        "You've now built the whole Internet in your head: numbered networks, routers, default routes, and one public address per home.",
        "A packet can reach any server on Earth — as long as you know its IP address.",
        "But nobody memorizes 142.250.72.14. You type *google.com*. Next, we uncover what that name really is, and the system that turns it into an address.",
      ],
      stage: {
        nodes: [
          { ...YOU, dim: true, badge: "192.168.1.10" },
          { ...HOME, dim: true },
          { ...ISP1, dim: true },
          { ...NET, dim: true },
          { ...ISP2, dim: true },
          { ...SRV, dim: true, badge: "google.com = 142.250.72.14 ?" },
        ],
        links: FULL_LINKS,
        caption: "Coming up: names, and how they become addresses.",
      },
    },
  ],
};
