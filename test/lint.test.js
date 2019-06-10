'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test lint command', () => {
  const umiLint = path.resolve('./bin/umi-lint');
  const cwd = path.join(__dirname, 'fixture/lint/');

  it('lint js', done => {
    coffee
      .fork(umiLint, ['./js', '--eslint'], { cwd })
      // .debug()
      .expect('stdout', /no-unused-vars/)
      .expect('stdout', /✖ 2 problems \(1 error, 1 warning\)/)
      .expect('code', 1)
      .end(done);
  });

  it('lint js with sub options', done => {
    coffee
      .fork(umiLint, ['./js', '--eslint.quiet'], { cwd })
      // .debug()
      .expect('stdout', /✖ 1 problem \(1 error, 0 warnings\)/)
      .expect('code', 1)
      .end(done);
  });

  it('lint ts with eslint', done => {
    coffee
      .fork(umiLint, ['./ts', '--eslint.ext', '.ts,tsx'], { cwd })
      // .debug()
      .expect('stdout', /✖ 5 problems \(1 error, 4 warnings\)/)
      .expect('code', 1)
      .end(done);
  });

  it('lint style', done => {
    coffee
      .fork(umiLint, ['./style', '--stylelint'], { cwd })
      // .debug()
      .expect(
        'stdout',
        /✖  Unexpected missing generic font family   font-family-no-missing-generic-family-keyword/,
      )
      .expect('code', 2)
      .end(done);
  });

  it('lint style with sub options', done => {
    coffee
      .fork(umiLint, ['./style', '--stylelint', '-s.formatter', 'json'], { cwd })
      // .debug()
      .expect('stdout', /"text":"Unexpected missing generic font family/)
      .expect('code', 2)
      .end(done);
  });

  it('use prettier', done => {
    coffee
      .fork(umiLint, ['./prettier', '--prettier', '--eslint', false], {
        cwd,
        env: { FROM_TEST: true },
      })
      // .debug()
      .expect('stdout', /const hello = 'aaa';/)
      .expect('code', 0)
      .end(done);
  });

  it('use prettier with sub options', done => {
    coffee
      .fork(umiLint, ['./prettier', '--prettier', '--eslint', false, '-p.no-semi'], {
        cwd,
        env: { FROM_TEST: true },
      })
      // .debug()
      .expect('stdout', /const hello = 'aaa'/)
      .expect('code', 0)
      .end(done);
  });
});
