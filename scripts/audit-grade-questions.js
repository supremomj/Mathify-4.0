const sqlite3 = require('sqlite3');
const path = require('path');
const Generator = require('../backend/curriculum-question-generator');
const database = new sqlite3.Database(path.join(__dirname,'../mathify.db'),sqlite3.OPEN_READONLY);
database.all('SELECT * FROM curriculum_topics ORDER BY grade, quarter, id', (error,topics) => {
  if(error) throw error;
  const results = {};
  const errors = [];
  for(const topic of topics) {
    const grade = results[topic.grade] ||= {topics:0,questions:0,failures:0};
    grade.topics++;
    for(const difficulty of ['easy','medium','hard']) {
      Generator.clearAllRegistries();
      try {
        const questions = new Generator().generateQuestionsForTopic(topic,5,0,difficulty);
        if (!questions.length) throw new Error('No questions');
        for(const q of questions) {
          if (!q.question || q.correctAnswer === undefined || /NaN|undefined/.test(q.question)) throw new Error('Invalid question');
          if (q.options && (new Set(q.options).size !== q.options.length || q.options[q.correctAnswer] === undefined)) throw new Error('Invalid choices');
        }
        grade.questions += questions.length;
      } catch(error) {
        grade.failures++;
        errors.push({grade:topic.grade,title:topic.topic_title,difficulty,error:error.message});
      }
    }
  }
  console.log(JSON.stringify({results,errors},null,2));
  database.close();
  if(errors.length) process.exitCode=1;
});
