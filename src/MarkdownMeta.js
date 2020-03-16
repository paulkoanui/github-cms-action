const core = require('@actions/core')
const Meta = require('./Meta')

class MarkdownMeta extends Meta {
  
  constructor() {
    super()
    this.target_type = "MarkdownContent"
  }
  
  create(issue_num, id_target, state){
    return super.create({
      path: `${process.env.META_PATH}/${core.getInput('collection')}/${issue_num}.json`,
      metadata: {
        target_type: this.target_type,
        state,
        issue_num,
        id_target,
        updated: new Date().toUTCString()
      }
    })
  }
  
  read(issue_num){
    return super.read({
      path: `${process.env.META_PATH}/${core.getInput('collection')}/${issue_num}.json`
    })
  }
  
  delete(issue_num){
    return super.delete({
      path: `${process.env.META_PATH}/${core.getInput('collection')}/${issue_num}.json`
    })
  }
}

module.exports = MarkdownMeta