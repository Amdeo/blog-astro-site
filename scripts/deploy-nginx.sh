#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_DIR="${NGINX_BLOG_ROOT:-/Users/looper/Documents/data/Container/nginx/www/blog}"
CONTENT_SYNC_SETTING="${ENABLE_CONTENT_SYNC:-false}"

if ! command -v rsync >/dev/null 2>&1; then
	echo "rsync is required but was not found in PATH." >&2
	exit 1
fi

mkdir -p "${TARGET_DIR}"

echo "Building site for local Nginx deployment..."
echo "Target directory: ${TARGET_DIR}"
echo "ENABLE_CONTENT_SYNC=${CONTENT_SYNC_SETTING}"

cd "${REPO_ROOT}"

env \
	-u PUBLIC_BASE_PATH \
	-u PUBLIC_SITE_URL \
	ENABLE_CONTENT_SYNC="${CONTENT_SYNC_SETTING}" \
	pnpm build

echo "Syncing dist/ to ${TARGET_DIR}..."
rsync -a --delete "${REPO_ROOT}/dist/" "${TARGET_DIR}/"

echo "Local Nginx deployment complete."
