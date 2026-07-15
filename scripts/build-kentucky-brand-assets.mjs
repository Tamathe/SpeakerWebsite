import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = process.cwd();
const geojsonPath = path.join(root, "tmp", "kentucky-boundary-census-2025.geojson");
const censusSourceUrl =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/28/query?where=STATE%3D%2721%27&outFields=STATE%2CBASENAME%2CNAME&returnGeometry=true&outSR=4326&f=geojson";
const brandDir = path.join(root, "public", "images", "brand");
const basePath = path.join(brandDir, "og-studio-base-no-kentucky.png");
const svgPath = path.join(brandDir, "kentucky-boundary-exact.svg");
const pngPath = path.join(brandDir, "kentucky-boundary-exact.png");
const ogPath = path.join(root, "public", "og.png");

const canvas = { width: 1600, height: 720, padding: 44 };
const simplifyTolerancePx = 0.28;

function sqDistance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function sqSegmentDistance(point, start, end) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = end[0];
      y = end[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

function radialSimplify(points, sqTolerance) {
  let previous = points[0];
  const simplified = [previous];

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    if (sqDistance(point, previous) > sqTolerance) {
      simplified.push(point);
      previous = point;
    }
  }

  if (previous !== points.at(-1)) simplified.push(points.at(-1));
  return simplified;
}

function douglasPeuckerStep(points, first, last, sqTolerance, simplified) {
  let maxSqDistance = sqTolerance;
  let index;

  for (let cursor = first + 1; cursor < last; cursor += 1) {
    const sqDist = sqSegmentDistance(points[cursor], points[first], points[last]);
    if (sqDist > maxSqDistance) {
      index = cursor;
      maxSqDistance = sqDist;
    }
  }

  if (maxSqDistance > sqTolerance) {
    if (index - first > 1) {
      douglasPeuckerStep(points, first, index, sqTolerance, simplified);
    }
    simplified.push(points[index]);
    if (last - index > 1) {
      douglasPeuckerStep(points, index, last, sqTolerance, simplified);
    }
  }
}

function simplify(points, tolerance) {
  if (points.length <= 2) return points;
  const sqTolerance = tolerance * tolerance;
  const reduced = radialSimplify(points, sqTolerance);
  const output = [reduced[0]];
  douglasPeuckerStep(reduced, 0, reduced.length - 1, sqTolerance, output);
  output.push(reduced.at(-1));
  return output;
}

function contours() {
  const paths = [];
  for (let y = 44; y <= canvas.height - 24; y += 30) {
    const wobble = 18 + ((y / 30) % 4) * 5;
    paths.push(
      `<path d="M -80 ${y} C 180 ${y - wobble}, 340 ${y + wobble}, 560 ${y} S 920 ${
        y - wobble
      }, 1120 ${y + 4} S 1450 ${y + wobble}, 1680 ${y - 7}" />`,
    );
  }
  return paths.join("\n        ");
}

function organicLoopPath(cx, cy, rx, ry, phase, pointCount = 32) {
  const points = [];
  for (let index = 0; index < pointCount; index += 1) {
    const angle = (index / pointCount) * Math.PI * 2;
    const wobble =
      1 +
      Math.sin(angle * 3 + phase) * 0.055 +
      Math.sin(angle * 7 - phase * 0.6) * 0.028 +
      Math.cos(angle * 11 + phase) * 0.014;
    points.push([
      cx + Math.cos(angle) * rx * wobble,
      cy + Math.sin(angle) * ry * wobble,
    ]);
  }

  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = midpoint(points.at(-1), points[0]);
  const segments = points.map((point, index) => {
    const end = midpoint(point, points[(index + 1) % points.length]);
    return `Q ${fmt(point[0])} ${fmt(point[1])} ${fmt(end[0])} ${fmt(end[1])}`;
  });
  return `M ${fmt(start[0])} ${fmt(start[1])} ${segments.join(" ")} Z`;
}

function topographicLoops() {
  const features = [
    { cx: 330, cy: 470, rx: 430, ry: 210, phase: 0.8, levels: 8 },
    { cx: 805, cy: 350, rx: 500, ry: 250, phase: 2.1, levels: 9 },
    { cx: 1270, cy: 245, rx: 390, ry: 215, phase: 3.5, levels: 8 },
  ];

  return features
    .flatMap((feature) =>
      Array.from({ length: feature.levels }, (_, level) => {
        const shrink = 1 - level * 0.095;
        return `<path d="${organicLoopPath(
          feature.cx,
          feature.cy,
          feature.rx * shrink,
          feature.ry * shrink,
          feature.phase + level * 0.19,
        )}" />`;
      }),
    )
    .join("\n        ");
}

function fmt(value) {
  return Number(value.toFixed(2));
}

let geojsonText;
try {
  geojsonText = await fs.readFile(geojsonPath, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  const response = await fetch(censusSourceUrl);
  if (!response.ok) {
    throw new Error(`Census boundary download failed: ${response.status} ${response.statusText}`);
  }
  geojsonText = await response.text();
  await fs.mkdir(path.dirname(geojsonPath), { recursive: true });
  await fs.writeFile(geojsonPath, geojsonText, "utf8");
}

const geojson = JSON.parse(geojsonText);
const feature = geojson.features.find((entry) => entry.properties?.STATE === "21");

if (!feature || feature.geometry?.type !== "MultiPolygon") {
  throw new Error("Kentucky MultiPolygon (STATE 21) was not found in the Census source.");
}

const sourceRings = feature.geometry.coordinates.flatMap((polygon) => polygon);
const midLatitude = sourceRings.flat().reduce((sum, point) => sum + point[1], 0) /
  sourceRings.flat().length;
const longitudeScale = Math.cos((midLatitude * Math.PI) / 180);
const projected = sourceRings.map((ring) =>
  ring.map(([longitude, latitude]) => [longitude * longitudeScale, -latitude]),
);
const allPoints = projected.flat();
const minX = Math.min(...allPoints.map(([x]) => x));
const maxX = Math.max(...allPoints.map(([x]) => x));
const minY = Math.min(...allPoints.map(([, y]) => y));
const maxY = Math.max(...allPoints.map(([, y]) => y));
const scale = Math.min(
  (canvas.width - canvas.padding * 2) / (maxX - minX),
  (canvas.height - canvas.padding * 2) / (maxY - minY),
);
const offsetX = (canvas.width - (maxX - minX) * scale) / 2;
const offsetY = (canvas.height - (maxY - minY) * scale) / 2;

const displayRings = projected.map((ring) => {
  const points = ring.map(([x, y]) => [
    (x - minX) * scale + offsetX,
    (y - minY) * scale + offsetY,
  ]);
  return simplify(points, simplifyTolerancePx);
});

const boundaryPath = displayRings
  .map(
    (ring) =>
      `M ${ring.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(" L ")} Z`,
  )
  .join(" ");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}" role="img" aria-labelledby="title desc">
  <title id="title">Exact Kentucky state boundary</title>
  <desc id="desc">Kentucky silhouette derived from U.S. Census Bureau TIGERweb 2025 state geometry, including Kentucky Bend.</desc>
  <defs>
    <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#343841" />
      <stop offset="0.46" stop-color="#1d2129" />
      <stop offset="1" stop-color="#0b0f17" />
    </linearGradient>
    <radialGradient id="cobalt-wash" cx="82%" cy="28%" r="82%">
      <stop offset="0" stop-color="#1769e0" stop-opacity="0.28" />
      <stop offset="0.58" stop-color="#1769e0" stop-opacity="0.035" />
      <stop offset="1" stop-color="#1769e0" stop-opacity="0" />
    </radialGradient>
    <pattern id="micro-dots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="#ffffff" fill-opacity="0.085" />
    </pattern>
    <filter id="stone-grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022 0.075" numOctaves="4" seed="17" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="
        0.34 0 0 0 -0.08
        0 0.36 0 0 -0.08
        0 0 0.42 0 -0.06
        0 0 0 0.42 0" />
    </filter>
    <filter id="shadow" x="-20%" y="-30%" width="140%" height="170%">
      <feDropShadow dx="0" dy="13" stdDeviation="18" flood-color="#000000" flood-opacity="0.82" />
      <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#1769e0" flood-opacity="0.3" />
    </filter>
    <filter id="soft-glow" x="-20%" y="-30%" width="140%" height="170%">
      <feGaussianBlur stdDeviation="13" />
    </filter>
    <clipPath id="kentucky-clip">
      <path d="${boundaryPath}" fill-rule="evenodd" clip-rule="evenodd" />
    </clipPath>
  </defs>
  <path d="${boundaryPath}" fill="#1769e0" fill-rule="evenodd" opacity="0.12" filter="url(#soft-glow)" />
  <g filter="url(#shadow)">
    <path d="${boundaryPath}" fill="url(#surface)" fill-rule="evenodd" />
    <g clip-path="url(#kentucky-clip)">
      <rect width="${canvas.width}" height="${canvas.height}" fill="url(#surface)" />
      <rect width="${canvas.width}" height="${canvas.height}" fill="#9aa6b8" opacity="0.24" filter="url(#stone-grain)" />
      <rect width="${canvas.width}" height="${canvas.height}" fill="url(#micro-dots)" />
      <rect width="${canvas.width}" height="${canvas.height}" fill="url(#cobalt-wash)" />
      <g fill="none" stroke="#000000" stroke-opacity="0.48" stroke-width="5" transform="translate(1.7 2.2)">
        ${contours()}
      </g>
      <g fill="none" stroke="#b7c3d4" stroke-opacity="0.22" stroke-width="1.5">
        ${contours()}
      </g>
      <g fill="none" stroke="#000000" stroke-opacity="0.46" stroke-width="4.6" transform="translate(1.5 2)">
        ${topographicLoops()}
      </g>
      <g fill="none" stroke="#c4cfdd" stroke-opacity="0.2" stroke-width="1.35">
        ${topographicLoops()}
      </g>
      <path d="${boundaryPath}" fill="none" stroke="#dce9ff" stroke-opacity="0.16" stroke-width="20" transform="translate(-4 -4)" />
      <path d="${boundaryPath}" fill="none" stroke="#000000" stroke-opacity="0.68" stroke-width="24" transform="translate(5 6)" />
    </g>
    <path d="${boundaryPath}" fill="none" fill-rule="evenodd" stroke="#1769e0" stroke-width="5.8" stroke-linejoin="round" />
    <path d="${boundaryPath}" fill="none" fill-rule="evenodd" stroke="#82b3ff" stroke-opacity="0.62" stroke-width="1.45" stroke-linejoin="round" />
  </g>
</svg>
`;

await fs.mkdir(brandDir, { recursive: true });
await fs.writeFile(svgPath, svg, "utf8");

const statePng = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toBuffer();
await fs.writeFile(pngPath, statePng);

const baseMetadata = await sharp(basePath).metadata();
if (baseMetadata.width !== 1731 || baseMetadata.height !== 909) {
  throw new Error(`Unexpected social-card base dimensions: ${baseMetadata.width}x${baseMetadata.height}`);
}

const overlay = await sharp(statePng)
  .resize({ width: 760, withoutEnlargement: true })
  .png()
  .toBuffer();

await sharp(basePath)
  .composite([{ input: overlay, left: 900, top: 58 }])
  .png({ compressionLevel: 9 })
  .toFile(ogPath);

console.log(
  JSON.stringify(
    {
      censusFeature: feature.properties?.NAME,
      sourcePoints: sourceRings.reduce((sum, ring) => sum + ring.length, 0),
      renderedPoints: displayRings.reduce((sum, ring) => sum + ring.length, 0),
      polygons: feature.geometry.coordinates.length,
      svgPath,
      pngPath,
      ogPath,
    },
    null,
    2,
  ),
);
