# Your files (Import / show layers)

Anything you bring in becomes a **layer**:
- drawn on the map;
- listed under "Your files" in Layers ▾;
- shown on the cards of the streets it's near.

Files stay in your browser tab; nothing is uploaded. Bring them in from the **Import / show layers** panel under the search.

## Where files can come from

| Source | How | Kept in the link? |
|---|---|---|
| A file | Drag it onto the page, or **Choose files**: `.csv`, `.tsv`, `.txt`, `.geojson`, `.json`, `.gpx` | No |
| Google Drive | **Google Drive** opens Google's picker. Sheets with several tabs ask which tabs to bring in | No |
| A Google Sheet link | Paste the sheet's link. It needs to be shared as "anyone with the link" or published. The `gid` in the link picks the tab | Yes, `url=` |
| DataSF or another Socrata site | Paste the dataset page or its `/resource/<id>` link. Up to 50,000 rows come in, named after the dataset | Yes, `url=` |
| Any other link | A CSV, GeoJSON or JSON file, on a site that allows it to be read from other pages (CORS) | Yes, `url=` |
| Airtable | **Airtable** asks for your token, then a base, table and view, or a view link. The token is kept for this tab only and never goes in the link | Yes, `url=airtable:<path>` (no token) |

When someone opens your link, files that came from a link load again. Files from your computer or Drive don't.

### Airtable

- Contact fields (email, phone, address, attachments, users) are skipped.
  - **Format → Fields left out** lets you add them back.
  - That choice is kept in the link as `url=airtable:<path>|<field>|…`.
- Linked records are followed:
  - a linked geo table's WKT becomes the row's shape;
  - its CNNs become the row's streets.

## How rows find their place

Block Party looks for a location in each row, in this order:

1. **A geometry column.**
   - Its name is `the_geom`, `geom`, `geometry`, `wkt`, `shape`, `location`, `point` or `coordinates`, or ends in `_wkt`, `_geom` or `_geometry`.
   - It can hold WKT (points, lines, polygons, their MULTI forms, GEOMETRYCOLLECTION), GeoJSON geometry, or `(lat, lon)` text.
   - A column holding outlines or lines beats lat/lon.
2. **Latitude and longitude.** Columns like `lat`, `latitude`, `y` or `point_y`, with `lon`, `lng`, `longitude`, `x` or `point_x`.
3. **CNNs.** A `cnn`, `cnns`, `block_cnn` or `street_cnn` column, with one or several per cell. The row goes on those streets.
4. **Cross streets as text**, when there's nothing else. The row is placed at the intersection.
   - One column with both streets, like "Valencia & 20th". `and`, `at`, `@`, `x` and `/` work too.
   - Or a street column (`street`, `street_name`, `on_street`, `primary`, `street_1`, `corridor`) plus a cross street column (`cross_street`, `at_street`, `secondary`, `street_2`, `intersecting`).

A few more things:
- The header row can be anywhere in the first 30 rows, so title lines above a table are fine.
- Each row's name comes from a column like `name`, `title`, `label`, `dba`, `organization`, `business`, `site` or `address`.
- If the first guess was wrong, **Format → Location from** switches which columns are used.
- Rows with no location are counted and left off the map.

### GPX and ride readings

- A GPX file opens as points.
- A file with 10 or more timed points offers **Replay it as a ride** (see [Routes](ROUTES.md)).
- A route saved from Block Party offers **Open it as your route**.

## On the map

- Each new file takes the next color and the next point shape.
  - Colors: red, orange, yellow, green, blue, indigo, violet, aqua, magenta, black, white.
  - Shapes: star, square, triangle, diamond, circle.
- **Format** sets each file's look:
  - **Color by** a column, or one color;
  - **Size**, or **Size by** a number column;
  - **Shape**, and fill or outline;
  - **Labels** from a column, starting at a zoom you pick.
- Your files' points and lines are drawn above the selection. When they overlap corners or streets, the file's point or line is the one that gets the hover.
- The map key has a row for each file, with a checkbox. Clicking a category in the key shows only that category.
- **Focus** on a file (from Focus ▾, or after it loads):
  - only its features take clicks and hovers;
  - the rest of the map fades;
  - Esc or ✕ ends it.

## On cards

- A street's card lists the rows near it, following **How near**: this block, N blocks out, the same area, or a radius. Its *Copy list* and *CSV* buttons copy those rows.
- Clicking a row on the map puts it on the card of the street or intersection it's at:
  - first the streets in its CNN column;
  - else an intersection within 15 m;
  - else the nearest street within 40 m.

  Rows that are far from streets, and polygons, get a card of their own.
- A line from a file with no CNNs can be clicked to add it to the selection as a piece (see [Routes](ROUTES.md)).

## Removing

- ✕ on a file's row asks first. It says what else goes with the file: rows picked onto cards, Nearby results, and Focus on it.
- Start over keeps your files. Removing a file is the only way to drop it.
