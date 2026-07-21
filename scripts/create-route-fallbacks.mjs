import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteOrigin = "https://tamathe.com";
const outputDirectory = resolve("dist", "client");
const templatePath = resolve(outputDirectory, "index.html");
const metadata = {
  title: "Tama Thé, MD | Data-driven precision",
  description:
    "Tama Thé connects data to action across healthcare, education, and public systems.",
};

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}="${key}"[^>]*>`, "i");
  return html.replace(pattern, (tag) =>
    tag.replace(/content="[^"]*"/i, `content="${value}"`),
  );
}

const template = await readFile(templatePath, "utf8");
const canonicalUrl = `${siteOrigin}/`;
const socialImageUrl = `${siteOrigin}/og.png`;
let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${metadata.title}</title>`);

html = replaceMeta(html, "name", "description", metadata.description);
html = replaceMeta(html, "property", "og:title", metadata.title);
html = replaceMeta(html, "property", "og:description", metadata.description);
html = replaceMeta(html, "property", "og:url", canonicalUrl);
html = replaceMeta(html, "property", "og:image", socialImageUrl);
html = replaceMeta(html, "name", "twitter:title", metadata.title);
html = replaceMeta(html, "name", "twitter:description", metadata.description);
html = replaceMeta(html, "name", "twitter:image", socialImageUrl);
html = html.replace(
  /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
  `<link rel="canonical" href="${canonicalUrl}" />`,
);

await writeFile(templatePath, html);
