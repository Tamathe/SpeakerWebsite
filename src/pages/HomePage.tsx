import { credentials, homePathways, siteIdentity } from "../siteContent";

export function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="shell home-hero-grid">
          <div className="home-hero-copy">
            <p className="page-kicker">Tama Thé, MD / Kentucky</p>
            <h1 id="home-title">{siteIdentity.thesis}</h1>
            <p className="hero-bio">{siteIdentity.bio}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/speaking#featured-talk">
                Watch a featured talk <span aria-hidden="true">→</span>
              </a>
              <a className="button button-outline" href="/healthcare">
                Explore the work
              </a>
            </div>
          </div>

          <a
            className="home-speaker-media"
            href="/speaking#featured-talk"
            aria-label="Watch Tama Thé present to the Kentucky General Assembly"
          >
            <img
              className="home-speaker-video"
              src="/media/speaking/kentucky-legislature.jpg"
              alt="Tama Thé and Hubert Ballard presenting AI at UK to the Kentucky General Assembly Artificial Intelligence Task Force"
            />
            <span className="home-speaker-shade" aria-hidden="true" />
            <span className="home-speaker-meta">
              <span>On stage</span>
              <strong>Kentucky General Assembly</strong>
            </span>
            <span className="home-speaker-prompt">
              Watch Tama speak <i aria-hidden="true">→</i>
            </span>
          </a>
        </div>
        <div className="hero-facts">
          {credentials.map((credential) => (
            <span key={credential.label}>
              <small>{credential.label}</small>
              <strong>{credential.detail}</strong>
            </span>
          ))}
        </div>
      </section>

      <section className="pathways section-dark" aria-labelledby="pathways-title">
        <div className="shell section-intro">
          <p className="section-index">The work</p>
          <div>
            <h2 id="pathways-title">Five ways into the same question.</h2>
            <p>
              What would it take for AI to become useful in real care, real
              classrooms, real institutions, and real conversations?
            </p>
          </div>
        </div>

        <div className="shell pathway-list">
          {homePathways.map((pathway) => (
            <a className="pathway" href={pathway.href} key={pathway.href}>
              <span>{pathway.number}</span>
              <h3>{pathway.title}</h3>
              <p>{pathway.description}</p>
              <i aria-hidden="true">→</i>
            </a>
          ))}
        </div>
      </section>

      <section className="home-principle" aria-labelledby="principle-title">
        <div className="shell principle-grid">
          <p className="section-index">Working principle</p>
          <div>
            <h2 id="principle-title">The model is usually the easy part.</h2>
            <p>
              The hard part is fitting it into real work, deciding who owns the
              result, and noticing when it starts making things worse. That is
              where the most interesting work begins.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
