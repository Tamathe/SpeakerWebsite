import { engagements, literacyContexts, literacyPractices } from "../siteContent";

const relatedTalkIds = new Set([
  "kentucky-future",
  "personalizing-learning",
  "assessment",
]);

export function AiLiteracyPage() {
  const relatedTalks = engagements.filter((talk) => relatedTalkIds.has(talk.id));

  return (
    <>
      <header className="incubator-hero literacy-hero">
        <div className="shell incubator-hero-grid literacy-hero-grid">
          <div className="incubator-copy literacy-copy">
            <p className="page-kicker">AI literacy / Curriculum and practice</p>
            <h1>People need practice, not another AI webinar.</h1>
            <p>
              Clinicians, educators, staff, and students already have access to
              AI. Literacy means learning to test the output, compare it with
              real work, recognize where it fails, and decide when AI does not
              belong in the task.
            </p>
            <p className="literacy-evidence">
              Co-created the University of Kentucky AI literacy curriculum ·
              Founder, UK AI Incubator
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#literacy-practice">
                Explore the practice <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-outline" href="https://aiincubator.uky.edu">
                Visit the AI Incubator <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="incubator-art literacy-art">
            <img
              className="incubator-art-main literacy-art-main"
              src="/media-wall/ai-is-coming.jpg"
              alt="Tama Thé discussing what artificial intelligence is capable of"
            />
            <img
              className="incubator-art-side literacy-art-side"
              src="/media-wall/learning-questions.jpg"
              alt="Presentation slide asking how medical educators should use AI"
            />
            <span>Practice / Judgment / Responsibility</span>
          </div>
        </div>
      </header>

      <section
        className="topics-section literacy-practice"
        id="literacy-practice"
        aria-labelledby="literacy-practice-title"
      >
        <div className="shell section-intro">
          <p className="section-index">A practice, not a product list</p>
          <div>
            <h2 id="literacy-practice-title">Build judgment by working through the loop.</h2>
            <p>
              Tool names will change. The durable skill is knowing how to
              examine an output before it changes a decision, a lesson, or a
              workflow.
            </p>
          </div>
        </div>
        <div className="shell topic-grid literacy-practice-grid">
          {literacyPractices.map((practice) => (
            <article key={practice.number}>
              <span>{practice.number}</span>
              <h3>{practice.title}</h3>
              <p>{practice.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="incubator-principles literacy-contexts" aria-labelledby="literacy-contexts-title">
        <div className="shell section-intro">
          <p className="section-index">Where the work happens</p>
          <div>
            <h2 id="literacy-contexts-title">Learning has to meet people where AI meets the work.</h2>
            <p>
              At Kentucky, this work connects curriculum, development for
              faculty and learners, and an open community where people can test
              ideas together.
            </p>
          </div>
        </div>
        <div className="shell principle-list">
          {literacyContexts.map((context) => (
            <article key={context.number}>
              <span>{context.number}</span>
              <h3>{context.title}</h3>
              <p>{context.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="education-thesis literacy-thesis" aria-labelledby="literacy-thesis-title">
        <div className="shell thesis-grid">
          <p className="section-index">Working principle</p>
          <div>
            <h2 id="literacy-thesis-title">The goal is better judgment.</h2>
            <p>
              AI literacy is not knowing every tool. It is knowing how to test
              the output, recognize the limits, and decide whether AI belongs
              in the task at all.
            </p>
            <a className="text-link" href="/medical-education">
              See the medical education work <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="related-section" aria-labelledby="literacy-talks-title">
        <div className="shell section-intro">
          <p className="section-index">Related speaking</p>
          <div>
            <h2 id="literacy-talks-title">Learning in public while the tools keep changing.</h2>
          </div>
        </div>
        <div className="shell related-links">
          {relatedTalks.map((talk, index) => (
            <a href={talk.href} key={talk.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <small>{talk.venue}</small>
                <strong>{talk.title}</strong>
              </div>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
