import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { DEFAULT_BACKGROUND } from '../config/backgrounds.js';

export const DEFAULT_SETTINGS = Object.freeze({
  touchMode: 1,
  holdMs: 300,
  decimals: 2,
  hideWhileRunning: false,
  showScramble: true,
  vibration: true,
  background: DEFAULT_BACKGROUND,
  dim: 35,
  blur: 0,
});

export function useSettings() {
  const [stored, setStored] = useLocalStorage('cubetimer.settings.v1', DEFAULT_SETTINGS);

  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...stored }), [stored]);

  const update = useCallback(
    (patch) => setStored((prev) => ({ ...DEFAULT_SETTINGS, ...prev, ...patch })),
    [setStored],
  );

  return [settings, update];
}
