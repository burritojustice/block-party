# data/

**Backup copies.** Everything here (and `../region.json`, `../reference/neighborhood-groups/`) is a copy of [burritojustice/sf-blocks](https://github.com/burritojustice/sf-blocks), at the same path as on its site. Don't edit these files here: change sf-blocks, then refresh the copies. Where each file comes from and how it's built is in sf-blocks' [data/README.md](https://github.com/burritojustice/sf-blocks/blob/main/data/README.md) and the READMEs in its folders.

## How the page loads them

1. On load, the page asks the live site, https://burritojustice.github.io/sf-blocks/, for `region.json` and `VERSION` (waiting up to 8 seconds).
2. If it answers, every file (streets, layers, neighborhood sets, groups list) is read live from there, by the paths in `region.json`. A file the live site can't serve is read from the copy here instead, and the rest stay live.
3. If the live site doesn't answer, everything comes from the copies here.
4. The parcels file (`Land_Use_with_Active_Parcel_Information.pmtiles`) is read in pieces by the PMTiles library from wherever the page started reading, live or here, with no file-by-file fallback.

Hover the page title to see the sf-blocks version and whether it's live. The console logs it too (`[sf-blocks] 2026.10.27.2, live from …`). The loader is the `SFBlocks` block in `index.html`; Joiner has the same code in `js/sfblocks.js`.

**For testing:** `?sfblocks=local` uses only the copies here; `?sfblocks=<url>` reads from another copy of sf-blocks (a fork, a branch on a local server, another city's repo).

## What's copied

`sf-blocks.json` lists every copied file, the sf-blocks version they came from, and the date copied:

| Here | What Block Party uses it for |
|---|---|
| `streets.json` (+ `sf_streets.csv`, `sf_intersections.csv`) | Every block and intersection: search, cards, slopes, neighborhoods |
| `layers/` | The Layers menu: schools, stations, health care, Muni, bike, Slow Streets, city lands |
| `boundaries/` (the five neighborhood sets) | Neighborhood names on cards |
| `Land_Use_with_Active_Parcel_Information.pmtiles` | The Parcels layer (land use, zoning) |
| `aliases.json` | Other spellings of neighborhood names, read by `scripts/build_neighborhood_groups.py` |
| `uploads/` | The raw downloads `layers/` is built from, so `build_layers.py` runs here too |
| `../reference/neighborhood-groups/` | Neighborhood groups on cards |

## Refreshing the copies

After an sf-blocks release:

```
python3 scripts/copy_sf_blocks.py ../sf-blocks --check   # what differs
python3 scripts/copy_sf_blocks.py ../sf-blocks           # copy, and stamp sf-blocks.json
```

Then ship it as a new Block Party version. To copy a new file, add its path to `files` in `sf-blocks.json` first.
