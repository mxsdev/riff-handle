import { WaveMeta } from "./types/chunks";
import { BufferHandle } from "./riffReader";
/**
 * Retrieves the metadata from a wave file
 * without loading its data into memory
 *
 * @param handle
 * @param size
 * @returns
 */
export declare function getWaveMeta(handle: BufferHandle, size: number): Promise<WaveMeta>;
