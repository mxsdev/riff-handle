# riff-handle

A parser for the [RIFF specification][riff].

Instead of parsing the whole file at once, it reads from a file handle. This allows for the determination of, for example, meta information about an audio file without having to load any sample data into memory.

For an example use-case, check out [ponychopper][ponychopper].

[riff]: https://www.aelius.com/njh/wavemetatools/doc/riffmci.pdf
[ponychopper]: https://github.com/mxsdev/ponychopper

## Usage

### `getWaveMeta`

Returns a `WaveMeta` object, which contains info about sample length, duration, cue points, etc.

```typescript
import fs from "fs/promises"

const handle = await.open(...)

try {
    const size = (await handle.stat()).size

    const meta = await getWaveMeta(handle, size)
} catch(e) {
    console.error(e)
} finally {
    await handle.close()
}
```

### `getWaveSampleRange`

Allows to get a specific range of samples from a `wav` file. For example usage, see the [tests](test/test.spec.ts).

### `RIFFReader`

The `RIFFReader` class allows you to collect meta and read data chunks from a generic RIFF-formatted file.

Here's a basic usage to obtain meta:

```typescript
import fs from "fs/promises"

const handle = await fs.open(...)

try {
    const size = (await handle.stat()).size

    const reader = new RIFFReader(handle, size)

    // file_type: WAVE
    // file_size: 152948
    const { file_size, file_type } = await reader.init()
} catch(e) {
    console.error(e)
} finally {
    await handle.close()
}
```

Here, the `init` function reads the meta block and sets up the reader to read more chunks. Checkout [the implementation of `getWaveMeta`](src/metadata.ts) for an example usage.

### The `BufferHandle` type

The exposed API accepts a `BufferHandle` type, which is an abstraction of Node.js' `fs.FileHandle`. This is to allow maximum use-cases (such as any generic buffer). It is implemented as follows:

```typescript
 export interface BufferHandle {
    read(buffer: Buffer, offset?: number | null, length?: number | null, position?: number | null): Promise<{bytesRead: number}>;
}
```