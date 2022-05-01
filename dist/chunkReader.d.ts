/// <reference types="node" />
/**
 * Utility class for extracting data segments
 * from a RIFF chunk data buffer
 */
export declare class ChunkReader {
    private pos;
    private chunk;
    /**
     * Create a new chunk reader
     *
     * @param chunk RIFF chunk buffer
     * @param start Starting position pointer, which is 0 by default
     */
    constructor(chunk: Buffer, start?: number);
    eol(): boolean;
    remaining(): number;
    advance(by: number): void;
    private read;
    readRemaining(): Buffer;
    readUint8(): number;
    readUint16(): number;
    readUint32(): number;
    readAscii(num_bytes: number): string;
    readFCC(): string;
    readWord(): number;
    readDWord(): number;
    readSubchunk(): [ckID: string, ckSize: number, ckData: Buffer];
    readZStr(): string;
    readNullTerminatedString(): string;
}
