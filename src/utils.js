'use strict';

const globby = require('globby');

module.exports.endsWithArray = (str, arr) => {
    // like /.js$|.jsx$/.test('aaa.js')
    return new RegExp(`${arr.join('$|')}$`).test(str);
}

module.exports.getFiles = (patterns) => {
  return globby.sync(patterns, {
    gitignore: true,
    ignore: ["**/node_modules/**", ".git"],
    onlyFiles: true,
    dot: true
  });
}