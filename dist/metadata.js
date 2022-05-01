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
exports.getWaveMeta = void 0;
const parseChunk_1 = require("./parseChunk");
const riffReader_1 = require("./riffReader");
/**
 * Retrieves the metadata from a wave file
 * without loading its data into memory
 *
 * @param handle
 * @param size
 * @returns
 */
function getWaveMeta(handle, size) {
    return __awaiter(this, void 0, void 0, function* () {
        let fmt = undefined;
        let cue = [];
        let adtl = [];
        let info = {};
        let fact = undefined;
        const riffReader = new riffReader_1.RIFFReader(handle, size);
        const { file_type } = yield riffReader.init();
        if (file_type !== 'WAVE') {
            throw new riffReader_1.InvalidRIFFFileFormatError('File must be of WAVE type');
        }
        while (!riffReader.eol()) {
            const [ckID, ckSize] = yield riffReader.nextChunk();
            if (ckID === 'fmt ') {
                const buff = yield riffReader.readCurrentChunk();
                fmt = parseChunk_1.ParseWave.parseFormatChunk(buff);
            }
            else if (ckID === 'cue ') {
                const buff = yield riffReader.readCurrentChunk();
                cue = parseChunk_1.ParseWave.parseCueChunk(buff);
            }
            else if (ckID === 'fact') {
                const buff = yield riffReader.readCurrentChunk();
                fact = parseChunk_1.ParseWave.parseFactChunk(buff);
            }
            else if (ckID === 'LIST') {
                const meta = yield riffReader.getChunkMeta();
                if (meta.type === 'list') {
                    if (meta.list_type === 'adtl') {
                        const buff = yield riffReader.readCurrentChunk();
                        adtl = parseChunk_1.ParseWave.ADTL.parseWaveADTLChunk(buff);
                    }
                    else if (meta.list_type === 'INFO') {
                        const buff = yield riffReader.readCurrentChunk();
                        info = yield parseChunk_1.ParseWave.parseInfoChunk(buff);
                    }
                }
            }
            if (riffReader.chunkLoaded())
                riffReader.skipCurrentChunk();
        }
        if (!fmt)
            throw new Error('fmt chunk missing from wave file');
        return { fmt, cue, adtl, info, fact };
    });
}
exports.getWaveMeta = getWaveMeta;
