/**
 * A small seeded random number generator (0 ≤ n < 1). Same seed, same numbers on the server and in the browser, so
 * star positions never jump at hydration. Used by StarField and PageTransition.
 */
export function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
