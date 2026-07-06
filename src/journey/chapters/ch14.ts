import type { Chapter } from "@/types/journey";

const YOU = { id: "you", kind: "browser" as const, label: "Your browser", x: 24, y: 48 };
const SRV = { id: "srv", kind: "server" as const, label: "google.com", x: 76, y: 48 };
const LINK = { id: "l-cs", from: "you", to: "srv" };

/**
 * Chapter 14 (finale) — HTTP & rendering. Over the secure, reliable channel the
 * browser finally sends a request ("GET /"), the server replies with a status,
 * headers and an HTML body, and the browser fetches the referenced files and
 * paints the page. This closes the whole "I typed google.com" journey.
 */
export const chapter14: Chapter = {
  id: "ch14",
  number: 14,
  slug: "http-and-rendering",
  question: "How does the page finally appear?",
  title: "HTTP: asking for the page",
  promise: "You'll watch the browser ask for the page, get it back, and turn the bytes into pixels — the last step of the whole journey.",
  bridge:
    "Look back at what just happened. You started with a single computer that only knew how to flip bits on and off. Fourteen steps later, that same machine can name a server on the other side of the planet, find it, reach it across a dozen networks, trust it, and paint its page — all in the time it takes to blink. That's the Internet: not one clever machine, but millions of simple ones, each solving one small problem, composed into something that feels like magic. Now you know how it actually works.",
  beats: [
    {
      id: "b1-request",
      say: [
        "Everything is finally in place: the right server, a reliable connection, and a private, encrypted channel.",
        "So your browser does the one thing it wanted to do all along — it *asks for the page*.",
        "It sends an HTTP *request*. The very first one is tiny: “GET /” — give me whatever lives at the homepage.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "GET /" }],
        signals: [{ id: "s-req", linkId: "l-cs", from: "you", label: "GET /", color: "var(--accent-2)" }],
        inset: "http",
        insetHttp: {
          kind: "request",
          start: "GET / HTTP/1.1",
          headers: [
            { k: "Host", v: "google.com" },
            { k: "User-Agent", v: "Firefox/…" },
            { k: "Accept", v: "text/html" },
          ],
          note: "Readable text, wrapped inside the encrypted TLS stream.",
        },
        caption: "The request is just a few lines of text.",
      },
    },
    {
      id: "b2-anatomy",
      say: [
        "Every request has the same shape. A *method* says what you want: GET means “give me”, POST means “here's some data”.",
        "A *path* says which thing: “/” is the homepage, “/search” a different page. And *headers* add details — who your browser is, what languages and formats you accept.",
        "That's it. HTTP is a short, readable conversation on top of everything you've built.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "method · path · headers" }],
        inset: "http",
        insetHttp: {
          kind: "request",
          start: "GET /search HTTP/1.1",
          headers: [
            { k: "Host", v: "google.com" },
            { k: "Accept-Language", v: "en-US" },
            { k: "Accept", v: "text/html,image/*" },
          ],
          note: "Method + path + headers — nothing more.",
        },
        caption: "A method, a path, and a handful of headers.",
      },
    },
    {
      id: "b3-response",
      say: [
        "The server reads the request and sends back an HTTP *response*.",
        "It opens with a *status code*: 200 means “OK, here it is.” You've met its cousin 404 — “not found.”",
        "Then headers describe what's coming (Content-Type: text/html), and finally the *body*: the page itself, as HTML.",
      ],
      reveal: "A response is a status code + headers + a body — here, the HTML of the page.",
      stage: {
        nodes: [
          { ...YOU },
          { ...SRV, highlight: true },
        ],
        links: [{ ...LINK, active: true, label: "200 OK + HTML" }],
        signals: [{ id: "s-res", linkId: "l-cs", from: "srv", label: "200 OK", color: "var(--ok)" }],
        inset: "http",
        insetHttp: {
          kind: "response",
          start: "HTTP/1.1 200 OK",
          headers: [
            { k: "Content-Type", v: "text/html" },
            { k: "Content-Length", v: "1024" },
          ],
          body: "<html>\n  <head><title>Google</title></head>\n  <body>…</body>\n</html>",
          note: "The body is HTML — a text description of the page.",
        },
        caption: "Status, headers, and the HTML body come back.",
      },
    },
    {
      id: "b4-parse",
      say: [
        "That HTML is not a picture — it's *text that describes structure*: a title here, a search box there, a logo, some links.",
        "The browser reads it top to bottom and builds a tree of elements in memory, then starts painting them onto the screen.",
        "But as it reads, it notices the page points at *other* files it still needs: a stylesheet, some scripts, images.",
      ],
      stage: {
        nodes: [
          { ...YOU, highlight: true },
          { ...SRV },
        ],
        links: [{ ...LINK, label: "parse HTML → draw" }],
        inset: "http",
        insetHttp: {
          kind: "response",
          start: "HTTP/1.1 200 OK",
          headers: [{ k: "Content-Type", v: "text/html" }],
          body: "<link rel=\"stylesheet\" href=\"/style.css\">\n<script src=\"/app.js\"></script>\n<img src=\"/logo.png\">",
          note: "The HTML references more files the browser must fetch.",
        },
        caption: "HTML is a blueprint — and it lists more parts to collect.",
      },
    },
    {
      id: "b5-subresources",
      say: [
        "So the browser does it all again — for each referenced file, another request on the same secure connection.",
        "The stylesheet comes back and the plain page gains colour and layout. The script arrives and the page becomes interactive. The images load and the logo appears.",
        "A web page isn't one file. It's an HTML document plus a flurry of follow-up requests, assembled live in front of you.",
      ],
      reveal: "A page is an HTML document plus many follow-up requests, assembled by the browser.",
      stage: {
        nodes: [
          { ...YOU, highlight: true },
          { ...SRV },
        ],
        links: [{ ...LINK, active: true, label: "CSS · JS · images" }],
        signals: [
          { id: "s-css", linkId: "l-cs", from: "you", label: "GET /style.css", color: "var(--accent-2)" },
          { id: "s-img", linkId: "l-cs", from: "srv", label: "logo.png", color: "var(--accent-4)" },
        ],
        caption: "Each part is the same request-and-response dance.",
      },
    },
    {
      id: "b6-finale",
      say: [
        "Step back and watch the whole thing at once. You typed *google.com* and pressed Enter.",
        "DNS turned the name into an address. Routers carried your packets network to network across the planet. TCP made the delivery reliable; TLS made it private. HTTP asked for the page, and your browser painted it.",
        "All of that — naming, finding, reaching, trusting, drawing — happens in the blink between Enter and the page appearing.",
      ],
      reveal: "That's the web: independent systems, each solving one problem, composed into one experience.",
      stage: {
        nodes: [
          { ...YOU, highlight: true, badge: "🔒 google.com" },
          { ...SRV, badge: "page delivered" },
        ],
        links: [{ ...LINK, active: true, label: "name → address → packets → reliable → private → page" }],
        signals: [{ id: "s-done", linkId: "l-cs", from: "srv", label: "the page", color: "var(--ok)" }],
        caption: "One key press, the entire Internet in motion.",
      },
    },
    {
      id: "b7-check",
      say: ["One last check — on how a whole page arrives."],
      interaction: {
        prompt: "The server's first response was the HTML. Why does the browser then send even more requests?",
        choices: [
          {
            id: "c1",
            label: "Because the first response failed and had to be retried",
            correct: false,
            feedback: "No — a 200 OK means it succeeded. The extra requests are for different files, not retries.",
          },
          {
            id: "c2",
            label: "The HTML references other files — CSS, scripts, images — and each needs its own request",
            correct: true,
            feedback: "Exactly. The HTML is a blueprint that points at more resources, and the browser fetches each one to fully build the page.",
          },
          {
            id: "c3",
            label: "To open a new TCP connection for every single word on the page",
            correct: false,
            feedback: "Not per word — and modern browsers reuse the same connection for many of these follow-up requests.",
          },
        ],
      },
      stage: {
        nodes: [
          { ...YOU, badge: "🔒 https" },
          { ...SRV, highlight: true, badge: "page delivered" },
        ],
        links: [{ ...LINK, active: true, label: "HTML + CSS + JS + images = the page" }],
        caption: "From one key press to a finished page on your screen.",
      },
    },
  ],
};
