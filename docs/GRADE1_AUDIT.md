# Grade 1 lesson review

All 75 stored Grade 1 lesson IDs now have dedicated tasks and structured illustrations.
New tasks no longer use the generic text-based router. Questions are untimed, stay on Easy,
and have answer-specific explanations. Later two-digit lessons retain their intended
range rather than reducing every Grade 1 lesson to sums within 20.

| Lesson | Task family |
|---|---|
| G1-Q1-MG-01: Identify 2D Shapes | shape-name |
| G1-Q1-MG-02: Compare 2D Shapes | shape-compare |
| G1-Q1-MG-03: Compose and Decompose Shapes | shape-compose |
| G1-Q1-NA-01: Counting up to 100 | count-step |
| G1-Q1-NA-02: Read and Write Numerals up to 100 | numeral |
| G1-Q1-NA-03: Represent Numbers up to 100 | represent |
| G1-Q1-NA-04: Compare Numbers up to 20 | compare20 |
| G1-Q1-NA-05: Order Numbers up to 20 | order20 |
| G1-Q1-NA-06: Ordinal Numbers 1st to 10th | ordinal |
| G1-Q1-NA-07: Compose and Decompose Numbers up to 10 | number-parts |
| G1-Q1-NA-08: Illustrate Addition up to 20 | add20 |
| G1-Q1-NA-09: Properties of Addition | add-properties |
| G1-Q1-NA-10: Solve Addition Problems up to 20 | add-story20 |
| G1-Q2-MG-01: Measure Length and Distance | length-read |
| G1-Q2-MG-02: Compare Lengths and Distances | length-compare |
| G1-Q2-MG-03: Solve Length Problems | length-problem |
| G1-Q2-NA-01: Place Value in 2-Digit Numbers | place-value |
| G1-Q2-NA-02: Decompose 2-Digit Numbers | tens-ones |
| G1-Q2-NA-03: Count by 2s, 5s, and 10s | skip-count |
| G1-Q2-NA-04: Order Numbers up to 100 | order100 |
| G1-Q2-NA-05: Addition with Expanded Form | add-expanded |
| G1-Q2-NA-06: Add 2-Digit and 1-Digit Numbers | add21 |
| G1-Q2-NA-07: Add 2-Digit and 2-Digit Numbers | add22 |
| G1-Q2-NA-08: Solve Addition Problems up to 100 | add-story100 |
| G1-Q2-DP-01: Collect Data | collect-data |
| G1-Q2-DP-02: Present Data in Pictographs | make-pictograph |
| G1-Q2-DP-03: Interpret Pictographs | read-pictograph |
| G1-Q2-DP-04: Organize Pictograph Data | table-data |
| G1-Q2-NA-09: Illustrate Subtraction up to 20 | subtract20 |
| G1-Q2-NA-10: Find Missing Numbers | missing |
| G1-Q2-NA-11: Equivalent Expressions | equivalent |
| G1-Q2-NA-12: Solve Subtraction Problems up to 20 | subtract-story20 |
| G1-Q2-NA-13: Subtract 2-Digit and 1-Digit Numbers | subtract21 |
| G1-Q2-NA-14: Subtract 2-Digit and 2-Digit Numbers | subtract22 |
| G1-Q2-NA-15: Subtract with Expanded Form | subtract-expanded |
| G1-Q2-NA-16: Determine Next Terms in Patterns | pattern |
| G1-Q2-NA-17: Create Repeating Patterns | make-pattern |
| G1-Q2-NA-18: Illustrate Fractions 1/2 and 1/4 | fraction |
| G1-Q2-NA-19: Compare Fractions 1/2 and 1/4 | fraction-compare |
| G1-Q2-NA-20: Count Halves and Quarters | fraction-count |
| G1-Q2-NA-21: Philippine Coins and Bills up to ₱100 | money-name |
| G1-Q2-NA-22: Determine Value of Money | money-count |
| G1-Q2-NA-23: Compare Money Denominations | money-compare |
| G1-Q2-NA-24: Solve Money Problems | money-story |
| G1-Q2-MG-04: Half Turn and Quarter Turn | turn |
| G1-Q2-MG-05: Read and Write Time | clock |
| G1-Q2-MG-06: Days and Months Order | calendar-order |
| G1-Q2-MG-07: Use Calendar | calendar |
| G1-Q2-MG-08: Solve Time Problems | time-problem |
| G1-Q3-Quiz-01: Addition with Regrouping | add-regroup |
| G1-Q3-Quiz-02: Subtraction within 100 | subtract100 |
| G1-Q3-Quiz-03: Mixed Addition and Subtraction | mixed20 |
| G1-Q3-Quiz-04: Fractions - Half | half |
| G1-Q3-Quiz-05: Fractions - Quarter | quarter |
| G1-Q3-Quiz-06: Comparing Fractions | fraction-compare |
| G1-Q3-Quiz-07: Philippine Bills | bill |
| G1-Q3-Quiz-08: Money up to ₱100 | money-count |
| G1-Q3-Quiz-09: Money Word Problems | money-story |
| G1-Q3-Quiz-10: Length - Non-Standard Units | length-read |
| G1-Q3-Quiz-11: Comparing Lengths | length-compare |
| G1-Q3-Quiz-12: Days of the Week | days |
| G1-Q3-Quiz-13: Months of the Year | months |
| G1-Q3-Quiz-14: Calendar Reading | calendar |
| G1-Q4-Quiz-01: Pictographs - Reading | read-pictograph |
| G1-Q4-Quiz-02: Pictographs - Creating | make-pictograph |
| G1-Q4-Quiz-03: Patterns - Colors and Shapes | shape-pattern |
| G1-Q4-Quiz-04: Number Patterns | number-pattern |
| G1-Q4-Quiz-05: Problem Solving - Addition | add-story20 |
| G1-Q4-Quiz-06: Problem Solving - Subtraction | subtract-story20 |
| G1-Q4-Quiz-07: Problem Solving - Mixed | mixed-story |
| G1-Q4-Quiz-08: Review - Numbers 1-100 | number-review |
| G1-Q4-Quiz-09: Review - Addition and Subtraction | mixed100 |
| G1-Q4-Quiz-10: Review - Shapes and Patterns | shape-review |
| G1-Q4-Quiz-11: Review - Money and Time | money-time-review |
| G1-Q4-Quiz-12: Final Assessment Prep | review |

## Verification

Run node --test scripts/test-grade1-lessons.js for lesson coverage, answer/visual consistency,
carry/borrow rules and repeat-practice checks. Run node scripts/preview-grade1.js to regenerate
the gallery at http://localhost:3000/grade1-review.html.

## Teaching limits

These are guided practice tasks, not a complete assessment of every learning outcome.
Creating patterns and pictographs uses scaffolded selection/counting, rather than free drawing.
Money uses schematic value tokens, not photographs of Philippine currency.
Calendar tasks use a clearly labelled practice calendar, not a dated real-world calendar.
Two-digit decomposition currently practises reading tens and ones; place-value subskills
can be broadened further. The teacher review gallery is a preview, not a saved editing workflow.
A teacher should review pacing and curriculum suitability before classroom use.
