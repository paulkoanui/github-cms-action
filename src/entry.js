/*
Here is the general flow for handling events in this system:
- receive state machine event
- determine the publication action
- instantiate all target system providers
- execute publication action for each provider
  - get the source item content
  - perform action
  - manage meta data
 */
const core = require('@actions/core')

module.exports = async function run() {
  try{
    
    const context = JSON.parse(process.env.GITHUB_CONTEXT)
    const publishAction = require('./PublishAction')
    const nextAction = publishAction(context.event)
    let result = ''
    if (nextAction.execute){
      const actionResult = await nextAction.execute()
      result = JSON.stringify(actionResult, null, 2)
    }
  
    core.debug(result)
    core.setOutput('result', result)
    
  }
  catch (error) {
    core.setFailed(JSON.stringify({
      message: error.message,
      stack: error.stack,
      status: error.status
    }, null, 2));
  }
}