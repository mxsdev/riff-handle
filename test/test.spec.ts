import { assert } from 'chai'
import fs from 'fs/promises'
import path from 'path'
import { RIFFReader, getWaveMeta, getWaveSampleRange, WaveWriter } from '../dist/index'
import { test_wave_meta } from './snapshot'

const withHandle = async (handlePromise: Promise<fs.FileHandle>, func: (handle: fs.FileHandle) => Promise<void>) => {
    const handle = await handlePromise

    try {
        await func(handle)
    } catch(e) {
        await handle.close()
        throw e
    } finally {
        await handle.close()
    }
}

const test_wav = path.join(__dirname, 'files', 'test.wav')
const test_trimmed_wav = path.join(__dirname, 'files', 'test_trim.wav')

describe('RIFFReader', async () => {
    it('evaluates file size and type', async () => {
        await withHandle(fs.open(test_wav, 'r'), async (handle) => {
            const size = (await handle.stat()).size
    
            const reader = new RIFFReader(handle, size)
    
            const { file_size, file_type } = await reader.init()
    
            assert.strictEqual(file_type, 'WAVE')
            assert.strictEqual(file_size, 152948)
        })
    })
})

describe('getWaveMeta', () => {
    it('returns proper metadata', async () => {
        await withHandle(fs.open(test_wav, 'r'), async (handle) => {
            const size = (await handle.stat()).size
    
            const meta = await getWaveMeta(handle, size)
    
            for(const key of Object.keys(meta)) {
                if(key === 'adtl') continue
    
                // @ts-ignore
                assert.deepStrictEqual(meta[key], test_wave_meta[key])
            }
    
            // we must skip the second index here since it conains a Buffer

            // @ts-ignore
            assert.deepStrictEqual(meta['adtl'][0], test_wave_meta['adtl'][0])
            // @ts-ignore
            assert.deepStrictEqual(meta['adtl'][2], test_wave_meta['adtl'][2])
        })
    })
})

describe('getSampleRange', () => {
    it('returns proper byte array', async () => {
        await withHandle(fs.open(test_wav, 'r'), async (handle) => {
            // Write file
            const size = (await handle.stat()).size
    
            const meta = await getWaveMeta(handle, size)
    
            const cue = meta.cue.find(p => p.id === 1)
            const len = meta.adtl.find(p => p.id === 1 && p.type === 'ltxt')
    
            if(!cue || len?.type !== 'ltxt') throw new Error('cue point not found')
    
            // @ts-ignore
            const { data: buff } = await getWaveSampleRange(handle, size, cue.position, len.sampleLength)
    
            const wave = new WaveWriter(meta.fmt, meta.fact, buff).setTag('ICMT', 'This is a test comment.')
    
            // check snapshot
            const snapshot = await fs.readFile(test_trimmed_wav)
            assert.deepStrictEqual(snapshot, wave.toBuffer())
        })
    })
})