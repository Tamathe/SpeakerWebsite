import { EducationProjectRow } from "../components/EducationProjectRow";
import { educationProjects, engagements } from "../siteContent";

const relatedTalkIds = new Set([
  "dawn-of-ai",
  "assessment",
  "personalizing-learning",
]);

export function MedicalEducationPage() {
  const relatedTalks = engagements.filter((talk) => relatedTalkIds.has(talk.id));

  return (
    <>
      <header className="page-hero page-hero-education">
        <div className="shell page-hero-grid">
          <div>
            <p className="page-kicker">AI in Medical Education / Research and practice</p>
            <h1>A fluent answer is not the same as good reasoning.</h1>
          </div>
          <div className="page-hero-lead">
            <p>
              AI is changing what learners can produce, what educators can see,
              and what old assignments still measure. The response has to be
              more than prohibition—or enthusiasm.
            </p>
            <a className="text-link" href="#education-projects">
              Explore the research <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </header>

      <section className="education-section" id="education-projects" aria-labelledby="education-title">
        <div className="shell section-intro">
          <p className="section-index">Current work</p>
          <div>
            <h2 id="education-title">Assessment, reasoning, and the work behind the answer.</h2>
            <p>
              These projects examine where AI may support learning and
              evaluation, what evidence educators need, and where human
              judgment must remain explicit.
            </p>
          </div>
        </div>
        <div className="shell education-list">
          {educationProjects.map((project) => (
            <EducationProjectRow project={project} key={project.id} />
          ))}
        </div>
      </section>

      <section className="education-thesis" aria-labelledby="practice-title">
        <div className="shell thesis-grid">
          <p className="section-index">Related work</p>
          <div>
            <h2 id="practice-title">AI literacy needs its own practice space.</h2>
            <p>
              Medical education is one setting where people are learning to
              work with AI. The broader literacy work also reaches clinicians,
              staff, students, faculty communities, and institutional leaders.
            </p>
            <a className="text-link" href="/ai-literacy">
              Explore AI literacy <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="related-section" aria-labelledby="education-talks-title">
        <div className="shell section-intro">
          <p className="section-index">Related speaking</p>
          <div>
            <h2 id="education-talks-title">Teaching in public while the field changes.</h2>
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
