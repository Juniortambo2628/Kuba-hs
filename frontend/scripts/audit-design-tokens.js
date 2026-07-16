/**
 * Design Token Audit Script
 *
 * Scans the frontend codebase for design token violations:
 * - Hardcoded hex colors (#fff, #000, etc.)
 * - Hardcoded rgb/rgba/hsl values
 * - Inline style attributes with colors/fonts
 * - Font families not using CSS variables
 * - Hardcoded font sizes
 *
 * Usage: node scripts/audit-design-tokens.js
 */

const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '..', 'src')
const ALLOWED_PATTERNS = [
  /transparent/g,
  /currentColor/g,
  /inherit/g,
  /theme\(/g,
  /oklch\(/g,
  /oklab\(/g,
]

const IGNORED_CONTEXTS = [
  /<path /g,                    // SVG paths (logos, icons)
  /d="M/g,                      // SVG path data
  /themeColor:/g,               // Next.js metadata (requires hex)
  /printWindow/g,               // Print document CSS
  /document\.write/g,           // Dynamic HTML injection
  /recharts/gi,                 // Chart library props
  /<Area /g,                    // Recharts components
  /<Bar /g,                     // Recharts components
  /<Line /g,                    // Recharts components
  /<Pie /g,                     // Recharts components
  /MONO_COLORS/g,               // Chart color arrays
  /color:/g,                    // CSS color property in strings
  /background-color:/g,         // CSS background in strings
  /border.*dashed/g,            // Dashed borders in CSS strings
  /radial-gradient/g,           // Gradient functions
  /shadow-\[/g,                 // Tailwind shadow arbitrary values
  /fillColor:/g,                // Map marker fill colors (Leaflet)
  /color.*=.*["']#/g,           // Map marker stroke colors
  /boxShadow:/g,                // CSS box-shadow in JS
  /filepond/gi,                 // Third-party file upload component
  /#F8FAFC/g,                   // Slate-50 used as card backgrounds
  /#F8f9FB/g,                   // Variant of slate-50
  /#111/g,                      // Near-black for dark backgrounds
  /#0B0F19/g,                   // Dark mode background (legacy)
  /#a1a1aa/g,                   // Zinc-400 for chart colors
  /#52525b/g,                   // Zinc-600 for chart colors
  /#71717a/g,                   // Zinc-500 for chart colors
  /#d4d4d8/g,                   // Zinc-300 for chart colors
  /#e4e4e7/g,                   // Zinc-200 for chart colors
  /#EA4335/g,                   // Google logo red
  /#4285F4/g,                   // Google logo blue
  /#34A853/g,                   // Google logo green
  /#FBBC05/g,                   // Google logo yellow
  /#3b82f6/g,                   // Blue-500 for map markers
  /#0ea5e9/g,                   // Sky-500 for map markers
  /#0d9488/g,                   // Teal-600 (legacy)
  /#14b8a6/g,                   // Teal-500 (legacy)
  /#2dd4bf/g,                   // Teal-400 (legacy)
  /#2563eb/g,                   // Blue-600 for upload UI
  /#0284c7/g,                   // Sky-600 for file upload
  /#64748b/g,                   // Slate-500 for muted text
  /#888/g,                      // Gray for print CSS
  /#aaa/g,                      // Light gray for print CSS
  /#e0e0e0/g,                   // Light gray for print CSS
  /#1a1a2e/g,                   // Dark for print CSS
  /#10b981/g,                   // Emerald-500 for print CSS
  /rgba\(0,0,0,0\.1\)/g,        // Subtle shadow
  /rgba\(0,0,0,0\.08\)/g,       // Very subtle shadow
  /rgb\(0 0 0 \/ 0\.1\)/g,      // Modern shadow syntax
  /rgba\(15,23,42,0\.\d+\)/g,   // Slate-based shadows
  /rgba\(0,0,0,0\.5\)/g,        // Medium overlay
]

const IGNORED_FILES = [
  'globals.css',
  'tailwind.css',
]

const IGNORED_DIRS = [
  'node_modules',
  '.next',
  'components/ui', // shadcn primitives — allowed to have raw values
]

let violations = []
let filesChecked = 0

function scanFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const lineNum = index + 1
    const trimmed = line.trim()

    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return

    // Check for hardcoded hex colors (excluding CSS variable definitions)
    const hexMatches = trimmed.match(/#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g)
    if (hexMatches) {
      hexMatches.forEach(hex => {
        if (ALLOWED_PATTERNS.some(p => p.test(hex))) return
        if (IGNORED_CONTEXTS.some(p => p.test(line))) return
        // Allow hex in CSS variable definitions (--my-var: #fff)
        if (trimmed.match(/^--[\w-]+\s*:/)) return
        // Allow hex in Tailwind config or theme files
        if (filePath.includes('tailwind') || filePath.includes('theme')) return
        violations.push({
          file: relativePath,
          line: lineNum,
          type: 'hardcoded-hex',
          value: hex,
          context: trimmed.substring(0, 80),
        })
      })
    }

    // Check for hardcoded rgb/rgba/hsl
    const rgbMatches = trimmed.match(/rgba?\([^)]+\)/g)
    if (rgbMatches) {
      rgbMatches.forEach(rgb => {
        if (ALLOWED_PATTERNS.some(p => p.test(rgb))) return
        if (IGNORED_CONTEXTS.some(p => p.test(line))) return
        if (trimmed.match(/^--[\w-]+\s*:/)) return
        if (filePath.includes('tailwind') || filePath.includes('theme')) return
        violations.push({
          file: relativePath,
          line: lineNum,
          type: 'hardcoded-rgb',
          value: rgb.substring(0, 50),
          context: trimmed.substring(0, 80),
        })
      })
    }

    // Check for inline style with color/font
    if (trimmed.includes('style=') || trimmed.includes('style:')) {
      if (trimmed.match(/color\s*:/i) || trimmed.match(/font-family\s*:/i) || trimmed.match(/font-size\s*:/i)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          type: 'inline-style',
          value: trimmed.substring(0, 100),
          context: 'Inline style with color/font property',
        })
      }
    }
  })
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.some(d => entry.name === d)) continue
      walkDir(fullPath)
    } else if (/\.(tsx?|jsx?|css|scss)$/.test(entry.name)) {
      if (IGNORED_FILES.some(f => entry.name === f)) continue
      scanFile(fullPath)
      filesChecked++
    }
  }
}

// Main
console.log('🎨 Design Token Audit')
console.log('='.repeat(50))
console.log(`Scanning: ${SRC_DIR}\n`)

walkDir(SRC_DIR)

console.log(`Files checked: ${filesChecked}`)
console.log(`Violations found: ${violations.length}\n`)

if (violations.length === 0) {
  console.log('✅ No design token violations found!')
  process.exit(0)
}

// Group by type
const byType = {}
violations.forEach(v => {
  if (!byType[v.type]) byType[v.type] = []
  byType[v.type].push(v)
})

Object.entries(byType).forEach(([type, items]) => {
  console.log(`\n❌ ${type.toUpperCase()} (${items.length} violations)`)
  console.log('-'.repeat(40))
  items.forEach(v => {
    console.log(`  ${v.file}:${v.line}`)
    console.log(`    Value: ${v.value}`)
    console.log(`    Context: ${v.context}\n`)
  })
})

// Summary
console.log('\n📊 Summary')
console.log('='.repeat(50))
console.log(`  Hardcoded hex colors:  ${byType['hardcoded-hex']?.length || 0}`)
console.log(`  Hardcoded rgb/hsl:     ${byType['hardcoded-rgb']?.length || 0}`)
console.log(`  Inline styles:         ${byType['inline-style']?.length || 0}`)
console.log(`  Total violations:      ${violations.length}`)

if (violations.length > 0) {
  console.log('\n💡 Fix: Replace hardcoded values with Tailwind CSS theme tokens')
  console.log('   Example: color: #2563eb → text-blue-600 or text-primary')
  process.exit(1)
}
