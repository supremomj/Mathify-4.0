const esc = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text=(x,y,value,size=20)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="#312e81">${esc(value)}</text>`;
const line=(x,y,x2,y2,extra='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#6366f1" stroke-width="3" ${extra}/>`;
const box=(x,y,w,h,fill='#e0e7ff')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fill}" stroke="#818cf8"/>`;
const dot=(x,y,color='#818cf8')=>`<circle cx="${x}" cy="${y}" r="10" fill="${color}"/>`;
function baseTen(value,x=80,y=60) {
  const tens=Math.floor(value/10),ones=value%10;
  return Array.from({length:tens},(_,i)=>Array.from({length:10},(_,j)=>box(x+i*19,y+j*13,13,12)).join('')).join('') + Array.from({length:ones},(_,i)=>box(x+Math.min(tens,10)*19+30+(i%3)*19,y+Math.floor(i/3)*19,13,13,'#fcd34d')).join('');
}
function counters(value,x,y,crossed=0) {
  return Array.from({length:value},(_,i)=>{const px=x+(i%10)*27,py=y+Math.floor(i/10)*35;return dot(px,py) + (i<crossed?line(px-9,py-11,px+9,py+11,'style="stroke:#ef4444"'):'');}).join('');
}
function shape(name,x=300,y=130,rotation=0,size=100,split=false) {
  const body=name==='Triangle'?'<polygon points="0,-70 -75,65 75,65"/>':name==='Rectangle'?'<rect x="-85" y="-45" width="170" height="90"/>':'<rect x="-65" y="-65" width="130" height="130"/>';
  return `<g transform="translate(${x},${y}) rotate(${rotation}) scale(${size/100})" fill="#c7d2fe" stroke="#6366f1" stroke-width="3">${body}${split?line(name==='Rectangle'?-85:-65,name==='Rectangle'?-45:-65,name==='Rectangle'?85:65,name==='Rectangle'?45:65,'stroke-dasharray="6 5"'):''}</g>`;
}
function clock(hour,minute) {
  const xy=(angle,r)=>[300+Math.sin(angle*Math.PI/180)*r,132-Math.cos(angle*Math.PI/180)*r];
  let body='<circle cx="300" cy="132" r="100" fill="white" stroke="#818cf8" stroke-width="4"/>';
  for(let i=1;i<=12;i++){const p=xy(i*30,80);body+=text(p[0],p[1]+6,i,18);}
  const h=xy((hour%12)*30+minute/2,50),m=xy(minute*6,72);
  return body+line(300,132,h[0],h[1])+line(300,132,m[0],m[1])+dot(300,132);
}
function renderGrade1Illustration(v) {
  if(!v)return null;
  let body='',alt='',height=280;
  switch(v.kind) {
    case 'shape': body=shape(v.name,300,130,v.rotation,v.size);alt='A geometric figure. Examine its sides and corners.';break;
    case 'shapes': body=v.names.map((name,i)=>shape(name,180+i*240,125)+text(180+i*240,240,name)).join('');alt=`Two figures, ${v.names.join(' and ')}. Compare their straight sides.`;break;
    case 'compose':body=shape(v.name,300,130,v.rotation,100,true);alt='Two matching triangular pieces joined along a dashed diagonal.';break;
    case 'base-ten':body=baseTen(v.value)+text(300,240,'Each rod = 10 · Each yellow block = 1',17);alt='Base-ten model: each tall rod has ten small blocks; separate yellow blocks are ones.';break;
    case 'number-line':{
      const count=v.end-v.start,step=470/count;
      body=line(60,135,530,135);
      for(let n=v.start;n<=v.end;n++){const x=60+(n-v.start)*step;body+=line(x,125,x,145)+text(x,180,n);if(n===v.value)body+=dot(x,115,'#f59e0b');}
      alt='A number line with the starting number highlighted. Move one step in the direction asked.';break;
    }
    case 'compare':body=v.values.map((n,i)=>text(100+i*200,130,n,36)).join('');alt=`Numbers to compare: ${v.values.join(', ')}.`;break;
    case 'ordinal':body=text(100,55,'Start →',17)+Array.from({length:v.total},(_,i)=>dot(45+i*55,140,i+1===v.value?'#f59e0b':'#c7d2fe')).join('');alt='A row of ten dots, with one dot highlighted. Count from the left.';break;
    case 'parts':body=box(70,35,460,65)+text(300,78,`Whole: ${v.total}`)+line(300,100,180,150)+line(300,100,420,150)+box(90,150,180,75)+text(180,196,v.known)+box(330,150,180,75)+text(420,196,'?');alt=`Part-whole model: the whole is ${v.total}, one part is ${v.known}, and the other is unknown.`;break;
    case 'arithmetic':{
      if(v.baseTen){body=baseTen(v.a,40,55)+text(300,130,v.operation,32)+baseTen(v.b,350,55);}
      else if(v.operation==='-'){body=counters(v.a,95,100,v.b);}
      else body=counters(v.a,55,100)+text(300,130,'+',32)+counters(v.b,345,100);
      alt=v.operation==='-'&&!v.baseTen?`${v.a} counters with ${v.b} crossed out to show taking away.`:'Two base-ten or counter groups showing the given quantities. Find the result.';break;
    }
    case 'balance':body=line(120,170,480,170)+line(300,170,300,225)+line(255,225,345,225)+box(65,70,200,80)+text(165,120,`${v.a} + ${v.b}`)+box(335,70,200,80)+text(435,120,`${v.c} + ?`)+line(165,150,165,170)+line(435,150,435,170);alt='A balance model with two addition expressions that must have equal value.';break;
    case 'length':body=v.values.map((value,i)=>{const y=55+i*100;return text(40,y+20,String.fromCharCode(65+i))+box(75,y,value*40,20,'#f9a8d4')+Array.from({length:value},(_,j)=>box(75+j*40,y+32,40,27)).join('');}).join('');alt='Ribbons lined up with equal-sized blocks, with no gaps or overlaps.';break;
    case 'sequence': case 'calendar-sequence':body=v.values.map((value,i)=>box(12+i*570/v.values.length,90,550/v.values.length,75)+text(12+(i+0.5)*570/v.values.length,137,value,24)).join('');alt=`Sequence: ${v.values.join(', ')}.`;break;
    case 'fractions':{
      body=v.values.map(([num,den],i)=>{const y=45+i*110;return Array.from({length:den},(_,j)=>box(100+j*400/den,y,400/den,65,(v.variant===1?j>=den-num:j<num)?'#818cf8':'#fff')).join('')+(v.labels?text(300,y+92,v.labels[i]):'');}).join('');
      alt='Equal-sized wholes divided into equal parts. Purple parts are shaded.';break;
    }
    case 'money':body=v.values.map((value,i)=>{const x=20+(i%3)*190,y=35+Math.floor(i/3)*105;return box(x,y,170,80,value<=20?'#fef3c7':'#dcfce7')+text(x+85,y+50,`₱${value}`,29);}).join('');alt='Schematic peso tokens, each marked with its given value. These are not currency replicas.';break;
    case 'money-story':body=box(70,80,180,100,'#dcfce7')+text(160,142,`₱${v.a}`,32)+text(300,142,'−',32)+box(350,80,180,100,'#fef3c7')+text(440,142,`₱${v.b}`,32);alt='Starting pesos and the amount spent, separated by a minus sign.';break;
    case 'clock':body=clock(v.hour,v.minute);alt='An analog clock. Read the hour and minute hands.';break;
    case 'turn':{
      body=`<g transform="translate(210,135) rotate(${v.start*90})"><path d="M0,-65 -35,-10 -12,-10 -12,65 12,65 12,-10 35,-10Z" fill="#818cf8"/></g>`+text(420,120,v.clockwise?'↻':'↺',70)+text(420,177,v.steps===1?'Quarter turn':'Half turn',18);alt=`Starting arrow with a ${v.clockwise?'clockwise':'counter-clockwise'} turn indicated.`;break;
    }
    case 'calendar':{
      height=340;body=text(300,30,'Practice calendar',22);
      const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      body+=days.map((day,i)=>text(50+i*80,68,day,17)).join('');
      for(let date=1;date<=28;date++){const pos=v.offset+date-1,x=15+(pos%7)*80,y=85+Math.floor(pos/7)*47;body+=box(x,y,70,42,date===v.date?'#fde68a':'#eef2ff')+text(x+35,y+28,date,18);}
      alt=`A practice calendar with date ${v.date} highlighted. Columns run Monday through Sunday.`;break;
    }
    case 'pictograph':body=text(300,30,'One picture = one child',17)+v.values.map((count,i)=>text(65,95+i*85,v.labels[i],16)+Array.from({length:count},(_,j)=>dot(150+j*46,88+i*85,i?'#fbbf24':'#fb7185')).join('')).join('');alt='A pictograph with apples and bananas rows. One colored circle represents one child.';break;
    case 'survey-results':body=text(300,45,'Children who chose apples',20)+counters(v.value,100,120);alt='A group of counters, one for each child who chose apples.';break;
    case 'survey':body=box(180,40,240,190)+text(300,90,'Favorite fruit?',24)+text(300,145,'Apples   Bananas',20)+text(300,195,'Ask each classmate',16);alt='A survey card asking classmates about their favorite fruit.';break;
    default:throw new Error(`Unknown reviewed illustration: ${v.kind}`);
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${height}" role="img"><title>${esc(alt)}</title><rect width="100%" height="100%" rx="20" fill="#fafbff"/>${body}</svg>`;
  return {kind:`grade1-${v.kind}`,alt,src:`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`};
}
module.exports={renderGrade1Illustration};
