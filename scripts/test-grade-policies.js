const {test}=require('node:test');
const assert=require('node:assert/strict');
const Generator=require('../backend/curriculum-question-generator');
const generator=new Generator();
for(let grade=1;grade<=6;grade++) {
  test(`Grade ${grade} arithmetic and money respect lesson and grade bounds`,()=>{
    const cap=generator.getGradeNumberRange(grade,null,'up to 1000000');
    for(const difficulty of ['easy','medium','hard']) for(let i=0;i<70;i++) {
      for(const method of ['generateAdditionQuestion','generateSubtractionQuestion','generateMoneyQuestion','generateDefaultQuestion','generateProblemSolvingQuestion']) {
        const q=generator[method](grade,i,'up to 1000000',difficulty);
        if(q.type==='number') assert.ok(q.correctAnswer>=0&&q.correctAnswer<=cap,JSON.stringify({grade,method,q}));
      }
      for(const method of ['generateAdditionQuestion','generateSubtractionQuestion']) {
        const q=generator[method](grade,i,'up to 20',difficulty);
        if(q.type==='number') assert.ok(q.correctAnswer>=0&&q.correctAnswer<=20,JSON.stringify(q));
      }
    }
  });
}
test('specific topics do not route into whole-number recognition',()=>{
  for(const [grade,outcome,skill] of [[4,'recognize and represent fractions','Fractions'],[4,'represent decimal numbers','Decimal Place Value'],[6,'relate ratio with fractions and decimals','Ratios']]) {
    const q=generator.generateQuestionFromLearningOutcome(outcome,'Number Sense',grade,'',25,0,'easy');
    assert.ok(q.question);
    if(skill==='Fractions') assert.match(q.question,/\//);
    else assert.equal(q.skill,skill);
  }
});
test('fraction and probability choices have exactly one equivalent correct answer',()=>{
  for(let i=0;i<150;i++) for(const q of [generator.generateFractionQuestion(4,i,'fractions in simplest form'),generator.generateProbabilityQuestion(5,i,''),generator.generateFractionOperationQuestion(6,i,'multiplication and division of fractions')]) {
    const correct=q.options[q.correctAnswer];
    assert.ok(correct);
    const [n,d]=correct.split('/').map(Number);
    assert.ok(d>0);
    assert.equal(q.options.filter(option=>{const [a,b]=option.split('/').map(Number);return b>0&&a*d===n*b;}).length,1,JSON.stringify(q));
  }
});
test('combined addition/subtraction lessons generate both operations',()=>{
  const add=generator.generateQuestionFromLearningOutcome('add and subtract whole numbers','Operations',3,'',25,0,'easy');
  const sub=generator.generateQuestionFromLearningOutcome('add and subtract whole numbers','Operations',3,'',25,1,'easy');
  assert.match(add.skill,/Addition/);
  assert.match(sub.skill,/Subtraction/);
});
test('grade validation rejects invalid requests instead of silently using another grade',()=>{
  for(const grade of [0,7,'bad']) assert.throws(()=>generator.generateQuestionsForTopic({grade},1),/grade/);
});
