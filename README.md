# Scrolly Stack 🏠

Интерактивный 3D scrollytelling сайт для презентации продукта Roofs.

## 🌐 Live Demo

**[scrolly-stack.vercel.app](https://scrolly-stack.vercel.app)**

---

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск локально

```bash
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере.

---

## 📦 Деплой на Vercel

### Автоматический деплой (рекомендуется)

Проект подключен к Vercel. Каждый `git push` в `main` автоматически деплоит изменения!

```bash
# Внести изменения, затем:
git add .
git commit -m "Описание изменений"
git push
```

### Ручной деплой

```bash
npx vercel --prod
```

---

## 🛠 Workflow: Как вносить изменения

### 1. Редактирование контента

Основные данные находятся в:

- `src/data.js` — тексты и структура шагов
- `src/components/Overlay.jsx` — Hero секция и layout
- `src/components/Block.jsx` — 3D блоки и их цвета

### 2. Редактирование стилей

- `src/index.css` — глобальные стили
- `src/components/*.css` — стили компонентов

### 3. После изменений

```bash
# 1. Проверить локально
npm run dev

# 2. Закоммитить и запушить
git add .
git commit -m "Описание изменений"
git push

# 3. Vercel автоматически задеплоит за ~30 секунд
```

---

## 📁 Структура проекта

```
scrolly-stack/
├── src/
│   ├── components/
│   │   ├── Stack.jsx          # 3D модель (стек блоков)
│   │   ├── Block.jsx          # Отдельный 3D блок
│   │   ├── Overlay.jsx        # UI слой (тексты, hero)
│   │   ├── Header.jsx         # Навигация
│   │   ├── HoverTooltip.jsx   # Тултип при наведении
│   │   └── BackgroundEffects.jsx # Фоновые эффекты
│   ├── data.js                # Контент и данные
│   ├── App.jsx                # Главный компонент
│   └── index.css              # Глобальные стили
├── public/                    # Статические файлы
└── package.json
```

---

## 🔗 Ссылки

- **Live сайт:** [scrolly-stack.vercel.app](https://scrolly-stack.vercel.app)
- **GitHub:** [github.com/Raw3hape/scrolly-stack](https://github.com/Raw3hape/scrolly-stack)
- **Vercel Dashboard:** [vercel.com/nikitas-projects-3a31754b/scrolly-stack](https://vercel.com/nikitas-projects-3a31754b/scrolly-stack)

---

## 🔧 Технологии

- **React** + **Vite** — фреймворк и сборка
- **Three.js** + **React Three Fiber** — 3D графика
- **GSAP** + **ScrollTrigger** — анимации скролла
- **Vercel** — хостинг и CI/CD
