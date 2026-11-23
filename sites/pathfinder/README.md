# Pathfinder (civic-joy-fund)

Files for Civic Joy Fund's copy of this page, which runs at https://civic-joy-fund.github.io/pathfinder/ (repo civic-joy-fund/pathfinder) as **Pathfinder**. The copy is this repo unchanged: `SITES.pathfinder` in `index.html` picks the name, logo, features and these files by the page's host. Open any copy with `?site=pathfinder` to see it as Pathfinder.

| File | What it is |
| --- | --- |
| `civic-joy.png` | The logo |
| `block-party-2026.csv` | Block Party 2026 grants by location, from Civic Joy's Airtable ("Block Party 2026 geo"), exported 2026-11-20 |
| `green-infrastructure.csv` | Green Infrastructure projects, from Civic Joy's Airtable, exported 2026-11-20 |

Both show on the map when Pathfinder opens (unless its link names other files).

## Refreshing the data

Export the two Airtable views as CSV and replace the files, keeping their names. Before committing:

- Drop people's names: `Application` (Block Party 2026, the applicant) and `Lead Advocates (from Project)` (Green Infrastructure). Organizations stay.
- Write dates as YYYY-MM-DD (`Event Date (from Application)`).

Later, Pathfinder can read the Neighbors Airtable view live with a token instead (the token stays in the browser tab, never in the link).
