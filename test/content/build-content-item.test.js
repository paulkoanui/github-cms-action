const { setupVars } = require('../env_util')

const MarkdownContent = jest.requireActual('../../src/MarkdownContent')

describe('Content Build Tests', () => {
  
  beforeAll(() => {
    setupVars({ "collection": "_posts" }, "INPUT_")
  })
  
  test('End to end content build given an issue content', () => {
    const src = require('../data/sample-issue-data')
    const c = new MarkdownContent(src.issue.number)
    const args = { issue: src, issue_num: src.issue.number }
    return expect(c.buildContent(args)).resolves.toMatchObject({
      issue: expect.any(Object),
      issue_num: expect.any(Number),
      path: expect.any(String),
      payload: expect.any(String)
    })
  })
  
  test('No front matter, "_pages" collection, generate slugified filename from issue title', () => {
    const src = require('../data/sample-issue-data')
    const c = new MarkdownContent(src.issue.number)
    const collection = '_pages'
    src.issue.body = ""
    src.comments = []
    
    expect(c.makeMatterContent(collection, src)).toMatchObject({
      path: '_pages/first-issue-test.md',
      attributes: { title: 'First Issue Test', tags: [ 'bug' ] },
      body: ''
    })
  })
  
  test('Title in front matter, "_pages" collection, generate slugified filename from front matter title', () => {
    const src = require('../data/sample-issue-data')
    const c = new MarkdownContent(src.issue.number)
    const collection = '_pages'
    src.issue.body = "---\ntitle: How to undo your git failure?\ntags: [External Post, Git]\nstyle: fill\ncolor: warning\ndescription: Using `git reflog` and `git reset` to save your code.\nexternal_url: https://blog.usejournal.com/how-to-undo-your-git-failure-b76e31ecac74\n---"
    src.comments = []
    
    expect(c.makeMatterContent(collection, src)).toMatchObject({
      path: '_pages/how-to-undo-your-git-failure.md',
      attributes: {
        title: 'How to undo your git failure?',
        tags: [ 'External Post', 'Git', 'bug' ],
        style: 'fill',
        color: 'warning',
        description: 'Using `git reflog` and `git reset` to save your code.',
        external_url: 'https://blog.usejournal.com/how-to-undo-your-git-failure-b76e31ecac74'
      },
      body: ''
    })
  })
  
  test('No front matter, "_posts" collection, generate date prefixed filename', () => {
    const src = require('../data/sample-issue-data')
    const c = new MarkdownContent(src.issue.number)
    const collection = '_posts'
    src.issue.body = ""
    src.comments = []
    
    expect(c.makeMatterContent(collection, src)).toMatchObject({
      path: '_posts/2020-01-18-first-issue-test.md',
      attributes: { title: 'First Issue Test', tags: [ 'bug' ] },
      body: ''
    })
  })
  
  test('Front matter tags and issue labels are merged properly', () => {
    const src = require('../data/sample-issue-data')
    const c = new MarkdownContent(src.issue.number)
    const collection = '_pages'
    src.issue.body = "---\ntags: [External Post, Git]\nstyle: fill\ncolor: warning\ndescription: Using `git reflog` and `git reset` to save your code.\nexternal_url: https://blog.usejournal.com/how-to-undo-your-git-failure-b76e31ecac74\n---"
    src.comments = []
    
    expect(c.makeMatterContent(collection, src)).toMatchObject({
      path: '_pages/first-issue-test.md',
      attributes: {
        tags: [ 'External Post', 'Git', 'bug' ],
        style: 'fill',
        color: 'warning',
        description: 'Using `git reflog` and `git reset` to save your code.',
        external_url: 'https://blog.usejournal.com/how-to-undo-your-git-failure-b76e31ecac74',
        title: 'First Issue Test'
      },
      body: ''
    })
  })
  
})

// const body = "---\ntitle: How to undo your git failure?\ntags: [External Post, Git]\nstyle: fill\ncolor: warning\ndescription: Using `git reflog` and `git reset` to save your code.\nexternal_url: https://blog.usejournal.com/how-to-undo-your-git-failure-b76e31ecac74\ntarget_path: 2015-09-25-how-to-undo-your-git-failure.md\n---"

