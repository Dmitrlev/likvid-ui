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

The project can override any token in its own `:root` (legacy names `--color-main`,
`--radius-widget`, `--radius-pull` are picked up through the bridge). The only token
that lives outside theme.css is the NavBarBase/LiquidRadio bleed inset:

```css
:root { --likvid-padding-inline-mobile: <horizontal page padding on mobile>; }
```

## Exports

- `likvid-ui` — `LiquidContainer`, `LiquidButton`, `ButtonLoader`
- `likvid-ui/next` — `NavBarBase`, `LiquidRadio` (requires `next`, `swiper`)
- `likvid-ui/theme.css` — kit tokens (`@layer likvid.tokens`)

## Scripts

```bash
yarn build        # tsc + copy CSS into dist
yarn login        # npm login
yarn pub          # publish (prepack builds dist itself)
```
