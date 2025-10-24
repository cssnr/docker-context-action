[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/docker-context-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-context-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/docker-context-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-context-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/docker-context-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-context-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/docker-context-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/docker-context-action/blob/master/src)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/docker-context-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/docker-context-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/docker-context-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/docker-context-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/docker-context-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/docker-context-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_docker-context-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_docker-context-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/docker-context-action?logo=github&label=updated)](https://github.com/cssnr/docker-context-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/docker-context-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/docker-context-action)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/docker-context-action?logo=github)](https://github.com/cssnr/docker-context-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/docker-context-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/docker-context-action?logo=sharp&logoColor=white)](https://github.com/cssnr/docker-context-action)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/docker-context-action?logo=github)](https://github.com/cssnr/docker-context-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/docker-context-action?style=flat&logo=github)](https://github.com/cssnr/docker-context-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/docker-context-action?style=flat&logo=github)](https://github.com/cssnr/docker-context-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Docker SSH Context Action

- [Features](#Features)
- [Inputs](#Inputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

Set up a Remote Docker Context over SSH using Password or Keyfile Authentication.  
This allows all subsequent `docker` commands to run on the remote host ([context](https://docs.docker.com/engine/manage-resources/contexts/)).

```yaml
steps:
  - name: 'Docker Context'
    uses: cssnr/docker-context-action@v1
    with:
      host: ${{ secrets.DOCKER_HOST }}
      user: ${{ secrets.DOCKER_USER }}
      port: 22 # 22 is the default value - optional
      pass: ${{ secrets.DOCKER_PASS }} # or ssh_key - optional
      ssh_key: ${{ secrets.DOCKER_SSH_KEY }} # or pass - optional

  - name: 'Inspect Docker'
    runs: |
      docker context ls
      docker context inspect
      docker info
      docker ps
```

**Make sure to review the [Inputs](#Inputs).**

_Stack Deploy: If you only need to deploy a swarm or compose stack use: [cssnr/stack-deploy-action](https://github.com/cssnr/stack-deploy-action)_  
_Portainer Users: You can deploy directly to Portainer with: [cssnr/portainer-stack-deploy-action](https://github.com/cssnr/portainer-stack-deploy-action)_

## Features

- Configure SSH using keyfile or password: [src/ssh.sh](src/ssh.sh)
- Creates and uses a remote docker context: [src/context.sh](src/context.sh)
- Option to run Docker login for any registry: [src/login.sh](src/login.sh)
- Clean up the authorized_keys file for password: [src/cleanup.sh](src/cleanup.sh)

Don't see your feature here? Please help by submitting a [Feature Request](https://github.com/cssnr/docker-context-action/discussions/categories/feature-requests).

## Inputs

| Input&nbsp;Name                              |     Default&nbsp;Value     | Description&nbsp;of&nbsp;Input |
| :------------------------------------------- | :------------------------: | :----------------------------- |
| [host](#host)                                |         _Required_         | SSH Hostname or IP             |
| `user`                                       |         _Required_         | SSH Username                   |
| `port`                                       |            `22`            | SSH Port                       |
| [pass](#passssh_key)                         | [or ssh_key](#passssh_key) | SSH Password                   |
| [ssh_key](#passssh_key)                      |  [or pass](#passssh_key)   | SSH Key File                   |
| [registry_user](#registry_userregistry_pass) |             -              | Registry Username              |
| [registry_pass](#registry_userregistry_pass) |             -              | Registry Password              |
| [registry_host](#registry_host)              |        `docker.io`         | Registry Host                  |
| token                                        |       `github.token`       | GitHub Access Token PAT [^1]   |

With all inputs (not all required).

```yaml
- name: 'Docker Context'
  uses: cssnr/docker-context-action@v1
  with:
    host: ${{ secrets.DOCKER_HOST }}
    user: ${{ secrets.DOCKER_USER }}
    port: 22 # 22 is default, you can remove or change this
    pass: ${{ secrets.DOCKER_PASS }} # not needed with ssh_key
    ssh_key: ${{ secrets.DOCKER_SSH_KEY }} # not needed with pass
    registry_user: ${{ vars.GHCR_USER }}
    registry_pass: ${{ secrets.GHCR_PASS }}
    registry_host: 'ghcr.io'
```

**Make sure to check out the [Examples](#Examples).**

---

#### host

The hostname or IP address of the remote docker server.

If your hostname is behind a proxy like Cloudflare you will need to use the IP address.

#### pass/ssh_key

Required to set up the SSH the connection. Provide a `pass` or `ssh_key` but not both.

If this was done in a previous step, omit these values to skip this step.

#### registry_user/registry_pass

Only set these to run `docker login`.

This can also be run manually in another step.

#### registry_host

To run `docker login` on another registry. Requires both `registry_user/registry_pass`.

Example: `ghcr.io`.

## Examples

Example workflow.

```yaml
steps:
  - name: 'Docker Context'
    uses: cssnr/docker-context-action@v1
    with:
      host: ${{ secrets.DOCKER_HOST }}
      user: ${{ secrets.DOCKER_USER }}
      pass: ${{ secrets.DOCKER_PASS }}

  - name: 'Stack Deploy'
    runs: docker stack deploy -c docker-compose.yaml --detach=false stack-name
```

For more examples, you can check out other projects using this action:  
https://github.com/cssnr/docker-context-action/network/dependents

## Tags

The following rolling [tags](https://github.com/cssnr/docker-context-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                           | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/docker-context-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/docker-context-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/docker-context-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/docker-context-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/docker-context-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/docker-context-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/docker-context-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/docker-context-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/docker-context-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/docker-context-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Release%20Notes)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

For more information, see the CSSNR [CONTRIBUTING.md](https://github.com/cssnr/.github/blob/master/.github/CONTRIBUTING.md#contributing).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [js-test-action](https://github.com/smashedr/js-test-action?tab=readme-ov-file#readme) - JavaScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Python
- [ts-test-action](https://github.com/smashedr/ts-test-action?tab=readme-ov-file#readme) - TypeScript
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker Image

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)

[^1]:
    The `${{ github.token }}` / `{{ secrets.GITHUB_TOKEN }}` is automatically passed, there is no need to manually pass these!
    This is only available to allow users to pass a different token they have created and defined in their `secrets`.
