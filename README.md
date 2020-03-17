# GitHub CMS Action

A GitHub repository has all of the ingredients for serving as a content management system.

In the scope of this project:
- **Content management system** is defined as a system for managing web pages and/or posts.  It provides functionality that allows users to draft, publish, archive, and delete content.  It represents the source of truth for all content that it manages.
- **Content publication** is the process of synchronizing source content with some target system based on the content's publication state.
- **Source system** for all content is GitHub Issues where each issue represents one content item.
- **Target system** is a GitHub repository where published content items are rendered as Markdown files.  This repository is rendered as a website with GitHub Pages.
- **Meta system** is a GitHub repository where source/target relationships are stored as JSON files. When source content is published, metadata regarding the source/target relationship is updated.
- **Publication states** are managed through a GitHub Project that acts as a state machine.
- **Publication actions** are defined with JavaScript in Node.js and executed by GitHub Actions. 


## Publication States
Source content can be in one of four publication states:
- Staged
  - Items in this state are "staged" for a publishing action.  That means, moving from this state to Published or Archived will execute that publishing action (Publish or Archive).  Moving from Published or Archived to this state will produce no publishing action.
- Published
  - Items in this state have a metadata record that relates the source item to a target item.
- Archived
  - Items in this state have a metadata record that relates the source item to a target item.
- Unpublished
  - Items in this state are not mapped to the target system.  There is no metadata record for the source item.  If the item is currently in a Published or Archived state, it will be removed from the target system and its metadata record will also be removed.

## Usage
There are multiple ways that you can work with this action.

### Use this repository as a template to create an action copy in a new repository.  
Click the `Use this Template` and provide the new repo details for your action.

### Consume this action from a workflow file contained in another repository.
In the workflow file, reference this repository with a version.  For example:
```yaml
uses: paulkoanui/github-cms-action@v1
with:
  action: "PUBLISH"
  collection: "_posts"
```
> The above is an excerpt from the larger publication workflow meant to show how to reference the action (`paulkoanui/github-cms-action@v1`).  
> See https://github.com/paulkoanui/github-cms-action/releases for release versions of this action.
> See `/workflows/github-cms.template.yml` for the full workflow specification.

### Code in Master
Install the dependencies  
```bash
$ npm install
```

Run the tests :heavy_check_mark:  

> NOTE: Before you can run the tests, you must customize the `test/data/test-act-env.json` to include `SRC_AUTH`, `TARGET_AUTH` and `META_AUTH` values with a valid GitHub access token with `repo` access to the related repositories.

```bash
$ npm test

 PASS  ./index.test.js (24.375s)
  Core Environment
    ✓ `core.getInput()` returns an expected String value (3ms)
  Input Validation
    ✓ Publication event ProjectCard.Moved contains all required input parameters (3ms)
    ✓ Publication event ProjectCard.Converted contains all required input parameters (8ms)
    ✓ Publication event ProjectCard.Deleted contains all required input parameters (1ms)
  Do all publication events resolve to the proper publication action (Publish/Unpublish/Archive)?
    ✓ Publication event ProjectCard.Moved to new state produces expected action (1ms)
    ✓ Publication event ProjectCard.Moved to new state produces expected action
    ✓ Publication event ProjectCard.Moved to new state produces expected action (1ms)
    ✓ Publication event ProjectCard.Converted produces expected action based on state
    ✓ Publication event ProjectCard.Converted produces expected action based on state (1ms)
    ✓ Publication event ProjectCard.Converted produces expected action based on state
    ✓ Publication event ProjectCard.Deleted produces expected action based on state (1ms)
    ✓ Publication event ProjectCard.Deleted produces expected action based on state
    ✓ Publication event ProjectCard.Deleted produces expected action based on state
  Do all content actions exhibit the expected behavior in success and failure cases?
    ✓ Content instance is of target type
    ✓ Content.Publish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time published (1ms)
    ✓ Content.Publish(IssueNumber) fails with status 404 and the 'not found' resource name (1ms)
    ✓ Content.Publish(IssueNumber) fails with status 500 and the related Error details
    ✓ Content.Archive(IssueNumber) succeeds with status 200 and values: id_src, id_target, time archived
    ✓ Content.Archive(IssueNumber) fails with status 404 and the 'not found' resource name (1ms)
    ✓ Content.Archive(IssueNumber) fails with status 500 and the related Error details
    ✓ Content.Unpublish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time deleted (1ms)
    ✓ Content.Unpublish(IssueNumber) fails with status 404 and the 'not found' resource name (1ms)
    ✓ Content.Unpublish(IssueNumber) fails with status 500 and the related Error details (1ms)
  Do all metadata management actions exhibit the expected behavior in success and failure cases?
    ✓ MarkdownMeta.Create(IssueNumber, id_target, target_type, state) succeeds with status 200 and id_source, id_target, target_type, state (1ms)
    ✓ MarkdownMeta.Create(IssueNumber, id_target, type_target, state) fails with status 500 and id_target, target_type, and state
    ✓ MarkdownMeta.Read(IssueNumber, type_target) succeeds with status 200 and id_source, id_target, type_target, state (1ms)
    ✓ MarkdownMeta.Read(IssueNumber, type_target) fails with status 404 and id_target, target_type
    ✓ MarkdownMeta.Read(IssueNumber, type_target) fails with status 500 (1ms)
    ✓ MarkdownMeta.Delete(IssueNumber, type_target) succeeds with status 200
    ✓ MarkdownMeta.Delete(IssueNumber, type_target) fails with status 404 (1ms)
    ✓ MarkdownMeta.Delete(IssueNumber, type_target) fails with status 500 (1ms)
  GitHub API Tests
    ✓ Meta.Create with path, message, and metadata succeeds with status 200 (1306ms)
    ✓ Meta.Create with path, message, and metadata fails with status 401 (229ms)
    ✓ Meta.Read with path succeeds with status 200 and metadata (344ms)
    ✓ Meta.Read with path fails with status 404 (351ms)
    ✓ Meta.Delete with path succeeds with status 200 (2654ms)
    ✓ Meta.Delete with path fails with status 404 (320ms)
  MarkdownMeta Network Tests
    ✓ MarkdownMeta.Create with issue_num, id_target, state succeeds with status 200 (1220ms)
    ✓ MarkdownMeta.Create with path, message, and metadata fails with status 401 (194ms)
    ✓ MarkdownMeta.Read with path succeeds with status 200 and metadata (293ms)
    ✓ MarkdownMeta.Read with path fails with status 404 (244ms)
    ✓ MarkdownMeta.Delete with path succeeds with status 200 (2554ms)
    ✓ MarkdownMeta.Delete with path resolves with status 404 (306ms)
  Do all Publish actions exhibit the expected behavior in success and failure cases?
    ✓ MarkdownContent.Publish(IssueNumber) succeeds with values: id_src, id_target, time published (3706ms)
    ✓ MarkdownContent.Publish(IssueNumber) fails with status 404 and the 'not found' resource name (246ms)
    ✓ MarkdownContent.meta(IssueNumber) succeeds with status 200 and metadata record (289ms)
    ✓ MarkdownContent.meta(IssueNumber) fails with status 404 (256ms)
  Do all Archive actions exhibit the expected behavior in success and failure cases?
    ✓ MarkdownContent.Archive(IssueNumber) succeeds with status 200 and values: id_src, id_target, time archived (4691ms)
    ✓ MarkdownContent.Archive(IssueNumber) fails with status 404 and the 'not found' resource name (218ms)
  Do all Unpublish actions exhibit the expected behavior in success and failure cases?
    ✓ MarkdownContent.Unpublish(IssueNumber) succeeds with status 200 and values: id_src, id_target, time deleted (3047ms)
    ✓ MarkdownContent.Unpublish(IssueNumber) fails with status 404 and the 'not found' resource name (271ms)
  Front Matter Tests
    ✓ When NO front matter, attributes is empty (4ms)
    ✓ When ONLY front matter, body is empty (2ms)
    ✓ Has body and front matter (1ms)
  Content Build Tests
    ✓ End to end content build given an issue content (13ms)
    ✓ No front matter, "_pages" collection, generate slugified filename from issue title (2ms)
    ✓ Title in front matter, "_pages" collection, generate slugified filename from front matter title (2ms)
    ✓ No front matter, "_posts" collection, generate date prefixed filename (1ms)
    ✓ Front matter tags and issue labels are merged properly (2ms)

Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
Snapshots:   0 total
Time:        24.99s, estimated 26s
Ran all test suites matching /index.test.js/i.

...
```

## Change the Code and Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
$ git checkout -b v1
$ git commit -a -m "v1 release"
```

```bash
$ git push origin v1
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)