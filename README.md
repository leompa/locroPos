# LocroPOS

LocroPOS is an open-source local network web application for clubs, festivals and food stands.

## Local instance

This project is configured to run from a local Node/Express instance. GitHub Pages deployment is intentionally not used, because future backend tasks may need local-network capabilities such as sending tickets to a network printer.

## Requirements

- Node.js 20 or newer
- Firebase project with Firestore enabled
- Firebase anonymous authentication enabled

## Run locally

```bash
npm install
npm start
```

Then open <http://localhost:3000/caja/>.

The server exposes:

- `GET /api/health` for a basic backend health check.
- `GET /api/firebase-config` for the active Firebase public configuration.
- `GET /js/config/env.js` as a browser ES module consumed by the frontend.
- `POST /api/events/:eventId/tickets` to emit tickets for the selected event.
- `GET /api/events/:eventId` to inspect the event counter document.

## Firebase configuration

The provided Firebase web configuration is included as the local default so the app can run immediately:

- Project ID: `locropost`
- Auth domain: `locropost.firebaseapp.com`
- Storage bucket: `locropost.firebasestorage.app`

You can override those values by copying `.env.example` to `.env` and editing the Firebase variables.

Firebase web configuration is public by design. Do not commit service account keys or private admin credentials.

## Domain model

The first operating model is based on:

- `producto`: sellable item with description, category, price, and destination area.
- `categoria`: product grouping such as `bebida`, `trago`, or `comida`.
- `evento`: sale context where ticket numbering starts from zero.
- `ticket`: generated when products are emitted from Caja; stores event, product, description, quantity, total paid, incremental event ticket number, withdrawal status, and a future QR payload.

## Routes

- `/caja/`
- `/cocina/`
- `/barra/`
- `/pantalla/`
- `/admin/`

## Firestore collections

The app is prepared to use Firestore as the only database. Collections do not need to exist before the first write.

- `productos`
- `categorias`
- `eventos`
- `tickets`
- `configuracion`

## Base Firebase JSON

A base configuration and seed document file is available at `config/firebase-base-config.json`. It includes the Firebase web configuration plus initial `categorias`, `productos`, `eventos`, and `configuracion` documents so the Firestore project can be loaded with the same structure expected by the app.

## Backend evolution

The Express server is the place for future local-network backend features, such as printing tickets on a network printer or exposing operational APIs for devices on the same LAN.

Caja keeps the selected products in a small browser state store. When the operator presses **Emitir tickets**, the browser sends the selected event and items to the server. The server creates one ticket document per selected product inside a Firestore transaction and increments the event counter atomically.
