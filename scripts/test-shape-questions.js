const { test } = require('node:test');
const assert = require('node:assert/strict');
const Generator = require('../backend/curriculum-question-generator');

test('shape identification always has exactly one correct option', () => {
  const generator = new Generator();
  const sides = { Circle: 0, Triangle: 3, Square: 4, Rectangle: 4, Pentagon: 5, Hexagon: 6 };
  const seen = new Set();
  for (let grade = 1; grade <= 6; grade++) {
    for (let index = 0; index < 180; index++) {
      const question = generator.generateShapeQuestion(grade, index, 'identify 2d shapes');
      const match = question.question.match(/^Which shape has (\d+) sides?\?$/);
      if (!match) continue;
      const target = Number(match[1]);
      const valid = question.options.filter(option => sides[option] === target);
      assert.equal(valid.length, 1, JSON.stringify(question));
      assert.equal(question.options[question.correctAnswer], valid[0]);
      assert.ok(question.options.length >= 3);
      seen.add(valid[0]);
    }
  }
  assert.deepEqual([...seen].sort(), Object.keys(sides).sort());
});
