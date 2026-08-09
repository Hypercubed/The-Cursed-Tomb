export const DEBUG_STORAGE_KEY = 'tomb:showDebug';

export function getDebugDefaultVisible(): boolean {
  return import.meta.env.VITE_SHOW_DEBUG !== 'false';
}

export function resolveDebugInitialVisible(): boolean {
  const envDefault = getDebugDefaultVisible();
  try {
    const stored = localStorage.getItem(DEBUG_STORAGE_KEY);
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  } catch {
    // localStorage unavailable — fall back to default
  }
  return envDefault;
}

export function persistDebugVisible(next: boolean): void {
  try {
    localStorage.setItem(DEBUG_STORAGE_KEY, String(next));
  } catch {
    // ignore write errors (private mode, quota, etc.)
  }
}

export function printDebugInstructions(isVisible: boolean): void {
  const envVal = import.meta.env.VITE_SHOW_DEBUG ?? '(unset → true)';
  const status = isVisible ? 'VISIBLE' : 'HIDDEN';
  // Styled header + status line. Keep one call for header style, plain lines for actions so copy-paste works.
  console.info(
    `%c\u1313 The Cursed Tomb \u2014 Debug %c${status}  (VITE_SHOW_DEBUG=${envVal})`,
    'color:#f59e0b; font-weight:bold; font-size:12px;',
    'color:inherit; font-weight:normal; font-size:12px;'
  );
  if (isVisible) {
    console.info(
      'Debug panel is VISIBLE.  Disable: tombDebug.disable()  |  Toggle: tombDebug.toggle()  |  Help: tombDebug.help()'
    );
  } else {
    console.info(
      'Debug panel is HIDDEN.  Enable: tombDebug.enable()  |  Toggle: tombDebug.toggle()  |  Help: tombDebug.help()'
    );
  }
}
