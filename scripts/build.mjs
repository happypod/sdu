import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const assets = ["index.html", "styles.css", "gradient.js", "favicon.svg", "img/logo.png", "vendor/qrcodegen.js", "url2qr/index.html", "url2qr/app.js", "urlShort/index.html", "urlShort/app.js", "urlShort/styles.css", ".nojekyll"];

// Validate the complete source set before writing a deployment directory.
await Promise.all(assets.map(asset => readFile(resolve(root, asset))));
// Only the fixed, ignored deployment directory may be cleared.
if (output !== resolve(root, "dist")) throw new Error("Unexpected build destination");
await rm(output, { recursive: true, force: true });
for (const asset of assets) {
  const destination = resolve(output, asset);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, asset), destination);
}
console.log(`Built ${assets.length} static files in ${output}`);
