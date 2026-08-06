type VibrationPattern = number | number[];

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

function vibrate(pattern: VibrationPattern): void {
  if (!canVibrate()) return;

  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers expose vibrate but reject it outside a user gesture.
  }
}

export function hapticTap(): void {
  vibrate(12);
}

export function hapticMatch(): void {
  vibrate([20, 40, 20]);
}

export function hapticError(): void {
  vibrate([10, 30, 10, 30, 10]);
}
