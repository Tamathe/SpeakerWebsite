import type { Initiative } from "../siteContent";

export function ProjectPlate({ initiative }: { initiative: Initiative }) {
  return (
    <article className="research-card" id={initiative.id}>
      <figure className="research-image">
        <img src={initiative.image} alt={initiative.imageAlt} loading="lazy" />
        <span className="research-number">{initiative.number}</span>
        <figcaption>{initiative.imageCaption}</figcaption>
      </figure>

      <div className="research-copy">
        <div className="research-meta">
          <span>{initiative.area}</span>
          <span>{initiative.stage}</span>
        </div>
        <h2>{initiative.title}</h2>
        <p className="research-question">{initiative.question}</p>
        <p className="research-summary">{initiative.summary}</p>
        <p className="research-focus">{initiative.focus}</p>
        {initiative.links?.map((link) => (
          <a className="text-link" href={link.href} key={link.href}>
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}
