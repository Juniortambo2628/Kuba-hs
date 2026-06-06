/** Split a headline so the last word can use the landing gradient span. */
export function landingTitleParts(
  fullTitle: string,
  highlightFallback: string
): { part1: string; part2: string } {
  const trimmed = fullTitle.trim();
  if (!trimmed) {
    return { part1: "", part2: highlightFallback };
  }
  const words = trimmed.split(/\s+/);
  if (words.length <= 1) {
    return { part1: trimmed, part2: highlightFallback };
  }
  return {
    part1: words.slice(0, -1).join(" "),
    part2: words[words.length - 1] ?? highlightFallback,
  };
}

export function LandingGradientTitle({
  part1,
  part2,
}: {
  part1: string;
  part2: string;
}) {
  if (!part1 && !part2) return null;
  if (!part1) {
    return (
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
        {part2}
      </span>
    );
  }
  return (
    <>
      {part1}{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
        {part2}
      </span>
    </>
  );
}
