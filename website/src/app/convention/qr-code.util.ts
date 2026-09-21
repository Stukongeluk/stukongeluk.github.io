/**
 * Zero-dependency pure TypeScript QR Code Generator (ISO/IEC 18004).
 * Generates QR code module matrix for attendee ticket passes.
 */

export interface QRCodeMatrix {
  size: number;
  isDark(row: number, col: number): boolean;
  toSvg(options?: { margin?: number; darkColor?: string; lightColor?: string; sizePx?: number }): string;
}

export class SimpleQRCode {
  // Mode indicators
  private static readonly MODE_BYTE = 0x4;

  // Galois Field GF(2^8) with polynomial x^8 + x^4 + x^3 + x^2 + 1 (285)
  private static readonly EXP_TABLE = new Uint8Array(512);
  private static readonly LOG_TABLE = new Uint8Array(256);

  static {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      SimpleQRCode.EXP_TABLE[i] = x;
      SimpleQRCode.LOG_TABLE[x] = i;
      x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
    }
    for (let i = 255; i < 512; i++) {
      SimpleQRCode.EXP_TABLE[i] = SimpleQRCode.EXP_TABLE[i - 255];
    }
  }

  // Version capacities and ECC parameters for Level M (versions 1 to 10)
  // Format: [version, totalCodewords, dataCodewordsM, eccCodewordsM, blocksGroup1, dataPerBlock1, blocksGroup2, dataPerBlock2]
  private static readonly VERSION_TABLE_M: [number, number, number, number, number, number, number, number][] = [
    // Ver, Total, DataCodewords, EccPerBlock, G1Blocks, G1Data, G2Blocks, G2Data
    [1, 26, 16, 10, 1, 16, 0, 0],
    [2, 44, 28, 16, 1, 28, 0, 0],
    [3, 70, 44, 26, 1, 44, 0, 0],
    [4, 100, 64, 18, 2, 32, 0, 0],
    [5, 134, 86, 24, 2, 43, 0, 0],
    [6, 172, 108, 16, 4, 27, 0, 0],
    [7, 196, 124, 18, 4, 31, 0, 0],
    [8, 242, 154, 22, 2, 38, 2, 39],
    [9, 292, 182, 22, 3, 36, 2, 37],
    [10, 346, 216, 26, 4, 40, 1, 41],
  ];

  // Alignment pattern center positions for versions 1 to 10
  private static readonly ALIGNMENT_PATTERN_LOCATIONS: number[][] = [
    [], // v1
    [6, 18], // v2
    [6, 22], // v3
    [6, 26], // v4
    [6, 30], // v5
    [6, 34], // v6
    [6, 22, 38], // v7
    [6, 24, 42], // v8
    [6, 26, 46], // v9
    [6, 28, 50], // v10
  ];

  /**
   * Generates a QR Code matrix from a string.
   */
  public static generate(text: string): QRCodeMatrix {
    const utf8Bytes = new TextEncoder().encode(text);
    const dataLen = utf8Bytes.length;

    // Pick smallest version that fits data
    let chosenVersionConfig: [number, number, number, number, number, number, number, number] | null = null;
    let version = 1;
    for (const row of SimpleQRCode.VERSION_TABLE_M) {
      const ver = row[0];
      const dataCapacity = row[2];
      // Overhead for byte mode: 4 bits mode + (ver < 10 ? 8 bits : 16 bits) length
      const lengthBits = ver < 10 ? 8 : 16;
      const totalHeaderBits = 4 + lengthBits;
      const maxDataBytes = Math.floor((dataCapacity * 8 - totalHeaderBits) / 8);
      if (dataLen <= maxDataBytes) {
        chosenVersionConfig = row;
        version = ver;
        break;
      }
    }

    if (!chosenVersionConfig) {
      // Fallback: truncate or use version 10
      chosenVersionConfig = SimpleQRCode.VERSION_TABLE_M[SimpleQRCode.VERSION_TABLE_M.length - 1];
      version = 10;
    }

    const [, totalCodewords, dataCodewords, eccPerBlock, g1Blocks, g1Data, g2Blocks, g2Data] = chosenVersionConfig;

    // Encode bitstream
    const bits: number[] = [];
    const addBits = (val: number, len: number) => {
      for (let i = len - 1; i >= 0; i--) {
        bits.push((val >> i) & 1);
      }
    };

    // Mode: Byte (0100)
    addBits(SimpleQRCode.MODE_BYTE, 4);

    // Character count indicator
    const charCountBits = version < 10 ? 8 : 16;
    addBits(Math.min(dataLen, (1 << charCountBits) - 1), charCountBits);

    // Data bytes
    for (let i = 0; i < dataLen; i++) {
      addBits(utf8Bytes[i], 8);
    }

    // Terminator: up to 4 zero bits
    const totalDataBits = dataCodewords * 8;
    const remainingBits = totalDataBits - bits.length;
    const termBits = Math.min(4, Math.max(0, remainingBits));
    addBits(0, termBits);

    // Pad to byte boundary
    while (bits.length % 8 !== 0) {
      bits.push(0);
    }

    // Pad bytes alternating 0xEC (236) and 0x11 (17)
    const padBytes = [0xec, 0x11];
    let padIndex = 0;
    while (bits.length < totalDataBits) {
      addBits(padBytes[padIndex % 2], 8);
      padIndex++;
    }

    // Convert bits to data codewords array
    const dataBytes: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) {
        b = (b << 1) | bits[i + j];
      }
      dataBytes.push(b);
    }

    // Split data into blocks and generate Reed-Solomon ECC codewords
    const totalBlocks = g1Blocks + g2Blocks;
    const dataBlocks: number[][] = [];
    const eccBlocks: number[][] = [];
    let dataOffset = 0;

    for (let b = 0; b < totalBlocks; b++) {
      const blockSize = b < g1Blocks ? g1Data : g2Data;
      const blockData = dataBytes.slice(dataOffset, dataOffset + blockSize);
      dataOffset += blockSize;
      dataBlocks.push(blockData);

      // Calculate ECC for block
      const ecc = SimpleQRCode.calculateReedSolomon(blockData, eccPerBlock);
      eccBlocks.push(ecc);
    }

    // Interleave data codewords
    const finalCodewords: number[] = [];
    const maxDataBlockLen = Math.max(g1Data, g2Data);
    for (let i = 0; i < maxDataBlockLen; i++) {
      for (let b = 0; b < totalBlocks; b++) {
        if (i < dataBlocks[b].length) {
          finalCodewords.push(dataBlocks[b][i]);
        }
      }
    }

    // Interleave ECC codewords
    for (let i = 0; i < eccPerBlock; i++) {
      for (let b = 0; b < totalBlocks; b++) {
        if (i < eccBlocks[b].length) {
          finalCodewords.push(eccBlocks[b][i]);
        }
      }
    }

    // Construct QR Matrix
    const matrixSize = version * 4 + 17;
    const matrix: (boolean | null)[][] = Array.from({ length: matrixSize }, () =>
      Array.from({ length: matrixSize }, () => null)
    );
    const isFunction: boolean[][] = Array.from({ length: matrixSize }, () =>
      Array.from({ length: matrixSize }, () => false)
    );

    // Place function patterns
    SimpleQRCode.placeFinderPatterns(matrix, isFunction, matrixSize);
    SimpleQRCode.placeAlignmentPatterns(matrix, isFunction, version);
    SimpleQRCode.placeTimingPatterns(matrix, isFunction, matrixSize);
    SimpleQRCode.placeDarkModuleAndFormatReserved(matrix, isFunction, version, matrixSize);

    // Place data and apply best mask
    const finalMatrix = SimpleQRCode.placeDataAndMask(matrix, isFunction, finalCodewords, matrixSize);

    return {
      size: matrixSize,
      isDark(row: number, col: number): boolean {
        return !!finalMatrix[row]?.[col];
      },
      toSvg(options = {}): string {
        const margin = options.margin ?? 2;
        const darkColor = options.darkColor ?? '#052b31';
        const lightColor = options.lightColor ?? '#ffffff';
        const totalSize = matrixSize + margin * 2;
        const sizePx = options.sizePx ?? 240;

        let rects = '';
        for (let r = 0; r < matrixSize; r++) {
          for (let c = 0; c < matrixSize; c++) {
            if (finalMatrix[r][c]) {
              rects += `<rect x="${c + margin}" y="${r + margin}" width="1" height="1" fill="${darkColor}"/>`;
            }
          }
        }

        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${sizePx}" height="${sizePx}" shape-rendering="crispEdges">
            <rect width="${totalSize}" height="${totalSize}" fill="${lightColor}" rx="${margin > 0 ? 1 : 0}"/>
            ${rects}
          </svg>
        `.trim();
      }
    };
  }

  private static calculateReedSolomon(data: number[], eccCount: number): number[] {
    // Generate generator polynomial
    let generator = [1];
    for (let i = 0; i < eccCount; i++) {
      const factor = [1, SimpleQRCode.EXP_TABLE[i]];
      const nextGen = new Array(generator.length + 1).fill(0);
      for (let j = 0; j < generator.length; j++) {
        for (let k = 0; k < factor.length; k++) {
          nextGen[j + k] ^= SimpleQRCode.gMultiply(generator[j], factor[k]);
        }
      }
      generator = nextGen;
    }

    // Polynomial division
    const msg = [...data, ...new Array(eccCount).fill(0)];
    for (let i = 0; i < data.length; i++) {
      const coef = msg[i];
      if (coef !== 0) {
        for (let j = 0; j < generator.length; j++) {
          msg[i + j] ^= SimpleQRCode.gMultiply(generator[j], coef);
        }
      }
    }

    return msg.slice(data.length);
  }

  private static gMultiply(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return SimpleQRCode.EXP_TABLE[(SimpleQRCode.LOG_TABLE[a] + SimpleQRCode.LOG_TABLE[b]) % 255];
  }

  private static placeFinderPatterns(matrix: (boolean | null)[][], isFunction: boolean[][], size: number): void {
    const positions = [
      [0, 0],
      [size - 7, 0],
      [0, size - 7],
    ];

    for (const [row, col] of positions) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isEdge = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[row + r][col + c] = isEdge || isCenter;
          isFunction[row + r][col + c] = true;
        }
      }

      // Separators
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const mr = row + r;
          const mc = col + c;
          if (mr >= 0 && mr < size && mc >= 0 && mc < size && (r === -1 || r === 7 || c === -1 || c === 7)) {
            matrix[mr][mc] = false;
            isFunction[mr][mc] = true;
          }
        }
      }
    }
  }

  private static placeAlignmentPatterns(matrix: (boolean | null)[][], isFunction: boolean[][], version: number): void {
    const coords = SimpleQRCode.ALIGNMENT_PATTERN_LOCATIONS[version - 1];
    if (!coords || coords.length === 0) return;

    for (const r of coords) {
      for (const c of coords) {
        // Skip if overlaps finder pattern
        if (isFunction[r][c]) continue;

        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
            const isDot = dr === 0 && dc === 0;
            matrix[r + dr][c + dc] = isBorder || isDot;
            isFunction[r + dr][c + dc] = true;
          }
        }
      }
    }
  }

  private static placeTimingPatterns(matrix: (boolean | null)[][], isFunction: boolean[][], size: number): void {
    for (let i = 8; i < size - 8; i++) {
      if (!isFunction[6][i]) {
        matrix[6][i] = i % 2 === 0;
        isFunction[6][i] = true;
      }
      if (!isFunction[i][6]) {
        matrix[i][6] = i % 2 === 0;
        isFunction[i][6] = true;
      }
    }
  }

  private static placeDarkModuleAndFormatReserved(
    matrix: (boolean | null)[][],
    isFunction: boolean[][],
    version: number,
    size: number
  ): void {
    // Dark module at (4*version + 9, 8)
    const darkRow = 4 * version + 9;
    matrix[darkRow][8] = true;
    isFunction[darkRow][8] = true;

    // Reserve format info areas around finder patterns
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        isFunction[8][i] = true;
        isFunction[i][8] = true;
      }
    }
    for (let i = size - 8; i < size; i++) {
      isFunction[8][i] = true;
      isFunction[i][8] = true;
    }
  }

  private static placeDataAndMask(
    matrix: (boolean | null)[][],
    isFunction: boolean[][],
    codewords: number[],
    size: number
  ): boolean[][] {
    // Flatten codewords to bits
    const dataBits: boolean[] = [];
    for (const byte of codewords) {
      for (let i = 7; i >= 0; i--) {
        dataBits.push(((byte >> i) & 1) === 1);
      }
    }

    // Select mask pattern 0: (row + col) % 2 === 0
    // ECC Level M (00) with Mask 000 -> Format bits: 101010000010010
    const formatBits = [true, false, true, false, true, false, false, false, false, false, true, false, false, true, false];

    // Create working matrix copy
    const working: boolean[][] = matrix.map((row) => row.map((cell) => (cell === null ? false : cell)));

    // Fill data bits in zigzag pattern from right to left
    let bitIndex = 0;
    let upwards = true;

    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--; // Skip vertical timing column

      const rowIndices = upwards
        ? Array.from({ length: size }, (_, i) => size - 1 - i)
        : Array.from({ length: size }, (_, i) => i);

      for (const row of rowIndices) {
        for (const c of [col, col - 1]) {
          if (!isFunction[row][c]) {
            let bit = bitIndex < dataBits.length ? dataBits[bitIndex++] : false;
            // Apply mask 0: (row + col) % 2 === 0
            if ((row + c) % 2 === 0) {
              bit = !bit;
            }
            working[row][c] = bit;
          }
        }
      }
      upwards = !upwards;
    }

    // Apply format bits
    // Format bits around top-left finder
    for (let i = 0; i <= 5; i++) {
      working[8][i] = formatBits[i];
    }
    working[8][7] = formatBits[6];
    working[8][8] = formatBits[7];
    working[7][8] = formatBits[8];
    for (let i = 9; i <= 14; i++) {
      working[14 - i][8] = formatBits[i];
    }

    // Format bits around bottom-left & top-right finders
    for (let i = 0; i <= 7; i++) {
      working[size - 1 - i][8] = formatBits[i];
    }
    for (let i = 8; i <= 14; i++) {
      working[8][size - 15 + i] = formatBits[i];
    }

    return working;
  }
}
