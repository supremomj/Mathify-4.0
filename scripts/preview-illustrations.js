// Regenerate the local illustration gallery after changing the renderer.
const fs = require('fs');
const path = require('path');
const { diagramFor } = require('../backend/question-diagrams');
const examples = [
  {question:'Maria has 3 apples and 2 oranges. How many fruits does she have in total?'},
  {question:'What is 3 × 4?'},
  {question:'What is 12 ÷ 3?'},
  {question:'The clock shows half past 3. What time is it?'},
  {question:'Which shape has 4 sides?',options:['Square','Circle','Triangle']},
  {question:'Which shape shows 1/4?',options:['Half shaded','Quarter shaded','Full shaded','Empty']},
  {question:'Maria has ₱20. Maria buys bread for ₱8. How much is left?'},
  {question:'An angle measures 60°. What type of angle is it?'},
  {question:'What comes next in this pattern: 2, 4, 6, 8?'},
  {question:'A pencil is 12 cm long. Another pencil is 8 cm long. What is their total length?'}
];
const cards = examples.map(question => {
  const diagram=diagramFor(question);
  return `<article><h2>${question.question}</h2><img src="${diagram.src}" alt="${diagram.alt}"/></article>`;
}).join('');
fs.writeFileSync(path.join(__dirname,'../src/illustration-preview.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mathify illustrations</title><style>body{margin:0;padding:32px;background:#f5f7ff;color:#312e81;font-family:Arial,sans-serif}main{max-width:1050px;margin:auto}h1{font-size:28px}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}article{padding:22px;background:white;border:1px solid #e0e7ff;border-radius:22px}h2{font-size:18px;line-height:1.5;margin:0 0 20px}img{width:100%;height:230px;object-fit:contain}</style><main><h1>Question illustrations</h1><p>Examples from the practice renderer.</p><section>${cards}</section></main></html>`);
