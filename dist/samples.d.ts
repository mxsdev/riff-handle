/// <reference types="node" />
import { BufferHandle } from "./riffReader";
export declare function getSampleRange(handle: BufferHandle, size: number, position: number, length: number): Promise<Buffer>;
