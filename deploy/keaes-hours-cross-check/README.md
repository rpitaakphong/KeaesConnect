# Keaes CSV Hours Cross-Check

Static browser app for comparing a Teach and Go export with a class-list CSV export.

## Run

Open `index.html` in a browser. No build step, Node.js, database, or backend is required.

If your browser blocks CDN scripts from a local file, run:

```bash
cd "/Users/pitaakphong/Documents/New project"
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

## Files Expected

Teach and Go file:

- `Subject`
- `Level`
- `Teacher`
- `Student`
- `Lesson Date`
- `Lesson Time`
- `Duration`

Accepted formats:

- `.csv`
- `.xlsx` / `.xls`

For Excel workbooks, only the worksheet named `By Date` is used.

Class-list CSV:

- `Branch`
- `Date`
- `Class Code`
- `Start Time`
- `End Time`
- `Hours`
- `Subject`
- `Tutor`
- `Platform`
- `Type`

Student names are ignored in this version.

## Workflow

1. Upload the Teach and Go file.
2. Upload `class_list_2026-05-31.csv`.
3. The app parses both files locally in the browser.
4. The app shows a teacher-name verification table.
5. Select the matching class-list tutor for each Teach and Go teacher where names differ.
6. Save names and run the summary.

Teacher mappings are stored in browser `localStorage`.

## Matching Logic

Overall totals compare all session durations:

- Teach and Go uses decimal `Duration`, such as `1.5`.
- Class-list uses duration strings, such as `1:30`.

Teacher totals are calculated after verified teacher mappings are applied.

Session matching uses this primary key:

- Date
- Start time
- Verified teacher
- Duration

Course/subject is shown as supporting context, but course names are not treated as verified cross-source mappings yet.

## Outputs

The app shows:

- Overall hour totals
- Net difference
- Teacher-hour comparison
- Course-hour summary by source
- Teacher lookup
- Course lookup
- Session mismatch table
- Data-quality warnings

Exports include teacher, course, session, warning, and combined JSON reports.

## Privacy

All processing happens locally in the browser. Files are not uploaded to a server.
