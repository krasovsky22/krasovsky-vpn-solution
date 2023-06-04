// Learn more https://docs.expo.dev/guides/monorepos
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const blacklist = require('metro-config/src/defaults/exclusionList');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot, {
  // Enable CSS support.
  isCSSEnabled: true,
});

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// Exclude Amplify Backend
config.resolver.blacklistRE = blacklist([/infrastructure\/.*/]);

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
