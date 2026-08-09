import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEBUG_STORAGE_KEY,
  persistDebugVisible,
  printDebugInstructions,
  resolveDebugInitialVisible,
} from '../utils/debug';

export function useDebugVisible() {
  const [visible, setVisible] = useState<boolean>(() => resolveDebugInitialVisible());
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const enable = useCallback(() => {
    setVisible(true);
    persistDebugVisible(true);
  }, []);

  const disable = useCallback(() => {
    setVisible(false);
    persistDebugVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => {
      const next = !prev;
      persistDebugVisible(next);
      return next;
    });
  }, []);

  const isEnabled = useCallback(() => visibleRef.current, []);

  const help = useCallback(() => {
    printDebugInstructions(visibleRef.current);
  }, []);

  // Expose window.tombDebug with stable closure via ref
  useEffect(() => {
    const api: TombDebug = {
      enable,
      disable,
      toggle,
      isEnabled,
      help,
    };
    window.tombDebug = api;
    return () => {
      if (window.tombDebug === api) {
        delete window.tombDebug;
      }
    };
  }, [enable, disable, toggle, isEnabled, help]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== DEBUG_STORAGE_KEY) return;
      if (e.newValue === 'true') setVisible(true);
      else if (e.newValue === 'false') setVisible(false);
      else if (e.newValue === null) {
        // cleared — fall back to no-override? keep current to avoid flicker; or re-resolve
        // Re-resolve so env default applies after clear
        setVisible(resolveDebugInitialVisible());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return { visible, enable, disable, toggle, isEnabled, help };
}
