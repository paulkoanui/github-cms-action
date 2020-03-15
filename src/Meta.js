const { commit, remove, read } = require('./Crud')

class Meta {
  
  /*
   write some JSON to a file somewhere in a github repository
   */
  create(args){
    const { metadata } = args
    args.payload = JSON.stringify(metadata, null, 2)
    args.scope = 'META'
    return commit(args)
  }
  
  /*
   read some JSON from a file somewhere in a github repository
   */
  read(args){
    args.scope = 'META'
    return read(args).then((content) => JSON.parse(content))
  }
  
  /*
   delete a file somewhere in a github repository
   */
  delete(args){
    args.scope = 'META'
    return remove(args)
  }
  
}

module.exports = Meta