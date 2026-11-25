type Layer = "far" | "mid" | "near";

type StarFieldProps = { layer: Layer };

// Number of stars, size range (rem) and opacity per depth. Nearer = bigger, brighter, and moved further by the
// timeline (targets stars-far / stars-mid / stars-near), which gives the depth.
const LAYERS: Record<Layer, { count: number; size: [number, number]; opacity: number; seed: number }> = {
  far: { count: 22, size: [0.35, 0.6], opacity: 0.35, seed: 7 },
  mid: { count: 14, size: [0.6, 0.95], opacity: 0.5, seed: 19 },
  near: { count: 8, size: [1, 1.5], opacity: 0.7, seed: 41 },
};

/** Same numbers on the server and in the browser, so positions never jump at hydration. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Star points for a 24×24 box.
const STAR = "12,1.5 14.9,8.6 22.5,9.2 16.7,14.1 18.5,21.6 12,17.6 5.5,21.6 7.3,14.1 1.5,9.2 9.1,8.6";

// One layer of small decorative stars in AppColor yellows. Taller than the screen so it can move up without a gap.
export function StarField({ layer }: StarFieldProps) {
  const { count, size, opacity, seed } = LAYERS[layer];
  const random = seeded(seed);
  const stars = Array.from({ length: count }, (_, i) => ({
    left: random() * 100,
    top: random() * 100,
    size: size[0] + random() * (size[1] - size[0]),
    rotate: random() * 40 - 20,
    color: i % 3 === 0 ? "fill-highlight-chart" : "fill-home-star",
  }));

  return (
    // The engine writes transform and opacity on the data-px element, so the layer's own opacity sits on the stars.
    <div data-px={`stars-${layer}`} className="absolute inset-x-0 top-0 h-[160%]">
      {stars.map((star, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`absolute ${star.color}`}
          style={{
            opacity,
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            transform: `rotate(${star.rotate}deg)`,
          }}
        >
          <polygon points={STAR} />
        </svg>
      ))}
    </div>
  );
}
