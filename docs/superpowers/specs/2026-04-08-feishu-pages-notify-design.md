# GitHub Pages Feishu Notify Design

**Goal:** Send a Feishu app-bot private message to `774659391@qq.com` after a successful GitHub Pages deployment.

**Context:** The repository already deploys to GitHub Pages through `.github/workflows/deploy.yml`. The user wants to authenticate with Feishu using only `app_id` and `app_secret`, so the notification must use the Feishu app-bot flow instead of a custom group-bot webhook.

## Approach

Add one post-deploy step to the existing `deploy` job. That step will:

1. Exchange `FEISHU_APP_ID` and `FEISHU_APP_SECRET` for a `tenant_access_token`.
2. Call Feishu's message API with `receive_id_type=email`.
3. Send a plain-text message to `774659391@qq.com`.

## Message Content

The notification should include:

- Repository name
- Branch name
- Commit message
- GitHub Pages URL returned by `actions/deploy-pages`
- GitHub Actions run URL

## Constraints

- Do not change the existing build or deploy behavior.
- Do not introduce third-party GitHub Actions for Feishu delivery.
- Keep credentials in GitHub Actions secrets only.

## Validation

- Verify the workflow remains valid YAML.
- Verify the inserted shell uses only standard tools available on `ubuntu-latest`.
