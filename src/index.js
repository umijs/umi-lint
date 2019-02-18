'use strict';

const Command = require('common-bin');
const { sync: resolveBin } = require('resolve-bin');
const { join } = require('path');
const { writeFileSync, existsSync } = require('fs');
const { endsWithArray, getFiles } = require('./utils');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = require('./options');
    this.eslint = resolveBin('eslint');
    this.tslint = resolveBin('tslint');
    this.stylelint = resolveBin('stylelint');
    this.prettier = resolveBin('prettier');
  }

  * run(context) {
    const { staged, cwd } = context.argv;
    this.isTypescript = existsSync(join(cwd, 'tsconfig.json'));
    
    if(!staged) {
      this.lint(context.argv);
    } else {
      this.lintStaged(context.argv);
    }
  }

  * lint({ _, eslint, tslint, prettier, fix, quiet}) {
    if (_.length === 0) {
      console.log(`please specify a path to lint`);
      return;
    }

    const commonOpts = [ ...fix ? ['--fix']: [], ...quiet ? ['--quiet']: []]

    const allFiles = getFiles(_);

    if(eslint !== false) {
      const files = allFiles.filter(item => endsWithArray(item, ['.js', '.jsx']));
      if(files.length > 0) {
        this.helper.forkNode(this.eslint, [...commonOpts, files]);
      }
    }

    if(tslint !== false && this.isTypescript) {
      const files = allFiles.filter(item => endsWithArray(item, ['.ts', '.tsx']));
      if(files.length > 0) {
        this.helper.forkNode(this.tslint, [...commonOpts, files]);
      }
    }

    if(stylelint !== false) {
      const files = allFiles.filter(item => endsWithArray(item, ['.css', '.less', '.sass', '.sass']));
      if(files.length > 0) {
        this.helper.forkNode(this.stylelint, [...commonOpts, files]);
      }
    }

    if(prettier !== false) {
      const files = allFiles.filter(item => endsWithArray(item, ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.sass', '.sass']));
      if(files.length > 0) {
        this.helper.forkNode(this.prettier, [...commonOpts, '--write', files]);
      }
    }
  }

  * lintStaged({ prettier, eslint, tslint, fix, quiet}) {
    const lintStaged = resolveBin('lintStaged');
    // 根据参数动态生成配置

    const commonOpts = `${fix ? '--fix' : ''} ${quiet ? '--quiet' : ''}`;
    const lintstagedrc = {
      ...(prettier && {
        '*.{js,jsx,ts,tsx,less,scss,sass,css}': [
          `${this.prettier} --write`,
          'git add',
        ],
      }),
      ...(eslint !== false && {
        '*.{js,jsx}': [
          `${this.eslint} ${commonOpts}`,
          'git add',
        ],
      }),
      ...(tslint !== false && this.isTypescript && {
        '*.{ts,tsx}': [
          `${this.tslint} ${commonOpts}`,
          'git add',
        ],
      }),
      ...(stylelint && {
        '*.{less,scss,sass,css}': [
          `${this.stylelint} ${commonOpts}`,
          'git add',
        ],
      }),
    };

    const rcPath = join(__dirname, '.lintstagedrc.json');
    writeFileSync(rcPath, JSON.stringify(lintstagedrc));

    yield this.helper.forkNode(lintStaged, ['-c', rcPath]);
  }

  
}

module.exports = MainCommand;