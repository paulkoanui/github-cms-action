const MarkdownContent = require('../src/MarkdownContent')
const testActionEnv = require('./data/test-action-env')
const { setupVars } = require('./env_util')

beforeAll(() => {
  // setup environment variables
  setupVars(testActionEnv)
})

describe('Do all Publish actions exhibit the expected behavior in success and failure cases?', () => {
  
  const issue_num_pass = 1
  const issue_num_fail = 1000
  const issue_num_500 = null
  
  test('MarkdownContent.Publish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time published', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.publish()).resolves.toMatchObject({
      metadata: {
        issue_num: expect.any(Number),
        id_target: expect.any(String),
        updated: expect.any(String),
        state: "published"
      }
    })
  })
  
  test('MarkdownContent.Publish(IssueNumber) fails with status 404 and the \'not found\' resource name', () => {
    const c = new MarkdownContent(issue_num_fail)
    const p = c.publish()
    return expect(p).rejects.toMatchObject({ status: 404 })
  })
  
  test('MarkdownContent.meta(IssueNumber) succeeds with status 200 and metadata record', () => {
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.meta()).resolves.toMatchObject({
      issue_num: expect.any(Number),
      id_target: expect.any(String),
      state: expect.any(String)
    })
  })
  
  test('MarkdownContent.meta(IssueNumber) fails with status 404', () => {
    const c = new MarkdownContent(issue_num_fail)
    return expect(c.meta()).rejects.toMatchObject({
      status: 404,
      message: expect.any(String)
    })
  })
  
})

describe('Do all Archive actions exhibit the expected behavior in success and failure cases?', () => {
  
  const issue_num_pass = 1
  const issue_num_fail = 1000
  const issue_num_500 = null
  
  test('MarkdownContent.Archive(IssueNumber) succeeds with status 200 and values: id_src, id_target, time archived', () => {
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.archive()).resolves.toMatchObject({
      metadata: {
        issue_num: expect.any(Number),
        id_target: expect.any(String),
        updated: expect.any(String),
        state: "archived"
      }
    })
  })
  
  test('MarkdownContent.Archive(IssueNumber) fails with status 404 and the \'not found\' resource name', () => {
    const c = new MarkdownContent(issue_num_fail)
    const p = c.archive()
    return expect(p).rejects.toMatchObject({ status: 404 })
  })
  
})

describe('Do all Unpublish actions exhibit the expected behavior in success and failure cases?', () => {
  
  const issue_num_pass = 1
  const issue_num_fail = 1000
  const issue_num_500 = null
  
  test('MarkdownContent.Unpublish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time deleted', () => {
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.unpublish()).resolves.toMatchObject({
      metadata: {
        issue_num: expect.any(Number),
        state: "unpublished"
      }
    })
  })
  
  test.only('MarkdownContent.Unpublish(IssueNumber) fails with status 404 and the \'not found\' resource name', () => {
    const c = new MarkdownContent(issue_num_fail)
    return expect(c.unpublish()).resolves.toMatchObject({
      metadata: {
        issue_num: expect.any(Number),
        path: expect.any(String),
        state: "unpublished",
        status: 404
      }
    })
  })
  
})