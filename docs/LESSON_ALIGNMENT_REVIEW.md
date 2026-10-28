# Lesson alignment review — 28 October 2026

The question generator now checks specific learning outcomes before broad categories.
This covers category names such as Fractions, Probability, Percentages, and Ratio and
Proportion that previously fell through to generic arithmetic. Word-boundary time
matching prevents centimeters from becoming a time lesson. Division using multiplication
tables stays division. Translation, capacity, area, surface area, unit conversions,
place value, reading numerals, and skip counting have specific routing/templates.

Arithmetic corrections include dissimilar fraction subtraction, same-denominator
operations in similar-fraction lessons, decimal multiplication/division at every
question index, four-decimal-place outcomes, decimal rounding targets, and equivalent
ratio distractors. Large numbers are written in words for numeral-reading questions.
Pie and double graphs have diagrams generated from their given data. These diagrams
do not use the correct-answer field.

Run:

```powershell
node --test scripts/test-lesson-alignment.cjs scripts/test-grade-policies.js scripts/test-grade1-questions.js scripts/test-question-diagrams.js scripts/test-question-scenes.js scripts/test-shape-questions.js
node scripts/audit-grade-questions.js
node scripts/preview-game.cjs
```

The audit exercises all 332 stored topics at Easy, Medium, and Hard and checks that
generation succeeds and options are distinct with a valid answer. It does not certify
complete instructional coverage. Some conceptual topics have fewer unique questions
than requested; the generator must not fill these with unrelated arithmetic.

Desktop and a 390-pixel mobile preview use the actual question renderer and stylesheet,
with a synthetic untimed fraction question, without submitting student answers or
changing student records. Mobile stacks answers and moves the read-aloud button below
the prompt; desktop displays three choices in a row.

## Remaining instructional limits

The new templates are focused practice, rather than a full interactive lesson for
every outcome. Drawing, construction, estimating, data collection, mixed-number word
problems, and multistep reasoning need deeper task banks and teacher review. Some
lessons still exercise a related prerequisite (for example, recognizing solid figures
before constructing nets). This must not be presented as full mastery of those outcomes.
The local stored curriculum is the reference for this change; alignment to an external
curriculum edition has not been independently certified.
