"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseWave = exports.parseChunkHeader = void 0;
const chunkReader_1 = require("./chunkReader");
function parseChunkHeader(header) {
    const id_buffer = header.slice(0, 4);
    const size_buffer = header.slice(4, 8);
    return [
        id_buffer.toString('utf-8'),
        size_buffer.readInt32LE()
    ];
}
exports.parseChunkHeader = parseChunkHeader;
var ParseWave;
(function (ParseWave) {
    function parseFormatChunk(chunk) {
        const reader = new chunkReader_1.ChunkReader(chunk);
        const formatTag = reader.readWord();
        const channels = reader.readWord();
        const samplesPerSec = reader.readDWord();
        const avgBytesPerSec = reader.readDWord();
        const blockAlign = reader.readDWord();
        const bitsPerSample = (reader.remaining() >= 2) ? reader.readWord() : undefined;
        return { formatTag, channels, samplesPerSec, avgBytesPerSec, blockAlign, bitsPerSample };
    }
    ParseWave.parseFormatChunk = parseFormatChunk;
    function parseCueChunk(chunk) {
        const cues = [];
        const reader = new chunkReader_1.ChunkReader(chunk);
        const num_cpoints = reader.readDWord();
        for (let i = 0; i < num_cpoints; i++) {
            const id = reader.readDWord();
            const position = reader.readDWord();
            const chunk = reader.readFCC();
            const chunkStart = reader.readDWord();
            const blockStart = reader.readDWord();
            const sampleOffset = reader.readDWord();
            cues.push({ id, position, chunk, chunkStart, blockStart, sampleOffset });
        }
        return cues;
    }
    ParseWave.parseCueChunk = parseCueChunk;
    function parseInfoChunk(chunk) {
        const reader = new chunkReader_1.ChunkReader(chunk);
        const info = {};
        const list_type = reader.readFCC();
        while (!reader.eol()) {
            const [ckID, ckSize, ckData] = reader.readSubchunk();
            // Remove null termination
            info[ckID] = ckData.slice(0, -1).toString('utf-8');
        }
        return info;
    }
    ParseWave.parseInfoChunk = parseInfoChunk;
    function parseFactChunk(chunk) {
        const reader = new chunkReader_1.ChunkReader(chunk);
        const dwFileSize = reader.readDWord();
        return { numSamples: dwFileSize };
    }
    ParseWave.parseFactChunk = parseFactChunk;
    let ADTL;
    (function (ADTL) {
        function parseWaveADTLChunk(chunk) {
            const reader = new chunkReader_1.ChunkReader(chunk);
            const adtl = [];
            const list_type = reader.readFCC();
            while (!reader.eol()) {
                const [ckID, ckSize, ckData] = reader.readSubchunk();
                switch (ckID) {
                    case 'labl':
                        adtl.push(parseLabelSubchunk(ckData));
                        break;
                    case 'ltxt':
                        adtl.push(parseLTxtSubchunk(ckData));
                        break;
                    case 'note':
                        adtl.push(parseNoteSubchunk(ckData));
                        break;
                    case 'file':
                        adtl.push(parseFileSubchunk(ckData));
                        break;
                }
            }
            return adtl;
        }
        ADTL.parseWaveADTLChunk = parseWaveADTLChunk;
        function parseLabelSubchunk(subchunk) {
            const reader = new chunkReader_1.ChunkReader(subchunk);
            const id = reader.readDWord();
            const data = reader.readZStr();
            return { type: 'labl', id, data };
        }
        function parseLTxtSubchunk(subchunk) {
            const reader = new chunkReader_1.ChunkReader(subchunk);
            const id = reader.readDWord();
            const sampleLength = reader.readDWord();
            const purpose = reader.readDWord();
            const country = reader.readWord();
            const language = reader.readWord();
            const dialect = reader.readWord();
            const codePage = reader.readWord();
            const data = reader.readRemaining();
            return { type: 'ltxt', id, sampleLength, purpose, country, language, dialect, codePage, data };
        }
        function parseNoteSubchunk(subchunk) {
            const reader = new chunkReader_1.ChunkReader(subchunk);
            const id = reader.readDWord();
            const data = reader.readZStr();
            return { type: 'note', id, data };
        }
        function parseFileSubchunk(subchunk) {
            const reader = new chunkReader_1.ChunkReader(subchunk);
            const id = reader.readDWord();
            const medType = reader.readDWord();
            const fileData = reader.readRemaining();
            return { type: 'file', id, medType, fileData };
        }
    })(ADTL = ParseWave.ADTL || (ParseWave.ADTL = {}));
})(ParseWave = exports.ParseWave || (exports.ParseWave = {}));
