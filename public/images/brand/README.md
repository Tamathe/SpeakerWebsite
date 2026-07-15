# Kentucky boundary asset

`kentucky-boundary-exact.svg` is the canonical Kentucky silhouette for speaker-site and LinkedIn artwork. Use this asset directly, or clip photographic texture inside it. Do not ask an image model to redraw the state border.

The current treatment restores the earlier artwork's black-stone relief, engraved topographic lines, inner bevel, and cobalt rim. Every decorative layer is clipped to the canonical boundary; no texture, displacement, or generated geometry is allowed to alter the state outline.

The boundary comes from the U.S. Census Bureau TIGERweb `State_County` service, ACS 2025 States layer (ID 28), filtered to Kentucky (`STATE = 21`) and returned as GeoJSON in WGS84. The geometry is a two-part multipolygon and preserves Kentucky Bend. The rendered path is simplified by no more than 0.28 pixels at the 1600 × 720 master size.

Source query:

`https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/28/query?where=STATE%3D%2721%27&outFields=STATE%2CBASENAME%2CNAME&returnGeometry=true&outSR=4326&f=geojson`

Files:

- `kentucky-boundary-exact.svg` — canonical vector with transparent background
- `kentucky-boundary-exact.png` — 1600 × 720 transparent raster derivative
- `og-studio-base-no-kentucky.png` — reusable social-card base with the malformed generated state removed
- `../../og.png` — final social card composed from the clean base and canonical boundary

Regenerate with the command below. The script uses the cached Census GeoJSON in `tmp/kentucky-boundary-census-2025.geojson`, or downloads the cited 2025 source when the cache is absent:

`node scripts/build-kentucky-brand-assets.mjs`
