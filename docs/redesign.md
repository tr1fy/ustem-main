# USTEM Foundation — basic reconstruction, September 2026

Brief: https://docs.google.com/document/d/1a4xgr5lCjLLa1yTrGkKFQKp2EhuRPayv/edit

## Design and scope

Keep the existing Next.js 13 / React 18 / Tailwind 3 / next-intl stack. The
homepage order is hero, community/Instagram, news, metrics, President,
tournament ecosystem, about/impact, Academy, support, contacts. Existing Kaspi
donation destination and public contact details are preserved.

Palette: USTEM blue #0066c3, warm orange #e85638, ink #122e47, paper #f3f6f8,
white. Manrope with Cyrillic Extended is loaded through next/font; Kazakh is
displayed as KK while existing /kz URLs remain compatible. EN is enabled. Locale
selection uses client navigation and a one-year NEXT_LOCALE cookie. The root
route honors a saved locale; otherwise it opens Kazakh. Legacy content without
English translation falls back to Kazakh.

Hero is isolated in `src/app/[locale]/_components/hero.tsx`, ready for the
user's upcoming Figma design. No Figma hero has been supplied yet. Main content
and multilingual labels are in `src/lib/site-content.ts`. Layout rules are in
`src/styles/globals.css`.

The removed infrastructure, vacancies and old result/hero content are deleted
from components and translation catalogs. The historical Robotics Lab
consultation is marked archived; its old URL redirects to the archive article.
The PDFs remain accessible.

## Asset provenance

All photography is documentary; no AI-generated or stock photographs.

- `public/images/panama.jpg`: Kazakhstan team at FIRST Global Challenge 2025.
  https://www.gov.kz/memleket/entities/edu/press/news/details/1097414?lang=ru
- `public/images/geneva.jpg`: FIRST Global Challenge 2022.
  https://www.gov.kz/memleket/entities/mfa-bern/press/news/details/442667?lang=ru
- `public/images/president.jpg`: original 6676 × 4684 Akorda photograph, USTEM
  stand at Digital Bridge 2023.
  https://www.akorda.kz/assets/media/uploadMedia/1697099485_KZ1_5184_2.jpg
- President story:
  https://www.akorda.kz/ru/kasym-zhomart-tokaev-posetil-vystavku-na-mezhdunarodnom-tehnologicheskom-forume-digital-bridge-1291855
- `public/images/selection.jpg`: FIRST Global Central Asia, August 2026.
  https://www.gov.kz/memleket/entities/maidd/press/news/details/1279010?lang=ru
- `public/images/robocon.jpg`: ABU Robocon, August 2026.
  https://www.gov.kz/memleket/entities/sci/press/news/details/1279661?lang=ru

The President image uses intrinsic dimensions, width 100%, height auto and
object-fit contain. Keep this behavior at every breakpoint. Do not use a
background image or fixed-height crop for it.

## Basic-stage boundaries

- Instagram is a curated photo grid linking to @firstroboticskz, not an
  authenticated, automatically updated social feed. A live feed requires a
  separately configured integration.
- Tournament cards use lightweight vector category artwork pending approved
  event-specific photo/video assets. All six cards have functioning localized
  detail pages and contact links; they do not invent event schedules,
  registration availability or prices.
- The four required metric values (4, 30,000+, 10%, 100+) and the optional 61%
  are supplied by the brief. The four world titles are additionally supported by
  the government article above. Other supplied metrics were not independently
  audited in this implementation.
- Extended flagship project stories, victory timeline, partner/media modules and
  the final Figma hero remain later stages.

## Validation and deployment

Use the existing Vercel project `ustem-main`, production domain
https://www.ustem.kz. Do not create a separate Sites deployment or change
hosting providers.

Validate types, build, locale routes, archive redirects, PDF links, mobile
navigation/accordion, cookie persistence, section anchors and reduced-motion
styles. Browser checks cover 320, 390, 768, 1440 and 3840 px. All 46 local production route/asset requests returned 200; the three legacy consultation routes redirected correctly. TypeScript, focused React Hooks lint and `git diff --check` passed; production compilation succeeded. Keep
`overflow-x: clip` on html/body: the previous inline `overflow-x: hidden`
created an unintended scroll container and broke the sticky header.

The repository's existing ESLint setup uses eslint-plugin-prettier 4 with
Prettier 3; its full lint run fails with
`prettier.resolveConfig.sync is not a function` even on the unchanged baseline.
Type checking, production compilation and targeted correctness lint are run
separately rather than suppressing project-wide lint in configuration.

Octarin memory recall and per-file recall were consulted. Its file_history tool
was not exposed in this session, so local Git history was used for file history.
