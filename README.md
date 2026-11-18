# 3D Web Dev client website template

The starting point for every new 3D Web Dev client website: a static Next.js site that renders the content its site owner manages in the 3D Web Dev Headless CMS, plus the pieces every site has (the accessibility menu and the contact form).

## Start a new client website

1. On GitHub, **Use this template** to create the client's repo.
2. Fill every marker, as the CMS backend's `docs/deploy.md` → Onboarding a client website says:

   ```sh
   grep -rn --exclude-dir=node_modules --exclude-dir=cms 'FILL:' .
   ```

3. Rename or delete the scaffold elements (`featureOne` to `featureThree`, `FadeInSection`, `ResponsiveImage`, `ResponsiveThemeImage`, `usePhotoGallery`) and replace the template images in `src/app/_data/photos.js` (the hero in the `frontend_scaffold` Cloudinary folder, the placeholders in `public/placeholders/`).

## Local setup

Requires Node 24.

```sh
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

The site builds and renders with an empty `.env.local`: with `HEADLESS_CMS_API_URL` unset, CMS content is simply empty. All the variables are server-only (`.env.example` lists them).

## Scripts

| Script                            | What it does                      |
| --------------------------------- | --------------------------------- |
| `npm run dev`                     | Development server                |
| `npm run build` / `npm start`     | Production build, and serve it    |
| `npm test` / `npm run test:watch` | Unit tests (Vitest)               |
| `npm run lint`                    | ESLint                            |
| `npm run format`                  | Prettier, run before every commit |

CI (`.github/workflows/ci.yml`) runs lint and tests, and checks that `docs/cms/` matches client-kit.

## Docs

- `CLAUDE.md`: architecture, conventions, testing and the review checklist.
- `docs/cms/`: how the site talks to the CMS. Synced from client-kit; never edited here.
- `docs/site.md`: this site's details, the abilities it uses and its quirks.
