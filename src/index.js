const core = require('@actions/core')
const exec = require('@actions/exec')

;(async () => {
    try {
        const stage = core.getState('STAGE') || 'main'

        if (stage === 'main') {
            core.info('🏳️ Starting - Test Exec Action')

            if (core.getInput('pass') || core.getInput('ssh_key')) {
                console.log('▶️ Running step: src/ssh.sh')
                const ssh = await exec.getExecOutput('bash src/ssh.sh')
                console.log('ssh.exitCode:', ssh.exitCode)
            } else {
                core.info('No pass or ssh_key provided. Skipping Setup SSH...')
            }

            console.log('▶️ Running step: src/context.sh')
            const context = await exec.getExecOutput('bash src/context.sh')
            console.log('context.exitCode:', context.exitCode)

            if (core.getInput('registry_user') && core.getInput('registry_pass')) {
                console.log('▶️ Running step: src/login.sh')
                const ssh = await exec.getExecOutput('bash src/login.sh')
                console.log('ssh.exitCode:', ssh.exitCode)
            } else {
                core.info('No registry_user/registry_pass. Skipping Docker Login...')
            }

            core.saveState('STAGE', 'cleanup')
        } else if (stage === 'cleanup') {
            if (core.getState('SSH_CLEANUP')) {
                console.log('▶️ Running step: src/cleanup.sh')
                const cleanup = await exec.getExecOutput('bash src/cleanup.sh')
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
