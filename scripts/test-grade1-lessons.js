const {test}=require('node:test');
const assert=require('node:assert/strict');
const {grade1Quarters}=require('./seed-grade1-quarters');
const {makeGrade1Question,lessons}=require('../backend/grade1-lessons');
const {renderGrade1Illustration}=require('../backend/grade1-illustrations');
const Generator=require('../backend/curriculum-question-generator');
const {addQuestionDiagrams}=require('../backend/question-diagrams');
const topics=Object.entries(grade1Quarters).flatMap(([quarter,items])=>items.map(item=>({...item,grade:1,quarter:Number(quarter.replace('quarter',''))})));
test('all 75 Grade 1 lessons have a dedicated task and matching renderer',()=>{
  assert.equal(topics.length,75);
  assert.equal(Object.keys(lessons).length,75);
  for(const topic of topics)for(let i=0;i<100;i++){
    const q=makeGrade1Question(topic,i*137+19,i);
    assert.ok(q.reviewedSkill,topic.topic_code);
    assert.equal(q.practiceUntimed,true);
    assert.ok(q.explanation);
    assert.doesNotMatch(q.question,/\b(NaN|undefined|GEMDAS|decimal|probability)\b/i);
    const d=renderGrade1Illustration(q.illustration);
    const svg=Buffer.from(d.src.split(',')[1],'base64').toString();
    assert.doesNotMatch(svg,/NaN|undefined|<script/);
    assert.ok(svg.endsWith('</svg>'));
    if(q.options){assert.ok(q.options.length>=2&&q.options.length<=4);assert.equal(new Set(q.options).size,q.options.length);assert.notEqual(q.options[q.correctAnswer],undefined);}
    else assert.ok(Number.isFinite(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<=100,JSON.stringify(q));
  }
});
test('two-digit lessons preserve operand size, carry and borrow requirements',()=>{
  const cases=topics.filter(t=>/G1-Q2-NA-(06|07|13|14|15)$|G1-Q3-Quiz-01$/.test(t.topic_code));
  for(const topic of cases)for(let i=0;i<250;i++){
    const q=makeGrade1Question(topic,i*53,i),v=q.illustration;
    assert.ok(v.a>=10&&v.a<100);
    if(/-(06|13)$/.test(topic.topic_code))assert.ok(v.b>=1&&v.b<=9);
    else assert.ok(v.b>=10&&v.b<100);
    const regroup=topic.topic_code==='G1-Q3-Quiz-01';
    if(v.operation==='+'){
      assert.equal(q.correctAnswer,v.a+v.b);assert.ok(q.correctAnswer<=100);
      assert.ok(regroup?v.a%10+v.b%10>=10:v.a%10+v.b%10<10);
    }else{assert.equal(q.correctAnswer,v.a-v.b);assert.ok(v.a%10>=v.b%10);}
  }
});
test('arithmetic, missing parts, money and calendar answer keys agree with their visuals',()=>{
  for(const topic of topics)for(let i=0;i<40;i++){
    const q=makeGrade1Question(topic,i*137+7,i),v=q.illustration;
    const answer=q.options?q.options[q.correctAnswer]:q.correctAnswer;
    if(v.kind==='arithmetic'&&q.reviewedSkill!=='add-properties')assert.equal(answer,v.operation==='+'?v.a+v.b:v.a-v.b);
    if(v.kind==='parts')assert.equal(answer,v.total-v.known);
    if(v.kind==='money'&&!q.options)assert.equal(answer,v.values.reduce((s,n)=>s+n,0));
    if(v.kind==='money-story')assert.equal(answer,v.a-v.b);
    if(v.kind==='calendar')assert.equal(answer,['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][(v.offset+v.date-1)%7]);
    if(v.kind==='clock'&&q.options)assert.equal(answer,`${v.hour}:${String(v.minute).padStart(2,'0')}`);
  }
});
test('addition properties remain identity/commutative tasks rather than ordinary sums',()=>{
  const topic=topics.find(t=>t.topic_code==='G1-Q1-NA-09');
  for(let i=0;i<40;i++)assert.match(makeGrade1Question(topic,i).question,/\+ 0|missing/);
});
test('repeated practice remains available without duplicate tasks inside a quiz',()=>{
  const generator=new Generator();
  for(const topic of topics){
    for(let session=0;session<2;session++){
      const questions=generator.generateQuestionsForTopic(topic,10,0,'hard');
      assert.ok(questions.length>0,topic.topic_code);
      assert.equal(new Set(questions.map(q=>q.signature)).size,questions.length);
      assert.ok(questions.every(q=>q.reviewedSkill&&q.difficulty==='easy'));
    }
  }
});
test('reviewed Grade 1 illustrations need no provider call, even when a key is configured',async()=>{
  const q=makeGrade1Question(topics[0],19);
  const [result]=await addQuestionDiagrams([q],{apiKey:'test-only',fetchImpl:async()=>{throw new Error('Provider must not be called');}});
  assert.match(result.diagram.kind,/^grade1-/);
});
