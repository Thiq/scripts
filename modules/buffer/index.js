// an attempt at using Java's buffers to replicate Node functionality
var jBuffer = importClass('java.nio.ByteBuffer');
var Integer = importClass('java.lang.Integer');

function convertByteToSigned(b) {
    if (b < 128) return b;
    return Math.pow(2, 8) + Math.abs(b);
}

function convertShortToUnsigned(s) {
    if (s > 0) return s;
    return Math.pow(2, 16) + Math.abs(s);
}

function convertIntToUnsigned(i) {
    if (i > 0) return i;
    return Math.pow(2, 32) + Math.abs(i);
}

var Buffer = function(jb) {
    var jBuffer = jb;

    this.readDoubleBE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return jBuffer.getDouble(offset);
    }

    this.readDoubleLE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return Integer.reverseBytes(this.readDoubleBE(offset, noAssert));
    }

    this.readFloatBE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return jBuffer.getFloat(offset);
    }

    this.readFloatLE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return Integer.reverseBytes(this.readFloatBE(offset, noAssert));
    }

    this.readInt8 = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return convertByteToSigned(this.readUInt8(offset, noAssert));
    }

    this.readUInt8 = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return jBuffer.get(offset);
    }

    this.readInt16BE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return jBuffer.getShort(offset);
    }

    this.readInt16LE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return Integer.reverseBytes(this.readInt16BE(offset, noAssert));
    }

    this.readUInt16BE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return convertShortToUnsigned(jBuffer.getShort(offset));
    }

    this.readUInt16LE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return Integer.reverseBytes(this.readUInt16BE(offset, noAssert));
    }

    this.readInt32BE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return jBuffer.getInt(offset);
    }

    this.readInt32LE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return Integer.reverseBytes(this.readInt32BE(offset, noAssert));
    }

    this.readUInt32BE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return convertIntToUnsigned(jBuffer.getInt(offset));
    }

    this.readUInt32LE = function(offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        return Integer.reverseBytes(this.readUInt32BE(offset, noAssert));
    }

    this.writeDoubleBE = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.putDouble(value, offset);
        return 8;
    }

    this.writeDoubleLE = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.putDouble(Integer.reverseBytes(value), offset);
        return 8;
    }

    this.writeFloatBE = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.putFloat(value, offset);
        return 4;
    }

    this.writeFloatLE = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.putFloat(Integer.reverseBytes(value), offset);
        return 4;
    }

    this.writeInt8 = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.put(Integer.reverseBytes(value), offset);
        return 1;
    }

    this.writeUInt8 = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.put(value, offset);
        return 1;
    }

    this.writeInt16BE = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.putShort(value, offset);
        return 2;
    }

    this.writeInt16LE = function(value, offset, noAssert) {
        return this.writeInt16BE(Integer.reverseBytes(value), offset, noAssert);
    }

    this.writeUInt16BE = function(value, offset, noAssert) {
        return this.writeInt16BE(convertShortToUnsigned(value), offset, noAssert);
    }

    this.writeUInt16LE = function(value, offset, noAssert) {
        return this.writeInt16LE(convertShortToUnsigned(value), offset, noAssert);
    }

    this.writeInt32BE = function(value, offset, noAssert) {
        if (noAssert !== true && jBuffer.limit() <= offset) throw new Error("The offset must be less than the buffer's length.");
        jBuffer.putInt(value, offset);
        return 4;
    }

    this.writeInt32LE = function(value, offset, noAssert) {
        return this.writeInt32BE(Integer.reverseBytes(value), offset, noAssert);
    }

    this.writeUInt32BE = function(value, offset, noAssert) {
        return this.writeInt32BE(convertIntToUnsigned(value), offset, noAssert);
    }

    this.writeUInt32LE = function(value, offset, noAssert) {
        return this.writeInt32LE(convertIntToUnsigned(value), offset, noAssert);
    }

    this.write = function(value, offset, length, encoding) {
        if (offset === undefined) offset = 0;
        if (length === undefined) length = jBuffer.limit() - offset;
        if (encoding === undefined) encoding = 'UTF8';
        var remaining = jBuffer.remaining();
        var bytes = value.getBytes(encoding);
        jBuffer.put(bytes, offset, length);
        return Math.min([remaining, bytes.length]);
    }

    return this;
}

Buffer.alloc = function(size, fill, encoding) {
    var buffer = new Buffer(jBuffer.alloc(size));
    if (fill != undefined) {
        for (var i = 0; i < size; i++) {

        }
    }

    return buffer;
}

Buffer.from = function(contents) {
    return new Buffer(jBuffer.wrap(contents));
}

module.exports = Buffer;