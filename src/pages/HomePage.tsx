import { credentials, homePathways, siteIdentity } from "../siteContent";

export function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="shell home-hero-grid">
          <div className="home-hero-copy">
            <p className="page-kicker">Tama Thé, MD / Kentucky</p>
            <h1 id="home-title">{siteIdentity.thesis}</h1>
            <p className="hero-descriptor">{siteIdentity.descriptor}</p>
            <p className="hero-bio">{siteIdentity.bio}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/healthcare">
                Explore the work <span aria-hidden="true">→</span>
              </a>
              <a className="button button-outline" href="/speaking">
                Speaking profile
              </a>
            </div>
          </div>

          <div className="home-visual">
            <figure className="home-plate home-plate-a">
              <img
                src="/images/studio/ahead.png"
                alt="Concept visualization of an accurate Kentucky relief map covered with dense cobalt and white screening-navigation pushpins"
              />
              <figcaption><span>01</span> KY-AHEAD</figcaption>
            </figure>
            <figure className="home-plate home-plate-b">
              <img
                src="/images/studio/retinopathy.png"
                alt="Concept visualization of portable retinal imaging equipment"
              />
              <figcaption><span>02</span> Retinopathy</figcaption>
            </figure>
            <figure className="home-plate home-plate-c">
              <img
                src="/images/studio/blood-drone.png"
                alt="Concept visualization of a drone, insulated carrier, and test equipment"
              />
              <figcaption><span>03</span> Rural logistics</figcaption>
            </figure>
          </div>
        </div>
        <div className="hero-facts">
          {credentials.map((credential) => (
            <span key={credential}>{credential}</span>
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
