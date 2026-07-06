import type { Chapter } from "@/types/journey";

const YOU = { id: "you", kind: "browser" as const, label: "Your browser", x: 24, y: 48 };
const SRV = { id: "srv", kind: "server" as const, label: "google.com", x: 76, y: 48 };
const LINK = { id: "l-cs", from: "you", to: "srv" };

/**
 * Chapter 15 (capstone) — the layered model. Every idea in the course is placed
 * onto one map: the TCP/IP stack. Then a message is followed *down* the
 * sender's stack (encapsulation) and back *up* the receiver's stack
 * (decapsulation), so the learner sees the whole journey as one repeating
 * pattern of layers, each trusting the one below.
 */
export const chapter15: Chapter = {
  id: "ch15",
  number: 15,
  slug: "the-network-stack",
  question: "How do all the pieces fit into one system?",
  title: "The TCP/IP stack",
  promise:
    "You'll place every idea you built onto a single layered map, then watch a message wrap itself on the way out and unwrap itself on the way in.",
  bridge:
    "That's the whole thing. You started with one machine that could only flip bits, and you ended holding a complete mental model of the Internet: a stack of layers, each one solving a single problem and trusting the layer beneath it. Names, addresses, routes, reliability, secrecy, and the page itself — every one of them lives on a floor of the same building. You didn't just learn how the web works. You rebuilt it, one layer at a time.",
  beats: [
    {
      id: "b1-nomap",
      say: [
        "You've reached the end — and you built every piece yourself: bits, frames, addresses, routers, names, connections, encryption, the page.",
        "But you built them as a pile of separate tricks. Engineers organize those tricks into one idea: *layers*.",
        "Each layer does one job and trusts the layer below it to do its own. Stacked together, they make the whole Internet.",
      ],
      reveal: "Everything you built is one floor of a single stack — the network stack.",
      stage: {
        nodes: [{ ...YOU }, { ...SRV }],
        links: [{ ...LINK, active: true }],
        inset: "stack",
        insetStack: { view: "layers" },
        caption: "Every chapter you finished is a layer on this map.",
      },
    },
    {
      id: "b2-app",
      say: [
        "Start at the top, closest to you. The *Application* layer is the part that speaks meaning.",
        "Here live the things you actually think about: the name *google.com*, DNS looking it up, TLS locking it, and HTTP asking “GET /”.",
        "It doesn't know or care how bytes travel. It just hands its message down and trusts the next layer.",
      ],
      stage: {
        nodes: [{ ...YOU, highlight: true }, { ...SRV }],
        links: [{ ...LINK, active: true }],
        inset: "stack",
        insetStack: {
          view: "layers",
          active: ["app"],
          note: "The Application layer is everything you think about — names, the lock, the request. It never touches the wire itself.",
        },
        caption: "Application: names, DNS, TLS, HTTP — the meaning.",
      },
    },
    {
      id: "b3-transport",
      say: [
        "Below it, the *Transport* layer turns best-effort delivery into a real conversation.",
        "This is TCP: port numbers so the bytes reach the right program, plus sequence and acknowledgement numbers and the handshake that make delivery reliable and in order.",
        "It hands a *segment* down — and trusts the layer below to actually find the other machine.",
      ],
      stage: {
        nodes: [{ ...YOU, highlight: true }, { ...SRV }],
        links: [{ ...LINK, active: true }],
        inset: "stack",
        insetStack: {
          view: "layers",
          active: ["transport"],
          note: "Not everything is TCP — UDP lives here too, trading reliability for speed. Ports are how one machine runs many programs at once.",
        },
        caption: "Transport: ports, reliability, order.",
      },
    },
    {
      id: "b4-internet",
      say: [
        "Next down is the *Internet* layer. Its whole job is: get this across the world.",
        "This is IP. It wraps the segment in a *packet* stamped with source and destination IP addresses, and routers pass it network to network toward that address.",
        "It makes no promises about arrival — it just aims. Reliability was the job of the layer above.",
      ],
      stage: {
        nodes: [{ ...YOU, highlight: true }, { ...SRV, highlight: true }],
        links: [{ ...LINK, active: true, label: "packet → router → router → server" }],
        inset: "stack",
        insetStack: {
          view: "layers",
          active: ["internet"],
          note: "IP addresses are global and logical; the next layer down handles the local, physical hop.",
        },
        caption: "Internet / Network: IP addresses and routing.",
      },
    },
    {
      id: "b5-link-phys",
      say: [
        "At the bottom sit the two layers that touch the real world: *Link* and *Physical*.",
        "Link is Ethernet: it wraps the packet in a *frame* with MAC addresses so it can cross one hop, and the switch delivers it to the right port.",
        "Physical is the rawest layer of all — the very first thing you learned. Just voltage, high and low, carrying the bits along the wire.",
      ],
      stage: {
        nodes: [{ ...YOU, highlight: true }, { ...SRV }],
        links: [{ ...LINK, active: true }],
        inset: "stack",
        insetStack: {
          view: "layers",
          active: ["link", "physical"],
          note: "TCP/IP often lumps these together as one “Link” layer — the frame and the bits that carry it are the two halves of a single hop.",
        },
        caption: "Link & Physical: frames, MAC, and bits on the wire.",
      },
    },
    {
      id: "b6-encap",
      say: [
        "Now watch a real message leave. It starts at the top as your HTTP request and travels *down* the stack.",
        "Each layer wraps what it's given in its own header — TCP adds ports, IP adds addresses, Ethernet adds MACs. This wrapping is called *encapsulation*.",
        "By the time it reaches the wire, your little “GET /” is nested inside three envelopes, like a letter inside an envelope inside a shipping box.",
      ],
      reveal: "Encapsulation: going down, every layer adds its own header around the layer above.",
      stage: {
        nodes: [{ ...YOU, highlight: true }, { ...SRV }],
        links: [{ ...LINK, active: true, label: "wrapping on the way out" }],
        inset: "stack",
        insetStack: {
          view: "wrap",
          active: ["app", "transport", "internet", "link", "physical"],
          note: "Each header is read only by the matching layer on the other side. Everything else just carries it.",
        },
        caption: "One message, wrapped layer by layer.",
      },
    },
    {
      id: "b7-decap",
      say: [
        "At google's server the whole thing runs in reverse, from the bottom up.",
        "The Link layer reads the frame's MAC and strips it. IP reads the packet's address and strips that. TCP reads the ports and sequence numbers and strips those.",
        "Each layer opens exactly one envelope — its own — and passes the rest up. This is *decapsulation*. What finally pops out at the top is your original “GET /”.",
      ],
      reveal: "Decapsulation: going up, each layer reads and removes only its own header.",
      stage: {
        nodes: [{ ...YOU }, { ...SRV, highlight: true }],
        links: [{ ...LINK, active: true, label: "unwrapping on the way in" }],
        inset: "stack",
        insetStack: {
          view: "unwrap",
          active: ["app", "transport", "internet", "link", "physical"],
          note: "The layers on each machine talk to their twins: server-TCP reads what your-TCP wrote, and ignores the rest.",
        },
        caption: "The same message, unwrapped layer by layer.",
      },
    },
    {
      id: "b8-whole-stack",
      say: [
        "There's the whole stack, top to bottom — and every floor is something you built yourself.",
        "The magic isn't any one layer; it's the *rule* they all follow: each does one job and trusts the layer below to do its own. That's why the Internet can be built by millions of people who never meet.",
        "One honest note: not everything fits perfectly. TLS, for instance, doesn't have its own floor — it rides on top of TCP to secure the application's data. Real systems are always a little messier than the map.",
      ],
      reveal: "The stack works because each layer solves one problem and trusts the one beneath it.",
      stage: {
        nodes: [{ ...YOU }, { ...SRV }],
        links: [{ ...LINK, active: true }],
        inset: "stack",
        insetStack: {
          view: "layers",
          note: "Five layers, one rule: do your job, trust the layer below.",
        },
        caption: "The whole stack — everything you built, on one map.",
      },
    },
    {
      id: "b9-check",
      say: ["One final check — on the pattern behind everything you built."],
      interaction: {
        prompt: "Why does the Transport layer (TCP) not worry about how packets physically cross the world?",
        choices: [
          {
            id: "c1",
            label: "Because packets never actually move — TCP delivers them directly",
            correct: false,
            feedback: "They very much move, hop by hop. TCP just isn't the layer that moves them.",
          },
          {
            id: "c2",
            label: "Because that's the job of the layers below it — TCP trusts IP and the Link layer to handle it",
            correct: true,
            feedback: "Exactly — that's the whole point of layering. Each layer solves one problem and trusts the layer beneath to solve its own.",
          },
          {
            id: "c3",
            label: "Because TCP and IP are really the same layer doing the same job",
            correct: false,
            feedback: "They're separate layers with separate jobs: TCP makes delivery reliable, IP finds the route.",
          },
        ],
      },
      stage: {
        nodes: [{ ...YOU }, { ...SRV }],
        links: [{ ...LINK, active: true }],
        inset: "stack",
        insetStack: { view: "layers", active: ["transport"] },
        caption: "Separation of concerns — the idea that makes the Internet possible.",
      },
    },
  ],
};
