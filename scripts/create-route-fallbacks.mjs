import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteOrigin = "https://tamathe.com";
const outputDirectory = resolve("dist", "client");
const templatePath = resolve(outputDirectory, "index.html");

const routes = [
  {
    path: "/",
    title: "Tama Thé, MD | Physician, Educator, Builder",
    description:
      "Tama Thé works across healthcare, medical education, public health, and practical artificial intelligence in Kentucky.",
  },
  {
    path: "/healthcare",
    title: "AI in Healthcare | Tama Thé, MD",
    description:
      "Healthcare AI initiatives spanning cancer screening, diabetic retinopathy, rural access, and whole-blood drone delivery.",
  },
  {
    path: "/medical-education",
    title: "AI in Medical Education | Tama Thé, MD",
    description:
      "Research and practical work on clinical reasoning, assessment, SEEF, and formative clinical-performance evaluation.",
  },
  {
    path: "/incubator",
    title: "AI Incubator | Tama Thé, MD",
    description:
      "A brief introduction to the University of Kentucky AI Incubator and Tama Thé's role in building the cross-campus community.",
  },
  {
    path: "/ai-literacy",
    title: "AI Literacy | Tama Thé, MD",
    description:
      "Practice-based AI literacy for clinicians, educators, staff, students, and institutions learning to test output, recognize limits, and use AI with judgment.",
  },
  {
    path: "/speaking",
    title: "Speaking | Tama Thé, MD",
    description:
      "Selected talks, workshops, and public conversations about useful AI in healthcare, medical education, and Kentucky.",
  },
];

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}="${key}"[^>]*>`, "i");
  return html.replace(pattern, (tag) =>
    tag.replace(/content="[^"]*"/i, `content="${value}"`),
  );
}

function renderRoute(template, route) {
  const canonicalUrl = `${siteOrigin}${route.path === "/" ? "" : route.path}`;
  const socialImageUrl = `${siteOrigin}/og.png`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${route.title}</title>`);

  html = replaceMeta(html, "name", "description", route.description);
  html = replaceMeta(html, "property", "og:title", route.title);
  html = replaceMeta(html, "property", "og:description", route.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "property", "og:image", socialImageUrl);
  html = replaceMeta(html, "name", "twitter:title", route.title);
  html = replaceMeta(html, "name", "twitter:description", route.description);
  html = replaceMeta(html, "name", "twitter:image", socialImageUrl);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );

  return html;
}

const template = await readFile(templatePath, "utf8");

for (const route of routes) {
  const html = renderRoute(template, route);

  if (route.path === "/") {
    await writeFile(templatePath, html);
    continue;
  }

  const routeName = route.path.slice(1);
  const routeDirectory = resolve(outputDirectory, routeName);
  await mkdir(routeDirectory, { recursive: true });
  await Promise.all([
    writeFile(resolve(outputDirectory, `${routeName}.html`), html),
    writeFile(resolve(routeDirectory, "index.html"), html),
  ]);
}
