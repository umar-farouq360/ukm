# UKM University (ABU UI/UX Talent Hunt 2026, Challenge 3)

An online learning and skills development platform, presented inside a fictional university identity.
Frontend only: React + TypeScript + Vite + Tailwind CSS. No backend, database or payment integration.

## Run it in under a minute
- **Prebuilt:** serve the `dist/` folder with any static server, e.g. `npx serve dist`. Routes use hash URLs, so no rewrite rules are needed.
- **From source:** `npm install && npm run dev` (build: `npm run build`).
- Note: browsers block ES modules on `file://`, so double-clicking `dist/index.html` will not work. Use a static server.

## Reviewer demo path (shortest route, about 6 clicks to a first lesson)
1. Home: search or choose a programme category.
2. Open a free course (for example CERT-102) and press **Enrol for free**.
3. On the sign-in page press **Use demo login** (`demo@ukm.example` / `demo1234`).
4. Confirm enrolment, then **Start the first lesson** and press **Mark as complete**.
5. Open the assistant and ask "How much does Project Management cost?".
6. Open **Certificates**: the demo learner already has one completed course (CERT-101).

Demo learner state: one completed course with certificate, one in progress (CSC-101), two allocated (CSC-102, MTH-101), the rest available. "Reset demo data" is on the dashboard.

## Challenge 3 requirements map
| # | Official requirement | Where |
|---|---|---|
| 1 | Learning homepage | `/` (`src/pages/Home.tsx`) |
| 2 | Course discovery, live search and filtering | `/courses` (results update as you type; URL-synced filters) |
| 3 | Course details | `/courses/:id` |
| 4 | Course enrolment | `/enrol/:id` (manual) plus allocated courses on registration/demo |
| 5 | Learning dashboard | `/dashboard` |
| 6 | Learning progress | Dashboard cards, lesson sidebar, outstanding activities |
| 7 | Certificates and achievements | `/certificates`, `/certificates/:id` |
| 8 | AI assistant chatbot | Floating panel on every page (demo assistant) |

## Real vs simulated
Real (in the browser): routing, search/filter/sort, enrolment, allocation, lesson completion, progress, certificate eligibility, themes, low-data mode.
Simulated: sign-in (passwords never stored), payment (no card details collected, "Demo payment, no real charge"), the assistant (rule-based, answers from sample data, labelled as a demo), video (placeholder, no media files).
All people, courses, fees and certificates are fictional.

## Structure
`src/data.ts` (catalogue, API-shaped), `src/store.tsx` (state in localStorage; the seam for a real API), `src/assistant.ts`, `src/components`, `src/pages`.

## Performance and accessibility checks performed so far
- First-load JavaScript: about 105 KB gzipped (331 KB raw), CSS about 11 KB gzipped, one 27 KB font. Other routes are lazy chunks of 0.3 to 10 KB. Images: 16 WebP files (course illustrations 5 to 14 KB each, hero 10 KB), lazy-loaded below the fold and skipped in low-data mode. No third-party scripts.
- Colour contrast: `node scripts/contrast.mjs` checks the real token pairs in both themes. All pairs meet AA (4.5:1 text, 3:1 controls). `#22C55E` (2.28:1 on white) is never used for text.
- Type-check and production build pass.
- **Not yet done:** manual keyboard and screen-reader pass, screenshots at 360/430/768/1024/1280/1440, throttled-network test, Lighthouse run. These must be completed in a real browser before submission.

## Assets and licences
- Plus Jakarta Sans (SIL Open Font License 1.1) via `@fontsource-variable/plus-jakarta-sans`, Latin subset only.
- Lucide icons (ISC), imported individually.
- React, React Router (MIT), Tailwind CSS (MIT), Vite (MIT).

## AI-assistance disclosure
This build was generated with AI assistance (Claude): the code scaffold, sample copy and sample data. Design decisions (four programme categories, green academic identity, text-first learning, low-data mode, allocation plus manual enrolment) come from the team's brief. The team must be able to explain every major choice.

## Motion and colour (UI layer only)
- Motion uses opacity and transform only, honours `prefers-reduced-motion`, and never moves layout: page and route fades, staggered hero, scroll reveals, animated menus and filter panels (no display toggling), cross-faded theme switch, FLIP-smoothed result lists.
- Assistant launcher eases in after idle, pulses three times, then rests; the panel scales in and out and replies fade in.
- Course cards: lift, category-coloured accent bar, image zoom, title underline and arrow nudge on hover or keyboard focus.
- Two added hues complete a four-hue category set (green undergraduate, violet masters, azure postgraduate, amber certificate). Violet is the triad partner of green and amber; azure is the complement of amber and analogous to green. Hue always accompanies a text label and icon, and the primary action stays green.
- Course illustrations are generated WebP files in `public/images/courses/<course-id>.webp`.
