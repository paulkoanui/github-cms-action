const Octokit = require("@octokit/rest")

class Content {
  
  constructor(issue_num) {
    this.issue_num = issue_num
  }
  
  publish(){
    return Promise.reject(new Error('Not implemented'))
  }
  
  archive(){
    return Promise.reject(new Error('Not implemented'))
  }
  
  unpublish(){
    return Promise.reject(new Error('Not implemented'))
  }
  
  meta(){
    return Promise.reject(new Error('Not implemented'))
  }
  
  data(){
    const auth = process.env.SRC_AUTH
    const owner = process.env.SRC_OWNER
    const repo = process.env.SRC_REPO
    const octokit = new Octokit({ auth })
    const issue_number = this.issue_num
    const parms = { owner, repo, issue_number }
    return octokit.issues.get(parms).then(({ data: issue }) => {
      return octokit.issues.listComments(parms).then(({ data: comments }) => {
        return { issue, comments }
      })
    })
  }
}

module.exports = Content