import type { Chapter } from "@/types/journey";

const YOU = { id: "you", kind: "browser" as const, label: "Your browser", x: 22, y: 46 };
const SRV = { id: "srv", kind: "server" as const, label: "google's server", x: 78, y: 46 };
const LINK = { id: "l-cs", from: "you", to: "srv" };

const IP = "142.250.72.14";

/**
 * Chapter 12 — the TCP handshake. IP only makes a best-effort delivery: packets
 * can be lost, duplicated, or arrive out of order. Before sending a page, the
 * two machines open a connection with SYN → SYN-ACK → ACK, then number and
 * acknowledge every byte so data arrives complete and in order.
 */
export const chapter12: Chapter = {
  id: "ch12",
  number: 12,
  slug: "tcp-handshake",
  question: "How do two computers agree to talk reliably?",
  title: "TCP: a reliable connection",
  promise: "You'll watch a browser and a server shake hands, then guarantee nothing gets lost.",
  bridge:
    "You now have a reliable, in-order pipe straight to google's server — a real conversation, not just packets flung into the dark. But that pipe is wide open. Every router between you and the server can read, and even change, everything flowing through it. Before you send a password or a message, the pipe has to be *locked*. Next: TLS, the lock that turns http into https.",
  beats: [
    {
      id: "b1-besteffort",
      say: [
        "DNS gave you the address: 142.250.72.14. So just throw the page request at it and hope?",
        "Not quite. The IP layer only promises *best effort* — it forwards each packet as well as it can, but makes no guarantees.",
        "Packets can be dropped by a busy router, duplicated, or arrive in the wrong order. For a web page, that's unacceptable.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: IP },
          { ...SRV },
        ],
        links: [{ ...LINK, dashed: true, label: "best effort — no guarantees" }],
        caption: "IP moves packets, but promises nothing about them.",
      },
    },
    {
      id: "b2-need",
      say: [
        "So before sending anything important, the two computers set up a *connection* — an agreement to talk, plus a system to catch whatever gets lost.",
        "That system is TCP. It rides on top of best-effort IP and turns it into a reliable, ordered stream.",
        "But you can't just start sending. Both sides first have to agree they're ready. That agreement is a three-step *handshake*.",
      ],
      stage: {
        nodes: [
          { ...YOU },
          { ...SRV },
        ],
        links: [{ ...LINK, label: "let's set up a connection" }],
        caption: "TCP builds reliability on top of unreliable IP.",
      },
    },
    {
      id: "b3-syn",
      say: [
        "Step one. Your browser sends a tiny message with the *SYN* flag set — short for “synchronize”.",
        "It carries a starting number for counting bytes: “Let's talk. My sequence number starts at 1000.”",
        "No web data yet — this packet's only job is to ask to open the conversation.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: IP },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "step 1 of 3" }],
        signals: [{ id: "s-syn", linkId: "l-cs", from: "you", label: "SYN", color: "var(--accent)" }],
        inset: "segment",
        insetSegment: {
          seq: "1000",
          flags: ["SYN"],
          note: "“Can we talk? My byte counter starts at 1000.”",
        },
        caption: "SYN: the browser asks to open a connection.",
      },
    },
    {
      id: "b4-synack",
      say: [
        "Step two. The server answers with *both* SYN and ACK set.",
        "The ACK (“acknowledge”) confirms it received your SYN: “I got your 1000 — next I expect 1001.” The SYN sets up the server's own counter, starting at 5000.",
        "In one packet the server both agrees to talk and starts its own side of the count.",
      ],
      stage: {
        nodes: [
          { ...YOU },
          { ...SRV, highlight: true },
        ],
        links: [{ ...LINK, active: true, label: "step 2 of 3" }],
        signals: [{ id: "s-synack", linkId: "l-cs", from: "srv", label: "SYN-ACK", color: "var(--accent-2)" }],
        inset: "segment",
        insetSegment: {
          seq: "5000",
          ack: "1001",
          flags: ["SYN", "ACK"],
          note: "“Sure — got your 1000. Here's my counter at 5000.”",
        },
        caption: "SYN-ACK: the server agrees and starts its own count.",
      },
    },
    {
      id: "b5-ack",
      say: [
        "Step three. Your browser sends one more packet with just *ACK* set: “Got your 5000 — next I expect 5001.”",
        "Now both sides have confirmed each other's starting numbers. The connection is *established*.",
        "SYN, SYN-ACK, ACK — three packets, and a reliable two-way channel is open.",
      ],
      reveal: "The three-way handshake (SYN → SYN-ACK → ACK) opens a reliable connection.",
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: IP },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "step 3 of 3 — established" }],
        signals: [{ id: "s-ack", linkId: "l-cs", from: "you", label: "ACK", color: "var(--ok)" }],
        inset: "segment",
        insetSegment: {
          seq: "1001",
          ack: "5001",
          flags: ["ACK"],
          note: "“Got your 5000. We're connected.”",
        },
        caption: "ACK: both sides are synced — the connection is live.",
      },
    },
    {
      id: "b6-reliable",
      say: [
        "Now the real data flows. TCP splits the page into numbered *segments* and sends them across.",
        "For every segment that arrives, the receiver sends back an ACK. If an ACK doesn't come in time, the sender assumes it was lost — and re-sends that exact segment.",
        "Because every byte is numbered, the receiver can reorder anything that arrives out of sequence and refuse duplicates. The page arrives complete and in order — every time.",
      ],
      reveal: "Every byte is numbered and acknowledged; anything lost is re-sent, so data arrives complete and in order.",
      stage: {
        nodes: [
          { ...YOU, badge: IP },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "numbered data + ACKs" }],
        signals: [
          { id: "s-data", linkId: "l-cs", from: "you", label: "seq 1001…", color: "var(--accent-4)" },
          { id: "s-ack2", linkId: "l-cs", from: "srv", label: "ACK", color: "var(--ok)" },
        ],
        caption: "Send, acknowledge, re-send if needed — nothing is left to chance.",
      },
    },
    {
      id: "b7-check",
      say: ["A quick check on what makes TCP reliable."],
      interaction: {
        prompt: "IP can drop or reorder packets. How does TCP still deliver a web page complete and in order?",
        choices: [
          {
            id: "c1",
            label: "It sends everything faster so packets have no time to get lost",
            correct: false,
            feedback: "Speed doesn't prevent loss. Reliability comes from tracking and re-sending, not from going fast.",
          },
          {
            id: "c2",
            label: "It numbers every segment and re-sends anything the other side doesn't acknowledge",
            correct: true,
            feedback: "Exactly. Sequence numbers let the receiver reorder data, and missing ACKs trigger a re-send until everything arrives.",
          },
          {
            id: "c3",
            label: "It replaces IP with a special error-free cable to the server",
            correct: false,
            feedback: "TCP runs on top of the same best-effort IP — it adds reliability in software, not new hardware.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...YOU, badge: IP },
          { ...SRV, highlight: true },
        ],
        links: [{ ...LINK, active: true, label: "reliable, ordered stream" }],
        caption: "A dependable pipe, built on an undependable network.",
      },
    },
  ],
};
