import { ProjectPlate } from "../components/ProjectPlate";
import {
  engagements,
  healthcareInitiatives,
  implementationQuestions,
} from "../siteContent";

const relatedTalkIds = new Set(["dreams-of-data", "precision-medicine"]);

export function HealthcarePage() {
  const relatedTalks = engagements.filter((talk) => relatedTalkIds.has(talk.id));

  return (
    <>
      <header className="page-hero page-hero-healthcare">
        <div className="shell page-hero-grid">
          <div>
            <p className="page-kicker">AI in Healthcare / Current initiatives</p>
            <h1>The model is only one part of the system.</h1>
          </div>
          <div className="page-hero-lead">
            <p>
              The work starts with a real healthcare problem and follows the
              result all the way to outreach, referral, scheduling, treatment,
              or follow-up.
            </p>
            <a className="text-link" href="#initiatives">
              Explore the initiatives <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </header>

      <section className="research-section" id="initiatives" aria-labelledby="initiatives-title">
        <div className="shell section-intro">
          <p className="section-index">Current work</p>
          <div>
            <h2 id="initiatives-title">Three Kentucky problems. Three different systems.</h2>
            <p>
              Each initiative asks what happens after technology identifies a
              need—and what the people, workflows, and infrastructure around it
              must do next.
            </p>
          </div>
        </div>
        <div className="shell research-grid">
          {healthcareInitiatives.map((initiative) => (
            <ProjectPlate initiative={initiative} key={initiative.id} />
          ))}
        </div>
      </section>

      <section className="implementation-band" aria-labelledby="implementation-title">
        <div className="shell implementation-head">
          <p className="section-index">Implementation test</p>
          <h2 id="implementation-title">Five questions before calling a pilot a solution.</h2>
        </div>
        <div className="shell implementation-list">
          {implementationQuestions.map((item) => (
            <div key={item.number}>
              <span>{item.number}</span>
              <strong>{item.label}</strong>
              <p>{item.question}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="related-section" aria-labelledby="health-talks-title">
        <div className="shell section-intro">
          <p className="section-index">Related speaking</p>
          <div>
            <h2 id="health-talks-title">The public argument behind the work.</h2>
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
