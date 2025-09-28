#!/usr/bin/env bash
# https://github.com/cssnr/docker-context-action

set -e

echo "Setup Context"

echo "::group::Verifying Docker Context"

CONTEXT_NAME="$(openssl rand -hex 4)"

ssh -o BatchMode=yes -o ConnectTimeout=30 -p "${INPUT_PORT}" \
    "${INPUT_USER}@${INPUT_HOST}" "docker info" > /dev/null

if ! docker context inspect "${CONTEXT_NAME}" >/dev/null 2>&1;then
    docker context create "${CONTEXT_NAME}" \
        --docker "host=ssh://${INPUT_USER}@${INPUT_HOST}:${INPUT_PORT}"
fi

docker context use "${CONTEXT_NAME}"
docker context ls

echo "::endgroup::"

echo -e "🐳 \u001b[32;1m Setup Context Complete"
