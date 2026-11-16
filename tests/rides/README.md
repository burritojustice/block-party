# Sample rides

Synthetic GPS tracks for checking Ride's matching: one reading a second at about 18 km/h, with about 4 m of drifting wobble, made along the SF bike network's own lines (sf-blocks `data/layers/bike.geojson`). No real person's location is in them.

- `hairball-east.gpx`: Cesar Chavez St bike lanes, then the Class I path under 101 (no CNN) to the east side.
- `hairball-south.gpx`: the same, then on to the separated bikeway along Bay Shore Blvd and Jerrold Ave.
- `page-to-ggp.gpx`: Page St from Masonic Ave to Stanyan St, the path into Golden Gate Park (no CNN), then JFK Dr.

To replay one: open it in Block Party (Import, or drop it on the page), then press **Replay it as a ride**. Ride plays it through the same matching it uses on the road.

What v96 makes of them:
- **hairball-east:** four Cesar Chavez blocks plus the 354 m path under 101 as a bike path. No gaps.
- **hairball-south:** the same, plus a second bike path (177 m) and two Jerrold Ave blocks. Two short gaps (15 m and 40 m) remain.
- **page-to-ggp:** five Page St blocks, the 166 m path into the park, four JFK Dr blocks, and the 137 m path that runs west from it toward JFK. No gaps.
