export const test_wave_meta = {
    fmt: {
      formatTag: 3,
      channels: 2,
      samplesPerSec: 44100,
      avgBytesPerSec: 352800,
      blockAlign: 2097160,
      bitsPerSample: undefined
    },
    cue: [
      {
        id: 1,
        position: 3705,
        chunk: 'data',
        chunkStart: 0,
        blockStart: 0,
        sampleOffset: 3705
      },
      {
        id: 2,
        position: 10893,
        chunk: 'data',
        chunkStart: 0,
        blockStart: 0,
        sampleOffset: 10893
      }
    ],
    adtl: [
      { type: 'labl', id: 1, data: 'region' },
      {
        type: 'ltxt',
        id: 1,
        sampleLength: 3824,
        purpose: 1952540002,
        country: 0,
        language: 0,
        dialect: 0,
        codePage: 0,
        // data: <Buffer >
      },
      { type: 'labl', id: 2, data: 'marker' }
    ],
    info: { ICMT: 'Recorded on 29-4-22 in Edison.', ISFT: 'Edison' },
    fact: { numSamples: 19054 }
  }