import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

const suspenseReplacements = [
  [
    /<Suspense fallback=\{<DashboardPageContainer[^>]*><Skeleton className="h-\[600px\] w-full rounded-2xl" \/><\/DashboardPageContainer>\}>/g,
    '<Suspense fallback={<DashboardSuspenseFallback />}>',
  ],
  [
    /<Suspense fallback=\{<DashboardPageContainer className="animate-pulse"><div className="h-64 bg-muted rounded-2xl" \/><\/DashboardPageContainer>\}>/g,
    '<Suspense fallback={<DashboardSuspenseFallback bodyHeight="h-64" />}>',
  ],
];

const loadingPatterns = [
  {
    re: /if \(isLoading\) \{\s*return \(\s*<DashboardPageContainer width="narrow" className="space-y-6 animate-pulse[^"]*">\s*<Skeleton className="h-10 w-48 rounded-lg" \/>\s*<Skeleton className="h-64 rounded-xl" \/>\s*<\/DashboardPageContainer>\s*\);\s*\}/g,
    rep: 'if (isLoading) {\n        return <DashboardPageSkeleton width="narrow" metrics={0} bodyHeight="h-64" />;\n    }',
  },
  {
    re: /if \(isLoading\) \{\s*return \(\s*<DashboardPageContainer width="default" className="space-y-6 animate-pulse">\s*<Skeleton className="h-10 w-48 rounded-lg" \/>\s*<div className="grid gap-4 md:grid-cols-4">\s*\{\[1,2,3,4\]\.map\(i => <Skeleton key=\{i\} className="h-28 w-full rounded-xl" \/>\)\}\s*<\/div>\s*<Skeleton className="h-\[400px\] w-full rounded-xl" \/>\s*<\/DashboardPageContainer>\s*\);\s*\}/g,
    rep: 'if (isLoading) {\n    return <DashboardPageSkeleton width="default" metrics={4} />;\n  }',
  },
  {
    re: /if \(isLoading\) \{\s*return \(\s*<DashboardPageContainer className="animate-pulse">\s*<Skeleton className="h-12 w-64 rounded-2xl" \/>\s*<Skeleton className="h-\[500px\] w-full rounded-\[2\.5rem\]" \/>\s*<\/DashboardPageContainer>\s*\);\s*\}/g,
    rep: 'if (isLoading) {\n  return <DashboardPageSkeleton metrics={0} bodyHeight="h-[500px]" />;\n }',
  },
  {
    re: /if \(isLoading\) \{\s*return \(\s*<DashboardPageContainer className="animate-pulse">\s*<Skeleton className="h-12 w-64 rounded-2xl" \/>\s*<div className="grid[^]*?<\/DashboardPageContainer>\s*\);\s*\}/gs,
    rep: 'if (isLoading) {\n  return <DashboardPageSkeleton metrics={2} bodyHeight="h-[600px]" />;\n }',
  },
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".tsx")) files.push(full);
  }
  return files;
}

let count = 0;
for (const file of walk(path.join(root, "app", "admin"))) {
  let content = fs.readFileSync(file, "utf8");
  let next = content;
  for (const [re, rep] of suspenseReplacements) {
    next = next.replace(re, rep);
  }
  for (const { re, rep } of loadingPatterns) {
    next = next.replace(re, rep);
  }
  if (next !== content) {
    if (!next.includes("DashboardPageSkeleton") && next.includes("DashboardPageSkeleton")) {
      // add import
    }
    if (next.includes("DashboardPageSkeleton") && !next.includes('from "@/components/shared/DashboardPageSkeleton"')) {
      next = next.replace(
        /import \{ DashboardPageContainer \}[^\n]+\n/,
        (m) => m + 'import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";\n'
      );
    }
    if (next.includes("DashboardSuspenseFallback") && !next.includes('from "@/components/shared/DashboardSuspenseFallback"')) {
      next = next.replace(
        /import \{ DashboardPageContainer \}[^\n]+\n/,
        (m) => m + 'import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";\n'
      );
    }
    fs.writeFileSync(file, next);
    count++;
    console.log(path.relative(root, file));
  }
}

console.log(`Updated ${count} admin files`);
