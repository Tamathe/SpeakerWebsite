import { useEffect } from "react";
import { SiteShell } from "./components/SiteShell";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SpeakingPage } from "./pages/SpeakingPage";
import { legacyRedirects, normalizePath, resolveRoute } from "./siteManifest";

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

function App() {
  const normalizedPath = normalizePath(window.location.pathname);
  const route = resolveRoute(normalizedPath);
  const Page = route.id === "home" ? SpeakingPage : NotFoundPage;

  useEffect(() => {
    const redirectTarget = legacyRedirects[normalizedPath];

    if (redirectTarget) {
      window.history.replaceState(null, "", redirectTarget);
    }

    const canonicalPath = route.id === "not-found" ? window.location.pathname : route.path;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;

    document.title = route.title;
    setMeta('meta[name="description"]', route.description);
    setMeta('meta[property="og:title"]', route.title);
    setMeta('meta[property="og:description"]', route.description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', `${window.location.origin}/og.png`);
    setMeta('meta[name="twitter:title"]', route.title);
    setMeta('meta[name="twitter:description"]', route.description);
    setMeta('meta[name="twitter:image"]', `${window.location.origin}/og.png`);
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", canonicalUrl);
  }, [normalizedPath, route]);

  return (
    <SiteShell>
      <Page />
    </SiteShell>
  );
}

export default App;
