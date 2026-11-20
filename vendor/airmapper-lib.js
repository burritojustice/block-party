// Pure map helpers for Airmapper (https://github.com/burritojustice/airmapper).
// No React, no Airtable, no data. Positions are [lon, lat].

export function parseWkt(text) {
  const tokens = text.toUpperCase().match(/[A-Z]+|\(|\)|,|-?\d+(?:\.\d+)?(?:E[-+]?\d+)?/g);
  if (!tokens) return null;
  let i = 0;
  const expect = (t) => {
    if (tokens[i] !== t) throw new Error('bad wkt');
    i++;
  };
  const point = () => {
    const x = Number(tokens[i++]);
    const y = Number(tokens[i++]);
    while (tokens[i] !== ',' && tokens[i] !== ')' && i < tokens.length) i++;
    return [x, y];
  };
  const list = (item) => {
    expect('(');
    const out = [item()];
    while (tokens[i] === ',') {
      i++;
      out.push(item());
    }
    expect(')');
    return out;
  };
  const bracketedPoint = () => (tokens[i] === '(' ? list(point)[0] : point());
  const geom = () => {
    const kind = tokens[i++];
    if (tokens[i] === 'EMPTY') throw new Error('empty');
    switch (kind) {
      case 'POINT':
        return {type: 'Point', coordinates: list(point)[0]};
      case 'MULTIPOINT':
        return {type: 'MultiPoint', coordinates: list(bracketedPoint)};
      case 'LINESTRING':
        return {type: 'LineString', coordinates: list(point)};
      case 'MULTILINESTRING':
        return {type: 'MultiLineString', coordinates: list(() => list(point))};
      case 'POLYGON':
        return {type: 'Polygon', coordinates: list(() => list(point))};
      case 'MULTIPOLYGON':
        return {type: 'MultiPolygon', coordinates: list(() => list(() => list(point)))};
      case 'GEOMETRYCOLLECTION':
        return {type: 'GeometryCollection', geometries: list(geom)};
      default:
        throw new Error('unknown wkt type ' + kind);
    }
  };
  try {
    return geom();
  } catch {
    return null;
  }
}

// WKT (SRID= prefixes and Z/M values allowed), GeoJSON (geometry, Feature or FeatureCollection,
// as text or an object) or a "lat, lon" pair. An array (an Airtable lookup) gives each item's shape.
export function parseShape(raw) {
  if (raw == null) return null;
  if (Array.isArray(raw)) {
    const parts = raw.map(parseShape).filter(Boolean);
    return parts.length > 1 ? {type: 'GeometryCollection', geometries: parts} : (parts[0] ?? null);
  }
  if (typeof raw === 'object') return raw.coordinates || raw.geometries || raw.type === 'Feature' || raw.type === 'FeatureCollection' ? parseShape(JSON.stringify(raw)) : null;
  const text = String(raw)
    .trim()
    .replace(/^SRID=\d+;\s*/i, '')
    .replace(/\b(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)\s+(?:ZM|Z|M)\s*\(/gi, '$1 (');
  if (!text) return null;
  if (text.startsWith('{')) {
    try {
      const obj = JSON.parse(text);
      if (obj.type === 'Feature') return obj.geometry ?? null;
      if (obj.type === 'FeatureCollection') {
        return {type: 'GeometryCollection', geometries: (obj.features ?? []).map((f) => f.geometry).filter(Boolean)};
      }
      return obj.type ? obj : null;
    } catch {
      return null;
    }
  }
  const pair = text.match(/^\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?$/);
  if (pair) {
    const a = Number(pair[1]);
    const b = Number(pair[2]);
    return {type: 'Point', coordinates: Math.abs(a) <= 90 && Math.abs(b) > 90 ? [b, a] : [a, b]};
  }
  if (!/^(POINT|MULTIPOINT|LINESTRING|MULTILINESTRING|POLYGON|MULTIPOLYGON|GEOMETRYCOLLECTION)\b/i.test(text)) return null;
  return parseWkt(text);
}

// sf-blocks streets.json: delta-encoded integer coordinates (÷ 1e5).
export function decodeStreets(raw) {
  const F = Object.fromEntries(raw.seg_fields.map((f, i) => [f, i]));
  const N = Object.fromEntries(raw.node_fields.map((f, i) => [f, i]));
  const segs = new Map();
  for (const r of raw.segs) {
    const g = r[F.geom];
    const pts = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < g.length; i += 2) {
      x = i === 0 ? g[0] : x + g[i];
      y = i === 0 ? g[1] : y + g[i + 1];
      pts.push([x / 1e5, y / 1e5]);
    }
    segs.set(String(r[F.cnn]), pts);
  }
  const nodes = new Map();
  for (const n of raw.nodes) nodes.set(String(n[N.cnn]), [n[N.x] / 1e5, n[N.y] / 1e5]);
  return {segs, nodes};
}

// Street blocks become lines, intersections become points.
export function fromCnns(text, streets) {
  if (!streets || !text) return null;
  const lines = [];
  const points = [];
  for (const cnn of text.split(/[;,\s]+/).filter(Boolean)) {
    const seg = streets.segs.get(cnn);
    if (seg) lines.push(seg);
    else {
      const node = streets.nodes.get(cnn);
      if (node) points.push(node);
    }
  }
  const parts = [];
  if (lines.length) parts.push({type: 'MultiLineString', coordinates: lines});
  if (points.length) parts.push({type: 'MultiPoint', coordinates: points});
  if (!parts.length) return null;
  return parts.length === 1 ? parts[0] : {type: 'GeometryCollection', geometries: parts};
}

// A checked point from latitude and longitude (numbers or text), or null.
export function pointOf(lat, lon) {
  const y = typeof lat === 'number' ? lat : parseFloat(String(lat ?? ''));
  const x = typeof lon === 'number' ? lon : parseFloat(String(lon ?? ''));
  if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 180 || Math.abs(y) > 90 || (x === 0 && y === 0)) return null;
  return {type: 'Point', coordinates: [x, y]};
}

// One geometry for a record from whichever location fields it has.
// shape: WKT or GeoJSON (text or object). cnns: CNNs separated by ; , or spaces. lat, lon: numbers or text.
// streets: anything with segs.get(cnn) and nodes.get(cnn), like decodeStreets() gives.
// Modes: 'auto', 'shapes' and 'dots' take the shape, else the CNNs, else lat/lon;
// 'streets' takes the CNNs first; 'both' draws the shape and the CNNs together.
export function geometryOf(src, streets = null, mode = 'auto') {
  const {shape, cnns, lat, lon} = src || {};
  const lines = cnns ? fromCnns(String(cnns), streets) : null;
  let geom = mode === 'streets' ? lines : null;
  if (!geom) geom = parseShape(shape);
  if (mode === 'both' && geom && lines) geom = {type: 'GeometryCollection', geometries: [geom, lines]};
  return geom || lines || pointOf(lat, lon);
}

// Show shapes from a zoom and dots below it ('auto'), only dots ('dots'), or only shapes (anything else).
// Uses layer zoom ranges only, so a layer's own visibility (turned off in a key, say) is left alone.
export function autoZoom(map, shapeLayers, dotLayers, mode = 'auto', zoom = 12) {
  const set = (ids, lo, hi) => {
    for (const id of ids) if (map.getLayer(id)) map.setLayerZoomRange(id, lo, hi);
  };
  const z = Math.max(0, Math.min(24, Number(zoom) || 12));
  set(shapeLayers, mode === 'dots' ? 24 : mode === 'auto' ? z : 0, 24);
  set(dotLayers, mode === 'auto' || mode === 'dots' ? 0 : 24, mode === 'auto' ? z : 24);
}

export function flatten(g) {
  if (g.type === 'GeometryCollection') return g.geometries.flatMap(flatten);
  if (g.type === 'MultiPoint') return g.coordinates.map((c) => ({type: 'Point', coordinates: c}));
  if (g.type === 'MultiLineString') return g.coordinates.map((c) => ({type: 'LineString', coordinates: c}));
  if (g.type === 'MultiPolygon') return g.coordinates.map((c) => ({type: 'Polygon', coordinates: c}));
  return [g];
}

export function eachPosition(g, fn) {
  const walk = (c) => {
    if (Array.isArray(c) && typeof c[0] === 'number') fn(c);
    else if (Array.isArray(c)) c.forEach(walk);
  };
  for (const part of flatten(g)) walk(part.coordinates);
}

// A point to stand for a geometry: the point, a line's middle vertex, or a polygon's vertex average.
export function anchorOf(g) {
  const first = flatten(g)[0];
  if (!first) return null;
  if (first.type === 'Point') return first.coordinates;
  if (first.type === 'LineString') return first.coordinates[Math.floor(first.coordinates.length / 2)] ?? null;
  if (first.type === 'Polygon') {
    const ring = first.coordinates[0] ?? [];
    if (!ring.length) return null;
    const sx = ring.reduce((a, p) => a + p[0], 0);
    const sy = ring.reduce((a, p) => a + p[1], 0);
    return [sx / ring.length, sy / ring.length];
  }
  return null;
}

export function inRing(p, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Point in a Polygon or MultiPolygon feature, holes respected.
export function inArea(p, f) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return polys.some((rings) => inRing(p, rings[0]) && !rings.slice(1).some((hole) => inRing(p, hole)));
}

// Meters from o to the nearest part of g (0 inside a polygon). Flat-earth, fine at city scale.
export function distTo(o, g) {
  let best = Infinity;
  const k = Math.cos((o[1] * Math.PI) / 180) * 111320;
  const xy = (p) => [(p[0] - o[0]) * k, (p[1] - o[1]) * 110540];
  const seg = (a, b) => {
    const [ax, ay] = xy(a);
    const [bx, by] = xy(b);
    const dx = bx - ax;
    const dy = by - ay;
    const t = dx || dy ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy))) : 0;
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
  };
  const run = (ps) => ps.forEach((p, i) => seg(ps[Math.max(0, i - 1)], p));
  for (const part of flatten(g)) {
    if (part.type === 'Point') run([part.coordinates]);
    else if (part.type === 'LineString') run(part.coordinates);
    else if (part.type === 'Polygon') {
      if (inRing(o, part.coordinates[0])) return 0;
      part.coordinates.forEach(run);
    }
  }
  return best;
}

// A 64-sided polygon of radius r meters around o.
export function circle(o, r) {
  const k = Math.cos((o[1] * Math.PI) / 180) * 111320;
  return {type: 'Polygon', coordinates: [[...Array(65)].map((_, i) => [o[0] + (r * Math.cos((i * Math.PI) / 32)) / k, o[1] + (r * Math.sin((i * Math.PI) / 32)) / 110540])]};
}

export const fmtM = (m) => (m < 1000 ? Math.round(m / 10) * 10 + ' m' : (m / 1000).toFixed(1) + ' km');

// John's creek fix: hide Protomaps water_stream, and drop "Creek" and "Arroyo" names from water_river and waterway labels.
export function hideCreeks(map) {
  const named = (w) => ['!', ['in', w, ['coalesce', ['get', 'name'], '']]];
  const expr = (f) => {
    if (!Array.isArray(f) || typeof f[1] !== 'string') return f;
    if (f[0] === 'in') return ['match', ['get', f[1]], f.slice(2), true, false];
    if (f[0] === '==') return ['==', ['get', f[1]], f[2]];
    return null;
  };
  const add = (id, ...conds) => {
    if (!map.getLayer(id)) return;
    const f = map.getFilter(id);
    const e = f ? expr(f) : true;
    if (e === null) return;
    map.setFilter(id, ['all', e, ...conds]);
  };
  try {
    if (map.getLayer('water_stream')) map.setLayoutProperty('water_stream', 'visibility', 'none');
    add('water_river', named('Creek'), named('Arroyo'));
    add('water_waterway_label', ['!=', ['get', 'kind'], 'stream'], named('Creek'), named('Arroyo'));
  } catch {
    return;
  }
}

// Whether white text reads better than dark text on hex drawn at the given opacity over white.
export function darkFill(hex, opacity = 0.65) {
  if (!hex) return false;
  const m = hex.replace('#', '').match(/../g);
  if (!m) return false;
  const [r, g, b] = m.map((x) => {
    const c = (parseInt(x, 16) / 255) * opacity + (1 - opacity);
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (l + 0.05) > (l + 0.05) / 0.067;
}

// A number from a cell value: numbers, numeric strings ($, commas, % allowed), or the first number in a lookup array.
export function numOf(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (Array.isArray(v)) {
    for (const x of v) {
      const n = numOf(x && typeof x === 'object' && 'value' in x ? x.value : x);
      if (n !== null) return n;
    }
    return null;
  }
  if (typeof v === 'string') {
    const t = v.replace(/[$,%\s]/g, '');
    if (!t || !/^-?\d*\.?\d+(e[-+]?\d+)?$/i.test(t)) return null;
    return Number(t);
  }
  return null;
}

// Short numbers, the same as Joiner and Selecter: 4,100 → 4.1K.
export const abbrev = (m) => {
  const a = Number(m.replace(/,/g, ''));
  const u = [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ].find(([d]) => a >= d);
  if (!u) return m;
  const v = a / u[0];
  return (v >= 100 ? String(Math.round(v)) : String(+v.toFixed(1))) + u[1];
};
export const short = (x) => x.replace(/\d[\d,]*(\.\d+)?/g, abbrev);
export const shortParts = (l) => l.split('–').map(short);

// The basemap without a Protomaps key: a background plus land from a GeoJSON URL.
export const plainStyle = (dark, land) => ({
  version: 8,
  glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sources: {land: {type: 'geojson', data: land}},
  layers: [
    {id: 'am-bg', type: 'background', paint: {'background-color': dark ? '#1f2a33' : '#dbe7ef'}},
    {id: 'am-land', type: 'fill', source: 'land', paint: {'fill-color': dark ? '#2b2f36' : '#f6f7f4'}},
  ],
});
