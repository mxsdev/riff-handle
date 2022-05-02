/// <reference types="node" />
import { WaveFact, WaveFormat, WaveInfo } from "./types/chunks";
export declare class RIFFWriter {
    writer: ChunkWriter;
    constructor(format: string);
    getWriter(): ChunkWriter;
    toBuffer(): Buffer;
    extraData(): Buffer[] | undefined;
}
export declare class WaveWriter extends RIFFWriter {
    info: WaveInfo;
    constructor(fmt: WaveFormat, fact: WaveFact | undefined, data: Buffer);
    extraData(): Buffer[] | undefined;
    setTag(tag: string, value: string): this;
    getTagChunk(): Buffer;
}
export declare class ChunkWriter {
    chunk: {
        ckID: Buffer;
        data: Buffer[];
    };
    constructor(ckID: string);
    toBuffer(extra_data?: Buffer[]): Buffer;
    writeBuffer(buff: Buffer): this;
    writeFCC(fcc: string): this;
    writeWord(val: number): this;
    writeDWord(val: number): this;
    writeZStr(str: string): this;
}
