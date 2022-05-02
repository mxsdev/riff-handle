"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkWriter = exports.WaveWriter = exports.RIFFWriter = void 0;
class RIFFWriter {
    constructor(format) {
        this.writer = new ChunkWriter('RIFF');
        this.writer.writeFCC(format);
    }
    getWriter() {
        return this.writer;
    }
    toBuffer() {
        return this.getWriter().toBuffer(this.extraData());
    }
    extraData() {
        return undefined;
    }
}
exports.RIFFWriter = RIFFWriter;
class WaveWriter extends RIFFWriter {
    constructor(fmt, fact, data) {
        super('WAVE');
        this.info = {};
        // Write format chunk
        const fmtChunk = new ChunkWriter('fmt ')
            .writeWord(fmt.formatTag)
            .writeWord(fmt.channels)
            .writeDWord(fmt.samplesPerSec)
            .writeDWord(fmt.avgBytesPerSec)
            .writeWord(fmt.blockAlign);
        if (fmt.bitsPerSample)
            fmtChunk.writeWord(fmt.bitsPerSample);
        this.getWriter().writeBuffer(fmtChunk.toBuffer());
        // Write fact chunk
        if (fact) {
            const factChunk = new ChunkWriter('fact')
                .writeDWord(fact.numSamples);
            this.getWriter().writeBuffer(factChunk.toBuffer());
        }
        // Write data chunk
        // TODO: support wavl format
        const dataChunk = new ChunkWriter('data')
            .writeBuffer(data);
        this.getWriter().writeBuffer(dataChunk.toBuffer());
    }
    extraData() {
        const res = [];
        res.push(this.getTagChunk());
        return res.length > 0 ? res : undefined;
    }
    setTag(tag, value) {
        this.info[tag] = value;
        return this;
    }
    getTagChunk() {
        const writer = new ChunkWriter('LIST');
        writer.writeFCC('INFO');
        Object.keys(this.info).forEach((tag) => {
            const subwriter = new ChunkWriter(tag);
            subwriter.writeZStr(this.info[tag]);
            writer.writeBuffer(subwriter.toBuffer());
        });
        return writer.toBuffer();
    }
}
exports.WaveWriter = WaveWriter;
class ChunkWriter {
    constructor(ckID) {
        const idBuff = fccToBuffer(ckID);
        this.chunk = {
            ckID: idBuff,
            data: []
        };
    }
    toBuffer(extra_data) {
        const data = Buffer.concat([...this.chunk.data, ...(extra_data !== null && extra_data !== void 0 ? extra_data : [])]);
        const size = Buffer.alloc(4);
        size.writeUInt32LE(data.length);
        const res = [this.chunk.ckID, size, data];
        if ((data.length & 1) === 1) {
            res.push(Buffer.alloc(1)); // pad byte
        }
        return Buffer.concat(res);
    }
    writeBuffer(buff) {
        this.chunk.data.push(buff);
        return this;
    }
    writeFCC(fcc) {
        return this.writeBuffer(fccToBuffer(fcc));
    }
    writeWord(val) {
        const buff = Buffer.alloc(2);
        buff.writeUint16LE(val);
        return this.writeBuffer(buff);
    }
    writeDWord(val) {
        const buff = Buffer.alloc(4);
        buff.writeUint32LE(val);
        return this.writeBuffer(buff);
    }
    writeZStr(str) {
        const buff = Buffer.alloc(str.length + 1);
        buff.write(str, 'utf-8');
        return this.writeBuffer(buff);
    }
}
exports.ChunkWriter = ChunkWriter;
function fccToBuffer(fcc) {
    const buff = Buffer.alloc(4);
    buff.write(fcc, 'utf-8');
    return buff;
}
