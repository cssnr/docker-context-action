const path = require('node:path')

const core = require('@actions/core')
const exec = require('@actions/exec')

;(async () => {
    try {
        const stage = core.getState('STAGE') || 'main'

        // Setup
        core.debug(`__dirname: ${__dirname}`)
        const bin = path.resolve(__dirname, '../src')
        core.debug(`bin: ${bin}`)

        const options = { ignoreReturnCode: true, silent: true }
        const out = await exec.getExecOutput('ls', ['-lah', bin], options)
        core.debug(`ls bin out: ${out.exitCode}\n${out.stdout}\n${out.stderr}`)

        // // Debug
        // core.startGroup('Debug: github.context')
        // console.log(github.context)
        // core.endGroup() // Debug github.context
        // core.startGroup('Debug: process.env')
        // console.log(process.env)
        // core.endGroup() // Debug process.env

        if (stage === 'main') {
            core.info('🏳️ Starting - Docker Context Action')
            core.saveState('STAGE', 'cleanup')

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
