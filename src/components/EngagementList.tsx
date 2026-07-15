import type { Engagement } from "../siteContent";

export function EngagementList({ engagements }: { engagements: Engagement[] }) {
  return (
    <div className="engagement-list">
      {engagements.map((engagement, index) => (
        <article className="engagement" key={engagement.id}>
          <div className="engagement-index">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="engagement-venue">
            <span>{engagement.venue}</span>
            {engagement.date && <time>{engagement.date}</time>}
            <small>{engagement.format}</small>
          </div>
          <div className="engagement-main">
            <h3>{engagement.title}</h3>
            <p>{engagement.summary}</p>
            {engagement.note && <small>{engagement.note}</small>}
          </div>
          <div className="engagement-side">
            <div className="topic-list">
              {engagement.topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
            {engagement.href && (
              <a
                href={engagement.href}
                aria-label={`Open ${engagement.title}`}
                data-analytics-id={`engagement-${engagement.id}`}
              >
                Open <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
