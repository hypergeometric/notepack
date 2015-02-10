'use strict';

function Decoder(buffer) {
  this.offset = 0;
  this.buffer = buffer;
}

Decoder.prototype.expect = function (length) {
  var remain = this.buffer.length - this.offset;
  if (remain < length) {
    throw new Error('Expected ' + length + ' bytes, found ' + remain + '.');
  }
}

Decoder.prototype.array = function (length) {
  var value = new Array(length);
  for (var i = 0; i < length; i++) {
    value[i] = this.parse();
  }
  return value;
};

Decoder.prototype.map = function (length) {
  var key, value = {};
  for (var i = 0; i < length; i++) {
    key = this.parse();
    value[key] = this.parse();
  }
  return value;
};

Decoder.prototype.str = function (length) {
  this.expect(length);
  var value = this.buffer.toString('utf8', this.offset, this.offset + length);
  this.offset += length;
  return value;
};

Decoder.prototype.bin = function (length) {
  this.expect(length);
  var value = this.buffer.slice(this.offset, this.offset + length);
  this.offset += length;
  return value;
};

Decoder.prototype.parse = function () {
  var prefix = this.buffer[this.offset++];
  var value, length, type, hi, lo;

  if (prefix < 0xc0) {
    // positive fixint
    if (prefix < 0x80) {
      return prefix;
    }
    // fixmap
    if (prefix < 0x90) {
      return this.map(prefix & 0x0f);
    }
    // fixarray
    if (prefix < 0xa0) {
      return this.array(prefix & 0x0f);
    }
    // fixstr
    return this.str(prefix & 0x1f);
  }

  // negative fixint
  if (prefix > 0xdf) {
    return (0xff - prefix + 1) * -1;
  }

  switch (prefix) {
    // nil
    case 0xc0:
      return null;
    // false
    case 0xc2:
      return false;
    // true
    case 0xc3:
      return true;

    // bin
    case 0xc4:
      this.expect(1);
      length = this.buffer.readUInt8(this.offset);
      this.offset += 1;
      return this.bin(length);
    case 0xc5:
      this.expect(2);
      length = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return this.bin(length);
    case 0xc6:
      this.expect(4);
      length = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return this.bin(length);

    // ext
    case 0xc7:
      this.expect(2);
      length = this.buffer.readUInt8(this.offset);
      type = this.buffer.readInt8(this.offset + 1);
      this.offset += 2;
      return [type, this.bin(length)];
    case 0xc8:
      this.expect(3);
      length = this.buffer.readUInt16BE(this.offset);
      type = this.buffer.readInt8(this.offset + 2);
      this.offset += 3;
      return [type, this.bin(length)];
    case 0xc9:
      this.expect(5);
      length = this.buffer.readUInt32BE(this.offset);
      type = this.buffer.readInt8(this.offset + 4);
      this.offset += 5;
      return [type, this.bin(length)];

    // float
    case 0xca:
      this.expect(4);
      value = this.buffer.readFloatBE(this.offset);
      this.offset += 4;
      return value;
    case 0xcb:
      this.expect(8);
      value = this.buffer.readDoubleBE(this.offset);
      this.offset += 8;
      return value;

    // uint
    case 0xcc:
      this.expect(1);
      value = this.buffer.readUInt8(this.offset);
      this.offset += 1;
      return value;
    case 0xcd:
      this.expect(2);
      value = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return value;
    case 0xce:
      this.expect(4);
      value = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return value;
    case 0xcf:
      this.expect(8);
      hi = this.buffer.readUInt32BE(this.offset) * Math.pow(2, 32);
      lo = this.buffer.readUInt32BE(this.offset + 4);
      this.offset += 8;
      return hi + lo;

    // int
    case 0xd0:
      this.expect(1);
      value = this.buffer.readInt8(this.offset);
      this.offset += 1;
      return value;
    case 0xd1:
      this.expect(2);
      value = this.buffer.readInt16BE(this.offset);
      this.offset += 2;
      return value;
    case 0xd2:
      this.expect(4);
      value = this.buffer.readInt32BE(this.offset);
      this.offset += 4;
      return value;
    case 0xd3:
      this.expect(8);
      hi = this.buffer.readInt32BE(this.offset) * Math.pow(2, 32);
      lo = this.buffer.readUInt32BE(this.offset + 4);
      this.offset += 8;
      return hi + lo;

    // fixext
    case 0xd4:
      this.expect(1);
      type = this.buffer.readInt8(this.offset);
      this.offset += 1;
      if (type === 0x00) {
        this.offset += 1;
        return void 0;
      }
      return [type, this.bin(1)];
    case 0xd5:
      this.expect(1);
      type = this.buffer.readInt8(this.offset);
      this.offset += 1;
      return [type, this.bin(2)];
    case 0xd6:
      this.expect(1);
      type = this.buffer.readInt8(this.offset);
      this.offset += 1;
      return [type, this.bin(4)];
    case 0xd7:
      this.expect(1);
      type = this.buffer.readInt8(this.offset);
      this.offset += 1;
      if (type === 0x00) {
        this.expect(8);
        hi = this.buffer.readInt32BE(this.offset) * Math.pow(2, 32);
        lo = this.buffer.readUInt32BE(this.offset + 4);
        this.offset += 8;
        return new Date(hi + lo);
      }
      return [type, this.bin(8)];
    case 0xd8:
      this.expect(1);
      type = this.buffer.readInt8(this.offset);
      this.offset += 1;
      return [type, this.bin(16)];

    // str
    case 0xd9:
      this.expect(1);
      length = this.buffer.readUInt8(this.offset);
      this.offset += 1;
      return this.str(length);
    case 0xda:
      this.expect(2);
      length = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return this.str(length);
    case 0xdb:
      this.expect(4);
      length = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return this.str(length);

    // array
    case 0xdc:
      this.expect(2);
      length = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return this.array(length);
    case 0xdd:
      this.expect(4);
      length = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return this.array(length);

    // map
    case 0xde:
      this.expect(2);
      length = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return this.map(length);
    case 0xdf:
      this.expect(4);
      length = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return this.map(length);
  }

  throw new Error('Could not parse');
};

function decode(buffer) {
  var decoder = new Decoder(buffer);
  var value = decoder.parse();
  if (decoder.offset !== buffer.length) {
    throw new Error((buffer.length - decoder.offset) + ' trailing bytes');
  }
  return value;
}

decode.Decoder = Decoder;
module.exports = decode;
