# Portfolio — Akash Kurdekar

Personal portfolio site for Akash Kurdekar, Software Engineer, Designer & Creative Developer. Built as a single-page, animation-heavy experience with smooth scrolling, custom cursor interactions, and a project showcase.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tooling and dev server
- **Tailwind CSS 4**
- **GSAP** — scroll and UI animations
- **Three.js** — WebGL visuals
- **Lenis** — smooth scrolling

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

## Project Structure

```
src/
├── assets/           # Images, textures, and other static assets
│   └── projects/     # Screenshots used in the project showcase/modal
├── components/        # Page sections and UI components
│   ├── Header.tsx / Hero.tsx / Footer.tsx
│   ├── Projects.tsx, ProjectsDesktop.tsx, ProjectsStack.tsx,
│   │   ProjectCard.tsx, ProjectModal.tsx   # Project showcase
│   ├── Resume.tsx      # Resume/experience section
│   ├── Work.tsx, Article.tsx, Quote.tsx
│   ├── SmoothScroll.tsx  # Lenis smooth-scroll setup
│   ├── Loader.tsx        # Initial page loader
│   └── WhatsAppButton.tsx
├── App.tsx
└── main.tsx
```

## Deployment

This is a static Vite build — deploy the contents of `dist/` after running `npm run build` to any static host (e.g. Vercel, Netlify, GitHub Pages).
