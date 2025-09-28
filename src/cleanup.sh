#!/usr/bin/env bash
# https://github.com/cssnr/docker-context-action

set -e

echo "Cleanup SSH"

#echo "STATE_SSH_CLEANUP: ${STATE_SSH_CLEANUP}"
#if [[ -n "${STATE_SSH_CLEANUP}" ]];then

echo "Cleaning Up authorized_keys File"

ssh -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=30 -p "${INPUT_PORT}" "${INPUT_USER}@${INPUT_HOST}" \
    "sed -i '/docker-stack-deploy-action/d' ~/.ssh/authorized_keys"

echo -e "🧹 \u001b[32;1m Cleanup SSH Complete"
