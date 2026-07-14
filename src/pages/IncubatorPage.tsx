export function IncubatorPage() {
  return (
    <>
      <header className="incubator-hero">
        <div className="shell incubator-hero-grid">
          <div className="incubator-copy">
            <p className="page-kicker">University of Kentucky / AI Incubator</p>
            <h1>Learn to work with AI, together.</h1>
            <p>
              I founded the UK AI Incubator as an open cross-campus community
              where students, faculty, and staff can test ideas, show unfinished
              work, learn from one another, and build across disciplines.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="https://aiincubator.uky.edu">
                Visit the AI Incubator <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-outline" href="/ai-literacy">
                Explore AI literacy
              </a>
            </div>
          </div>

          <div className="incubator-art">
            <img
              className="incubator-art-main"
              src="/images/studio/retinopathy.png"
              alt="Concept visualization of retinal imaging equipment"
            />
            <img
              className="incubator-art-side"
              src="/images/studio/blood-drone.png"
              alt="Concept visualization of a drone and transport testing equipment"
            />
            <span>Projects become a reason to learn together.</span>
          </div>
        </div>
      </header>

      <section className="incubator-principles" aria-labelledby="incubator-principles-title">
        <div className="shell section-intro">
          <p className="section-index">The premise</p>
          <div>
            <h2 id="incubator-principles-title">Useful AI work needs more than AI specialists.</h2>
            <p>
              It needs people who understand patients, classrooms, communities,
              systems, language, ethics, operations, and design.
            </p>
          </div>
        </div>
        <div className="shell principle-list">
          <article>
            <span>01</span>
            <h3>Keep the room open.</h3>
            <p>Curiosity and real domain knowledge matter more than a coding résumé.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Show unfinished work.</h3>
            <p>Demonstrations, hard questions, and early failures make the learning visible.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Build across disciplines.</h3>
            <p>The strongest projects connect people who would not otherwise share a workbench.</p>
          </article>
        </div>
      </section>

      <section className="incubator-bridge" aria-labelledby="bridge-title">
        <div className="shell bridge-grid">
          <p className="section-index">Why this page stays brief</p>
          <div>
            <h2 id="bridge-title">The Incubator has its own front door.</h2>
            <p>
              This personal site explains my connection to the work. The
              Incubator website carries the community, current projects,
              participation details, and the evolving record of what the group
              is building together.
            </p>
            <a className="text-link" href="https://aiincubator.uky.edu">
              Continue to aiincubator.uky.edu <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
