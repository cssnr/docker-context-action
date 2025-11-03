// const fs = require('node:fs')
const core = require('@actions/core')
const exec = require('@actions/exec')

// const Api = require('./api')

;(async () => {
    try {
        const stage = core.getState('STAGE') || 'main'

        // // Debug
        // core.startGroup('Debug: github.context')
        // console.log(github.context)
        // core.endGroup() // Debug github.context
        core.startGroup('Debug: process.env')
        console.log(process.env)
        core.endGroup() // Debug process.env

        // const bin = `${process.env.RUNNER_TEMP}/docker-context-action`

        console.log('GITHUB_ACTION_REPOSITORY:', process.env.GITHUB_ACTION_REPOSITORY)
        console.log('GITHUB_ACTION_REF:', process.env.GITHUB_ACTION_REF)
        console.log('GITHUB_WORKSPACE:', process.env.GITHUB_WORKSPACE)
        let bin = `${process.env.GITHUB_WORKSPACE}/src`
        core.info(`bin: ${bin}`)
        if (process.env.GITHUB_ACTION_REPOSITORY && process.env.GITHUB_ACTION_REF) {
            const actionPath = `/home/runner/work/_actions/${process.env.GITHUB_ACTION_REPOSITORY}/${process.env.GITHUB_ACTION_REF}`
            core.info(`actionPath: ${actionPath}`)
            bin = `${actionPath}/src`
        }
        core.info(`bin: ${bin}`)
        await exec.exec('ls', ['-lah', bin], { ignoreReturnCode: true })

        if (stage === 'main') {
            core.info('🏳️ Starting - Docker Context Action')
            core.saveState('STAGE', 'cleanup')

            // core.startGroup(`Download Scripts: ${bin}`)
            // await downloadScript(bin)
            // core.endGroup() // Download Scripts

            if (core.getInput('pass') || core.getInput('ssh_key')) {
                console.log(`▶️ Running step: ${bin}/ssh.sh`)
                const ssh = await exec.getExecOutput(`bash ${bin}/ssh.sh`)
                console.log('ssh.exitCode:', ssh.exitCode)
            } else {
                core.info('No pass or ssh_key provided. Skipping Setup SSH...')
            }

            console.log(`▶️ Running step: ${bin}/context.sh`)
            const context = await exec.getExecOutput(`bash ${bin}/context.sh`)
            console.log('context.exitCode:', context.exitCode)

            if (core.getInput('registry_user') && core.getInput('registry_pass')) {
                console.log(`▶️ Running step: ${bin}/login.sh`)
                const ssh = await exec.getExecOutput(`bash ${bin}/login.sh`)
                console.log('ssh.exitCode:', ssh.exitCode)
            } else {
                core.info('No registry_user/registry_pass. Skipping Docker Login...')
            }
        } else if (stage === 'cleanup') {
            if (core.getState('SSH_CLEANUP')) {
                console.log(`▶️ Running step: ${bin}/cleanup.sh`)
                const cleanup = await exec.getExecOutput(`bash ${bin}/cleanup.sh`)
                console.log('cleanup.exitCode:', cleanup.exitCode)
            } else {
                core.info('No cleanup required. Skipping Cleanup...')
            }
        }
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

// /**
//  * Download bin Scripts
//  * @param {String} bin
//  * @return {Promise<void>}
//  */
// async function downloadScript(bin) {
//     const token = core.getInput('token', { required: true })
//     const workflowRef = process.env.GITHUB_WORKFLOW_REF
//     console.log('workflowRef:', workflowRef)
//     const ref = workflowRef.split('@')[1]
//     console.log('ref:', ref)
//     const repo = { owner: workflowRef.split('/')[0], repo: workflowRef.split('/')[1] }
//     console.log('repo:', repo)
//     const api = new Api(token, repo)
//     fs.mkdirSync(bin)
//     await api.getContent(ref, 'src/ssh.sh', `${bin}/ssh.sh`)
//     await api.getContent(ref, 'src/context.sh', `${bin}/context.sh`)
//     if (core.getInput('registry_user') && core.getInput('registry_pass')) {
//         await api.getContent(ref, 'src/login.sh', `${bin}/login.sh`)
//     }
//     await api.getContent(ref, 'src/cleanup.sh', `${bin}/cleanup.sh`)
//     await exec.getExecOutput(`ls -lah ${bin}`)
// }
