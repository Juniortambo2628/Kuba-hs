export async function loadEcho() {
  const { getEcho } = await import("./echo");
  return getEcho();
}
