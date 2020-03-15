// const Meta = require('../Meta')

class MarkdownMeta {
  
  constructor() {
    this.target_type = "MarkdownContent"
  }
  
  create(issue_num, id_target, state){
    return new Promise((resolve, reject) => {
      const issue_num_pass = 1
      //TODO: get the issue details, form the target content item, persist to target system, create/update metadata record
      
      let args
      
      if (issue_num === issue_num_pass){
        resolve({
          target_type: this.target_type,
          state,
          issue_num,
          id_target,
          created_time: new Date().getTime(),
          status: 200
        })
      }else{
        reject({
          status: 500,
          target_type: this.target_type,
          state,
          issue_num,
          id_target,
          message: 'Internal server error'
        })
      }
    })
  }
  
  read(issue_num){
    return new Promise((resolve, reject) => {
      const issue_num_pass = 1
      const issue_num_fail = 1000
      const state = 'published'
      const id_target = 'ABC123xyz'
      const resource = 'meta-record-1231daf3212'
  
      //TODO: get the issue details, form the target content item, persist to target system, create/update metadata record
  
      if (issue_num === issue_num_pass){
        resolve({
          target_type: this.target_type,
          state,
          issue_num,
          id_target,
          status: 200
        })
      }else if (issue_num === issue_num_fail){
        reject({
          target_type: this.target_type,
          state,
          issue_num,
          id_target,
          resource,
          status: 404
        })
      }else{
        reject({
          status: 500,
          target_type: this.target_type,
          issue_num,
          message: 'Internal server error'
        })
      }
      
    })
  }

  delete(issue_num){
    return new Promise((resolve, reject) => {
      const issue_num_pass = 1
      const issue_num_fail = 1000
      const state = 'published'
      const id_target = 'ABC123xyz'
      
      //TODO: get the issue details, form the target content item, persist to target system, create/update metadata record
      
      if (issue_num === issue_num_pass){
        resolve({
          target_type: this.target_type,
          state,
          issue_num,
          id_target,
          status: 200
        })
      }else if (issue_num === issue_num_fail){
        reject({
          target_type: this.target_type,
          state,
          issue_num,
          id_target,
          status: 404
        })
      }else{
        reject({
          status: 500,
          target_type: this.target_type,
          issue_num,
          message: 'Internal server error'
        })
      }
    })
  }
}

module.exports = MarkdownMeta