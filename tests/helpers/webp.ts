// A minimal WebP: RIFF header, size, WEBP tag, then a body.
export function webp(body: string, size = body.length): Buffer {
  const payload = Buffer.alloc(size, body);
  const head = Buffer.alloc(12);
  head.write("RIFF", 0, "ascii");
  head.writeUInt32LE(payload.length + 4, 4);
  head.write("WEBP", 8, "ascii");
  return Buffer.concat([head, payload]);
}
