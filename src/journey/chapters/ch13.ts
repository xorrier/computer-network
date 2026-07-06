import type { Chapter } from "@/types/journey";

const YOU = { id: "you", kind: "browser" as const, label: "Your browser", x: 18, y: 50 };
const MID = { id: "mid", kind: "router" as const, label: "a router on the path", x: 50, y: 50 };
const SRV = { id: "srv", kind: "server" as const, label: "google.com", x: 82, y: 50 };
const LINK = { id: "l-cs", from: "you", to: "srv" };

/**
 * Chapter 13 — TLS / HTTPS. A reliable TCP pipe is still a plaintext pipe: every
 * router in the path can read and alter it. TLS adds identity (a CA-signed
 * certificate), a shared secret agreed in the open, and encryption — turning the
 * connection into a private, tamper-proof channel. That's the padlock: https.
 */
export const chapter13: Chapter = {
  id: "ch13",
  number: 13,
  slug: "tls-https",
  question: "Why is https secure?",
  title: "TLS: locking the connection",
  promise: "You'll see how a browser proves who it's talking to, then scrambles the data so no one in between can read it.",
  bridge:
    "The channel is finally everything it needs to be: pointed at the right server, reliable, and private. Every hard problem between “I typed google.com” and “I trust this pipe” is solved. Only one step remains — actually asking for the page. Your browser sends a short request, “GET /”, and the server sends the page back. Next: HTTP, and how those bytes finally become the screen in front of you.",
  beats: [
    {
      id: "b1-open",
      say: [
        "You have a reliable connection to google's server. So you type your password and hit send.",
        "But look at the path. Your data doesn't teleport — it passes through routers owned by your ISP, other networks, all sorts of strangers.",
        "Right now it's plain text. Any of those machines can read *password=hunter2* as it flies by — or quietly change it.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "password=hunter2" },
          { ...MID, highlight: true, badge: "reads: password=hunter2" },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "plain text — anyone can read it" }],
        signals: [{ id: "s-plain", linkId: "l-cs", from: "you", label: "password=hunter2", color: "var(--warn)" }],
        caption: "A reliable pipe is not a private pipe.",
      },
    },
    {
      id: "b2-twoproblems",
      say: [
        "Two things have to be fixed before this is safe.",
        "First: *identity*. How do you know the server on the other end is really google, and not an impostor who intercepted you?",
        "Second: *secrecy*. How do you scramble the data so only google can unscramble it — even though it crosses machines you don't trust? TLS solves both. HTTP plus TLS is https.",
      ],
      stage: {
        nodes: [
          { ...YOU },
          { ...MID, dim: true },
          { ...SRV, highlight: true },
        ],
        links: [{ ...LINK, label: "prove who you are, then hide the data" }],
        caption: "TLS adds identity and encryption on top of TCP.",
      },
    },
    {
      id: "b3-cert",
      say: [
        "First, identity. The server sends its *certificate* — a digital ID card.",
        "It names the site and carries a public key, and it's *signed* by a Certificate Authority: an organization your browser already trusts, built into it in advance.",
        "Your browser checks that signature. If it matches a trusted CA and names google.com, you know you're really talking to google — not an impostor.",
      ],
      reveal: "A CA-signed certificate proves the server really is who it claims to be.",
      stage: {
        nodes: [
          { ...YOU, highlight: true },
          { ...MID, dim: true },
          { ...SRV, highlight: true },
        ],
        links: [{ ...LINK, active: true, label: "here's my certificate" }],
        signals: [{ id: "s-cert", linkId: "l-cs", from: "srv", label: "certificate", color: "var(--accent-2)" }],
        inset: "cert",
        insetCert: {
          subject: "google.com",
          issuer: "GTS CA 1C3",
          validTo: "2026-09-01",
          status: "valid",
          note: "Signed by an authority your browser already trusts.",
        },
        caption: "The certificate binds a name to a key — and a CA vouches for it.",
      },
    },
    {
      id: "b4-keyexchange",
      say: [
        "Now secrecy. The certificate proved *who* the server is; next, both sides run a *Diffie–Hellman key exchange* to agree on a secret.",
        "Each side mixes in its own private random value, and through a bit of clever math they end up sharing one secret *session key* — even though every message crossed the open network.",
        "The eavesdropper saw the whole exchange and still can't reconstruct the key. And because that key is discarded after the session, even a future break-in can't decrypt today's traffic — that's *forward secrecy*.",
      ],
      reveal: "The shared key comes from a Diffie–Hellman exchange — not the certificate — giving forward secrecy.",
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "shared key 🔑" },
          { ...MID, dim: true, badge: "can't derive it" },
          { ...SRV, highlight: true, badge: "shared key 🔑" },
        ],
        links: [{ ...LINK, active: true, label: "agree on a secret key" }],
        signals: [
          { id: "s-kx1", linkId: "l-cs", from: "you", label: "key setup", color: "var(--accent)" },
          { id: "s-kx2", linkId: "l-cs", from: "srv", label: "key setup", color: "var(--accent)" },
        ],
        caption: "A secret only the two endpoints share — agreed to in the open.",
      },
    },
    {
      id: "b5-encrypted",
      say: [
        "From this moment, every byte is encrypted with that session key before it leaves your browser.",
        "Send your password again. On the wire it's now *8f3a2c9d…* — meaningless noise.",
        "The router in the middle still sees the packets go by, but it can't read them and can't tamper without being detected. This is the padlock in your address bar: https.",
      ],
      reveal: "TLS encrypts the connection — outsiders see only ciphertext. That's what https means.",
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "password=hunter2" },
          { ...MID, highlight: true, badge: "reads: 8f3a2c9d…" },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "encrypted — unreadable in transit" }],
        signals: [{ id: "s-cipher", linkId: "l-cs", from: "you", label: "8f3a2c9d…", color: "var(--ok)" }],
        caption: "Same data, now scrambled — gibberish to everyone but google.",
      },
    },
    {
      id: "b6-recap",
      say: [
        "Stack it all up. TCP made the pipe reliable. TLS proved the server's identity and encrypted everything flowing through it.",
        "So you now have a channel that is private, tamper-proof, and pointed at the genuine google.com.",
        "That's the whole promise of the little padlock — and it's finally safe to send the real request.",
      ],
      stage: {
        nodes: [
          { ...YOU, badge: "🔒 https" },
          { ...MID, dim: true, badge: "sees only ciphertext" },
          { ...SRV, badge: "verified" },
        ],
        links: [{ ...LINK, active: true, label: "private · verified · reliable" }],
        caption: "Identity + encryption, riding on TCP's reliability.",
      },
    },
    {
      id: "b7-check",
      say: ["A quick check on what the padlock actually guarantees."],
      interaction: {
        prompt: "You see the padlock (https) when sending your password to google.com. What does TLS guarantee?",
        choices: [
          {
            id: "c1",
            label: "Your password reaches the server faster",
            correct: false,
            feedback: "Speed isn't it — that's TCP's job, and even then it's about reliability, not raw speed.",
          },
          {
            id: "c2",
            label: "The server proved its identity and the data is encrypted, so routers in between can't read or forge it",
            correct: true,
            feedback: "Exactly. A CA-signed certificate proves who you're talking to, and encryption makes the data unreadable to anyone in the middle.",
          },
          {
            id: "c3",
            label: "Google promises never to store or misuse your password",
            correct: false,
            feedback: "That's a policy promise, not something TLS can enforce. TLS secures the data in transit, not what the server does afterward.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...YOU, badge: "🔒 https" },
          { ...MID, dim: true },
          { ...SRV, highlight: true, badge: "verified" },
        ],
        links: [{ ...LINK, active: true, label: "secure channel" }],
        caption: "Private, authenticated, and tamper-evident — end to end.",
      },
    },
  ],
};
