/**
 * Lightweight in-browser zero-dependency ZIP archive generator
 * Builds a standard valid PKZIP archive from a list of files.
 */

interface ZipFileEntry {
  name: string;
  content: string;
}

export function createZipArchive(files: ZipFileEntry[]): Blob {
  const fileRecords: Uint8Array[] = [];
  const centralDirRecords: Uint8Array[] = [];
  let offset = 0;

  const encoder = new TextEncoder();

  // Simple CRC32 implementation
  const crcTable: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  for (const file of files) {
    const fileNameBytes = encoder.encode(file.name);
    const fileDataBytes = encoder.encode(file.content);
    const crc = crc32(fileDataBytes);
    const uncompressedSize = fileDataBytes.length;
    const compressedSize = uncompressedSize; // store uncompressed (method 0)

    // Local file header: 30 bytes + name + data
    const localHeader = new Uint8Array(30 + fileNameBytes.length + fileDataBytes.length);
    const view = new DataView(localHeader.buffer);

    // Signature 0x04034b50
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true); // version needed
    view.setUint16(6, 0, true); // general flag
    view.setUint16(8, 0, true); // compression method (0 = store)
    view.setUint16(10, 0, true); // time
    view.setUint16(12, 0, true); // date
    view.setUint32(14, crc, true); // crc32
    view.setUint32(18, compressedSize, true); // compressed size
    view.setUint32(22, uncompressedSize, true); // uncompressed size
    view.setUint16(26, fileNameBytes.length, true); // name length
    view.setUint16(28, 0, true); // extra field length

    localHeader.set(fileNameBytes, 30);
    localHeader.set(fileDataBytes, 30 + fileNameBytes.length);

    fileRecords.push(localHeader);

    // Central directory header: 46 bytes + name
    const cdHeader = new Uint8Array(46 + fileNameBytes.length);
    const cdView = new DataView(cdHeader.buffer);

    // Signature 0x02014b50
    cdView.setUint32(0, 0x02014b50, true);
    cdView.setUint16(4, 20, true); // version made by
    cdView.setUint16(6, 20, true); // version needed
    cdView.setUint16(8, 0, true); // general flag
    cdView.setUint16(10, 0, true); // compression method
    cdView.setUint16(12, 0, true); // time
    cdView.setUint16(14, 0, true); // date
    cdView.setUint32(16, crc, true); // crc32
    cdView.setUint32(20, compressedSize, true); // compressed size
    cdView.setUint32(24, uncompressedSize, true); // uncompressed size
    cdView.setUint16(28, fileNameBytes.length, true); // name length
    cdView.setUint16(30, 0, true); // extra len
    cdView.setUint16(32, 0, true); // comment len
    cdView.setUint16(34, 0, true); // disk start
    cdView.setUint16(36, 0, true); // internal attr
    cdView.setUint32(38, 0, true); // external attr
    cdView.setUint32(42, offset, true); // relative offset of local header

    cdHeader.set(fileNameBytes, 46);
    centralDirRecords.push(cdHeader);

    offset += localHeader.length;
  }

  // End of central directory record (22 bytes)
  const cdSize = centralDirRecords.reduce((acc, r) => acc + r.length, 0);
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  // Signature 0x06054b50
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true); // disk number
  eocdView.setUint16(6, 0, true); // start disk
  eocdView.setUint16(8, files.length, true); // records on disk
  eocdView.setUint16(10, files.length, true); // total records
  eocdView.setUint32(12, cdSize, true); // size of central dir
  eocdView.setUint32(16, offset, true); // offset of central dir
  eocdView.setUint16(20, 0, true); // comment length

  const allParts: BlobPart[] = [...fileRecords, ...centralDirRecords, eocd] as unknown as BlobPart[];
  return new Blob(allParts, { type: 'application/zip' });
}
