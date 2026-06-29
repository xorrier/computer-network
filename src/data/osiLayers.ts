import type { OsiLayer, OsiLayerId } from "@/types/network";

export const OSI_LAYERS: OsiLayer[] = [
  {
    id: "application",
    number: 7,
    name: "Application",
    shortName: "App",
    color: "var(--layer-app)",
    summary: "Where user-facing protocols live. Produces the data a human cares about.",
    examples: ["HTTP", "DNS", "TLS handshake intent", "SMTP", "FTP"],
    pdu: "Data",
  },
  {
    id: "presentation",
    number: 6,
    name: "Presentation",
    shortName: "Present",
    color: "var(--layer-present)",
    summary: "Translates, encrypts, and compresses data into a wire-ready format.",
    examples: ["TLS encryption", "UTF-8 encoding", "JPEG/PNG", "Compression"],
    pdu: "Data",
  },
  {
    id: "session",
    number: 5,
    name: "Session",
    shortName: "Session",
    color: "var(--layer-session)",
    summary: "Opens, manages, and closes conversations between applications.",
    examples: ["TLS session", "RPC", "Sockets", "NetBIOS"],
    pdu: "Data",
  },
  {
    id: "transport",
    number: 4,
    name: "Transport",
    shortName: "Transport",
    color: "var(--layer-transport)",
    summary: "End-to-end delivery: ports, reliability, ordering, and flow control.",
    examples: ["TCP", "UDP", "Port numbers", "Sequence/ACK"],
    pdu: "Segment (TCP) / Datagram (UDP)",
  },
  {
    id: "network",
    number: 3,
    name: "Network",
    shortName: "Network",
    color: "var(--layer-network)",
    summary: "Logical addressing and routing of packets across networks.",
    examples: ["IP", "ICMP", "Routing tables", "TTL"],
    pdu: "Packet",
  },
  {
    id: "datalink",
    number: 2,
    name: "Data Link",
    shortName: "Data Link",
    color: "var(--layer-datalink)",
    summary: "Local delivery on a single link using MAC addresses and frames.",
    examples: ["Ethernet", "ARP", "MAC addresses", "Switching"],
    pdu: "Frame",
  },
  {
    id: "physical",
    number: 1,
    name: "Physical",
    shortName: "Physical",
    color: "var(--layer-physical)",
    summary: "Raw bits as electrical, optical, or radio signals on the medium.",
    examples: ["Cables", "Voltage levels", "Wi-Fi radio", "Fiber light"],
    pdu: "Bits",
  },
];

export const OSI_BY_ID: Record<OsiLayerId, OsiLayer> = Object.fromEntries(
  OSI_LAYERS.map((l) => [l.id, l]),
) as Record<OsiLayerId, OsiLayer>;

export function layerColor(id: OsiLayerId): string {
  return OSI_BY_ID[id].color;
}
