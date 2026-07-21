export type RouteId = "home" | "not-found";

export type RouteDefinition = {
  id: RouteId;
  path: string;
  title: string;
  description: string;
};

export const siteOrigin = "https://tamathe.com";

export const homeRoute: RouteDefinition = {
  id: "home",
  path: "/",
  title: "Tama Thé, MD | Data-driven precision",
  description:
    "Tama Thé connects data to action across healthcare, education, and public systems.",
};

export const notFoundRoute: RouteDefinition = {
  id: "not-found",
  path: "/404",
  title: "Page not found | Tama Thé, MD",
  description: "The requested page could not be found.",
};

export const legacyRedirects: Record<string, string> = {
  "/speaking": "/#featured-talk",
  "/healthcare": "/#featured-talk",
  "/medical-education": "/#tek100",
  "/incubator": "/#incubator",
  "/ai-literacy": "/#tek100",
};

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("/").filter(Boolean).join("/")}`;
}

export function resolveRoute(pathname: string) {
  const normalized = normalizePath(pathname);
  return normalized === "/" || normalized in legacyRedirects
    ? homeRoute
    : notFoundRoute;
}
