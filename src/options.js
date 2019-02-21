module.exports = {
  staged: {
    description: "only lint git staged files",
    boolean: true,
    alias: "S"
  },
  prettier: {
    description: "format code with prettier",
    boolean: true,
    alias: "p"
  },
  eslint: {
    boolean: true,
    alias: "e"
  },
  tslint: {
    boolean: true,
    alias: "t"
  },
  stylelint: {
    description: "enable lint style",
    boolean: true,
    alias: ["style", "s"]
  },
  fix: {
    description: "fix all eslint and stylelint auto-fixable problems",
    boolean: true,
    alias: "f"
  },
  quiet: {
    description: "report errors only",
    boolean: true,
    alias: "q"
  },
  cwd: {
    description: "current working directory",
    default: process.cwd()
  }
};
