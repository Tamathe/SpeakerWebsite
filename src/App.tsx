import { siteContent } from "./content";
import type {
  CredentialItem,
  LinkAction,
  TalkItem,
  ThinkingItem,
  WorkItem,
} from "./types";

function Header() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand" href="#top" aria-label="Tama Thé homepage">
        Tama Thé, MD
      </a>
      <nav className="nav-links">
        <a href="#work">Work</a>
        <a href="#talks">Talks</a>
        <a href="#thinking">Thinking</a>
        <a href="#invite">Invite</a>
      </nav>
    </header>
  );
}

function ActionLink({
  action,
  variant,
}: {
  action: LinkAction;
  variant: "primary" | "secondary";
}) {
  return (
    <a className={`action-link action-link-${variant}`} href={action.href}>
      {action.label}
    </a>
  );
}

function Hero() {
  const { hero } = siteContent;

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p className="hero-summary">{hero.summary}</p>
        <div className="hero-actions" aria-label="Primary actions">
          <ActionLink action={hero.primaryAction} variant="primary" />
          <ActionLink action={hero.secondaryAction} variant="secondary" />
        </div>
      </div>
      <aside className="proof-panel" aria-label="Professional proof points">
        <p className="panel-label">Proof points</p>
        <ul>
          {hero.proofPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function FeaturedMedia() {
  const { featuredMedia } = siteContent;

  return (
    <section
      className="section featured"
      id="featured"
      aria-labelledby="featured-title"
    >
      <div className="section-heading">
        <p className="eyebrow">{featuredMedia.label}</p>
        <h2 id="featured-title">{featuredMedia.title}</h2>
      </div>
      <div className="media-stage">
        <img src={featuredMedia.imageSrc} alt={featuredMedia.imageAlt} />
        <div className="media-caption">
          <span>{featuredMedia.status}</span>
          <p>{featuredMedia.summary}</p>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="surface-card">
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
    </article>
  );
}

function TalkCard({ talk }: { talk: TalkItem }) {
  return (
    <article className="talk-card">
      <p>{talk.audience}</p>
      <h3>{talk.title}</h3>
      <span>{talk.summary}</span>
    </article>
  );
}

function ThinkingCard({ item }: { item: ThinkingItem }) {
  return (
    <article className="thinking-row">
      <p>{item.type}</p>
      <div>
        <h3>{item.title}</h3>
        <span>{item.summary}</span>
      </div>
    </article>
  );
}

function CredentialCard({ item }: { item: CredentialItem }) {
  return (
    <article className="credential">
      <p>{item.label}</p>
      <span>{item.detail}</span>
    </article>
  );
}

function App() {
  const { currentWork, talks, recentThinking, credentials, invite } =
    siteContent;

  return (
    <main>
      <Header />
      <Hero />
      <FeaturedMedia />

      <section className="section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">Current work</p>
          <h2 id="work-title">
            Practical AI work for institutions that teach, heal, and govern.
          </h2>
        </div>
        <div className="card-grid">
          {currentWork.map((item) => (
            <WorkCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="section" id="talks" aria-labelledby="talks-title">
        <div className="section-heading section-heading-wide">
          <p className="eyebrow">Selected talks</p>
          <h2 id="talks-title">
            Keynotes and sessions that translate AI pressure into practice.
          </h2>
        </div>
        <div className="talk-list">
          {talks.map((talk) => (
            <TalkCard talk={talk} key={talk.title} />
          ))}
        </div>
      </section>

      <section
        className="section split-section"
        id="thinking"
        aria-labelledby="thinking-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Recent thinking</p>
          <h2 id="thinking-title">
            A living archive of talks, essays, videos, and field notes.
          </h2>
        </div>
        <div className="thinking-list">
          {recentThinking.map((item) => (
            <ThinkingCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="credibility-title">
        <div className="section-heading section-heading-wide">
          <p className="eyebrow">Credibility</p>
          <h2 id="credibility-title">
            Clinical, educational, and institutional signal in one place.
          </h2>
        </div>
        <div className="credential-grid">
          {credentials.map((item) => (
            <CredentialCard item={item} key={item.label} />
          ))}
        </div>
      </section>

      <section className="invite-section" id="invite" aria-labelledby="invite-title">
        <div>
          <p className="eyebrow">Invite</p>
          <h2 id="invite-title">{invite.title}</h2>
          <p>{invite.summary}</p>
        </div>
        <div className="invite-panel">
          <a className="action-link action-link-primary" href={invite.email}>
            Start a conversation
          </a>
          <ul>
            {invite.materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="site-footer">
        <span>Tama Thé, MD</span>
        <span>Academic medicine, higher education, and practical AI readiness.</span>
      </footer>
    </main>
  );
}

export default App;
