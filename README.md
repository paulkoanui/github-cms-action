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
```bash
$ npm test

 PASS  ./index.test.2.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

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