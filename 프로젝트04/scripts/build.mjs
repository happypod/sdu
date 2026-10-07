import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const assets = ["index.html", "styles.css", "app.js", "favicon.svg", "img/logo.png", "vendor/qrcodegen.js"];

// Validate the complete source set before writing a deployment directory.
await Promise.all(assets.map(asset => readFile(resolve(root, asset))));
for (const asset of assets) {
  const destination = resolve(output, asset);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, asset), destination);
}
console.log(`Built ${assets.length} static files in ${output}`);
