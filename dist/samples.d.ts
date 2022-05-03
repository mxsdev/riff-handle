/// <reference types="node" />
import { BufferHandle } from "./riffReader";
export declare function getWaveSampleRange(handle: BufferHandle, size: number, position: number, length: number): Promise<Buffer>;
