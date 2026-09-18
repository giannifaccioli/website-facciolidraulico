# Favicon artwork

Three simplified vector marks based on the tap-shaped F in the existing logo.
The site's main logo has not been changed.

Open `favicon-preview.html` for all three options, actual-size examples and
light/dark browser-tab previews. This preview is outside `docs/` and is not
published with the website.

| Option | SVG source | Status |
| --- | --- | --- |
| Dark monogram | `docs/assets/favicons/monogram-dark.svg` | Alternative |
| Light monogram | `docs/assets/favicons/monogram-light.svg` | Active on all seven pages |
| Tap | `docs/assets/favicons/tap.svg` | Alternative |

Each option has PNG exports at 16, 32, 48, 180, 192 and 512 pixels, plus a
multi-resolution ICO containing 16, 32 and 48 pixel images. These are in
`docs/assets/favicons/`.

The active set also supplies `docs/favicon.svg`, `docs/favicon.ico`, `docs/favicon-48.png` and
`docs/apple-touch-icon.png`. HTML favicon links use content-hash query strings.

To regenerate the raster exports, use Node.js with the `sharp` package available:

```sh
node scripts/build-favicons.cjs
```

After changing artwork, refresh the favicon `?v=` values in all seven HTML pages
using the first 12 lowercase characters of each linked asset's SHA-256 hash.
