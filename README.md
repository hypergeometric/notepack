# @coinative/msgpack

A fast pure-JavaScript implementation of the latest [MessagePack](http://msgpack.org) [spec](https://github.com/msgpack/msgpack/blob/master/spec.md) for [NodeJS](http://nodejs.org).

## Notes

* This implementation is not backwards compatible with implementations that use the older spec.
* `undefined` is encoded as `fixext 1 [0, 0]`, i.e. `0xd40000`

## Installation

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

Performance is currently comparable to msgpack-node (which presumably needs optimizing and suffers from JS-native overhead) and is significantly faster than other pure-JavaScript implementations. Several micro-optimizations are used to improve the performance of short string and Buffer operations.

For the object:

```
{
  foo: 1,
  bar: [1, 2, 3, 4, 'abc', 'def'],
  foobar: {
    foo: true,
    bar: -2147483649
  }
}
```
the `make bench` output on my machine is:
```
Encoding:
+--------------------+-----------------+----------------+---------------+
|                    │ small           │ medium         │ large         |
+--------------------+-----------------+----------------+---------------+
| @coinative/msgpack │ 264,773 ops/sec │ 17,698 ops/sec │ 260 ops/sec   |
+--------------------+-----------------+----------------+---------------+
| msgpack-node       │ 136,753 ops/sec │ 20,511 ops/sec │ 281 ops/sec   |
+--------------------+-----------------+----------------+---------------+
| msgpack-js         │ 42,109 ops/sec  │ 2,937 ops/sec  │ 92.61 ops/sec |
+--------------------+-----------------+----------------+---------------+
Decoding:
+--------------------+-----------------+----------------+-------------+
|                    │ small           │ medium         │ large       |
+--------------------+-----------------+----------------+-------------+
| @coinative/msgpack │ 298,743 ops/sec │ 14,597 ops/sec │ 141 ops/sec |
+--------------------+-----------------+----------------+-------------+
| msgpack-node       │ 278,023 ops/sec │ 23,286 ops/sec │ 153 ops/sec |
+--------------------+-----------------+----------------+-------------+
| msgpack-js         │ 170,396 ops/sec │ 9,526 ops/sec  │ 124 ops/sec |
+--------------------+-----------------+----------------+-------------+
```

## License

MIT
