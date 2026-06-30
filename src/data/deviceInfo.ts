import type { DeviceKind, OsiLayerId } from "@/types/network";

export interface DeviceInfo {
  title: string;
  layer: OsiLayerId;
  definition: string;
  purpose: string;
  responsibilities: string[];
  analogy: string;
  dataStructures: string[];
  examplePacket: string;
  interviewQuestions: string[];
  misconceptions: string[];
  linuxCommands: string[];
  wireshark: string[];
}

export const DEVICE_INFO: Record<DeviceKind, DeviceInfo> = {
  computer: {
    title: "Computer / Host",
    layer: "application",
    definition:
      "A machine that stores and processes information as bits, and can produce or consume data to communicate with other machines.",
    purpose: "Turn human intent into bits, and bits back into something humans understand.",
    responsibilities: [
      "Store and process data as bits",
      "Encode messages into signals",
      "Decode incoming signals into data",
    ],
    analogy: "A person who can read, write, and think — but needs a way to mail letters.",
    dataStructures: ["Memory (RAM)", "Files on disk", "Network interface buffer"],
    examplePacket: "'h' -> 01101000 -> voltage pulses on the wire",
    interviewQuestions: [
      "What is a bit and a byte?",
      "How is text represented in binary (ASCII/UTF-8)?",
    ],
    misconceptions: [
      "Computers do not send 'letters' or 'pictures' — only bits.",
      "A lone computer can create data but has nowhere to send it.",
    ],
    linuxCommands: ["echo -n h | xxd -b", "hostname"],
    wireshark: ["frame", "data"],
  },
  hub: {
    title: "Hub (Repeater)",
    layer: "physical",
    definition:
      "A simple Layer 1 device that electrically repeats every incoming signal out to all of its other ports.",
    purpose: "Let many computers share one connection instead of wiring every pair directly.",
    responsibilities: [
      "Repeat incoming bits to every other port",
      "Connect multiple devices into one shared segment",
    ],
    analogy: "A person who hears one word and shouts it to everyone in the room.",
    dataStructures: ["None — a hub keeps no tables and makes no decisions"],
    examplePacket: "A's bits arrive -> copied to B and C unchanged",
    interviewQuestions: [
      "Why is a hub considered a single collision domain?",
      "How does a hub differ from a switch?",
    ],
    misconceptions: [
      "A hub does NOT look at addresses — it copies bits blindly.",
      "A hub gives no privacy: every device sees every message.",
    ],
    linuxCommands: ["ip link show", "tcpdump -i eth0"],
    wireshark: ["eth", "frame"],
  },
  browser: {
    title: "Browser / Host",
    layer: "application",
    definition:
      "An end host application that initiates network requests on behalf of a user, such as a web browser issuing an HTTP request.",
    purpose:
      "Turn a human intent (open google.com) into structured network requests and render the response.",
    responsibilities: [
      "Resolve hostnames via DNS",
      "Open TCP/TLS connections",
      "Build HTTP requests",
      "Render the returned response",
    ],
    analogy: "A person writing a letter, addressing the envelope, and reading the reply.",
    dataStructures: ["DNS cache", "Socket table", "Cookie jar", "Connection pool"],
    examplePacket: "GET / HTTP/1.1\\nHost: google.com",
    interviewQuestions: [
      "What happens when you type a URL and press Enter?",
      "How does the browser reuse TCP connections (keep-alive)?",
      "Why does the browser cache DNS results?",
    ],
    misconceptions: [
      "The browser does NOT know the server's IP up front — it must resolve it.",
      "HTTPS is not a different protocol from HTTP; it is HTTP over TLS.",
    ],
    linuxCommands: ["curl -v https://example.com", "getent hosts example.com"],
    wireshark: ["http.request", "tls.handshake.type == 1"],
  },
  switch: {
    title: "Switch",
    layer: "datalink",
    definition:
      "A Layer 2 device that forwards Ethernet frames between devices on the same local network using MAC addresses.",
    purpose: "Deliver frames only to the port where the destination device lives, not everywhere.",
    responsibilities: [
      "Learn MAC→port mappings",
      "Forward frames to the correct port",
      "Flood when destination is unknown",
      "Maintain the MAC address table",
    ],
    analogy: "A mailroom clerk who learns which desk each employee sits at.",
    dataStructures: ["MAC address table (CAM table)", "Per-port buffers"],
    examplePacket: "Frame: dst=aa:bb:cc:dd:ee:ff src=11:22:33:44:55:66",
    interviewQuestions: [
      "How does a switch differ from a hub?",
      "What happens on a MAC table miss?",
      "What is a broadcast domain vs collision domain?",
    ],
    misconceptions: [
      "A switch does NOT look at IP addresses for normal forwarding.",
      "Switches do not change MAC addresses; routers do.",
    ],
    linuxCommands: ["bridge fdb show", "ip link show"],
    wireshark: ["eth.dst", "eth.src"],
  },
  router: {
    title: "Router",
    layer: "network",
    definition:
      "A Layer 3 device that forwards IP packets between different networks based on a routing table.",
    purpose: "Decide the next hop toward a destination IP and move packets across network boundaries.",
    responsibilities: [
      "Consult the routing table",
      "Decrement TTL",
      "Rewrite source/destination MAC for the next hop",
      "Perform NAT at the network edge",
    ],
    analogy: "A postal sorting hub that routes mail toward the right city.",
    dataStructures: ["Routing table (FIB)", "ARP table", "NAT translation table"],
    examplePacket: "IP: src=192.168.1.10 dst=142.250.72.14 ttl=63",
    interviewQuestions: [
      "What changes in a packet at each router hop?",
      "Why does the IP stay the same but the MAC change?",
      "How does longest-prefix match work?",
    ],
    misconceptions: [
      "The source/destination IP does NOT change hop to hop (except at NAT).",
      "TTL prevents infinite loops; it is not a time in seconds in practice.",
    ],
    linuxCommands: ["ip route", "traceroute google.com", "ip neigh"],
    wireshark: ["ip.ttl", "ip.dst", "icmp.type == 11"],
  },
  server: {
    title: "Origin Server",
    layer: "application",
    definition:
      "The host running the application that ultimately produces the response to a client request.",
    purpose: "Accept connections, process requests, and return application data such as HTML or JSON.",
    responsibilities: [
      "Listen on a port (e.g. 443)",
      "Terminate TCP/TLS",
      "Run application logic",
      "Return HTTP responses",
    ],
    analogy: "The chef in the kitchen who actually prepares the meal you ordered.",
    dataStructures: ["Listen/accept queues", "Session store", "Connection table"],
    examplePacket: "HTTP/1.1 200 OK\\nContent-Type: text/html",
    interviewQuestions: [
      "What is the TCP backlog and accept queue?",
      "How does a server handle thousands of concurrent connections?",
      "What is the difference between a process and an event loop model?",
    ],
    misconceptions: [
      "One server can serve many domains (virtual hosting) on the same IP.",
      "A 200 OK does not guarantee correct application behavior.",
    ],
    linuxCommands: ["ss -ltnp", "netstat -tulpn"],
    wireshark: ["http.response.code == 200", "tcp.flags.syn == 1"],
  },
  dns: {
    title: "DNS Resolver",
    layer: "application",
    definition:
      "A system that translates human-readable domain names into IP addresses using a hierarchy of name servers.",
    purpose: "Answer 'what IP is google.com?' so the host can open a connection.",
    responsibilities: [
      "Check local and resolver caches",
      "Query root, TLD, and authoritative servers",
      "Return A/AAAA records with a TTL",
    ],
    analogy: "A phone book that maps a person's name to their phone number.",
    dataStructures: ["Resolver cache", "Zone files", "Record TTLs"],
    examplePacket: "DNS Query: google.com A?  →  Answer: 142.250.72.14",
    interviewQuestions: [
      "What is the difference between recursive and iterative resolution?",
      "What are A, AAAA, CNAME, and MX records?",
      "Why does DNS mostly use UDP port 53?",
    ],
    misconceptions: [
      "DNS does not 'connect' you to the site; it only returns an address.",
      "A single name can map to many IPs (round-robin / GeoDNS).",
    ],
    linuxCommands: ["dig google.com", "nslookup google.com", "resolvectl query google.com"],
    wireshark: ["dns.qry.name", "dns.flags.response == 1"],
  },
  loadbalancer: {
    title: "Load Balancer",
    layer: "transport",
    definition:
      "A device or service that distributes incoming connections across multiple backend servers.",
    purpose: "Spread load, improve availability, and provide a single stable entry point.",
    responsibilities: [
      "Health-check backends",
      "Choose a backend (round-robin, least-conn, hashing)",
      "Optionally terminate TLS",
      "Preserve or rewrite client info",
    ],
    analogy: "A host at a restaurant seating guests across many available tables.",
    dataStructures: ["Backend pool", "Health check state", "Connection/affinity table"],
    examplePacket: "TCP SYN → VIP 203.0.113.5:443 → backend 10.0.0.7:443",
    interviewQuestions: [
      "What is the difference between L4 and L7 load balancing?",
      "How does session affinity (sticky sessions) work?",
      "What happens when a backend fails a health check?",
    ],
    misconceptions: [
      "A load balancer is not just round-robin DNS; it tracks live state.",
      "L7 balancers can read HTTP; L4 balancers only see TCP/UDP.",
    ],
    linuxCommands: ["ipvsadm -Ln", "curl -I https://service.example.com"],
    wireshark: ["tcp.flags.syn == 1 && tcp.flags.ack == 0", "http.host"],
  },
  cloud: {
    title: "Internet / ISP Backbone",
    layer: "network",
    definition:
      "The mesh of autonomous systems, ISPs, and backbone routers that carry packets across the globe.",
    purpose: "Move packets between independent networks using BGP-advertised routes.",
    responsibilities: [
      "Exchange routes via BGP",
      "Carry traffic across autonomous systems",
      "Peer at internet exchange points",
    ],
    analogy: "The international highway and shipping system connecting all cities.",
    dataStructures: ["BGP routing tables", "AS path lists", "Peering agreements"],
    examplePacket: "BGP UPDATE: prefix 142.250.0.0/15 via AS15169",
    interviewQuestions: [
      "What is an Autonomous System (AS)?",
      "How does BGP choose between routes?",
      "What is the difference between peering and transit?",
    ],
    misconceptions: [
      "There is no single 'internet computer' — it is many cooperating networks.",
      "Routing is policy-driven, not always shortest-path.",
    ],
    linuxCommands: ["traceroute -A google.com", "mtr google.com"],
    wireshark: ["bgp", "ip.dst"],
  },
};
