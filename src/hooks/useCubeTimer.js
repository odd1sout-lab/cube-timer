import { useCallback, useEffect, useRef, useState } from 'react';

export const STATUS = Object.freeze({
  IDLE: 'idle',
  HOLDING: 'holding',
  READY: 'ready',
  RUNNING: 'running',
  STOPPED: 'stopped',
});
const IGNORE_SELECTOR = 'button, a, input, select, textarea, label, [data-no-timer]';
const TEXT_FIELD = /^(INPUT|TEXTAREA|SELECT)$/;
const NON_STOP_KEYS = new Set([
  'Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'OS', 'CapsLock', 'Tab', 'ContextMenu',
]);

export function useCubeTimer({ holdMs = 300, touchMode = 1, enabled = true, onFinish } = {}) {
  const [status, setStatusState] = useState(STATUS.IDLE);
  const [elapsed, setElapsed] = useState(0);
  const [touches, setTouches] = useState(0);

  const statusRef = useRef(STATUS.IDLE);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const holdTimerRef = useRef(0);
  const pointersRef = useRef(new Set());
  const lockRef = useRef(false);
  const optsRef = useRef({});
  optsRef.current = { holdMs, touchMode, enabled, onFinish };

  const setStatus = useCallback((next) => {
    statusRef.current = next;
    setStatusState(next);
  }, []);

  const frame = useCallback(() => {
    setElapsed(performance.now() - startRef.current);
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  const beginHold = useCallback(() => {
    const s = statusRef.current;
    if (s !== STATUS.IDLE && s !== STATUS.STOPPED) return;
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur?.();
    }
    setStatus(STATUS.HOLDING);
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      if (statusRef.current === STATUS.HOLDING) setStatus(STATUS.READY);
    }, Math.max(0, optsRef.current.holdMs));
  }, [setStatus]);

  const cancelHold = useCallback(() => {
    clearTimeout(holdTimerRef.current);
    const s = statusRef.current;
    if (s === STATUS.HOLDING || s === STATUS.READY) setStatus(STATUS.IDLE);
  }, [setStatus]);

  const startTimer = useCallback(() => {
    if (statusRef.current !== STATUS.READY) return;
    clearTimeout(holdTimerRef.current);
    startRef.current = performance.now();
    setElapsed(0);
    setStatus(STATUS.RUNNING);
    rafRef.current = requestAnimationFrame(frame);
  }, [frame, setStatus]);

  const stopTimer = useCallback(() => {
    if (statusRef.current !== STATUS.RUNNING) return;
    cancelAnimationFrame(rafRef.current);
    const time = performance.now() - startRef.current;
    setElapsed(time);
    setStatus(STATUS.STOPPED);
    optsRef.current.onFinish?.(time);
  }, [setStatus]);

  useEffect(() => {
    const needed = () => (optsRef.current.touchMode === 2 ? 2 : 1);

    const onKeyDown = (e) => {
      const s = statusRef.current;
      if (s === STATUS.RUNNING) {
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || NON_STOP_KEYS.has(e.key)) return;
        if (e.code === 'Space') e.preventDefault();
        stopTimer();
        return;
      }

      if (e.code !== 'Space') return;
      if (!optsRef.current.enabled) return;
      if (TEXT_FIELD.test(e.target?.tagName ?? '')) return;

      e.preventDefault();
      if (e.repeat) return;
      beginHold();
    };

    const onKeyUp = (e) => {
      if (e.code !== 'Space') return;
      const s = statusRef.current;
      if (s === STATUS.READY) {
        e.preventDefault();
        startTimer();
      } else if (s === STATUS.HOLDING) {
        e.preventDefault();
        cancelHold();
      }
    };

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse') return;
      const s = statusRef.current;

      if (s === STATUS.RUNNING) {
        pointersRef.current.add(e.pointerId);
        setTouches(pointersRef.current.size);
        lockRef.current = true;
        stopTimer();
        return;
      }

      if (!optsRef.current.enabled) return;
      if (e.target instanceof Element && e.target.closest(IGNORE_SELECTOR)) return;

      pointersRef.current.add(e.pointerId);
      setTouches(pointersRef.current.size);
      if (lockRef.current) return;
      if (pointersRef.current.size >= needed()) beginHold();
    };

    const onPointerUp = (e) => {
      if (e.pointerType === 'mouse') return;
      if (!pointersRef.current.delete(e.pointerId)) return;

      setTouches(pointersRef.current.size);
      if (pointersRef.current.size === 0) lockRef.current = false;

      if (pointersRef.current.size < needed()) {
        const s = statusRef.current;
        if (s === STATUS.READY) startTimer();
        else if (s === STATUS.HOLDING) cancelHold();
      }
    };
    const releaseAll = () => {
      if (pointersRef.current.size === 0 && !lockRef.current) return;
      pointersRef.current.clear();
      lockRef.current = false;
      setTouches(0);
      const s = statusRef.current;
      if (s === STATUS.READY) startTimer();
      else if (s === STATUS.HOLDING) cancelHold();
    };
    const onTouchEnd = (e) => {
      if (e.touches.length === 0) releaseAll();
    };

    const onBlur = () => {
      pointersRef.current.clear();
      lockRef.current = false;
      setTouches(0);
      cancelHold();
    };
    const onContextMenu = (e) => {
      if (window.matchMedia?.('(pointer: coarse)').matches) e.preventDefault();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('blur', onBlur);
    window.addEventListener('contextmenu', onContextMenu);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('contextmenu', onContextMenu);
      clearTimeout(holdTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [beginHold, cancelHold, startTimer, stopTimer]);

  return { status, elapsed, touches };
}
