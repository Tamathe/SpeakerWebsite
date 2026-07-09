import { siteContent } from "./content";
import type {
  CredentialItem,
  LinkAction,
  ProfileContent,
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
        <a href="#work">Projects</a>
        <a href="#talks">Talks</a>
        <a href="#thinking">Notes</a>
        <a href="#invite">Contact</a>
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
        <h1>{hero.title}</h1>
        <p className="hero-summary">{hero.summary}</p>
        <div className="hero-actions" aria-label="Primary actions">
          <ActionLink action={hero.primaryAction} variant="primary" />
          <ActionLink action={hero.secondaryAction} variant="secondary" />
        </div>
      </div>
      <aside className="proof-panel" aria-label="Current focus">
        <p className="panel-label">Current focus</p>
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
          {featuredMedia.href && featuredMedia.actionLabel ? (
            <a href={featuredMedia.href} target="_blank" rel="noreferrer">
              {featuredMedia.actionLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ profile }: { profile: ProfileContent }) {
  return (
    <section className="section profile-section" aria-labelledby="profile-title">
      <div className="section-heading">
        <p className="eyebrow">Context</p>
        <h2 id="profile-title">{profile.title}</h2>
      </div>
      <div className="profile-copy">
        <p>{profile.summary}</p>
        <ul>
          {profile.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
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
      <div className="talk-card-copy">
        <span>{talk.summary}</span>
        <div className="talk-links">
          {talk.href ? (
            <a href={talk.href} target="_blank" rel="noreferrer">
              View
            </a>
          ) : null}
          {talk.note ? <small>{talk.note}</small> : null}
        </div>
      </div>
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
  const { profile, currentWork, talks, recentThinking, credentials, invite } =
    siteContent;

  return (
    <main>
      <Header />
      <Hero />
      <FeaturedMedia />
      <ProfileSection profile={profile} />

      <section className="section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
          <h2 id="work-title">
            Clinical AI that has to work beyond the demo.
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
          <p className="eyebrow">Selected teaching and talks</p>
          <h2 id="talks-title">
            Sessions on healthcare AI, education, and implementation.
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
          <p className="eyebrow">Notes</p>
          <h2 id="thinking-title">
            Short field notes from the work as it develops.
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
            Send a note
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
        <span>AI in healthcare, clinical education, and implementation.</span>
      </footer>
    </main>
  );
}

export default App;
