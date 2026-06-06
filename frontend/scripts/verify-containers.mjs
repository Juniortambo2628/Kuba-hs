import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src", "app");

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const dirs = ["admin", path.join("dashboard", "client"), path.join("dashboard", "provider")];
const files = dirs.flatMap((d) => walk(path.join(ROOT, d)));
const bad = [];

for (const file of files) {
  const c = fs.readFileSync(file, "utf8");
  if (!c.includes("<DashboardPageContainer")) continue;
  const opens = (c.match(/<DashboardPageContainer[\s>]/g) || []).length;
  const closes = (c.match(/<\/DashboardPageContainer>/g) || []).length;
  if (opens !== closes) bad.push({ file: path.relative(ROOT, file), opens, closes });
}

if (bad.length) {
  console.log("MISMATCH:");
  bad.forEach((b) => console.log(b));
  process.exit(1);
}
console.log("All", files.filter((f) => fs.readFileSync(f, "utf8").includes("<DashboardPageContainer")).length, "files balanced");
