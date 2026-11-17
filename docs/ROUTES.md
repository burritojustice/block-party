# Routes

How routes work in Block Party so far (v99). A route is an ordered selection: streets and other pieces, in the order you travel them, with the gaps between them measured and shown. Plans and open work: #70 (tracking), #81 (routes as their own layer / panel).

## Selection vs. route

- A **selection** is the streets you've picked, in any order.
- Turning on **Route** (`#route-on`, link `route=1`) makes it a route. Only routes get:
  - an **order**: cards are numbered, and links and exports follow it;
  - **gaps** between parts that don't meet;
  - a **length**: the parts plus the gaps.
- Start over clears the route. Ride turns Route on by itself.

## What a route is made of

Streets are city CNN segments. Everything else is a **piece**: a part with no CNN, kept in the same list with a negative id.

| Piece | Where it comes from |
|---|---|
| `ride` | A stretch of a ride that ran along no street or path |
| `bike` | An SFMTA bike line with no CNN, or one far (more than 15 m) from its CNN's street: clicked on the map, or ridden |
| `osm` | An OpenStreetMap path: clicked on the map, or ridden. See [OSM](OSM.md) |
| `connector` | A straight line closing a gap, from **Connect** |
| `line` | A line from one of your files with no CNNs, clicked on its card |

A piece's ends snap to a street corner within 12 m. A ride stretch can reach 40 m, with the line drawn on to the corner. A piece end within 12 m of a picked street's end counts as joined.

## Gaps and connectors

- Picked streets are grouped by shared corners. The shortest hops between loose ends then join the groups one at a time, up to 150 m (`GAP_MAX_M`). Each hop is a **gap**.
- Gaps are drawn as dashed lines with their length, and are counted in the summary line.
- Each gap has a **Connect** button that turns it into a `connector` piece. **Connect all** does them shortest first, measuring again after each.

## Show source

How each part got there, set in the Route panel:

- **None**, **By color**, **By pattern**, or **Color & pattern**.
- The default is Color & pattern when the route has more than one source, None otherwise.
- A white line under each part keeps colors from clashing with the map.

| Source | Color | Pattern (how it was matched) |
|---|---|---|
| Picked street | yellow | solid (by CNN) |
| Ridden street | blue | solid (by CNN) |
| Ride stretch off the grid (`ride` piece) | blue | dots (GPS) |
| Bike line | green | long dashes (by id) |
| OSM path | teal | long dashes (by id) |
| Connector | purple | short dashes (by hand) |
| Line from your file | orange | short dashes |

Streets are always drawn solid; only pieces get a pattern.

The same styles apply to a saved route opened from a file. Exports carry the source as `route_source`.

## Ride

**Ride** (its own button on phones) follows you as you go:
- it uses high-accuracy GPS and keeps the screen awake;
- on phones it goes full screen.

**Reading GPS:**
- Readings worse than 35 m, or less than 4 m from the last one, are dropped.
- Points are checked every 8 m back to the last reading (up to 120 m), so fast stretches still count.

**Matching:** each point goes to the nearest line within 15 m whose direction is within 35° (either way). The candidates are:
- **city streets**, except freeways and ramps (class 1 and 6);
- **bike lines**, preferred by 2 m:
  - a bike line close to its CNN's street credits that street;
  - a far one, or one with no CNN, becomes a `bike` piece;
- **OSM paths**, which lose ties by 1 m. A path is added as an `osm` piece only if you rode at least 20 m of it.

**Coverage:** a street or path is added once half of it has been covered (40% for streets under 60 m). The part covered so far on the street you're on is drawn as you go.

**Off the grid:** readings that match nothing become a `ride` piece once you've gone 40 m away from every street.

**During the ride:**
- A bar shows time, distance, speed, climb and an elevation profile. Time leaves out pauses and gaps of more than 30 s.
- Big 👍 / 👎 buttons and notes are saved with the time, lat/lon and CNN. They show as dots and flags.
- Panning stops "follow me". A pill and the ◎ button bring it back.

**Stopping:**
- **Stop** leaves a done bar with a suggested name (first and last streets) and save buttons.
- A ride in progress is kept in the browser. On reload it offers to carry on, within 6 hours.

**Replays:**
- A GPX or CSV file with 10 or more timed points offers **Replay it as a ride**, which plays the readings without GPS.
- Sample rides are in `tests/rides/` (the Hairball east and south, Page St to Golden Gate Park).

## Saving

**Google Sheets** (Save to → new project, add to the last one): a project is one spreadsheet.
- **Routes tab:** one row per saved route.
  - `route`, `kind`, `streets`, `intersections`, `gaps`, `length_km`, `saved`;
  - `tab`, `tab_id`, `tab_link` (to the route's own tab), `block_party_link`, `made_with`, `pieces`;
  - `route_polyline`: the whole route as one line;
  - for rides, `ride_time`, `ride_km`, `avg_kmh`, `climb_ft`, `descent_ft`, `thumbs_up`, `thumbs_down`, `notes` and `marks_tab_link`.
- **One tab per route:** one row per part in route order, with gap rows after the street they leave from.
  - Each row has its own `polyline`, turned to run end to end.
  - Ride rows also have `ride_at`, `ride_seconds`, `ride_kmh`, `ride_rise_ft`, the thumbs and the note.
- **A marks tab** for each ride: every 👍, 👎 and note.

**Polylines** use Google's encoded polyline at 6 digits ("polyline6", about 0.1 m), lat then lon, as Valhalla and OSRM do. Decoding at the usual 5 digits puts the points 10× off. Decoding notes: <https://github.com/valhalla/valhalla/blob/master/docs/docs/api/decoding.md>.

**Other ways out:**
- **Copy / downloads** (CSV, JSON, GeoJSON) have the same rows.
- **Airtable** saving is built but off until a table is set up (`CONFIG.AIRTABLE_SAVE`).

## Links

A route link keeps its order in `cnn=`:

| Part | Meaning |
|---|---|
| `cnn=123,p0,x:45-67,…` | A CNN is a street, `p0`, `p1`… are pieces, and `x:<a>-<b>` is a straight connector between two numbered corners |
| `pc6=` | The pieces' lines as `kind!name!polyline6`, separated by `;`. Older links (v91–v93) have `pc=` at 5 digits |
| `rs=` | Which streets came from a ride, so Show source can mark them |
| `route=1` | Treat it as a route |

## Opening a saved route

Open a route's tab, CSV or JSON from Sheets, Drive or a file, and Block Party offers **Open it as your route**. That rebuilds it:
- streets by CNN, pieces from their polylines;
- sources from `route_source`;
- order from the rows.

A CSV with no order column is still recognized as a route when its rows join end to end.

## Still to do

| Issue | What |
|---|---|
| #81 | Routes and saved routes as their own layer / panel, apart from picking streets |
| #75 | What Start over, Clear selection and Reset the map do with routes and layers; typing a street adds it |
| #67 | Route ids in links, and Airtable route records |
| #68 | Drawn lines, and a Connect tool that follows streets instead of a straight line |
| #69 | Offer an OSM path when connecting a gap |
| #63 | Better bike lane lines, where SFMTA's don't follow the street |
