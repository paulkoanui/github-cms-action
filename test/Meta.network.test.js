const Meta = jest.requireActual('../src/Meta')
const testActionEnv = require('./data/test-action-env')
const { setupVars, setEnv } = require('./env_util')

beforeEach(() => {
  // setup environment variables
  setupVars(testActionEnv)
})

describe('GitHub API Tests', () => {
  
  test('Meta.Create with path, message, and metadata succeeds with status 200', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
  
    const meta = new Meta()
    const args = {
      path: `.testing/meta/issues/1`,
      message: 'Test Meta Create',
      metadata: {
        target_type: this.target_type,
        state: 'published',
        issue_num: 1,
        id_target: 'ABC123Xyz'
      }
    }
    return expect(meta.create(args)).resolves.toMatchObject({
      content: expect.any(Object),
      commit: expect.any(Object)
    })
  })
  
  test('Meta.Create with path, message, and metadata fails with status 401', () => {
    //modify the credentials to get bad credentials 401
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
  
    setEnv('META_AUTH', '***')
    const meta = new Meta()
    const args = {
      path: `.testing/meta/issues/1`,
      message: 'Test Meta Create',
      metadata: {
        target_type: this.target_type,
        state: 'published',
        issue_num: 1,
        id_target: 'ABC123Xyz'
      }
    }
    return expect(meta.create(args)).rejects.toThrowError('Bad credentials')
  })

  test('Meta.Read with path succeeds with status 200 and metadata', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
  
    const meta = new Meta()
    const args = {
      path: `.testing/meta/issues/1`
    }
    return expect(meta.read(args)).resolves.toBeTruthy()
  })
  test('Meta.Read with path fails with status 404', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
  
    const meta = new Meta()
    const args = {
      path: `.testing/meta/issues/1890098`
    }
    return expect(meta.read(args)).rejects.toThrowError('Not Found')
  })
  test('Meta.Delete with path succeeds with status 200', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
  
    const t = new Date().getTime()
    const meta = new Meta()
    const args = {
      path: `.testing/meta/issues/${t}`,
      message: 'Test Meta Create and Delete Flow',
      metadata: {
        target_type: this.target_type,
        state: 'published',
        issue_num: t,
        id_target: 'ABC123Xyz'
      }
    }
    return expect(meta.create(args).then(() => meta.delete(args))).resolves.toMatchObject({
      path: expect.any(String),
      commit: expect.any(Object)
    })
  })
  test('Meta.Delete with path fails with status 404', () => {
    setupVars({
      "action": "PUBLISH",
      "collection": "_posts"
    }, "INPUT_")
  
    const t = new Date().getTime()
    const meta = new Meta()
    const args = {
      path: `.testing/meta/issues/${t}`
    }
    return expect(meta.delete(args)).resolves.toMatchObject({
      path: expect.any(String),
      status: 404,
    })
  })
  
})