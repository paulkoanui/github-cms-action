const core = require('@actions/core')
const MarkdownContent = require('./MarkdownContent')
const states = [ "PUBLISH", "UNPUBLISH", "ARCHIVE" ]
module.exports = function publishAction(event){
  let action = { op: "NOOP" }
  const actionInput = core.getInput('action')
  if (states.indexOf(actionInput) != -1){
    action.op = actionInput
    // if the project card is a full Issue (not a Note)...
    if (event.project_card && event.project_card.content_url){
      const parts = event.project_card.content_url.split('/')
      const issue_num = Number(parts[parts.length - 1])
      
      if (actionInput === "PUBLISH") {
        action.execute = () => new MarkdownContent(issue_num).publish()
      }else if (actionInput === "ARCHIVE") {
        action.execute = () => new MarkdownContent(issue_num).archive()
      }else if(actionInput === "UNPUBLISH"){
        action.execute = () => new MarkdownContent(issue_num).unpublish()
      }
    }
  }
  return action
}