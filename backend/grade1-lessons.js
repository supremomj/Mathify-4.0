// Reviewed tasks for the 75 Grade 1 lesson IDs in the stored curriculum.
// Each task carries the visual data that produced its answer: no text guessing.
const lessons = {};
function register(prefix, mapping) { for (const [suffix,skill] of Object.entries(mapping)) lessons[`${prefix}${suffix}`]=skill; }
register('G1-Q1-MG-',{'01':'shape-name','02':'shape-compare','03':'shape-compose'});
register('G1-Q1-NA-',{'01':'count-step','02':'numeral','03':'represent','04':'compare20','05':'order20','06':'ordinal','07':'number-parts','08':'add20','09':'add-properties','10':'add-story20'});
register('G1-Q2-MG-',{'01':'length-read','02':'length-compare','03':'length-problem','04':'turn','05':'clock','06':'calendar-order','07':'calendar','08':'time-problem'});
register('G1-Q2-DP-',{'01':'collect-data','02':'make-pictograph','03':'read-pictograph','04':'table-data'});
register('G1-Q2-NA-',{'01':'place-value','02':'tens-ones','03':'skip-count','04':'order100','05':'add-expanded','06':'add21','07':'add22','08':'add-story100','09':'subtract20','10':'missing','11':'equivalent','12':'subtract-story20','13':'subtract21','14':'subtract22','15':'subtract-expanded','16':'pattern','17':'make-pattern','18':'fraction','19':'fraction-compare','20':'fraction-count','21':'money-name','22':'money-count','23':'money-compare','24':'money-story'});
register('G1-Q3-Quiz-',{'01':'add-regroup','02':'subtract100','03':'mixed20','04':'half','05':'quarter','06':'fraction-compare','07':'bill','08':'money-count','09':'money-story','10':'length-read','11':'length-compare','12':'days','13':'months','14':'calendar'});
register('G1-Q4-Quiz-',{'01':'read-pictograph','02':'make-pictograph','03':'shape-pattern','04':'number-pattern','05':'add-story20','06':'subtract-story20','07':'mixed-story','08':'number-review','09':'mixed100','10':'shape-review','11':'money-time-review','12':'review'});
const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const shapes=['Triangle','Rectangle','Square'];
const smallWords=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
function words(n) { if(n<20)return smallWords[n]; if(n===100)return 'one hundred';return ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'][Math.floor(n/10)]+(n%10?`-${smallWords[n%10]}`:''); }
function makeGrade1Question(topic, seed, questionNumber=0) {
  const skill=lessons[topic.topic_code];
  if(!skill)return null;
  let state=(Math.abs(seed)+1)>>>0;
  const rand=(min,max)=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return min+state%(max-min+1);};
  const pick=list=>list[rand(0,list.length-1)];
  const finish=(q,answer,visual,explanation)=>({question:q,type:'number',correctAnswer:answer,illustration:visual,explanation,reviewedSkill:skill,practiceUntimed:true});
  const choice=(q,answer,options,visual,explanation)=>{
    const unique=[...new Set([answer,...options])].slice(0,4);
    for(let i=unique.length-1;i>0;i--){const j=rand(0,i);[unique[i],unique[j]]=[unique[j],unique[i]];}
    return {...finish(q,unique.indexOf(answer),visual,explanation),type:'multiple-choice',options:unique};
  };
  function build(kind) {
    const n=rand(1,100), a=rand(1,9), b=rand(1,9);
    if(kind==='review')return build(pick(['represent','add20','subtract20','clock','money-count','shape-name','read-pictograph','pattern']));
    if(kind==='number-review')return build(pick(['count-step','numeral','represent','order100','tens-ones']));
    if(kind==='shape-review')return build(questionNumber%2?'shape-pattern':'shape-name');
    if(kind==='money-time-review')return build(questionNumber%2?'clock':'money-count');
    if(kind==='mixed20'||kind==='mixed-story'||kind==='mixed100')return build(questionNumber%2?(kind==='mixed100'?'subtract100':'subtract-story20'):(kind==='mixed100'?'add-regroup':'add-story20'));
    if(kind==='shape-name'){
      const name=pick(shapes);
      return choice('What is the name of this shape?',name,shapes,{kind:'shape',name,rotation:pick([0,90,180,270]),size:rand(80,120)},`This is a ${name.toLowerCase()}.`);
    }
    if(kind==='shape-compare'){
      const first=pick(shapes), other=first==='Triangle'?pick(['Square','Rectangle']):'Triangle';
      const more=rand(0,1)===1;
      const answer=more?(first==='Triangle'?other:first):(first==='Triangle'?first:other);
      return choice(`Which shape has ${more?'more':'fewer'} sides?`,answer,[first,other],{kind:'shapes',names:[first,other]},'A triangle has 3 sides. A square or rectangle has 4 sides.');
    }
    if(kind==='shape-compose'){
      const name=pick(['Square','Rectangle']);
      return choice('Two matching triangles fit together. What shape do they make?',name,shapes,{kind:'compose',name,rotation:pick([0,90,180,270])},`The two triangles make a ${name.toLowerCase()}.`);
    }
    if(kind==='count-step'){
      const value=rand(1,99), up=rand(0,1)===1;
      return finish(`What number is 1 ${up?'more':'less'} than ${value}?`,value+(up?1:-1),{kind:'number-line',start:Math.max(0,value-2),end:Math.min(100,value+2),value,direction:up?1:-1},`Count one step ${up?'forward':'back'} from ${value}.`);
    }
    if(kind==='numeral')return finish(`Write “${words(n)}” as a number.`,n,{kind:'base-ten',value:n},`${words(n)} is written ${n}.`);
    if(kind==='represent')return finish('What number do these tens and ones show?',n,{kind:'base-ten',value:n},`${Math.floor(n/10)} tens and ${n%10} ones make ${n}.`);
    if(kind==='compare20'){
      let x=rand(1,20), y=rand(1,20);if(x===y)y=x===20?19:x+1;
      const bigger=rand(0,1)===1;
      return choice(`Which number is ${bigger?'greater':'smaller'}?`,bigger?Math.max(x,y):Math.min(x,y),[x,y],{kind:'compare',values:[x,y]},`Compare ${x} and ${y}. ${bigger?Math.max(x,y):Math.min(x,y)} is ${bigger?'greater':'smaller'}.`);
    }
    if(kind==='order20'||kind==='order100'){
      const max=kind==='order20'?20:100, set=new Set();while(set.size<3)set.add(rand(1,max));
      const values=[...set], ascending=rand(0,1)===1, sorted=[...values].sort((x,y)=>ascending?x-y:y-x);
      return choice(`Put ${values.join(', ')} in order from ${ascending?'smallest to largest':'largest to smallest'}.`,sorted.join(', '),[values.slice().reverse().join(', '),[sorted[1],sorted[0],sorted[2]].join(', '),[sorted[0],sorted[2],sorted[1]].join(', ')],{kind:'compare',values},`The order is ${sorted.join(', ')}.`);
    }
    if(kind==='ordinal'){
      const value=rand(1,10),suffix=value===1?'st':value===2?'nd':value===3?'rd':'th';
      const ordinal=n=>`${n}${n===1?'st':n===2?'nd':n===3?'rd':'th'}`;
      return choice('Count from the left. Which ordinal position is highlighted?',ordinal(value),[ordinal(value%10+1),ordinal((value+2)%10+1),ordinal((value+4)%10+1)],{kind:'ordinal',value,total:10},`It is in position ${value}, or ${value}${suffix}.`);
    }
    if(kind==='number-parts'){
      const total=rand(2,10),known=rand(0,total);
      return finish(`${total} is ${known} and how many more?`,total-known,{kind:'parts',total,known},`${known} + ${total-known} = ${total}.`);
    }
    if(kind==='place-value'||kind==='tens-ones'){
      const value=rand(10,99),tens=rand(0,1)===1;
      if(kind==='place-value'&&questionNumber%2)return finish(`What is the value of the ${tens?'tens':'ones'} digit in ${value}?`,tens?Math.floor(value/10)*10:value%10,{kind:'base-ten',value},`The ${tens?'tens':'ones'} digit has value ${tens?Math.floor(value/10)*10:value%10}.`);
      if(kind==='tens-ones')return finish(`${value} = ${Math.floor(value/10)*10} + ___. What is missing?`,value%10,{kind:'base-ten',value},`${value} is ${Math.floor(value/10)*10} and ${value%10}.`);
      return finish(`What digit is in the ${tens?'tens':'ones'} place in ${value}?`,tens?Math.floor(value/10):value%10,{kind:'base-ten',value},`${value} has ${Math.floor(value/10)} tens and ${value%10} ones.`);
    }
    if(kind==='skip-count'){
      const step=pick([2,5,10]),start=rand(0,Math.floor(100/step)-4)*step,values=[start,start+step,start+2*step,start+3*step];
      return finish(`Count by ${step}s. What comes next?`,start+4*step,{kind:'sequence',values:[...values,'?']},`Add ${step} each time. The next number is ${start+4*step}.`);
    }
    if(/^(add|subtract)/.test(kind) && kind!=='add-properties'){
      const subtract=kind.startsWith('subtract'),large=/21|22|100|expanded|regroup/.test(kind);
      let x=a,y=b;
      if(large){
        // Choose valid 2-digit operands first, then enforce the lesson's carry/
        // borrow requirement. Never substitute small sums for a 2-digit lesson.
        for(let tries=0;tries<1000;tries++){
          x=rand(10,89);y=/21/.test(kind)?rand(1,9):rand(10,89);
          if(subtract&&y>x)[x,y]=[y,x];
          if(!subtract&&x+y>100)continue;
          if(/regroup/.test(kind)){if(x%10+y%10<10)continue;}
          else if(!/subtract100/.test(kind)&&((subtract&&x%10<y%10)||(!subtract&&x%10+y%10>=10)))continue;
          break;
        }
      }else if(subtract){x=Math.max(a,b);y=Math.min(a,b);}
      const answer=subtract?x-y:x+y;
      const story=/story/.test(kind);
      let prompt=story?(subtract?`Ana has ${x} counters. She gives away ${y}. How many are left?`:`Ana has ${x} counters. Ben gives her ${y} more. How many does she have now?`):`What is ${x} ${subtract?'-':'+'} ${y}?`;
      if(/expanded/.test(kind))prompt=`Use tens and ones. ${prompt}`;
      return finish(prompt,answer,{kind:'arithmetic',a:x,b:y,operation:subtract?'-':'+',baseTen:large},`${x} ${subtract?'-':'+'} ${y} = ${answer}.`);
    }
    if(kind==='add-properties'){
      const zero=rand(0,1)===1;
      return finish(zero?`What is ${a} + 0?`:`${a} + ${b} = ${b} + ___. What is missing?`,a,zero?{kind:'arithmetic',a,b:0,operation:'+'}:{kind:'balance',a,b,c:b},zero?`Adding zero keeps ${a} the same.`:`Changing the order of ${a} and ${b} keeps the sum the same.`);
    }
    if(kind==='missing')return finish(`${a} + ___ = ${a+b}. What number is missing?`,b,{kind:'parts',total:a+b,known:a},`${a} + ${b} = ${a+b}.`);
    if(kind==='equivalent')return finish(`${a} + ${b} = ${a-1} + ___. What number is missing?`,b+1,{kind:'balance',a,b,c:a-1},`One addend is 1 smaller, so the other is 1 larger: ${b+1}.`);
    if(/length/.test(kind)){
      let x=rand(2,10),y=rand(2,10);if(x===y)y=x===10?9:x+1;
      if(kind==='length-compare')return choice('Which ribbon is longer?',x>y?'A':'B',['A','B'],{kind:'length',values:[x,y]},`The longer ribbon covers more equal blocks.`);
      if(kind==='length-read')return finish('How many blocks long is the ribbon?',x,{kind:'length',values:[x]},`Count the ${x} equal blocks from one end to the other.`);
      return finish(`A ribbon is ${x} blocks long. Another is ${y} blocks long. What is their total length in blocks?`,x+y,{kind:'length',values:[x,y]},`${x} + ${y} = ${x+y} blocks.`);
    }
    if(/pattern/.test(kind)){
      const numeric=kind==='number-pattern'||kind==='pattern',items=numeric?[rand(1,9),rand(10,19)]:pick([['●','■'],['▲','●','■'],['■','▲']]);
      const values=Array.from({length:6},(_,i)=>items[i%items.length]), next=items[6%items.length];
      return choice(kind==='make-pattern'?'Choose the item that keeps the repeating pattern going.':'What comes next in this repeating pattern?',String(next),numeric?[String(next),String(Number(next)+1),String(Number(next)+2)]:['●','■','▲'],{kind:'sequence',values:[...values,'?']},`Repeat the group ${items.join(', ')}.`);
    }
    if(['fraction','half','quarter','fraction-compare','fraction-count'].includes(kind)){
      if(kind==='fraction-compare')return choice('Which shaded part is larger?','1/2',['1/2','1/4'],{kind:'fractions',values:[[1,2],[1,4]],labels:['1/2','1/4']},'One-half is larger than one-quarter of the same-sized whole.');
      if(kind==='fraction-count'){
        const den=pick([2,4]),num=rand(1,den);
        return finish(`How many ${den===2?'halves':'quarters'} are shaded?`,num,{kind:'fractions',values:[[num,den]]},`Count the ${num} shaded equal parts.`);
      }
      const den=kind==='half'?2:kind==='quarter'?4:pick([2,4]);
      return choice('What fraction of the whole is shaded?',`1/${den}`,['1/2','1/4','1 whole'],{kind:'fractions',values:[[1,den]],variant:rand(0,1)},`One of ${den} equal parts is shaded: 1/${den}.`);
    }
    if(/money|bill/.test(kind)){
      const denominations=kind==='bill'?[20,50,100]:[1,5,10,20,50,100];
      if(kind==='money-time-review')return build('clock');
      const first=pick(denominations);
      if(kind==='bill'||kind==='money-name')return choice('What is the value shown?',`₱${first}`,denominations.map(v=>`₱${v}`).slice(0,4),{kind:'money',values:[first]},`Its value is ₱${first}.`);
      if(kind==='money-compare'){
        const x=pick([1,5,10,20,50]), y=pick([1,5,10,20,50].filter(v=>v!==x));
        return choice('Which amount is worth more?',`₱${Math.max(x,y)}`,[`₱${x}`,`₱${y}`],{kind:'money',values:[x,y]},`₱${Math.max(x,y)} is worth more.`);
      }
      if(kind==='money-story'){
        const x=rand(10,49),y=rand(1,x);
        return finish(`Ana has ₱${x}. She spends ₱${y}. How many pesos are left?`,x-y,{kind:'money-story',a:x,b:y},`₱${x} - ₱${y} = ₱${x-y}.`);
      }
      const values=Array.from({length:rand(2,5)},()=>pick([1,5,10,20]));
      return finish('How many pesos are there altogether?',values.reduce((sum,v)=>sum+v,0),{kind:'money',values},`Add the values: ${values.join(' + ')} = ₱${values.reduce((s,v)=>s+v,0)}.`);
    }
    if(kind==='clock'){
      const hour=rand(1,12),minute=pick([0,15,30]),answer=`${hour}:${String(minute).padStart(2,'0')}`;
      return choice('What time does this clock show?',answer,[`${hour}:00`,`${hour}:15`,`${hour}:30`,`${hour%12+1}:00`],{kind:'clock',hour,minute},`The hour hand is near ${hour}. The minute hand shows ${minute} minutes.`);
    }
    if(kind==='turn'){
      const directions=['Up','Right','Down','Left'],start=rand(0,3),steps=pick([1,2]),clockwise=rand(0,1)===1,result=(start+(clockwise?steps:-steps)+4)%4;
      return choice(`The arrow makes a ${steps===1?'quarter':'half'} turn ${clockwise?'clockwise':'counter-clockwise'}. Which way will it point?`,directions[result],directions,{kind:'turn',start,steps,clockwise},`After the turn, the arrow points ${directions[result].toLowerCase()}.`);
    }
    if(kind==='days'||kind==='months'||kind==='calendar-order'){
      const list=kind==='days'?days:kind==='months'?months:pick([days,months]),i=rand(0,list.length-1),next=list[(i+1)%list.length];
      return choice(`What comes after ${list[i]}?`,next,[list[i],list[(i+2)%list.length],list[(i+3)%list.length]],{kind:'calendar-sequence',values:[list[i],'?']},`${next} comes after ${list[i]}.`);
    }
    if(kind==='calendar'){
      const offset=rand(0,6),date=rand(1,28),day=days[(offset+date-1)%7];
      return choice(`Use the practice calendar. Which day is date ${date}?`,day,days.filter(d=>d!==day).slice(0,3),{kind:'calendar',offset,date},`Find ${date}, then read its day column: ${day}.`);
    }
    if(kind==='time-problem'){
      const hour=rand(1,10),duration=pick([1,2]);
      return finish(`It is ${hour} o'clock. What hour will it be ${duration} hour${duration===1?'':'s'} later?`,hour+duration,{kind:'clock',hour,minute:0},`Count ${duration} hour${duration===1?'':'s'} forward: ${hour+duration} o'clock.`);
    }
    if(/data|pictograph/.test(kind)){
      const x=rand(1,8),y=rand(1,8),visual={kind:'pictograph',values:[x,y],labels:['Apples','Bananas']};
      if(kind==='collect-data')return choice('You want to learn which fruit classmates like. Which question should you ask?','Which fruit do you like?',['What is your name?','How old are you?'],{kind:'survey'},'Ask the same question about fruit to each classmate.');
      if(kind==='make-pictograph')return finish(`${x} children chose apples. One picture stands for one child. How many apple pictures should you draw?`,x,{kind:'survey-results',value:x},`Draw ${x} pictures: one for each child.`);
      if(kind==='table-data')return choice('Which table matches this pictograph?',`Apples ${x}, Bananas ${y}`,[`Apples ${x+1}, Bananas ${y}`,`Apples ${x}, Bananas ${y+1}`],visual,`Count ${x} apple pictures and ${y} banana pictures.`);
      const apples=rand(0,1)===1;
      return finish(`How many children chose ${apples?'apples':'bananas'}?`,apples?x:y,visual,'One picture stands for one child. Count only the named row.');
    }
    throw new Error(`Grade 1 skill not implemented: ${kind}`);
  }
  const question=build(skill);
  question.skill=topic.topic_title || skill;
  return question;
}
module.exports={makeGrade1Question,lessons};
