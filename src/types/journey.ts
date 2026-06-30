import type { DeviceKind } from "./network";

/**
 * The narrative engine. A Chapter is a sequence of Beats. Each Beat declares a
 * minimal Stage (only what exists so far in the story), the teacher's narration
 * (revealed line by line), and an optional interaction.
 *
 * Nothing appears before the learner needs it — that is enforced by authoring,
 * not by the engine: each beat lists exactly the nodes that should be visible.
 */

export interface StageNode {
  id: string;
  kind: DeviceKind;
  label?: string;
  /** Position on a 0–100 grid (percentages of the stage). */
  x: number;
  y: number;
  /** De-emphasize (faded) — e.g. a "future" element teased in advance. */
  dim?: boolean;
  /** Pulsing focus ring. */
  highlight?: boolean;
  /** Small badge under the node, e.g. a MAC address once introduced. */
  badge?: string;
}

export interface StageLink {
  id: string;
  from: string;
  to: string;
  active?: boolean;
  dashed?: boolean;
  label?: string;
}

export interface StageSignal {
  id: string;
  /** Link to travel along. */
  linkId: string;
  /** Travel from this node id toward the other end. */
  from: string;
  label?: string;
  color?: string;
}

export interface StageModel {
  nodes: StageNode[];
  links?: StageLink[];
  signals?: StageSignal[];
  /** Optional centered special visual instead of / above the device scene. */
  inset?: "binary" | "mac" | "frame" | null;
  insetText?: string;
  /** MAC address string for the "mac" inset, e.g. "00:1A:2B:3C:4D:5E". */
  insetMac?: string;
  /** Field values for the "frame" inset. */
  insetFrame?: { dst: string; src: string; payload: string };
  /** Small caption shown beneath the stage. */
  caption?: string;
}

export interface Choice {
  id: string;
  label: string;
  correct?: boolean;
  feedback: string;
}

export interface Interaction {
  prompt: string;
  choices: Choice[];
}

export interface Beat {
  id: string;
  /** Teacher narration, revealed one paragraph at a time. */
  say: string[];
  stage: StageModel;
  /** A check-for-understanding shown after the narration is revealed. */
  interaction?: Interaction;
  /** Banner shown when a new concept is unlocked in this beat. */
  reveal?: string;
}

export interface Chapter {
  id: string;
  number: number;
  slug: string;
  /** The single question this chapter answers. */
  question: string;
  title: string;
  /** One-line promise of what the learner will understand. */
  promise: string;
  /** Cliffhanger shown at the end that motivates the next chapter. */
  bridge: string;
  beats: Beat[];
}

export interface RoadmapEntry {
  number: number;
  question: string;
  concept: string;
  slug?: string;
  status: "ready" | "soon";
}
