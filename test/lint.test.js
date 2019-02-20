'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test lint js', () => {
    const umiLint = path.resolve('../src/index');
    const cwd = path.join(__dirname, 'fixture/lint/');

    it.only('defualt', done => {
        coffee.fork(umiLint, ['.'], {cwd})
        .debug()
        .expect('stdout', 'ss')
        .expect('code', 1)
        .end(done)
    });


})