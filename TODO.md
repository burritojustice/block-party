# To do

Gathered from the build conversation, October 2026. Check items off or move them into GitHub issues as they're picked up.

## Waiting on someone

- [ ] **Airtable:** prefill the form from a link vs. embed it — waiting on stakeholders. The "Apply for a Block Party" button is still a placeholder.
- [ ] **Zoning colors:** swap the provisional zoning palette (`ZONING` in `index.html`) for SF Planning's. Needs the ArcGIS item data for https://experience.arcgis.com/experience/573d02b43b7b46e381df04b7f225da95 (`https://www.arcgis.com/sharing/rest/content/items/573d02b43b7b46e381df04b7f225da95/data?f=json` — paste it in chat so Claude can fetch it).
- [ ] **Slimmer parcels pmtiles:** rebuild with only the fields we use and zoom 15 only (command in the v32 notes); same filename, nothing else changes.
- [ ] **Schools enrollment:** join California Department of Education enrollment; document the workflow (maybe its own repo, since it works statewide). Then add the enrollment column to `build_layers.py`'s school fields.

## Next up

- [ ] **`match.js`:** port `sf-blocks/scripts/match_polygons.py` to one JS module (browser + Node CLI), check it reproduces the Green SF Now results row for row, then retire the Python version.
- [ ] **Shared test cases:** inputs with expected CNNs (Sanchez Greenway → 14 blocks, a point at 24th & Mission → that corner, ...) run against JS and any remaining Python.
- [ ] **Web CNN matching tool:** drag in GeoJSON or CSV; polygons → blocks fully / partly inside plus intersections; points → nearest block or corner; lines → blocks they run along (Valhalla Meili / OSRM `/match` as references for noisy traces); text → `match_blocks.py` through Pyodide at first, ported later.
- [ ] **Push sf-blocks 2026.10.22** (`match_polygons.py`, README, CHANGELOG) if it isn't on GitHub yet.

## Quiet streets

- [ ] Narrowing conditions: residential block that meets a collector or arterial; Muni route along the block; protected bike lane along the block (bike data already has the CNN).
- [ ] "On a Slow Street" as an option (offered, not built).
- [ ] Next to a school, park, or medical lot (now possible from City Lands and the parcels' CIE / MED land use).

## Data and layers

- [ ] **Scheduled refresh:** a GitHub Action that downloads from DataSF and rebuilds `data/layers/` (Muni, bike, Slow Streets, City Lands) and the parcels pmtiles, like the striping refresh. Claude can't reach data.sf.gov from its sandbox; Actions can.
- [ ] **Muni from GTFS:** per-block routes and trips per hour (enables "more than N buses an hour"); the block matching stays the same.
- [ ] **Muni subway sections:** hand-made list of blocks over the Market St subway, Twin Peaks and Sunset tunnels, and the Central Subway, so they don't count as bus streets.
- [ ] **"Next to" with parcels:** private schools and hospitals from land use CIE / MED lots, not just City Lands and the point layers.
- [ ] Optional: layers as one pmtiles (tippecanoe command in the README) for offline use.

## Check against real data

- [ ] Slow Streets: how the corridor (`extents`) text reads in the popup and card.
- [ ] City Lands: "Open space" catches the right parcels; built file size.
- [ ] "Next to": 20 m is right for wide streets (Dolores, Mission); parcels across a cross street don't sneak in.
- [ ] Parcels on cards: lot counts look right on wide streets and at corners (14 m, or 25 m when the address is on the street).
- [ ] Muni shields: the combined route numbers ("14 · 14R · 49 · 714") fit and read well.
- [ ] Dead ends: Hardie Pl now reads "Kearny St to Kearny St"; Bepler St and Berry St's short piece are still isolated in the city data.
- [ ] Green SF Now matches: Dorchester picks up Portola blocks next to the median; Frida Kahlo Way picks up City College private-road ends; area polygons list many partial edge blocks (`--min-partial`).

## Housekeeping

- [ ] sf-blocks: `git rm --cached .DS_Store`; keep its `streets.json` the slopes version.
- [ ] Selecter: same creek-filter fix as Block Party (keep the style's kind filter, treat a missing name as blank).
- [ ] Production Protomaps key (`CONFIG.PROTOMAPS_KEY`).
- [ ] Translations (`es`, `zh`): copy the `en` block in `I18N`.

## Standalone / offline handoff (list only, not started)

- [ ] Basemap: `pmtiles extract` of the Protomaps build for SF (to zoom 15) + local style, glyphs, sprites; drops the API key.
- [ ] Local copies of MapLibre, maplibre-contour, PMTiles; self-hosted Figtree and Bricolage fonts.
- [ ] Terrain: Terrarium tiles for SF as a raster-dem pmtiles (keep `.tile-cache` as the raw backup); USGS 3DEP as a long-term source.
- [ ] Satellite: Esri can't be redistributed — NAIP, the city's aerials, or no satellite offline.
- [ ] Static server with range requests; optional service worker for offline.
- [ ] Licenses and credits (OSM ODbL, DataSF, terrain, OFL fonts, MapLibre BSD, the project's own license); docs for updating data and rebuilding files.
