'use strict';

const globby = require('globby');

function transformOpts(result, item, key) {
  result.push(`--${key}`);
  if (typeof item[key] !== 'boolean') {
    result.push(item[key]);
  }
}

module.exports = {
  endsWithArray: (str, arr) => {
    // like /.js$|.jsx$/.test('aaa.js')
    return new RegExp(`${arr.join('$|')}$`).test(str);
  },
  getFiles: patterns => {
    return globby.sync(patterns, {
      gitignore: true,
      ignore: ['**/node_modules/**', '.git'],
      onlyFiles: true,
      dot: true,
    });
  },
  /**
   * support sub option like: --eslint.debug --eslint.no-ignore
   * @param {(object|array)} option { debug: true } | [ true, { debug: true } ]
   * @return {array} []
   */
  parseSubOptions: option => {
    if (Array.isArray(option)) {
      return option
        .filter(item => typeof item === 'object')
        .reduce((result, item) => {
          const key = Object.keys(item)[0];
          transformOpts(result, item, key);
          return result;
        }, []);
    } else if (typeof option === 'object') {
      const result = [];
      Object.keys(option).forEach(key => {
        transformOpts(result, option, key);
      });
      return result;
    }
    return [];
  },
};
