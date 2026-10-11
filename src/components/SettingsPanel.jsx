import { useRef } from 'react';
import Icon from './Icon.jsx';
import { Segmented, Slider, Toggle } from './Controls.jsx';
import { BACKGROUNDS } from '../config/backgrounds.js';

export default function SettingsPanel({
  settings,
  onChange,
  customBg,
  onUpload,
  onRemoveCustom,
  onResetSolves,
  solvesCount,
}) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) onUpload(file);
  };

  return (
    <>
      <section className="group">
        <h3>Controls</h3>

        <div className="field">
          <div className="field-label">
            <span>Touch mode on mobile</span>
            <small>How many fingers to place on the screen to ready the timer</small>
          </div>
          <Segmented
            value={settings.touchMode}
            onChange={(touchMode) => onChange({ touchMode })}
            options={[
              { value: 1, label: '1 finger' },
              { value: 2, label: '2 fingers' },
            ]}
          />
        </div>

        <Slider
          label="Start delay"
          value={settings.holdMs}
          min={0}
          max={1000}
          step={50}
          unit=" ms"
          onChange={(holdMs) => onChange({ holdMs })}
        />

        <Toggle
          label="Vibration"
          hint="Phone feedback: ready, start, stop"
          checked={settings.vibration}
          onChange={(vibration) => onChange({ vibration })}
        />

        <p className="note">
          Desktop: hold Space until the digits turn green, then release to start. Press any key to stop. On mobile, use touch instead.
        </p>
      </section>

      <section className="group">
        <h3>Display</h3>

        <div className="field">
          <div className="field-label">
            <span>Time precision</span>
          </div>
          <Segmented
            value={settings.decimals}
            onChange={(decimals) => onChange({ decimals })}
            options={[
              { value: 2, label: '0.01' },
              { value: 3, label: '0.001' },
            ]}
          />
        </div>

        <Toggle
          label="Hide time while solving"
          hint="Show dots instead of the timer while solving; the result appears when you stop"
          checked={settings.hideWhileRunning}
          onChange={(hideWhileRunning) => onChange({ hideWhileRunning })}
        />

        <Toggle
          label="Show scramble"
          hint="Move sequence to scramble a 3×3 cube"
          checked={settings.showScramble}
          onChange={(showScramble) => onChange({ showScramble })}
        />
      </section>

      <section className="group">
        <h3>Background</h3>

        <div className="bg-grid">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              className={`bg-thumb${settings.background === bg.id ? ' active' : ''}`}
              style={{ backgroundImage: `url("${bg.src}")` }}
              onClick={() => onChange({ background: bg.id })}
            >
              <span>{bg.name}</span>
            </button>
          ))}

          {customBg && (
            <button
              type="button"
              className={`bg-thumb${settings.background === 'custom' ? ' active' : ''}`}
              style={{ backgroundImage: `url("${customBg}")` }}
              onClick={() => onChange({ background: 'custom' })}
            >
              <span>My photo</span>
            </button>
          )}

          <button
            type="button"
            className={`bg-thumb none${settings.background === 'none' ? ' active' : ''}`}
            onClick={() => onChange({ background: 'none' })}
          >
            <span>No background</span>
          </button>
        </div>

        <div className="btn-row">
          <button type="button" className="btn primary" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={18} /> Upload a custom image
          </button>
          {customBg && (
            <button type="button" className="btn ghost" onClick={onRemoveCustom}>
              Remove custom image
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </div>

        <Slider
          label="Background dimming"
          value={settings.dim}
          min={0}
          max={85}
          step={5}
          unit="%"
          onChange={(dim) => onChange({ dim })}
        />
        <Slider
          label="Background blur"
          value={settings.blur}
          min={0}
          max={20}
          step={1}
          unit=" px"
          onChange={(blur) => onChange({ blur })}
        />
      </section>

      <section className="group">
        <h3>Data</h3>
        <button type="button" className="btn danger" onClick={onResetSolves} disabled={!solvesCount}>
          Reset solves ({solvesCount})
        </button>
      </section>
    </>
  );
}
