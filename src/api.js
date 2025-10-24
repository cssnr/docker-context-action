const fs = require('node:fs')
const github = require('@actions/github')

class Api {
    /**
     * GitHub Api
     * @param {String} token
     * @param {Object} repo
     */
    constructor(token, repo) {
        this.repo = repo
        this.octokit = github.getOctokit(token)
    }

    /**
     * Get File Content
     * https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
     * @param {String} ref
     * @param {String} path
     * @param {String} [dest]
     * @return {Promise<String>} File Content String
     */
    async getContent(ref, path, dest) {
        console.debug('getContent:', path)
        const response = await this.octokit.rest.repos.getContent({
            ...this.repo,
            path: path,
            ref,
        })
        // console.debug('response:', response)
        const data = Buffer.from(response.data.content, response.data.encoding).toString()
        if (dest) {
            console.debug('writeFileSync:', dest)
            fs.writeFileSync(dest, data)
        }
        return data
    }
}

module.exports = Api
