const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sqlite = require('sqlite3');
const source = fs.readFileSync('src/student-dashboard.js', 'utf8');
const dbSource = fs.readFileSync('backend/database.js', 'utf8');
const db = new sqlite.Database(':memory:');
const run = sql => new Promise((resolve, reject) => db.run(sql, e => e ? reject(e) : resolve()));
async function main() {
  await run('CREATE TABLE achievements (id INTEGER PRIMARY KEY, user_id INTEGER, achievement_type TEXT, achievement_title TEXT, achievement_message TEXT, topic_id INTEGER, session_id INTEGER, earned_at TEXT DEFAULT CURRENT_TIMESTAMP)');
  const ctx = { db };
  vm.createContext(ctx);
  vm.runInContext(dbSource.slice(dbSource.indexOf('function saveAchievement('), dbSource.indexOf('// Create admin account (for initial setup)')), ctx);
  const badge = { achievementType: 'on_fire', title: 'On Fire!', message: 'Five correct' };
  const results = await Promise.all(Array.from({ length: 12 }, () => ctx.saveAchievement(1, badge)));
  assert.equal(results.filter(r => r.awarded).length, 1, 'Concurrent saves must award only once');
  assert.equal((await ctx.getUserAchievements(1)).length, 1);
  assert.equal(await ctx.hasAchievement(1, 'on_fire'), true);
  assert.equal((await ctx.saveAchievement(2, badge)).awarded, true, 'Awards belong to individual users');
  const trackerSource = source.slice(source.indexOf('    class AchievementTracker'), source.indexOf('    const achievementTracker'));
  const c = { Date };
  vm.createContext(c);
  vm.runInContext(source.slice(source.indexOf('    function badgeProgress('), source.indexOf('    // Load and render achievements')), c);
  assert.equal(c.badgeProgress('bookworm', 3, 80).label, '3 of 5 lessons passed');
  assert.equal(c.badgeProgress('bookworm', 8, 80).value, 5);
  assert.equal(c.badgeProgress('perfect_score', 0, 85).value, 85);
  assert.equal(c.badgeProgress('sharpshooter', 0, 95).value, 90);
  assert.equal(c.badgeProgress('on_fire', 0, 0), null);
  assert.equal(c.badgeEarnedDate('invalid'), '');
  assert.equal(c.badgeEarnedDate(null), '');
  assert.ok(c.badgeEarnedDate('2026-10-28 14:00:00').includes('2026'));
  vm.runInContext(trackerSource + ';this.tracker = new AchievementTracker();', c);
  c.tracker.reset();
  for (let i = 1; i <= 5; i++) c.tracker.checkAchievements(i, 10, true);
  assert.equal(c.tracker.bestStreak, 5);
  c.tracker.checkAchievements(5, 10, false);
  assert.equal(c.tracker.consecutiveCorrect, 0);
  assert.equal(c.tracker.bestStreak, 5, 'A later miss must preserve the best streak');
  c.tracker.reset();
  assert.equal(c.tracker.bestStreak, 0);
  for (let i = 1; i <= 5; i++) {
    const earned = c.tracker.checkAchievements(i, 10, true);
    if (i === 5) assert.equal(earned[0].title, 'On Fire!', 'New quizzes must reset award tracking');
  }
  const start = source.indexOf('      const types = [];', source.indexOf('async function showGameResults'));
  const end = source.indexOf('      const allAchievements', start);
  for (const [score, streak, elapsed, expected] of [
    [10, 10, 299999, ['perfect_score', 'sharpshooter', 'on_fire', 'speed_runner']],
    [9, 4, 300000, ['sharpshooter']], [7, 5, 100000, ['on_fire', 'speed_runner']], [6, 3, 100000, []]
  ]) {
    const context = { currentGame: {score, totalQuestions:10}, percentage:score*10, isCompleted:score>=7,
      achievementTracker:{bestStreak:streak,startTime:1000}, Date:{now:()=>1000+elapsed} };
    vm.createContext(context);
    vm.runInContext(source.slice(start,end)+';this.typesResult=types;', context);
    assert.deepEqual(Array.from(context.typesResult), expected);
  }
  console.log('Badge checks passed: concurrent saves, persistence, per-user awards, streak resets, quiz scores, and speed boundary.');
}
main().catch(e => {console.error(e);process.exitCode=1;}).finally(()=>db.close());
