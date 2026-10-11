import { formatStat } from '../utils/time.js';

export function StatCard({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export default function Stats({ stats, decimals }) {
  return (
    <div className="stats">
      <StatCard label="Best" value={formatStat(stats.best, decimals)} />
      <StatCard label="ao5" value={formatStat(stats.ao5, decimals)} />
      <StatCard label="ao12" value={formatStat(stats.ao12, decimals)} />
      <StatCard label="Solves" value={stats.count} />
    </div>
  );
}
