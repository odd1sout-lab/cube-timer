export const PENALTY = Object.freeze({ NONE: 0, PLUS2: 2000, DNF: 'DNF' });

export function effectiveTime(solve) {
  if (solve.penalty === PENALTY.DNF) return Infinity;
  return solve.time + (solve.penalty || 0);
}

export function formatTime(ms, decimals = 2) {
  if (ms == null || Number.isNaN(ms)) return '—';
  if (ms === Infinity) return 'DNF';

  const unit = decimals === 3 ? 1 : 10;
  const perSecond = decimals === 3 ? 1000 : 100;

  const total = Math.floor(Math.max(0, ms) / unit);
  const fraction = total % perSecond;
  const totalSeconds = Math.floor(total / perSecond);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const fractionText = String(fraction).padStart(decimals, '0');

  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, '0')}.${fractionText}`;
  }
  return `${seconds}.${fractionText}`;
}

export function formatSolve(solve, decimals = 2) {
  if (!solve) return decimals === 3 ? '0.000' : '0.00';
  if (solve.penalty === PENALTY.DNF) return 'DNF';
  const text = formatTime(solve.time + (solve.penalty || 0), decimals);
  return solve.penalty === PENALTY.PLUS2 ? `${text}+` : text;
}

export function formatStat(value, decimals = 2) {
  if (value == null) return '—';
  if (value === Infinity) return 'DNF';
  return formatTime(value, decimals);
}

export function averageOf(solves, n) {
  if (solves.length < n) return null;
  const values = solves.slice(0, n).map(effectiveTime);
  const dnfCount = values.filter((v) => v === Infinity).length;
  if (dnfCount > 1) return Infinity;

  values.sort((a, b) => a - b);
  const trimmed = values.slice(1, n - 1);
  return trimmed.reduce((sum, v) => sum + v, 0) / trimmed.length;
}

export function computeStats(solves) {
  const valid = solves.map(effectiveTime).filter(Number.isFinite);
  return {
    count: solves.length,
    best: valid.length ? valid.reduce((a, b) => Math.min(a, b), Infinity) : null,
    mean: valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null,
    ao5: averageOf(solves, 5),
    ao12: averageOf(solves, 12),
    ao100: averageOf(solves, 100),
  };
}
