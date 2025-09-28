#!/usr/bin/env bash
# https://github.com/cssnr/docker-context-action

set -e

echo "Docker Login"

#if [[ -n "${INPUT_REGISTRY_USER}" && -n "${INPUT_REGISTRY_PASS}" ]];then

echo -e "::group::Logging in to Registry: \u001b[36;1m${INPUT_REGISTRY_HOST:-Docker Hub}"

echo "${INPUT_REGISTRY_PASS}" |
    docker login --username "${INPUT_REGISTRY_USER}" --password-stdin "${INPUT_REGISTRY_HOST}"

echo "::endgroup::"

echo -e "🔑 \u001b[32;1m Docker Login Complete"
