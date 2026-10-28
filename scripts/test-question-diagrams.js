const { test } = require('node:test');
const assert = require('node:assert/strict');
const { diagramFor, addQuestionDiagrams } = require('../backend/question-diagrams');
const svg = diagram => Buffer.from(diagram.src.split(',')[1], 'base64').toString();

test('arithmetic draws exact operands without computing an answer', () => {
  const diagram = diagramFor({ question: 'What is 3 + 5?', correctAnswer: 8 });
  const markup = svg(diagram);
  assert.equal((markup.match(/<circle r="18"/g) || []).length, 8);
  assert.equal(diagram.kind, 'arithmetic');
  assert.doesNotMatch(markup, />8<|= 8/);
});

test('preserves fractions, decimals, negative values and grouped thousands', () => {
  const diagram = diagramFor({ question: 'Compare -2.5, 1/4 and 1,200.' });
  assert.match(diagram.alt, /-2\.5, 1\/4, 1,200/);
  assert.doesNotMatch(svg(diagram), />●<\/text>/);
});

test('large numbers do not become misleading truncated sets', () => {
  const markup = svg(diagramFor({ question: 'What is 100 + 200?' }));
  assert.match(markup, />× 100<\/text>/);
  assert.doesNotMatch(markup, />●<\/text>/);
});

test('fraction bars shade exactly the given numerator', () => {
  const markup = svg(diagramFor({ question: 'What is 2/5 as a decimal?' }));
  assert.equal((markup.match(/height="48" fill="#818cf8"/g) || []).length, 2);
  assert.equal((markup.match(/height="48" fill="#fff"/g) || []).length, 3);
  assert.doesNotMatch(markup, /0\.4/);
});

test('unnamed shapes without options are not guessed from the answer', () => {
  const markup = svg(diagramFor({ question: 'Which shape has three sides?', correctAnswer: 'triangle' }));
  assert.match(markup, /Picture the situation/);
  assert.doesNotMatch(markup, /triangle|polygon/);
});

test('zero-sided identification shows all candidate shapes instead of zero cards', () => {
  const diagram = diagramFor({ question: 'Which shape has 0 sides?', options: ['Circle', 'Triangle', 'Square', 'Rectangle'], correctAnswer: 0 });
  const markup = svg(diagram);
  assert.match(markup, /<circle /);
  assert.match(markup, /<polygon /);
  for (const name of ['Circle', 'Triangle', 'Square', 'Rectangle']) assert.ok(markup.includes(`>${name}</text>`));
  assert.doesNotMatch(markup, />0<\/text>/);
});

test('named geometry and comparisons show the figures in the question', () => {
  assert.match(svg(diagramFor({ question: 'How many corners does a Triangle have?' })), /points="90,30 25,150 155,150"/);
  const comparison = svg(diagramFor({ question: 'Which shape has more sides: a Circle or a Hexagon?' }));
  assert.match(comparison, /<circle /);
  assert.match(comparison, />Hexagon<\/text>/);
});

test('four-sided identification includes both square and rectangle candidates', () => {
  const diagram = diagramFor({ question: 'Which shape has 4 sides?', options: ['Square', 'Circle', 'Rectangle', 'Triangle'], correctAnswer: 0 });
  assert.match(diagram.alt, /square, circle, rectangle, triangle/);
});

test('offline mode makes no provider request and preserves the question', async () => {
  const question = { question: 'What is 2 + 3?', correctAnswer: 5, options: [4, 5] };
  const [result] = await addQuestionDiagrams([question], { apiKey: '', fetchImpl: () => { throw new Error('Must not call'); } });
  assert.equal(result.correctAnswer, question.correctAnswer);
  assert.deepEqual(result.options, question.options);
  assert.ok(result.diagram.src.startsWith('data:image/svg+xml;base64,'));
  assert.equal(question.diagram, undefined);
});

test('provider receives only question text and valid themes affect objects', async () => {
  const [result] = await addQuestionDiagrams([{ question: 'What is 2 + 3?', correctAnswer: 5, studentName: 'Private' }], {
    apiKey: 'test-only', fetchImpl: async (url, request) => {
      const body = JSON.parse(request.body);
      assert.equal(url, 'https://api.deepseek.com/chat/completions');
      assert.doesNotMatch(body.messages[1].content, /correctAnswer|Private|studentName/);
      return { ok: true, json: async () => ({ choices: [{ message: { content: '{"themes":["books"]}' } }] }) };
    }
  });
  assert.equal((svg(result.diagram).match(/width="34" height="42"/g) || []).length, 5);
});

test('invalid themes and failed requests cannot inject SVG or break questions', async () => {
  const questions = [{ question: 'What is 1 + 2?' }];
  for (const fetchImpl of [
    async () => { throw new Error('timeout'); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: 'invalid json' } }] }) }),
    async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: '{"themes":["<script>alert(1)</script>"]}' } }] }) })
  ]) {
    const [result] = await addQuestionDiagrams(questions, { apiKey: 'test-only', fetchImpl });
    assert.doesNotMatch(svg(result.diagram), /<script/);
    assert.equal((svg(result.diagram).match(/<circle r="18"/g) || []).length, 3);
  }
});
