/// <reference types="node" />
import { ChunkMeta } from "./types/chunks";
import { RIFFMeta } from "./types/riff";
import { WaveData } from "./types/data";
/**
 * Abstraction of fs.FileHandle
 *
 * This is a general interface which can read a specified number
 * of bytes at a specific location in a buffer
 *
 */
export interface BufferHandle {
    read<T extends NodeJS.ArrayBufferView>(buffer: T, offset?: number | null, length?: number | null, position?: number | null): Promise<{
        bytesRead: number;
    }>;
}
declare class RIFFParseError extends Error {
    constructor(message: string);
}
export declare class InvalidRIFFFileFormatError extends RIFFParseError {
}
export declare class RIFFFileEOLError extends RIFFParseError {
}
/**
 * Traverses the chunks of a generic RIFF file
 * from a handle to a buffer (e.g. fs.FileHandle)
 */
export declare class RIFFReader {
    private pos;
    private handle;
    private size;
    private initialized;
    chunk: ChunkMeta | null;
    /**
     * Create a new RIFF Reader
     *
     * @param handle
     * @param size
     * @param start
     */
    constructor(handle: BufferHandle, size: number, start?: number, initialized?: boolean);
    init(): Promise<RIFFMeta>;
    eol(): boolean;
    remaining(): number;
    advance(by: number): void;
    private _read;
    private read;
    chunkLoaded(): boolean;
    nextChunk(): Promise<ChunkMeta>;
    getChunkMeta(): Promise<{
        type: 'unknown';
    } | {
        type: 'list';
        list_type: string;
    }>;
    readCurrentChunk(): Promise<Buffer>;
    skipCurrentChunk(): Promise<void>;
    private discardCurrentChunk;
    isSampleDataChunk(): Promise<'data' | 'list' | false>;
    getSampleRange(position: number, length: number, sampleSize: number): Promise<WaveData>;
}
export {};
