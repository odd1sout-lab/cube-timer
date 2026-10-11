import Icon from './Icon.jsx';
import { StatCard } from './Stats.jsx';
import { PENALTY, formatSolve, formatStat } from '../utils/time.js';

export default function HistoryPanel({ solves, stats, decimals, onPenalty, onDelete, onClear }) {
  return (
    <>
      <div className="summary">
        <StatCard label="Best" value={formatStat(stats.best, decimals)} />
        <StatCard label="Mean" value={formatStat(stats.mean, decimals)} />
        <StatCard label="Solves" value={stats.count} />
        <StatCard label="ao5" value={formatStat(stats.ao5, decimals)} />
        <StatCard label="ao12" value={formatStat(stats.ao12, decimals)} />
        <StatCard label="ao100" value={formatStat(stats.ao100, decimals)} />
      </div>

      {solves.length === 0 ? (
        <p className="empty">Nothing here yet. Solve the cube and your result will appear here.</p>
      ) : (
        <ul className="solve-list">
          {solves.map((solve, index) => (
            <li key={solve.id} className="solve-row">
              <span className="idx">{solves.length - index}</span>
              <span className={`val${solve.penalty === PENALTY.DNF ? ' dnf' : ''}`}>
                {formatSolve(solve, decimals)}
              </span>
              <div className="row-actions">
                <button
                  className={`chip${solve.penalty === PENALTY.PLUS2 ? ' on' : ''}`}
                  onClick={() => onPenalty(solve.id, PENALTY.PLUS2)}
                >
                  +2
                </button>
                <button
                  className={`chip${solve.penalty === PENALTY.DNF ? ' on' : ''}`}
                  onClick={() => onPenalty(solve.id, PENALTY.DNF)}
                >
                  DNF
                </button>
                <button
                  className="chip danger"
                  onClick={() => onDelete(solve.id)}
                  aria-label="Delete solve"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {solves.length > 0 && (
        <button className="btn ghost danger" onClick={onClear}>
          Clear all history
        </button>
      )}
    </>
  );
}
