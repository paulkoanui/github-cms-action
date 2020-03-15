const core = require('@actions/core')
const publishAction = require('../src/PublishAction')
const MarkdownMeta = require('../src/MarkdownMeta')
const MarkdownContent = require('../src/MarkdownContent')
const testActionEnv = require('./data/test-action-env')
const { setupVars } = require('./env_util')

jest.mock('../src/MarkdownMeta')
jest.mock('../src/MarkdownContent')

beforeAll(() => {
  // setup environment variables
  setupVars(testActionEnv)
  setupVars({ "meta_repo": "github-cms" }, "INPUT_")
})

describe('Core Environment', () => {
  
  test("`core.getInput()` returns an expected String value", () => {
    expect(core.getInput("meta_repo")).toBe("github-cms")
  })
  
})

describe('Input Validation', () => {
  
  const moveInputVars = {
    "action": "moved",
    "changes": {
      "column_id": {
        "from": expect.any(Number)
      }
    },
    "project_card": {
      "column_id": expect.any(Number),
      "content_url": expect.any(String)
    }
  }
  
  const convertedInputVars = {
    "action": "converted",
    "changes": {
      "note": {
        "from": expect.any(String)
      }
    },
    "project_card": {
      "column_id": expect.any(Number),
      "content_url": expect.any(String)
    }
  }
  
  const deletedInputVars = {
    "action": "deleted",
    "project_card": {
      "column_id": expect.any(Number),
      "content_url": expect.any(String)
    }
  }
  
  test("Publication event ProjectCard.Moved contains all required input parameters", () => {
    const events = [
      require('./data/project-card-moved-to-published-event'),
      require('./data/project-card-moved-to-archived-event'),
      require('./data/project-card-moved-to-staging-event')
    ]
  
    events.forEach((event) => {
      expect(event).toMatchObject(moveInputVars)
    })
  })
  
  test("Publication event ProjectCard.Converted contains all required input parameters", () => {
    const events = [
      require('./data/project-card-converted-in-published-event'),
      require('./data/project-card-converted-in-archived-event'),
      require('./data/project-card-converted-in-staging-event')
    ]
    events.forEach((event) => {
      expect(event).toMatchObject(convertedInputVars)
    })
  })
  
  test("Publication event ProjectCard.Deleted contains all required input parameters", () => {
    const events = [
      require('./data/project-card-deleted-in-published-event'),
      require('./data/project-card-deleted-in-archived-event'),
      require('./data/project-card-deleted-in-staging-event')
    ]
    events.forEach((event) => {
      expect(event).toMatchObject(deletedInputVars)
    })
  })
  
})

describe('Do all publication events resolve to the proper publication action (Publish/Unpublish/Archive)?', () => {

  test.each([
    [
      require('./data/project-card-moved-to-staging-event'),
      { op: 'NOOP' },
      { "action": "NOOP", "collection": "_posts" }
    ],
    [
      require('./data/project-card-moved-to-published-event'),
      { op: 'PUBLISH' },
      { "action": "PUBLISH", "collection": "_posts" }
    ],
    [
      require('./data/project-card-moved-to-archived-event'),
      { op: 'ARCHIVE' },
      { "action": "ARCHIVE", "collection": "_posts" }
    ]
  ])("Publication event ProjectCard.Moved to new state produces expected action", (event, expected, input) => {
    setupVars(input, "INPUT_")
    expect(publishAction(event)).toMatchObject(expected)
  })

  test.each([
    [
      require('./data/project-card-converted-in-staging-event'),
      { op: 'NOOP' },
      { "action": "NOOP", "collection": "_posts" }
    ],
    [
      require('./data/project-card-converted-in-published-event'),
      { op: 'PUBLISH' },
      { "action": "PUBLISH", "collection": "_posts" }
    ],
    [
      require('./data/project-card-converted-in-archived-event'),
      { op: 'ARCHIVE' },
      { "action": "ARCHIVE", "collection": "_posts" }
    ]
  ])("Publication event ProjectCard.Converted produces expected action based on state", (event, expected, input) => {
    setupVars(input, "INPUT_")
    expect(publishAction(event)).toMatchObject(expected)
  })

  test.each([
    [
      require('./data/project-card-deleted-in-staging-event'),
      { op: 'UNPUBLISH' },
      { "action": "UNPUBLISH", "collection": "_posts" }
    ],
    [
      require('./data/project-card-deleted-in-published-event'),
      { op: 'UNPUBLISH' },
      { "action": "UNPUBLISH", "collection": "_posts" }
    ],
    [
      require('./data/project-card-deleted-in-archived-event'),
      { op: 'UNPUBLISH' },
      { "action": "UNPUBLISH", "collection": "_posts" }
    ]
  ])("Publication event ProjectCard.Deleted produces expected action based on state", (event, expected, input) => {
    setupVars(input, "INPUT_")
    expect(publishAction(event)).toMatchObject(expected)
  })

})

describe('Do all content actions exhibit the expected behavior in success and failure cases?', () => {
  
  const issue_num_pass = 1
  const issue_num_fail = 1000
  const issue_num_500 = null
  
  test('Content instance is of target type', () => {
    const c = new MarkdownContent()
    expect(c).toBeInstanceOf(MarkdownContent)
  })
  
  test('Content.Publish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time published', () => {
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.publish()).resolves.toMatchObject({
      issue_num: expect.any(Number),
      id_target: expect.any(String),
      published_time: expect.any(Number),
      status: 200
    })
  })
  
  test('Content.Publish(IssueNumber) fails with status 404 and the \'not found\' resource name', () => {
    const c = new MarkdownContent(issue_num_fail)
    return expect(c.publish()).rejects.toMatchObject({
      resource: expect.any(String),
      issue_num: expect.any(Number),
      status: 404
    })
  })
  
  test('Content.Publish(IssueNumber) fails with status 500 and the related Error details', () => {
    const c = new MarkdownContent(issue_num_500)
    return expect(c.publish()).rejects.toMatchObject({
      status: 500,
      message: expect.any(String)
    })
  })
  
  test('Content.Archive(IssueNumber) succeeds with status 200 and values: id_src, id_target, time archived', () => {
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.archive()).resolves.toMatchObject({
      issue_num: expect.any(Number),
      id_target: expect.any(String),
      archived_time: expect.any(Number),
      status: 200
    })
  })
  
  test('Content.Archive(IssueNumber) fails with status 404 and the \'not found\' resource name', () => {
    const c = new MarkdownContent(issue_num_fail)
    return expect(c.archive()).rejects.toMatchObject({
      resource: expect.any(String),
      issue_num: expect.any(Number),
      status: 404
    })
  })
  
  test('Content.Archive(IssueNumber) fails with status 500 and the related Error details', () => {
    const c = new MarkdownContent(issue_num_500)
    return expect(c.archive()).rejects.toMatchObject({
      status: 500,
      message: expect.any(String)
    })
  })
  
  test('Content.Unpublish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time deleted', () => {
    const c = new MarkdownContent(issue_num_pass)
    return expect(c.unpublish()).resolves.toMatchObject({
      issue_num: expect.any(Number),
      id_target: expect.any(String),
      deleted_time: expect.any(Number),
      status: 200
    })
  })
  
  test('Content.Unpublish(IssueNumber) fails with status 404 and the \'not found\' resource name', () => {
    const c = new MarkdownContent(issue_num_fail)
    return expect(c.unpublish()).rejects.toMatchObject({
      resource: expect.any(String),
      issue_num: expect.any(Number),
      status: 404
    })
  })
  
  test('Content.Unpublish(IssueNumber) fails with status 500 and the related Error details', () => {
    const c = new MarkdownContent(issue_num_500)
    return expect(c.unpublish()).rejects.toMatchObject({
      status: 500,
      message: expect.any(String)
    })
  })
  
})

describe('Do all metadata management actions exhibit the expected behavior in success and failure cases?', () => {
  
  const issue_num_pass = 1
  const issue_num_fail = 1000
  const issue_num_500 = null
  const id_target = 'abc123XyZ'
  const target_type = 'MarkdownContent'
  const Meta = new MarkdownMeta()
  
  test('MarkdownMeta.Create(IssueNumber, id_target, target_type, state) succeeds with status 200 and id_source, id_target, target_type, state', () => {
    const state = 'published'
    return expect(Meta.create(issue_num_pass, id_target, state)).resolves.toMatchObject({
      issue_num: expect.any(Number),
      id_target: expect.any(String),
      target_type: target_type,
      state: state,
      created_time: expect.any(Number),
      status: 200
    })
  })
  
  test('MarkdownMeta.Create(IssueNumber, id_target, type_target, state) fails with status 500 and id_target, target_type, and state', () => {
    const state = 'published'
    return expect(Meta.create(issue_num_500, id_target, state)).rejects.toMatchObject({
      id_target: expect.any(String),
      target_type: target_type,
      state: state,
      status: 500,
      message: expect.any(String)
    })
  })
  
  test('MarkdownMeta.Read(IssueNumber, type_target) succeeds with status 200 and id_source, id_target, type_target, state', () => {
    const state = 'published'
    return expect(Meta.read(issue_num_pass, target_type)).resolves.toMatchObject({
      issue_num: expect.any(Number),
      id_target: expect.any(String),
      target_type: target_type,
      state: state,
      status: 200
    })
  })
  
  test('MarkdownMeta.Read(IssueNumber, type_target) fails with status 404 and id_target, target_type', () => {
    return expect(Meta.read(issue_num_fail, target_type)).rejects.toMatchObject({
      id_target: expect.any(String),
      target_type: target_type,
      status: 404
    })
  })
  
  test('MarkdownMeta.Read(IssueNumber, type_target) fails with status 500', () => {
    return expect(Meta.read(issue_num_500, target_type)).rejects.toMatchObject({
      status: 500,
      message: expect.any(String)
    })
  })
  
  test('MarkdownMeta.Delete(IssueNumber, type_target) succeeds with status 200', () => {
    return expect(Meta.delete(issue_num_pass, target_type)).resolves.toMatchObject({
      issue_num: expect.any(Number),
      target_type: target_type,
      status: 200
    })
  })
  
  test('MarkdownMeta.Delete(IssueNumber, type_target) fails with status 404', () => {
    return expect(Meta.delete(issue_num_fail, target_type)).rejects.toMatchObject({
      issue_num: expect.any(Number),
      target_type: target_type,
      state: expect.any(String),
      status: 404
    })
  })
  
  test('MarkdownMeta.Delete(IssueNumber, type_target) fails with status 500', () => {
    return expect(Meta.delete(issue_num_500, target_type)).rejects.toMatchObject({
      target_type: target_type,
      status: 500,
      message: expect.any(String)
    })
  })
  
})