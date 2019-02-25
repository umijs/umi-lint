"use strict";

const Command = require("common-bin");
const { sync: resolveBin } = require("resolve-bin");
const { join } = require("path");
const { writeFileSync } = require("fs");
const { endsWithArray, getFiles, parseSubOptions } = require("./utils");
const debug = require("debug")("umi-lint");

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);

    this.options = require("./options");
    this.eslint = resolveBin("eslint");
    this.tslint = resolveBin("tslint");
    this.stylelint = resolveBin("stylelint");
    this.prettier = resolveBin("prettier");

    this.usage = "Usage: umi-lint [options] file.js [file.js] [dir]";
    this.usage =
      "Usage: umi-lint --eslint.debug --stylelint.formatter=json src/";
  }

  *run(context) {
    const { staged } = context.argv;

    if (!staged) {
      yield this.lint(context.argv);
    } else {
      yield this.lintStaged(context.argv);
    }
  }

  *lint({ _, eslint, tslint, stylelint, prettier, fix, quiet, cwd }) {
    if (_.length === 0) {
      console.log("please specify a path to lint");
      return;
    }

    const commonOpts = [
      ...(fix ? ["--fix"] : []),
      ...(quiet ? ["--quiet"] : [])
    ];

    const allFiles = getFiles(_);

    try {
      const jobs = [];
      // eslint can be disable
      if (eslint !== false) {
        // TODO, 效率可能不高, 先实现再验证
        const files = allFiles.filter(item =>
          endsWithArray(item, [".js", ".jsx"])
        );
        if (files.length > 0) {
          jobs.push(
            this.helper.forkNode(
              this.eslint,
              [...commonOpts, ...parseSubOptions(eslint), ...files],
              {
                cwd
              }
            )
          );
        }
      }

      if (tslint !== false) {
        const files = allFiles.filter(item =>
          endsWithArray(item, [".ts", ".tsx"])
        );
        if (files.length > 0) {
          jobs.push(
            this.helper.forkNode(
              this.tslint,
              [...commonOpts, ...parseSubOptions(tslint), ...files],
              {
                cwd
              }
            )
          );
        }
      }

      if (stylelint) {
        const files = allFiles.filter(item =>
          endsWithArray(item, [".css", ".less", ".scss", ".sass"])
        );

        if (files.length > 0) {
          jobs.push(
            this.helper.forkNode(
              this.stylelint,
              [...commonOpts, ...parseSubOptions(stylelint), ...files],
              {
                cwd
              }
            )
          );
        }
      }

      if (prettier) {
        const files = allFiles.filter(item =>
          endsWithArray(item, [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".css",
            ".less",
            ".scss",
            ".sass"
          ])
        );
        if (files.length > 0) {
          jobs.push(
            this.helper.forkNode(
              this.prettier,
              [
                ...(process.env.FROM_TEST === "true" ? [] : ["--write"]),
                ...parseSubOptions(prettier),
                ...files
              ],
              { cwd }
            )
          );
        }
      }
      yield Promise.all(jobs);
    } catch (error) {
      debug(error);
      process.exit(error.code);
    }
  }

  *lintStaged({ prettier, eslint, tslint, stylelint, fix, quiet }) {
    const lintStaged = resolveBin("lint-staged");
    const commonOpts = `${fix ? "--fix" : ""} ${quiet ? "--quiet" : ""}`;

    // generate dynamic configuration
    const lintstagedrc = {
      ...(prettier && {
        "*.{js,jsx,ts,tsx,less,scss,sass,css}": [
          `${this.prettier} --write ${parseSubOptions(prettier).join(" ")}`,
          "git add"
        ]
      }),
      ...(eslint !== false && {
        "*.{js,jsx}": [
          `${this.eslint} ${commonOpts} ${parseSubOptions(eslint).join(" ")}`,
          "git add"
        ]
      }),
      ...(tslint !== false && {
        "*.{ts,tsx}": [
          `${this.tslint} ${commonOpts} ${parseSubOptions(tslint).join(" ")}`,
          "git add"
        ]
      }),
      ...(stylelint && {
        "*.{less,scss,sass,css}": [
          `${this.stylelint} ${commonOpts} ${parseSubOptions(stylelint).join(
            " "
          )}`,
          "git add"
        ]
      })
    };

    const rcPath = join(__dirname, ".lintstagedrc.json");
    writeFileSync(rcPath, JSON.stringify(lintstagedrc));

    try {
      yield this.helper.forkNode(lintStaged, ["-c", rcPath]);
    } catch (error) {
      debug(error);
      process.exit(error.code);
    }
  }
}

module.exports = MainCommand;
