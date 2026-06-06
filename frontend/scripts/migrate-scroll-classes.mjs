import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const replacements = [
  ["custom-scrollbar", "kuba-scroll"],
  ["premium-scrollbar", "kuba-scroll"],
  ["scrollbar-hide", "kuba-scroll-hidden"],
  ["hide-scrollbar", "kuba-scroll-hidden"],
  ["no-scrollbar", "kuba-scroll-hidden"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|css)$/.test(name)) files.push(full);
  }
  return files;
}

let count = 0;
for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8");
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  if (next !== content) {
    fs.writeFileSync(file, next);
    count++;
    console.log(path.relative(root, file));
  }
}
console.log(`Updated ${count} files`);
