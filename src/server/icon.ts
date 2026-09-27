import { crc32, deflateSync } from "node:zlib";

// A placeholder home-screen icon drawn by code, until ADR-0170's art replaces
// it: a strawberry-cream square with a lighter disc, no text.
const BG: [number, number, number] = [0xf6, 0xc6, 0xcf];
const FG: [number, number, number] = [0xfd, 0xf1, 0xe6];

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

export function iconPng(size = 512): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header.writeUInt8(8, 8); // bit depth
  header.writeUInt8(2, 9); // truecolour RGB
  const row = size * 3 + 1;
  const raw = Buffer.alloc(row * size);
  const c = size / 2;
  const r2 = (size * 0.3) ** 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [red, green, blue] = (x - c) ** 2 + (y - c) ** 2 < r2 ? FG : BG;
      const i = y * row + 1 + x * 3;
      raw[i] = red;
      raw[i + 1] = green;
      raw[i + 2] = blue;
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
