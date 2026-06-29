import type { Lesson } from "@/types/network";

/**
 * Chapter 1 — the continuous story: what actually happens when a user
 * types "google.com" and presses Enter. Every later chapter zooms into
 * one of these steps.
 */
export const packetJourneyLesson: Lesson = {
  id: "packet-journey",
  slug: "packet-journey",
  title: "What happens when you type google.com?",
  subtitle: "Follow a single request from your browser to the server and back.",
  chapter: 1,
  difficulty: "Beginner",
  durationMin: 8,
  devices: [
    { id: "browser", kind: "browser", label: "Your Browser", x: 8, y: 52 },
    { id: "dns", kind: "dns", label: "DNS Resolver", x: 25, y: 16 },
    { id: "switch", kind: "switch", label: "Switch", x: 25, y: 52 },
    { id: "router", kind: "router", label: "Home Router", x: 43, y: 52 },
    { id: "internet", kind: "cloud", label: "Internet / ISP", x: 61, y: 52 },
    { id: "lb", kind: "loadbalancer", label: "Load Balancer", x: 79, y: 52 },
    { id: "server", kind: "server", label: "Google Server", x: 93, y: 52 },
  ],
  links: [
    { id: "l-browser-switch", from: "browser", to: "switch" },
    { id: "l-switch-dns", from: "switch", to: "dns" },
    { id: "l-switch-router", from: "switch", to: "router" },
    { id: "l-router-internet", from: "router", to: "internet" },
    { id: "l-internet-lb", from: "internet", to: "lb" },
    { id: "l-lb-server", from: "lb", to: "server" },
  ],
  steps: [
    {
      id: "intent",
      title: "You press Enter",
      narration:
        "The browser has a hostname (google.com) but no IP address yet. It cannot send anything until it learns where google.com actually lives on the network.",
      layer: "application",
      activeDeviceId: "browser",
      facts: [
        { label: "Hostname", value: "google.com" },
        { label: "Known IP", value: "none yet" },
        { label: "Next action", value: "DNS lookup" },
      ],
    },
    {
      id: "dns-query",
      title: "DNS lookup: what is google.com?",
      narration:
        "The browser asks a DNS resolver to translate the name into an IP address. The query travels through your switch to the resolver. DNS usually rides on UDP port 53.",
      layer: "application",
      activeDeviceId: "dns",
      packet: {
        path: ["browser", "switch", "dns"],
        label: "DNS?",
        headers: [
          { layer: "transport", name: "UDP", fields: [{ key: "dst port", value: "53" }] },
          {
            layer: "application",
            name: "DNS Query",
            fields: [
              { key: "name", value: "google.com" },
              { key: "type", value: "A" },
            ],
          },
        ],
        payload: "google.com  A?",
      },
      facts: [
        { label: "Protocol", value: "DNS over UDP" },
        { label: "Port", value: "53" },
      ],
    },
    {
      id: "dns-answer",
      title: "DNS answers with an IP",
      narration:
        "The resolver returns an A record. Now the browser knows google.com lives at 142.250.72.14 and can finally open a connection. The result is cached for its TTL.",
      layer: "application",
      activeDeviceId: "browser",
      packet: {
        path: ["dns", "switch", "browser"],
        label: "A rec",
        color: "var(--ok)",
        headers: [
          {
            layer: "application",
            name: "DNS Answer",
            fields: [
              { key: "google.com", value: "142.250.72.14" },
              { key: "TTL", value: "300s" },
            ],
          },
        ],
        payload: "142.250.72.14",
      },
      facts: [
        { label: "Resolved IP", value: "142.250.72.14" },
        { label: "Cached for", value: "300s (TTL)" },
      ],
    },
    {
      id: "arp",
      title: "ARP: who owns the gateway IP?",
      narration:
        "The destination is on another network, so the packet must go to the router (default gateway). To build an Ethernet frame, the host needs the router's MAC address, so it broadcasts an ARP request on the local link.",
      layer: "datalink",
      activeDeviceId: "switch",
      packet: {
        path: ["browser", "switch"],
        label: "ARP?",
        color: "var(--layer-datalink)",
        headers: [
          {
            layer: "datalink",
            name: "ARP Request",
            fields: [
              { key: "who-has", value: "192.168.1.1" },
              { key: "tell", value: "192.168.1.10" },
            ],
          },
        ],
        payload: "Broadcast ff:ff:ff:ff:ff:ff",
      },
      facts: [
        { label: "Gateway IP", value: "192.168.1.1" },
        { label: "ARP scope", value: "local link only" },
      ],
    },
    {
      id: "tcp-syn",
      title: "TCP handshake begins (SYN)",
      narration:
        "With the gateway MAC known, the browser opens a TCP connection by sending a SYN toward the server's IP. The IP stays the same end-to-end; only the MAC changes at each hop.",
      layer: "transport",
      activeDeviceId: "router",
      packet: {
        path: ["browser", "switch", "router", "internet"],
        label: "SYN",
        color: "var(--layer-transport)",
        headers: [
          { layer: "datalink", name: "Ethernet", fields: [{ key: "dst mac", value: "router" }] },
          {
            layer: "network",
            name: "IP",
            fields: [
              { key: "src", value: "192.168.1.10" },
              { key: "dst", value: "142.250.72.14" },
              { key: "ttl", value: "64" },
            ],
          },
          {
            layer: "transport",
            name: "TCP",
            fields: [
              { key: "dst port", value: "443" },
              { key: "flags", value: "SYN" },
              { key: "seq", value: "0" },
            ],
          },
        ],
        payload: "TCP SYN",
      },
      facts: [
        { label: "Dst port", value: "443 (HTTPS)" },
        { label: "Flags", value: "SYN" },
      ],
    },
    {
      id: "routing",
      title: "Routing across the internet",
      narration:
        "Each router decrements the TTL and forwards the packet toward the destination network using its routing table. The packet crosses many autonomous systems before reaching Google.",
      layer: "network",
      activeDeviceId: "internet",
      packet: {
        path: ["router", "internet", "lb"],
        label: "IP pkt",
        color: "var(--layer-network)",
        headers: [
          {
            layer: "network",
            name: "IP",
            fields: [
              { key: "src", value: "203.0.113.7 (NAT)" },
              { key: "dst", value: "142.250.72.14" },
              { key: "ttl", value: "57" },
            ],
          },
        ],
        payload: "Forwarded hop by hop",
      },
      facts: [
        { label: "NAT applied", value: "yes (at router)" },
        { label: "TTL", value: "decreasing each hop" },
      ],
    },
    {
      id: "loadbalancer",
      title: "Load balancer picks a backend",
      narration:
        "Google's edge load balancer terminates the connection and chooses one healthy backend server to handle your request, spreading traffic across the fleet.",
      layer: "transport",
      activeDeviceId: "lb",
      packet: {
        path: ["lb", "server"],
        label: "→ srv",
        color: "var(--accent-4)",
        headers: [
          {
            layer: "transport",
            name: "TCP",
            fields: [
              { key: "to backend", value: "10.0.0.7:443" },
              { key: "algo", value: "least-conn" },
            ],
          },
        ],
        payload: "Dispatched to backend",
      },
      facts: [
        { label: "Strategy", value: "least connections" },
        { label: "Backend", value: "10.0.0.7" },
      ],
    },
    {
      id: "http",
      title: "HTTP request reaches the server",
      narration:
        "After the TLS handshake, the browser sends the actual HTTP request inside the encrypted connection. The server runs its application logic to build a response.",
      layer: "application",
      activeDeviceId: "server",
      packet: {
        path: ["browser", "switch", "router", "internet", "lb", "server"],
        label: "GET /",
        color: "var(--layer-app)",
        headers: [
          { layer: "transport", name: "TCP", fields: [{ key: "dst port", value: "443" }] },
          {
            layer: "application",
            name: "HTTP",
            fields: [
              { key: "method", value: "GET" },
              { key: "path", value: "/" },
              { key: "host", value: "google.com" },
            ],
          },
        ],
        payload: "GET / HTTP/1.1  Host: google.com",
      },
      facts: [
        { label: "Method", value: "GET /" },
        { label: "Encrypted", value: "yes (TLS)" },
      ],
    },
    {
      id: "response",
      title: "The response travels back",
      narration:
        "The server returns 200 OK with the HTML. The response retraces the path back to your browser, which parses the HTML and renders the page you see.",
      layer: "application",
      activeDeviceId: "browser",
      packet: {
        path: ["server", "lb", "internet", "router", "switch", "browser"],
        label: "200 OK",
        color: "var(--ok)",
        headers: [
          {
            layer: "application",
            name: "HTTP Response",
            fields: [
              { key: "status", value: "200 OK" },
              { key: "type", value: "text/html" },
            ],
          },
        ],
        payload: "<!doctype html> …",
      },
      facts: [
        { label: "Status", value: "200 OK" },
        { label: "Browser", value: "parses + renders" },
      ],
    },
  ],
};
