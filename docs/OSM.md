# OpenStreetMap paths

Block Party shows OpenStreetMap (OSM) ways that the city's street file doesn't have: park paths, stairs, bike paths with no CNN, alleys, driveways. You can add one to a selection or a route, and Ride follows them.

The data is built in [sf-blocks](https://github.com/burritojustice/sf-blocks) (`scripts/build_osm.py`, run by the "Add or refresh data" Action, Kind: OSM ways) and loaded live from there. Data © OpenStreetMap contributors, ODbL; the credit shows wherever OSM does.

## How it's built

1. Geofabrik's Northern California extract, clipped to San Francisco (the outline from `bay_area_counties`), keeping ways with a `highway` tag.
2. Each way is cut into **pieces** where it meets another way. A piece's id is `w<way>:n<first node>-n<last node>`.
3. Each piece gets a **kind** (below) and, for road kinds, the CNNs of the city street it runs along: 2 or more of 9 sample points within 12 m of the street and within 30° of its direction.
4. Two outputs:
   - `data/osm/ways.pmtiles` (layer `ways`): every piece, with `id`, `kind`, `highway`, `cnns` (empty when it runs along no city street) and a few tags.
   - `data/osm/gaps/<way id % 16>.json`: only the pieces that run along no city street, with the full line, so a picked piece can be drawn whole. Each entry is `[kind, highway, name, tags, coords]`, with coords ×1,000,000 as a flat list: first point, then differences.
5. `data/osm/index.json` has the date of the data and the counts.

## Kinds

Data as of 2026-11-10: 135,428 pieces from 65,763 ways. The rules are checked top to bottom; the first that fits wins.

| Kind | Rule | Pieces | Not on a city street | `highway` values among those |
|---|---|---|---|---|
| sidewalk | `highway=footway` and `footway=sidewalk` | 27,841 | 27,841 | footway |
| crossing | `footway`, `cycleway` or `path` = `crossing` | 28,841 | 28,841 | footway 28,534, cycleway 303, path 4 |
| bike | `highway=cycleway`, or `path` with `bicycle=designated` or `yes` | 1,230 | 1,230 | cycleway 1,035, path 195 |
| steps | `highway=steps` | 2,790 | 2,790 | steps |
| foot | footway, pedestrian, path, track, bridleway, corridor | 20,239 | 20,239 | footway 17,059, pedestrian 1,577, path 1,353, corridor 151, track 96, bridleway 3 |
| alley | `highway=service` with `service=alley` | 552 | 268 | service |
| service | other `highway=service` (driveways, parking aisles…) | 13,577 | 11,556 | service |
| road | motorway, trunk, primary, secondary, tertiary and their `_link`s, unclassified, residential, living_street, road, busway | 39,814 | 910 | residential 326, unclassified 203, tertiary 102, busway 82, secondary_link 53, primary_link 52, tertiary_link 23, secondary 26, motorway_link 16, trunk_link 11, motorway 8, living_street 7, primary 1 |
| other | anything else | 544 | 544 | platform 425, construction 68, elevator 38, bus_stop 6, residential_link 5, proposed 2 |

Only road, service and alley pieces are matched to city streets, so every sidewalk, crossing, path and stair counts as "not on a city street".

## In Block Party

Only pieces that run along no city street are drawn: a road piece matched to a CNN is already a city street.

- **Layers ▾ → OSM paths** (`OVERLAYS.osm`, from zoom 15; on by default as Paths):
  - **Paths:** foot, bike, alley, service, road and other (`OSM_KINDS_PATHS`).
  - **All:** every kind, adding sidewalks and crossings.
  - **Steps** are drawn in both modes on their own dashed layer (`bp-lyr-osm-steps`), and can't be clicked.
  - Colors (`OSM_COLOR`): browns, so they don't read as SFMTA's green bike lanes. Foot paths are brown, bike paths a redder brown, sidewalks and crossings pale tan, and service, road and alley grey.
- **Clicking** a piece (`bp-lyr-osm-hit`) adds it to the selection as an `osm` piece, drawn whole from the gap file (`Pieces.toggleOsm`, `osmPiece`). Exports carry its `osm_id`.
- **Ride** reads the zoom-16 tiles around you and matches the kinds in `OSM_RIDE` (the same six as Paths: no sidewalks, crossings or steps). See [Routes](ROUTES.md).

## Things to look at

- **Service** is the biggest kind on Paths (11,556 pieces), most of them driveways and parking aisles. Ride can match one when you cut through a lot.
- **Other** is mostly transit platforms, which Ride could match by mistake.
- **Steps** are drawn but can't be clicked or ridden, so a walking route over stairs can't use them yet.
- Offering an OSM path when you connect a gap is still to do (#69).
