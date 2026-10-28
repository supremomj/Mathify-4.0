# Question diagrams

Contextual scenes now include story objects, equal groups, sharing models, analog
clocks, elapsed time, angles, ordinals, peso notes, measurement strips, fraction
options, patterns, probability bags, and explicitly named chart categories.
Repeated numeric headers, equations and the generic caption have been removed.
Unsupported wording retains the basic given-values fallback. These are locally
drawn vector illustrations; DeepSeek optionally chooses an object theme, rather
than generating arbitrary pictures or deciding mathematical facts.

Run `node scripts/preview-illustrations.js` to regenerate the example gallery at
`http://localhost:3000/illustration-preview.html`.

Every generated practice question includes a local SVG illustration.
Geometry questions show the named figures, including circles, triangles, squares,
rectangles, pentagons, hexagons, parallelograms and trapezoids. Shape identification
questions show every named answer option so the picture does not pick the answer.
Figures are schematic; measurements must be read from the question.

Small whole
numbers (1–20) are drawn as exact sets of counters; larger numbers, decimals,
negative numbers, and fractions keep their exact written values. Proper fractions
with denominators up to 12 also show an exactly shaded fraction bar. Simple arithmetic
shows the two given quantities and an unanswered expression. Other questions show
the values from the question, without assuming their relationship or solving it.
Questions without explicit numbers show a neutral thinking illustration. These
are supporting visuals, not full semantic diagrams for every curriculum topic.

Optional DeepSeek integration chooses contextual object themes (fruit, books,
balls, pencils, or counters). Mathify controls all quantities and SVG markup;
DeepSeek cannot change answers or supply executable markup. Only question text,
not student data or answers, is sent to DeepSeek. One request covers a quiz, with
an eight-second timeout and local fallback on errors or invalid themes.

Use Node.js 22.9 or later for automatic .env loading. Fill in DEEPSEEK_API_KEY in
the ignored root .env file with a new private key, then restart the server:

```powershell
node backend/server.js
```

DEEPSEEK_MODEL defaults to deepseek-flash and may be changed in .env. The key is
optional: offline counter diagrams appear immediately with no external API call.
API reference: https://api-docs.deepseek.com/api/create-chat-completion/

Run diagram checks with `node --test scripts/test-question-diagrams.js`.
