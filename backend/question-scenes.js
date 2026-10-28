// Topic-aware, answer-independent illustrations. Never read correctAnswer.
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const label = (x, y, value, size = 18) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="#312e81">${esc(value)}</text>`;
const line = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6366f1" stroke-width="3" ${extra}/>`;
function scene(kind, alt, body, width = 600, height = 250) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img"><title>${esc(alt)}</title><rect width="100%" height="100%" rx="20" fill="#fafbff"/>${body}</svg>`;
  return { kind, alt, src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` };
}
function object(x, y, type, color = '#818cf8') {
  let drawing;
  if (type === 'orange') drawing = '<circle r="19" fill="#fb923c"/><path d="M0,-18 Q6,-29 16,-20 Q9,-13 0,-18" fill="#22c55e"/>';
  else if (type === 'fruit') drawing = '<path d="M0,-8 C-20,-22 -25,5 -12,17 Q0,23 12,17 C25,5 20,-22 0,-8" fill="#fb7185"/><path d="M0,-8 Q0,-24 12,-22" fill="none" stroke="#16a34a" stroke-width="4"/>';
  else if (type === 'books') drawing = '<rect x="-17" y="-21" width="34" height="42" rx="4" fill="#60a5fa"/><path d="M-10,-19 V19 M-4,-10 H12 M-4,-3 H12" stroke="#fff" stroke-width="2"/>';
  else if (type === 'pencils') drawing = '<path d="M-7,-21 H7 V13 L0,24 -7,13 Z" fill="#fbbf24"/><path d="M-7,13 L0,24 7,13" fill="#fde68a"/><path d="M0,24 L-3,19 H3 Z" fill="#334155"/>';
  else if (type === 'people') drawing = `<circle cy="-12" r="8" fill="${color}"/><path d="M-14,18 V6 Q0,-6 14,6 V18" fill="${color}"/>`;
  else if (type === 'flowers') drawing = '<g fill="#f472b6"><circle cx="-9" cy="-7" r="9"/><circle cx="9" cy="-7" r="9"/><circle cy="9" r="9"/></g><circle r="6" fill="#facc15"/>';
  else if (type === 'stars') drawing = `<path d="M0,-23 6,-7 23,-7 10,4 15,21 0,11 -15,21 -10,4 -23,-7 -6,-7Z" fill="#fbbf24"/>`;
  else drawing = `<circle r="18" fill="${color}" stroke="#4f46e5" stroke-width="2"/>${type === 'balls' ? '<path d="M-16,-8 Q0,8 16,-8 M0,-18 Q-10,0 0,18" fill="none" stroke="#fff" stroke-width="2"/>' : ''}`;
  return `<g transform="translate(${x},${y}) scale(0.72)">${drawing}</g>`;
}
function themeFor(text, theme) {
  if (/orange/i.test(text)) return 'orange';
  if (/apple|orange|mango|fruit|banana|tomato/i.test(text)) return 'fruit';
  if (/book|notebook/i.test(text)) return 'books';
  if (/pencil|crayon/i.test(text)) return 'pencils';
  if (/boy|girl|student|friend|child/i.test(text)) return 'people';
  if (/flower/i.test(text)) return 'flowers';
  if (/star/i.test(text)) return 'stars';
  if (/ball|marble/i.test(text)) return 'balls';
  return ['fruit','books','pencils','balls'].includes(theme) ? theme : 'counters';
}
function group(value, x, y, type, color) {
  const count = Number(value);
  if (Number.isInteger(count) && count >= 0 && count <= 20) {
    if (!count) return label(x + 95, y + 70, 'Empty set');
    const start = 100 - (Math.ceil(count / 5) - 1) * 22;
    return Array.from({length:count}, (_, i) => object(x + 23 + (i % 5) * 36, y + start + Math.floor(i / 5) * 45, type, color)).join('');
  }
  return object(x + 55, y + 65, type, color) + label(x + 120, y + 72, `× ${value}`, 25);
}
function clock(hour, minute, x, y) {
  const point = (degrees, radius) => [x + Math.sin(degrees * Math.PI / 180) * radius, y - Math.cos(degrees * Math.PI / 180) * radius];
  let body = `<circle cx="${x}" cy="${y}" r="83" fill="#fff" stroke="#818cf8" stroke-width="5"/>`;
  for (let n = 1; n <= 12; n++) { const p = point(n * 30, 66); body += label(p[0], p[1] + 5, n, 15); }
  const h = point((hour % 12) * 30 + minute / 2, 40), m = point(minute * 6, 57);
  return body + line(x,y,h[0],h[1],'stroke-linecap="round"') + line(x,y,m[0],m[1],'stroke-linecap="round"') + `<circle cx="${x}" cy="${y}" r="5" fill="#312e81"/>`;
}

function contextualDiagram(question, theme) {
  const text = String(question.question || '');
  let m;
  if ((m=text.match(/(\d+) groups of (\d+) items/))) return contextualDiagram({question:`What is ${m[1]} × ${m[2]}?`},theme);
  if ((m=text.match(/(\d+) items to share equally among (\d+) friends/))) return contextualDiagram({question:`What is ${m[1]} ÷ ${m[2]}?`},theme);
  // Clocks use the time in the question, not the answer or option index.
  if ((m = text.match(/clock shows (half past |quarter past )?(\d+)(?::(\d{2}))?/i))) {
    const minutes = m[3] ? Number(m[3]) : m[1] === 'half past ' ? 30 : m[1] === 'quarter past ' ? 15 : 0;
    return scene('clock', 'An analog clock showing the time described in the question.', clock(Number(m[2]), minutes, 300, 125));
  }
  if (/minutes are between/i.test(text)) {
    const times = [...text.matchAll(/(\d+):(\d{2})/g)];
    if (times.length === 2) return scene('elapsed-time', 'Start and end clocks; find the elapsed time.', clock(+times[0][1],+times[0][2],150,125) + line(255,125,345,125) + label(300,112,'?') + clock(+times[1][1],+times[1][2],450,125));
  }
  if (/angle/i.test(text)) {
    const numeric = text.match(/(\d+)°/);
    const angle = numeric ? +numeric[1] : /right angle/.test(text) ? 90 : /straight angle/.test(text) ? 180 : /full angle/.test(text) ? 360 : null;
    if (angle !== null) {
      const total = /complementary/.test(text) ? 90 : /supplementary/.test(text) ? 180 : null;
      const ray = a => line(270,160,270 + Math.cos(-a*Math.PI/180)*115,160 + Math.sin(-a*Math.PI/180)*115);
      let body = ray(0) + ray(angle);
      if (total !== null) body += ray(total) + label(220,90,'?');
      if (numeric) body += label(340,180,`${angle}°`);
      if (angle === 360) body += '<circle cx="270" cy="160" r="55" fill="none" stroke="#a5b4fc" stroke-width="3"/>';
      return scene('angle', 'Rays illustrating the angle in the question; the unknown angle is not calculated.', body);
    }
  }
  if ((m = text.match(/ordinal number for position (\d+)/i)) && +m[1] <= 20) {
    const n = +m[1];
    return scene('ordinal', `A row with position ${n} highlighted, counted from the left.`, label(300,30,'Start →') + Array.from({length:Math.max(n,6)},(_,i) => object(30+i*42,110,'people',i===n-1?'#f59e0b':'#c7d2fe')).join(''), Math.max(n,6)*42+30,190);
  }
  // Fractions become actual divided wholes, including all visual options.
  const fraction = text.match(/(\d+)\/(\d+)/);
  if (fraction && /^(What is \d+\/\d+ (as a decimal|in simplest form)|Which shape shows)/.test(text)) {
    const n = +fraction[1], d = +fraction[2];
    if (d > 0 && d <= 12 && n <= d) {
      const fractionBar = (num, den, y, name) => Array.from({length:den},(_,i) => `<rect x="${100+i*400/den}" y="${y}" width="${400/den}" height="48" fill="${i<num?'#818cf8':'#fff'}" stroke="#4f46e5" stroke-width="2"/>`).join('') + (name ? label(300,y+73,name) : '');
      if (/Which shape shows/.test(text) && Array.isArray(question.options)) {
        const known = { 'Half shaded':[1,2], 'Quarter shaded':[1,4], 'Full shaded':[1,1], 'Empty':[0,1] };
        if (question.options.every(option => known[option])) return scene('fraction-options','Four shaded fraction models matching the answer choices.',question.options.map((option,i) => fractionBar(...known[option],i*95+12,option)).join(''),600,question.options.length*95+10);
      }
      return scene('fraction',`A whole divided into ${d} equal parts with ${n} shaded.`,fractionBar(n,d,90));
    }
  }
  if (/pattern/i.test(text)) {
    const sequence = text.match(/(?:pattern:|pattern,|pattern is:)\s*(.+?)(?:\?|what comes|\. Maria)/i);
    if (sequence) {
      const entries = sequence[1].replace(/,\s*$/,'').split(/,\s*|\s+(?=[🔺⬜⭕⬛⭐🌙🔷🔶])/u).filter(Boolean).slice(0,10);
      return scene('pattern','The given sequence, followed by an unknown next item.', entries.map((entry,i) => `<rect x="${i*78+10}" y="55" width="65" height="70" rx="14" fill="#eef2ff"/>` + label(i*78+42,99,entry,24)).join('') + label(entries.length*78+40,99,'?',30), (entries.length+1)*78+10,185);
    }
  }
  if (/₱|pesos/.test(text)) {
    const amounts = [...text.matchAll(/₱([\d.]+)|(\d+) (?:more )?pesos/g)].map(match => match[1] || match[2]).slice(0,3);
    if (amounts.length) return scene('money','Peso amounts given in the problem; no total or change is calculated.',amounts.map((amount,i) => `<g transform="translate(${i*190+20},65)"><rect width="170" height="100" rx="12" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/><circle cx="85" cy="50" r="36" fill="#bbf7d0"/>${label(85,57,`₱${amount}`,25)}</g>`).join(''),amounts.length*190+20,230);
  }
  if (/cm|\bm long|\bkg\b/.test(text) && !/area|perimeter/.test(text)) {
    const measures = [...text.matchAll(/(\d+)\s*(cm|m|kg)\b/g)].slice(0,3);
    if (measures.length) {
      const physicalValue = match => +match[1] * (match[2] === 'm' ? 100 : 1);
      const largest = Math.max(...measures.map(physicalValue),1);
      return scene('measurement','The given measurements shown to a common scale within each unit.',measures.map((match,i) => {
        const y=35+i*70, length=360*physicalValue(match)/largest;
        return `<rect x="100" y="${y}" width="${length}" height="24" rx="6" fill="#c7d2fe"/>` + label(50,y+19,`${match[1]} ${match[2]}`,16) + line(100,y+35,100+length,y+35);
      }).join(''),600,measures.length*70+35);
    }
  }
  if ((m = text.match(/bag with (\d+) marbles, (\d+) are red/i)) && +m[1] <= 60 && +m[2] <= +m[1]) {
    const total=+m[1], red=+m[2];
    return scene('probability',`A bag containing ${red} red marbles and ${total-red} other marbles.`, '<rect x="45" y="20" width="510" height="210" rx="45" fill="#eef2ff" stroke="#a5b4fc" stroke-width="3"/>' + Array.from({length:total},(_,i) => `<circle cx="${75+(i%15)*32}" cy="${55+Math.floor(i/15)*45}" r="12" fill="${i<red?'#f87171':'#818cf8'}"/>`).join(''));
  }
  if (/bar graph|pictograph/.test(text)) {
    // Only depict named, explicitly stated categories; don't derive a missing
    // category from the stated total, or multiply a pictograph's scale.
    const categories = [...text.matchAll(/([A-Z][a-z]+) (?:shows|has) (\d+)(?: (pictures|symbols))?/g)].slice(0,3);
    if (categories.length) {
      const max=Math.max(...categories.map(match => +match[2]),1);
      const scale = text.match(/(?:scale (?:of|=)|represents)\s*(\d+)/);
      return scene('chart','Given categories in the graph. Missing values are left unknown.',categories.map((match,i) => {
        const y=40+i*65;
        const marks = /pictograph/.test(text) && +match[2]<=12
          ? Array.from({length:+match[2]},(_,j) => `<circle cx="${140+j*27}" cy="${y}" r="9" fill="#818cf8"/>`).join('')
          : `<rect x="125" y="${y-16}" width="${320*(+match[2])/max}" height="28" rx="6" fill="#818cf8"/>` + label(485,y+5,match[2]);
        return label(62,y+5,match[1],16) + marks;
      }).join('') + (scale ? label(300, categories.length*65+40, `1 symbol = ${scale[1]} items`,16) : ''),600,categories.length*65+85);
    }
  }
  if ((m = text.match(/What is (\d+) ([+\-−×*÷]) (\d+)\?/))) {
    const a=+m[1], b=+m[3], op=m[2], type=themeFor(text,theme);
    if (op==='×' || op==='*') {
      if (a<=8 && b<=20 && a*b<=80) return scene('equal-groups',`${a} equal groups of ${b} objects.`,Array.from({length:a},(_,i) => `<g transform="translate(${(i%4)*210},${Math.floor(i/4)*225})"><rect x="8" y="8" width="198" height="210" rx="20" fill="#eef2ff"/>${group(b,8,16,type)}</g>`).join(''),Math.min(a||1,4)*210,Math.ceil((a||1)/4)*225);
    }
    if (op==='÷') return scene('sharing',`${a} objects to share among ${b} groups. Each group is left empty to find the answer.`,group(a,40,30,type) + label(300,110,'→',30) + (b<=8 ? Array.from({length:b},(_,i) => `<circle cx="${370+(i%4)*52}" cy="${65+Math.floor(i/4)*80}" r="22" fill="#eef2ff" stroke="#a5b4fc"/>${label(370+(i%4)*52,72+Math.floor(i/4)*80,'?')}`).join('') : label(440,110,`${b} groups: ? each`)));
    return scene('arithmetic',`Two given quantities, ${a} and ${b}, with operation ${op}.`, group(a,35,25,type) + label(300,115,op,35) + group(b,365,25,type,'#f59e0b'));
  }
  // Story problems: retain each stated quantity as a separate scene; infer
  // object appearance from its own noun, not from the correct answer.
  if (!/graph|pictograph|probability|GEMDAS|pattern|Fill in|True or False/.test(text)) {
    const matches = [...text.matchAll(/\b(\d+)\s+(?:(?:pieces|packs|groups) of )?([a-z]+(?:\s+[a-z]+)?)/gi)].filter(match => !/decimal|side|corner|equal|nearest|degree/.test(match[2])).slice(0,3);
    if (matches.length && /has|have|bought|had|there|were|contains|gives|gave|fly|sold|sell|appear/i.test(text)) {
      return scene('story',matches.map(match => `${match[1]} ${match[2]}`).join('; '),matches.map((match,i) => `<g transform="translate(${i*210},0)">${group(match[1],10,20,themeFor(match[2],theme),i%2?'#f59e0b':'#818cf8')}${label(105,230,match[2].replace(/\s+(and|in|at|to|were|are|more)$/i,''),15)}</g>`).join(''),matches.length*210,260);
    }
  }
  return null;
}
module.exports = { contextualDiagram };
