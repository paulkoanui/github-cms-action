const MarkdownMeta = require('../src/MarkdownMeta')
const testActionEnv = require('./data/test-action-env')
const { setupVars, setEnv } = require('./env_util')

//TODO: setup the test inputs so that core.getInput('collection') returns something.

beforeEach(() => {
  // setup environment variables
  setupVars(testActionEnv)
})

describe('MarkdownMeta Network Tests', () => {
  
  test('MarkdownMeta.Create with issue_num, id_target, state succeeds with status 200', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    const meta = new MarkdownMeta()
    const args = {
      state: 'published',
      issue_num: 1,
      id_target: 'ABC123Xyz'
    }
    return expect(meta.create(args.issue_num, args.id_target, args.state)).resolves.toMatchObject({
      content: expect.any(Object),
      commit: expect.any(Object)
    })
  })
  
  test('MarkdownMeta.Create with path, message, and metadata fails with status 401', () => {
    //modify the credentials to get bad credentials 401
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    setEnv('META_AUTH', '***')
    const meta = new MarkdownMeta()
    const args = {
      state: 'published',
      issue_num: 1,
      id_target: 'ABC123Xyz'
    }
    return expect(meta.create(args.issue_num, args.id_target, args.state)).rejects.toThrowError('Bad credentials')
  })

  test('MarkdownMeta.Read with path succeeds with status 200 and metadata', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    const meta = new MarkdownMeta()
    const args = {
      issue_num: 1
    }
    return expect(meta.read(args.issue_num)).resolves.toBeInstanceOf(Object)
  })
  
  test('MarkdownMeta.Read with path fails with status 404', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    const meta = new MarkdownMeta()
    const args = {
      issue_num: 1890098
    }
    return expect(meta.read(args.issue_num)).rejects.toThrowError('Not Found')
  })
  
  test('MarkdownMeta.Delete with path succeeds with status 200', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    const meta = new MarkdownMeta()
    const args = {
      state: 'published',
      issue_num: 1,
      id_target: 'ABC123Xyz'
    }
    return expect(meta.create(args.issue_num, args.id_target, args.state).then(() => meta.delete(args.issue_num))).resolves.toMatchObject({
      path: expect.any(String),
      commit: expect.any(Object)
    })
  })
  
  test('MarkdownMeta.Delete with path resolves with status 404', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
    const t = new Date().getTime()
    const meta = new MarkdownMeta()
    const args = {
      issue_num: t
    }
    return expect(meta.delete(args)).resolves.toMatchObject({
      path: expect.any(String),
      status: 404,
    })
  })
  
})