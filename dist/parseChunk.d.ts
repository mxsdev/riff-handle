/// <reference types="node" />
import type { WaveADTL, WaveCues, WaveFormat, ChunkMeta, WaveInfo, WaveFact } from './types/chunks';
export declare function parseChunkHeader(header: Buffer): ChunkMeta;
export declare namespace ParseWave {
    function parseFormatChunk(chunk: Buffer): WaveFormat;
    function parseCueChunk(chunk: Buffer): WaveCues;
    function parseInfoChunk(chunk: Buffer): WaveInfo;
    function parseFactChunk(chunk: Buffer): WaveFact;
    namespace ADTL {
        function parseWaveADTLChunk(chunk: Buffer): WaveADTL;
    }
}
