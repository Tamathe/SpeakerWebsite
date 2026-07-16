import type { ReactNode } from "react";
import { siteIdentity } from "../siteContent";
import { AnalyticsTracker } from "./AnalyticsTracker";

const navigation = [
  { label: "Work", href: "/#work" },
  { label: "Education", href: "/#tek100" },
  { label: "Speaking", href: "/#speaking" },
  { label: "Contact", href: "/#contact" },
];

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="/" data-analytics-id="site-brand">
        <strong>Tama Thé</strong>
        <span>MD / Kentucky</span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a
            href={item.href}
            key={item.href}
            data-analytics-id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
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
          <p className="section-index">Contact</p>
          <h2>Questions about the work?</h2>
        </div>
        <div className="footer-copy">
          <p>
            I welcome conversations about healthcare AI projects, medical
            education, public-sector collaboration, and speaking.
          </p>
          <a
            className="text-link"
            href={siteIdentity.email}
            data-analytics-id="footer-email"
          >
            Email Tama <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <details className="shell privacy-disclosure" id="privacy">
        <summary>Privacy</summary>
        <p>
          This site uses cookie-free analytics to understand aggregate traffic,
          referral campaigns, link clicks, and intentional video engagement. It
          records approximate country and region, but not raw IP addresses,
          names, email contents, full referring URLs, or persistent visitor
          identities. Each page load gets a new random grouping identifier that
          is never reused to recognize a returning visitor. Do Not Track and
          Global Privacy Control signals are honored. Custom event records,
          including that page-specific identifier, are retained for up to three
          months.
        </p>
      </details>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} Tama Thé, MD</span>
        <span>Kentucky / Healthcare / Education / Public systems</span>
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
      <AnalyticsTracker />
      <a
        className="skip-link"
        href="#main-content"
        data-analytics-id="skip-to-main-content"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
