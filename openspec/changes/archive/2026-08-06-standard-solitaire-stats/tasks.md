## 1. Sidebar Stats Display

- [x] 1.1 Update `GameSidebar.tsx` to render a "Standard Career" statistics section when `gameMode === 'standard'`, displaying Total Games Played, Clear Rate %, Complete/Partial Victories, Pyramids Collapsed, Current Win Streak, and Best Win Streak.
- [x] 1.2 Verify `GameSidebar.test.tsx` or related unit tests pass with standard solitaire stats rendered.

## 2. Deck Matrix Modal Stats Panel

- [x] 2.1 Update `MatchedCardsModal.tsx` props to accept `stats?: StoredStats`.
- [x] 2.2 Thread `stats={stats}` from `App.tsx` into `MatchedCardsModal`.
- [x] 2.3 Add a "Standard Solitaire Career Metrics" summary card section in `MatchedCardsModal.tsx` when `mode === 'standard'` and `stats` is available.

## 3. Round Summary Modal Stats & Streaks

- [x] 3.1 Update `RoundSummaryModal.tsx` to accept `stats?: StoredStats` or render standard career outcome metrics and streak updates when `mode === 'standard'`.
- [x] 3.2 Thread `stats={stats}` from `App.tsx` into `RoundSummaryModal`.

## 4. Verification & Testing

- [x] 4.1 Run test suite (`npm test`) to ensure all component and storage tests pass.
- [x] 4.2 Validate full change using `openspec validate`.
