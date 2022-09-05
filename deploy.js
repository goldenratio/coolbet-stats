const simpleGit = require('simple-git');

const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};

// when setting all options in a single object
const git = simpleGit(options);
git
  .add('./*')
  .commit('build');
// git.push();
