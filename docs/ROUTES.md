# Routes

How routes work in Block Party so far (v103). A route is an ordered selection: streets and other pieces, in the order you travel them, with the gaps between them measured and shown. Plans and open work: #70 (tracking), #81 (routes as their own layer / panel).

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
| OSM path | brown | dash-dot, like a trail |
| Connector | purple | short dashes (by hand) |
| Line from your file | orange | short dashes |

Streets are always drawn solid; only pieces get a pattern.

The same styles apply to a saved route opened from a file. Exports carry the source as `route_source`.

The Route panel shows a key under Show source, like the map key's: each source, how many parts and how far. On the map:
- each piece is labelled along its line in its source's color ("SFMTA bike path", "OSM · Page Street", "GPS stretch");
- hovering a piece shows its source, name, cross streets and length;
- each **Connect** button says what it joins ("OSM · Footpath → Ridden street").

**Focus → Route / ride** lets only the route's parts take clicks and hovers, so you can look around without changing it.

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
- The bar says what you're on, in a colored chip: City street; Bike lane, bike route or separated bikeway, when an SFMTA line along a street matched; SFMTA bike path, for one with no street; or OSM footpath, alley or service road.
- A bar shows time, distance, speed, climb and an elevation profile. Time leaves out pauses and gaps of more than 30 s.
- Big 👍 / 👎 buttons and notes are saved with the time, lat/lon and CNN. They show as dots and flags.
- Panning stops "follow me". A pill and the ◎ button bring it back.

**Stopping:**
- **Stop** leaves a done bar with a suggested name (first and last streets) and save buttons.
- **Close** hides the bar and clears the ride's line from the map. The ride stays in the browser for a day, so it can still be saved.
- A ride in progress is kept in the browser. On reload it offers to carry on, within 6 hours.

**Replays:**
- A GPX or CSV file with 10 or more timed points offers **Replay it as a ride**, which plays the readings without GPS.
- Sample rides are in `tests/rides/` (the Hairball east and south, Page St to Golden Gate Park).

## Saving

**Google Sheets** (Save to → new project, add to the last one): a project is one spreadsheet with a **Routes** tab, one row per saved route or ride.

Every row has:
- `route`, `kind` (ride, route or selection), `streets`, `intersections`, `gaps`, `pieces`, `length_km`, `saved`, `made_with`;
- `block_party_link`: opens the route again (every street and piece, in order);
- `route_polyline`: the matched route as one line;
- `route_id`, which **Update** uses to find the row again.

**A ride is just its row** (from v103; earlier rides also made a route tab and marks and trace tabs):
- `ride_time`, `ride_km`, `avg_kmh`, `climb_ft`, `descent_ft`, `thumbs_up`, `thumbs_down`, `notes`;
- `marks`: every 👍, 👎 and note as JSON, `[time, lat, lon, kind, text, cnn]` each;
- `trace_start` and `trace_polyline`: the GPS trace (below). Rides over about 3 hours carry on into `trace_polyline_2` and `trace_polyline_3`.

**A selection or a drawn route** also gets a tab of its own, linked from `tab_link`: one row per street in route order, with gap rows after the street they leave from. Each row has its own `polyline`, turned to run end to end.

**The GPS trace.** While you ride, each reading is kept on your phone: lat, lon, time, accuracy and elevation, skipping readings under 4 m apart. That's what draws the dotted line, and it survives a reload. Saved, it's a polyline:
- Google's encoded polyline at 6 digits, lat then lon, with the seconds since `trace_start` as a third value for each point. Each value is a difference from the one before.
- About 4.5 characters a reading: 30 minutes is ~8 KB, an 82-minute ride ~22 KB, 3 hours ~49 KB. A Google Sheets cell holds 50,000 characters, so the trace is cut at whole points every 49,000.
- In exports, each ridden street also has `gps_polyline`: the readings taken while on it (lat, lon only).

**Polylines** use Google's encoded polyline at 6 digits ("polyline6", about 0.1 m), lat then lon, as Valhalla and OSRM do. Decoding at the usual 5 digits puts the points 10× off. Decoding notes: <https://github.com/valhalla/valhalla/blob/master/docs/docs/api/decoding.md>.

**Saving again:** once a route is saved, or opened from a project sheet, Copy / Save and the Ride bar offer **Update**.
- It writes that route's row on Routes again (and its tab, if it has one).
- So you can save a ride on the phone, then connect its gaps later on a computer and update it.
- When the computer has no ride of its own, the row keeps its ride columns (trace, marks, totals).
- A ride's trace and marks go with a save only while some of the ride's streets are still selected. A save with nothing selected saves nothing.

**Other ways out:**
- **Copy / downloads** (CSV, JSON, GeoJSON) have the same rows as a route tab, plus `gps_polyline` on ridden streets.
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

**From the project sheet:** pick the sheet in Google Drive (Import / show layers → Google Drive). The picker lists its saved routes and rides, newest first, above its tabs. Opening one:
- brings back its streets and pieces from `block_party_link`;
- draws its trace (dotted blue) and its 👍 / 👎 / notes under the route;
- makes Save → Update write that row again.

**From a file or a tab:**

Open a route's tab, CSV or JSON from Sheets, Drive or a file, and Block Party offers **Open it as your route**. That rebuilds it:
- streets by CNN, pieces from their polylines;
- sources from `route_source`;
- order from the rows.

A CSV with no order column is still recognized as a route when its rows join end to end.

When you open a route:
- The file's own drawing is turned off, so it doesn't cover the route. Its box in the map key brings it back.
- If the route came from a project sheet that has its trace and marks tabs, the trace is drawn dotted blue under the route, with the 👍 / 👎 / notes.
- The trace stays until Start over or another ride.

## Still to do

| Issue | What |
|---|---|
| #81 | Routes and saved routes as their own layer / panel, apart from picking streets |
| #75 | What Start over, Clear selection and Reset the map do with routes and layers; typing a street adds it |
| #67 | Route ids in links, and Airtable route records |
| #68 | Drawn lines, and a Connect tool that follows streets instead of a straight line |
| #69 | Offer an OSM path when connecting a gap |
| #63 | Better bike lane lines, where SFMTA's don't follow the street |
| #86 | Ride marks: emoji on the map, smileys, car and missing-post buttons, direction |
| #87 | Ride matching: check against the GPS trace, offer alternatives, ride a street twice |
