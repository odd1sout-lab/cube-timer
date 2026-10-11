import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import Modal from './components/Modal.jsx';
import Stats from './components/Stats.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import { STATUS, useCubeTimer } from './hooks/useCubeTimer.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { DEFAULT_SETTINGS, useSettings } from './hooks/useSettings.js';
import { BACKGROUNDS } from './config/backgrounds.js';
import { generateScramble } from './utils/scramble.js';
import { fileToDataUrl } from './utils/image.js';
import { PENALTY, computeStats, formatSolve, formatTime } from './utils/time.js';

const CUSTOM_BG_KEY = 'cubetimer.customBg.v1';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function timeScale(text) {
  const n = text.length;
  if (n <= 5) return 1;
  if (n === 6) return 0.88;
  if (n === 7) return 0.76;
  return 0.66;
}

function Hint({ status, touchMode }) {
  if (status === STATUS.RUNNING) return null;
  if (status === STATUS.HOLDING) return <p className="hint strong">Hold…</p>;
  if (status === STATUS.READY) return <p className="hint strong">Release!</p>;

  return (
    <p className="hint">
      <span className="hint-keys">
        Hold <kbd>Space</kbd>, release to start, press again to stop
      </span>
      <span className="hint-touch">
        {touchMode === 2
          ? 'Touch the screen with two fingers, release to start, then touch to stop'
          : 'Touch the screen with one finger, release to start, then touch to stop'}
      </span>
    </p>
  );
}

export default function App() {
  const [settings, updateSettings] = useSettings();
  const [solves, setSolves] = useLocalStorage('cubetimer.solves.v1', []);
  const [customBg, setCustomBg] = useLocalStorage(CUSTOM_BG_KEY, null);
  const [scramble, setScramble] = useState(() => generateScramble());
  const [modal, setModal] = useState(null);

  const handleFinish = useCallback(
    (time) => {
      setSolves((prev) => [
        { id: uid(), time, penalty: PENALTY.NONE, scramble, date: Date.now() },
        ...prev,
      ]);
      setScramble(generateScramble());
    },
    [scramble, setSolves],
  );

  const { status, elapsed, touches } = useCubeTimer({
    holdMs: settings.holdMs,
    touchMode: settings.touchMode,
    enabled: modal === null,
    onFinish: handleFinish,
  });

  const stats = useMemo(() => computeStats(solves), [solves]);
  const lastSolve = solves[0];

  useEffect(() => {
    if (!settings.vibration || typeof navigator.vibrate !== 'function') return;
    if (status === STATUS.READY) navigator.vibrate(30);
    else if (status === STATUS.RUNNING) navigator.vibrate(12);
    else if (status === STATUS.STOPPED) navigator.vibrate(40);
  }, [status, settings.vibration]);

  const setPenalty = useCallback(
    (id, penalty) =>
      setSolves((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, penalty: s.penalty === penalty ? PENALTY.NONE : penalty } : s,
        ),
      ),
    [setSolves],
  );

  const deleteSolve = useCallback(
    (id) => setSolves((prev) => prev.filter((s) => s.id !== id)),
    [setSolves],
  );

  const clearSolves = useCallback(() => {
    if (window.confirm('Delete all solves? This cannot be undone.')) setSolves([]);
  }, [setSolves]);

  const handleUpload = useCallback(
    async (file) => {
      try {
        const dataUrl = await fileToDataUrl(file);
        setCustomBg(dataUrl);
        updateSettings({ background: 'custom' });
        try {
          window.localStorage.setItem(CUSTOM_BG_KEY, JSON.stringify(dataUrl));
        } catch {
          window.alert(
            'The image was applied, but it could not fit in browser storage and will be lost after reloading. Try a smaller image.',
          );
        }
      } catch {
        window.alert('Could not open this image. Try another file (JPG or PNG).');
      }
    },
    [setCustomBg, updateSettings],
  );

  const removeCustomBg = useCallback(() => {
    setCustomBg(null);
    if (settings.background === 'custom') updateSettings({ background: DEFAULT_SETTINGS.background });
  }, [setCustomBg, settings.background, updateSettings]);

  const bgUrl = useMemo(() => {
    if (settings.background === 'none') return null;
    if (settings.background === 'custom' && customBg) return customBg;
    const preset = BACKGROUNDS.find((b) => b.id === settings.background) ?? BACKGROUNDS[0];
    return preset.src;
  }, [settings.background, customBg]);

  let timeText;
  if (status === STATUS.RUNNING) {
    timeText = settings.hideWhileRunning ? '···' : formatTime(elapsed, settings.decimals);
  } else if (status === STATUS.HOLDING || status === STATUS.READY) {
    timeText = formatTime(0, settings.decimals);
  } else {
    timeText = formatSolve(lastSolve, settings.decimals);
  }

  return (
    <div className={`app is-${status}`}>
      <div
        className={`bg${bgUrl ? '' : ' bg-none'}`}
        style={{
          backgroundImage: bgUrl ? `url("${bgUrl}")` : undefined,
          filter: settings.blur ? `blur(${settings.blur}px)` : undefined,
        }}
      />
      <div className="bg-dim" style={{ opacity: settings.dim / 100 }} />
      <div className="bg-vignette" />

      <header className="topbar chrome">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="cube" size={20} />
          </span>
          <span>
            Cube Timer
          </span>
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" onClick={() => setModal('history')} aria-label="History">
            <Icon name="list" />
          </button>
          <button className="icon-btn" onClick={() => setModal('settings')} aria-label="Settings">
            <Icon name="sliders" />
          </button>
        </div>
      </header>

      {settings.showScramble && (
        <div className="scramble chrome">
          <p className="scramble-text">{scramble}</p>
          <button
            className="icon-btn small"
            onClick={() => setScramble(generateScramble())}
            aria-label="New scramble"
          >
            <Icon name="refresh" size={18} />
          </button>
        </div>
      )}

      <main className="stage">
        <div className="time" style={{ '--k': timeScale(timeText) }}>
          {timeText}
        </div>

        <div className="dots" aria-hidden="true">
          {Array.from({ length: settings.touchMode }, (_, i) => (
            <span key={i} className={`dot${i < touches ? ' on' : ''}`} />
          ))}
        </div>

        <Hint status={status} touchMode={settings.touchMode} />

        {status === STATUS.STOPPED && lastSolve && (
          <div className="penalties">
            <button
              className={`pill-btn${lastSolve.penalty === PENALTY.PLUS2 ? ' on' : ''}`}
              onClick={() => setPenalty(lastSolve.id, PENALTY.PLUS2)}
            >
              +2
            </button>
            <button
              className={`pill-btn${lastSolve.penalty === PENALTY.DNF ? ' on' : ''}`}
              onClick={() => setPenalty(lastSolve.id, PENALTY.DNF)}
            >
              DNF
            </button>
            <button className="pill-btn danger" onClick={() => deleteSolve(lastSolve.id)}>
              Delete
            </button>
          </div>
        )}
      </main>

      <footer className="footer chrome">
        <Stats stats={stats} decimals={settings.decimals} />
      </footer>

      {modal === 'settings' && (
        <Modal title="Settings" onClose={() => setModal(null)}>
          <SettingsPanel
            settings={settings}
            onChange={updateSettings}
            customBg={customBg}
            onUpload={handleUpload}
            onRemoveCustom={removeCustomBg}
            onResetSolves={clearSolves}
            solvesCount={solves.length}
          />
        </Modal>
      )}

      {modal === 'history' && (
        <Modal title="History" onClose={() => setModal(null)}>
          <HistoryPanel
            solves={solves}
            stats={stats}
            decimals={settings.decimals}
            onPenalty={setPenalty}
            onDelete={deleteSolve}
            onClear={clearSolves}
          />
        </Modal>
      )}
    </div>
  );
}
