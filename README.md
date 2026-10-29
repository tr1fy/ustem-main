# USTEM Foundation — ustem.kz

Next.js 13 + next-intl site in three languages (kz is the default, ru, en).

## Local development

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build:static # the same static build that goes to the hosting (out/)
```

## Where things are

- `src/lib/site-content.ts` — most of the site text (`words(kz, ru, en)`),
  news, competitions, partners, metrics.
- `messages/{kz,ru}.json` — small next-intl strings.
- `src/app/[locale]/` — pages; shared blocks are in `_components/`, header and
  footer in `components/layout/`.
- `src/styles/` — CSS, imported once through `index.css`.
- `docs/redesign.md` — design notes and photo sources.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: it builds the static
site and commits `out/` to the `deploy` branch, which Plesk (PS.kz) pulls into
`/httpdocs`. On the static hosting `deploy/htaccess` does the job of
`src/middleware.ts` and the redirects in `next.config.js`; keep them in step.

Sign-in and registration live in USTEM Connect (https://connect.ustem.kz);
`/login` and `/register` redirect there.
