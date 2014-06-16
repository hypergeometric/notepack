# notepack

[![Build Status](https://travis-ci.org/coinative/notepack.svg?branch=master)](https://travis-ci.org/coinative/notepack) [![Coverage Status](https://img.shields.io/coveralls/coinative/notepack.svg)](https://coveralls.io/r/coinative/notepack?branch=master)

A fast [Node.js](http://nodejs.org) implementation of the latest [MessagePack](http://msgpack.org) [spec](https://github.com/msgpack/msgpack/blob/master/spec.md).

## Notes

* This implementation is not backwards compatible with those that use the older spec. It is recommended that this library is only used in isolated systems.
* `undefined` is encoded as `fixext 1 [0, 0]`, i.e. `<Buffer d4 00 00>`
* `Date` objects are encoded as `fixext 8 [0, ms]`, e.g. `new Date('2000-06-13T00:00:00.000Z')` => `<Buffer d7 00 00 00 00 df b7 62 9c 00>`

## Install

```
npm install notepack
```

## Usage

```js
var notepack = require('notepack');

var encoded = notepack.encode({ foo: 'bar'}); // <Buffer 81 a3 66 6f 6f a3 62 61 72>
var decoded = notepack.decode(encoded); // { foo: 'bar' }
```

## Performance

Performance is currently comparable to msgpack-node (which presumably needs optimizing and suffers from JS-native overhead) and is significantly faster than other implementations. Several micro-optimizations are used to improve the performance of short string and Buffer operations.

The `./benchmarks/run` output on my machine is:

```
Encoding (this will take a while):
+----------------------------+-----------------+-----------------+----------------+---------------+
|                            │ tiny            │ small           │ medium         │ large         |
+----------------------------+-----------------+-----------------+----------------+---------------+
| notepack                   │ 758,340 ops/sec │ 172,415 ops/sec │ 18,614 ops/sec │ 262 ops/sec   |
+----------------------------+-----------------+-----------------+----------------+---------------+
| msgpack-js                 │ 100,768 ops/sec │ 27,229 ops/sec  │ 3,044 ops/sec  │ 93.47 ops/sec |
+----------------------------+-----------------+-----------------+----------------+---------------+
| msgpack-node               │ 206,825 ops/sec │ 107,619 ops/sec │ 20,362 ops/sec │ 284 ops/sec   |
+----------------------------+-----------------+-----------------+----------------+---------------+
| JSON.stringify (to Buffer) │ 528,632 ops/sec │ 154,229 ops/sec │ 12,023 ops/sec │ 7.82 ops/sec  |
+----------------------------+-----------------+-----------------+----------------+---------------+
Decoding (this will take a while):
+--------------------------+-------------------+-----------------+----------------+---------------+
|                          │ tiny              │ small           │ medium         │ large         |
+--------------------------+-------------------+-----------------+----------------+---------------+
| notepack                 │ 756,003 ops/sec   │ 163,630 ops/sec │ 15,771 ops/sec │ 144 ops/sec   |
+--------------------------+-------------------+-----------------+----------------+---------------+
| msgpack-js               │ 425,628 ops/sec   │ 101,821 ops/sec │ 10,117 ops/sec │ 123 ops/sec   |
+--------------------------+-------------------+-----------------+----------------+---------------+
| msgpack-node             │ 717,093 ops/sec   │ 165,781 ops/sec │ 23,506 ops/sec │ 155 ops/sec   |
+--------------------------+-------------------+-----------------+----------------+---------------+
| JSON.parse (from Buffer) │ 1,441,579 ops/sec │ 396,923 ops/sec │ 28,594 ops/sec │ 33.94 ops/sec |
+--------------------------+-------------------+-----------------+----------------+---------------+
* Note that JSON is provided as an indicative comparison only
```

## License

MIT
