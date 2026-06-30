/**
 * Core domain types shared across lessons and the animation engine.
 */

export type OsiLayerId =
  | "application"
  | "presentation"
  | "session"
  | "transport"
  | "network"
  | "datalink"
  | "physical";

export interface OsiLayer {
  id: OsiLayerId;
  number: number;
  name: string;
  shortName: string;
  color: string;
  summary: string;
  examples: string[];
  pdu: string; // Protocol Data Unit name at this layer
}

/** A device drawn on the network canvas. */
export type DeviceKind =
  | "computer"
  | "hub"
  | "browser"
  | "switch"
  | "router"
  | "server"
  | "cloud"
  | "dns"
  | "loadbalancer";

export interface DeviceNode {
  id: string;
  kind: DeviceKind;
  label: string;
  /** Position in canvas coordinates (0-100 grid, percentage based). */
  x: number;
  y: number;
}

export interface CableLink {
  id: string;
  from: string; // device id
  to: string; // device id
}

/**
 * A single step in a lesson. The animation engine renders one step at a time
 * and exposes the data that changes so the UI can highlight it.
 */
export interface LessonStep {
  id: string;
  title: string;
  /** Plain-language explanation of what happens in this step. */
  narration: string;
  /** OSI layer most relevant to this step, used for highlighting. */
  layer: OsiLayerId;
  /** Device id that is "active"/responsible during this step. */
  activeDeviceId?: string;
  /** Optional packet animation to play for this step. */
  packet?: PacketAnimation;
  /** Key/value facts shown in the inspector for this step. */
  facts?: { label: string; value: string }[];
}

export interface PacketAnimation {
  /** Ordered device ids the packet travels through. */
  path: string[];
  label: string;
  /** Color of the packet, defaults to the step's layer color. */
  color?: string;
  /** Headers attached to the packet, outermost last. */
  headers?: PacketHeader[];
  payload?: string;
}

export interface PacketHeader {
  layer: OsiLayerId;
  name: string;
  fields: { key: string; value: string }[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  chapter: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  devices: DeviceNode[];
  links: CableLink[];
  steps: LessonStep[];
}
