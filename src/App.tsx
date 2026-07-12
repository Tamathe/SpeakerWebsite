import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildBriefing } from "./briefing";
import { SignalCanvas } from "./components/SignalCanvas";
import {
  briefingPresets,
  contactEmail,
  credentials,
  fieldNotes,
  signalNodes,
  systemLayers,
  talks,
} from "./content";
import { useSemanticSearch } from "./hooks/useSemanticSearch";
import type { BriefingResult, SignalNode, SystemLayer } from "./types";

const defaultQuery = "How do we get an AI project out of the pilot stage?";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Tama Thé — home">
        <span className="brand-mark">T/</span>
        <span>TAMA THÉ</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#ask">Ask about my work</a>
        <a href="#field">Projects</a>
        <a href="#method">Why projects fail</a>
        <a href="#talks">Talks</a>
      </nav>
      <a className="header-contact" href="#contact">
        Get in touch <Arrow />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <SignalCanvas />
      <div className="hero-rail" aria-hidden="true">
        <span>38.0464° N</span>
        <span>84.4970° W</span>
        <span>KY / USA</span>
      </div>
      <div className="hero-content">
        <div className="hero-status">
          <span className="status-dot" />
          <span>Physician · Educator · AI builder</span>
          <span className="hero-status-index">Index / 2026</span>
        </div>
        <h1 id="hero-name">Tama Thé</h1>
        <p className="hero-statement" aria-label="Making AI useful in healthcare.">
          Making AI <em>useful</em>
          <br />
          in healthcare.
        </p>
        <div className="hero-bottom">
          <p>
            I work on what comes after the demo: getting AI into real clinical
            care, education, and public-health work without making those jobs
            harder.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#ask">
              Ask about my work <Arrow />
            </a>
            <a className="button button-quiet" href="#field">
              See the projects
            </a>
          </div>
        </div>
      </div>
      <div className="hero-ticker" aria-label="Current work">
        <span>CURRENT WORK</span>
        <div>
          <b>Cancer screening</b>
          <b>Diabetic retinopathy</b>
          <b>AI literacy</b>
          <b>Clinical reasoning</b>
          <b>Rural access</b>
        </div>
      </div>
    </section>
  );
}

function statusCopy(
  status: ReturnType<typeof useSemanticSearch>["status"],
  progress?: number,
) {
  if (status === "loading") {
    return progress
      ? `Downloading a small language model · ${progress}%`
      : "Downloading a small language model · first search only";
  }
  if (status === "embedding") return "Comparing your question with my projects";
  if (status === "ready") return "Done · these are the closest matches";
  if (status === "unavailable") return "Using basic search · the language model could not load";
  if (status === "guided") return "Using basic search · data-saving mode is on";
  return "Ready · the model only loads if you use it";
}

function IntelligenceConsole({
  briefing,
  onBriefing,
  onSelect,
}: {
  briefing: BriefingResult;
  onBriefing: (query: string) => void;
  onSelect: (node: SignalNode) => void;
}) {
  const [query, setQuery] = useState(defaultQuery);
  const semanticDocuments = useMemo(
    () =>
      signalNodes.map((node) => ({
        id: node.id,
        text: [
          node.title,
          node.thesis,
          node.problem,
          node.aiRole,
          node.humanGuardrail,
          node.evidence,
          ...node.keywords,
        ].join(". "),
      })),
    [],
  );
  const semantic = useSemanticSearch();

  const submitQuery = (value: string) => {
    const normalized = value.trim() || defaultQuery;
    setQuery(normalized);
    onBriefing(normalized);
    semantic.search(normalized, semanticDocuments);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuery(query);
  };

  useEffect(() => {
    if (semantic.status !== "ready" || semantic.rankedIds.length === 0) return;

    const ranked = semantic.rankedIds
      .map((id) => signalNodes.find((node) => node.id === id))
      .filter((node): node is SignalNode => Boolean(node));

    if (ranked[0]) onSelect(ranked[0]);
  }, [onSelect, semantic.rankedIds, semantic.status]);

  const displayedMatches =
    semantic.status === "ready" && semantic.rankedIds.length > 0
      ? semantic.rankedIds
          .map((id) => signalNodes.find((node) => node.id === id))
          .filter((node): node is SignalNode => Boolean(node))
          .slice(0, 3)
      : briefing.matches;

  return (
    <section className="ask-section" id="ask" aria-labelledby="ask-title">
      <div className="section-index">
        <span>01</span>
        <span>Search my work</span>
      </div>
      <div className="ask-intro">
        <p className="eyebrow">Ask about my work</p>
        <h2 id="ask-title">This is not a chatbot pretending to be me.</h2>
        <p>
          Describe what you are working on. A small language model running in
          your browser will compare your question with my projects and talks
          and show you the closest matches.
        </p>
        <div className="privacy-note">
          <span className="privacy-icon" aria-hidden="true">↳</span>
          <span>
            Your question stays in your browser. Nothing is saved or sent to
            me.
          </span>
        </div>
      </div>

      <div className="intelligence-console">
        <div className="console-topline">
          <span>SEARCH MY WORK</span>
          <span className="console-online"><i /> RUNS HERE</span>
        </div>
        <form className="query-form" onSubmit={onSubmit}>
          <label htmlFor="field-query">What are you working on?</label>
          <div className="query-input-row">
            <span aria-hidden="true">›</span>
            <input
              id="field-query"
              type="text"
              maxLength={240}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            <button type="submit" aria-label="Search my work">
              Search <Arrow />
            </button>
          </div>
        </form>
        <div className="preset-list" aria-label="Example questions">
          {briefingPresets.map((preset) => (
            <button
              type="button"
              key={preset.label}
              onClick={() => submitQuery(preset.prompt)}
            >
              <span>{preset.label}</span>
              <small>{preset.prompt}</small>
            </button>
          ))}
        </div>

        <div className="console-status" aria-live="polite">
          <span className={`status-indicator status-${semantic.status}`} />
          {statusCopy(semantic.status, semantic.progress)}
        </div>

        <div className="briefing-output">
          <div className="briefing-copy">
            <p>{briefing.intent}</p>
            <h3>{briefing.headline}</h3>
            <span>{briefing.summary}</span>
          </div>
          <ol className="match-list" aria-label="Closest evidence matches">
            {displayedMatches.map((node, index) => (
              <li key={node.id}>
                <button type="button" onClick={() => onSelect(node)}>
                  <span className={`match-rank color-${node.color}`}>
                    0{index + 1}
                  </span>
                  <span>
                    <small>{index === 0 ? "Closest match" : "Also related"}</small>
                    <strong>{node.title}</strong>
                    <em>{node.thesis}</em>
                  </span>
                  <Arrow />
                </button>
              </li>
            ))}
          </ol>
          <details className="model-disclosure">
            <summary>How this works</summary>
            <p>
              This is search, not a chatbot. A small embedding model compares
              your question with the projects and talks on this page. It does
              not write an answer, speak for me, or provide medical advice. If
              the model cannot load, the page uses basic keyword matching.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

function FieldLine({ node }: { node: SignalNode }) {
  const x = node.position.x - 50;
  const y = node.position.y - 50;
  const length = Math.hypot(x, y);
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return (
    <span
      className="field-line"
      style={
        {
          "--line-length": `${length}%`,
          "--line-angle": `${angle}deg`,
        } as CSSProperties
      }
    />
  );
}

function SignalField({
  selected,
  onSelect,
}: {
  selected: SignalNode;
  onSelect: (node: SignalNode) => void;
}) {
  return (
    <section className="field-section" id="field" aria-labelledby="field-title">
      <div className="section-index">
        <span>02</span>
        <span>Five areas of work</span>
      </div>
      <div className="field-heading">
        <p className="eyebrow">Current projects</p>
        <h2 id="field-title">Different projects. A lot of the same hard parts.</h2>
        <p>
          Choose an area to see the problem, where AI may help, what people
          still have to do, and the work behind it.
        </p>
      </div>

      <div className="field-workspace">
        <div className="field-map" aria-label="Connected areas of work">
          <div className="field-axis field-axis-x" aria-hidden="true" />
          <div className="field-axis field-axis-y" aria-hidden="true" />
          <div className="field-lines" aria-hidden="true">
            {signalNodes.map((node) => <FieldLine node={node} key={node.id} />)}
          </div>
          <div className="field-hub" aria-hidden="true">
            <span>AFTER THE</span>
            <b>DEMO</b>
          </div>
          <div className="field-node-list">
            {signalNodes.map((node) => (
              <button
                key={node.id}
                className={`field-node color-${node.color}`}
                style={
                  {
                    "--node-x": `${node.position.x}%`,
                    "--node-y": `${node.position.y}%`,
                  } as CSSProperties
                }
                type="button"
                aria-pressed={selected.id === node.id}
                aria-controls="field-detail"
                onClick={() => onSelect(node)}
              >
                <span>{node.index}</span>
                <strong>{node.shortTitle}</strong>
              </button>
            ))}
          </div>
        </div>

        <article
          className={`field-detail color-${selected.color}`}
          id="field-detail"
          aria-live="polite"
        >
          <div className="detail-meta">
            <span>Project / {selected.index}</span>
            <span>{selected.title}</span>
          </div>
          <h3>{selected.thesis}</h3>
          <div className="detail-grid">
            <div>
              <small>Problem</small>
              <p>{selected.problem}</p>
            </div>
            <div>
              <small>Where AI may help</small>
              <p>{selected.aiRole}</p>
            </div>
            <div>
              <small>What people still have to do</small>
              <p>{selected.humanGuardrail}</p>
            </div>
          </div>
          <div className="evidence-strip">
            <span>Related work</span>
            <p>{selected.evidence}</p>
            {selected.sourceHref ? (
              <a href={selected.sourceHref} target="_blank" rel="noreferrer">
                {selected.sourceLabel} <Arrow diagonal />
              </a>
            ) : (
              <small>{selected.sourceLabel}</small>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function MethodLab() {
  const [selected, setSelected] = useState<SystemLayer>(systemLayers[0]!);

  return (
    <section className="method-section" id="method" aria-labelledby="method-title">
      <div className="section-index section-index-dark">
        <span>03</span>
        <span>What happens after the demo</span>
      </div>
      <div className="method-heading">
        <p className="eyebrow eyebrow-dark">Why good demos fail</p>
        <h2 id="method-title">The model is usually the easy part.</h2>
        <p>
          Pick a layer. These are the questions that decide whether an AI
          project helps anyone or just creates another dashboard.
        </p>
      </div>
      <div className="method-lab">
        <div className="layer-tabs" role="list" aria-label="Implementation layers">
          {systemLayers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              className={selected.id === layer.id ? "is-selected" : ""}
              aria-pressed={selected.id === layer.id}
              onClick={() => setSelected(layer)}
            >
              <span>{layer.index}</span>
              <strong>{layer.label}</strong>
            </button>
          ))}
        </div>
        <article className="layer-detail" aria-live="polite">
          <div>
            <small>Question / {selected.index}</small>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
          </div>
          <div className="layer-failure">
            <small>Failure mode</small>
            <p>{selected.failure}</p>
          </div>
          <blockquote>{selected.question}</blockquote>
        </article>
      </div>
    </section>
  );
}

function TalksAndNotes() {
  return (
    <section className="archive-section" id="talks" aria-labelledby="talks-title">
      <div className="section-index">
        <span>04</span>
        <span>Talks and notes</span>
      </div>
      <div className="archive-heading">
        <p className="eyebrow">Selected talks and field notes</p>
        <h2 id="talks-title">Things I have been talking about.</h2>
      </div>
      <div className="talk-list">
        {talks.map((talk, index) => (
          <a
            className="talk-row"
            href={talk.href}
            target="_blank"
            rel="noreferrer"
            key={talk.id}
          >
            <span>0{index + 1}</span>
            <div>
              <small>{talk.audience}</small>
              <h3>{talk.title}</h3>
              <p>{talk.summary}</p>
            </div>
            <div className="talk-action">
              {talk.note && <small>{talk.note}</small>}
              <Arrow diagonal />
            </div>
          </a>
        ))}
      </div>
      <div className="notes-grid">
        {fieldNotes.map((note) => (
          <article key={note.title}>
            <small>{note.type}</small>
            <h3>{note.title}</h3>
            <p>{note.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section className="profile-section" id="about" aria-labelledby="about-title">
      <div className="profile-label">
        <span>05 / ABOUT</span>
        <i />
      </div>
      <div className="profile-copy">
        <p className="eyebrow">Tama Thé, MD</p>
        <h2 id="about-title">
          I am a pediatric emergency physician who got pulled deep into AI
          because I could see where it might help—and how easily it could make
          healthcare more complicated.
        </h2>
        <p>
          My work now includes cancer screening, diabetic retinopathy, medical
          education, clinical reasoning, and AI strategy at UK. The common
          question is pretty simple: can we make this useful for the person who
          actually has to use it?
        </p>
      </div>
      <div className="credential-list">
        {credentials.map((item, index) => (
          <div key={item.label}>
            <span>0{index + 1}</span>
            <small>{item.label}</small>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-meta">
        <span>HAVE A PRACTICAL AI PROBLEM?</span>
        <span>TALKS · WORKSHOPS · COLLABORATIONS</span>
      </div>
      <h2 id="contact-title">Let's talk.</h2>
      <p>
        I am happy to talk about healthcare AI projects, lectures, workshops,
        faculty retreats, panels, or a collaboration that is still taking
        shape.
      </p>
      <a href={contactEmail} className="contact-link">
        Send me a note <Arrow />
      </a>
      <footer>
        <span>© 2026 Tama Thé</span>
        <span>Built with AI, then revised until it stopped sounding like AI.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}

function App() {
  const [selectedSignal, setSelectedSignal] = useState(signalNodes[0]!);
  const [briefing, setBriefing] = useState(() => buildBriefing(defaultQuery));

  const selectSignal = useCallback((node: SignalNode) => {
    setSelectedSignal(node);
  }, []);

  const updateBriefing = useCallback((query: string) => {
    const nextBriefing = buildBriefing(query);
    setBriefing(nextBriefing);
    if (nextBriefing.matches[0]) setSelectedSignal(nextBriefing.matches[0]);
  }, []);

  return (
    <main>
      <Header />
      <Hero />
      <IntelligenceConsole
        briefing={briefing}
        onBriefing={updateBriefing}
        onSelect={selectSignal}
      />
      <SignalField selected={selectedSignal} onSelect={selectSignal} />
      <MethodLab />
      <TalksAndNotes />
      <Profile />
      <Contact />
    </main>
  );
}

export default App;
