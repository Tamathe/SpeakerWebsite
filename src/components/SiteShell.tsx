import type { ReactNode } from "react";
import { primaryRoutes, type RouteDefinition } from "../siteManifest";
import { siteIdentity } from "../siteContent";

function SiteHeader({ route }: { route: RouteDefinition }) {
  return (
    <header className="site-header">
      <a className="site-brand" href="/">
        <strong>Tama Thé</strong>
        <span>MD / Physician · Educator · Builder</span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {primaryRoutes.map((item) => (
          <a
            href={item.path}
            key={item.id}
            aria-current={route.id === item.id ? "page" : undefined}
          >
            {item.navLabel}
          </a>
        ))}
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="section-index">Contact / Collaboration</p>
          <h2>Bring me the messy version.</h2>
        </div>
        <div className="footer-copy">
          <p>
            If the problem crosses medicine, public health, education, and AI,
            that is probably the interesting part.
          </p>
          <a className="text-link" href={siteIdentity.email}>
            Email Tama <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} Tama Thé, MD</span>
        <span>Kentucky / Healthcare / Education / AI</span>
      </div>
    </footer>
  );
}

export function SiteShell({
  route,
  children,
}: {
  route: RouteDefinition;
  children: ReactNode;
}) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader route={route} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
