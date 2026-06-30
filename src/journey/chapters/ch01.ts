import type { Chapter } from "@/types/journey";

/**
 * Chapter 1 — start from absolute zero. One computer, what data is, and why a
 * lone machine cannot communicate. Ends by demanding a second computer.
 */
export const chapter01: Chapter = {
  id: "ch01",
  number: 1,
  slug: "what-is-a-computer",
  question: "What is a computer, and what is “data”?",
  title: "One computer, alone",
  promise: "You'll understand what computers actually move around: bits.",
  bridge:
    "Our computer can turn any message into signals — but a signal needs somewhere to go. A computer talking only to itself is like writing letters you never mail. We need a second computer, and a way to physically reach it.",
  beats: [
    {
      id: "b1-meet",
      say: [
        "Let's assume you know absolutely nothing. We'll build the entire internet from scratch, one idea at a time.",
        "Here is a computer. Think of it as a fast, obedient machine with one job: it moves and changes *information*.",
      ],
      stage: {
        nodes: [{ id: "pc-a", kind: "computer", label: "Your Computer", x: 50, y: 48, highlight: true }],
        caption: "We begin with a single machine.",
      },
    },
    {
      id: "b2-alone",
      say: [
        "Right now this computer is completely *alone*.",
        "It can calculate, store files, and run programs — but it cannot talk to anything. There is no one else in its world.",
        "So before networks, let's answer a smaller question: what is the *stuff* a computer would even send?",
      ],
      stage: {
        nodes: [{ id: "pc-a", kind: "computer", label: "Your Computer", x: 50, y: 48 }],
        caption: "Isolated. Powerful, but with no one to talk to.",
      },
    },
    {
      id: "b3-data",
      say: [
        "Everything inside it — every photo, message, and video — is just *data*.",
        "And all data, no matter how it looks to you, is secretly a long list of just two symbols: 0 and 1. Each one is called a *bit*.",
      ],
      reveal: "All data is just bits — 0s and 1s.",
      stage: {
        nodes: [],
        inset: "binary",
        insetText: "hi",
        caption: "The word “hi”, as the machine really sees it.",
      },
    },
    {
      id: "b4-encode",
      say: [
        "How does a letter become 0s and 1s? Every computer agrees on a *code*.",
        "In one common code, the letter “h” is 01101000. The machine never sees a letter — it only sees eight bits.",
      ],
      stage: {
        nodes: [],
        inset: "binary",
        insetText: "h",
        caption: "One character → eight bits.",
      },
    },
    {
      id: "b5-physical",
      say: [
        "But 0 and 1 are still just *ideas*. To travel anywhere, a bit must become something *physical*.",
        "Inside a wire, a 1 is a higher voltage and a 0 is a lower voltage — electricity flicking on and off billions of times per second.",
      ],
      reveal: "Bits become physical signals (voltage high/low).",
      stage: {
        nodes: [],
        inset: "binary",
        insetText: "h",
        caption: "Bits turned into a real signal on a wire.",
      },
    },
    {
      id: "b6-check",
      say: ["Quick check before we add anyone else to the story."],
      interaction: {
        prompt: "When a computer “sends a message”, what is actually moving?",
        choices: [
          {
            id: "c1",
            label: "The actual letters and pictures",
            correct: false,
            feedback: "Not quite — letters and pictures are how *you* see it. The machine only ever handles bits.",
          },
          {
            id: "c2",
            label: "A stream of bits (0s and 1s) as electrical signals",
            correct: true,
            feedback: "Exactly. Underneath everything, it's just bits turned into physical signals.",
          },
          {
            id: "c3",
            label: "Nothing — a computer can't produce anything on its own",
            correct: false,
            feedback: "Careful — a lone computer can absolutely produce bits. It just has nowhere to send them yet.",
          },
        ],
      },
      stage: {
        nodes: [{ id: "pc-a", kind: "computer", label: "Your Computer", x: 50, y: 48 }],
      },
    },
    {
      id: "b7-bridge",
      say: [
        "So our computer can turn any message into bits, and bits into signals. Impressive — but useless in isolation.",
        "A signal has to go *somewhere*. To communicate, we need a second computer… and a way to physically reach it.",
      ],
      stage: {
        nodes: [
          { id: "pc-a", kind: "computer", label: "Your Computer", x: 32, y: 48 },
          { id: "pc-b", kind: "computer", label: "???", x: 68, y: 48, dim: true },
        ],
        caption: "Who could be on the other end?",
      },
    },
  ],
};
