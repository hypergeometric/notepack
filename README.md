# @coinative/msgpack

[![Build Status](https://travis-ci.org/coinative/msgpack.svg?branch=master)](https://travis-ci.org/coinative/msgpack) [![Coverage Status](https://img.shields.io/coveralls/coinative/msgpack.svg)](https://coveralls.io/r/coinative/msgpack?branch=master)

A fast [Node.js](http://nodejs.org) implementation of the latest [MessagePack](http://msgpack.org) [spec](https://github.com/msgpack/msgpack/blob/master/spec.md).

## Notes

* This implementation is not backwards compatible with those that use the older spec. It is recommended that this library is only used in isolated systems.
* `undefined` is encoded as `fixext 1 [0, 0]`, i.e. `<Buffer d4 00 00>`
* `Date` objects are encoded as `fixext 8 [0, ms]`, e.g. `new Date('2000-06-13T00:00:00.000Z')` => `<Buffer d7 00 00 00 00 df b7 62 9c 00>`

## Install

Not currently hosted on npmjs.org. Take this module as a git dependency via:

```
npm install coinative/msgpack
```

## Usage

```js
var msgpack = require('msgpack');

var encoded = msgpack.encode({ foo: 'bar'}); // <Buffer 81 a3 66 6f 6f a3 62 61 72>
var decoded = msgpack.decode(encoded); // { foo: 'bar' }
```

## Performance

Performance is currently comparable to msgpack-node (which presumably needs optimizing and suffers from JS-native overhead) and is significantly faster than other implementations. Several micro-optimizations are used to improve the performance of short string and Buffer operations.

The `./benchmarks/run` output on my machine is:

```
Encoding (this will take a while):
+----------------------------+-----------------+-----------------+----------------+---------------+
|                            │ tiny            │ small           │ medium         │ large         |
+----------------------------+-----------------+-----------------+----------------+---------------+
| @coinative/msgpack         │ 736,225 ops/sec │ 167,612 ops/sec │ 18,207 ops/sec │ 250 ops/sec   |
+----------------------------+-----------------+-----------------+----------------+---------------+
| msgpack-js                 │ 99,202 ops/sec  │ 26,422 ops/sec  │ 2,997 ops/sec  │ 85.66 ops/sec |
+----------------------------+-----------------+-----------------+----------------+---------------+
| msgpack-node               │ 200,858 ops/sec │ 103,068 ops/sec │ 20,385 ops/sec │ 262 ops/sec   |
+----------------------------+-----------------+-----------------+----------------+---------------+
| JSON.stringify (to Buffer) │ 516,197 ops/sec │ 152,329 ops/sec │ 11,952 ops/sec │ 7.77 ops/sec  |
+----------------------------+-----------------+-----------------+----------------+---------------+
Decoding (this will take a while):
+--------------------------+-------------------+-----------------+----------------+---------------+
|                          │ tiny              │ small           │ medium         │ large         |
+--------------------------+-------------------+-----------------+----------------+---------------+
| @coinative/msgpack       │ 718,439 ops/sec   │ 158,290 ops/sec │ 15,121 ops/sec │ 139 ops/sec   |
+--------------------------+-------------------+-----------------+----------------+---------------+
| msgpack-js               │ 420,414 ops/sec   │ 95,243 ops/sec  │ 9,118 ops/sec  │ 123 ops/sec   |
+--------------------------+-------------------+-----------------+----------------+---------------+
| msgpack-node             │ 668,971 ops/sec   │ 168,732 ops/sec │ 23,113 ops/sec │ 153 ops/sec   |
+--------------------------+-------------------+-----------------+----------------+---------------+
| JSON.parse (from Buffer) │ 1,390,069 ops/sec │ 389,440 ops/sec │ 27,830 ops/sec │ 51.10 ops/sec |
+--------------------------+-------------------+-----------------+----------------+---------------+
* Note that JSON is provided as an indicative comparison only
```

## License

MIT
