/// <reference types="node" />
import { BufferHandle } from "./riffReader";
import { WaveFormat } from "./types/chunks";
export declare function getWaveSampleRange(handle: BufferHandle, size: number, position: number, length: number): Promise<{
    fmt: WaveFormat;
    data: Buffer;
}>;
