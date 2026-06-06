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

function fixFile(file) {
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("<DashboardPageContainer")) return false;

  const opens = (c.match(/<DashboardPageContainer[\s>]/g) || []).length;
  const closes = (c.match(/<\/DashboardPageContainer>/g) || []).length;
  if (opens === closes) return false;

  // Replace last N </div> with </DashboardPageContainer> where N = opens - closes
  let need = opens - closes;
  while (need > 0) {
    const idx = c.lastIndexOf("</div>");
    if (idx === -1) break;
    c = c.slice(0, idx) + "</DashboardPageContainer>" + c.slice(idx + 6);
    need--;
  }

  fs.writeFileSync(file, c);
  return true;
}

const dirs = ["admin", path.join("dashboard", "client"), path.join("dashboard", "provider")];
const files = dirs.flatMap((d) => walk(path.join(ROOT, d)));
let n = 0;
for (const f of files) {
  if (fixFile(f)) {
    console.log(path.relative(ROOT, f));
    n++;
  }
}
console.log("fixed", n);
