const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../docs");
const assets = path.join(root, "assets/favicons");
const variants = [
  { name: "monogram-dark", source: path.join(assets, "monogram-dark.svg") },
  { name: "monogram-light", source: path.join(assets, "monogram-light.svg") },
  { name: "tap", source: path.join(assets, "tap.svg") }
];
const sizes = [16, 32, 48, 180, 192, 512];

// ICO directory entries point to PNG payloads, one per browser icon size.
function createIco(images) {
  const directory = Buffer.alloc(6 + images.length * 16);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(images.length, 4);
  let offset = directory.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    directory[entry] = size;
    directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([directory, ...images.map(image => image.data)]);
}

(async () => {
  await fs.mkdir(assets, { recursive: true });
  for (const variant of variants) {
    const images = [];
    for (const size of sizes) {
      const data = await sharp(variant.source, { density: 768 })
        .resize(size, size)
        .png()
        .toBuffer();
      await fs.writeFile(path.join(assets, `${variant.name}-${size}.png`), data);
      if (size <= 48) images.push({ size, data });
    }
    const ico = createIco(images);
    await fs.writeFile(path.join(assets, `${variant.name}.ico`), ico);
    if (variant.name === "monogram-light") {
      await fs.copyFile(variant.source, path.join(root, "favicon.svg"));
      await fs.writeFile(path.join(root, "favicon.ico"), ico);
      await fs.copyFile(path.join(assets, `${variant.name}-48.png`), path.join(root, "favicon-48.png"));
      await sharp(path.join(assets, `${variant.name}-180.png`))
        .flatten({ background: "#f3f7f8" })
        .png()
        .toFile(path.join(root, "apple-touch-icon.png"));
    }
  }
  console.log("Built 3 favicon sets: SVG sources, 16/32/48/180/192/512px PNGs and multi-size ICO files.");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
