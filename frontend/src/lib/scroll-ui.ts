/**
 * Scrollbar / overflow utilities — single source for styled vs hidden scroll regions.
 * Pair with globals.css classes `.kuba-scroll` and `.kuba-scroll-hidden`.
 */
export const scrollUi = {
  /** Thin themed scrollbar (nested panels, lists, modals) */
  scroll: "kuba-scroll",
  y: "overflow-y-auto kuba-scroll",
  x: "overflow-x-auto kuba-scroll",
  both: "overflow-auto kuba-scroll",
  /** Scroll without visible bar (carousels, chat, tab strips) */
  hidden: "kuba-scroll-hidden",
  yHidden: "overflow-y-auto kuba-scroll-hidden",
  xHidden: "overflow-x-auto kuba-scroll-hidden",
  bothHidden: "overflow-auto kuba-scroll-hidden",
} as const;
