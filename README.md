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
+   "lint": "umi-lint src/",
+   "precommit": "umi-lint --staged --prettier --fix --style",
}
```

## 参数说明

```bash
Usage: umi-lint [options] file.js [file.js] [dir]
Usage: umi-lint --eslint.debug --prettier --stylelint.formatter=json src/

Options:
--staged, -S              only lint git staged files                          [boolean] [default: false]
--prettier, -p            format code with prettier                           [boolean] [default: false]
--eslint, -e              enabel lint javascript                              [boolean] [default: true]
--tslint, -t              enable lint typescript                              [boolean] [default: true]
--stylelint, --style, -s  enable lint style                                   [boolean] [default: false]
--fix, -f                 fix all eslint and stylelint auto-fixable problems  [boolean] [default: false]
--quiet, -q               report errors only                                  [boolean] [default: false]
--cwd                     current working directory                             [default: process.cwd()]
```

## 问题解决

<img src="https://gw.alipayobjects.com/zos/rmsportal/jPXcQOlGLnylGMfrKdBz.jpg" width="60" />