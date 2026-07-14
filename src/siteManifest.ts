export type RouteId =
  | "home"
  | "healthcare"
  | "medical-education"
  | "incubator"
  | "speaking"
  | "not-found";

export type RouteDefinition = {
  id: RouteId;
  path: string;
  navLabel?: string;
  title: string;
  description: string;
};

export const routes: RouteDefinition[] = [
  {
    id: "home",
    path: "/",
    title: "Tama Thé, MD | Physician, Educator, Builder",
    description:
      "Tama Thé works across healthcare, medical education, public health, and practical artificial intelligence in Kentucky.",
  },
  {
    id: "healthcare",
    path: "/healthcare",
    navLabel: "Healthcare",
    title: "AI in Healthcare | Tama Thé, MD",
    description:
      "Healthcare AI initiatives spanning cancer screening, diabetic retinopathy, rural access, and whole-blood drone delivery.",
  },
  {
    id: "medical-education",
    path: "/medical-education",
    navLabel: "Medical Education",
    title: "AI in Medical Education | Tama Thé, MD",
    description:
      "Research and practical work on AI literacy, clinical reasoning, assessment, SEEF, and formative clinical-performance evaluation.",
  },
  {
    id: "incubator",
    path: "/incubator",
    navLabel: "AI Incubator",
    title: "AI Incubator | Tama Thé, MD",
    description:
      "A brief introduction to the University of Kentucky AI Incubator and Tama Thé's role in building the cross-campus community.",
  },
  {
    id: "speaking",
    path: "/speaking",
    navLabel: "Speaking",
    title: "Speaking | Tama Thé, MD",
    description:
      "Selected talks, workshops, and public conversations about useful AI in healthcare, medical education, and Kentucky.",
  },
];

export const notFoundRoute: RouteDefinition = {
  id: "not-found",
  path: "/404",
  title: "Page not found | Tama Thé, MD",
  description: "The requested page could not be found.",
};

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("/").filter(Boolean).join("/")}`;
}

export function resolveRoute(pathname: string) {
  const normalized = normalizePath(pathname);
  return routes.find((route) => route.path === normalized) ?? notFoundRoute;
}

export const primaryRoutes = routes.filter((route) => route.navLabel);
