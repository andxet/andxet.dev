# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start          # Start dev server (http://localhost:8000)
yarn build          # Production build (requires env vars)
yarn serve          # Serve production build locally
yarn clean          # Clear Gatsby cache
yarn lint           # Run ESLint on src/
yarn check-types    # TypeScript type-check without emitting
yarn setup          # CLI to configure Contentful space (first-time setup)
```

Build requires environment variables:
```bash
SPACE_ID=xxxxx ACCESS_TOKEN=yyyyy yarn build
```

## Environment Variables

Create a `.env` file at the root (excluded from git):
- `SPACE_ID` — Contentful space ID (only needed for `yarn dump` or if re-enabling Contentful)
- `ACCESS_TOKEN` — Contentful Delivery API token (only needed for `yarn dump` or if re-enabling Contentful)
- `DRAFT_INCLUDED_ACCESS_TOKEN` — Contentful Preview API token (only needed for `yarn dump`)
- `ANALYTICS_ID` — Google Analytics tracking ID (optional, enables analytics plugin)
- `IUBENDA_SITE_ID` + `COOKIE_POLICY_ID` — iubenda cookie banner (optional, both required together)

## Architecture

This is a personal portfolio site built with **Gatsby 5** + **TypeScript**. Content is stored as local Markdown files in `content/`; images are in `static/images/`.

**Data flow:** Markdown files (`content/`) → GraphQL (via `gatsby-source-filesystem` + `gatsby-transformer-remark`) → custom hooks in `src/queries/` → section components

**Content files:**
- `content/about.md` — name, roles, social links, about text, profile image path
- `content/projects/*.md` — one file per project; filename format `YYYY-MM-DD-slug.md`; `published: false` hides the project

**Re-enabling Contentful:** `gatsby-source-contentful` is still installed. See README for instructions.

**Key directories:**
- `src/sections/` — Page sections: `Landing`, `About`, `Projects`, `Writing` (Writing is currently excluded from the homepage)
- `src/components/` — Shared UI components (Layout, Header, Footer, Card, Section, etc.)
- `src/queries/` — GraphQL static query hooks (`useAboutMeQuery`, `useProjectsQuery`, `useSiteQuery`, etc.)
- `src/utils/` — Constants (including the `SECTION` enum), helpers, icon utilities

**Theming:** Colors are defined in `src/colors.json` and consumed in `gatsby-config.ts`. The UI uses **Rebass** (styled-system based components) with **styled-components**.

**Icons:** Font Awesome icons are registered in `src/icons.ts` — only icons listed in the `ICONS` array are bundled. To add a new icon for a social link, import it and add it to the array.

**Medium integration:** `gatsby-node.js` reads the `mediumUser` field from the Contentful `About` entry at build time and passes it to `gatsby-source-medium` for fetching posts.

**Sections toggle:** To enable/disable sections, edit `src/pages/index.tsx` and the `SECTION` enum in `src/utils/constants.ts` (the `writing` section is currently commented out).

**Deployment:** Netlify (auto-deploy from the `andxet.dev` branch).
