# likvid-ui

Glass-кит React-компонентов в стиле Apple Liquid Glass.

## Установка

```bash
yarn add likvid-ui
```

Подключите базовые токены один раз — в любом порядке, слой ниже ваших стилей:

```js
import 'likvid-ui/theme.css';
```

Проект может переопределить любой токен в своём `:root` (legacy-имена `--color-main`,
`--radius-widget`, `--radius-pull` подхватываются через bridge). Единственный токен вне
theme.css — bleed-инсет NavBarBase/LiquidRadio:

```css
:root { --likvid-padding-inline-mobile: <горизонтальный паддинг страницы на мобилке>; }
```

## Экспорты

- `likvid-ui` — `LiquidContainer`, `LiquidButton`, `ButtonLoader`
- `likvid-ui/next` — `NavBarBase`, `LiquidRadio` (нужны `next`, `swiper`)
- `likvid-ui/theme.css` — токены кита (`@layer likvid.tokens`)

## Скрипты

```bash
yarn build        # tsc + копирование CSS в dist
yarn login        # npm login
yarn pub          # публикация (prepack сам соберёт dist)
```
