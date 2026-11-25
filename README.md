# Gezinshuisportaal Bij Elkaar (fase 2)

Schermontwerp en documentatie voor het gezinshuisportaal van Bij Elkaar.
Dit is nog geen werkende software: het prototype laat alleen schermen zien en je kunt er alleen doorheen klikken. Alle gegevens zijn fictief.

## Inhoud

- `index.html` – losse versie van het schermontwerp, draait in elke browser (startpagina voor Vercel)
- `tools/build-standalone.mjs` – maakt `index.html` opnieuw uit `prototype/Main.dc.html` (`node tools/build-standalone.mjs`)

- `prototype/Main.dc.html` – het klikbare schermontwerp (Claude Design-formaat)
- `prototype/canvas.json` – canvasinstellingen van het ontwerp
- `prototype/assets/bijelkaar-logo.png` – logo van Bij Elkaar
- `docs/Bij Elkaar - Fase 2 gezinshuisportaal.pdf` – overzicht van fase 2 (5 pagina's)
- `docs/fase2-pdf-bron.html` – bron van de PDF

Live ontwerp: https://claude.ai/artifact/ByeURgvKJPjABYqcAgjSJw

## Vercel

Importeer deze repository in Vercel als statische site (framework: Other, geen build-commando, output: de hoofdmap). Elke push naar `main` zet de nieuwe versie live.
