# Personal Portfolio - React Version

This is a modern React version of the original Angular portfolio project. The project has been converted from Angular 9 to React 18 with TypeScript and Vite.

## Features

- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Bootstrap 5** for styling
- **React Toastify** for notifications
- **React Spinners** for loading states
- **AOS (Animate On Scroll)** for animations
- **Axios** for HTTP requests

## Project Structure

```
src/
├── components/
│   ├── Profile/
│   │   └── Profile.tsx          # Main profile component
│   ├── Header/
│   │   └── Header.tsx           # Navigation header
│   ├── Intro/
│   │   └── Intro.tsx            # Hero section
│   ├── About/
│   │   └── About.tsx            # About section
│   ├── Skills/
│   │   └── Skills.tsx           # Skills section
│   ├── Experience/
│   │   └── Experience.tsx       # Experience section
│   ├── Publications/
│   │   └── Publications.tsx     # Publications section
│   ├── Education/
│   │   └── Education.tsx        # Education section
│   ├── Contact/
│   │   └── Contact.tsx          # Contact form
│   └── Footer/
│       └── Footer.tsx           # Footer
├── assets/                      # Static assets (CSS, JS, images)
├── App.tsx                      # Main app component
├── main.tsx                     # React entry point
└── index.css                    # Global styles
```

## Key Changes from Angular

1. **Component Structure**: Angular components converted to React functional components with hooks
2. **State Management**: Angular services replaced with React hooks and context
3. **Routing**: Angular Router replaced with React Router
4. **Forms**: Angular template-driven forms converted to React controlled components
5. **HTTP**: Angular HttpClient replaced with Axios
6. **Styling**: Maintained Bootstrap and custom CSS
7. **Animations**: AOS library integration maintained

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Dependencies

### Core
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.0.2
- Vite 4.4.5

### Routing
- React Router DOM 6.8.1

### UI & Styling
- Bootstrap 5.3.0
- React Bootstrap 2.8.0
- AOS 2.3.4

### Utilities
- Axios 1.4.0
- React Toastify 9.1.3
- React Spinners 0.13.8

## Migration Notes

The conversion maintains the same visual design and functionality as the original Angular version while leveraging modern React patterns:

- **Functional Components**: All components use React hooks instead of Angular lifecycle methods
- **TypeScript**: Full TypeScript support maintained
- **Responsive Design**: Bootstrap classes and custom CSS preserved
- **Contact Form**: Formspree integration maintained
- **Social Links**: All external links and social media connections preserved

## Future Enhancements

- Add more interactive components
- Implement dark/light theme toggle
- Add portfolio projects section
- Enhance animations and transitions
- Add blog section
- Implement SEO optimizations 