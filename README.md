# Wilfex Kipchirchir | Backend Engineering Portfolio

Portfolio site for backend and software engineering work. Each project is presented as a short case study: the problem, the architecture, and the decisions behind it.

Live: https://wilfex-software-engineer-portfolio.vercel.app

## What is on the site

- **Projects** with an architecture diagram, key design decisions and API surface for each
  - **APEXSYNC**: Django REST API with a versioned tax compliance engine, forecasting and anomaly detection
  - **Mini Redis**: Redis-compatible server in Go with RESP, key expiry, append-only file persistence, Docker packaging and CI
- **About** with skills grouped by area and professional experience
- **Contact** form and links

## Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Mermaid (loaded lazily for diagrams). Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev      # http://localhost:8080 or the port Vite prints
npm run build    # production build into dist/
npm run lint
```

## Adding a project

Projects live in `src/components/Projects.tsx` as plain objects. Fill in the same fields for each one so the case studies stay consistent:

| Field | Purpose |
|---|---|
| `title`, `description`, `techStack` | Card content |
| `status` | For example `Shipped` or `In progress` |
| `problem` | What needed solving and why |
| `architecture` | Mermaid diagram source |
| `decisions` | Design decisions and trade offs |
| `endpoints` | Optional API table |
| `repoLink`, `liveLink` | Optional links |

## Structure

```
src/
  components/   Hero, About, Projects, ProjectCard, Mermaid, Contact, Navbar, Footer
  layouts/      MainLayout
  pages/        Routes
  lib/          Utilities
```
