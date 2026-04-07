# Feishu Pages Notify Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing GitHub Pages workflow so a Feishu app bot sends a private notification after a successful deployment.

**Architecture:** Reuse the current `.github/workflows/deploy.yml` pipeline. Add a single post-deploy shell step that first requests a Feishu `tenant_access_token`, then posts a text message to the target email via the Feishu message API.

**Tech Stack:** GitHub Actions, shell, `curl`, Python 3 JSON parsing, Feishu Open Platform HTTP APIs

---

### Task 1: Add The Feishu Notification Step

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Insert a post-deploy notification step**

Update the `deploy` job so the new step runs only after `actions/deploy-pages@v4` succeeds.

- [ ] **Step 2: Exchange app credentials for a tenant token**

Within the step, call `https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal` using `FEISHU_APP_ID` and `FEISHU_APP_SECRET`.

- [ ] **Step 3: Send the text message**

Call `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=email` and send a text payload to `774659391@qq.com`.

### Task 2: Verify Workflow Validity

**Files:**
- Verify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Parse the workflow as YAML**

Run: `python3 - <<'PY' ...`
Expected: YAML loads without parse errors.

- [ ] **Step 2: Review the rendered shell variables**

Run: `sed -n '1,240p' .github/workflows/deploy.yml`
Expected: the workflow references `FEISHU_APP_ID` and `FEISHU_APP_SECRET`, includes the deploy URL, and targets `774659391@qq.com`.
