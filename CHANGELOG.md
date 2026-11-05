# Changelog

All changes are in `index.html` unless noted. `data/streets.json` and `scripts/build_data.py` are unchanged since v1.

## v53

- **Your files:** drop a CSV or GeoJSON anywhere on the page, or use "Add a CSV or GeoJSON…" at the top of Layers, and it shows as a layer in its own color. A CSV can locate rows by latitude/longitude columns, a WKT or "(lat, lon)" column, or a CNN column (one or more CNNs per row, drawn as those blocks). Hover for a row's name and a few fields; click a point or line for the whole row. Each file has Off/On and × in Layers and a line in the map key. Cards get a row per file listing what's within 50 m of the block, nearest first ("on the block" for its CNN or a polygon around it), and Copy includes them. Files stay in the tab: nothing is uploaded, and they're gone on reload.
- **3D on or off (Layers › Basemap):** On is the default (tilt, terrain, 3D buildings). Off makes a flat map for older devices: no tilting, no terrain loaded, and the 3D button becomes Contours. Saved in the browser. This replaces v52's "Only when tilted", which jumped when tilting.
- **Basemap addresses:** the basemap's house numbers have their own checkbox. Unchecking Buildings unchecks them too; check Addresses again to keep them for cross-referencing.

## v52

- **Businesses at the same spot:** the city puts many addresses on one point: 1601 Church (Sun Valley Market) and 1603 Church, every suite in an office building, mailbox stores like 548 Market. About half of all business addresses shared a point with another, so one dot hid the others and a click picked one at random. sf-blocks #17 stacks them into one dot (its size and color cover all of them, labelled with the first storefront); hovering and clicking list every address there ("1601 Church St & 1603 Church St · 7 businesses"), storefronts first, and cards still list each business under its own address. Before #17 is merged, hover and click already gather the dots drawn at the same spot.
- Parcel and card text say "1 home", not "1 homes".
- **Parcel hover shows the lot's street addresses** from the parcels file ("301–401 Van Ness Ave", or one number), with the lot number under it.
- **Map key:** the size-and-color note under Businesses wraps instead of widening the key, and Businesses and Street trees show the month of their data ("Data from Nov 2026").
- **Terrain in 3D (Layers › Basemap):** "Always" (as before) or "Only when tilted", which turns terrain off looking straight down and raises it over the first 20° of tilt so nothing jumps. Saved in the browser, to try out.

## v51
Includes v48–v50 (#15–#17). The business colors and records need sf-blocks #15.

- **Boundary streets show both districts.** A block was checked at three points on its centerline; when a district line runs down the middle of the street those can all land on one side. Now each point is also checked 12 m to either side, so Waller St (Shrader–Stanyan) shows Supervisor D5 | D8, Guerrero (16th–Camp) D9 | D8, Ocean Ave (Granada–Miramar) D11 | D7, 19th Ave (Taraval–Ulloa) D7 | D4. The same goes for Assembly, Senate, House, BART and special districts. 778 of 17,176 blocks are on a supervisor border.
- **Shorter card rows:** Elected districts shows the Supervisor chip, with the others folded; Zoning shows the codes ("NCT (22), NCT|RTO-M (1)"), with the names folded.
- **Land use "Vacant (unverified)":** the 2023 land use marks some lots vacant that aren't, so treat it with caution.
- **Businesses in four colors:** food & drink, retail, services (hair, nails, repair, laundry…) and everything else, from each business's industry code (sf-blocks #15). Chips and the map key have all four. Landlords registering rentals are hidden with the other non-storefronts until "Show all registrations".
- **Click a tree or a business** for its full record: a tree's species, trunk, status, planted date, site, caretaker, address and CNN; every business at an address with its owner, mailing address (with city and ZIP), license, industry, and start date. Clicking a point no longer picks the block under it.
- **Opening a card's tree or business list rings them on the map** (in yellow, with a dot when the layer is off); closing the list clears them.
- **Layers ▾ → Basemap:** checkboxes for the basemap's places (shops, restaurants, landmarks) and buildings, remembered in this browser.
- **Map key:** City-owned land opens to list its categories, like Land use, Street trees and Businesses.
- **"Quiet streets" is now "Filter"**, for more kinds of filters to come.

## v50
Includes v48 (#15) and v49 (#16).

- **Shorter cards:** rows are one line with a count or summary, and a ▸ to open the details:
  - **Census estimates** and **Within a block** show just "180 people, 70 homes"; the note and the tables of census blocks are folded underneath (the i button is gone; its table is in the fold).
  - **Street trees** show "38 (12 kinds)"; the kinds and their counts are folded.
  - **Next to** shows how many places when there are several.
  - Open folds stay open when the card redraws. The label column is narrower, so values wrap less.
- **Layers ▾ is shorter:** the chips for city-owned land, street trees and businesses fold under a line with counts ("11 of 11 kinds · 138,778 trees", "2 of 2 kinds · 100,913 at 69,727 addresses"); the Off / Close up / Always pills stay in view.
- **Map key:** Street trees and Businesses open like Land use, with each genus or color and how many there are, and what the dot size means.

## v49
Includes v48 (#15).

- **One drawing order**, bottom to top: the basemap and satellite; shading (population density, shaded districts, land use, city-owned land, building footprints); edges (contours, curbs, lot lines, district and census borders); the Muni band, the street lines, and bike lanes and Slow Streets on them; points (trees, businesses, schools, stations, clinics); your selection (the street, previews, cross streets, chosen blocks, corners); 3D buildings; and every label on top.
- **Street names above everything else:** the basemap's street and place names used to sit under the density colors, shaded districts, bike lanes and the selection on the map style. Now all labels (street names, business names, Muni route numbers, district names, your blocks' labels) are above the Muni band and bike lanes, on both Map and Satellite.
- **Your chosen blocks above trees and businesses**, so a row of trees doesn't hide the block.
- **Layers ▾ in sections:** Getting around (Muni, bike, Slow Streets), On the street (trees, businesses, schools, fire and police, hospitals and clinics), Land and buildings (parcels, city-owned land, buildings, curbs), Terrain (contours).

## v48
Business names on the map need sf-blocks #15; until then the dots show without names.

- **Hover order:** corners, then points (schools, stations, clinics, trees, businesses), then buildings, then parcels and city-owned land, then street blocks. A tree or business on a parcel or building now shows its own popup; the shapes under it no longer take over. Popups no longer close when they open under the pointer (near the map's edges, or on small dots).
- **Buildings rise as you tilt:** they start to stand up as soon as the map tilts and reach full height at 45°, in six steps, and they're much more see-through (40%).
- **Census estimates** note: "2020 census, extrapolated from edges of blocks along street".
- **Within a block:** a new card row with everyone in the census blocks touching either end of the block, in full: in a plain grid, the two along the block and two more at each corner (six). "About 1,620 people and 800 homes", the neighbors who could see a block party and walk over. The i table lists those blocks too, and exports get `census_within_block_people`, `census_within_block_homes` and `census_within_block_blocks`.
- **Business names** under the dots from zoom 18 (a person's own name is left off the map).
- **Zoom level** under the zoom buttons ("z16.4").

## v47
- **Curbs on by default** from zoom 15 (Always: from 13), in a lighter grey so they don't compete with the streets.
- **Buildings stand up when the map tilts** (3D, or tilting past the label angle): each footprint rises to its median roof height from the 2010 LiDAR, and lies flat again when you tilt back.
- **Building height** on hover in feet and metres ("about 39 ft (12 m) tall"), with the data's years.

## v46
Needs sf-blocks #14 (map layers in `data/tiles/`); until it's merged these layers and rows don't appear.

- **Four new layers** in Layers ▾, read live from sf-blocks' tiles, off at first:
  - **Street trees** (DPW inventory, current): a dot per tree, sized by trunk diameter, colored by genus (the ten most common, plus Other), with a dark ring for Significant Trees. Chips turn genera on and off. Close up from zoom 15; Always shows a thinned overview from zoom 10. Hover: common and Latin name, trunk, year planted.
  - **Businesses** (Active Business Locations, current): one dot per address, sized and numbered by how many businesses are there, raspberry for food & drink and violet for everything else (chips for each). Contractors at client sites, parking operators, antennas, ATMs and landlords (sf-blocks' reviewed list) are hidden unless **Show all registrations** is checked. Hover: the address and its first few businesses.
  - **Curbs and islands** (2016), from zoom 15 (Always: 13).
  - **Buildings** (2016 footprints), from zoom 15. Hover: height in metres and feet (2010 LiDAR).
- **Street trees** on cards: "38 (15 Brisbane Box, 12 Sycamore, London Plane, 11 California Sycamore)", the trees the inventory lists for this block's CNN.
- **Businesses facing this block** on cards: how many, at how many addresses, and how many aren't shown (and of what kinds). Open it for each address and its businesses, with the owner when it's different. **Copy list** copies a tab-separated table (address, business, owner, mailing address, license, since) for a spreadsheet or mail merge; the mailing address is the business's own unless the registry gives another. Businesses count when their address is on this street and inside the block's address range.
- Copied card text and CSV/JSON exports get `street_trees`, `street_tree_kinds`, `businesses` and `business_addresses`.

## v45
- **Census estimates** (was "Population"): "2020 Census, extrapolated from the edges of census blocks on both sides of this street". A circled **i** opens how it's worked out: each census block used, how much of its edge this block makes up (in feet), its full people and homes and the share given to this street, with totals for both, and a link to the Census Bureau's statistical safeguards (block counts have noise added for privacy).
- **Homes on the facing lots** is its own card row: "16 (SF Planning, 2023)". Parcels now just counts the lots. Copied text follows.
- **Muni route numbers** from zoom 16 again (the bands still start at 15). The checkbox is now in the Muni row of the map key: "Muni routes, [14] numbers". Zoomed out, it's unchecked and greyed until the numbers can show.
- **One-way** is in the map key only once the arrows are on the map (zoom 16).

## v44
- **Density in Magma, flipped:** more people is darker, so the lightest class (a pale yellow) sits next to the clear blocks where no one lives instead of jumping out. Viridis and the others are still in the Colors menu, and Flip turns it back.
- **Hide parks and places on the map:** a checkbox under Density, on by default. While density shows, the basemap's colored land (parks, schools, hospitals) and its places (shops, theatres) are hidden. Piers, runways and plazas stay.
- **Muni:** the route bands show a zoom sooner (15) in Close up, and the route numbers a zoom later (17). A **Route numbers** checkbox in the map key, under Muni routes, hides them; it's remembered in this browser.

## v43
Uses the density breaks in sf-blocks #12; until it's merged the same breaks are built in.

- **Density reads more clearly:** the census borders no longer have a white casing (block edges run down the middle of streets, so they looked like doubled roads). The bay and lakes draw over the colors, and blocks where no one lives (parks, water) are left clear instead of the darkest color. The colors are a little stronger (60%).
- **Same scale as Joiner:** 7 classes, each break double the last (5k, 10k, 20k, 40k, 80k, 160k people per sq mi: a log scale), read from sf-blocks, so the Mission and the Tenderloin no longer share a color.
- **Population settings** in Areas ▾, under Density: **Colors**, a menu of the Viridis family (Viridis, Magma, Inferno, Plasma, Cividis, Mako, Rocket, Turbo), and **Flip** to run them the other way; **Borders**: Black · Grey · White and None · Thin · Thick, wider as you zoom in (None only with Density). All of them go in the link.
- **Parcels: Borders**, lot lines without the land use colors. While population density shows, Land use and Zoning turn to lot lines too, over the density colors (hovering a lot still names its use).
- **Map buttons:** black when on or open, white when off. 3D and Quiet streets are no longer yellow; yellow is for what you pick on the map.

## v42
Needs sf-blocks #11 (census blocks, and population on the tracts) merged first; until then the Population row and card line don't appear.

- **Population on the Areas menu:** under Administrative, Population (2020 Census): Blocks or Tracts, Off · Borders · Density. Off at first. Density colors every block or tract by people per square mile in Viridis (under 5k to 120k+), with the scale in the map key. It counts as the one shaded set: shading another set turns it back to borders, and the other way round.
- **Population on cards:** "About 75 people and 25 homes" for each block: the census blocks on both sides of the street, each counted by the share of its outline the block runs along. Rounded, and marked as an estimate. Exports get `census_people_est`, `census_homes_est`, and `census_block` / `census_tract` listing the blocks and tracts on both sides.
- **Smaller special-district chips:** one line each, a little smaller; a long name ends in "…" with the full name on hover.
- **One-way arrows** start a zoom level later (16).

## v41
Includes v40 (#6).

- **Areas ▾ menu**, next to Layers, in three groups:
  - **Elected districts:** Supervisor, State Assembly, State Senate, US House and BART board, each Off, Borders or Shade. Supervisor borders are on at first. Borders carry both districts' names, one on each side of the line (D8 above, D9 below), so you can read which side is which.
  - **Special districts (not elected):** Community Benefit, Cultural and Historic Districts. One shows at a time (Off · CBD · Cultural · Historic), as Borders or Shade, with names inside.
  - **Administrative:** ZIP codes, neighborhoods and census tracts stay on the cards; map layers later.
- **Shade** tints only the area your checked blocks are in; the rest of that set shows as borders. One set is shaded at a time: shading another turns the first back to borders.
- **Cards** list every set, whatever the map shows: "Elected districts" chips (Supervisor D8 · Mandelman, Assembly 17, State Senate 11, US House CA-11, BART District 9; a block on a border gets "D8 | D9"), "Special districts" chips (names shortened, the full name on hover), then ZIP code and neighborhood under "Administrative". The copied text and the CSV/JSON exports have every set, in full: `supervisor`, `assembly_district`, `state_senate_district`, `us_house_district`, `bart_district`, `community_benefit_district`, `cultural_district`, `historic_district`.
- The map key lists each set that's on. Area settings go in the link (`&areas=special:cbd,asm:borders`).
- Replaces v39's one-set `AREA_LAYERS` (the Community Benefit Districts row in Layers is now under Areas). Backup copies include all eight sets.

## v40
- **Links with blocks (`#cnn=…`) show all of them:** the map fits the blocks before the terrain under them has loaded, and on hills that left them zoomed in too far, running off screen. Once the terrain is in, the map now measures again and zooms out just enough (moving the map yourself first cancels it).
- **New sf-blocks data shows up on the next load:** GitHub Pages lets browsers keep files for 10 minutes, so a new boundary set could take that long to appear. `region.json` and `VERSION` are now checked with the server every time, and every other sf-blocks file is asked for with the version in its address (`…?v=2026.10.30`).
- **Community Benefit Districts in place of Historic Districts** in `AREA_LAYERS` (from `area-test`): a Layers menu row, map key line, card row and export column for sf-blocks' `community_benefit_district` set. The backup copies are now sf-blocks 2026.10.30 and include it.
- **Favicon:** block-c, a chosen block between two cross streets with a flag on it.
- The Refresh sf-blocks copies Action uses `actions/checkout@v5` (Node 24).

## v39
Includes v38 (#3): merging this brings both to `main`.

- **Cross streets can be turned off:** "Cross streets" in the map key is now a checkbox. Unticked, the cyan cross streets and their names hide once a block is checked; while you're still choosing they always show. Remembered in this browser.
- **Area layers from sf-blocks:** `AREA_LAYERS` (next to the `Areas` module) lists boundary sets in sf-blocks by id. Each one sf-blocks has gets a Layers menu row (off at first), a map key line, a card row when the block or corner is inside one ("Historic district: …", checked at 25/50/75% along the block), and a column in the CSV/JSON exports. Historic Districts is listed and appears once sf-blocks has `historic_districts`. Adding another set is one line.
- **Favicon:** a chosen block (pink, with the yellow glow) between two corners, with its cross streets, on the ink tile; plus 32 px and Apple touch icons.
- **Backup copies:** `copy_sf_blocks.py` takes wildcards in `data/sf-blocks.json`, and also copies `data/boundaries/index.json` (needed for area layers offline). The new **Refresh sf-blocks copies** Action opens a PR each Monday when sf-blocks changed (needs Actions allowed to create pull requests in Settings → Actions → General).

## v38
Builds on v37 (#1): merge that first.

- **"Apply for a Block Party" is off here:** `CONFIG.APPLY.show` turns the button on, for a copy run by a block party fund (civic-joy-fund's). `?apply=1` shows it anyway, for testing.
- **Where it goes:** `CONFIG.APPLY.url` is the application form, opened in a new tab with the checked blocks filled in: CNNs, street, cross streets, district, ZIP, neighborhood and a Block Party link, as set in `CONFIG.APPLY.params` (Airtable's `prefill_<Field name>` style; the field names are placeholders until the form exists). With no URL, the button shows "Applications open soon" as before.

## v37
Block Party moves to burritojustice and reads its data from sf-blocks.

- **Data from sf-blocks, live:** streets, map layers, boundaries, parcels and the neighborhood groups list load from https://burritojustice.github.io/sf-blocks/, using the paths in its `region.json`. If the site can't be reached (or a file is missing there), the page uses the copies in this repo, which are sf-blocks 2026.10.27 (`data/sf-blocks.json`). Hovering the title shows the version and whether it's live. `?sfblocks=local` forces the copies.
- **One list of aliases:** `build_neighborhood_groups.py` is now sf-blocks' copy and reads `data/aliases.json`, so "South Bayshore" and the rest are kept in one place for every app.
- **Files moved to match sf-blocks:** `layers/` is now `data/uploads/`, and `data/neighborhood_groups.json` is now `reference/neighborhood-groups/neighborhood_groups.json`. `build_layers.py` is sf-blocks' copy; the rebuilt layers are byte-identical.
- **New intro** listing what the cards tell you, the burritojustice avatar in place of the Civic Joy Fund logo, and the burritojustice.github.io Protomaps key.
- `scripts/copy_sf_blocks.py` refreshes the copies from a checkout of sf-blocks.

## v36
- **Pick the neighborhood set:** in the opened Neighborhood list, click a set (Analysis, SF Find, Planning, Realtor, Who's on First, Streets file) to show that one when the list is closed, with the set's name beside it. Analysis stays the default; the choice is remembered in this browser and applies to every card.

## v35
- **Neighborhoods on cards:** one Neighborhood row shows the Analysis neighborhood; click it for every set the block falls in: Analysis, SF Find, Planning, Realtor, Who's on First, and the streets file's own (DPW) neighborhood. A block on a boundary lists both sides. Replaces the separate Neighborhood (which was the streets file's DPW/realtor-style name) and Analysis neighborhood rows. Exports add `hood_analysis`, `hood_sffind`, `hood_planning`, `hood_realtor`, `hood_wof`.
- `data/streets.json` gains those `hood_*` fields (`build_data.py --areas`, from sf-blocks 2026.10.23), from boundary files in the new `data/boundaries/` (copied from civic-joy-fund/joiner). `planning_neighborhoods.geojson` moved there from `data/layers/`. Neighborhood groups use the block's `hood_planning`.
- Lot outlines on checked blocks only show while the Parcels layer is on (Land use or Zoning).

## v34
- **Neighborhood groups** on block and intersection cards: the groups on SF Planning's notification list for the block's Planning Neighborhood, behind a link that expands (organization, contacts, emails), with citywide groups in their own expandable list and a "Copy list" button. A block on a boundary lists both neighborhoods. Data: `data/neighborhood_groups.json`, built by `scripts/build_neighborhood_groups.py` from the copy in the new `reference/neighborhood-groups/` folder (list of September 25, 2026); boundaries `data/boundaries/planning_neighborhoods.geojson` (DataSF `mw29-m2za`, copied from civic-joy-fund/joiner). Exports add `planning_neighborhood` and `neighborhood_groups` (count).
- **Zoning colors are now SF Planning's own**, from the Zoning Map's Zoning Districts layer (`PlanningData/MapServer/3`), matched by zoning code; the map key lists the families with one of their colors each.

## v33
- **Parcels** layer (was "Land use and zoning") is now **Off / Land use / Zoning**. Zoning colors parcels by zoning code family: houses (RH) yellow, apartments (RM, RTO, RC) orange, neighborhood commercial (NC, NCT, NCD) pink, downtown and community business (C-2, C-3, Chinatown) red, industrial (PDR, M) purple, mixed use (UMU, MUG, MUO, MUR, SoMa) orchid, public (P) blue, special plan areas grey. Provisional palette until we have SF Planning's. Links from v32 with `landuse:on` open in Land use.
- Parcel labels from zoom 16: one label per run of same-kind lots on an assessor block (land use name, or zoning code), placed in the middle of the run, so a block of 30 RH-2 houses gets one "RH-2" instead of 30.
- Map key: the land use / zoning row expands (click) into a color table for the current mode.
- Checking a block outlines the lots counted on its card in white (from zoom 15, whether or not the Parcels layer is on). Zoning on the card gets a color swatch.
- Hovering the "Block Party" title shows the build number.

## v32
- **Land use and zoning** layer from `data/Land_Use_with_Active_Parcel_Information.pmtiles` (SF Planning land use 2023 joined to active parcels, DataSF `h5vv-2u24`): parcels tinted by land use with faint outlines, off by default (Off / On in the Layers menu, with a color key), drawn from zoom 15. Hovering a parcel shows its lot, land use, homes, and zoning. Loaded with the PMTiles library (4.5.0), which needs a server with range requests (GitHub Pages; `npx http-server` locally, not `python3 -m http.server`).
- Block cards add **Zoning** (districts with lot counts), **Parcels** (lots and homes), and a **Land use** table, read from the same file for the lots beside the block, whether or not the layer is on. Lots count when they're within 14 m of the middle 70% of the block's centerline, or 25 m when their address is on the block's street; lots are counted once per map block-lot, since condos repeat. Copy-card text and exports add `lots`, `homes`, `land_use_2023`, and `zoning`.

## v31
- Basemap: hides Mission Creek and other creeks OSM tags as rivers (some run underground), ported from Selecter. Streams are hidden, and river lines and waterway labels named "Creek" or "Arroyo" are filtered out. The style's own river/stream filter is kept and added to rather than replaced.

## v30
- **Next to** on block cards: the city-owned land the block runs alongside (Mission Dolores Park, Parks), plus schools, fire and police stations, and health facilities from the point layers within 35 m, which adds private schools and clinics City Lands leaves out. A parcel counts when at least 2 points sampled every ~10 m along the block (ignoring the last 10% at each end) are inside it or within 20 m of its edge, so parcels across a cross street don't count. Intersection cards list what's within 20 m of the corner. Lists every category, whatever the map's checkboxes say. Copy-card text and exports add `next_to`.

## v29
- **City-owned land** layer (DataSF City Lands, `gtnh-hgvs`): parcel polygons with a faint tint and thin outline, under the basemap labels, with Off / Close up / Always. Category checkboxes under it in the Layers menu; Schools, Parks, Fire, Police, Health, and Open space are on by default, and Port, Library, MTA, Public Works, Water and sewer, Housing Authority, Real Estate, Former Redevelopment, and Other can be turned on. Parks get a dashed outline only. Hovering a parcel (away from streets and icons) shows its name, category, department, and address. Links keep non-default categories as `&lands=…`.
- `build_layers.py` builds `data/layers/lands.geojson` (downloaded automatically when missing), keeping name, category, department, and address, and simplifying outlines by 0.5 m.

## v28
- `build_layers.py` downloads any missing dataset from DataSF's API before building (like `build_data.py` does for the street CSVs); `--download` refreshes all of them except schools. CSV columns are read case-insensitively, so API downloads and site Exports both work.
- **Slow Streets** layer (DataSF `hkz3-itiu`): dotted blue line, planned blocks fainter, in the Layers menu with Off / Close up / Always like the others. Blocks on a Slow Street get a "Slow Street" card row and popup line with the corridor; exports add `slow_street`. Intersection cards list it when any block meeting there is on one.
- `build_layers.py` builds `data/layers/slow.geojson` from a "Slow Streets" download in `layers/`, leaving out blocks marked as removed (`slw_st = 0`). Until that file exists, the layer and rows just stay empty.

## v27
- **Dead ends:** an end that touches another street's line (within 1.5 m) counts as open even when the city data has no intersection there. Comerford St now reads "Church St to Sanchez St" and isn't a dead end; Gaiser Ct reads "Guerrero St to dead end". 36 block ends in all, mostly private streets around Stonestown, Sunnyside, and Mission Terrace. Freeways and ramps don't count, since they pass over or under streets. The quiet-streets dead-end count drops from about 1,040 to 1,020.
- Where the city names such an end "START: 1-99 BLOCK" or "END: …", the card, popup, and exports use the street it touches instead.
- Hover popup shows the block's slope and tier ("Slope 22.7% average, steepest 25.9% · Extremely steep"), from the slopes in `streets.json`.
- Bike info on cards and the popup labels the barrier: "Separated bikeway · barrier: curb, posts".
- School, station, and health care icons are about 25% larger; Muni shield numbers one size up.

## v26
- **Muni and bike on cards:** block cards list the Muni routes running along the block, grouped by service type (14, 49 Frequent Local · 14R Rapid Bus …), and the block's bike facility. Intersection cards list the routes through the corner and the bike facilities on the streets meeting there. Shown whether or not the map layers are on; "Checking…" until the files load.
- Hover popup shows each route's service type: "Muni 14, 49 (Frequent Local) · 14R (Rapid Bus) · 714 (Specialized)".
- **Route shields list every route on a block** ("14 · 14R · 49 · 714") instead of one per route line, where overlapping shields hid all but one. Busier blocks win when shields collide.
- Muni routes are matched to blocks in the browser: a route counts when it's within 15 m of the block at 25%, 50%, and 75% along and heading the same way, so routes crossing at a corner don't count. Bike facilities use the CNN already in the bike data.
- The copy-card text and CSV/JSON exports add `muni_routes` and `bike_facility`.
- `data/streets.json` rebuilt from DataSF on 2026-10-11 with slopes (6 new blocks).

## v25
- **Map layers:** Muni routes, bike network, schools, fire and police stations, hospitals and clinics. New **Layers** menu on the map: Off / Close up (zoom 16 and in, the default) / Always for each. Contours moved into the same menu (Off / On). Links keep non-default settings as `&layers=muni:always,contours:on`.
- Muni is a pale orange band with route-number shields; bike lanes dark green (solid for separated bikeways, lanes, and paths; dashed for shared routes); schools, stations, and health care as small icons with names close up. Map key rows appear while a layer shows.
- Hovering a street also lists the Muni routes there and the block's bike facility ("Separated bikeway · parking, posts"). Hovering a school, station, or clinic shows its name and type.
- **Quiet streets** moved from the header onto the map toolbar as a yellow "✦ Quiet streets ▾" button with a match count; its panel drops down over the map. Matches are now magenta (#B5179E) instead of green, which was hard to tell from parks and now the bike lanes.
- New `scripts/build_layers.py` builds `data/layers/*.geojson` from the raw downloads in `layers/`.
- `scripts/build_data.py` updated from sf-blocks 2026.10.11: downloads `data/sf_streets.csv` and `data/sf_intersections.csv` from DataSF when missing (`--download` to refresh), with the dataset pages listed in the script. Dates are stored as YYYY-MM-DD, so a retired block reads "Retired 2013-11-07" whichever way the CSV was downloaded.
- `.gitignore` also covers `.DS_Store`, `__pycache__/`, `*.pyc`, and partial downloads.
- `build_layers.py` lists each layer's DataSF dataset (title, id, URL) and finds downloads by dataset title with DataSF's date stamp, so new downloads don't need renaming. Built files record their source dataset, file, and "as of" date. Map credits DataSF for the layers.

## v24
- Fixed: the map hover popup and the "Blocks leading into it" rows under intersection cards now say "Myra Way to dead end" like the cards do, instead of naming the street itself as the cross street.

## v23
- **One-way streets:** cards show "One-way ↑ northbound, 18th St → 17th St" (from the `oneway` field: F = from street to to street, T = the reverse). Arrows along one-way streets on the map from zoom 15; new "One-way" row in the map key.
- **Dead ends:** a block end with no other drivable street (paper streets and stairs don't count) reads "Church St to dead end", with a green "Dead end" pill.
- **Road class** pill: Residential, Collector, Arterial, Major street, Freeway, Freeway ramp (none for class 0, which already has a private / paper / pedestrian pill).
- **Copying text:** dragging to select text no longer checks or unchecks a card, and clicks in the details, chart, or pills don't toggle it. New ⧉ button copies the whole card as plain text.
- **Find quiet streets** (under the intro): show any of dead ends, pedestrian streets, streets the city doesn't maintain; narrow to residential only (leaves out collectors, arterials, and bigger) and flat to moderate (under 10%). Matches light up green on the map with a count; tap one to add it. Links keep it as `&quiet=dead,res`. Matches stay clickable even when the Options hide minor streets.
- The "flat to moderate" filter only appears when `streets.json` has slopes (`build_data.py --slopes`).
- Exports add `road_class`, `oneway`, `oneway_direction`, and `dead_end` (the cross street at the dead end, or "both ends").
- `scripts/build_data.py` updated from sf-blocks 2026.10.08 (optional `--slopes`).

## v22 (housekeeping)
- The striping diagram map moved to its own repo, [burritojustice/sf-striping](https://github.com/burritojustice/sf-striping) (https://burritojustice.github.io/sf-striping/). Removed `striping/`, its data files, scripts, and workflows from this repo.
- The street data and matching scripts now have a master copy in [burritojustice/sf-blocks](https://github.com/burritojustice/sf-blocks). This repo keeps its own copies (`data/streets.json`, `scripts/build_data.py`, `scripts/match_blocks.py`), marked with the version they came from, so Block Party still stands alone.
- Removed `.github/workflows/` (only the striping jobs used it).

## v21
- **Intersection mode.** The mode switch is now Cross streets / Intersection / Address. Pick a street and a cross street to select the intersection itself (its CNN is the city's intersection CNN). Streets that meet more than once get one card per intersection, tagged by side.
- Intersection cards show the streets that meet there, supervisor district, ZIP, neighborhoods (both values when the corner sits on a boundary), and elevation.
- Blocks leading into a selected intersection appear as compact rows under "Blocks leading into it," with a direction tag; checking one turns it into a full block card.
- Map: selected intersections are pink with a yellow ring and a name/CNN label; unchecked ones are a dashed purple ring; hovering a cross street in the list previews the corner in purple. Every corner is a clickable dot from zoom 16.
- Cross street lists now include every street that meets at an intersection, not just the one named on each block (for example Mullen Ave at Montcalm St).
- `#cnn=` accepts intersection CNNs; `#street=dolores,27th` opens that intersection, picking 27th St or 27th Ave by which one actually meets Dolores.
- CSV/JSON exports add `type` (block or intersection) and `wkt` (LINESTRING or POINT).
- Map key uses the combined layout: Your blocks / intersections, Matches, Preview, Cross streets, Your whole street, Corners, Other streets, and "20 ft contours."
- Only checked blocks get the large stacked map label once anything is checked.

## Matcher
- `scripts/match_blocks.py` (new): matches free-text block descriptions in a CSV to CNNs, with street, cross streets, address ranges, WKT, confidence, method, and notes.
- Intersections ("Haight and Masonic") return the intersection CNN and a POINT, marked high when the streets meet once; the touching blocks go in `nearby_cnns`. New `type` column.
- Streets with gaps in the city data (15th St between Florida and Alabama) match by position along the street; directional names ("South Van Ness", "West Portal") and exact names like "Front St" resolve; intersection points a few meters apart are treated as one.


## v20
- Fixed: the Options panel ignored its toggle and was always open. Elements with display rules (Options panel, legend contours row, bottom Clear selections) now respect `hidden`.

## v19
- Civic Joy Fund logo next to the "Block Party" title (`img/civic-joy.png`, new file).
- Start over and Clear selections are small buttons, on one line with an **Options** toggle on the right. Options opens two checkboxes:
  - "Include pedestrian paths and streets the city doesn't maintain" (new, checked by default). Unchecked, it hides pedestrian paths, private streets, and segments the city data marks as not accepted. Presidio and Fort Mason roads always stay visible. URL: `&minor=0`.
  - "Include retired, freeway, and paper streets" (moved here).
- Results: a full-width "Apply for a Block Party" button (placeholder; shows a "coming soon" note), with small CSV / JSON / Link copy buttons under it. The bottom Clear selections is a small button too.
- Map key shows a contours row ("Contours, every 20 ft") while contours are on and visible, with the interval for the current zoom and a swatch that matches map or satellite mode.

## v18
- "The other cross street" list shows the direct matches (the other end of each block touching the first cross street) first, then a "Further along" separator, then the remaining cross streets in italics.

## v17
- Contours at 80% opacity.
- In satellite mode, the basemap's labels (street names, neighborhoods, places) move above the imagery so people don't get disoriented, and drop back under it on the map view.
- Contours also draw above the satellite imagery, just under the labels. They turn pale yellow on satellite so they stay distinct from the white clickable streets, and are white on the map view.

## v16
- Contour lines back to their original width (0.6–0.9 px), at 70% opacity.
- Contours now sit under the basemap's labels.

## v15
- Contours changed to white so they stand apart from the blue-gray clickable streets; elevation labels warm gray with a white halo.

## v14
- Clearing "Your street" with the × keeps the current map view. Only "Start over" zooms back to the whole city.

## v13
- **Memory:** the elevation tile cache is capped at the 48 most recent tiles, stores elevation at half the size (Int16 decimeters instead of RGBA), and reuses one canvas. MapLibre's tile cache is capped at 150 tiles per source.
- "Clear selections" also appears at the bottom of the card list, shown only when there are cards.
- Cross streets on the map show one block on each side of the selection instead of two.

## v12
- Contour spacing restored to 40 / 20 / 10 ft at zoom 13 / 14 / 15, labeled every 200 / 100 / 50 ft.
- Contours only appear from zoom 13 in (`CONTOUR_MINZOOM`).

## v11
- Selected-block map labels read "2–79 Duncan St" on the first line (lowest and highest address on the block) with the CNN below. Separate even/odd ranges stay in the hover popup.
- Contours: all lines drawn the same (no major lines), denser spacing, elevation labels on every fifth line.
- Hillshading turns off while contours are on.

## v10
- Hovering a card highlights its block on the map and pans to it if it's out of view.
- Hovering a block on the map outlines its card and scrolls the list to it after a short pause if it's off screen.
- Selected-block labels are stacked (street, CNN, address ranges) at the block's midpoint and rotated to run along the street.
- Hover popup shows address ranges, even range first ("900–988, 901–989").

## v9
- 3D terrain stays on at every tilt, so tilting no longer jumps.
- Street-following labels (basemap, ours, contours) are printed on the ground instead of standing up, which keeps them from twisting on terrain.
- Past 30° of tilt, labels switch to flat-on-screen labels at each block's midpoint.
- Test switches in the query string: `?labelalign=viewport` and `?label3d=45`.
- Legend reordered and shortened: Your blocks, Cross streets, Block matches, Block preview, Your whole street, Block ends, Other streets, plus a "Tap any street to add it" hint.

## v8
- Terrain only while tilted, with midpoint labels at any tilt (replaced in v9).
- Dashed "block matches" line has visible gaps on the map and in the legend.
- Legend splits "Your whole street" and "Block preview" into separate entries.
- **Contours toggle**, ported from Selecter: maplibre-contour v0.1.0 on the Terrarium tiles, feet, including Selecter's Safari ArrayBuffer workaround.

## v7
- When the map is tilted past 15°, street-following labels are hidden and replaced with flat-on-screen labels at each block's midpoint (threshold changed in v8 and v9).
- × on each card removes it from the list and the map.
- Map legend ("Map key") replaces the "tap a street" tip; collapsed by default on phones.

## v6
- Elevation chart width depends on block length: under 400 ft = 62% of the card, 400–600 ft = 81%, 600 ft and up = full width (`PROFILE_BUCKETS`).
- The same grade draws at the same angle in every bucket, so short charts have headroom for steeper grades before squeezing.
- Quarter labels drop the decimal at 10% and up.

## v5
- "Clear selections" below "Start over": empties the list and the cross street / number fields, keeps the street and the map view.
- Hovering a cross street in either dropdown previews the matching blocks on the map (purple) and the cross street (teal).
- Clicking a block on the map scrolls to its card and flashes it.

## v4
- Elevation chart uses one scale for every block: a 30% climb fills the chart height (`PROFILE_MAX_GRADE`).
- Dashed reference lines at 5%, 10%, 20%, and 30%, fanning out from the block's low end.
- Blocks too steep to fit are squeezed and get a zigzag break mark on the left edge plus a "Not to scale" caption.
- Eight slope tiers: Flat (<2%), Gentle (2–5%), Moderate (5–10%), Steep (10–15%), Very steep (15–20%), Extremely steep (20–25%), Ridiculously steep (25–30%), Ludicrously steep (30%+).

## v3
- Street labels stay upright facing the screen when the map is tilted, using Selecter's approach (replaced in v9 because they twisted on terrain).

## v2
- Hillshade and 3D terrain from AWS Terrarium tiles, with a 3D button to tilt the map.
- Cards show block length, average and steepest slope with uphill direction, and a five-point (four-part) elevation profile chart.
- CSV/JSON exports add `length_ft`, `elev_from_ft`, `elev_to_ft`, `slope_pct`, `steepest_pct`, and `profile_ft`.

## v1
- Initial build: street autocomplete, cross street and street address lookups, result cards with CNN, address ranges, supervisor district, ZIP, and neighborhoods.
- Handles alley-split blocks and both sides of divided streets.
- MapLibre + Protomaps light basemap with Esri satellite toggle; click streets on the map to add them.
- Copy as CSV / JSON / link; `#cnn=`, `#street=`, `&all=1`, and `&lang=` URL hashes.
- `scripts/build_data.py` builds the compact `data/streets.json` from the DataSF CSVs.
