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
exports.getWaveSampleRange = void 0;
const parseChunk_1 = require("./parseChunk");
const riffReader_1 = require("./riffReader");
function getWaveSampleRange(handle, size, position, length) {
    return __awaiter(this, void 0, void 0, function* () {
        const reader = new riffReader_1.RIFFReader(handle, size);
        yield reader.init();
        let fmt = null;
        while (!reader.eol()) {
            const [ckID] = yield reader.nextChunk();
            if (ckID === 'fmt ') {
                fmt = parseChunk_1.ParseWave.parseFormatChunk(yield reader.readCurrentChunk());
            }
            else if (yield reader.isSampleDataChunk()) {
                if (fmt == null)
                    throw new Error('Invalid WAVE File - Does not include fmt chunk before data chunk!');
                const { blockAlign: sampleSize } = fmt;
                const data = waveDataToBuffer(yield reader.getSampleRange(position, length, sampleSize), sampleSize);
                return { fmt, data };
            }
            else {
                yield reader.skipCurrentChunk();
            }
        }
        throw new Error('Wave file has no data');
    });
}
exports.getWaveSampleRange = getWaveSampleRange;
function waveDataToBuffer(data, sampleSize) {
    if (data.length === 1 && data[0].type === 'data')
        return data[0].data;
    const numBytes = data.reduce((prev, curr) => prev + waveDataChunkSize(curr, sampleSize), 0);
    const buff = Buffer.alloc(numBytes);
    let byteIndex = 0;
    data.forEach((d) => {
        if (d.type === 'data') {
            buff.set(d.data, byteIndex);
        }
        byteIndex += waveDataChunkSize(d, sampleSize);
    });
    return buff;
}
function waveDataChunkSize(data, sampleSize) {
    return (data.type === 'data' ? data.data.length : data.length * sampleSize);
}
