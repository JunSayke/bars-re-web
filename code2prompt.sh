#!/usr/bin/env bash

set -euo pipefail

# Generate a prompt file for the repository, excluding sensitive or noisy paths.
# Excluded paths:
# - node_modules
# - pnpm-lock.yaml
# - .github
# - .vscode
# - .env
# - structure-architecture.md
# - code2prompt.sh
# - project.md

if ! command -v code2prompt >/dev/null 2>&1; then
  echo "error: code2prompt CLI not found in PATH" >&2
  exit 1
fi

code2prompt \
  -e node_modules \
  -e pnpm-lock.yaml \
  -e .github \
  -e .vscode \
  -e .env \
  -e structure-architecture.md \
  -e code2prompt.sh \
  -e project.md \
  -e openspec \
  -O project.md