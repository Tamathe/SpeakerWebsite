export function NotFoundPage() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="shell">
        <h1 id="not-found-title">This path does not lead to a project.</h1>
        <p>The page may have moved as the site was reorganized.</p>
        <a className="button button-primary" href="/">
          Return home <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
