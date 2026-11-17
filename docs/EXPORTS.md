# Exports

What you can get out of Block Party, and what each column means. Everything here comes from the city's open data (through sf-blocks), the census, OpenStreetMap, or what you did in the app.

## Ways out

| Where | What you get |
|---|---|
| **Copy / Save → Copy:** CSV or JSON | One row per street, intersection and piece in the selection (gap rows too, for a route), plus any blocks you picked with Select blocks |
| **Copy / Save → Copy link** | A link that opens this selection (see the README's link format) |
| **Copy / Save → Download** (CSV or GeoJSON) | Pick one or more: streets and intersections, businesses along them, parcels along them, census blocks along them, assessor blocks, picked blocks. With more than one, a `kind` column says which is which |
| **Copy / Save → Save to** | Google Sheets (see [Routes](ROUTES.md) for the Routes tab). Airtable once it's set up |
| A card's **Copy** | That card's details as text |
| A card's file rows: **Copy list** / **CSV** | The rows of one of your files near that street |
| Nearby | Its matches as CSV (one row per match), JSON or GeoJSON |

CSV and JSON have the same columns. GeoJSON puts the shape in the geometry and the columns in the properties.

## Streets and intersections

One row per street (CNN segment). Intersections have the same columns, with blanks where a column doesn't apply. For an intersection:
- `streetname` is the first street;
- `from_street` lists the others, joined by `&`.

**Which street**

| Column | Meaning |
|---|---|
| `kind`, `type` | `street`, `intersection`, `piece` or `gap` |
| `cnn` | The city's id for the street block or intersection |
| `streetname`, `from_street`, `to_street` | The street and the cross streets at its ends |
| `lf_fadd`, `lf_toadd`, `rt_fadd`, `rt_toadd` | Address ranges on the left and right sides, from the street file |
| `odd_side`, `even_side` | Which side of the street (north, east…) the odd and even addresses are on |
| `divided_side` | For a divided street, which half this is |
| `layer`, `active`, `accepted` | From the street file: STREETS / PAPER / PSEUDO…, still in use, accepted for city maintenance |
| `road_class` | Residential, arterial, freeway, alley… |
| `oneway`, `oneway_direction` | One-way (`F`, `T` or `B` for both ways) and which way it runs |
| `dead_end` | `both ends`, or the cross street at the dead end |
| `length_ft` | Length in feet |

**Hills**

| Column | Meaning |
|---|---|
| `elev_from_ft`, `elev_to_ft` | Elevation at each end, in feet |
| `slope_pct`, `steepest_pct` | Average slope and steepest stretch, in percent |
| `profile_ft` | Elevation at 0, 25, 50, 75 and 100% along the street |

**Areas** (when a street is on a border, both names, most-covered first, joined by `;`)

| Column | Meaning |
|---|---|
| `supervisor_district`, `supervisor` | District number and its supervisor |
| `assembly_district`, `state_senate_district`, `us_house_district`, `bart_district` | Other elected districts |
| `community_benefit_district`, `cultural_district`, `historic_district` | Special districts it's in |
| `zip_code` | ZIP |
| `nhood` | DPW's neighborhood, from the street file |
| `analysis_neighborhood` | The city's Analysis Neighborhood, from the street file |
| `hood_analysis`, `hood_sffind`, `hood_planning`, `hood_realtor`, `hood_wof` | Neighborhood in each boundary set: Analysis, SF Find, Planning, Realtor, Who's on First |
| `planning_neighborhood` | The Planning neighborhood used for neighborhood groups |
| `neighborhood_groups` | How many SF Planning neighborhood groups cover it |

**Along the street**

| Column | Meaning |
|---|---|
| `muni_routes` | Muni routes running along it |
| `bike_facility` | Bike lane type and barrier |
| `slow_street` | Slow Street, if it is one |
| `next_to` | City land and places right next to it (parks, schools…) |
| `lots`, `homes` | Parcels counted along it, and their housing units |
| `land_use_2023` | Land use of those lots, with counts |
| `zoning` | Zoning of those lots, with counts |
| `street_trees`, `street_tree_kinds` | Street trees on it, and the kinds with counts |
| `businesses`, `business_addresses` | Registered businesses along it, and how many addresses they're at |

**People**

| Column | Meaning |
|---|---|
| `census_block`, `census_tract` | 2020 census blocks and tracts it touches |
| `census_people_est`, `census_homes_est` | People and homes along this street, estimated from the census blocks on either side |
| `census_within_block_people`, `census_within_block_homes`, `census_within_block_blocks` | The same for the whole census blocks it touches: totals, and their ids |

**Links and shape**

| Column | Meaning |
|---|---|
| `wkt` | The line, as WKT (lon lat) |
| `polyline` | The line as an encoded polyline at 6 digits (lat, lon). In a route it runs in the route's direction |
| `link` | A Block Party link to this street |
| `street_view` | Google Street View at the middle of the street, looking along it |

**Routes and rides**

| Column | Meaning |
|---|---|
| `route_source` | `picked` or `ride`; for pieces `trace`, `bike`, `osm`, `hand` or `file` |
| `note` | A ride note on this street |
| `ride_at`, `ride_seconds`, `ride_kmh`, `ride_rise_ft`, `thumbs_up`, `thumbs_down` | When you rode it, how long it took, speed, climb, and marks |

## Pieces and gaps

Routes also have rows for the parts that aren't city streets (see [Routes](ROUTES.md)).

| Row | Extra columns |
|---|---|
| `piece` | `piece_kind` (ride, bike, osm, connector, line), `piece_source` (the file or layer it came from), `osm_id`, `from_corner` / `to_corner` (when an end is at a street corner), plus length, elevation, slope, `wkt` and `polyline` |
| `gap` | `gap_from_corner`, `gap_to_corner`, `length_ft`, and a straight `wkt` line; `from_street` / `to_street` say which street and corner it leaves and reaches |

## Businesses along them

From the city's Registered Business Locations, for businesses at addresses along the streets. A public registry: it shows on cards and in exports, never as map labels.

`address`, `business`, `owner`, `category`, `industry`, `naics`, `since`, `license`, `mailing_address`, `not_storefront` (an owner that isn't a shop, from sf-blocks' reviewed list), `lon`, `lat`, `cnns` (the streets it's along).

## Parcels along them

`mapblklot` (the assessor's block and lot), `address`, `land_use`, `zoning`, `zoning_district`, `homes` (housing units), `cnns`. The shape is the lot outline.

## Census blocks along them

`census_block`, `people_2020`, `homes_2020`, `cnns`. The shape is the block outline.

## Picked blocks (Select blocks)

One row per assessor block, census block, tract or parcel you picked:
- `kind`, `id`, `name`, `address` (parcels), `acres`;
- `streets_around`, `cnns_around`;
- `people_2020`, `homes_2020`, `lots`, `homes`;
- `zoning`, `land_use_2023`;
- `businesses`, `street_trees`.

## Words

- A **street** is one CNN segment, corner to corner.
- A **block** is only an assessor block or a census block (or tract).
