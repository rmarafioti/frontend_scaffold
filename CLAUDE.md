# CLAUDE.md — <!-- FILL: the website's name -->

@docs/cms/client-website.md
@docs/site.md

**Template or client website:** run `git remote get-url origin` first.

- **`rmarafioti/frontend_scaffold`:** this is the template every new 3D Web Dev client website starts from (Use this template on GitHub). You are maintaining the template: keep every `FILL:` marker, keep the placeholders generic, and never add anything one site needs. A rule changed here reaches only repos made after it, never an existing client repo. This file and `docs/site.md` are written from the CMS backend's session (`rmarafioti/3d_wd_backend`, `CLAUDE.md` → Documentation Sync); the code is written here.
- **Any other repo:** this is a new client website made from the template. Before any other work, fill every marker (`grep -rn --exclude-dir=node_modules --exclude-dir=cms 'FILL:' .`) as the backend's `docs/deploy.md` → Onboarding a client website, path B step 4 says, then delete this paragraph.

## Project Overview

<!-- FILL: one paragraph: the site, its URL, who it is for, and which of its content the site owner manages in the CMS (posts, a gallery, or none yet). -->

The site owner manages part of the site's content in the 3D Web Dev Headless CMS. This site fetches that content from the CMS's public API and renders it. Everything else on the site (pages, layout, styling, its own images) lives in this repo.

- **The site owner** manages CMS content in the CMS dashboard (`https://3dwebdev.com/dashboard`). They never edit that content in this repo.
- **The CMS** stores the content, serves it from its public API, and calls this site's `POST /api/revalidate` whenever something changes.
- **This repo** renders that content statically and builds every other page of the site.

This site has no login, no database, no user accounts and no stored user data. Its connection to the CMS is specced in full in `docs/cms/` (the base, `client-website.md`, plus a doc per ability), and what is particular to this site in `docs/site.md`.

Production: this site runs on Vercel at <!-- FILL: the production URL -->. The CMS API runs at `https://api.3dwebdev.com`.

## Site Details

This site's details (URL, Vercel project, media and static folders, pages, the contact form's fields and photos), the abilities it uses and its quirks are in `docs/site.md`.

## Tech Stack Summary

- Framework: Next.js (current stable, App Router) / JavaScript
- Rendering: static. Server Components by default; CMS content is fetched at build/regeneration time.
- CMS data: one `server-only` `cmsFetch()` plus a `getX()` function per resource, and `src/app/api/revalidate/route.js` for on-demand revalidation
- Contact form: a server action, `_lib/sendContactMessage.js`, sending through the CMS from the server (`docs/cms/contact.md`), which emails the site owners; an optional photo picker shrinks photos in the browser
- Images: `next/image`. CMS images come from this site's upload folder in 3DWD's Cloudinary account; the site's own images live in `public/` or in its own Cloudinary folder.
- Newsletter (scaffold element): a server action, `_lib/subscribeToNewsletter.js`, adding subscribers through Buttondown's API from the server; an RSS feed at `/feed.xml` for the vendor to watch
- Icons: `react-icons`
- Testing: Vitest
- Hosting: Vercel, in 3DWD's Vercel Pro team (Hobby is non-commercial only, and client sites pay a hosting fee)

## Project Architecture

```
root
├── src/
│   ├── test/
│   │   ├── setup.js              *stubs server-only; sets the HEADLESS_CMS_* and BUTTONDOWN_API_KEY vars to undefined before each test
│   │   └── helpers.js            *mockFetch (the only fake network) and other edge helpers
│   └── app/
│       ├── _components/          *all one-time and reusable components
│       │   ├── AppWrapper.jsx    *Client Component: the accessibility settings, around every page
│       │   ├── accessibility/    *AccessMenu.jsx and Toggle.jsx (standard on every site)
│       │   ├── forms/            *ContactForm.jsx and FormModal.jsx (standard on every site); PhotoPicker.jsx (scaffold element, in the contact form); NewsletterForm.jsx (scaffold element, in the Footer)
│       │   ├── FadeInSection.jsx *scaffold element: a section that fades in when scrolled into view
│       │   ├── ResponsiveImage.jsx      *scaffold element: one image, a desktop and a mobile source
│       │   └── ResponsiveThemeImage.jsx *scaffold element: one image, a light and a dark source
│       ├── _data/
│       │   ├── photos.js         *the site's own photos (placeholders in the template)
│       │   └── site.js           *the site's name, description and production URL (layout metadata and the feed)
│       ├── _hooks/               *client-only UI hooks: useModal, useVisibility, usePhotoGallery (scaffold element)
│       ├── _layout/              *Navbar.jsx and Footer.jsx
│       ├── _lib/
│       │   ├── cmsFetch.js       *the only place the CMS API is called (server-only)
│       │   ├── getPosts.js       *scaffold element (with the feed): the posts list, as docs/cms/posts.md specs it
│       │   ├── buildFeed.js      *scaffold element: the posts as RSS 2.0, one teaser item per post, guid = the post's id
│       │   ├── isEmail.js        *the email check shared by the contact form and the newsletter signup
│       │   ├── validateContactMessage.js *the contact form's field checks, in the browser and on the server
│       │   ├── shrinkPhoto.js    *scaffold element (with the photo picker): a photo shrunk in the browser to a 1600 px jpg
│       │   ├── sendContactMessage.js *server action: the only place a contact message is sent, through the CMS
│       │   └── subscribeToNewsletter.js *scaffold element, server action: the only place a newsletter subscriber is added
│       ├── _styling/             *all module.css files
│       ├── api/
│       │   └── revalidate/
│       │       └── route.js      *POST only: checks the webhook secret, expires the "cms" tag
│       ├── featureOne/ … featureThree/ *scaffold elements: placeholder pages, renamed or deleted per site
│       ├── feed.xml/
│       │   └── route.js          *scaffold element: GET /feed.xml, static, refreshed with the "cms" tag
│       ├── globals.css           *global styling, the theme variables
│       ├── layout.js             *root layout (AppWrapper, Navbar, Footer, site-wide metadata)
│       └── page.js               *home page
├── public/                       *the site's own static files and images (or host its images on Cloudinary)
├── docs/
│   ├── cms/                      *synced unchanged from client-kit, never edited here
│   └── site.md                   *this site's details, the abilities it uses, its quirks
├── .github/
│   └── workflows/
│       └── ci.yml                *copied unchanged from client-kit's templates/ci.yml: jobs cms (drift) and check (lint, Prettier check, test, build)
├── .env.example                  *the HEADLESS_CMS_* and BUTTONDOWN_API_KEY names, empty values
├── .gitignore                    *create-next-app's, plus !.env.example so the example is committed
├── .prettierignore               *docs/cms/, so npm run format never reformats the synced docs
├── .prettierrc
├── eslint.config.mjs             *ESLint (Next.js config), run with npm run lint
├── jsconfig.json                 *the `@/*` → `src/*` import alias
├── next.config.mjs               *images.remotePatterns: only this site's Cloudinary folders; the Server Action body limit (4mb, for photos)
├── vitest.config.mjs             *node environment, @ → src alias, setup file, mocks and stubs reset per test
├── AGENTS.md                     *Next.js agent notes, written and re-added by `next dev`
├── CLAUDE.md                     *project context, loaded automatically every session
└── README.md                     *human-facing overview and local setup
```

*Folders prefixed with an underscore are excluded from routing. Every tested file has its `*.test.js` next to it (see Unit Tests). A `getX()` in `_lib/` and the components that render it are added per ability, once the site uses one (Patterns and Preferences).

## The CMS Integration

`docs/cms/` is the source of truth for everything between this site and the CMS. Follow it exactly. `client-website.md` is the base (env vars, the API, `cmsFetch()`, images, the revalidate route, the Next.js version check, testing) and is imported above. Each ability has its own doc beside it (`posts.md`, `galleries.md`), read when the work touches that ability. `docs/site.md` says which abilities this site uses.

- **`docs/cms/` is synced from the client-kit repo and never edited here, not even a typo.** Every client website gets the same copy. Its facts come from the CMS backend's docs, and the backend's Documentation Sync keeps client-kit in step. If something in it looks wrong or out of date, tell Rich, and the backend session fixes it in client-kit.
- **Sync pull requests:** client-kit's Sync workflow opens a PR from `3dwd-sync[bot]` (branch `3dwd-sync/…`) whenever `docs/cms/` changes. Those PRs auto-merge once CI passes, once Rich turns that on. Every other PR waits for Rich.
- **CI** (`.github/workflows/ci.yml`) fails if `docs/cms/` differs from client-kit's main, or if a sync PR changes anything outside `docs/cms/`. While a sync PR is open, the drift check fails on other PRs until the sync merges.
- **A docs-only merge doesn't redeploy:** the Vercel project skips the build when only `docs/` changed.
- Before writing or changing any caching code, check the installed Next.js version as `docs/cms/client-website.md` → "Check the installed Next.js version" says. Read `AGENTS.md` (written by `next dev`) and the docs bundled in `node_modules/next/dist/docs/`, not memory. Next.js APIs change between versions.

## Project Setup

Set up once in the template, then kept by every repo made from it:

- **`.gitignore`:** create-next-app ignores `.env*`, which also hides `.env.example`. Add `!.env.example` so it is committed.
- **`.prettierignore`:** list `docs/cms/`, so `npm run format` never reformats the synced docs (any change there fails CI's drift check).
- **`vitest.config.mjs`:** the node environment, the setup file, `resolve.alias` for @ → `src` (Vitest doesn't read the `jsconfig.json` paths), and `mockReset`, `unstubEnvs` and `unstubGlobals` set to true.
- **`src/test/setup.js`:** stubs `server-only`, and sets the `HEADLESS_CMS_*` and `BUTTONDOWN_API_KEY` vars to undefined in a `beforeEach`, so a real key or secret can never reach a test.
- **`next.config.mjs`:** `images.remotePatterns` allows only this site's own folders (`docs/cms/client-website.md` → Images), with the media and static folders as `FILL:` markers in the template. `experimental.serverActions.bodySizeLimit` is `"4mb"`, so the contact form's 3 shrunk photos fit; a site without the photo picker removes it.
- **npm warning:** npm 11 may warn that `unrs-resolver` (from `eslint-config-next`) has an unapproved postinstall script. It's harmless: the platform binary installs as an optional dependency and lint runs fine.

## Standard on every site

These are part of every 3D Web Dev client website. They are restyled per site but never removed without Rich saying so.

- **The accessibility menu** (`_components/accessibility/`): Theme (light or dark), Remove Font Style (a plain system font), and Font Size (four steps), with Reset. The visitor's choice in the menu wins over their system preference, in the CSS and in every themed image. Every control is a real button, reachable and usable by keyboard.
- **The contact form** (`_components/forms/`): full name, email and message, checked in the browser and again on the server with the CMS's limits, sent through the CMS by `_lib/sendContactMessage.js` (`docs/cms/contact.md`), then a success modal. A hidden honeypot field (`contactCode`) is checked in the server action before the CMS is called. Its questions and whether it takes photos are settled with the client and recorded in `docs/site.md`; extra questions go to the CMS as `extras`. Only Rich decides a site has none; its files are then deleted, not kept unused.

## Scaffold elements

Optional pieces the template ships so a site can start from them: `FadeInSection`, `ResponsiveImage`, `ResponsiveThemeImage`, `usePhotoGallery`, the `featureOne` to `featureThree` placeholder pages, the RSS feed (`feed.xml/route.js`, `_lib/buildFeed.js` and `_lib/getPosts.js`) the contact form's photo picker (`forms/PhotoPicker.jsx`, `_lib/shrinkPhoto.js` and the body limit in `next.config.mjs`: at most 3 photos, added one at a time, each shrunk to a 1600 px jpg at 0.8, or 0.6 once when still over 1 MB) and the newsletter signup (`forms/NewsletterForm.jsx`, `_lib/subscribeToNewsletter.js`, `newsletter_form.module.css`, the `BUTTONDOWN_API_KEY` var). The feed's items link to a page per post (`docs/cms/posts.md` → A page per post), so a site that keeps the feed builds those pages; its post path is a `FILL:` in `feed.xml/route.js`. In a client website, each one is renamed and used, or deleted once it is clear the site doesn't need it: none is kept unused for later. In the template itself they are kept, and are not raised as dead code.

## Anti-Patterns to Avoid

**Never call the CMS outside `cmsFetch()`:**
`_lib/cmsFetch.js` is the only place the CMS API is called. It adds the API key, the cache tags and the hourly fallback, unwraps `{ data }` and throws on errors. A second fetch to the CMS anywhere else would drift from those rules.

**Never expose a key or secret:**
`HEADLESS_CMS_API_KEY`, `HEADLESS_CMS_WEBHOOK_SECRET` and `BUTTONDOWN_API_KEY` are server-only. Never prefix them with `NEXT_PUBLIC_`, never read them in a Client Component, never commit them, never log them or an Authorization header.

**Never fetch CMS data from the browser:**
No `useEffect` or client-side hook that calls the CMS. `cmsFetch()` imports `server-only`, and only Server Components call the `getX()` functions. A browser fetch would expose the key and render the content after the page loads, which hurts SEO.

**Never send the contact form or the newsletter signup from the browser:**
`ContactForm.jsx` calls the `sendContactMessage` server action; it never calls the CMS or holds its key. That one file sends the message, through the CMS's contact route. In the same way, `NewsletterForm.jsx` calls the `subscribeToNewsletter` server action, the only place the newsletter vendor is called.

**A page must never quietly become dynamic:**
Fast static pages and SEO are why this site exists. Don't use `cookies()`, `headers()`, `searchParams`, `cache: "no-store"` or `dynamic = "force-dynamic"` on any page. After any change to one that renders CMS content, confirm in the `next build` output that the page is still ○ or ●, not ƒ.

**Never make a page a Client Component:**
Pages and layouts stay Server Components, so they can export `metadata` and call `getX()`. `"use client"` goes only on a small interactive island (the accessibility menu, the contact form, the mobile menu).

**Never render CMS text as HTML:**
A post paragraph's text is rendered through FormattedText (`docs/cms/posts.md`, Paragraph formatting), which builds `<b>`, `<i>` and `<a>` elements from its markup. All other CMS text is a plain React text node. Never use `dangerouslySetInnerHTML`.

**Never render an empty field:**
Optional CMS fields may be `null`. Skip them; never render "`null`" or an empty heading.

**Never hardcode CMS content:**
Content the CMS manages comes only from the CMS. No sample posts, fallback copy or placeholder content for it in the repo. With nothing to show, render nothing or the site's chosen empty message.

**Never add a redirect in front of the stored URL:**
The CMS calls the exact URL it has stored. A www ↔ bare-domain redirect drops the Authorization header and breaks revalidation. Domain redirects are set up in Vercel only after checking that the stored URL is the one the site is served on.

**The revalidate route does one thing:**
Check the secret, expire the cms tag, respond. No other work, no logging of the request.

**Never make aesthetic styling decisions:**
No CSS frameworks, no component libraries, no color, font or spacing choices. Styling is owned entirely by Rich. The agent's only layout job is basic structural formatting (flexbox only) to keep content readable. The required styles are functional: `white-space: pre-line` on post paragraphs, so line breaks show; `max-width: 100%; height: auto` on CMS images, so a large photo never overflows its container; and links in post paragraphs keep the browser's underline.

## Patterns and Preferences

**One shared CMS fetch, one function per resource:**
`cmsFetch(path, { tag, empty, notFound })` in `_lib/cmsFetch.js`, exactly as `docs/cms/client-website.md` → Fetching CMS data specs it: empty when `HEADLESS_CMS_API_URL` is unset (so the template and a new site build before they are wired up), the Bearer key, `next: { tags: ["cms", tag], revalidate: 3600 }`, the `notFound` value on a 404 when given, a throw on any other non-2xx, and the unwrapped data.

Each CMS resource gets its own function in `_lib/`, named `getX`, which calls `cmsFetch` with its path, its own tag and its empty value. The template has only `getPosts`, as part of the RSS feed scaffold element: a `getX` is added only when the site uses that ability and an ability doc in `docs/cms/` specs it. Adding one is a new `getX` file, its rendering per its ability doc, its test, and an update to `docs/site.md`.

**Where CMS content renders is decided per client:**
On its own route or inside an existing page through a component in `_components/`. Either way it is a Server Component that calls `getX()`, and the page builds static. Record the choice in `docs/site.md`.

**`_hooks/` is for client-only UI:**
Hooks there handle browser interaction (a modal, a menu, scroll visibility) and never fetch CMS data.

**Server Components by default:**
Add `"use client"` only to a small interactive island. No Context or state library unless more than one component actually needs the value.

**Every image goes through `next/image`:**
CMS images use the `src`, `width`, `height` and `altText` the CMS sends (`alt={altText}`), styled `max-width: 100%; height: auto`. The site's own images live in `public/` or in its own Cloudinary folder (`docs/site.md`), and also carry real `width`, `height` and alt.

**The site's own data:**
Data the site uses that isn't CMS content (a list of its own photos, for example) lives in `_data/`.

**Every page has metadata:**
Each page exports metadata with at least a title and description, since search is the reason the site is static.

**Saving notes:**
When Rich asks to save or remember something, write it into the most fitting project md file (`CLAUDE.md`, `docs/site.md` or `README.md`, never `docs/cms/`), not only into private memory, so it survives a context clear. In plan mode, where only the plan file can be edited, put the doc edit in the plan.

**In-line comments:**
Keep all code readable and explicit. Comments explain the logic in more abstract code, and every comment must be validated and true. Each file has a header comment explaining its purpose.

## Out of Scope (do not build)

- Anything that writes to the CMS: no admin pages or editing of CMS content. The site owner uses the CMS dashboard. The contact form is the one form that sends to the CMS: its message, which the CMS saves and emails to the site owners (`docs/cms/contact.md`).
- Any CMS endpoint not specced in `docs/cms/`.
- Login, user accounts, a database, or storing any visitor data.
- A page per post. The CMS sends `postId` (or `galleryId` for a gallery) in the revalidate body for when this is wanted later; it isn't built until Rich asks.

## Code Style

Formatting is Prettier with default settings (`.prettierrc`), run before every commit (`npm run format`), plus `npm run lint` clean.

- **File naming:** components in PascalCase.jsx (`ContactForm.jsx`), hooks in camelCase.js prefixed with use (`useModal.js`), CSS modules in snake_case (`contact_form.module.css`), everything else camelCase.js (`cmsFetch.js`).
- **File shape, top to bottom:** header comment → `"use client"` or `"use server"` if needed → imports (React, then Next, then third-party, then local, then styles) → module constants (`UPPER_SNAKE`) → helpers → the main export. Inside a component: hooks and state → derived values → handlers → JSX.
- **Exports:** components and pages use `export default function Name`. Hooks and lib functions are named exports (`export function useModal`, `export async function sendContactMessage`).
- **Functions:** function declarations for components, hooks and helpers. Arrows only inline (callbacks, `.map`).
- **Naming:** CMS fetchers are `getX`. Booleans read as questions (`isOpen`, `hasPosts`). Use the vocabulary of `docs/cms/` (post, body, paragraph, image, link, gallery), not synonyms.
- **Control flow:** early returns over nested if/else. No nested ternaries in JSX.
- **Quotes:** Prettier's defaults (double quotes). The `docs/cms/` snippets already use them, so a copied snippet doesn't change on `npm run format`.

## Code Review

A review is read-only. It produces findings; it never edits code. Fixes are their own task: plan in plan mode, Rich approves, build, verify, PR.

### Checklist

1. **Style is consistent** with Code Style above. If two files do the same thing two ways and neither is documented, raise it as a decision.
2. **No dead code:** unused imports, components, hooks, files, env vars, commented-out code. In the template, the Scaffold elements are exempt.
3. **Explicit, then DRY:** extract on the third copy, or the second when the copies could drift.
4. **Comments are necessary and true**, and every file keeps an accurate header comment.
5. **Docs match code:** the architecture tree, `docs/site.md`, Progress, `README.md` and `.env.example` describe what is in the repo.
6. **The integration still matches `docs/cms/`:** run the "Done when" list of `client-website.md` and of each ability doc this site uses against the code.
7. **The Anti-Patterns still hold:** `cmsFetch` only, secrets server-only, no browser fetch or browser email, static pages, no HTML injection, no empty fields, no hardcoded content, no aesthetic styling.
8. **Every state renders:** for CMS content, nothing returned, optional fields empty, and each content case its ability doc lists; for the contact form, a field missing, a bad email, a send failure and a success; for the accessibility menu, every setting by mouse and by keyboard, on a light and a dark system.
9. **Tooling is clean:** `npm test`, `npm run lint`, `npm run format` (no diff) and `npm run build` pass, with every page static, and the PR's CI (cms and check, which runs lint, the Prettier check, the tests and the build) is green.

### Output

Findings as a list, most important first. Each has: file and line, checklist item, what's wrong, proposed fix, and type: **bug**, **cleanup** or **doc**. Anything that needs Rich's style or spec call is marked **decision**, with no fix proposed until he decides.

## Unit Tests

Vitest, node environment. `npm test` runs the suite once; `npm run test:watch` while working. A failing test blocks a commit the same as a failing build.

### What is tested

The boundaries, where a mistake breaks the site silently or leaks a secret:

- **`cmsFetch()`:** returns empty when `HEADLESS_CMS_API_URL` is unset, without calling fetch; sends `GET {url}{path}` with `Authorization: Bearer <key>`; passes `next: { tags: ["cms", tag], revalidate: 3600 }`; returns the unwrapped data; returns the `notFound` value on a `404` when one is given, and throws on a `404` when none is; throws on a non-2xx response (`401`, `429`, `500`).
- **Each `getX()`:** one test of its wiring: the path, its tag and its empty value.
- **The revalidate route:** `401` with the documented body for a missing header, a wrong secret, and an unset `HEADLESS_CMS_WEBHOOK_SECRET`; `200` and the cms tag expired for the right secret. For the unset-secret case, send a full `Bearer <secret>`, not `"Bearer "` with nothing after it: header values are trimmed, so it arrives as `"Bearer"` and fails on length alone, and the test would pass even with the guard deleted.
- **`sendContactMessage()`:** a filled honeypot answers as sent without calling fetch; refuses a missing field or a bad email without calling fetch; sends one request to the CMS's contact route with the key, the CSRF header and the message's fields and photos; maps a 400's `fields` onto the form's fields; reports a failure on any other error or a network failure, without logging the key or the message.
- **`shrinkPhoto`:** `scaledSize` keeps the long side at most 1600 px and never scales up.
- **The photo picker:** turns off at 3 photos, and the added photos are sent with the form.
- **The contact form's success modal** renders after a successful send.
- **`buildFeed()`:** a valid feed for zero, one and several posts (order kept); the guid is the post's id, not a permalink; characters in a header are escaped; a null header or subHeader is left out; a post without a postDate is dated by its createdAt.
- **`subscribeToNewsletter()`:** a filled honeypot reports success without calling fetch; a bad email is refused without calling fetch; sends one request to the vendor with the email and the visitor's IP; reports a failure when the vendor answers with an error, without logging.
- **A bug that was fixed:** write the failing test first, then fix the code, so it can't come back.

Don't write a test for: static markup, styling, metadata, a constant, or Next.js behaviour itself. Rendering is checked by hand (see Manual testing).

### The pattern every test follows

- **Location and naming:** the test sits next to the file it tests (`cmsFetch.test.js`, `route.test.js`). Shared support lives in `src/test/`. One describe per unit; each it reads as a behaviour sentence: `it("throws when the CMS returns 401")`.
- **Arrange → Act → Assert,** separated by a blank line. One behaviour per test.
- **Test behaviour, not implementation:** assert on what was sent (URL, headers, body, next options) and what came back, or on the route's response, never on internals.
- **Mock only the edges:**
  - The network, through `mockFetch` in `src/test/helpers.js`, which replaces the global fetch. No test calls the real CMS or the real email service.
  - `revalidateTag` from `next/cache` (`vi.mock`), to assert which tag was expired.
  - `server-only`, stubbed in `src/test/setup.js`, because it throws outside a Next.js server build.
  - Env vars with `vi.stubEnv`, never real values. A real key or secret never appears in a test.
  - Nothing else in our own code is mocked.
- **Responses come from the contract:** CMS mock bodies use the shapes and messages in `docs/cms/`, copied word for word.
- **Independent:** mocks and stubbed env vars reset after each test (`vitest.config.mjs`). Tests pass in any order and alone.
- **No snapshots.**
- **Same rules as the rest of the code:** Code Style and Code Review apply to test files too.

### Manual testing

Rendering and the live loop are tested by hand, as the Testing sections of `docs/cms/client-website.md` and each ability doc describe: local rendering against the CMS backend on port 4000, a static `next build`, and a wrong-secret `401` on the deployed route. The CMS operator then runs the webhook and live-update tests from the backend repo. Before the CMS is wired up, the site still builds and renders with no CMS content, since `cmsFetch()` returns empty while `HEADLESS_CMS_API_URL` is unset.

The contact form and the accessibility menu are checked in the browser on every change to them: a real message arrives, and every menu setting works by keyboard on a light and a dark system.

Content created in the CMS for testing belongs to the CMS database. List everything a test created so Rich can have the backend session delete it.

## Workflow Checklist

- Branch from an up-to-date main
- Check the relevant spec (`docs/cms/client-website.md` plus the ability's doc for anything touching CMS content, and `docs/site.md`)
- Create a plan in plan mode (EnterPlanMode / ExitPlanMode), never as a chat message
- On approval, build
- Checks after building:
  - Self-review the diff against Code Review → Checklist
  - `npm test` green; new or changed boundary code has tests per Unit Tests
  - `npm run lint`, `npm run format` and `npm run build` are clean, and every page builds as static
  - Every CMS call goes through `cmsFetch()`, every contact message through `sendContactMessage()`, and every newsletter signup through `subscribeToNewsletter()`
  - No secret is `NEXT_PUBLIC_`, committed, logged or read in a Client Component
  - No aesthetic styling added
  - Verified in the browser (`npm run dev`, then `next start` after a build)
  - Test content listed for deletion
- Only commit once the code is reviewed and approved and every check is green
- Commit, push and open a PR; the PR's CI (cms and check) must be green, then Rich merges it on GitHub

When Rich says to commit, first update Progress below to describe the state after the PR merges, on the same branch. After a merge Rich runs `/clear`, so the next task starts from this file and `docs/` alone. Anything worth keeping must be written here first.

## Progress

<!-- FILL: in a client website, replace this with the site's own progress. -->

Template: these docs were written from the CMS backend (`rmarafioti/3d_wd_backend#125`), and the code matches them since `rmarafioti/frontend_scaffold#21` (which also closed #19, the navbar highlight): the bug fixes, PascalCase names, Server Component pages, the `cmsFetch` and revalidate placeholders with tests, the server-side contact form (`sendContactMessage`), the theme fix (a menu choice beats the system; Reset follows the system), the tooling and CI. Next 16.4.6, React 19.3.1.

- Template images: the hero is in the `frontend_scaffold` Cloudinary folder (the default static folder in `next.config.mjs`); the logo and the success-modal photo are grey placeholders in `public/placeholders/`.
- Font size steps are 16, 18, 20 and 22px (`AppWrapper.jsx`). Icon buttons are sized as 1em squares with the padding inside, since the global `button` rule would otherwise resize them.
- RSS feed and newsletter signup (issue #25), scaffold elements: `/feed.xml` (static, teaser items, guid = the post's id, refreshed by the `cms` tag) and `NewsletterForm` in the Footer, adding subscribers through Buttondown's API (pinned `X-API-Version: 2026-11-10`, double opt-in, a honeypot). The form reuses the contact form's styles, with the field and button on one row. Buttondown is the vendor for Rich's own blog; new-post emails are written by hand in Buttondown until its RSS-to-email add-on is taken. Not yet tested with a real Buttondown key.
- Contact form through the CMS (issue #28, backend `rmarafioti/3d_wd_backend#126`): `sendContactMessage` posts to `POST /api/public/contact` with the existing `HEADLESS_CMS_*` URL and key; EmailJS and its four vars are gone. A `contactCode` honeypot is checked on the server first; a 400's field messages show next to their fields (`name` → `full_name`, `images.N.content` → photos), and 413, 429, other failures and an unset URL show the general error. The photo picker (scaffold element) adds one photo at a time and turns off at 3, shrinking each to a 1600 px jpg in the browser; `bodySizeLimit` is 4 MB. Tested end to end against the local CMS with the backend session: rows with 0, 1 and 3 photos saved, the honeypot, a bad image, a bad email and a wrong key saved nothing, and a real email with 3 photos arrived. `docs/cms/contact.md` reaches this repo by sync only after the backend is released to production; until then the code's comments point to a file not yet here (it is on client-kit's `feat/contact-ability`).
- `next dev` 16.4.6 writes `AGENTS.md`, which is committed.

## Plan Authoring

When in plan mode, write the plan to be legible cold, understandable by someone who never saw the conversation that produced it. State what's being built, which files will be touched, and why this approach was chosen. Spell out what "same pattern as before" or "as discussed" means instead of writing it.

## Delegating to Subagents

Use subagents for research, exploration and investigation for a plan, and for completing smaller tasks.
