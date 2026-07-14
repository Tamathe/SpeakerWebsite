import { useEffect, type ComponentType } from "react";
import { SiteShell } from "./components/SiteShell";
import { HealthcarePage } from "./pages/HealthcarePage";
import { HomePage } from "./pages/HomePage";
import { IncubatorPage } from "./pages/IncubatorPage";
import { MedicalEducationPage } from "./pages/MedicalEducationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SpeakingPage } from "./pages/SpeakingPage";
import { resolveRoute, type RouteId } from "./siteManifest";

const pages: Record<RouteId, ComponentType> = {
  home: HomePage,
  healthcare: HealthcarePage,
  "medical-education": MedicalEducationPage,
  incubator: IncubatorPage,
  speaking: SpeakingPage,
  "not-found": NotFoundPage,
};

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

function App() {
  const route = resolveRoute(window.location.pathname);
  const Page = pages[route.id];

  useEffect(() => {
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
  }, [route]);

  return (
    <SiteShell route={route}>
      <Page />
    </SiteShell>
  );
}

export default App;
