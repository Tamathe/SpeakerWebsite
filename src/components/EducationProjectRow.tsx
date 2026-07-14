import type { EducationProject } from "../siteContent";

export function EducationProjectRow({ project }: { project: EducationProject }) {
  return (
    <article className="education-project" id={project.id}>
      <figure className="education-media">
        <img src={project.image} alt={project.imageAlt} loading="lazy" />
        <span className="research-number">{project.number}</span>
        <figcaption>{project.imageCaption}</figcaption>
      </figure>

      <div className="education-copy">
        <div className="research-meta">
          <span>{project.category}</span>
          <span>{project.stage}</span>
        </div>
        <h2>{project.title}</h2>
        <p className="education-question">{project.question}</p>
        <p>{project.summary}</p>
        <div className="guardrail">
          <span>Boundary</span>
          <p>{project.guardrail}</p>
        </div>
      </div>
    </article>
  );
}
