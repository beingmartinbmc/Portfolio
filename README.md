# Ankit Sharma — Portfolio

An Angular 22 portfolio focused on backend engineering, AI agents, writing, and open-source work.

## Highlights

- Standalone Angular application with responsive, custom SCSS
- Deferred Three.js avatar and AI-generated platform game
- Portfolio-aware AI chat with optional text-to-speech
- Keyboard-accessible interactive cards and game controls
- Gamified achievements, experience map, and progress tracking
- Production build deployed to GitHub Pages

The AI chat sends messages—and voice text when enabled—to third-party AI services. Do not submit sensitive information.

## Requirements

- Node.js 24
- npm

## Local development

```bash
npm ci
npm start
```

The development server runs at `http://localhost:4200`.

## Quality checks

```bash
npm run lint
npm run test:ci
npm run build:prod
npm run e2e:install  # first Playwright run only
npm run e2e
```

Unit-test coverage is enforced in `karma.conf.js`. Playwright covers the critical render and keyboard-interaction paths.

## Production and deployment

```bash
npm run build:prod
```

Optimized output is written to `dist/portfolio/`. GitHub Actions validates the application and deploys that artifact to GitHub Pages; generated output is not committed.

## Structure

```text
src/
├── app/
│   ├── config/          # Public client configuration and links
│   ├── profile/         # Portfolio sections, avatar, and game
│   ├── services/        # Achievements, audio, and scroll progress
│   ├── shared/          # Reusable UI and markdown rendering
│   └── app.component.*  # Standalone root component
├── assets/              # Images, audio, and optimized 3D model
├── environments/        # Environment-specific API endpoints
├── styles.scss          # Global design system
└── main.ts              # bootstrapApplication entry point
```

## Core stack

- Angular 22.0.6
- TypeScript 6.0
- RxJS 7.8
- Three.js 0.185
- Jasmine/Karma for unit tests
- Angular ESLint
- Playwright