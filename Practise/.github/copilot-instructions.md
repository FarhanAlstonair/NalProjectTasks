# Copilot Instructions for This Codebase

## Overview
This project is a React application bootstrapped with Vite. It uses modern React (JSX, functional components) and is organized for clarity and simplicity. The main entry point is `src/main.jsx`, which renders the root `App` component. Movie data is managed in a static file (`src/MovieData.jsx`).

## Key Files & Structure
- `src/App.jsx`: Main application component. Handles rendering and composition of UI.
- `src/MovieCard.jsx`: Likely a presentational component for displaying individual movie details.
- `src/MovieData.jsx`: Exports an array of movie objects. This is the single source of movie data.
- `src/main.jsx`: Entry point; renders `<App />` into the DOM.
- `public/`: Static assets (e.g., images, icons).
- `vite.config.js`: Vite configuration.
- `eslint.config.js`: ESLint rules for code quality.

## Data Flow & Patterns
- Movie data is imported from `MovieData.jsx` and passed as props to components (e.g., `MovieCard`).
- Components are functional and use props for data flow. No global state management (like Redux) is present.
- Styling is handled via CSS files in `src/` (e.g., `App.css`, `index.css`).

## Developer Workflows
- **Start Dev Server:**
  ```powershell
  npm run dev
  ```
  This launches the Vite dev server with hot module reload.
- **Build for Production:**
  ```powershell
  npm run build
  ```
- **Preview Production Build:**
  ```powershell
  npm run preview
  ```
- **Linting:**
  ```powershell
  npm run lint
  ```

## Conventions & Patterns
- Use functional React components and hooks (if needed).
- Keep data in static files unless integrating an API.
- Pass data via props; avoid unnecessary state.
- Use CSS modules or plain CSS for styling.
- Keep components small and focused.

## Integration Points
- No backend/API integration is present. All data is local.
- No routing or advanced state management is used.

## Examples
- To add a new movie, update the array in `src/MovieData.jsx`.
- To create a new UI component, add a `.jsx` file in `src/` and import it in `App.jsx`.

---
If you add new patterns or workflows, update this file to help future AI agents and developers.
