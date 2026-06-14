# LocroPOS

LocroPOS is an open-source web application for clubs, festivals and food stands.

## Static deployment on GitHub Pages

The app is ready to be published directly from the `public/` folder with GitHub Pages.

1. Create a Firebase web app and enable Firestore plus anonymous authentication.
2. Copy your Firebase web configuration into `public/js/config/firebaseConfig.js`.
3. Push to the `main` branch.
4. In GitHub, enable **Settings → Pages → Source: GitHub Actions**.
5. Open the published `github.io` URL and use the app from `/caja/`.

Firebase web configuration is public by design. Do not put service account keys or private credentials in this repository.

## Local development

```bash
npm install
npm start
```

Then open <http://localhost:3000/caja/>.

## Routes

- `/caja/`
- `/cocina/`
- `/barra/`
- `/pantalla/`
- `/admin/`

## Firestore collections

- `productos`
- `pedidos`
- `pedido_items`
- `configuracion`
