# umi-lint

代码质量检查和美化工具，封装了 eslint，tslint，stylelint，prettier，lint-staged，husky等，无门槛使用。

## 为什么

当前社区保证代码质量的最佳实践是 ci 时做全局 lint，提交代码只对变更代码进行 lint，但这一套流程涉及的包众多，也需要繁琐的配置，但这一切都可以简化，这就是这个包存在的意义。

## 安装

```bash
npm install umi-lint --save-dev
```

## 使用

在 `package.json` 添加

```diff
"scripts": {
+   "lint": "umi-lint --eslint src/",
+   "precommit": "umi-lint --staged --eslint --stylelint --prettier --fix",
}
```

## 参数说明

```bash

Usage: umi-lint [options] file.js [file.js] [dir]

# 对指定路径 lint
umi-lint --prettier --eslint --stylelint src/

# 只对提交的代码进行 lint
umi-lint --staged --prettier --eslint --stylelint

# 对于某些场景需要指定 lint 工具的子参数
umi-lint --eslint.debug --tslint.force -s.formatter=json -p.no-semi

Options:
--staged, -S              only lint git staged files                          [boolean] [default: false]
--prettier, -p            format code with prettier                           [boolean] [default: false]
--eslint, -e              enable lint javascript                              [boolean] [default: false]
--tslint, -t              enable lint typescript                              [boolean] [default: false]
--stylelint, --style, -s  enable lint style                                   [boolean] [default: false]
--fix, -f                 fix all eslint and stylelint auto-fixable problems  [boolean] [default: false]
--quiet, -q               report errors only                                  [boolean] [default: false]
--cwd                     current working directory                             [default: process.cwd()]
```

## 问题解决

### 常见问题

#### Q: 没有配置文件

A: `umi-lint` 不包含配置，需要根据需求自己配置 `.eslintrc`、`.stylelintrc`、`.prettierrc`

#### Q: 使用 eslint 来检查 typescript

A: `umi-lint --eslint.ext='.tx,tsx'`，

### 钉钉群

<img src="https://gw.alipayobjects.com/zos/rmsportal/jPXcQOlGLnylGMfrKdBz.jpg" width="60" />
