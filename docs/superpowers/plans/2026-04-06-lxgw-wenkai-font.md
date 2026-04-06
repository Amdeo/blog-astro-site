# LXGW WenKai Font Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's current primary fonts with locally hosted `LXGW WenKai` and keep the existing build-time font optimization flow working.

**Architecture:** Reuse the existing font pipeline instead of adding a new one. Add the official font file under `public/assets/font`, declare it in global CSS, and point both configured font slots at the same family so every existing page inherits it through the layout-level body font stack.

**Tech Stack:** Astro, TypeScript, global CSS, local static assets, Node-based font compression script

---

### Task 1: Add The Font Asset

**Files:**
- Create: `public/assets/font/LXGWWenKai-Regular.ttf`

- [ ] **Step 1: Download the official font asset**

Run: `curl -L https://sourceforge.net/projects/lxgw-wenkai.mirror/files/v1.521/LXGWWenKai-Regular.ttf/download -o public/assets/font/LXGWWenKai-Regular.ttf`
Expected: file is saved under `public/assets/font/`

- [ ] **Step 2: Verify the asset exists**

Run: `ls -lh public/assets/font/LXGWWenKai-Regular.ttf`
Expected: one regular TTF file is listed

### Task 2: Wire The Font Into Global Styling

**Files:**
- Modify: `src/styles/main.css`
- Modify: `src/config.ts`

- [ ] **Step 1: Add the failing configuration reference**

Update `src/config.ts` so both `asciiFont` and `cjkFont` reference `LXGW WenKai` and `LXGWWenKai-Regular.ttf`.

- [ ] **Step 2: Add the global `@font-face`**

Update `src/styles/main.css` with a new `@font-face` for `LXGW WenKai`.

- [ ] **Step 3: Review for path and name consistency**

Run: `rg -n "LXGW WenKai|LXGWWenKai-Regular" src/config.ts src/styles/main.css`
Expected: config and CSS use the same family name and file name

### Task 3: Verify Build And Type Safety

**Files:**
- Verify: `src/config.ts`
- Verify: `src/styles/main.css`
- Verify: `public/assets/font/LXGWWenKai-Regular.ttf`

- [ ] **Step 1: Run type checking**

Run: `pnpm type-check`
Expected: exit code 0

- [ ] **Step 2: Run production build**

Run: `pnpm build`
Expected: exit code 0 and successful font optimization output for `LXGWWenKai-Regular.ttf`
