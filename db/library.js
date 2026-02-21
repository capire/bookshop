// ETL for open library: https://openlibrary.org/developers/dumps

const { pipeline } = require('node:stream/promises')
const { createGunzip } = require('node:zlib')

const cds = require('@sap/cds');

(async () => {
  process.env.CDS_TEST_FAKE = 'true'
  await cds.test(cds.utils.path.resolve(__dirname, '..'))
  await cds.deploy(cds.options.from)
})()
  .then(() => Promise.all([
    store('https://openlibrary.org/data/ol_dump_authors_latest.txt.gz', 'Authors'),
    store('https://openlibrary.org/data/ol_dump_works_latest.txt.gz', 'Books'),
  ]))
  .then(() => { // Create foreign key index
    const { Books } = cds.entities
    return cds.run(`CREATE INDEX ${Books}_author ON ${Books}(author_ID)`)
  })
  .then(() => cds.shutdown())

async function store(src, target, maxsize = 1000) {
  let transform
  switch (target) {
    case 'Authors': transform = Authors
      break;
    case 'Books': transform = Books
      break;
    default: cds.error`unknown target: ${target}`
  }
  return pipeline(await open(src), createGunzip(), extract, transform, throughput.bind(target), insert.bind(null, target, maxsize))
}

async function* Authors(data) {
  let errors = 0
  let success = 0
  for await (const row of data) {
    try {
      yield {
        ID: ID(row.key),
        name: row.name.slice(0, 255),
        createdAt: timestamp(row.created),
        modifiedAt: timestamp(row.last_modified),
      }
      success++
    } catch { errors++ }
  }
  console.log(`Transformed ${success} Authors (ignored ${errors})`)
}

async function* Books(data) {
  let errors = 0
  let success = 0
  for await (const row of data) {
    try {
      yield {
        ID: ID(row.key),
        title: row.title.slice(0, 255),
        author_ID: ID(row.authors[0].author.key),
        createdAt: timestamp(row.created),
        modifiedAt: timestamp(row.last_modified),
      }
      success++
    } catch { errors++ }
  }
  console.log(`Transformed ${success} Books (ignored ${errors})`)
}

async function insert(target, maxsize, data) {
  if (typeof maxsize !== 'number') {
    data = maxsize
    maxsize = 1000
  }
  target = cds.model.entities('sap.capire.bookshop')[target]
  let buffer = []
  for await (const row of data) {
    if (buffer.length >= maxsize) {
      await UPSERT(buffer).into(target).then(() => { }, err => console.log('error:', err.message))
      buffer = []
    }
    buffer.push(row)
  }
  if (buffer.length) await UPSERT(buffer).into(target)
}

async function write(target, maxsize, data) {
  if (typeof maxsize !== 'number') {
    data = maxsize
    maxsize = 1024 * 1024 * 100
  }
  const filename = cds.utils.path.resolve(__dirname, 'data', `sap.capire.bookshop-${target}`)
  let file, index = 0, size = 0, sep = ''
  for await (const row of data) {
    if (!file || size > maxsize) {
      if (file) file.end(']')
      file = cds.utils.fs.createWriteStream(`${filename}-${index++}.json`)
      file.write('[')
      size = 1
      sep = ''
    }

    const chunk = JSON.stringify(row)
    size += sep.length + chunk.length

    if (sep) { file.write(sep) } else { sep = ',' }
    file.write(chunk)
  }
  file.end(']')
}

async function* extract(data) {
  for await (const line of split(data)) {
    try { yield JSON.parse(line.split('\t').at(-1)) } catch { }
  }
}

async function* split(stream) {
  let leftover = ''
  for await (const chunk of stream) {
    const split = `${leftover}${chunk}`.split('\n')
    for (const line of split) if (line) yield line
  }
  if (leftover) yield leftover
}

const { stdout } = process
async function throughput_print() {
  const now = Date.now()

  stdout.cursorTo(0, 0)

  const nameSize = Object.keys(throughput.trackedStream).reduce((l, c) => Math.max(l, c.length), 0)
  const width = 35 + nameSize
  const wrap = '\n'.padStart(width, '=')
  stdout.write(wrap)
  for (const name in throughput.trackedStream) {
    const stats = throughput.trackedStream[name]
    if (!stats.start) {
      stdout.write(`${name.padStart(nameSize, ' ')}: waiting...\n`)
      continue
    }
    const format = stats.type === 'objects' ? objects : bytes
    // stdout.write(`${name.padStart(nameSize, ' ')}: ${format(stats.size / ((now - stats.start) / 1000)).padStart(10, ' ')}/sec total: ${format(stats.size).padStart(10, ' ')} (${time(now - stats.start)})\n`)
    stdout.write(`${name.padStart(nameSize, ' ')}: ${stats.size.toLocaleString().padStart(23, ' ')} (${time(now - stats.start)})\n`)
  }
  stdout.write(wrap)
}

function bytes(bytes) {
  let scale = 0
  while (bytes > 1024) {
    bytes /= 1024
    scale++
  }
  const scales = ['  B', 'KiB', 'MiB', 'GiB', 'TiB']
  return `${(bytes >>> 0).toLocaleString()} ${scales[scale]}`
}

function objects(count) {
  let scale = 0
  while (count > 1000) {
    count /= 1000
    scale++
  }
  const scales = ['K  ', 'K  ', 'M  ', 'B  ', 'T  ', 'Q  ', 'P  ']
  return `${(count >>> 0).toLocaleString()} ${scales[scale]}`
}

function time(milliseconds) {
  const scales = ['mil', 'sec', 'min', 'Hur', 'Day', 'Wek', 'Mon', 'Yer']
  const scaleSize = [1000, 60, 60, 24, 7, 29, 256]
  let scale = 0
  while (milliseconds > scaleSize[scale]) {
    milliseconds /= scaleSize[scale]
    scale++
  }
  return `${(milliseconds >>> 0).toLocaleString()} ${scales[scale]}`
}

async function* throughput(name, stream) {
  if (typeof name !== 'string') {
    stream = name
    name = this
  }

  const stats = (throughput.trackedStream ??= {})[name] = { start: undefined, size: 0, type: undefined }
  for await (const chunk of stream) {
    throughput.interval ??= setInterval(throughput_print, stdout.isTTY ? 100 : 10_000)
    stats.start ??= Date.now()
    stats.type ??= typeof (chunk?.bytelength ?? chunk?.length) === 'number' ? 'bytes' : 'objects'
    stats.size += chunk?.bytelength ?? chunk?.length ?? 1
    yield chunk
  }
  delete throughput.trackedStream[name]
  if (!Object.keys(throughput.trackedStream).length) throughput.interval = clearInterval(throughput.interval)
}

async function open(src) {
  const filename = cds.utils.path.resolve(__dirname, 'data', cds.utils.path.basename(src))

  if (!cds.utils.fs.existsSync(filename)) {
    const download = await fetch(src)
    if (download.status > 399) cds.error`Failed to download ${filename} (${download.statusText || download.status})`
    await pipeline(download.body, cds.utils.fs.createWriteStream(filename))
  }

  return cds.utils.fs.createReadStream(filename)
}

function timestamp(val) {
  if (!val) return null
  const value = val.value || val
  return value[value.length - 1] === 'Z' ? value : `${value}Z`
}

function ID(key) {
  return Number.parseInt(/\d+/.exec(key)[0])
}

module.exports = {
  open, extract, write, throughput,
  Authors, Books,
}
