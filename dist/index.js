"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChunkHeader = exports.ParseWave = exports.RIFFReader = exports.ChunkReader = exports.getWaveMeta = void 0;
var metadata_1 = require("./metadata");
Object.defineProperty(exports, "getWaveMeta", { enumerable: true, get: function () { return metadata_1.getWaveMeta; } });
var chunkReader_1 = require("./chunkReader");
Object.defineProperty(exports, "ChunkReader", { enumerable: true, get: function () { return chunkReader_1.ChunkReader; } });
var riffReader_1 = require("./riffReader");
Object.defineProperty(exports, "RIFFReader", { enumerable: true, get: function () { return riffReader_1.RIFFReader; } });
var parseChunk_1 = require("./parseChunk");
Object.defineProperty(exports, "ParseWave", { enumerable: true, get: function () { return parseChunk_1.ParseWave; } });
Object.defineProperty(exports, "parseChunkHeader", { enumerable: true, get: function () { return parseChunk_1.parseChunkHeader; } });
