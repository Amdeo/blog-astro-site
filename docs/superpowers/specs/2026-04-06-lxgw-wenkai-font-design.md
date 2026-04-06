# LXGW WenKai Font Integration Design

## Summary

Embed `LXGW WenKai` into the Astro blog as a locally hosted font and make it the primary typeface for both ASCII and CJK content across the site. Keep the existing font pipeline so production builds still subset and convert configured local fonts into `woff2`.

## Goals

- Replace the current primary font chain with `LXGW WenKai`.
- Apply the new font to body copy, headings, navigation, cards, and banner titles through the existing global font configuration.
- Keep the site's current local-font and build-time compression flow intact.

## Non-Goals

- Redesigning individual components for typography-specific spacing tweaks.
- Removing the old font files from the repository in this pass.
- Introducing remote font hosting or third-party CSS imports.

## Current State

- Global font selection is driven by `siteConfig.font` in `src/config.ts`.
- `src/layouts/Layout.astro` builds the `<body>` `font-family` from `asciiFont` and `cjkFont`.
- `src/styles/main.css` declares local `@font-face` rules.
- `scripts/compress-fonts.js` reads `localFonts` from `src/config.ts`, subsets matching files from `public/assets/font`, and rewrites built CSS to point at generated `woff2`.

## Proposed Change

### Font Asset

Add the official `LXGWWenKai-Regular.ttf` file to `public/assets/font/`.

### CSS

Declare a new `@font-face` in `src/styles/main.css`:

- `font-family: "LXGW WenKai"`
- `src: url("/assets/font/LXGWWenKai-Regular.ttf") format("truetype")`
- `font-weight: 400`
- `font-style: normal`
- `font-display: swap`

The existing local font declarations can remain in place for rollback safety, but they will no longer be referenced by `siteConfig.font`.

### Config

Update both `asciiFont` and `cjkFont` in `src/config.ts` to:

- `fontFamily: "LXGW WenKai"`
- `fontWeight: "400"`
- `localFonts: ["LXGWWenKai-Regular.ttf"]`
- `enableCompress: true`

This keeps the body font stack unified and ensures all title and content typography inherits the new family through the existing layout logic.

## Risks

- English and numeric text will look more handwritten than before, which may slightly reduce UI compactness.
- Because both configured font slots point to the same file, the compression script will process the same source twice. This is acceptable for now because the generated asset name is stable, but it is mildly redundant.

## Validation

- Run `pnpm type-check` to confirm config and Astro imports remain valid.
- Run `pnpm build` to verify the production build and font compression pipeline both succeed with the new asset.
