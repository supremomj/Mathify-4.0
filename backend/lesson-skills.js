// Specific learning outcomes take precedence over broad categories and substrings.
function lessonSkillQuestion(g, outcome, grade, index, difficulty) {
  const o = outcome.toLowerCase();
  const n = (max, min = 1) => min + Math.floor(Math.random() * (max - min + 1));
  const number = (question, answer, skill, explanation) => ({ question, type: 'number', correctAnswer: answer, skill, explanation });
  const choice = (question, answer, options, skill, explanation) => ({ ...g.choiceQuestion(question, answer, options, skill), explanation });
  const a = n(difficulty === 'easy' ? 9 : 20, 2), b = n(9, 2);
  if (/pie graph/.test(o)) {
    const percent = [10,20,25,50,75][index % 5], total = a * 100, red = total * percent / 100;
    const angles = /angle/.test(o) && index % 2 === 0;
    return { ...number(`A pie graph summarizes favorite colors: ${red} students chose red and ${total - red} chose blue. ${angles ? 'How many degrees should the red sector measure?' : 'What percentage of students chose red?'}`, angles ? percent * 3.6 : percent, 'Pie Graphs', `${red} out of ${total} is ${percent}%.${angles ? ` Multiply ${percent}/100 by 360° to get ${percent * 3.6}°.` : ` Calculate ${red} ÷ ${total} × 100.`}`), lessonVisual: { type: 'pie', values: [red, total-red], labels: ['Red', 'Blue'] } };
  }
  if (/double.*graph|bivariate/.test(o)) {
    const values = [a, b, a + 2, b + 3];
    return { ...number(`A double bar graph shows books read. Class A: Monday ${a}, Tuesday ${b}. Class B: Monday ${a + 2}, Tuesday ${b + 3}. How many books did both classes read on Tuesday?`, b * 2 + 3, 'Double Graphs', `Read Tuesday's values for both classes and add: ${b} + ${b + 3} = ${b * 2 + 3}.`), lessonVisual: {type:'bars',values,labels:['A · Mon','A · Tue','B · Mon','B · Tue']} };
  }
  if (/\b(gemdas|gmdas|mdas)\b|order of operations/.test(o)) {
    if (/exponent|exponential/.test(o)) return number(`Evaluate ${a} + ${b}² × 2.`, a + b * b * 2, 'GEMDAS with Exponents', `Evaluate the exponent first: ${b}² = ${b * b}. Multiply by 2, then add ${a}.`);
    if (/fraction|decimal/.test(o)) return number(`Evaluate (${a}.5 + 0.5) × ${b} - ${b}.`, (a + 1) * b - b, 'Order of Operations with Decimals', `First calculate the parentheses: ${a}.5 + 0.5 = ${a + 1}. Then multiply by ${b}, then subtract ${b}.`);
    return number(`Evaluate ${a} + ${b} × ${b + 1} - ${b}.`, a + b * (b + 1) - b, 'Order of Operations', `Multiply first: ${b} × ${b + 1} = ${b * (b + 1)}. Then add and subtract from left to right.`);
  }
  if (/exponent|exponential/.test(o)) {
    const base = n(6, 2), power = n(4, 2);
    return number(`What is ${base} raised to the power ${power}?`, base ** power, 'Exponents', `Multiply ${Array(power).fill(base).join(' × ')} = ${base ** power}.`);
  }
  if (/probability/.test(o)) return g.generateProbabilityQuestion(grade, index, o);
  if (/\b(gcf|lcm)\b|greatest common factor|least common multiple/.test(o)) return g.generateFactorsMultiplesQuestion(grade, index, o);
  if (/percent/.test(o)) {
    const p = [10, 20, 25, 50, 75][index % 5];
    if (/fraction|decimal|relationship/.test(o)) return number(`Write ${p}% as a decimal.`, p / 100, 'Percent and Decimals', `${p}% means ${p} out of 100. Divide by 100 to get ${p / 100}.`);
    return number(`A shop offers ${p}% off an item costing ₱${a * 100}. How many pesos is the discount?`, a * p, 'Percentages', `Discount = ${p}/100 × ${a * 100} = ₱${a * p}.`);
  }
  if (/ratio|proportion/.test(o)) return g.generateRatioProportionQuestion(grade, index, o);
  if (/decimal/.test(o)) return g.generateDecimalQuestion(grade, index, o);
  if (/fraction/.test(o)) {
    if (/order|compare/.test(o)) {
      const d = [3, 4, 5, 6, 8][index % 5];
      const x = /unit/.test(o) ? `1/${d}` : `1/${d}`, y = /unit/.test(o) ? `1/${d + 1}` : `2/${d}`;
      const answer = /unit/.test(o) ? x : y;
      return choice(`Which fraction is greater: ${x} or ${y}?`, answer, [x, y], 'Comparing Fractions', /unit/.test(o) ? 'For unit fractions, the smaller denominator gives the larger piece.' : 'For equal denominators, compare the numerators.');
    }
    if (/mixed|improper/.test(o) && !/add|subtract|divi|multipli/.test(o)) {
      const d = n(8, 2), whole = n(6), numerator = whole * d + 1;
      return choice(`Write ${numerator}/${d} as a mixed number.`, `${whole} 1/${d}`, [`${whole} 1/${d}`, `${whole + 1} 1/${d}`, `${whole} 1/${d + 1}`], 'Mixed Numbers', `${numerator} ÷ ${d} = ${whole} remainder 1, so the mixed number is ${whole} 1/${d}.`);
    }
    if (/equivalent/.test(o)) {
      const d = n(9, 2), numerator = n(d - 1), factor = n(5, 2);
      return number(`Complete the equivalent fractions: ${numerator}/${d} = ?/${d * factor}.`, numerator * factor, 'Equivalent Fractions', `Multiply both numerator and denominator by ${factor}.`);
    }
    if (/multipli|multiply|divi|divide|add|subtract/.test(o) && grade >= 3) return g.generateFractionOperationQuestion(grade, index, o);
    if (grade === 2) {
      const d = [2, 3, 4, 5, 6, 8][index % 6], numerator = /unit/.test(o) ? 1 : n(d - 1);
      return choice(`A strip is divided into ${d} equal parts and ${numerator} ${numerator === 1 ? 'part is' : 'parts are'} shaded. Which fraction describes the shaded part?`, `${numerator}/${d}`, [`${numerator}/${d}`, `${numerator + 1}/${d}`, `${numerator}/${d + 1}`], 'Representing Fractions', `The denominator counts all ${d} equal parts; the numerator counts the ${numerator} shaded parts.`);
    }
    return g.generateFractionQuestion(grade, index, o);
  }
  if (/time zones|world time/.test(o)) {
    const hour = n(8, 1), offset = n(5, 1);
    return number(`It is ${hour}:00 a.m. in City A. City B is ${offset} hours ahead. What hour is it in City B using 24-hour time?`, hour + offset, 'Time Zones', `Add the time difference: ${hour} + ${offset} = ${hour + offset}.`);
  }
  if (/24.hour|12.hour/.test(o)) {
    const hour = n(11, 1);
    return number(`Write ${hour}:00 p.m. in 24-hour time. Enter the hour only.`, hour + 12, '24-Hour Time', `For a p.m. hour from 1 to 11, add 12: ${hour} + 12 = ${hour + 12}.`);
  }
  if (/duration|calendar|days.*weeks/.test(o)) return number(`A school activity lasts ${a} weeks and ${b} days. How many days is that?`, a * 7 + b, 'Calendar Duration', `${a} weeks = ${a * 7} days. Add ${b} days to get ${a * 7 + b}.`);
  if (/elapsed|timetables/.test(o)) return number(`A lesson begins at 9:00 a.m. and ends at 9:${String(a + 20).padStart(2, '0')} a.m. How many minutes does it last?`, a + 20, 'Elapsed Time', `Count the minutes from 9:00 to 9:${a + 20}: ${a + 20} minutes.`);
  if (/\btime\b|\bhours?\b|\bminutes?\b/.test(o)) return g.generateTimeQuestion(grade, index, o);
  if (/surface area/.test(o)) return number(`A rectangular prism has length ${a} cm, width ${b} cm, and height ${b + 1} cm. What is its surface area in square centimeters?`, 2 * (a * b + a * (b + 1) + b * (b + 1)), 'Surface Area', `Add the areas of all six faces: 2 × (${a} × ${b} + ${a} × ${b + 1} + ${b} × ${b + 1}).`);
  if (/convert/.test(o) && /cubic|liters/.test(o)) return number(`Convert ${a * 1000} cubic centimeters to liters.`, a, 'Volume Conversion', `1 liter = 1,000 cubic centimeters. ${a * 1000} ÷ 1,000 = ${a} liters.`);
  if (/convert/.test(o) && /square/.test(o)) return number(`Convert ${a} square meters to square centimeters.`, a * 10000, 'Area Conversion', `1 m = 100 cm, so 1 square meter = 100 × 100 = 10,000 square centimeters.`);
  if (/volume/.test(o) && /cube|prism/.test(o)) return number(`A rectangular prism has length ${a} cm, width ${b} cm, and height ${b + 1} cm. What is its volume in cubic centimeters?`, a * b * (b + 1), 'Volume', `Volume = length × width × height = ${a} × ${b} × ${b + 1} = ${a * b * (b + 1)}.`);
  if (/circumference|\bpi\b|π/.test(o) && !/area/.test(o)) return number(`A circle has diameter ${a * 2} cm. Using π = 3.14, what is its circumference in centimeters?`, Number((a * 2 * 3.14).toFixed(2)), 'Circumference', `Circumference = π × diameter = 3.14 × ${a * 2}.`);
  if (/area/.test(o)) {
    if (/circle|semicircle/.test(o)) return number(`A circle has radius ${a} cm. Using π = 3.14, what is its area in square centimeters?`, Number((3.14 * a * a).toFixed(2)), 'Circle Area', `Area = π × radius × radius = 3.14 × ${a} × ${a}.`);
    if (/composite/.test(o)) return number(`A composite figure consists of two non-overlapping rectangles. One is ${a} cm by ${b} cm; the other is ${a + 1} cm by ${b} cm. What is the total area in square centimeters?`, a * b + (a + 1) * b, 'Composite Area', `Find each rectangle's area and add: ${a * b} + ${(a + 1) * b} = ${a * b + (a + 1) * b}.`);
    if (/triangle|parallelogram|trapezoid/.test(o)) {
      if (/trapezoid/.test(o) && index % 3 === 2) return number(`A trapezoid has parallel bases ${a} cm and ${a + 2} cm and perpendicular height ${b} cm. What is its area in square centimeters?`, (a + 1) * b, 'Trapezoid Area', `Area = (sum of parallel bases) × height ÷ 2 = (${a} + ${a + 2}) × ${b} ÷ 2.`);
      const triangle = index % 2 === 0;
      return number(`A ${triangle ? 'triangle' : 'parallelogram'} has base ${a * 2} cm and perpendicular height ${b} cm. What is its area in square centimeters?`, a * b * (triangle ? 1 : 2), triangle ? 'Triangle Area' : 'Parallelogram Area', `Area = base × perpendicular height${triangle ? ' ÷ 2' : ''}.`);
    }
    return number(`A rectangle has length ${a} cm and width ${b} cm. What is its area in square centimeters?`, a * b, 'Rectangle Area', `Count ${a} rows of ${b} square units: area = length × width = ${a} × ${b} = ${a * b}.`);
  }
  if (/perimeter/.test(o)) {
    if (/triangle/.test(o) && index % 2) return number(`A triangle has side lengths ${a} cm, ${a + 1} cm, and ${a + 2} cm. What is its perimeter in centimeters?`, 3 * a + 3, 'Triangle Perimeter', `Add all three sides: ${a} + ${a + 1} + ${a + 2} = ${3 * a + 3}.`);
    return number(`A rectangle has length ${a} cm and width ${b} cm. What is its perimeter in centimeters?`, 2 * (a + b), 'Rectangle Perimeter', `Add all four sides: ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}.`);
  }
  if (/mass|weight/.test(o)) {
    if (/convert/.test(o)) return number(`Convert ${a} kilograms to grams.`, a * 1000, 'Mass Conversion', `1 kilogram = 1,000 grams, so multiply ${a} by 1,000.`);
    return number(`One bag has a mass of ${a} kg and another has a mass of ${b} kg. What is their total mass in kilograms?`, a + b, 'Mass', `Add masses measured in the same unit: ${a} + ${b} = ${a + b} kg.`);
  }
  if (/capacity|volume/.test(o)) return number(`A jug contains ${a * 100} mL of water. Another ${b * 100} mL is added. How many milliliters are in the jug now?`, (a + b) * 100, 'Capacity', `Add the amounts in milliliters: ${a * 100} + ${b * 100} = ${(a + b) * 100} mL.`);
  if (/length|distance/.test(o) && !/line segments/.test(o)) {
    if (/convert/.test(o)) return number(`Convert ${a} meters to centimeters.`, a * 100, 'Length Conversion', `1 meter = 100 centimeters, so ${a} × 100 = ${a * 100} cm.`);
    if (/appropriate unit/.test(o)) return choice('Which unit is more suitable for measuring the length of a pencil?', 'Centimeters', ['Centimeters', 'Meters'], 'Length Units', 'A pencil is a small object, so centimeters give a useful measurement.');
    return number(`A ribbon is ${a * 2} cm long and another ribbon is ${b} cm long. What is their total length in centimeters?`, a * 2 + b, 'Length', `Both lengths are in centimeters. Add ${a * 2} + ${b} = ${a * 2 + b} cm.`);
  }
  if (/tessellat/.test(o)) return choice('Which regular shape can cover a flat surface without gaps or overlaps?', 'Square', ['Square', 'Circle', 'Regular pentagon'], 'Tessellation', 'Four squares meet at a point with no gaps because 4 × 90° = 360°.');
  if (/translation|slide/.test(o)) return number(`A shape slides ${a} grid squares right, then ${b} more squares right. How many squares right has it moved in total?`, a + b, 'Translation', `A slide keeps the shape and size unchanged. Add the movements: ${a} + ${b} = ${a + b}.`);
  if (/symmetr|reflection|rotation/.test(o)) return g.generateTransformationQuestion(grade, index, o);
  if (/straight|curved|line segment|\bray\b|perpendicular|parallel|intersecting/.test(o)) {
    const items = [ ['Which figure has two endpoints?', 'Line segment', ['Line', 'Ray', 'Line segment']], ['What are lines that meet at a right angle called?', 'Perpendicular', ['Parallel', 'Perpendicular', 'Curved']], ['What are straight lines in a plane that never meet called?', 'Parallel', ['Parallel', 'Perpendicular', 'Intersecting']] ];
    const item = /line segment|\bray\b/.test(o) ? items[0] : /perpendicular|parallel|intersecting/.test(o) ? items[1 + index % 2] : ['Which line bends instead of remaining straight?', 'Curved line', ['Curved line', 'Straight line']];
    return choice(item[0], item[1], item[2], 'Lines', `${item[1]} is the term for the property described.`);
  }
  if (/solid|prism|pyramid|\bcubes?\b|\bnets\b/.test(o)) return choice('Which solid has six equal square faces?', 'Cube', ['Cube', 'Cylinder', 'Cone', 'Sphere'], 'Solid Figures', 'A cube has six faces. Every face is an equal square.');
  if (/circle/.test(o)) {
    if (grade === 2) return number(`How many quarter circles make ${a} whole circles?`, a * 4, 'Parts of Circles', `Each whole circle has four quarters: ${a} × 4 = ${a * 4}.`);
    return g.generateCircleQuestion(grade, index, o);
  }
  if (/triangle|quadrilateral/.test(o)) return g.generatePolygonQuestion(grade, index, o);
  if (/compos.*figures/.test(o)) return number(`A composite figure contains ${a} squares and ${b} triangles without overlapping. How many basic shapes make up the figure?`, a + b, 'Composite Figures', `Count the separate pieces: ${a} squares + ${b} triangles = ${a + b} shapes.`);
  if (/graph|data|pictograph/.test(o)) return g.generateDataQuestion(grade, index, o);
  if (/money|peso|₱/.test(o)) return g.generateMoneyQuestion(grade, index, o, difficulty);
  if (/place value|value of a digit|digit.*place/.test(o)) {
    const digits = grade === 2 ? 3 : grade === 3 ? 4 : 6;
    const value = n(Math.min(g.getGradeNumberRange(grade, null, o), 10 ** digits - 1), 10 ** (digits - 1));
    const place = 10 ** (index % digits), digit = Math.floor(value / place) % 10;
    const names = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands', 10000: 'ten-thousands', 100000: 'hundred-thousands' };
    return number(`What digit is in the ${names[place]} place in ${value.toLocaleString('en-US')}?`, digit, 'Place Value', `The ${names[place]} place contains the digit ${digit}, with value ${digit * place}.`);
  }
  if (/round/.test(o) && !/product|quotient/.test(o)) {
    const place = /hundred thousand/.test(o) ? 100000 : /thousand/.test(o) ? 1000 : /hundred/.test(o) ? 100 : 10;
    const value = n(g.getGradeNumberRange(grade, null, o));
    return number(`Round ${value.toLocaleString('en-US')} to the nearest ${place.toLocaleString('en-US')}.`, Math.round(value / place) * place, 'Rounding', `Divide by ${place}, round to the nearest whole number, then multiply by ${place}.`);
  }
  if (/order|compare/.test(o) && /number/.test(o)) {
    const cap = g.getGradeNumberRange(grade, null, o), x = n(cap - 2), y = x + 1, z = x + 2;
    return choice(`Which list is ordered from smallest to largest?`, `${x}, ${y}, ${z}`, [`${x}, ${y}, ${z}`, `${z}, ${y}, ${x}`, `${y}, ${x}, ${z}`], 'Ordering Numbers', `${x} is less than ${y}, and ${y} is less than ${z}.`);
  }
  if (/read and write|read.*numerals/.test(o)) {
    const value = n(g.getGradeNumberRange(grade, null, o));
    return number(`Write this number in numerals: ${g.numberToWords(value)}.`, value, 'Reading Numerals', `The number written in digits is ${value.toLocaleString('en-US')}.`);
  }
  if (/count by/.test(o)) {
    const steps = grade === 2 ? [2, 5, 10, 20, 50, 100] : [2, 5, 10];
    const step = steps[index % steps.length], start = step * n(4);
    return number(`Count by ${step}s: ${start}, ${start + step}, ${start + 2 * step}, __.`, start + 3 * step, 'Skip Counting', `Add ${step} each time. ${start + 2 * step} + ${step} = ${start + 3 * step}.`);
  }
  // Action at the start wins over supporting words (e.g. division using multiplication tables).
  if (/^(illustrate|write|divide|solve).*divi|^divide/.test(o) || /divide numbers/.test(o)) return g.generateDivisionQuestion(grade, index, o, difficulty);
  if (/multiplication|multiply|equal groups|repeated addition/.test(o)) return g.generateMultiplicationQuestion(grade, index, o, difficulty);
  if (/subtraction|subtract/.test(o) && !/^(add|solve.*addition)/.test(o)) return g.generateSubtractionQuestion(grade, index, o, difficulty);
  return null;
}
module.exports = { lessonSkillQuestion };
