import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "..", "src", "app");
const importLine =
  'import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";\n';

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".tsx")) files.push(full);
  }
  return files;
}

let updated = 0;
for (const file of walk(appDir)) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("DashboardPageContainer")) continue;
  if (content.includes('from "@/components/shared/DashboardPageContainer"')) continue;
  if (!content.includes('"use client"')) {
    const next = importLine + content;
    fs.writeFileSync(file, next);
    updated++;
    console.log("prepended:", path.relative(appDir, file));
    continue;
  }
  const idx = content.indexOf('"use client"');
  const lineEnd = content.indexOf("\n", idx) + 1;
  const next = content.slice(0, lineEnd) + "\n" + importLine + content.slice(lineEnd);
  fs.writeFileSync(file, next);
  updated++;
  console.log("added:", path.relative(appDir, file));
}
console.log(`Updated ${updated} files`);
