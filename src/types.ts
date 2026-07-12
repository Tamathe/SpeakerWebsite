export type SignalColor = "chartreuse" | "cyan" | "orange";

export interface LinkAction {
  label: string;
  href: string;
}

export interface SignalNode {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  color: SignalColor;
  position: { x: number; y: number };
  thesis: string;
  problem: string;
  aiRole: string;
  humanGuardrail: string;
  evidence: string;
  sourceLabel: string;
  sourceHref?: string;
  keywords: string[];
}

export interface TalkItem {
  id: string;
  title: string;
  audience: string;
  summary: string;
  href?: string;
  note?: string;
  keywords: string[];
}

export interface FieldNote {
  type: string;
  title: string;
  summary: string;
}

export interface CredentialItem {
  label: string;
  detail: string;
}

export interface BriefingPreset {
  label: string;
  prompt: string;
}

export interface BriefingResult {
  query: string;
  intent: string;
  headline: string;
  summary: string;
  rationale: string;
  matches: SignalNode[];
}

export interface SystemLayer {
  id: string;
  index: string;
  label: string;
  title: string;
  description: string;
  failure: string;
  question: string;
}
