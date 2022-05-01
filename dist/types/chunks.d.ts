/// <reference types="node" />
export declare type ChunkMeta = [ckID: string, ckSize: number];
export declare type WaveFormat = {
    formatTag: number;
    channels: number;
    samplesPerSec: number;
    avgBytesPerSec: number;
    blockAlign: number;
    bitsPerSample?: number;
};
export declare type WaveCue = {
    id: number;
    position: number;
    chunk: string;
    chunkStart: number;
    blockStart: number;
    sampleOffset: number;
};
export declare type WaveCues = WaveCue[];
export declare type WaveMeta = {
    fmt: WaveFormat;
    cue: WaveCues;
    adtl: WaveADTL;
    info: WaveInfo;
    fact?: WaveFact;
};
export declare type WaveADTLLabel = {
    type: 'labl';
    id: number;
    data: string;
};
export declare type WaveADTLNote = {
    type: 'note';
    id: number;
    data: string;
};
export declare type WaveADTLLTxt = {
    type: 'ltxt';
    id: number;
    sampleLength: number;
    purpose: number;
    country: number;
    language: number;
    dialect: number;
    codePage: number;
    data: Buffer;
};
export declare type WaveADTLFile = {
    type: 'file';
    id: number;
    medType: number;
    fileData: Buffer;
};
export declare type WaveADTL = (WaveADTLLabel | WaveADTLLTxt | WaveADTLNote | WaveADTLFile)[];
export declare type WaveInfo = {
    [type: string]: string;
};
export declare type WaveFact = {
    numSamples: number;
};
