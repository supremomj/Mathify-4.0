const fs = require('fs');
const { diagramFor } = require('../backend/question-diagrams');
const source = fs.readFileSync('src/student-dashboard.js', 'utf8');
const renderer = source.slice(source.indexOf('    async function renderGameScreen('), source.indexOf('    // Show hint function'));
const question = { question: 'Which fraction is greater: 1/4 or 2/4?', type: 'multiple-choice', options: ['1/4', '2/4', 'They are equal'], correctAnswer: 1, skill: 'Comparing Fractions', practiceUntimed: true };
question.diagram = diagramFor(question);
fs.writeFileSync('src/game-layout-review.html', `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mathify game layout review</title><link rel="stylesheet" href="student-dashboard.css"><style>body{margin:0}#gameContainer{position:fixed;inset:0;overflow-y:auto;background:var(--bg)}</style><div id="gameContainer"></div><script>const currentGame={currentQuestion:0,totalQuestions:10,questions:[${JSON.stringify(question)}],timerLimit:30,score:2,difficulty:'easy',coinsEarned:4,currentHintLevel:0};function closeGameInterface(){}function checkAnswer(){}function readAloud(){}function showHint(){}${renderer}\nrenderGameScreen(document.getElementById('gameContainer'),{topic_title:'Grade 2 · Compare Fractions'});</script></html>`);
fs.writeFileSync('src/game-layout-mobile.html', '<!doctype html><html><meta charset="utf-8"><title>Mobile layout review</title><body style="margin:0;background:#e2e8f0"><iframe title="390 pixel mobile quiz preview" src="game-layout-review.html" style="display:block;width:390px;height:844px;max-width:100%;border:0;margin:0 auto"></iframe></body></html>');
console.log('Preview: http://localhost:3000/game-layout-review.html');
