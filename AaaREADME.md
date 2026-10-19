# Basketball Training App – gemeinsame Beta 0.2

Enthält Home Handles 0.7 (Original-HTML als same-origin iframe), Basketball IQ 0.1 (React), Shooting und Finishing (neue React-Module).

## Start

Node.js 20.19+ oder 22.12+ empfohlen.

```bash
npm install
npm run dev
```

Browser: http://localhost:5173

## Build / Netlify

```bash
npm run build
```

Netlify: Repository importieren; Build-Befehl `npm run build`, Veröffentlichungsordner `dist` (siehe netlify.toml). **Nicht** die alte Live-Site ersetzen, bevor du die Beta getestet und die alten Trainingsdaten exportiert hast. Alternativ den Inhalt von `dist` auf eine **neue** Netlify-Testsite hochladen.

## Umfang

- **Home Handles:** Unveränderte Originaldatei `public/home-handles.html` mit Workout, Kamera und experimenteller Ball-Erkennung. Drittanbieter-KI-Bibliotheken benötigen Internet. Kamerazugriff nur unter HTTPS oder localhost.
- **Basketball IQ:** Spielerprofil, 8-Fragen-Positionstest, 10 interaktive Situationen, SVG-FIBA-Feld, Statistik und JSON-Export.
- **Shooting:** 6 integrierte Drills, eigene Drills, Workout-Builder, Timer, lokal gespeicherte Trainingseinträge.
- **Finishing:** 6 integrierte Drills, eigene Drills, Workout-Builder, Timer, lokal gespeicherte Trainingseinträge.

## Grenzen und Datenschutz

- Shooting/Finishing haben **noch keine** Kameraanalyse, Treffererkennung, KI-Coach oder automatisierte Bewegungsbewertung.
- Die Home-Handles-Kamera ist optional; kein Video wird durch diese Beta aufgezeichnet. Die alte COCO-SSD-Erkennung lädt externe JS-Modelle, wenn sie aktiviert wird.
- Es gibt noch **kein einheitliches Spielerprofil und keine gemeinsame Datenbank**. Die vier Module teilen die Website-Origin, speichern aber weiterhin unter getrennten `localStorage`-Schlüsseln.
- **Wichtig bei Migration:** Daten der bestehenden `celebrated-bonbon-42e642.netlify.app`-Site werden auf einer neuen Test-Domain nicht automatisch übernommen. Home Handles nutzt `hh_workouts_v05` und `basketball_detection_v1`; Basketball IQ `basketball-iq-beta-v1`; Shooting/Finishing eigene `basketball-...`-Keys. Vor Ersetzen einer Domain Datensicherung durchführen.
- Ein Workout wird nach manuellem Abschluss gespeichert; angezeigte Dauer ist die geplante Dauer, nicht gemessene Aktivzeit.
- Die aktuelle App ist ein Entwicklungsprototyp. Die Szenariobewertungen sind didaktische Heuristiken, keine wissenschaftliche IQ-Messung.
