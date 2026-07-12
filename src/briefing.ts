import { signalNodes } from "./content";
import type { BriefingResult, SignalNode } from "./types";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "should",
  "the",
  "to",
  "we",
  "what",
  "with",
  "would",
  "you",
]);

function terms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 1 && !stopWords.has(term));
}

function scoreNode(queryTerms: string[], node: SignalNode) {
  const searchable = terms(
    [
      node.title,
      node.thesis,
      node.problem,
      node.aiRole,
      node.humanGuardrail,
      node.evidence,
      ...node.keywords,
    ].join(" "),
  );

  return queryTerms.reduce((score, term) => {
    const exact = searchable.filter((candidate) => candidate === term).length;
    const partial = searchable.some(
      (candidate) => candidate.startsWith(term) || term.startsWith(candidate),
    );
    return score + exact * 3 + (partial ? 1 : 0);
  }, 0);
}

function detectIntent(query: string) {
  const normalized = query.toLowerCase();

  if (/conference|speaker|speaking|keynote|panel|retreat|talk/.test(normalized)) {
    return {
      label: "Talks and workshops",
      headline: "I would start with the work, not with a tour of AI tools.",
      framing:
        "The talks that land best use a real healthcare problem to show what AI can do, where it breaks, and what people still have to own.",
    };
  }

  if (/teach|learn|student|faculty|curriculum|educat|training|literacy/.test(normalized)) {
    return {
      label: "Teaching and AI literacy",
      headline: "Clinicians do not need another list of AI tools.",
      framing:
        "They need a chance to use the tools, test the output, see where it fails, and decide when AI does not belong in the task.",
    };
  }

  if (/state|public|rural|kentucky|population|community|government/.test(normalized)) {
    return {
      label: "Kentucky and public health",
      headline: "Finding people is only useful if we can connect them to care.",
      framing:
        "The work is as much about referrals, patient navigation, local capacity, and follow-up as it is about the model.",
    };
  }

  if (/hospital|health system|clinic|clinical|pilot|implement|workflow/.test(normalized)) {
    return {
      label: "Healthcare implementation",
      headline: "A good model can still make a bad project.",
      framing:
        "If it does not fit the workflow, make sense to the people using it, and lead to a clear next step, it will not help for long.",
    };
  }

  if (/partner|collaborat|build|project|work together/.test(normalized)) {
    return {
      label: "Potential collaboration",
      headline: "Bring me a real problem and the people who live with it.",
      framing:
        "That is usually enough to start figuring out whether AI belongs in the solution and what would have to happen after the model gives an answer.",
    };
  }

  return {
    label: "Closest matches",
    headline: "Here is the work that is closest to your question.",
    framing:
      "These matches come from the projects and talks listed on this page. The search does not add new claims or write an answer for me.",
  };
}

export function buildBriefing(query: string): BriefingResult {
  const cleanQuery = query.trim() || "How do you make AI useful in healthcare?";
  const queryTerms = terms(cleanQuery);
  const ranked = signalNodes
    .map((node, originalIndex) => ({
      node,
      originalIndex,
      score: scoreNode(queryTerms, node),
    }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

  const matches = ranked.slice(0, 3).map(({ node }) => node);
  const intent = detectIntent(cleanQuery);

  return {
    query: cleanQuery,
    intent: intent.label,
    headline: intent.headline,
    summary: intent.framing,
    rationale: `Matched ${matches.map((node) => node.shortTitle).join(", ")} across the five project areas on this page.`,
    matches,
  };
}
