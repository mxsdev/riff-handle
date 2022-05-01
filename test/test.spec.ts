import { assert } from 'chai'
import fs from 'fs/promises'
import path from 'path'
import { } from '../src/parseChunk'
import { RIFFReader, getWaveMeta } from '../'
import { test_wave_meta } from './snapshot'

const test_wav = path.join(__dirname, 'files', 'test.wav')

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

        assert.deepStrictEqual(meta['fmt'], test_wave_meta['fmt'])
        assert.deepStrictEqual(meta['cue'], test_wave_meta['cue'])

        // we must skip the second index here since it conains a Buffer

        // @ts-ignore
        assert.deepStrictEqual(meta['adtl'][0], test_wave_meta['adtl'][0])
        // @ts-ignore
        assert.deepStrictEqual(meta['adtl'][2], test_wave_meta['adtl'][2])

        await handle.close()
    })
})