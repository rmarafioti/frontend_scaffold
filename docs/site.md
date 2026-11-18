# <!-- FILL: the website's name -->: this site

Everything particular to this website. The shared CMS docs in `docs/cms/` are synced unchanged from the client-kit repo and never edited here. Where they say "recorded in `docs/site.md`", the value is below.

## Site Details

| Detail              | Value                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Website name        | <!-- FILL -->                                                                                                      |
| Production URL      | <!-- FILL: e.g. `https://www.example.com` -->: the exact URL stored in the CMS, no redirect                        |
| Vercel project      | <!-- FILL: the project name -->, in 3DWD's Vercel Pro team                                                         |
| CMS media folder    | <!-- FILL: `media_folder` -->: this site's upload folder in 3DWD's Cloudinary account, given by the CMS            |
| Static image folder | <!-- FILL: the folder -->: the site's own images (`_data/photos.js`), in the same Cloudinary account, or `public/` |
| Pages               | <!-- FILL: one line per route, e.g. `/`: home page (hero, intro, contact form) -->                                 |
| Contact form        | <!-- FILL: the EmailJS service and template it sends with, and that the account allows only this site's domain --> |

`next/image` loads only from `3dwd/<media_folder>/` (production uploads), `3dwd-dev/<media_folder>/` (local uploads) and the static image folder, set in `next.config.mjs`.

## Abilities this site uses

<!-- FILL: one bullet per CMS ability the site uses, its state, the doc to read and where it renders, e.g.:
- **Posts (live):** read `docs/cms/posts.md`. Posts render in `_components/Blog.jsx`, below the hero on `/`. Built: `_lib/getPosts.js`, `_lib/parseParagraph.js` and `_components/FormattedText.jsx`.
- **Galleries (not shown yet):** read `docs/cms/galleries.md` once Rich decides where a gallery goes.
None yet: write "None yet." -->

## Quirks

- Locally, the CMS sends its revalidate call to the stored production URL, not to this machine. After a dashboard change, POST to `localhost:<port>/api/revalidate` by hand (with the local webhook secret) to see it.
- Each CMS environment issues its own API key and webhook secret, so the local ones never work on staging or production. Production's are in 1Password (3DWD Clients).

<!-- FILL: anything else particular to this site, or delete this comment. -->
