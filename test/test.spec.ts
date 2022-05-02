import { assert } from 'chai'
import fs from 'fs/promises'
import path from 'path'
import { RIFFReader, getWaveMeta, getSampleRange, WaveWriter } from '../dist/index'
import { test_wave_meta } from './snapshot'

const test_wav = path.join(__dirname, 'files', 'test.wav')
const test_trimmed_wav = path.join(__dirname, 'files', 'test_trim.wav')

describe('RIFFReader', async () => {
    it('evaluates file size and type', async () => {
        const handle = await fs.open(test_wav, 'r')
        const size = (await handle.stat()).size

        const reader = new RIFFReader(handle, size)

        const { file_size, file_type } = await reader.init()

        assert.strictEqual(file_type, 'WAVE')
        assert.strictEqual(file_size, 152948)
    })
})

describe('getWaveMeta', () => {
    it('returns proper metadata', async () => {
        const handle = await fs.open(test_wav, 'r')
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

        await handle.close()
    })
})

describe('getSampleRange', () => {
    it('returns proper byte array', async () => {
        // Write file
        const handle = await fs.open(test_wav, 'r')
        const size = (await handle.stat()).size

        const meta = await getWaveMeta(handle, size)

        const cue = meta.cue.find(p => p.id === 1)
        const len = meta.adtl.find(p => p.id === 1 && p.type === 'ltxt')

        if(!cue || len?.type !== 'ltxt') throw new Error('cue point not found')

        // @ts-ignore
        const buff = await getSampleRange(handle, size, cue.position, len.sampleLength)

        const wave = new WaveWriter(meta.fmt, meta.fact, buff).setTag('ICMT', 'This is a test comment.')

        // check snapshot
        const snapshot = await fs.readFile(test_trimmed_wav)
        assert.deepStrictEqual(snapshot, wave.toBuffer())

        await handle.close()
    })
})