var msgpack = require('../');

function array(length) {
  var arr = new Array(length);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = 0;
  }
  return arr;
}

function map(length) {
  var result = {};
  for (var i = 0; i < length; i++) {
    result[i + ''] = 0;
  }
  return result;
}

function checkDecode(value, hex) {
  var decodedValue = msgpack.decode(new Buffer(hex, 'hex'));
  expect(decodedValue).to.deep.equal(value, 'decode failed');
}

function checkEncode(value, hex) {
  var encodedHex = msgpack.encode(value).toString('hex');
  expect(encodedHex).to.equal(hex, 'encode failed');
}

function check(value, hex) {
  checkEncode(value, hex);
  checkDecode(value, hex);

  // And full circle for fun
  expect(msgpack.decode(msgpack.encode(value))).to.deep.equal(value);
}

describe('msgpack', function () {
  it('positive fixint', function () {
    check(0x00, '00');
    check(0x44, '44');
    check(0x7f, '7f');
  });

  it('negative fixint', function () {
    check(-0x01, 'ff');
    check(-0x10, 'f0');
    check(-0x20, 'e0');
  });

  it('fixmap', function () {
    check({}, '80');
    check({ a: 1, b: 2, c: 3 }, '83a16101a16202a16303');
  });

  it('fixarray', function () {
    check([], '90');
    check([1, 2, 3, 4], '9401020304');
  });

  it('fixstr', function () {
    check('', 'a0');
    check('hello', 'a568656c6c6f');
  });

  it('nil', function () {
    check(null, 'c0');
  });

  it('false', function () {
    check(false, 'c2');
  });

  it('true', function () {
    check(true, 'c3');
  });

  it('bin 8', function () {
    check(new Buffer(0), 'c4' + '00');
    check(new Buffer([0]), 'c4' + '01' + '00');
    check(new Buffer('hello'), 'c4' + '05' + '68656c6c6f');
  });

  it('bin 16', function () {
    check(new Buffer('a'.repeat(256)), 'c5' + '0100' + '61'.repeat(256));
  });

  it('bin 32', function () {
    check(new Buffer('a'.repeat(65536)), 'c6' + '00010000' + '61'.repeat(65536));
  });

  // ext 8, ext 16, ext 32
  // There is currently no way to encode extension types

  // float 32
  // JavaScript doesn't support single precision floating point numbers

  it('float 64', function () {
    check(1.1, 'cb' + '3ff199999999999a');
    check(1234567891234567.5, 'cb' + '43118b54f26ebc1e');
  });

  it('uint 8', function () {
    check(128, 'cc80');
    check(255, 'ccff');
  });

  it('uint 16', function () {
    check(256, 'cd0100');
    check(65535, 'cdffff');
  });

  it('uint 32', function () {
    check(65536, 'ce00010000');
    check(4294967295, 'ceffffffff');
  });

  it('uint 64', function () {
    check(4294967296, 'cf0000000100000000');
    check(Math.pow(2, 53) - 1, 'cf001fffffffffffff');
  });

  // NOTE: We'll always encode a positive number as a uint, but we should be
  // able to decode a positive int value

  it('int 8', function () {
    checkDecode(127, 'd07f');
    checkDecode(32, 'd020');
    checkDecode(1, 'd001');
    checkDecode(0, 'd000');
    checkDecode(-1, 'd0ff');
    check(-33, 'd0df');
    check(-128, 'd080');
  });

  it('int 16', function () {
    checkDecode(32767, 'd17fff');
    checkDecode(128, 'd10080');
    checkDecode(1, 'd10001');
    checkDecode(0, 'd10000');
    checkDecode(-1, 'd1ffff');
    check(-129, 'd1ff7f');
    check(-32768, 'd18000');
  });

  it('int 32', function () {
    checkDecode(2147483647, 'd27fffffff');
    checkDecode(32768, 'd200008000');
    checkDecode(1, 'd200000001');
    checkDecode(0, 'd200000000');
    checkDecode(-1, 'd2ffffffff');
    check(-32769, 'd2ffff7fff');
    check(-2147483648, 'd280000000');
  });

  it('int 64', function () {
    checkDecode(Math.pow(2, 53), 'd30020000000000000');
    checkDecode(4294967296, 'd30000000100000000');
    checkDecode(1, 'd30000000000000001');
    checkDecode(0, 'd30000000000000000');
    checkDecode(-1, 'd3ffffffffffffffff');
    check(-2147483649, 'd3ffffffff7fffffff');
    check(-4294967297, 'd3fffffffeffffffff');
    check(-65437650001231, 'd3ffffc47c1c1de2b1');
    check(-1111111111111111, 'd3fffc0d7348ea8e39');
    check(-1532678092380345, 'd3fffa8e0992bfa747');
    check(-4503599627370496, 'd3fff0000000000000');
    check(-7840340234323423, 'd3ffe42540896a3a21');
    // Minimum safe signed integer
    check(-Math.pow(2, 53) + 1, 'd3ffe0000000000001');
  });

  it('fixext 1 / undefined', function () {
    check(undefined, 'd40000');
  });

  // fixext 2, fixext 4, fixext 8, fixext 16
  // There is currently no way to encode extension types

  it('str 8', function () {
    check('a'.repeat(32), 'd9' + '20' + '61'.repeat(32));
    check('a'.repeat(255), 'd9' + 'ff' + '61'.repeat(255));
  });

  it('str 16', function () {
    check('a'.repeat(256), 'da' + '0100' + '61'.repeat(256));
    check('a'.repeat(65535), 'da' + 'ffff' + '61'.repeat(65535));
  });

  it('str 32', function () {
    check('a'.repeat(65536), 'db' + '00010000' + '61'.repeat(65536));
  });

  it('array 16', function () {
    check(array(16), 'dc' + '0010' + '00'.repeat(16));
    check(array(65535), 'dc' + 'ffff' + '00'.repeat(65535));
  });

  it('array 32', function () {
    check(array(65536), 'dd' + '00010000' + '00'.repeat(65536));
  });

  it('map 16', function () {
    check(
      { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 },
      'de' + '0010' + 'a13000a13101a13202a13303a13404a13505a13606a13707a13808a13909a1610aa1620ba1630ca1640da1650ea1660f'
    );
    var map16 = map(65535);
    var encoded = msgpack.encode(map16);
    expect(encoded.toString('hex', 0, 3)).to.equal('deffff');
    expect(msgpack.decode(encoded)).to.deep.equal(map16);
  });

  it('map 32', function () {
    var map32 = map(65536);
    var encoded = msgpack.encode(map32);
    expect(encoded.toString('hex', 0, 5)).to.equal('df00010000');
    expect(msgpack.decode(encoded)).to.deep.equal(map32);
  });

  it('all formats', function () {
    var expected = {
      unsigned: [1, 2, 3, 4, { b: { c: [128, 256, 65536, 4294967296] } }],
      signed: [-1, -2, -3, -4, { b: { c: [-33, -129, -32769, -2147483649] } }],
      bin: [new Buffer('abc'), new Buffer('a'.repeat(256)), new Buffer('c'.repeat(65536))],
      str: ['abc', 'g'.repeat(32), 'h'.repeat(256), 'i'.repeat(65536)],
      array: [[], array(16), array(65536)],
      map: {},
      nil: null,
      bool: { 'true': true, 'false': false, both: [true, false, false, false, true] },
      'undefined': [undefined, true, false, null, undefined]
    };
    expected.map['a'.repeat(32)] = { a: 'a', b: 'b', c: 'c' };
    expected.map['b'.repeat(256)] = { a: { b: 1, c: 1, d: 1, e: { f: { g: 2, h: 2 } } } };
    expected.map['c'.repeat(65536)] = [{ a: { b: 1, c: 1, d: 1, e: { f: [{ g: 2, h: 2 }] } } }];
    expected.map16 = map(65535);
    expected.map32 = map(65536);

    expect(msgpack.decode(msgpack.encode(expected))).to.deep.equal(expected);
  });

  it('10000', function () {
    var fixture = require('./fixtures/10000.json');

    expect(msgpack.decode(msgpack.encode(fixture))).to.deep.equal(fixture);
  });
});
