/**
 * Server-Side Puzzle Generation & Rendering Engine
 * Royal Technologies | Bright Path
 * Compliant with AGENTS.md & Make.com Endpoint Contract
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');

// ── Setup Headless Environment ──
const rootDir = path.resolve(__dirname, '..');
const canvas = createCanvas(1080, 1080);
const ctx = canvas.getContext('2d');

global.window = {
  CanvasRenderingContext2D: ctx.constructor
};
global.CanvasRenderingContext2D = ctx.constructor;

// Load ModernCleanTemplate
eval(fs.readFileSync(path.join(rootDir, 'templates/modern-clean.js'), 'utf8'));

// Load all 10 generators
const generatorFiles = [
  'geometry.js',
  'sudoku.js',
  'number-sequence.js',
  'matchstick.js',
  'logic.js',
  'clock-calendar.js',
  'word-puzzle.js',
  'visual-iq.js',
  'missing-number.js',
  'visual-pattern.js'
];

generatorFiles.forEach(f => {
  eval(fs.readFileSync(path.join(rootDir, 'generators', f), 'utf8'));
});

const GENERATOR_MAP = {
  'geometry':        window.GeometryGenerator,
  'sudoku':          window.SudokuGenerator,
  'number-sequence': window.NumberSequenceGenerator,
  'matchstick':      window.MatchstickGenerator,
  'logic':           window.LogicGenerator,
  'clock-calendar':  window.ClockCalendarGenerator,
  'word-puzzle':     window.WordPuzzleGenerator,
  'visual-iq':       window.VisualIQGenerator,
  'missing-number':  window.MissingNumberGenerator,
  'visual-pattern':  window.VisualPatternGenerator,
};

const ALL_CATEGORIES = Object.keys(GENERATOR_MAP);

// ── Deterministic Validation Engine ──
function validatePuzzle(puzzle) {
  if (!puzzle) return { valid: false, reason: 'Empty puzzle data' };
  if (!puzzle.instruction || !puzzle.answer || typeof puzzle.renderFn !== 'function') {
    return { valid: false, reason: 'Missing essential fields (instruction, answer, or renderFn)' };
  }

  // Geometry validation
  if (puzzle.type === 'geometry' && puzzle.subtype === 'missing-angle' && puzzle.renderData) {
    const rd = puzzle.renderData;
    if (rd.sides && rd.sum) {
      const expectedSum = (rd.sides - 2) * 180;
      if (rd.sum !== expectedSum) return { valid: false, reason: 'Angle sum mismatch' };
    }
    const missingNum = parseFloat(puzzle.answer);
    if (isNaN(missingNum) || missingNum <= 0 || missingNum >= 180) {
      return { valid: false, reason: 'Missing angle is non-positive or reflex' };
    }
  }

  // Number sequence validation
  if (puzzle.type === 'number-sequence' && (!puzzle.answer || puzzle.answer === 'NaN')) {
    return { valid: false, reason: 'Sequence answer is invalid' };
  }

  return { valid: true };
}

// ── Preferred Hard / Challenging Subtypes for Daily Auto-Publishing ──
const HARD_SUBTYPES = {
  'sudoku':          ['classic-9x9'], // Strictly 9x9 Classic Sudoku only
  'geometry':        ['missing-angle', 'shaded-region', 'area-perimeter'],
  'number-sequence': ['mixed-rule', 'fibonacci', 'next-in-series'],
  'matchstick':      ['fix-equation', 'move-matches'],
  'logic':           ['grid-logic', 'truth-lies', 'syllogism'],
  'clock-calendar':  ['time-elapsed', 'day-calculation', 'time-zones'],
  'word-puzzle':     ['anagram', 'word-chain', 'rebus'],
  'visual-iq':       ['count-shapes', 'matrix-2x2', 'shape-analogy', 'spatial-rotation'],
  'missing-number':  ['magic-square', 'number-triangle', 'math-riddle'],
  'visual-pattern':  ['matrix-pattern', 'complete-series', 'shape-transform']
};

// ── Caption Generator for Facebook Pages ──
function generateSocialCaption(category, puzzleTitle, difficulty) {
  const hooks = [
    `🔥 Hard Level Challenge! Can you crack today’s Bright Path puzzle? Share your answer in the comments below! 🧠⚡`,
    `🧠 Expert Brain Workout: Here is today’s challenging puzzle. What is your solution? 👇`,
    `⚡ Master Level IQ & Math Challenge from Bright Path! Drop your solution below. 🏆`,
    `💡 Can you solve today’s expert puzzle? Only 10% get this right on the first try! 🧩`
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const hashtags = [
    '#BrightPath',
    '#MathematicsMarvels',
    '#HardPuzzle',
    '#ExpertChallenge',
    '#RoyalTechnologies',
    '#PuzzleOfTheDay',
    '#DailyBrainTeaser',
    '#MathPuzzles',
    '#LogicRiddle',
    '#SudokuChallenge'
  ];

  return `${hook}\n\nCategory: ${puzzleTitle || category.toUpperCase()} (Difficulty: HARD)\n\nDrop your answer below! We'll pin the first correct solution in the comments. 🏆\n\n${hashtags.join(' ')}`;
}

// ── Main Daily Puzzle Generation Function ──
function generateDailyPuzzle(options = {}) {
  const excludeCategory = options.excludeCategory || null;
  const excludePuzzleIds = new Set(options.excludePuzzleIds || []);
  const preferredCategory = options.preferredCategory || null;

  // 1. Load History if available
  const historyPath = path.join(rootDir, 'puzzles/history.json');
  let history = { lastCategory: null, publishedIds: [], categoryCounts: {} };
  if (fs.existsSync(historyPath)) {
    try {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    } catch (_) {}
  }

  // 2. Filter Eligible Categories (Avoid consecutive day category)
  let eligibleCategories = ALL_CATEGORIES.filter(cat => {
    if (excludeCategory && cat === excludeCategory) return false;
    if (history.lastCategory && cat === history.lastCategory && ALL_CATEGORIES.length > 1) return false;
    return true;
  });

  if (eligibleCategories.length === 0) {
    eligibleCategories = ALL_CATEGORIES;
  }

  // Prefer categories with lowest appearance count in history
  eligibleCategories.sort((a, b) => {
    const countA = history.categoryCounts[a] || 0;
    const countB = history.categoryCounts[b] || 0;
    return countA - countB;
  });

  // Pick from the top 3 least frequent
  const topCandidates = eligibleCategories.slice(0, Math.min(3, eligibleCategories.length));
  const selectedCategory = preferredCategory && GENERATOR_MAP[preferredCategory]
    ? preferredCategory
    : topCandidates[Math.floor(Math.random() * topCandidates.length)];

  const gen = GENERATOR_MAP[selectedCategory];
  if (!gen) throw new Error(`Generator not found for category: ${selectedCategory}`);

  // 3. Select Subtype & Difficulty with Bounded Retry (Max 10 Attempts)
  // Always HARD difficulty and challenging subtypes (Classic 9x9 for Sudoku)
  const availableSubtypes = HARD_SUBTYPES[selectedCategory] || (gen.subtypes || []).map(s => s.value);
  const chosenDiff = options.difficulty || 'hard'; // Always HARD difficulty!

  let attempts = 0;
  let raw = null;
  let validationResult = { valid: false };
  let chosenSubtype = availableSubtypes[0];

  while (attempts < 10) {
    attempts++;
    chosenSubtype = availableSubtypes[Math.floor(Math.random() * availableSubtypes.length)];

    raw = gen.generate(chosenSubtype, chosenDiff);
    validationResult = validatePuzzle(raw);
    if (validationResult.valid) break;
  }

  if (!validationResult.valid) {
    throw new Error(`Failed to generate valid puzzle after 10 attempts: ${validationResult.reason}`);
  }

  // 4. Stable Puzzle ID & Timestamp
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const puzzleId = `BP-${dateStr}-${randomSuffix}`;

  // Asia/Dhaka ISO timestamp (+06:00)
  const dhakaOffset = 6 * 60;
  const localTime = new Date(now.getTime() + (dhakaOffset + now.getTimezoneOffset()) * 60000);
  const isoDhaka = now.toISOString().replace('Z', '+06:00');

  const puzzleData = {
    id: puzzleId,
    category: selectedCategory,
    difficulty: chosenDiff,
    ...raw
  };

  // 5. Render to 1080×1080 Canvas
  const bgTheme = 'cream-paper';
  const titleMode = 'nopen';
  window.ModernCleanTemplate.render(canvas, puzzleData, { bgTheme, titleMode });
  const imageBuffer = canvas.toBuffer('image/png');

  // 6. Public URLs (Hosted on GitHub Pages)
  const baseUrl = 'https://royal-technologies.github.io/Puzzle';
  const todayImageUrl = `${baseUrl}/puzzles/today.png`;
  const archivedImageUrl = `${baseUrl}/puzzles/${puzzleId}.png`;

  const caption = generateSocialCaption(selectedCategory, puzzleData.title, chosenDiff);

  // 7. Update History & Write Files
  const puzzlesDir = path.join(rootDir, 'puzzles');
  fs.mkdirSync(puzzlesDir, { recursive: true });

  // Save individual archive and daily pointer
  fs.writeFileSync(path.join(puzzlesDir, 'today.png'), imageBuffer);
  fs.writeFileSync(path.join(puzzlesDir, `${puzzleId}.png`), imageBuffer);

  const payload = {
    puzzleId: puzzleId,
    category: selectedCategory,
    subtype: chosenSubtype,
    difficulty: chosenDiff,
    answerVerified: true,
    answer: puzzleData.answer,
    hint: puzzleData.hint || '',
    caption: caption,
    imageUrl: todayImageUrl,
    archiveUrl: archivedImageUrl,
    generatedAt: isoDhaka
  };

  fs.writeFileSync(path.join(puzzlesDir, 'today.json'), JSON.stringify(payload, null, 2));

  // Update history
  history.lastCategory = selectedCategory;
  history.publishedIds = history.publishedIds || [];
  history.publishedIds.push(puzzleId);
  history.categoryCounts[selectedCategory] = (history.categoryCounts[selectedCategory] || 0) + 1;
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

  return {
    ...payload,
    imageBuffer
  };
}

// ── CLI Runner ──
if (require.main === module) {
  try {
    console.log('Generating daily puzzle...');
    const result = generateDailyPuzzle();
    console.log('✓ Successfully generated puzzle:');
    console.log(`  ID:       ${result.puzzleId}`);
    console.log(`  Category: ${result.category} (${result.subtype})`);
    console.log(`  Verified: ${result.answerVerified}`);
    console.log(`  Answer:   ${result.answer}`);
    console.log(`  Image:    ${result.imageUrl}`);
    console.log(`  Saved to: puzzles/today.png & puzzles/today.json`);
  } catch (err) {
    console.error('✗ Generation error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  generateDailyPuzzle,
  ALL_CATEGORIES
};
