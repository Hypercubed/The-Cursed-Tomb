## 1. Favicon Assets

- [x] 1.1 Create `public/favicon.svg`: square `viewBox`, dark tomb-tile background, bold stroke-based gold Ankh (round caps/joins), self-contained, legible at 16×16px
- [x] 1.2 Create `public/apple-touch-icon.png`: 180×180 PNG of the same gold Ankh on an opaque dark tile (no transparency)

## 2. Document Head Wiring

- [x] 2.1 Add `<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg">` to `index.html` head
- [x] 2.2 Add `<link rel="apple-touch-icon" href="%BASE_URL%apple-touch-icon.png">` to `index.html` head

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm `dist/favicon.svg` and `dist/apple-touch-icon.png` exist
- [x] 3.2 Serve the built site and verify the favicon is legible at 16px in the browser tab and no 404 for favicon assets occurs
- [x] 3.3 Verify favicon resolves under the `/The-Cursed-Tomb/` base path (dev server and/or deployed GitHub Pages URL)
