## Why

When solver speed is set to Instant (0ms) or when running deep lookahead strategies (such as Perfect DFS), solver step execution and winnability evaluation execute synchronously on the main JavaScript thread. On complex deals, processing up to 250 solver steps or thousands of DFS state nodes locks up the browser event loop, creating noticeable UI freezes and input lag without any visual feedback indicating that calculation is in progress.

## What Changes

- Convert instant solver execution (`speedMs === 0` / step to conclusion) from a blocking synchronous loop to an asynchronous micro-task/chunked execution model.
- Add an explicit visual "Thinking" indicator badge (`🔮 Divining path...`) inside the Debug & Autoplay panel when instant solver execution or background calculations are running.
- Disable solver action buttons (Step, Strategy selection) while solver calculations are in progress to prevent duplicate trigger clicks.
- Shift winnability analysis evaluation out of synchronous component rendering into an asynchronous background effect to preserve 60 FPS UI performance during card interactions.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `debug-autoplay-panel`: Add requirements for non-blocking asynchronous solver execution, background winnability evaluation, and a visual "Thinking" indicator state in the Debug UI panel.

## Impact

- `src/hooks/useAutoplay.ts`: Updated to execute instant moves asynchronously using micro-tasks/frame chunking with an exposed `isThinking` status state.
- `src/components/DebugPanel.tsx`: Updated to render the thinking badge during active calculations, disable controls while computing, and consume non-blocking winnability status.
- `src/solver.ts`: Enhanced or wrapped with async helper utilities to allow asynchronous yielding during multi-step graph evaluation.
