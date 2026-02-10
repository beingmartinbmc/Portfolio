# Personal Portfolio - Angular

A modern personal portfolio application built with **Angular 21** and **Angular Material**.

## Features

- **Angular 21** with TypeScript
- **Angular Material & CDK** for UI components
- **Angular Router** for navigation
- **Bootstrap 5** for layout and styling
- **Three.js** for 3D avatar rendering
- **Audio visualizer** with Web Audio API
- **AI Quiz Game** and **AI Code Review** interactive sections
- **Particle effects** background
- **Responsive design** for mobile and desktop

## Project Structure

```
src/
├── app/
│   ├── ai-face/                 # AI face component
│   ├── config/                  # App configuration
│   ├── profile/
│   │   ├── about/               # About section
│   │   ├── ai-code-review/      # AI code review feature
│   │   ├── ai-quiz-game/        # AI quiz game feature
│   │   ├── avatar-3d/           # 3D avatar with Three.js
│   │   ├── blog/                # Blog section
│   │   ├── contact/             # Contact form
│   │   ├── education/           # Education section
│   │   ├── experience/          # Experience section
│   │   ├── footer/              # Footer
│   │   ├── header/              # Navigation header with audio visualizer
│   │   ├── intro/               # Hero/intro section
│   │   ├── particle/            # Particle effects
│   │   ├── publications/        # Publications section
│   │   └── skills/              # Skills section
│   ├── services/                # Shared services
│   ├── app.module.ts            # Root module
│   └── app-routing.module.ts    # Route definitions
├── assets/                      # Static assets (images, audio, 3D models, CSS, JS)
├── environments/                # Environment configurations
├── styles.scss                  # Global styles
└── main.ts                      # Application entry point
```

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Build

```bash
npm run build
```

### Production Build

```bash
npm run build:prod
```

### Deploy (GitHub Pages)

```bash
npm run deploy
```

Output is generated in the `docs/` directory.

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Dependencies

### Core
- Angular 21.1.3
- TypeScript 5.9.3
- RxJS 7.8.2
- Zone.js 0.15.1

### UI & Styling
- Angular Material 21.1.3
- Angular CDK 21.1.3
- Bootstrap 5.3.7
- ngx-spinner 19.0.0

### 3D & Graphics
- Three.js 0.181.1

### Testing
- Karma 6.4.4
- Jasmine 4.6.1