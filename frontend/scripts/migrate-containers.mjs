import fs from "fs";
import path from "path";

const IMPORT =
  'import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";';
const ROOT = path.join(process.cwd(), "src", "app");
const dirs = ["admin", path.join("dashboard", "client"), path.join("dashboard", "provider")];

const opens = [
  [/<div className="max-w-\[1600px\] mx-auto space-y-8 p-4 md:p-8 animate-pulse">/g, '<DashboardPageContainer width="wide" className="p-4 md:p-8 animate-pulse">'],
  [/<div className="max-w-\[1600px\] mx-auto space-y-10 pb-20">/g, '<DashboardPageContainer width="wide" className="space-y-10 pb-20">'],
  [/<div className="space-y-10 pb-20 max-w-\[1600px\] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">/g, '<DashboardPageContainer width="wide" className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">'],
  [/<div className="max-w-\[1400px\] mx-auto space-y-10 pb-12">/g, '<DashboardPageContainer className="space-y-10">'],
  [/<div className="max-w-\[1400px\] mx-auto space-y-8 pb-12">/g, "<DashboardPageContainer>"],
  [/<div className="max-w-\[1400px\] mx-auto space-y-8 animate-pulse">/g, '<DashboardPageContainer className="animate-pulse">'],
  [/<div className="max-w-\[1400px\] mx-auto space-y-6 sm:space-y-10 pb-8 sm:pb-12">/g, '<DashboardPageContainer className="space-y-6 sm:space-y-10 pb-8 sm:pb-12">'],
  [/<div className="max-w-\[1200px\] mx-auto space-y-8 h-full">/g, '<DashboardPageContainer width="narrow" className="h-full">'],
  [/<div className="max-w-\[1200px\] mx-auto space-y-8">/g, '<DashboardPageContainer width="narrow">'],
  [/<div className="max-w-\[1000px\] mx-auto space-y-8 pb-12">/g, '<DashboardPageContainer width="narrow">'],
  [/<div className="max-w-\[1000px\] mx-auto space-y-12 pb-20 px-4">/g, '<DashboardPageContainer width="narrow" className="space-y-12 pb-20 px-4">'],
  [/<div className="max-w-6xl mx-auto space-y-10 pb-12">/g, '<DashboardPageContainer width="default" className="space-y-10">'],
  [/<div className="max-w-6xl mx-auto space-y-8 pb-12">/g, '<DashboardPageContainer width="default">'],
  [/<div className="max-w-5xl mx-auto space-y-10 pb-12">/g, '<DashboardPageContainer width="narrow" className="space-y-10">'],
  [/<div className="max-w-5xl mx-auto space-y-6 animate-pulse p-6">/g, '<DashboardPageContainer width="narrow" className="space-y-6 animate-pulse p-6">'],
  [/<div className="max-w-5xl mx-auto space-y-6 animate-pulse">/g, '<DashboardPageContainer width="narrow" className="space-y-6 animate-pulse">'],
  [/<div className="max-w-4xl mx-auto space-y-8 pb-12">/g, '<DashboardPageContainer width="compact">'],
  [/<div className="h-full flex flex-col space-y-10 animate-in fade-in duration-500 pb-12">/g, '<DashboardPageContainer className="h-full flex flex-col space-y-10 animate-in fade-in duration-500">'],
  [/<div className="space-y-6 animate-pulse max-w-6xl mx-auto">/g, '<DashboardPageContainer width="default" className="space-y-6 animate-pulse">'],
  [/<div className="space-y-8 animate-pulse max-w-6xl mx-auto p-4">/g, '<DashboardPageContainer width="default" className="space-y-8 animate-pulse p-4">'],
];

const motionOpen =
  /<motion\.div\s+initial=\{\{ opacity: 0 \}\}\s+animate=\{\{ opacity: 1 \}\}\s+className="max-w-\[1400px\] mx-auto space-y-6 sm:space-y-10 pb-8 sm:pb-12"\s*>/g;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

function ensureImport(content) {
  if (content.includes("DashboardPageContainer")) return content;
  const match = content.match(/^import .+$/gm);
  if (!match) return `${IMPORT}\n${content}`;
  const last = match[match.length - 1];
  const idx = content.indexOf(last) + last.length;
  return `${content.slice(0, idx)}\n${IMPORT}${content.slice(idx)}`;
}

function closeContainers(content) {
  // Balance: replace </motion.div> when we replaced motion open
  if (content.includes("<DashboardPageContainer") && content.includes("</motion.div>")) {
    const opens = (content.match(/<DashboardPageContainer/g) || []).length;
    let closes = (content.match(/<\/DashboardPageContainer>/g) || []).length;
    if (opens > closes) {
      content = content.replace(/<\/motion\.div>/, "</DashboardPageContainer>");
      closes++;
    }
  }

  let opens = (content.match(/<DashboardPageContainer/g) || []).length;
  let closes = (content.match(/<\/DashboardPageContainer>/g) || []).length;
  while (opens > closes) {
    const idx = content.lastIndexOf("</div>");
    if (idx === -1) break;
    content = content.slice(0, idx) + "</DashboardPageContainer>" + content.slice(idx + 6);
    closes++;
  }
  return content;
}

const skip = new Set(["bookings/[id]/AdminBookingClient.tsx"]);

const files = dirs.flatMap((d) => walk(path.join(ROOT, d)));
let updated = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (rel.includes("AdminBookingClient")) continue;

  let content = fs.readFileSync(file, "utf8");
  const before = content;

  if (motionOpen.test(content)) {
    content = content.replace(
      motionOpen,
      '<DashboardPageContainer className="space-y-6 sm:space-y-10 pb-8 sm:pb-12">'
    );
  }
  motionOpen.lastIndex = 0;

  for (const [re, rep] of opens) {
    content = content.replace(re, rep);
    re.lastIndex = 0;
  }

  if (content === before) continue;

  content = ensureImport(content);
  content = closeContainers(content);

  // Suspense fallbacks
  content = content.replace(
    /<Suspense fallback={<div className="max-w-6xl mx-auto p-8"><Skeleton/g,
    "<Suspense fallback={<DashboardPageContainer><Skeleton"
  );
  content = content.replace(
    /<Suspense fallback={<div className="max-w-6xl mx-auto p-8 animate-pulse h-64 bg-muted rounded-2xl" \/>}>/g,
    '<Suspense fallback={<DashboardPageContainer className="animate-pulse"><div className="h-64 bg-muted rounded-2xl" /></DashboardPageContainer>}>'
  );
  content = content.replace(
    /<Skeleton className="h-\[600px\] w-full rounded-2xl" \/>\s*<\/div>}/g,
    '<Skeleton className="h-[600px] w-full rounded-2xl" /></DashboardPageContainer>}'
  );

  fs.writeFileSync(file, content);
  updated++;
  console.log(rel);
}

console.log(`\nUpdated ${updated} files`);
