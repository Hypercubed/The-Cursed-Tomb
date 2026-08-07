## 1. Type & Navigation Updates

- [x] 1.1 Update `RulesTab` union type and `VALID_TABS` array in `src/components/RulesModal.tsx` to include `'standard-pyramid'`
- [x] 1.2 Add "Standard Pyramid" tab button (`<span>🔺</span> Standard Pyramid`) to the modal navigation header in `src/components/RulesModal.tsx`

## 2. Content Section Implementation

- [x] 2.1 Add the `activeTab === 'standard-pyramid'` content section rendering logic to `src/components/RulesModal.tsx`
- [x] 2.2 Render the Standard Pyramid overview banner and card grid covering layout (28 cards, 7 rows), card values & target sum 13, and stock draw & redeals
- [x] 2.3 Add the Standard Pyramid vs. *The Cursed Tomb* comparison matrix grid

## 3. Testing & Verification

- [x] 3.1 Update unit tests in `src/components/RulesModal.test.ts` to assert that `RulesTab` supports 4 tabs including `standard-pyramid`
- [x] 3.2 Run test suite to verify all rules modal tests pass cleanly
