#!/usr/bin/env python3
"""Build the small map overlay files in data/layers/ from the raw downloads in layers/.

    python3 scripts/build_layers.py            # reads layers/, writes data/layers/

Standard library only. Download each dataset in SOURCES from DataSF (Export, in the format listed)
into layers/ and leave the file name alone: DataSF names downloads after the dataset title plus a
date stamp ("Muni_Simple_Routes_20261011.geojson"), and the script finds them by title, taking the
newest stamp when there are several. Older hand-renamed files (SF_muni_lines.geojson etc.) are found
by the keywords in `also`.

Only the fields the map uses are kept, and coordinates are rounded to 5 decimals (about 1 m).
Each output records its source dataset and the file it came from. Muni geometry is passed through
as published (no merging); see README "Map layers".

Later: pull these straight from the Socrata API (https://data.sf.gov/resource/<id>.geojson, or
/api/views/<id>/rows.csv?accessType=DOWNLOAD) instead of downloading by hand. The ids are here.
"""
import csv, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'layers', ROOT / 'data' / 'layers'

# out name -> where it comes from. 'title' is the DataSF dataset title, which is also how downloads are named.
SOURCES = {
    'muni': {'title': 'Muni Simple Routes', 'id': '9exe-acju', 'format': 'GeoJSON',
             'url': 'https://data.sf.gov/Transportation/Muni-Simple-Routes/9exe-acju/about_data',
             'also': ['muni']},
    'bike': {'title': 'MTA Bike Network Linear Features', 'id': 'ygmz-vaxd', 'format': 'GeoJSON',
             'url': 'https://data.sf.gov/Transportation/MTA-Bike-Network-Linear-Features/ygmz-vaxd/about_data',
             'also': ['bike']},
    # The file in layers/ is this dataset plus columns added after download: short_name (used for the map
    # label), elevation, and, coming, enrollment joined from the California Department of Education. That
    # join gets its own documented workflow (maybe its own repo, since it works statewide), so a raw DataSF
    # download here would be missing short_name; the build falls back to the full school name.
    'schools': {'title': 'Schools', 'id': '7e7j-59qk', 'format': 'GeoJSON',
                'url': 'https://data.sf.gov/Economy-and-Community/Schools/7e7j-59qk/about_data',
                'also': ['school']},
    'stations': {'title': 'City-owned Facilities: Fire and Police', 'id': 'wt27-4jim', 'format': 'CSV',
                 'url': 'https://data.sf.gov/City-Infrastructure/City-owned-Facilities-Fire-and-Police/wt27-4jim/about_data',
                 'also': ['sffd', 'station']},
    'health': {'title': 'Health Care Facilities', 'id': 'jhsu-2pka', 'format': 'CSV',
               'url': 'https://data.sf.gov/Health-and-Social-Services/Health-Care-Facilities/jhsu-2pka/about_data',
               'also': ['health']},
}


def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())


def stamp(p):
    """the date stamp DataSF adds to downloads, or 0"""
    m = re.findall(r'(20\d{6})', p.stem)
    return int(m[-1]) if m else 0


def find(key):
    src = SOURCES[key]
    files = [p for p in SRC.iterdir() if p.is_file() and p.suffix.lower() in ('.geojson', '.json', '.csv')]
    by_title = [p for p in files if norm(p.stem).startswith(norm(src['title']))]
    hits = by_title or [p for p in files if any(w in p.name.lower() for w in src['also'])]
    if not hits:
        return None
    hits.sort(key=lambda p: (stamp(p), p.stat().st_mtime))
    if len(hits) > 1:
        print(f'  {key}: {len(hits)} candidate files, using the newest ({hits[-1].name})', flush=True)
    return hits[-1]


def rnd(c):
    if isinstance(c[0], (int, float)):
        return [round(c[0], 5), round(c[1], 5)]
    return [rnd(x) for x in c]


def dedupe_line(coords):
    out = []
    for c in coords:
        if not out or out[-1] != c:
            out.append(c)
    return out


def geom(g):
    if not g:
        return None
    c = rnd(g['coordinates'])
    if g['type'] == 'LineString':
        c = dedupe_line(c)
    elif g['type'] == 'MultiLineString':
        c = [dedupe_line(l) for l in c]
    return {'type': g['type'], 'coordinates': c}


def feat(g, props):
    return {'type': 'Feature', 'geometry': g, 'properties': {k: v for k, v in props.items() if v not in (None, '')}}


def write(name, feats, src, data_as_of=None):
    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / f'{name}.geojson'
    meta = {k: SOURCES[name][k] for k in ('title', 'id', 'url')}
    meta.update({'file': src.name, 'data_as_of': data_as_of})
    p.write_text(json.dumps({'type': 'FeatureCollection', 'source': meta, 'features': feats}, separators=(',', ':')))
    print(f'{p.relative_to(ROOT)}: {len(feats)} features, {p.stat().st_size / 1024:.0f} KB  (from {src.name})', flush=True)


def as_of(p):
    """latest data_as_of in a GeoJSON download, as a date"""
    dates = [f['properties'].get('data_as_of') or '' for f in json.loads(p.read_text())['features']]
    return max(dates)[:10] or None if dates else None


def build_muni(p):
    feats = []
    for f in json.loads(p.read_text())['features']:
        pr = f['properties']
        if pr.get('service_ca') == 'Other':     # FBUS, KBUS, NBUS, TBUS: rail-replacement buses
            continue
        g = geom(f['geometry'])
        if g:
            feats.append(feat(g, {'route': pr['route_name'].strip(), 'service': pr.get('service_ca'), 'dir': pr.get('direction')}))
    feats.sort(key=lambda f: (f['properties']['route'], f['properties'].get('dir', '')))
    write('muni', feats, p, as_of(p))


BIKE_KIND = {'SEPARATED BIKEWAY': 'separated', 'BIKE LANE': 'lane', 'BIKE PATH': 'path',
             'BIKE ROUTE': 'route', 'NEIGHBORWAY': 'neighborway'}
BARRIER_WORDS = [  # (pattern, short word); first match wins for each part
    (r'SAFE.?HIT|K71', 'posts'), (r'CONCRETE ISLAND', 'concrete island'), (r'CONCRETE', 'concrete'),
    (r'PARKING', 'parking'), (r'K-?RAIL', 'k-rail'), (r'CURB', 'curb'), (r'SPEED BUMP', 'bumps'),
]


def barrier(s):
    if not s:
        return None
    out = []
    for part in re.split(r'[;:]', s.upper()):
        for pat, word in BARRIER_WORDS:
            if re.search(pat, part):
                if word not in out:
                    out.append(word)
                break
    return ', '.join(out) or None


def build_bike(p):
    feats = []
    for f in json.loads(p.read_text())['features']:
        pr = f['properties']
        g = geom(f['geometry'])
        kind = BIKE_KIND.get((pr.get('symbology') or '').strip())
        if not g or not kind:
            continue
        cnn = (pr.get('cnn') or '').strip()
        feats.append(feat(g, {'kind': kind, 'cls': pr.get('facility_t'), 'barrier': barrier(pr.get('barrier')),
                              'cnn': int(cnn) if cnn.isdigit() else None}))
    write('bike', feats, p, as_of(p))


def build_schools(p):
    feats = []
    for f in json.loads(p.read_text())['features']:
        pr = f['properties']
        g = geom(f['geometry'])
        if not g:
            continue
        name = (pr.get('short_name') or pr.get('school') or '').strip()
        feats.append(feat(g, {'name': name, 'type': pr.get('entity_type'),
                              'public': bool(pr.get('public_yesno'))}))
    write('schools', feats, p, as_of(p))


def read_csv(p):
    with open(p, newline='', encoding='utf-8-sig', errors='replace') as fh:
        return list(csv.DictReader(fh))


def build_stations(p):
    feats = []
    for r in read_csv(p):
        try:
            x, y = float(r['longitude']), float(r['latitude'])
        except (KeyError, ValueError):
            continue
        kind = 'fire' if 'fire' in (r.get('jurisdiction') or '').lower() else 'police'
        feats.append(feat({'type': 'Point', 'coordinates': rnd([x, y])},
                          {'name': (r.get('common_name') or '').strip(), 'kind': kind}))
    write('stations', feats, p)


# DataSF's facility names are in title case, which mangles acronyms ("Ucsf", "Sfgh")
ACRONYMS = {'Ucsf': 'UCSF', 'Sfgh': 'SFGH', 'Ahf': 'AHF', 'Baart': 'BAART', 'Lpc': 'LPC', 'Pace': 'PACE'}


def tidy_name(s):
    s = re.sub(r'\s+', ' ', s.replace(' ', ' ')).strip()
    return ' '.join(ACRONYMS.get(w, w) for w in s.split(' '))


def build_health(p):
    feats = []
    for r in read_csv(p):
        m = re.search(r'POINT \(([-\d.]+) ([-\d.]+)\)', r.get('point') or '')
        if not m:
            continue
        ftype = (r.get('Facility Type') or '').strip()
        feats.append(feat({'type': 'Point', 'coordinates': rnd([float(m[1]), float(m[2])])},
                          {'name': tidy_name(r.get('Facility Name') or ''), 'type': ftype,
                           'kind': 'hospital' if 'hospital' in ftype.lower() else 'clinic',
                           'services': (r.get('Services') or '').strip()}))
    write('health', feats, p)


def main():
    if not SRC.is_dir():
        sys.exit(f'No {SRC} folder. Put the raw layer downloads there.')
    jobs = {'muni': build_muni, 'bike': build_bike, 'schools': build_schools,
            'stations': build_stations, 'health': build_health}
    for key, fn in jobs.items():
        p = find(key)
        if p:
            fn(p)
        else:
            src = SOURCES[key]
            print(f'skipped {key}: no "{src["title"]}" download in layers/'
                  + (f' (get it from {src["url"]})' if src['url'] else ''), flush=True)


if __name__ == '__main__':
    main()
