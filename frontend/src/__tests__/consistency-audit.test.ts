/**
 * Design Consistency Audit
 *
 * Validates that all useCrudForm consumers follow the same structural pattern:
 * - Uses CrudFormDialog wrapper
 * - Has open/onOpenChange props
 * - Calls handleSubmit from useCrudForm
 * - Renders a <form> with onSubmit
 */
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SRC_DIR = join(__dirname, "..", "..");

function findFormDialogs(): string[] {
  const adminDir = join(SRC_DIR, "src", "components", "admin");
  return readdirSync(adminDir)
    .filter((f) => f.endsWith("FormDialog.tsx"))
    .map((f) => join(adminDir, f));
}

const formDialogFiles = findFormDialogs();

describe("Form Dialog Pattern Consistency", () => {
  it("all admin form dialogs exist", () => {
    expect(formDialogFiles.length).toBeGreaterThanOrEqual(4);
  });

  formDialogFiles.forEach((filePath) => {
    const fileName = filePath.split(/[\\/]/).pop()!;

    describe(fileName, () => {
      const content = readFileSync(filePath, "utf-8");

      it("uses useCrudForm hook", () => {
        expect(content).toContain("useCrudForm");
      });

      it("uses CrudFormDialog component", () => {
        expect(content).toContain("CrudFormDialog");
      });

      it("has open prop", () => {
        expect(content).toMatch(/open:\s*boolean/);
      });

      it("has onOpenChange prop", () => {
        expect(content).toMatch(/onOpenChange:/);
      });

      it("has onSuccess prop", () => {
        expect(content).toMatch(/onSuccess:/);
      });

      it("calls handleSubmit in onSubmit", () => {
        expect(content).toMatch(/handleSubmit/);
      });

      it("renders a form element with onSubmit", () => {
        expect(content).toMatch(/<form[^>]*onSubmit/);
      });

      it("provides empty function to useCrudForm", () => {
        expect(content).toMatch(/empty:\s*\(\)\s*=>/);
      });

      it("provides endpoint to useCrudForm", () => {
        expect(content).toMatch(/endpoint:\s*["']\/api\//);
      });
    });
  });
});

describe("Dashboard Layout Component Consistency", () => {
  const layoutComponents = [
    { name: "DashboardShell.tsx", dir: "layout" },
    { name: "DashboardPageHeader.tsx", dir: "shared" },
    { name: "DashboardPageContainer.tsx", dir: "shared" },
  ];

  layoutComponents.forEach(({ name, dir }) => {
    const filePath = join(SRC_DIR, "src", "components", dir, name);
    const content = readFileSync(filePath, "utf-8");

    describe(name, () => {
      it("exports a named component", () => {
        expect(content).toMatch(/export (function|const) \w+/);
      });

      it("has proper TypeScript props interface", () => {
        expect(content).toMatch(/interface \w+Props|type \w+Props/);
      });
    });
  });
});
