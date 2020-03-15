const core = require('@actions/core')
const Content = require('./Content')
const MarkdownMeta = require('./MarkdownMeta')
const meta = new MarkdownMeta()
const { commit, remove } = require('./Crud')
const slugify = require('@sindresorhus/slugify')
const fm = require('front-matter')
const json2yaml = require('./json2yaml')

function build(args) {
  return new Promise((resolve, reject) => {
    try{
      
      const { issue: src } = args
      const collection = core.getInput('collection') || ''
      const matter = makeMatter(collection, src)
      const payload = [
        '---',
        json2yaml(matter.attributes),
        '---',
        '',
        matter.body
      ].join('\n')
      
      resolve({
        ...args,
        path: matter.path,
        payload
      })
      
    }catch(err){
      reject(err)
    }
    
  })
}

function makeMatter(collection, src){
  
  const content = [ src.issue.body, ...src.comments.map((comment) => comment.body) ].join('\n') // || src.issue.title
  const issue = src.issue
  
  const matter = fm(content)
  const att = matter.attributes
  
  att.title = att.title || issue.title
  att.tags = att.tags || []
  
  // merge labels from issue into the tags
  if (issue.labels.length > 0){
    issue.labels.forEach((lbl) => {
      if (att.tags.indexOf(lbl.name) === -1){
        att.tags.push(lbl.name)
      }
    })
  }
  
  // use the given target_path or generate a filename
  let filename = null
  if (att.target_path){
    filename = att.target_path
  }else{
    filename = `${slugify(att.title)}.md`
    
    // prefix the filename with the date in case this is a special POSTS file
    let datePrefix = ''
    const matches = collection.toUpperCase().match(/POSTS/g)
    if (matches && matches.length === 1){
      datePrefix = `${issue.updated_at.split('T')[0]}-`
    }
    
    filename = `${datePrefix}${filename}`
  }
  
  return {
    path: `${collection}/${filename}`,
    attributes: att,
    body: matter.body
  }
}

function undoArchive(args) {
  args.message = `Remove '${args.path}'`
  args.scope = 'TARGET'
  const c_args = { ...args }
  c_args.path = `${process.env.TARGET_ARCHIVE_PATH}/${args.path}`
  args.message = `Remove '${c_args.path}'`
  return remove(c_args).then((out_args) => {
    return {
      ...out_args,
      ...args
    }
  })
}

function undoPublish(args) {
  args.message = `Remove '${args.path}'`
  args.scope = 'TARGET'
  return remove(args)
}

function publish(args) {
  args.message = `Publish '${args.path}'`
  args.scope = 'TARGET'
  return commit(args)
}

function archive(args) {
  args.message = `Archive '${args.path}'`
  args.scope = 'TARGET'
  const c_args = { ...args }
  c_args.path = `${process.env.TARGET_ARCHIVE_PATH}/${args.path}`
  return commit(c_args).then((out_args) => {
    return {
      ...out_args,
      ...args
    }
  })
}

function manageMeta(args) {
  return meta.create(args.issue_num, args.path, args.state)
}

function removeMeta(args) {
  return meta.delete(args.issue_num).then((result) => { return { metadata: args, ...result } })
}

class MarkdownContent extends Content {
  
  constructor(issue_num) {
    super(issue_num)
  }
  
  publish(){
    /*
      - build the target content item
      - remove from archived location (if exists)
      - add to published location
      - manage meta data
     */
    
    return super.data()
    .then((issue) => build({ issue, issue_num: this.issue_num }))
    .then(undoArchive)
    .then(publish)
    .then((args) => manageMeta({ ...args, state: 'published' }))
  }
  
  archive(){
    /*
      - build the target content item
      - remove from published location (if exists)
      - add to archived location
      - manage meta data
     */
    return super.data()
    .then((issue) => build({ issue, issue_num: this.issue_num }))
    .then(undoPublish)
    .then(archive)
    .then((args) => manageMeta({ ...args, state: 'archived' }))
  }
  
  unpublish(){
    /*
      - delete target item content
      - delete meta data
     */
    return this.meta().then((meta) => undoPublish({
      issue_num: this.issue_num,
      path: meta.id_target
    }))
    .then(undoArchive)
    .then((args) => removeMeta({ ...args, state: 'unpublished' }))
  }
  
  meta(){
    return meta.read(this.issue_num)
  }
  
  buildContent(args){
    return build(args)
  }
  
  makeMatterContent(collection, src){
    return makeMatter(collection, src)
  }
}

module.exports = MarkdownContent