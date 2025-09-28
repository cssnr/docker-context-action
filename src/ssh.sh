#!/usr/bin/env bash
# https://github.com/cssnr/docker-context-action

set -e

echo "Setup SSH"

#echo "STATE_SSH_CLEANUP=true" >> "${GITHUB_ENV}"

SSH_DIR="${HOME}/.ssh"

echo "::group::Environment Details"
echo "User: $(whoami)"
echo "Script: ${0}"
echo "Home Directory: ${HOME}"
echo "SSH Directory: ${SSH_DIR}"
echo "Current Directory: $(pwd)"
echo "::endgroup::"

echo "::group::Running: ssh-keyscan"
mkdir -p "${SSH_DIR}" ~/.ssh
chmod 0700 "${SSH_DIR}" ~/.ssh
ssh-keyscan -p "${INPUT_PORT}" -H "${INPUT_HOST}" >> "${SSH_DIR}/known_hosts"
echo "::endgroup::"

if [[ -z "${INPUT_SSH_KEY}" ]];then
    echo "::group::Copying SSH Key to Remote Host"
    ssh-keygen -q -f "${SSH_DIR}/id_rsa" -N "" -C "docker-stack-deploy-action"
    eval "$(ssh-agent -s)"
    ssh-add "${SSH_DIR}/id_rsa"
    export SSHPASS="${INPUT_PASS}"
    sshpass -e \
        ssh-copy-id -i "${SSH_DIR}/id_rsa" -o ConnectTimeout=30 \
            -p "${INPUT_PORT}" "${INPUT_USER}@${INPUT_HOST}"
    echo "STATE_SSH_CLEANUP=true" >> "${GITHUB_ENV}"
else
    echo "::group::Adding SSH Key to SSH Agent"
    echo "${INPUT_SSH_KEY}" > "${SSH_DIR}/id_rsa"
    chmod 0600 "${SSH_DIR}/id_rsa"
    eval "$(ssh-agent -s)"
    ssh-add "${SSH_DIR}/id_rsa"
fi
echo "::endgroup::"

echo -e "📟 \u001b[32;1m Setup SSH Complete"
