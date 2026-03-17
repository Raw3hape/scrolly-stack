# Design System — Foundation Projects

> **Этот файл — справочник по дизайн-системе для разработчиков и AI-агентов.**
> Все визуальные решения принимаются здесь. Компоненты **никогда** не содержат hardcoded значений.

## Философия

1. **Один файл = один ре-скин.** Вся палитра сайта меняется правкой `colors.css`. Все эффекты — `effects.css`.
2. **Semantic > Raw.** Компоненты используют `var(--text-primary)`, а не `var(--color-anchor-900)`.
3. **Zero hardcode.** В component CSS нет ни одного `rgba(...)`, `#hex`, hardcoded `font-size` или `transition duration`. Всё через `var(--token)`.

---

## Файловая структура

```
src/styles/
├── tokens/
│   ├── colors.css         ← Палитра + semantic tokens (⭐ ребрендинг = тут)
│   ├── effects.css        ← Shadows, glass, glow, dot, shimmer, radius
│   ├── typography.css     ← Fluid type scale, serif/sans, component sizes
│   ├── spacing.css        ← Space scale (space-xs → space-3xl)
│   └── transitions.css    ← Timing tokens (fast, base, smooth)
├── base/
│   └── globals.css        ← Reset, body defaults, ::selection
├── utilities.css          ← Утилитарные классы (.section, .container)
└── index.css              ← Barrel import (порядок важен!)
```

---

## Brand Identity System — 5 цветов

| Name | HEX | CSS Prefix | Архетип | Где используется |
|------|-----|-----------|---------|-----------------|
| **Anchor** | `#103740` | `--color-anchor-*` | Trust, Authority | Text, headlines, dark backgrounds |
| **Systems** | `#297373` | `--color-teal-*` | Process, Machine | Brand accent, CTA, links |
| **Growth** | `#3E8C59` | `--color-green-*` | Results, Yield | Success states, CTA gradient end |
| **Foundation** | `#F2EDE4` | `--color-sand-*` | Clarity, Canvas | Page background, glass, cards |
| **Value** | `#D79344` | `--color-gold-*` | Craft, Spark | Warm accent, highlights |

---

## Как использовать токены (для агентов)

### ❌ Никогда

```css
.my-component {
  color: #103740;                          /* hardcoded hex */
  background: rgba(139, 92, 246, 0.25);   /* hardcoded rgba */
  font-size: 1.25rem;                     /* hardcoded size */
  transition: color 0.2s ease;            /* hardcoded timing */
}
```

### ✅ Всегда

```css
.my-component {
  color: var(--text-primary);              /* semantic token */
  background: var(--surface-base);         /* semantic token */
  font-size: var(--font-size-lg);          /* type scale token */
  transition: color var(--transition-fast); /* timing token */
}
```

### Если нужен новый размер/эффект

Не пишите значение inline — **создайте токен:**

```css
/* 1. Добавить в tokens/typography.css или tokens/effects.css */
--font-size-my-component: 1.125rem;

/* 2. Использовать в компоненте */
.my-component { font-size: var(--font-size-my-component); }
```

---

## Token Reference

### Цвета (colors.css)

**Surfaces — фоны:**
| Token | Назначение |
|-------|-----------|
| `--surface-base` | Основной фон страницы (cream) |
| `--surface-card` | Фон карточек (lightest cream) |
| `--surface-card-hover` | Карточка при hover |
| `--surface-overlay` | Полупрозрачный overlay |
| `--surface-glass` | Glass-эффект фон |

**Text — текст:**
| Token | Назначение |
|-------|-----------|
| `--text-primary` | Основной текст (Anchor dark) |
| `--text-secondary` | Второстепенный (Anchor medium) |
| `--text-muted` | Приглушённый (neutral) |
| `--text-subtle` | Еле заметный (neutral light) |
| `--text-inverse` | Белый текст на тёмном фоне |

**Accents — акценты:**
| Token | Назначение |
|-------|-----------|
| `--accent-brand` | Основной accent (Systems teal) |
| `--accent-brand-hover` | Hover состояние |
| `--accent-warm` | Тёплый accent (Value gold) |
| `--accent-warm-hover` | Hover тёплого accent |

**Gradients:**
| Token | Визуал |
|-------|--------|
| `--gradient-primary` | Teal → Green (CTA кнопки) |
| `--gradient-primary-hover` | Darker teal → green |
| `--gradient-warm` | Gold → Light gold |
| `--gradient-subtle` | Почти прозрачный teal+green |

**Status:**
| Token | Цвет |
|-------|------|
| `--status-success` | Growth green |
| `--status-warning` | Value gold |
| `--status-error` | Red |
| `--status-info` | Systems teal |

### Эффекты (effects.css)

**Shadows:**
| Token | Размер |
|-------|--------|
| `--shadow-sm` | Subtle (form inputs) |
| `--shadow-md` | Medium (cards) |
| `--shadow-lg` | Large (elevated cards) |
| `--shadow-xl` | Extra large (modals, drawers) |

**Glass:**
| Token | Прозрачность | Где |
|-------|-------------|-----|
| `--glass-bg` | 70% | Header default |
| `--glass-bg-scrolled` | 85% | Header при скролле |
| `--glass-bg-sticky` | 92% | Header sticky |
| `--glass-card-bg` | 65% | Mobile step cards, tooltip |
| `--glass-card-border` | White 50% border | Card/tooltip border |
| `--glass-card-shadow` | Soft diffused | Mobile card shadow |

**Decorative:**
| Token | Что делает |
|-------|-----------|
| `--overlay-scrim` | Затемнение за mobile drawer |
| `--shimmer-color` | Блик на hover CTA кнопок |
| `--inset-highlight` | Стеклянный блик (inset top) |
| `--inset-highlight-strong` | Сильный блик |
| `--inset-highlight-subtle` | Слабый блик |
| `--tooltip-shadow` | Тень для HoverTooltip |
| `--dot-border` | Border timeline dot |
| `--dot-shadow` / `--dot-shadow-active` | Тень dot |
| `--dot-icon-shadow` / `--dot-icon-shadow-active` | Drop-shadow иконок |
| `--dot-ring-active` | Внешнее кольцо active dot |
| `--dot-border-active` | Border color active dot |

**Button:**
| Token | Назначение |
|-------|-----------|
| `--btn-padding` | Padding CTA кнопок |
| `--btn-font-weight` | Font weight кнопок |
| `--btn-radius` | Border radius кнопок |
| `--btn-shadow-primary` | Shadow primary CTA |
| `--glow-primary` | Glow при hover CTA |

### Типографика (typography.css)

**Шрифты:**
| Variable | Шрифт | Роль |
|----------|-------|------|
| `--font-family` | Satoshi | Body, UI, buttons |
| `--font-family-serif` | DM Serif Display | Headlines (h1-h3, hero) |

**Fluid Scale (auto-adapts 320→1400px):**
| Token | Диапазон | Где |
|-------|---------|-----|
| `--font-size-xs` | 11→12px | Captions, overlines |
| `--font-size-sm` | 13→14px | Small text |
| `--font-size-base` | 15→16px | Body text |
| `--font-size-lg` | 17→20px | Large body |
| `--font-size-xl` | 20→24px | h4 |
| `--font-size-2xl` | 24→32px | h3 |
| `--font-size-3xl` | 30→40px | h2 |
| `--font-size-4xl` | 36→52px | h1 |
| `--font-size-hero` | 44→72px | Hero display |

**Composed (font shorthand):**
| Token | Шрифт | Weight |
|-------|-------|--------|
| `--font-display` | Serif | 400 |
| `--font-h1` | Serif | 400 |
| `--font-h2` | Serif | 400 |
| `--font-h3` | Serif | 400 |
| `--font-h4` | Sans | 600 |
| `--font-body-lg` | Sans | 400 |
| `--font-body` | Sans | 400 |
| `--font-body-sm` | Sans | 400 |
| `--font-caption` | Sans | 500 |
| `--font-button` | Sans | 600 |

**Component-specific sizes (Header, Steps, Tooltip):**
| Token | Значение | Компонент |
|-------|---------|----------|
| `--font-size-header-wordmark` | 1.25rem | Header wordmark |
| `--font-size-header-nav` | 0.9375rem | Nav links |
| `--font-size-header-cta` | 0.9375rem | Header CTA |
| `--font-size-step-title` | 2.5rem | Step headline |
| `--font-size-step-title-mobile` | 1.5rem | Step headline mobile |
| `--font-size-tooltip-title` | 1rem | Tooltip title |
| ...и ещё 10 | | (см. typography.css) |

---

## Рецепты: Частые задачи

### Полный ребрендинг (смена палитры)

1. Изменить hex-значения в `colors.css` (секция Brand Palette)
2. Обновить `rgba()` в `colors.css` (gradients, glows, selection)
3. Обновить `rgba()` в `effects.css` (shadows тoned, glass base)
4. Обновить hex-значения в `data.ts` (15 блоков × 4 цвета)
5. `npm run build` → всё подхватится автоматически

### Добавить новый компонент

1. Создать `src/components/Name/Name.tsx` + `Name.css`
2. В CSS использовать **только** `var(--token)` — никаких hex/rgba
3. Если нужен уникальный размер → добавить токен в `typography.css`
4. Если нужен уникальный эффект → добавить токен в `effects.css`

### Сменить шрифт

1. Headlines: заменить `DM_Serif_Display` в `layout.tsx`
2. Body: заменить файлы в `src/fonts/` и обновить `localFont()` в `layout.tsx`
3. CSS variables `--font-family` / `--font-family-serif` подхватятся автоматически

### Добавить dark mode (будущее)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface-base: var(--color-anchor-900);
    --text-primary: var(--color-sand-100);
    /* ... переопределить semantic tokens */
  }
}
```

---

## 3D Block Color Mapping (data.ts)

| Layer | Роль | Цветовая тема |
|-------|------|--------------|
| **A** (4 блока, grid) | Outcomes | Anchor + Value + Systems + Growth |
| **B** (3 блока, row) | One Approach | Systems teal gradient (dark → light) |
| **C** (8 блоков, full) | Engine | Full spectrum: Anchor → Systems → Growth → Value |

Каждый блок имеет 4 цвета:
- `color` — основной цвет блока
- `gradientColorB` — второй цвет градиента
- `activeColor` — цвет при hover/active
- `activeGradientColorB` — второй цвет при active
- `textColor` — цвет текста (контрастный)
