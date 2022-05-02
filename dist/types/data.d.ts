/// <reference types="node" />
export declare type DWORD = number;
export declare type WORD = number;
export declare type FCC = string;
export declare type WaveData = ({
    type: 'data';
    data: Buffer;
} | {
    type: 'slnc';
    length: number;
})[];
