const Octokit = require("@octokit/rest")

/*
 NOTE: it is possible that calls to commit() and remove() will fail when another update occurs between the time
 this operation retrieves the latest SHA and makes its update.
 
 When these functions encounter an error that indicates this scenario (status = 409), we must retry until the
 operation succeeds or a number of retries is reached.
 */

function commit(args, tries = 0) {
  
  const { path, message, payload, scope } = args
  
  //input validation
  if (!path){
    return Promise.reject(new Error('Invalid input: path'))
  }
  if (!payload){
    return Promise.reject(new Error('Invalid input: payload'))
  }
  if (!scope){
    return Promise.reject(new Error('Invalid input: scope'))
  }
  
  const auth = process.env[`${scope}_AUTH`]
  const owner = process.env[`${scope}_OWNER`]
  const repo = process.env[`${scope}_REPO`]
  const octokit = new Octokit({ auth })
  const encoded = Buffer.from(payload).toString('base64')
  
  return octokit.repos.getContents({
    owner,
    repo,
    path
  }).then(({ data }) => {
    const sha = (data && data.sha) || null
    return octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path,
      message: message || '',
      content: encoded,
      sha
    }).then(({ data }) => {
      
      return { ...args, ...data }
      
    }).catch((err) => {
      if (err.status === 409 && tries <= 3){
        return commit(args, ++tries)
      }else{
        throw err
      }
    })
  }).catch((err) => {
    if (err.status === 404){
      return octokit.repos.createOrUpdateFile({
        owner,
        repo,
        path,
        message: message || '',
        content: encoded
      }).then(({ data }) => {
        
        return { ...args, ...data }
        
      }).catch((err) => {
        if (err.status === 409 && tries <= 3){
          return commit(args, ++tries)
        }else{
          throw err
        }
      })
    }else{
      
      throw err
      
    }
  })
  
}

function remove(args, tries = 0) {
  
  const { path, message, scope } = args
  
  //input validation
  if (!path){
    return Promise.reject(new Error('Invalid input: path'))
  }
  if (!scope){
    return Promise.reject(new Error('Invalid input: scope'))
  }
  
  const auth = process.env[`${scope}_AUTH`]
  const owner = process.env[`${scope}_OWNER`]
  const repo = process.env[`${scope}_REPO`]
  const octokit = new Octokit({ auth })
  
  return octokit.repos.getContents({
    owner,
    repo,
    path
  }).then(({ data }) => {
    const sha = (data && data.sha) || null
    return octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message: message || '',
      sha
    }).then(({ data }) => {
      return { ...args, ...data }
    }).catch((err) => {
      if (err.status === 409 && tries <= 3){
        return remove(args, ++tries)
      }else{
        throw err
      }
    })
  }).catch((err) => {
    if (err.status !== 404){
      throw err
    }else{
      return { ...args, status: 404 }
    }
  })
  
}

function read(args) {
  const { path, scope } = args
  
  //input validation
  if (!path){
    return Promise.reject(new Error('Invalid input: path'))
  }
  if (!scope){
    return Promise.reject(new Error('Invalid input: scope'))
  }
  
  const auth = process.env[`${scope}_AUTH`]
  const owner = process.env[`${scope}_OWNER`]
  const repo = process.env[`${scope}_REPO`]
  const octokit = new Octokit({ auth })
  
  return octokit.repos.getContents({
    owner,
    repo,
    path
  }).then(({ data }) => {
    return Buffer.from(data.content, 'base64').toString('ascii')
  })
}
module.exports = { commit, remove, read }