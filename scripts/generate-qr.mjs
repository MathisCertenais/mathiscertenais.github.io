#!/usr/bin/env node
/**
 * Generates the self-hosted QR code asset served from this site.
 *
 * Everything happens locally: the encoder below implements ISO/IEC 18004 byte
 * mode directly, so no target URL is ever handed to a third-party QR service and
 * no third-party script is loaded by the page that displays the result. The
 * rendered asset is a plain SVG committed under `public/`, which means visitors
 * only ever talk to this origin to fetch it.
 *
 * Usage:
 *   node scripts/generate-qr.mjs [target-url] [--ecc L|M|Q|H] [--version N] [--out path]
 *
 * Defaults to https://mathiscertenais.com at error-correction level M, writing
 * public/images/mathis/qr/<host>.svg.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

/* -------------------------------------------------------------------------- */
/* Symbol tables                                                              */
/* -------------------------------------------------------------------------- */

/** ISO/IEC 18004 table 25: the two-bit error-correction indicator per level. */
const ECC_FORMAT_BITS = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 }

/** Total codewords per symbol version (ISO/IEC 18004 table 1). */
const TOTAL_CODEWORDS = {
  1: 26,
  2: 44,
  3: 70,
  4: 100,
  5: 134,
  6: 172,
  7: 196,
  8: 242,
  9: 292,
  10: 346,
}

/**
 * Block layout per version and level. Each entry lists the error-correction
 * codewords per block followed by the block count and data-codeword length of
 * group 1 and group 2 (ISO/IEC 18004 table 9). Versions 1 to 10 cover every URL
 * length this site needs; extend the table before encoding longer payloads.
 */
const ECC_BLOCKS = {
  1: { L: [7, 1, 19, 0, 0], M: [10, 1, 16, 0, 0], Q: [13, 1, 13, 0, 0], H: [17, 1, 9, 0, 0] },
  2: { L: [10, 1, 34, 0, 0], M: [16, 1, 28, 0, 0], Q: [22, 1, 22, 0, 0], H: [28, 1, 16, 0, 0] },
  3: { L: [15, 1, 55, 0, 0], M: [26, 1, 44, 0, 0], Q: [18, 2, 17, 0, 0], H: [22, 2, 13, 0, 0] },
  4: { L: [20, 1, 80, 0, 0], M: [18, 2, 32, 0, 0], Q: [26, 2, 24, 0, 0], H: [16, 4, 9, 0, 0] },
  5: {
    L: [26, 1, 108, 0, 0],
    M: [24, 2, 43, 0, 0],
    Q: [18, 2, 15, 2, 16],
    H: [22, 2, 11, 2, 12],
  },
  6: {
    L: [18, 2, 68, 0, 0],
    M: [16, 4, 27, 0, 0],
    Q: [24, 4, 19, 0, 0],
    H: [28, 4, 15, 0, 0],
  },
  7: {
    L: [20, 2, 78, 0, 0],
    M: [18, 4, 31, 0, 0],
    Q: [18, 2, 14, 4, 15],
    H: [26, 4, 13, 1, 14],
  },
  8: {
    L: [24, 2, 97, 0, 0],
    M: [22, 2, 38, 2, 39],
    Q: [22, 4, 18, 2, 19],
    H: [26, 4, 14, 2, 15],
  },
  9: {
    L: [30, 2, 116, 0, 0],
    M: [22, 3, 36, 2, 37],
    Q: [20, 4, 16, 4, 17],
    H: [24, 4, 12, 4, 13],
  },
  10: {
    L: [18, 2, 68, 2, 69],
    M: [26, 4, 43, 1, 44],
    Q: [24, 6, 19, 2, 20],
    H: [28, 6, 15, 2, 16],
  },
}

/** Alignment pattern centre coordinates per version (ISO/IEC 18004 annex E). */
const ALIGNMENT_CENTRES = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
}

export const ECC_LEVELS = Object.keys(ECC_FORMAT_BITS)

/* -------------------------------------------------------------------------- */
/* Table self-checks                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The tables above are transcribed by hand, so prove what can be proven: every
 * block layout must account for exactly the codewords the version provides.
 * A mistyped row fails loudly here instead of producing an unscannable symbol.
 */
for (const [version, levels] of Object.entries(ECC_BLOCKS)) {
  const total = TOTAL_CODEWORDS[version]
  for (const level of ECC_LEVELS) {
    const [ecPerBlock, group1, data1, group2, data2] = levels[level]
    const codewords = ecPerBlock * (group1 + group2) + group1 * data1 + group2 * data2
    if (codewords !== total) {
      throw new Error(
        `Version ${version}-${level} describes ${codewords} codewords but the version holds ${total}.`,
      )
    }
  }
  if (Number(version) > 1) {
    const centres = ALIGNMENT_CENTRES[version]
    const symbolSize = Number(version) * 4 + 17
    if (!centres || centres[0] !== 6 || centres.at(-1) !== symbolSize - 7) {
      throw new Error(`Version ${version} has an inconsistent alignment pattern row.`)
    }
  }
}

/* -------------------------------------------------------------------------- */
/* GF(256) arithmetic and Reed-Solomon error correction                       */
/* -------------------------------------------------------------------------- */

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
{
  let value = 1
  for (let index = 0; index < 255; index++) {
    GF_EXP[index] = value
    GF_LOG[value] = index
    value = (value << 1) ^ (value & 0x80 ? 0x11d : 0)
  }
  for (let index = 255; index < 512; index++) GF_EXP[index] = GF_EXP[index - 255]
}

function gfMultiply(left, right) {
  if (left === 0 || right === 0) return 0
  return GF_EXP[GF_LOG[left] + GF_LOG[right]]
}

const generatorCache = new Map()

/** Generator polynomial of the given degree, most significant coefficient first. */
function generatorPolynomial(degree) {
  const cached = generatorCache.get(degree)
  if (cached) return cached

  let polynomial = [1]
  for (let index = 0; index < degree; index++) {
    const root = GF_EXP[index]
    const next = new Array(polynomial.length + 1).fill(0)
    for (let term = 0; term < polynomial.length; term++) {
      next[term] ^= polynomial[term]
      next[term + 1] ^= gfMultiply(polynomial[term], root)
    }
    polynomial = next
  }

  generatorCache.set(degree, polynomial)
  return polynomial
}

/** Reed-Solomon check codewords for one block of data codewords. */
function errorCorrectionCodewords(dataCodewords, count) {
  const generator = generatorPolynomial(count)
  const remainder = new Uint8Array(count)

  for (const codeword of dataCodewords) {
    const factor = codeword ^ remainder[0]
    remainder.copyWithin(0, 1)
    remainder[count - 1] = 0
    if (factor === 0) continue
    for (let index = 0; index < count; index++) {
      remainder[index] ^= gfMultiply(generator[index + 1], factor)
    }
  }

  return remainder
}

/* -------------------------------------------------------------------------- */
/* Codeword assembly                                                          */
/* -------------------------------------------------------------------------- */

function dataCodewordCount(version, level) {
  const [, group1, data1, group2, data2] = ECC_BLOCKS[version][level]
  return group1 * data1 + group2 * data2
}

function countIndicatorBits(version) {
  return version < 10 ? 8 : 16
}

/** Bytes of text a version and level can hold in byte mode. */
export function byteCapacity(version, level) {
  const bits = dataCodewordCount(version, level) * 8 - 4 - countIndicatorBits(version)
  return Math.floor(bits / 8)
}

function pushBits(bits, value, length) {
  for (let shift = length - 1; shift >= 0; shift--) bits.push((value >>> shift) & 1)
}

function encodeDataCodewords(bytes, version, level) {
  const capacity = dataCodewordCount(version, level)
  const capacityBits = capacity * 8
  const bits = []

  pushBits(bits, 0b0100, 4) // byte mode
  pushBits(bits, bytes.length, countIndicatorBits(version))
  for (const byte of bytes) pushBits(bits, byte, 8)

  if (bits.length > capacityBits) {
    throw new RangeError(`${bytes.length} bytes do not fit version ${version}-${level}.`)
  }

  pushBits(bits, 0, Math.min(4, capacityBits - bits.length)) // terminator
  while (bits.length % 8 !== 0) bits.push(0)

  const codewords = []
  for (let index = 0; index < bits.length; index += 8) {
    codewords.push(Number.parseInt(bits.slice(index, index + 8).join(''), 2))
  }

  for (let pad = 0; codewords.length < capacity; pad++) codewords.push(pad % 2 === 0 ? 0xec : 0x11)

  return codewords
}

/** Split into blocks, append error correction, then interleave per the spec. */
function interleaveCodewords(dataCodewords, version, level) {
  const [ecPerBlock, group1, data1, group2, data2] = ECC_BLOCKS[version][level]
  const blocks = []
  let offset = 0

  for (let index = 0; index < group1 + group2; index++) {
    const length = index < group1 ? data1 : data2
    blocks.push(dataCodewords.slice(offset, offset + length))
    offset += length
  }

  const corrections = blocks.map((block) => errorCorrectionCodewords(block, ecPerBlock))
  const result = []
  const longest = Math.max(...blocks.map((block) => block.length))

  for (let index = 0; index < longest; index++) {
    for (const block of blocks) if (index < block.length) result.push(block[index])
  }
  for (let index = 0; index < ecPerBlock; index++) {
    for (const block of corrections) result.push(block[index])
  }

  return result
}

/* -------------------------------------------------------------------------- */
/* Symbol construction                                                        */
/* -------------------------------------------------------------------------- */

function maskBit(mask, row, column) {
  switch (mask) {
    case 0:
      return (row + column) % 2 === 0
    case 1:
      return row % 2 === 0
    case 2:
      return column % 3 === 0
    case 3:
      return (row + column) % 3 === 0
    case 4:
      return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0
    case 5:
      return ((row * column) % 2) + ((row * column) % 3) === 0
    case 6:
      return (((row * column) % 2) + ((row * column) % 3)) % 2 === 0
    default:
      return (((row + column) % 2) + ((row * column) % 3)) % 2 === 0
  }
}

/** 15-bit error-corrected format information for a level and mask. */
function formatInformation(level, mask) {
  const data = (ECC_FORMAT_BITS[level] << 3) | mask
  let remainder = data
  for (let index = 0; index < 10; index++) {
    remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537)
  }
  return ((data << 10) | remainder) ^ 0x5412
}

/** 18-bit error-corrected version information (version 7 and above only). */
function versionInformation(version) {
  let remainder = version
  for (let index = 0; index < 12; index++) {
    remainder = (remainder << 1) ^ ((remainder >>> 11) * 0x1f25)
  }
  return (version << 12) | remainder
}

function createGrid(size, fill) {
  return Array.from({ length: size }, () => new Array(size).fill(fill))
}

function drawFunctionModules(version) {
  const size = version * 4 + 17
  const dark = createGrid(size, 0)
  const reserved = createGrid(size, false)

  const set = (row, column, isDark = false) => {
    dark[row][column] = isDark ? 1 : 0
    reserved[row][column] = true
  }

  // Finder patterns with their separating quiet ring.
  for (const [originRow, originColumn] of [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ]) {
    for (let row = -1; row <= 7; row++) {
      for (let column = -1; column <= 7; column++) {
        const targetRow = originRow + row
        const targetColumn = originColumn + column
        if (targetRow < 0 || targetColumn < 0 || targetRow >= size || targetColumn >= size) continue
        const inRing = row === 0 || row === 6 || column === 0 || column === 6
        const inCore = row >= 2 && row <= 4 && column >= 2 && column <= 4
        const inBody = row >= 0 && row <= 6 && column >= 0 && column <= 6
        set(targetRow, targetColumn, inBody && (inRing || inCore))
      }
    }
  }

  // Timing patterns.
  for (let index = 8; index < size - 8; index++) {
    set(6, index, index % 2 === 0)
    set(index, 6, index % 2 === 0)
  }

  // Alignment patterns, skipping the three that would fall inside a finder
  // pattern. They are drawn after the timing patterns because the ones sharing
  // row 6 or column 6 legitimately interrupt it.
  const centres = ALIGNMENT_CENTRES[version] ?? []
  for (const row of centres) {
    for (const column of centres) {
      const overlapsFinder =
        (row <= 8 && column <= 8) ||
        (row <= 8 && column >= size - 9) ||
        (row >= size - 9 && column <= 8)
      if (overlapsFinder) continue
      for (let offsetRow = -2; offsetRow <= 2; offsetRow++) {
        for (let offsetColumn = -2; offsetColumn <= 2; offsetColumn++) {
          const edge = Math.max(Math.abs(offsetRow), Math.abs(offsetColumn))
          set(row + offsetRow, column + offsetColumn, edge !== 1)
        }
      }
    }
  }

  // Format information areas, left blank until the mask is chosen. Row 6 and
  // column 6 belong to the timing patterns and are not part of those strips.
  for (let index = 0; index <= 8; index++) {
    if (index === 6) continue
    if (!reserved[index][8]) set(index, 8)
    if (!reserved[8][index]) set(8, index)
  }
  for (let index = 0; index < 8; index++) {
    if (!reserved[8][size - 1 - index]) set(8, size - 1 - index)
    if (!reserved[size - 1 - index][8]) set(size - 1 - index, 8)
  }

  // The module that is dark by definition.
  set(size - 8, 8, true)

  // Version information areas for version 7 and above.
  if (version >= 7) {
    const bits = versionInformation(version)
    for (let index = 0; index < 18; index++) {
      const bit = (bits >>> index) & 1
      const outer = size - 11 + (index % 3)
      const inner = Math.floor(index / 3)
      set(inner, outer, bit === 1)
      set(outer, inner, bit === 1)
    }
  }

  return { dark, reserved, size }
}

function placeCodewords(dark, reserved, size, codewordBits) {
  let index = 0
  let upward = true

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5 // the vertical timing pattern column is skipped
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step
      for (let offset = 0; offset < 2; offset++) {
        const column = right - offset
        if (reserved[row][column]) continue
        dark[row][column] = index < codewordBits.length ? codewordBits[index] : 0
        index++
      }
    }
    upward = !upward
  }

  const placed = size * size - reserved.flat().filter(Boolean).length
  if (index !== placed) {
    throw new Error(`Placed ${index} data modules into ${placed} free modules.`)
  }
}

function writeFormatInformation(dark, reserved, size, level, mask) {
  const bits = formatInformation(level, mask)
  const bit = (index) => (bits >>> index) & 1

  const set = (row, column, value) => {
    dark[row][column] = value
    reserved[row][column] = true
  }

  for (let index = 0; index <= 5; index++) set(index, 8, bit(index))
  set(7, 8, bit(6))
  set(8, 8, bit(7))
  set(8, 7, bit(8))
  for (let index = 9; index < 15; index++) set(8, 14 - index, bit(index))
  for (let index = 0; index < 8; index++) set(8, size - 1 - index, bit(index))
  for (let index = 8; index < 15; index++) set(size - 15 + index, 8, bit(index))
  set(size - 8, 8, 1)
}

/** Mask penalty rules N1 to N4 from ISO/IEC 18004 section 8.8.2. */
function penaltyScore(dark) {
  const size = dark.length
  const finderPatterns = [0b10111010000, 0b00001011101]
  let score = 0

  const scoreLine = (read) => {
    let runLength = 1
    for (let index = 1; index < size; index++) {
      if (read(index) === read(index - 1)) {
        runLength++
        continue
      }
      if (runLength >= 5) score += 3 + (runLength - 5)
      runLength = 1
    }
    if (runLength >= 5) score += 3 + (runLength - 5)

    for (let start = 0; start + 11 <= size; start++) {
      let window = 0
      for (let offset = 0; offset < 11; offset++) window = (window << 1) | read(start + offset)
      if (finderPatterns.includes(window)) score += 40
    }
  }

  for (let row = 0; row < size; row++) scoreLine((column) => dark[row][column])
  for (let column = 0; column < size; column++) scoreLine((row) => dark[row][column])

  for (let row = 0; row < size - 1; row++) {
    for (let column = 0; column < size - 1; column++) {
      const value = dark[row][column]
      if (
        value === dark[row][column + 1] &&
        value === dark[row + 1][column] &&
        value === dark[row + 1][column + 1]
      ) {
        score += 3
      }
    }
  }

  let darkCount = 0
  for (const row of dark) for (const value of row) darkCount += value
  const total = size * size
  const deviation = Math.abs(darkCount * 20 - total * 10) / total
  score += Math.floor(deviation) * 10

  return score
}

/**
 * Encodes text as a QR matrix of 0 (light) and 1 (dark) modules.
 *
 * Byte mode is used for every payload, which keeps the encoder honest for URLs
 * and UTF-8 text alike. The version is the smallest one that fits unless an
 * explicit version is requested.
 */
export function createQrMatrix(text, { ecc = 'M', mask: forcedMask, version: forcedVersion } = {}) {
  const level = String(ecc).toUpperCase()
  if (!ECC_LEVELS.includes(level)) {
    throw new RangeError(`Unknown error-correction level: ${ecc}. Use one of ${ECC_LEVELS.join(', ')}.`)
  }

  const bytes = [...new TextEncoder().encode(text)]
  const versions = Object.keys(ECC_BLOCKS).map(Number)
  const version =
    forcedVersion ??
    versions.find((candidate) => bytes.length <= byteCapacity(candidate, level))

  if (version === undefined) {
    const largest = versions.at(-1)
    throw new RangeError(
      `${bytes.length} bytes exceed the ${byteCapacity(largest, level)} bytes version ${largest}-${level} holds.`,
    )
  }
  if (!versions.includes(version)) throw new RangeError(`Unsupported version: ${version}.`)

  const { dark, reserved, size } = drawFunctionModules(version)
  const codewords = interleaveCodewords(encodeDataCodewords(bytes, version, level), version, level)
  const bits = []
  for (const codeword of codewords) pushBits(bits, codeword, 8)

  placeCodewords(dark, reserved, size, bits)

  let best
  for (const candidate of forcedMask === undefined ? [0, 1, 2, 3, 4, 5, 6, 7] : [forcedMask]) {
    const candidateDark = dark.map((row) => row.slice())
    const candidateReserved = reserved.map((row) => row.slice())
    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        if (candidateReserved[row][column]) continue
        if (maskBit(candidate, row, column)) candidateDark[row][column] ^= 1
      }
    }
    writeFormatInformation(candidateDark, candidateReserved, size, level, candidate)

    const score = penaltyScore(candidateDark)
    if (!best || score < best.score) best = { matrix: candidateDark, mask: candidate, score, version }
  }

  return best
}

/* -------------------------------------------------------------------------- */
/* SVG rendering                                                              */
/* -------------------------------------------------------------------------- */

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * Renders a module matrix as a standalone SVG: vector, quiet zone included, and
 * with an opaque light background so the asset keeps its contrast wherever it is
 * pasted, downloaded, or printed.
 */
export function renderQrSvg(matrix, { dark = '#1c1c1a', light = '#ffffff', label, quietZone = 4, size = 1024 } = {}) {
  const modules = matrix.length
  const extent = modules + quietZone * 2
  const runs = []

  for (let row = 0; row < modules; row++) {
    let column = 0
    while (column < modules) {
      if (!matrix[row][column]) {
        column++
        continue
      }
      let length = 1
      while (column + length < modules && matrix[row][column + length]) length++
      runs.push(`M${column + quietZone} ${row + quietZone}h${length}v1h-${length}z`)
      column += length
    }
  }

  const title = escapeXml(label || 'QR code')

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${extent} ${extent}" role="img" aria-labelledby="qr-title">`,
    `  <title id="qr-title">${title}</title>`,
    `  <rect width="${extent}" height="${extent}" fill="${light}" />`,
    `  <path fill="${dark}" d="${runs.join('')}" />`,
    '</svg>',
    '',
  ].join('\n')
}

/* -------------------------------------------------------------------------- */
/* Command line                                                               */
/* -------------------------------------------------------------------------- */

function defaultOutputPath(host) {
  const slug = host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return join(projectRoot, 'public', 'images', 'mathis', 'qr', `${slug}.svg`)
}

const USAGE = `Usage: node scripts/generate-qr.mjs [target-url] [options]

Arguments:
  target-url          Absolute https URL to encode (default https://mathiscertenais.com)

Options:
  --ecc <L|M|Q|H>     Error-correction level (default M)
  --version <1-10>    Force a symbol version instead of the smallest that fits
  --out <path>        Write somewhere other than public/images/mathis/qr/<host>.svg
  --help              Show this message`

async function main() {
  const args = process.argv.slice(2)
  const options = { ecc: 'M' }
  const positional = []

  for (let index = 0; index < args.length; index++) {
    const flag = args[index]
    if (flag === '--help' || flag === '-h') {
      console.log(USAGE)
      return
    }
    if (flag === '--ecc' || flag === '--version' || flag === '--out') {
      const value = args[++index]
      if (value === undefined) throw new TypeError(`${flag} needs a value.`)
      options[flag.slice(2)] = value
    } else if (flag.startsWith('--')) {
      throw new TypeError(`Unknown option: ${flag}`)
    } else {
      positional.push(flag)
    }
  }

  // Encode the URL exactly as requested rather than the normalised form, so the
  // symbol carries the shortest honest payload. `new URL` is only a validity gate.
  const target = (positional[0] || 'https://mathiscertenais.com').trim()
  let url
  try {
    url = new URL(target)
  } catch {
    throw new TypeError(`Target must be an absolute URL: ${target}`)
  }
  if (url.protocol !== 'https:') throw new TypeError(`Target must use https: ${target}`)

  const { matrix, mask, score, version } = createQrMatrix(target, {
    ecc: options.ecc,
    version: options.version ? Number(options.version) : undefined,
  })
  const svg = renderQrSvg(matrix, {
    label: `QR code linking to ${target}`,
  })
  const destination = options.out ? join(projectRoot, options.out) : defaultOutputPath(url.host)

  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, svg, 'utf8')

  console.log(
    `Wrote ${relative(projectRoot, destination)} — version ${version} (${matrix.length}×${matrix.length} modules), level ${options.ecc.toUpperCase()}, mask ${mask} (penalty ${score}), payload ${target}`,
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    console.error(`\n${USAGE}`)
    process.exitCode = 1
  }
}
