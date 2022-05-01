/// <reference types="node" />
import type { WaveADTL, WaveCues, WaveFormat, ChunkMeta, WaveInfo } from './types/chunks';
export declare function parseChunkHeader(header: Buffer): ChunkMeta;
export declare namespace ParseWave {
    function parseFormatChunk(chunk: Buffer): WaveFormat;
    function parseCueChunk(chunk: Buffer): WaveCues;
    function parseWaveInfoChunk(chunk: Buffer): WaveInfo;
    namespace ADTL {
        function parseWaveADTLChunk(chunk: Buffer): WaveADTL;
    }
}
