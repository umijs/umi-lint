'use strict';

module.exports = {
  staged: {
    description: 'only lint git staged files',
    boolean: true,
    default: false,
    alias: 'S',
  },
  prettier: {
    description: 'format code with prettier',
    boolean: true,
    default: false,
    alias: 'p',
  },
  eslint: {
    description: 'enabel lint javascript',
    boolean: true,
    default: false,
    alias: 'e',
  },
  tslint: {
    description: 'enable lint typescript',
    boolean: true,
    default: false,
    alias: 't',
  },
  stylelint: {
    description: 'enable lint style',
    boolean: true,
    default: false,
    alias: ['style', 's'],
  },
  fix: {
    description: 'fix all eslint and stylelint auto-fixable problems',
    boolean: true,
    default: false,
    alias: 'f',
  },
  quiet: {
    description: 'report errors only',
    boolean: true,
    default: false,
    alias: 'q',
  },
  cwd: {
    description: 'current working directory',
    default: process.cwd(),
  },
};
