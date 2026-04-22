#!/usr/bin/env bash
# Wrapper: same as `node scripts/send-expo-test-push.mjs` from repo root.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/scripts/send-expo-test-push.mjs"
