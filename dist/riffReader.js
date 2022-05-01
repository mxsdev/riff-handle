"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIFFReader = exports.RIFFFileEOLError = exports.InvalidRIFFFileFormatError = void 0;
const chunkReader_1 = require("./chunkReader");
const parseChunk_1 = require("./parseChunk");
class RIFFParseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
    }
}
class InvalidRIFFFileFormatError extends RIFFParseError {
}
exports.InvalidRIFFFileFormatError = InvalidRIFFFileFormatError;
class RIFFFileEOLError extends RIFFParseError {
}
exports.RIFFFileEOLError = RIFFFileEOLError;
/**
 * Traverses the chunks of a generic RIFF file
 * from a handle to a buffer (e.g. fs.FileHandle)
 */
class RIFFReader {
    /**
     * Create a new RIFF Reader
     *
     * @param handle
     * @param size
     * @param start
     */
    constructor(handle, size, start = 0) {
        this.initialized = false;
        this.chunk = null;
        this.pos = start;
        this.handle = handle;
        this.size = size;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let buff;
            try {
                buff = yield this.read(12, true, true);
            }
            catch (e) {
                if (e instanceof RIFFFileEOLError) {
                    throw new InvalidRIFFFileFormatError('File not a valid RIFF file');
                }
                else {
                    throw e;
                }
            }
            const header_reader = new chunkReader_1.ChunkReader(buff);
            const file_header = header_reader.readFCC();
            if (file_header !== 'RIFF') {
                throw new InvalidRIFFFileFormatError('File not a valid RIFF file');
            }
            const file_size = header_reader.readDWord();
            const file_type = header_reader.readFCC();
            this.initialized = true;
            return {
                file_size, file_type
            };
        });
    }
    eol() {
        return this.remaining() <= 0;
    }
    remaining() {
        return this.size - this.pos;
    }
    advance(by) {
        this.pos += by;
    }
    _read(buffer, num_bytes, advance = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.remaining() < num_bytes) {
                throw new RIFFFileEOLError('Attempted to read beyond end of line');
            }
            const { bytesRead } = yield this.handle.read(buffer, 0, num_bytes, this.pos);
            if (advance)
                this.advance(num_bytes);
            return bytesRead;
        });
    }
    read(num_bytes, advance = true, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && !this.initialized)
                throw new Error('Cannot read from riff file without running init()!');
            const buffer = Buffer.alloc(num_bytes);
            const res = yield this._read(buffer, num_bytes, advance);
            return buffer;
        });
    }
    chunkLoaded() {
        return !!this.chunk;
    }
    nextChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (8 > this.remaining() && !this.eol()) {
                throw new InvalidRIFFFileFormatError('Invalid RIFF File');
            }
            if (this.chunkLoaded())
                throw new Error('Chunk already loaded!');
            const buf = yield this.read(8);
            const chunkMeta = (0, parseChunk_1.parseChunkHeader)(buf);
            this.chunk = chunkMeta;
            return chunkMeta;
        });
    }
    getChunkMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chunkLoaded())
                throw new Error('No chunk currently loaded!');
            const [ckID] = this.chunk;
            if (ckID === 'LIST') {
                if (4 > this.remaining())
                    throw new InvalidRIFFFileFormatError('Invalid RIFF File - LIST block does not have a 4-byte type description');
                const header = (yield this.read(4, false)).toString('utf-8');
                return { type: 'list', list_type: header };
            }
            return { type: 'unknown' };
        });
    }
    readCurrentChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chunkLoaded())
                throw new Error('No chunk currently loaded!');
            const [ckID, ckSize] = this.chunk;
            if (ckSize > this.remaining()) {
                throw new InvalidRIFFFileFormatError('Invalid RIFF File');
            }
            const buf = yield this.read(ckSize);
            this.advance(ckSize & 1); // account for pad byte
            this.discardCurrentChunk();
            return buf;
        });
    }
    skipCurrentChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chunkLoaded()) {
                throw new Error('No chunk currently loaded!');
            }
            const [ckID, ckSize] = this.chunk;
            this.advance(ckSize + (ckSize & 1)); // account for pad byte
            this.discardCurrentChunk();
        });
    }
    discardCurrentChunk() {
        this.chunk = null;
    }
}
exports.RIFFReader = RIFFReader;
