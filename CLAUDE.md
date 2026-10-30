# Block Party: notes for Claude

A San Francisco street-block (CNN) lookup for block party organizers. Live at https://burritojustice.github.io/block-party/ (GitHub Pages, served straight from `main`). burritojustice is the primary home; civic-joy-fund/block-party runs its own copy and is updated from here once a change checks out. Read `README.md` for the file list and data sources, `TODO.md` for what's next, and `CHANGELOG.md` for how things got this way.

## Working rules

- **Ship as a PR, always to `main`:** for any code change, make a branch, commit, push it, and open the PR against `main`, even when it builds on an unmerged PR (branch from that one and say "Includes #NN"). Never target another PR's branch: GitHub merged two stacked PRs into their parent branches after those had gone to `main`, stranding them. (`gh api repos/burritojustice/block-party/pulls -f head=<branch> -f base=main ...`; GraphQL is blocked here, so plain `gh pr create` may fail). Don't leave a branch pushed without a PR.
- **Version every change:** this applies to app and data changes; docs-only changes like this file don't need it. Bump both `<!-- build: vNN -->` near the top of `index.html` and `const _BUILD_VERSION = 'vNN'`, and add a `## vNN` entry at the top of `CHANGELOG.md`. Hovering the title shows the version, which is how John checks what's deployed.
- **Dates are YYYY-MM-DD** everywhere: data, CHANGELOG, card text, exports.
- **The creek fix applies to every map:** hide Protomaps `water_stream`, and filter names containing "Creek" or "Arroyo" out of `water_river` and waterway labels (`hideCreeks()`). John wants the same fix on all his maps, Selecter included.
- **Keep it a single file:** no build step or bundler. Libraries come from unpkg at pinned versions (MapLibre 5.6.0, maplibre-contour 0.1.0, PMTiles 4.5.0).
- **Write plainly:** UI text, README, and CHANGELOG are short and concrete. User-facing strings go in `I18N.en`; don't hard-code them in HTML builders.
- **Leave the source files:** keep raw downloads in `data/uploads/` and `reference/` as published. Scripts trim them into `data/`.
- **Data comes from sf-blocks:** the page loads `region.json`, streets, layers, boundaries, parcels and the groups list live from https://burritojustice.github.io/sf-blocks/ through `SFBlocks` (the first `<script>`, the same code as Joiner's `js/sfblocks.js`), and falls back to the copies here at the same paths. Change data in sf-blocks, then run `python3 scripts/copy_sf_blocks.py ../sf-blocks`, which updates `data/sf-blocks.json`. Aliases live only in sf-blocks' `data/aliases.json`.
- **Area layers:** `AREA_LAYERS` lists sf-blocks boundary sets (by id) to show as map layers, card rows and export columns (`Areas` module).
- **Fitting the map:** `fitSegs()` fits, then once the terrain under the blocks has loaded (polls `dem-terrain` and a height there), re-measures with `map.project` and eases out if they spill over. Without it, `#cnn=` links on hills open too close.
- **sf-blocks caching:** `SFBlocks` fetches `region.json` / `VERSION` with `cache: 'no-cache'` and other files with `?v=<version>`, so new data shows up on the next load despite Pages' 10-minute cache.
- **Cross streets toggle:** `showCross` / `updateCross()`, the checkbox in the map key; fades `bp-context*` by opacity.
- **Apply button:** `CONFIG.APPLY` (`show`, `url`, `params`). Off on this build; civic-joy-fund's copy turns it on. See the README.
- **Basemap key:** Protomaps `071e272e8d5e13b7` (allowed origin burritojustice.github.io; localhost works with any key). `SFBlocks.basemapKey()` picks another origin's key from `region.json`.

## Related repos

| Repo | Role |
|---|---|
| burritojustice/sf-blocks | **Main copy** of all the data (streets, boundaries, layers, uploads, parcels, aliases, reference lists) and `build_data.py`, `build_layers.py`, `build_neighborhood_groups.py`, `match_blocks.py`, `match_polygons.py`. The page reads it live. Block Party keeps copies; each script's first line says which sf-blocks version it came from. Change sf-blocks first (bump its `VERSION` and CHANGELOG), then copy over. |
| burritojustice/joiner | Joins Airtable data to SF polygons. Also reads sf-blocks live. |
| civic-joy-fund/block-party | Civic Joy Fund's copy, updated from here. |
| burritojustice/maplibre (Selecter) | GeoJSON Selecter, which Block Party grew out of. It shares the creek fix. |
| burritojustice/sf-striping | Also uses sf-blocks. |

## How `index.html` is laid out

Top to bottom (search for these names):

- **`CONFIG`, `HOOD_SETS`, `I18N`**: settings, the neighborhood sets shown on cards, and all UI strings (`t(key)`). The set shown on closed cards is `hoodSet` (`hoodsHTML`), saved in localStorage as `bp-hoodset`.
- **`Logic`**: loads `streets.json` and handles everything that isn't the map:
  - street name normalizing and search
  - cross streets in order (Dijkstra along the street)
  - between / at address / intersection lookups
  - dead ends (an end within 1.5 m of another drivable street counts as open, e.g. Comerford)
  - quiet-street filters (`QUIET_SHOW` / `QUIET_NARROW`)
- **`Elev`**: Terrarium DEM sampling, which drives the slope and elevation profile on cards and slope on hover.
- **Form and results**: `setupForm`, `select*`, and `render`. Cards are built by `cardHTML` (blocks) and `intCardHTML` (intersections). `cardText` and `record` / `toCSV` handle copy and export. The URL hash (`#cnn=...`) round-trips through `writeHash` / `applyHash`.
- **Map**: `initMap`, `hideCreeks`, `addMapLayers`, label modes (flat labels above `LABEL_3D_PITCH`), contours, basemap / satellite.
- **Overlays**: `OVERLAYS` / `OVERLAY_DEFAULT` / `overlayMode`, then `applyOverlay(k)` / `updateOverlays()`, with data loaded lazily by `loadOverlay` / `fetchLayer`.
  - Layers are shown and hidden by **visibility, not `setLayerZoomRange`**, which was unreliable with terrain on.
  - City-owned land has category chips (`setLandCats`).
- **`Transit`**: Muni and bike lanes on each block.
  - Muni routes match a block when they run along it: within 15 m at 25/50/75% along the block, and heading within 30° of it.
  - Bike lanes and Slow Streets join by CNN.
- **`Nearby`**: the "Next to" row. City Lands parcels within 20 m (at least 2 samples, 10% trimmed off each end), plus point layers within 35 m.
- **`Parcels`**: land use and zoning on cards, decoded from the zoom-15 pmtiles with a small built-in `decodeMVT`.
  - A lot counts within 14 m of the middle 70% of the block, or 25 m if its address is on the same street. Lots are de-duplicated by `mapblklot`.
  - The zoning palette is SF Planning's (`ZONING`, from their MapServer layer 3).
  - The white outlines on counted lots (`updateAdjLots`) show only while Parcels is on.
- **`Groups`**: SF Planning neighborhood groups for the block's Planning neighborhood (`hood_planning`), with expand and "Copy list".

## Data

- **`data/streets.json`**: compact format with `seg_fields` / `node_fields` and a shared `strings` table. Geometry is delta-encoded ints (`Logic.decodeGeom`). Optional fields are looked up by name: `slope_avg` / `slope_max`, and `hood_analysis|sffind|planning|realtor|wof` ("; "-joined when a block crosses a boundary). Rebuild with `python3 scripts/build_data.py --slopes --areas`. `--slopes` needs the Terrarium S3 tiles, which are blocked from Claude's sandbox; see Gotchas.
- **Where the neighborhood fields come from:**
  - The streets CSV's `nhood` is DPW's realtor-style neighborhood, shown as "Streets file (DPW)".
  - `analysis_neighborhood` also comes from the CSV.
  - The `hood_*` fields are point-in-polygon tests at 25/50/75% along the block, using `data/boundaries/`.
- **`data/layers/*.geojson`**: trimmed overlays. Rebuild with `python3 scripts/build_layers.py` (`--download` refreshes from DataSF; the Socrata ids are in `SOURCES`). Schools has hand-added columns and is never re-downloaded.
- **`data/Land_Use_with_Active_Parcel_Information.pmtiles`**: parcels (2023 land use plus zoning), built by John with tippecanoe. A slimmer rebuild is on the TODO.
- **`reference/neighborhood-groups/neighborhood_groups.json`**: from `reference/neighborhood-groups/` via `scripts/build_neighborhood_groups.py`. It keeps only organization, name, email and preference; addresses and phones stay in the reference copy.

## Testing

- Serve with **range requests** or PMTiles fails: `npx http-server -p 8000`, not `python -m http.server`.
- Headless Chromium + Playwright is preinstalled in Claude's sandbox. Check a real block, e.g. Valencia St, 20th St to Liberty St (CNN 13067000): Analysis, SF Find and Planning say Mission; Realtor, Who's on First and DPW say Inner Mission. Click a few cards and watch the console for errors.
- In tests, serve empty protobuf for glyph requests, or label tiles throw.

## Gotchas we've hit

- **Mixing filter syntax:** MapLibre won't mix legacy filters (`["==", "kind", ...]`) with expressions. `hideCreeks` converts the style's legacy filters first, and uses `coalesce` for a missing `name`.
- **`querySourceFeatures` with terrain:** it returns nothing while terrain is on. Use `queryRenderedFeatures` (parcel labels do).
- **Layer ordering:** inserting a layer `before` one that doesn't exist yet fails silently. Insert before the `below` anchor.
- **Class names:** `.seg` is taken by cards; the layer-menu segmented control is `.lseg`.
- **Network from Claude's sandbox:** DataSF (`data.sf.gov`) and the Terrarium S3 bucket are blocked. Ask John for exports, or post-process an existing `streets.json`. A GitHub Action could do scheduled refreshes; it's on the TODO. WebFetch reaches some ArcGIS REST endpoints (e.g. sfplanninggis.org).
- **Shallow clones:** the fetch refspec only covers `main`. After pushing a branch, run `git config --add remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'` and `git branch -u origin/<branch>`, or the stop hook reports it as unpushed.
