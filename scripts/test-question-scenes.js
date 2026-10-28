const { test } = require('node:test');
const assert = require('node:assert/strict');
const { diagramFor } = require('../backend/question-diagrams');
const svg = d => Buffer.from(d.src.split(',')[1],'base64').toString();
const examples = [
  ['The clock shows half past 3. What time is it?','clock'],
  ['How many minutes are between 3:15 and 4:30?','elapsed-time'],
  ['An angle measures 60°. What type of angle is it?','angle'],
  ['What is the ordinal number for position 5?','ordinal'],
  ['What is 2/5 as a decimal? (Round to 2 decimals)','fraction'],
  ['What comes next in this pattern: 2, 4, 6, 8?','pattern'],
  ['Maria has ₱20. Maria buys bread for ₱8. How much is left?','money'],
  ['A pencil is 12 cm long. Another pencil is 8 cm long. What is their total length?','measurement'],
  ['In a bag with 10 marbles, 3 are red. What is the probability of drawing a red marble?','probability'],
  ['In a bar graph, Apples shows 12 and Oranges shows 8. What is the difference?','chart'],
  ['What is 3 × 4?','equal-groups'],
  ['What is 12 ÷ 3?','sharing'],
  ['Maria has 3 apples and 2 oranges. How many fruits does she have in total?','story']
];
for (const [question,kind] of examples) test(`${kind} uses the matching illustration`, () => {
  // A throwing getter catches accidental use of the solution to build a scene.
  const item = {question, get correctAnswer() {throw new Error('Answer must not be read');}};
  const diagram = diagramFor(item);
  assert.equal(diagram.kind,kind);
  assert.doesNotMatch(svg(diagram), /undefined|NaN|<script/);
});
test('multiplication draws exactly three groups of four objects', () => {
  const diagram = diagramFor({question:'What is 3 × 4?'});
  assert.equal((svg(diagram).match(/<circle r="18"/g)||[]).length,12);
  assert.doesNotMatch(svg(diagram), />12<\/text>/);
});
test('division leaves groups unanswered', () => {
  const markup=svg(diagramFor({question:'What is 12 ÷ 3?'}));
  assert.equal((markup.match(/>\?<\/text>/g)||[]).length,3);
  assert.doesNotMatch(markup, />4<\/text>/);
});
test('fraction identification renders every option, not only the target', () => {
  const diagram=diagramFor({question:'Which shape shows 1/4?',options:['Half shaded','Quarter shaded','Full shaded','Empty']});
  assert.equal(diagram.kind,'fraction-options');
  assert.equal((svg(diagram).match(/height="48"/g)||[]).length,8);
});
test('money amounts appear once rather than being repeated in generic number cards', () => {
  const markup=svg(diagramFor({question:'Maria has ₱20 and Juan has ₱15. How much do they have together?'}));
  assert.equal((markup.match(/₱20/g)||[]).length,1);
  assert.equal((markup.match(/₱15/g)||[]).length,1);
});
