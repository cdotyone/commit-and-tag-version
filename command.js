const spec = require('conventional-changelog-config-spec')
const { getConfiguration } = require('./lib/configuration')
const defaults = require('./defaults')

const yargs = require('yargs')
  .usage('Usage: $0 [options]')
  .option('packageFiles', {
    default: defaults.packageFiles,
    array: true
  })
  .option('bumpFiles', {
    default: defaults.bumpFiles,
    array: true
  })
  .option('release-as', {
    alias: 'r',
    describe:
      'Specify the release type manually (like npm version <major|minor|patch>)',
    requiresArg: true,
    string: true
  })
  .option('prerelease', {
    alias: 'p',
    describe:
      'make a pre-release with optional option value to specify a tag id',
    string: true
  })
  .option('infile', {
    alias: 'i',
    describe: 'Read the CHANGELOG from this file',
    default: defaults.infile
  })
  .option('message', {
    alias: ['m'],
    describe:
      '[DEPRECATED] Commit message, replaces %s with new version.\nThis option will be removed in the next major version, please use --releaseCommitMessageFormat.',
    type: 'string'
  })
  .option('first-release', {
    alias: 'f',
    describe: 'Is this the first release?',
    type: 'boolean',
    default: defaults.firstRelease
  })
  .option('sign', {
    alias: 's',
    describe: 'Should the git commit and tag be signed?',
    type: 'boolean',
    default: defaults.sign
  })
  .option('no-verify', {
    alias: 'n',
    describe:
      'Bypass pre-commit or commit-msg git hooks during the commit phase',
    type: 'boolean',
    default: defaults.noVerify
  })
  .option('commit-all', {
    alias: 'a',
    describe:
      'Commit all staged changes, not just files affected by commit-and-tag-version',
    type: 'boolean',
    default: defaults.commitAll
  })
  .option('silent', {
    describe: "Don't print logs and errors",
    type: 'boolean',
    default: defaults.silent
  })
  .option('tag-prefix', {
    alias: 't',
    describe: 'Set a custom prefix for the git tag to be created',
    type: 'string',
    default: defaults.tagPrefix
  })
  .option('tag-suffix', {
    alias: 't',
    describe: 'Set a custom suffix for the git tag to be created',
    type: 'string',
    default: defaults.tagSuffix
  })
  .option('release-count', {
    describe: 'How many releases of changelog you want to generate. It counts from the upcoming release. Useful when you forgot to generate any previous changelog. Set to 0 to regenerate all.',
    type: 'number',
    default: defaults.releaseCount
  })
  .option('tag-force', {
    describe: 'Allow tag replacement',
    type: 'boolean',
    default: defaults.tagForce
  })
  .option('scripts', {
    describe:
      'Provide scripts to execute for lifecycle events (prebump, precommit, etc.,)',
    default: defaults.scripts
  })
  .option('skip', {
    describe: 'Map of steps in the release process that should be skipped',
    default: defaults.skip
  })
  .option('dry-run', {
    type: 'boolean',
    default: defaults.dryRun,
    describe: 'See the commands that running commit-and-tag-version would run'
  })
  .option('git-tag-fallback', {
    type: 'boolean',
    default: defaults.gitTagFallback,
    describe:
      'fallback to git tags for version, if no meta-information file is found (e.g., package.json)'
  })
  .option('path', {
    type: 'string',
    describe: 'Only populate commits made under this path'
  })
  .option('changelogHeader', {
    type: 'string',
    describe:
      '[DEPRECATED] Use a custom header when generating and updating changelog.\nThis option will be removed in the next major version, please use --header.'
  })
  .option('preset', {
    type: 'string',
    default: defaults.preset,
    describe: 'Commit message guideline preset'
  })
  .option('lerna-package', {
    type: 'string',
    describe: 'Name of the package from which the tags will be extracted'
  })
  .option('npmPublishHint', {
    type: 'string',
    default: defaults.npmPublishHint,
    describe: 'Customized publishing hint'
  })
  .option('noBumpWhenEmptyChanges', {
    type: 'boolean',
    default: false,
    describe: 'Avoid bumping files and generating changelog if there are no changes.'
  })
  .check((argv) => {
    if (typeof argv.scripts !== 'object' || Array.isArray(argv.scripts)) {
      throw Error('scripts must be an object')
    } else if (typeof argv.skip !== 'object' || Array.isArray(argv.skip)) {
      throw Error('skip must be an object')
    } else {
      return true
    }
  })
  .alias('version', 'v')
  .alias('help', 'h')
  .example('$0', 'Update changelog and tag release')
  .example(
    '$0 -m "%s: see changelog for details"',
    'Update changelog and tag release with custom commit message'
  )
  .pkgConf('standard-version')
  .pkgConf('commit-and-tag-version')
  .config(getConfiguration())
  .wrap(97)

Object.keys(spec.properties).forEach((propertyKey) => {
  const property = spec.properties[propertyKey]
  yargs.option(propertyKey, {
    type: property.type,
    describe: property.description,
    default: defaults[propertyKey] ? defaults[propertyKey] : property.default,
    group: 'Preset Configuration:'
  })
})

module.exports = yargs
