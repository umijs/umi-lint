"use strict";

const path = require("path");
const coffee = require("coffee");

describe("test lint command", () => {
  const umiLint = path.resolve("./bin/umi-lint");
  const cwd = path.join(__dirname, "fixture/lint/");

  it.only("no-params", done => {
    coffee
      .fork(umiLint, ["."], { cwd })
      .debug()
      .expect("stdout", /no-unused-vars/)
      .expect("stdout", /✖ 1 problem \(1 error, 0 warnings\)/)
      .expect("code", 1)
      .end(done);
  });

  it("--tslint");

  it("--stylelint");

  it("--prettier");

  it("--fix");

  it("--quiet");

  it("--cwd");
});
