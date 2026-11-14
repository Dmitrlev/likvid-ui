# likvid-ui

A glass React component kit in Apple Liquid Glass style.

## Install

```bash
yarn add likvid-ui
```

Import the base tokens once — the order does not matter, the layer always sits below your own styles:

```js
import 'likvid-ui/theme.css';
```

## Peer dependencies

`likvid-ui/next` (`NavBarBase`, `LiquidRadio`) **requires `swiper` to be installed in the project** —
use the version already present there or install the latest one: any release ≥ 11 satisfies the peer
range, no `@11` pin needed. npm 7+ installs peers automatically; with yarn or pnpm run
`yarn add swiper` (or `pnpm add swiper`) yourself.

`next` is an optional peer — only for Next.js apps; in other projects shim/alias `next/link` and
`next/navigation` as the playground does.

## Exports

- `likvid-ui` — `LiquidContainer`, `LiquidButton`, `ButtonLoader`
- `likvid-ui/next` — `NavBarBase`, `LiquidRadio` (requires `next`, `swiper`)
- `likvid-ui/theme.css` — kit tokens (`@layer likvid.tokens`)
