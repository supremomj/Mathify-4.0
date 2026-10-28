const { test } = require('node:test');
const assert = require('node:assert/strict');
const Generator = require('../backend/curriculum-question-generator');
const generator = new Generator();
const cases = [
  [2, 'Read and write numerals up to 1000', 'Number Sense', /numerals/],
  [3, 'Determine the place value of a digit in a 4-digit number', 'Number Sense', /place/],
  [3, 'Find the areas of squares and rectangles in square centimeters', 'Measurement', /area/],
  [2, 'Measure lengths in centimeters', 'Measurement', /length/],
  [2, 'Divide numbers using the 2, 3, 4, 5, and 10 multiplication tables', 'Operations', /÷|share|divid/i],
  [5, 'Multiply a fraction by a fraction', 'Fractions', /×/],
  [6, 'Divide fractions and mixed numbers', 'Fractions', /÷/],
  [6, 'Identify and write equivalent ratios', 'Ratio and Proportion', /ratio/],
  [5, 'Calculate the theoretical probability of an event', 'Probability', /probability/],
  [5, 'Find the surface area of solid figures', 'Measurement', /surface area/],
  [6, 'Convert cubic centimeters to liters', 'Measurement', /liters/],
  [6, 'Convert square centimeters to square meters', 'Measurement', /square/],
  [6, 'Find circumference of circles', 'Measurement', /circumference/],
  [5, 'Compare world time zones', 'Measurement', /City B/],
  [4, 'Apply MDAS rules', 'Operations', /×/],
  [2, 'Represent unit fractions', 'Number Sense', /equal parts/],
  [3, 'Estimate and compare capacity', 'Measurement', /milliliters/]
];
for (const [grade, outcome, category, expected] of cases) test(`${grade}: ${outcome}`, () => {
  for (let i = 0; i < 20; i++) {
    const q = generator.generateQuestionFromLearningOutcome(outcome, category, grade, 'test', i, i, 'easy');
    assert.match(q.question, expected);
    assert.ok(q.correctAnswer !== undefined);
    if (q.options) {
      assert.equal(new Set(q.options).size, q.options.length);
      assert.ok(q.options[q.correctAnswer] !== undefined);
    }
  }
});
test('fraction subtraction respects both denominators and stays nonnegative', () => {
  for (let i = 0; i < 200; i++) {
    const q = generator.generateFractionOperationQuestion(5, i, 'subtract dissimilar fractions');
    const m = q.question.match(/(\d+)\/(\d+) - (\d+)\/(\d+)/);
    assert.ok(m);
    const answer = q.options[q.correctAnswer].split('/').map(Number);
    const expected = Number(m[1])/Number(m[2]) - Number(m[3])/Number(m[4]);
    assert.ok(Math.abs(answer[0]/answer[1] - expected) < 1e-10);
    assert.ok(expected >= 0);
  }
});
test('decimal multiplication and division never become addition on alternate indices', () => {
  for (let i = 0; i < 40; i++) {
    for (const [outcome, symbol] of [['multiplication of decimals', '×'], ['division of decimals', '÷']]) {
      const q = generator.generateDecimalQuestion(6, i, outcome);
      assert.ok(q.question.includes(symbol));
    }
  }
});
test('large numeral reading uses words rather than the answer in digits', () => {
  assert.equal(generator.numberToWords(123456), 'one hundred twenty-three thousand four hundred fifty-six');
  assert.equal(generator.numberToWords(1000000), 'one million');
});
test('pie and double graphs render given data and calculate answers from that data', () => {
  const { diagramFor } = require('../backend/question-diagrams');
  for (let i=0;i<20;i++) for (const outcome of ['Find angle measures for pie graphs', 'Interpret double bar graphs']) {
    const q = generator.generateQuestionFromLearningOutcome(outcome, 'Data', 6, 'test', i, i, 'easy');
    const v=q.lessonVisual.values;
    const expected=q.lessonVisual.type==='pie' ? (i%2===0?360:100)*v[0]/(v[0]+v[1]) : v[1]+v[3];
    assert.ok(Math.abs(q.correctAnswer-expected)<1e-9);
    const diagram=diagramFor(q);
    assert.ok(diagram.src.startsWith('data:image/svg+xml;base64,'));
    assert.ok(!diagram.alt.includes('answer'));
    for (const value of v) assert.ok(diagram.alt.includes(String(value)));
  }
});
