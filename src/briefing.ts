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
      label: "Speaking + synthesis",
      headline: "A talk that moves from possibility to accountable action.",
      framing:
        "The strongest route pairs a memorable systems idea with evidence from work already happening in healthcare and education.",
    };
  }

  if (/teach|learn|student|faculty|curriculum|educat|training|literacy/.test(normalized)) {
    return {
      label: "Learning + judgment",
      headline: "AI literacy becomes real when people can test their judgment.",
      framing:
        "Start with lived decisions—not a tool tour—then connect capability, limits, evaluation, and responsibility.",
    };
  }

  if (/state|public|rural|kentucky|population|community|government/.test(normalized)) {
    return {
      label: "Public systems + reach",
      headline: "Statewide AI succeeds or fails in the last mile.",
      framing:
        "The relevant work connects data and models to access, understandable outreach, local workflow, and an owned next step.",
    };
  }

  if (/hospital|health system|clinic|clinical|pilot|implement|workflow/.test(normalized)) {
    return {
      label: "Healthcare implementation",
      headline: "The model is one layer. The care pathway is the product.",
      framing:
        "A durable implementation makes workflow, trust, ownership, and feedback as visible as model performance.",
    };
  }

  if (/partner|collaborat|build|project|work together/.test(normalized)) {
    return {
      label: "Collaboration + building",
      headline: "Begin with the consequential problem, then build the full route.",
      framing:
        "The best collaboration surface is a real constraint, a reachable user, and a shared definition of what happens after the AI signal.",
    };
  }

  return {
    label: "Cross-domain briefing",
    headline: "Here is the shortest grounded route through the work.",
    framing:
      "This interface retrieves from a small, human-verified evidence base and shows why each domain was selected.",
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
    rationale: `Matched ${matches.map((node) => node.shortTitle).join(", ")} across a five-domain, source-grounded archive.`,
    matches,
  };
}
