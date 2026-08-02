import { canRemovePair, Card, getFunctionalValue } from './src/game';

console.log('--- Testing Pair Evaluation for J (11) and 2 ---');

const cardJ: Card = {
  id: '♦11',
  suit: '♦',
  rank: 11,
  removed: false,
  selected: false,
  attritionStage: 0,
  rewardStage: 0,
  blessed: false,
  faceDown: false,
};

const card2: Card = {
  id: '♣2',
  suit: '♣',
  rank: 2,
  removed: false,
  selected: false,
  attritionStage: 2,
  rewardStage: 0,
  blessed: false,
  faceDown: false,
};

console.log('cardJ (♦11) functional value:', getFunctionalValue(cardJ, 'cursed-tomb'));
console.log('card2 (♣2) functional value:', getFunctionalValue(card2, 'cursed-tomb'));
console.log('canRemovePair(card2, cardJ, cursed-tomb):', canRemovePair(card2, cardJ, 'cursed-tomb'));

// What if cardJ has attritionStage = 1, 2, 3, 4, 5?
for (let stage = 0; stage <= 5; stage++) {
  const testJ = { ...cardJ, attritionStage: stage as any };
  const fVal = getFunctionalValue(testJ, 'cursed-tomb');
  const pairResult = canRemovePair(card2, testJ, 'cursed-tomb');
  console.log(`J at attritionStage ${stage}: functionalVal=${fVal}, canPairWith2=${pairResult}`);
}

// What if card2 has attritionStage = 0, 1, 2, 3, 4, 5?
for (let stage = 0; stage <= 5; stage++) {
  const test2 = { ...card2, attritionStage: stage as any };
  const fVal = getFunctionalValue(test2, 'cursed-tomb');
  const pairResult = canRemovePair(test2, cardJ, 'cursed-tomb');
  console.log(`2 at attritionStage ${stage}: functionalVal=${fVal}, canPairWithJ=${pairResult}`);
}
