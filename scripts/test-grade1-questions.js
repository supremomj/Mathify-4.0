const { test } = require('node:test');
const assert = require('node:assert/strict');
const Generator = require('../backend/curriculum-question-generator');
test('Grade 1 fallback and problem-solving never generate multiplication or answers beyond 20', () => {
  const generator = new Generator();
  for (let i=0;i<150;i++) {
    for (const method of ['generateDefaultQuestion','generateProblemSolvingQuestion','generateGEMDASQuestion']) {
      const q = generator[method](1,i,'up to 100','hard');
      assert.ok(q.correctAnswer >= 0 && q.correctAnswer <= 20, JSON.stringify(q));
      assert.doesNotMatch(q.question, /packs|×|÷|GEMDAS|True or False|___/);
      const numbers = q.question.match(/\d+/g) || [];
      assert.ok(numbers.every(n => +n <= 20));
    }
  }
});
test('Grade 1 hard requests are normalized to easy, with bounded arithmetic', () => {
  const generator = new Generator();
  for (const grade of [1,'1']) {
    Generator.clearAllRegistries();
    const questions = generator.generateQuestionsForTopic({grade,category:'Operations',learning_outcome:'addition up to 100'},10,0,'hard');
    assert.equal(questions.length,10);
    for (const q of questions) {
      assert.equal(q.difficulty,'easy');
      assert.ok(q.correctAnswer<=20);
    }
  }
});
test('higher grades retain requested difficulty', () => {
  const generator = new Generator();
  const [question] = generator.generateQuestionsForTopic({grade:3,category:'Operations',learning_outcome:'addition'},1,0,'hard');
  assert.equal(question.difficulty,'hard');
});
