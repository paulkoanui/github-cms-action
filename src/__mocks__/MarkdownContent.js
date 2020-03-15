const Content = require('../Content')
const MarkdownMeta = require('./MarkdownMeta')
const meta = new MarkdownMeta()

/*
  ### execute publication action for each provider
  - get the source item content
  - perform action
  - manage meta data
 */

function build(args) {
  return new Promise((resolve, reject) => {
    resolve(args)
  })
}

function undoArchive(args) {
  return new Promise((resolve, reject) => {
    resolve(args)
  })
}

function undoPublish(args) {
  return new Promise((resolve, reject) => {
    /*
      - delete target item content
      - delete meta data
     */
    const issue_num = args.issue_num
    const issue_num_pass = 1
    const issue_num_fail = 1000
    const id_target = 'abcXYZ123'
    //TODO: need to be able to pass the target "op"

    if (issue_num === issue_num_pass){
      resolve({
        issue_num: issue_num,
        id_target,
        deleted_time: new Date().getTime(),
        status: 200,
        op: args.op
      })
    }else if (issue_num === issue_num_fail){
      reject({
        resource: "target-sys-res-id",
        issue_num: issue_num,
        status: 404,
        op: args.op
      })
    }else{
      reject({
        status: 500,
        message: 'Internal server error',
        op: args.op
      })
    }
  })
}

function publish(args) {
  return new Promise((resolve, reject) => {
    const issue_num = args.issue_num
    const issue_num_pass = 1
    const issue_num_fail = 1000
    const id_target = 'abcXYZ123'
    //TODO: get the issue details, form the target content item, persist to target system, create/update metadata record
    
    if (issue_num === issue_num_pass){
      resolve({
        issue_num: issue_num,
        id_target,
        published_time: new Date().getTime(),
        status: 200,
        op: "PUBLISH"
      })
    }else if (issue_num === issue_num_fail){
      reject({
        resource: "target-sys-res-id",
        issue_num: issue_num,
        status: 404,
        op: "PUBLISH"
      })
    }else{
      reject({
        status: 500,
        issue_num: issue_num,
        message: 'Internal server error',
        op: "PUBLISH"
      })
    }
  })
}

function archive(args) {
  return new Promise((resolve, reject) => {
    const issue_num = args.issue_num
    const issue_num_pass = 1
    const issue_num_fail = 1000
    const id_target = 'abcXYZ123'
    //TODO: get the issue details, form the target content item, persist to target system, create/update metadata record

    if (issue_num === issue_num_pass){
      resolve({
        issue_num: issue_num,
        id_target,
        archived_time: new Date().getTime(),
        status: 200,
        op: "ARCHIVE"
      })
    }else if (issue_num === issue_num_fail){
      reject({
        resource: "target-sys-res-id",
        issue_num: issue_num,
        status: 404,
        op: "ARCHIVE"
      })
    }else{
      reject({
        issue_num: issue_num,
        status: 500,
        message: 'Internal server error',
        op: "ARCHIVE"
      })
    }
  })
}

function manageMeta(args) {
  return new Promise((resolve, reject) => {
    resolve(args)
  })
}

function removeMeta(args) {
  return new Promise((resolve, reject) => {
    resolve(args)
  })
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
    return build({ issue_num: this.issue_num, op: "PUBLISH" }).then(undoArchive).then(publish).then(manageMeta)
  }
  
  archive(){
    /*
      - build the target content item
      - remove from published location (if exists)
      - add to archived location
      - manage meta data
     */
    return build({ issue_num: this.issue_num, op: "ARCHIVE" }).then(undoPublish).then(archive).then(manageMeta)
  }
  
  unpublish(){
    /*
      - delete target item content
      - delete meta data
     */
    return undoPublish({ issue_num: this.issue_num, op: "UNPUBLISH" }).then(undoArchive).then(removeMeta)
  }
  
  meta(){
    return meta.read(this.issue_num)
  }
  
}

module.exports = MarkdownContent