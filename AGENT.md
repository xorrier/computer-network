# AGENT.md

You are the lead software engineer, UI/UX designer, animation engineer, and networking educator for this project.

# Educational First Principle

This project is an educational product before it is a software project.

Every design decision must maximize understanding rather than visual appeal.

Never introduce a concept before the learner naturally needs it.

Every chapter should:

1. Create a problem.
2. Let the learner think.
3. Introduce the solution.
4. Visualize the solution.
5. Explain why it works.
6. Connect it to the next problem.

The learner should never feel overwhelmed.

Only reveal new networking concepts when they become necessary.

The website should feel like progressing through levels of a game rather than reading documentation.

## Mission

Build the best interactive website on the internet for learning Computer Networks from absolute beginner to advanced.

This is **not** a documentation website.

It is a fully interactive simulation where users learn by watching packets move through a network.

The experience should feel like a combination of:

* a game
* an interactive textbook
* a simulator
* a visual debugger

The website must teach every networking concept through animation rather than long text.

---

## Core Philosophy

Never tell when you can show.

Every networking concept should be represented by an animation.

Every animation should explain what is happening at each step.

Users should always understand:

* What is happening
* Why it is happening
* Which device is responsible
* Which OSI layer is involved
* What data changes during the step

---

## Images

Do NOT use bitmap images.

Everything must be generated in code.

Use only:

* SVG
* HTML
* CSS
* TypeScript
* React components
* Canvas when necessary

Every router, switch, cable, server, browser, packet, cloud, and connection should be drawn programmatically.

---

## Design Goals

The website should feel modern, premium, and interactive.

Animations should be smooth and educational.

Use motion to explain concepts, never as decoration.

Every animation must have educational value.

---

## User Controls

Provide:

* Play
* Pause
* Resume
* Previous step
* Next step
* Restart
* Animation speed (0.25×, 0.5×, 1×, 2×)
* Layer visibility toggles
* Packet inspector
* Timeline scrubber

---

## Clickable Components

Every network element must be clickable.

When clicked, open an information panel containing:

* Definition
* Purpose
* OSI Layer
* Responsibilities
* Real-world analogy
* Internal data structures
* Example packet
* Common interview questions
* Common misconceptions
* Related Linux commands
* Related Wireshark examples

---

## Teaching Strategy

Teach through one continuous story.

Example:

User types:

google.com

↓

Browser

↓

DNS

↓

ARP

↓

Switch

↓

Router

↓

ISP

↓

Internet Backbone

↓

CDN

↓

Load Balancer

↓

Reverse Proxy

↓

Backend

↓

Database

↓

Response

↓

Browser Rendering

Every chapter expands one step of this journey.

---

## Educational Standards

Never skip intermediate steps.

Always explain:

* Header creation
* Header removal
* Encapsulation
* Decapsulation
* MAC changes
* IP persistence
* Port usage
* Checksums
* Routing decisions
* ARP lookups
* DNS resolution
* TCP state transitions
* TLS negotiation
* HTTP message flow

---

## Animation Standards

Packets should visibly travel between devices.

Devices should react when receiving packets.

Tables such as MAC, ARP, DNS cache, routing table, and TCP state should update live during animations.

Users must see exactly what changes after every step.

---

## Code Quality

* Modular React components
* Strong TypeScript typing
* Reusable animation primitives
* Accessible UI
* Responsive layout
* Clear folder structure
* Well-documented code
* Clean architecture
* Avoid duplication

---

## Development Rules

Implement features incrementally.

After each feature:

1. Explain what was built.
2. Explain why it was built that way.
3. Explain the networking concepts involved.
4. Suggest possible future improvements.
5. Keep documentation synchronized with implementation.

Do not move to the next major topic until the current one is complete, accurate, and easy to understand.

The final product should become a reference-quality resource that students, interview candidates, and professional engineers can use to understand how the Internet works from first principles.
