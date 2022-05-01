"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkReader = void 0;
/**
 * Utility class for extracting data segments
 * from a RIFF chunk data buffer
 */
class ChunkReader {
    /**
     * Create a new chunk reader
     *
     * @param chunk RIFF chunk buffer
     * @param start Starting position pointer, which is 0 by default
     */
    constructor(chunk, start = 0) {
        this.pos = start;
        this.chunk = chunk;
    }
    eol() {
        return this.remaining() <= 0;
    }
    remaining() {
        return this.chunk.length - this.pos;
    }
    advance(by) {
        this.pos += by;
    }
    read(num_bytes) {
        if (this.remaining() < num_bytes)
            throw new Error('Tried to read more bytes than are available in ChunkReader');
        const res = this.chunk.slice(this.pos, this.pos + num_bytes);
        this.advance(num_bytes);
        return res;
    }
    readRemaining() {
        return this.read(this.remaining());
    }
    readUint8() {
        return this.read(1).readUint8();
    }
    readUint16() {
        return this.read(2).readUint16LE();
    }
    readUint32() {
        return this.read(4).readUint32LE();
    }
    readAscii(num_bytes) {
        return this.read(num_bytes).toString('utf-8');
    }
    readFCC() { return this.readAscii(4); }
    readWord() { return this.readUint16(); }
    readDWord() { return this.readUint32(); }
    readSubchunk() {
        const ckID = this.readFCC();
        const ckSize = this.readDWord();
        const ckData = this.read(ckSize);
        // account for the pad byte
        this.advance(ckSize & 1);
        return [ckID, ckSize, ckData];
    }
    readZStr() {
        return this.readNullTerminatedString();
    }
    readNullTerminatedString() {
        let i = 0;
        while (this.chunk[i + this.pos] !== 0 && !this.eol()) {
            i++;
        }
        const string_buf = this.read(i);
        this.pos++; // dont include null terminator
        return string_buf.toString('utf-8');
    }
}
exports.ChunkReader = ChunkReader;
