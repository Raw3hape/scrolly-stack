# Design System

Краткий справочник для разработчиков и AI-агентов. Источник истины для визуальных решений: токены в `src/styles/tokens/`.

## Базовые правила

1. Компонентный CSS использует только токены: `var(--token)`.
2. Raw `#hex`, `rgba(...)`, жёсткие `font-size`, `transition`, `z-index` допустимы только в token-файлах.
3. Если не хватает значения, сначала добавь токен, потом используй его в компоненте.
4. Предпочитай semantic tokens: `--text-primary`, `--surface-base`, `--accent-brand`.

## Актуальные token-файлы

```text
src/styles/tokens/
├── colors.css            # palette + semantic color tokens
├── typography.css        # font families, type scale, composed font tokens
├── spacing.css           # spacing, layout, container, icon sizes
├── motion.css            # durations, easings, transition tokens
├── effects.css           # radius, shadows, blur, glass, interaction tokens
├── z-index.css           # semantic stacking scale
└── stitch-overrides.css  # Stitch-theme delta поверх базовых токенов
```

`src/styles/index.css` импортирует токены в правильном порядке. `src/app/layout.tsx` подключает `stitch-overrides.css` и шрифты.

## Шрифты

Текущая схема:

- Headings: `Newsreader`
- Body/UI: `Inter`
- Связка в токены идёт через `src/app/layout.tsx` и `src/styles/tokens/stitch-overrides.css`

Не ориентируйся на старые комментарии про `Satoshi`, `DM Serif Display` или self-hosted font pipeline, если задача не про cleanup legacy comments.

## Где что менять

- Палитра и semantic colors: `src/styles/tokens/colors.css`
- Размеры, контейнеры, spacing: `src/styles/tokens/spacing.css`
- Типографика: `src/styles/tokens/typography.css`
- Motion/transition: `src/styles/tokens/motion.css`
- Shadows, glass, blur, radii, interactive effects: `src/styles/tokens/effects.css`
- Stitch-specific global overrides: `src/styles/tokens/stitch-overrides.css`

## Практика для компонентов

- Компонентный CSS живёт рядом с компонентом.
- Используй существующие utility/layout классы и shared wrappers, например `v2-content-wrapper`, прежде чем вводить новые.
- `stitch-overrides.css` не место для одноразовых компонентных хакапов. Туда идут только глобальные Stitch-theme overrides.
- Если нужен новый section-level визуальный паттерн, сначала проверь, можно ли выразить его через существующие section props и токены.

## Rebrand / Theme Delta

Полный визуальный сдвиг обычно требует:

1. Обновить `colors.css`
2. Обновить `effects.css`, если завязаны тени/glass/blur
3. При необходимости обновить `motion.css`
4. Обновить `stitch-overrides.css`, если нужен именно theme-level delta
5. Для 3D-палитры обновить данные соответствующего scrolly variant

## Deprecated

- `transitions.css` как источник transition-токенов больше не актуален; используй `motion.css`.
- Инструкции, завязанные на `/v2/*` namespace, устарели. Общие layout-паттерны живут в `src/app/v2-shared.css`, но новые страницы создаются в обычном `src/app/**/page.tsx`.
- `src/features/scrolly-experience/data.ts` не является местом для новых визуальных данных; это compatibility shim.
