/// <reference types="node" />
import type { WaveADTL, WaveCues, WaveFormat, ChunkMeta } from './types/chunks';
export declare function parseChunkHeader(header: Buffer): ChunkMeta;
export declare namespace ParseWave {
    function parseFormatChunk(chunk: Buffer): WaveFormat;
    function parseCueChunk(chunk: Buffer): WaveCues;
    namespace ADTL {
        function parseWaveADTLChunk(chunk: Buffer): WaveADTL;
    }
}
