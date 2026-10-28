# Grade-specific practice

The question request now carries the actual difficulty selected by the dashboard.
Students start new topics on Easy. Grade 1 remains Easy; Grade 2 advances at most
to Medium. Grades 3–6 may advance to Hard after at least five attempts in the same
topic and a best score of 90 or higher. Two attempts and a best score of at least
70 allow Medium. This uses the progress fields available today; best score is not
a record of consecutive successful attempts.

Whole-number ceilings follow the existing stored curriculum: Grade 1 up to 100,
Grade 2 up to 1,000, Grade 3 up to 10,000, and Grades 4–6 up to 1,000,000. Smaller
explicit lesson limits take precedence. Easy arithmetic uses smaller ranges;
Hard never increases a number beyond its grade/lesson ceiling. Grade 1 Easy
arithmetic is within 20. General word problems also use separate grade ranges;
Grade 2 fallback word problems do not introduce multiplication packs.

Specific decimal, fraction, factor and ratio skills take priority over generic
words like “represent”. Combined addition/subtraction and multiplication/division
lessons alternate their operations. Fraction and probability options keep the
correct answer after shuffling and avoid equivalent duplicate choices. Quarter
past and its equivalent numeric time no longer appear as competing answers.

The browser no longer silently substitutes its separate legacy generator if a
lesson fails. It shows a retry message instead, preserving the selected grade
and topic. Existing in-progress quizzes must be restarted to pick up changes.

Validation:

```powershell
node --test scripts/test-grade-policies.js scripts/test-grade1-questions.js scripts/test-question-diagrams.js scripts/test-question-scenes.js scripts/test-shape-questions.js
node scripts/audit-grade-questions.js
```

The audit reads the local SQLite curriculum without changing student records.
It checks generation and choice integrity across all stored topics/difficulties.
It is not a certification that every generated question fully covers every
curriculum outcome; some broad or unsupported outcomes still use basic fallback
templates. Curriculum coverage and instructional pacing need a separate review.
