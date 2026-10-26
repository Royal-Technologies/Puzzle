/* ============================================================
   Puzzle PNG Generator — App Shell
   Mathematics Marvels | Royal Technologies
   ============================================================ */

'use strict';

// ── Universal Canvas roundRect polyfill ──
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (r === undefined) r = 0;
    if (typeof r === 'number') r = [r, r, r, r];
    const tl = r[0] || 0, tr = r[1] || r[0] || 0, br = r[2] || r[0] || 0, bl = r[3] || r[1] || r[0] || 0;
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    return this;
  };
}

// ── Dynamic generator lookup (always fresh from window) ──
function getGenerator(type) {
  const map = {
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
  return map[type] || null;
}

// ── State ──
let activeType    = 'geometry';
let activeDiff    = 'easy';
let currentPuzzle = null;

// ── DOM refs ──
const canvas           = document.getElementById('puzzle-canvas');
const subtypeSelect    = document.getElementById('subtype-select');
const typeSelect       = document.getElementById('puzzle-type-select');
const canvasBgSelect   = document.getElementById('canvas-bg-select');
const titleStyleSelect = document.getElementById('title-style-select');

const answerBox        = document.getElementById('answer-box');
const answerWrapper    = document.getElementById('answer-wrapper');
const answerText       = document.getElementById('answer-text');
const btnToggleAnswer  = document.getElementById('btn-toggle-answer');

const hintBox          = document.getElementById('hint-box');
const hintText         = document.getElementById('hint-text');

const btnGenerate      = document.getElementById('btn-generate');
const btnExport        = document.getElementById('btn-export');
const placeholder      = document.getElementById('canvas-placeholder');
const diffBtns         = document.querySelectorAll('.diff-btn');

const btnUiTheme       = document.getElementById('btn-ui-theme');
const themeIcon        = document.getElementById('theme-icon');
const themeLabel       = document.getElementById('theme-label');

// ── Populate subtype <select> for the given puzzle type ──
function populateSubtypes(type) {
  const gen = getGenerator(type);
  subtypeSelect.innerHTML = '';
  if (!gen || !gen.subtypes || !gen.subtypes.length) {
    const opt = document.createElement('option');
    opt.value = 'default';
    opt.textContent = 'Default';
    subtypeSelect.appendChild(opt);
    return;
  }
  gen.subtypes.forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    subtypeSelect.appendChild(opt);
  });
  subtypeSelect.selectedIndex = 0;
}

// ── Switch active puzzle type ──
function switchType(type) {
  const gen = getGenerator(type);
  if (!gen) {
    console.warn(`Generator not found for type: "${type}"`);
    return;
  }
  activeType = type;

  if (typeSelect.value !== type) typeSelect.value = type;

  populateSubtypes(type);
  hideInfoBoxes();
}

// ── Hide answer/hint boxes ──
function hideInfoBoxes() {
  answerBox.style.display = 'none';
  hintBox.style.display   = 'none';
  if (answerWrapper) answerWrapper.style.display = 'none';
  if (btnToggleAnswer) btnToggleAnswer.textContent = 'Show';
  answerText.textContent  = '';
  hintText.textContent    = '';
}

// ── Show answer and hint in sidebar ──
function showPuzzleInfo(puzzleData) {
  if (puzzleData.answer) {
    answerText.textContent = puzzleData.answer;
    answerBox.style.display = 'flex';
  } else {
    answerBox.style.display = 'none';
  }

  if (puzzleData.hint) {
    hintText.textContent = puzzleData.hint;
    hintBox.style.display = 'flex';
  } else {
    hintBox.style.display = 'none';
  }
}

// ── Render current puzzle to canvas with active options ──
function renderCurrentToCanvas() {
  if (!currentPuzzle) return;
  const bgTheme = canvasBgSelect.value || 'cream-paper';
  const titleMode = titleStyleSelect.value || 'nopen';

  try {
    window.ModernCleanTemplate.render(canvas, currentPuzzle, {
      bgTheme: bgTheme,
      titleMode: titleMode
    });
  } catch (err) {
    console.error('Template render error:', err);
  }

  canvas.classList.add('visible');
  placeholder.style.display = 'none';
}

// ── Generate and render a puzzle ──
function generatePuzzle() {
  const gen = getGenerator(activeType);
  if (!gen) {
    console.error(`No generator registered for type: ${activeType}`);
    return;
  }

  let subtype = subtypeSelect.value;
  if (!subtype && gen.subtypes && gen.subtypes.length) {
    subtype = gen.subtypes[0].value;
  }

  btnGenerate.textContent = '⏳ Generating…';
  btnGenerate.disabled = true;

  setTimeout(() => {
    try {
      const raw = gen.generate(subtype, activeDiff);
      // Ensure compliance with AGENTS.md data contract
      currentPuzzle = {
        id: 'MM-' + Date.now().toString(36).toUpperCase(),
        category: activeType,
        difficulty: activeDiff,
        timestamp: new Date().toISOString(),
        validationStatus: 'VALIDATED',
        ...raw
      };
    } catch (err) {
      console.error('Generator error:', err);
      btnGenerate.textContent = '🎲 Generate Puzzle';
      btnGenerate.disabled = false;
      return;
    }

    renderCurrentToCanvas();
    showPuzzleInfo(currentPuzzle);

    btnGenerate.textContent = '🎲 Generate Puzzle';
    btnGenerate.disabled = false;
  }, 16);
}

// ── Export 1080×1080 PNG ──
function exportPNG() {
  if (!currentPuzzle) {
    alert('Please generate a puzzle first!');
    return;
  }
  const filename = `MathematicsMarvels-${activeType}-${currentPuzzle.id}.png`;
  window.PNGExporter.export(canvas, filename);
}

// ── Wire up puzzle type dropdown ──
typeSelect.addEventListener('change', () => {
  switchType(typeSelect.value);
  generatePuzzle();
});

// ── Wire up difficulty buttons ──
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeDiff = btn.dataset.diff;
    diffBtns.forEach(b => b.classList.toggle('active', b === btn));
    generatePuzzle();
  });
});

// ── Canvas background & title style selectors: re-render instantly! ──
canvasBgSelect.addEventListener('change', () => {
  if (currentPuzzle) renderCurrentToCanvas();
});

titleStyleSelect.addEventListener('change', () => {
  if (currentPuzzle) renderCurrentToCanvas();
});

// ── Subtype select: regenerate on change ──
subtypeSelect.addEventListener('change', () => {
  if (currentPuzzle) generatePuzzle();
});

// ── Answer toggle button ──
if (btnToggleAnswer) {
  btnToggleAnswer.addEventListener('click', () => {
    const isHidden = answerWrapper.style.display === 'none';
    answerWrapper.style.display = isHidden ? 'block' : 'none';
    btnToggleAnswer.textContent = isHidden ? 'Hide' : 'Show';
  });
}

// ── UI Dark / Light Theme Toggle ──
if (btnUiTheme) {
  btnUiTheme.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    themeIcon.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
    themeLabel.textContent = nextTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
  });
}

// ── Wire up Generate / Export buttons ──
btnGenerate.addEventListener('click', generatePuzzle);
btnExport.addEventListener('click', exportPNG);

// ── Initialise on page load ──
(function init() {
  switchType('geometry');
  setTimeout(generatePuzzle, 100);
})();
