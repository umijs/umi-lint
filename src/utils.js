'use strict';

const globby = require('globby');
const fs = require('fs');
const ignore = require('ignore');

function transformOpts(result, item, key) {
  result.push(`--${key}`);
  if (typeof item[key] !== 'boolean') {
    result.push(item[key]);
  }
}

/**
 * 获取其他需要忽略的规则
 * @param cwd 当前目录
 */
function getIgnores(cwd) {
  let ignores = [];
  // 获取 eslintignore 忽略规则
  globby
    .sync('**/.eslintignore', {
      ignore: ['**/node_modules/**'],
      cwd,
    })
    .forEach(file => {
      const result = fs
        .readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .filter(line => line.charAt(0) !== '#');
      ignores = ignores.concat(result);
    });
  return ignores;
}

module.exports = {
  endsWithArray: (str, arr) => {
    // like /.js$|.jsx$/.test('aaa.js')
    return new RegExp(`${arr.join('$|')}$`).test(str);
  },
  getFiles: (patterns, cwd) => {
    const result = globby.sync(patterns, {
      gitignore: true,
      ignore: ['**/node_modules/**', '.git'],
      onlyFiles: true,
      dot: true,
    });

    return ignore()
      .add(getIgnores(cwd))
      .filter(result);
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
  getEslintExtensions: options => {
    const index = options.indexOf('--ext');
    if (index !== -1) {
      return options[index + 1].split(',');
    }
    return ['.js', '.jsx'];
  },
};
