import type { ReactNode } from "react";
import { siteIdentity } from "../siteContent";

const navigation = [
  { label: "Featured", href: "/#featured-talk" },
  { label: "Incubator", href: "/#incubator" },
  { label: "TEK 100", href: "/#tek100" },
  { label: "Talks", href: "/#engagements" },
  { label: "Contact", href: "/#contact" },
];

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="/">
        <strong>Tama Thé</strong>
        <span>MD / Physician · Educator · Builder</span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
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
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
