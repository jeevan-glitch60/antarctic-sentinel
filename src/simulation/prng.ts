/**
 * Seeded PRNG (Mulberry32) & Stochastic Sampling
 * Ensures 100% exact reproducibility of multi-physics runs given (seed, scenario, version).
 */

export class SeededPRNG {
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed >>> 0;
  }

  // Returns pseudo-random uniform float in [0, 1)
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns uniform float in range [min, max]
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Box-Muller transform for Gaussian (normal) distribution
  gaussian(mean: number = 0, stdDev: number = 1): number {
    let u = 0, v = 0;
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
  }

  // Poisson distribution for discrete rare event arrivals
  poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.next();
    } while (p > L);
    return k - 1;
  }
}
