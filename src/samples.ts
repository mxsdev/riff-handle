import { ParseWave } from "./parseChunk";
import { BufferHandle, RIFFReader } from "./riffReader";
import { WaveData } from "./types/data";

export async function getWaveSampleRange(handle: BufferHandle, size: number, position: number, length: number) {
    const reader = new RIFFReader(handle, size)
    await reader.init()

    let sampleSize: number|null = null

    while(!reader.eol()) {
        const [ckID] = await reader.nextChunk()

        if(ckID === 'fmt ') {
            const { blockAlign } = ParseWave.parseFormatChunk(await reader.readCurrentChunk())
            
            sampleSize = blockAlign
        } else if(await reader.isSampleDataChunk()) {
            if(sampleSize == null) throw new Error('Invalid WAVE File - Does not include fmt chunk before data chunk!')

            return waveDataToBuffer(await reader.getSampleRange(position, length, sampleSize), sampleSize)
        } else {
            await reader.skipCurrentChunk()
        }
    }

    throw new Error('Wave file has no data')
}

function waveDataToBuffer(data: WaveData, sampleSize: number): Buffer {
    if(data.length === 1 && data[0].type === 'data') return data[0].data

    const numBytes = data.reduce((prev: number, curr) => prev + waveDataChunkSize(curr, sampleSize), 0)
    const buff = Buffer.alloc(numBytes)

    let byteIndex = 0

    data.forEach((d) => {
        if(d.type === 'data') {
            buff.set(d.data, byteIndex)
        }

        byteIndex += waveDataChunkSize(d, sampleSize)
    })

    return buff
}

function waveDataChunkSize(data: WaveData[number], sampleSize: number): number {
    return (data.type === 'data' ? data.data.length : data.length * sampleSize)
}