/**
 * Seedable pseudo-random number generator (mulberry32).
 * Deterministic: same seed → same sequence.
 */

export function hashSeed(seed: string): number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    return h >>> 0;
}

/** Returns next float [0,1) and the new state */
export function nextRandom(state: number): [number, number] {
    let t = (state + 0x6d2b79f5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return [result, (state + 1) | 0];
}

/** Returns a random integer in [min, max] inclusive */
export function randInt(
    state: number,
    min: number,
    max: number
): [number, number] {
    const [r, next] = nextRandom(state);
    return [Math.floor(r * (max - min + 1)) + min, next];
}

/** Weighted random choice from items with weights */
export function weightedChoice<T extends { weight: number }>(
    state: number,
    items: T[]
): [T, number] {
    const total = items.reduce((s, it) => s + it.weight, 0);
    let [r, next] = nextRandom(state);
    r *= total;
    let cumulative = 0;
    for (const item of items) {
        cumulative += item.weight;
        if (r < cumulative) return [item, next];
    }
    return [items[items.length - 1], next];
}
