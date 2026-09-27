"use client";

import dynamic from "next/dynamic";
import type { RichTextEditorProps } from "./RichTextEditorImpl";

const RichTextEditor = dynamic(
  () => import("./RichTextEditorImpl").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[160px] rounded-xl border border-border/40 bg-muted/5" />
    ),
  }
);

export { RichTextEditor };
export type { RichTextEditorProps };
