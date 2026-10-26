/**
 * MatchstickGenerator
 * Generates matchstick puzzles: fix equations, move matches,
 * count squares, and make shapes.
 */
window.MatchstickGenerator = {
  name: 'Matchstick',
  subtypes: [
    { value: 'fix-equation',  label: 'Fix the Equation' },
    { value: 'move-matches',  label: 'Move Matches' },
    { value: 'count-squares', label: 'Count the Squares' },
    { value: 'make-shape',    label: 'Make the Shape' },
  ],

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  /**
   * Draw a single matchstick.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x1 x start
   * @param {number} y1 y start
   * @param {number} x2 x end
   * @param {number} y2 y end
   * @param {boolean} [headAtStart=true] draw head at start point
   */
  _drawStick(ctx, x1, y1, x2, y2, headAtStart = true) {
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Head: small dark circle
    const hx = headAtStart ? x1 : x2;
    const hy = headAtStart ? y1 : y2;
    ctx.beginPath();
    ctx.arc(hx, hy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B0000';
    ctx.fill();
  },

  // ─── 7-Segment Digit Drawing ──────────────────────────────────────────────

  /**
   * Draw a 7-segment-style digit at position (ox, oy).
   * segW = width, segH = height of the digit cell.
   */
  _drawDigit(ctx, digit, ox, oy, segW, segH) {
    const m = 4; // margin from edge to segment
    const t = segH / 2; // half height for middle segment y

    /**
     * Segment map for digits 0-9:
     * [top, topLeft, topRight, middle, botLeft, botRight, bottom]
     */
    const segMap = {
      0: [1,1,1,0,1,1,1],
      1: [0,0,1,0,0,1,0],
      2: [1,0,1,1,1,0,1],
      3: [1,0,1,1,0,1,1],
      4: [0,1,1,1,0,1,0],
      5: [1,1,0,1,0,1,1],
      6: [1,1,0,1,1,1,1],
      7: [1,0,1,0,0,1,0],
      8: [1,1,1,1,1,1,1],
      9: [1,1,1,1,0,1,1],
    };

    const segs = segMap[digit] || segMap[0];

    // Segment definitions: [x1, y1, x2, y2]
    const defs = [
      [m,        0,        segW - m, 0       ], // top
      [0,        m,        0,        t - m   ], // topLeft
      [segW,     m,        segW,     t - m   ], // topRight
      [m,        t,        segW - m, t       ], // middle
      [0,        t + m,    0,        segH - m], // botLeft
      [segW,     t + m,    segW,     segH - m], // botRight
      [m,        segH,     segW - m, segH    ], // bottom
    ];

    segs.forEach((on, i) => {
      if (!on) return;
      const [x1, y1, x2, y2] = defs[i];
      this._drawStick(ctx, ox + x1, oy + y1, ox + x2, oy + y2, i % 2 === 0);
    });
  },

  /**
   * Draw a number (possibly multi-digit) using 7-segment style.
   * Returns the total pixel width used.
   */
  _drawNumber(ctx, num, ox, oy, segW, segH) {
    const digits = String(Math.abs(num)).split('').map(Number);
    let curX = ox;
    digits.forEach((d, i) => {
      this._drawDigit(ctx, d, curX, oy, segW, segH);
      curX += segW + 14;
    });
    return curX - ox - 14;
  },

  /**
   * Draw a +, - or = symbol using sticks.
   */
  _drawSymbol(ctx, sym, ox, oy, segW, segH) {
    const my = oy + segH / 2;
    const mx = ox + segW / 2;
    if (sym === '+') {
      this._drawStick(ctx, ox, my, ox + segW, my);
      this._drawStick(ctx, mx, oy + segH * 0.2, mx, oy + segH * 0.8);
    } else if (sym === '-') {
      this._drawStick(ctx, ox, my, ox + segW, my);
    } else if (sym === '=') {
      this._drawStick(ctx, ox, my - 8, ox + segW, my - 8);
      this._drawStick(ctx, ox, my + 8, ox + segW, my + 8);
    }
    return segW;
  },

  /**
   * Render a full equation string like "6+4=9"
   * Returns total width.
   */
  _drawEquation(ctx, equation, startX, startY, segW, segH) {
    const gap = 18;
    let cx = startX;
    const tokens = equation.split('');
    for (const ch of tokens) {
      if ('0123456789'.includes(ch)) {
        const w = this._drawNumber(ctx, parseInt(ch), cx, startY, segW, segH);
        cx += w + gap;
      } else {
        this._drawSymbol(ctx, ch, cx, startY, segW, segH);
        cx += segW + gap;
      }
    }
  },

  // ─── Matchstick Square Grid ───────────────────────────────────────────────

  /**
   * Draw an NxM grid of matchstick squares at (gx, gy) with cellSize.
   */
  _drawSquareGrid(ctx, cols, rows, gx, gy, cellSize) {
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Horizontal sticks
        this._drawStick(ctx,
          gx + c * cellSize, gy + r * cellSize,
          gx + (c + 1) * cellSize, gy + r * cellSize, c === 0);
      }
    }
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Vertical sticks
        this._drawStick(ctx,
          gx + c * cellSize, gy + r * cellSize,
          gx + c * cellSize, gy + (r + 1) * cellSize, r === 0);
      }
    }
  },

  // ─── Puzzle Banks ─────────────────────────────────────────────────────────

  _fixEquationPuzzles: {
    easy: [
      { wrong: '5+3=9',  instruction: 'Move 1 matchstick to fix the equation.',  answer: '5+3=8  or  6+3=9' },
      { wrong: '6+4=9',  instruction: 'Move 1 matchstick to fix the equation.',  answer: '5+4=9  or  6+4=10' },
      { wrong: '4-1=4',  instruction: 'Move 1 matchstick to make the equation correct.', answer: '4-1=3' },
      { wrong: '3+3=9',  instruction: 'Move 1 matchstick to fix the equation.',  answer: '3+3=6' },
      { wrong: '8-3=4',  instruction: 'Move 1 matchstick to fix the equation.',  answer: '8-3=5  or  9-4=5' },
      { wrong: '2+3=6',  instruction: 'Move 1 matchstick to fix the equation.',  answer: '2+3=5  or  3+3=6' },
    ],
    medium: [
      { wrong: '6+4=9',  instruction: 'Move 2 matchsticks to fix the equation.', answer: '0+4=4  or  other valid' },
      { wrong: '8-5=4',  instruction: 'Move 2 matchsticks to fix the equation.', answer: '8-5=3  or  8-4=4' },
      { wrong: '3+8=8',  instruction: 'Move 2 matchsticks to make it correct.',  answer: '3+5=8  or  3+8=11' },
      { wrong: '9-5=5',  instruction: 'Move 2 matchsticks to fix the equation.', answer: '9-4=5  or  9-5=4' },
      { wrong: '7+2=4',  instruction: 'Move 2 matchsticks to fix the equation.', answer: '1+2=4  is wrong → 1+3=4' },
    ],
    hard: [
      { wrong: '5+5=9',  instruction: 'Move 1 matchstick to fix this tricky equation.',  answer: '5+5=10  (move from 9 to make 10)' },
      { wrong: '8+3=4',  instruction: 'Move 1 matchstick — think carefully!',             answer: '0+3=4? No → 8+3=11? … 6+3=9, or B+3=4' },
      { wrong: '3+9=5',  instruction: 'Move 1 matchstick to fix the equation.',           answer: '3+9=12? → 9-4=5' },
      { wrong: '6-5=4',  instruction: 'Move 1 matchstick — only one move allowed.',       answer: '6-5=1  (move 1 stick)' },
    ],
  },

  _moveMatchPuzzles: {
    easy: [
      { cols: 3, rows: 1, cellSize: 80, move: 1, instruction: 'Move 1 matchstick to leave exactly 2 squares.', answer: 'Move an outer vertical stick to close a gap.' },
      { cols: 2, rows: 2, cellSize: 80, move: 2, instruction: 'Move 2 matchsticks to make the shape into a cross (+).', answer: 'Move two outer sticks inward.' },
    ],
    medium: [
      { cols: 3, rows: 1, cellSize: 80, move: 2, instruction: 'Move 2 matchsticks to make 4 squares (overlapping allowed).', answer: 'Create a 2×2 arrangement.' },
      { cols: 2, rows: 2, cellSize: 80, move: 3, instruction: 'Move 3 matchsticks to make 3 squares in a row.', answer: 'Rearrange to a 3×1 grid.' },
    ],
    hard: [
      { cols: 4, rows: 1, cellSize: 70, move: 3, instruction: 'Move 3 matchsticks to create exactly 3 squares.', answer: 'Rearrange carefully — some squares may overlap.' },
      { cols: 3, rows: 2, cellSize: 70, move: 4, instruction: 'Move 4 matchsticks to make a 3×1 row of squares.', answer: 'Collapse the two rows into one row of 3.' },
    ],
  },

  _countSquaresPuzzles: {
    easy:   [{ cols: 2, rows: 2, answer: '5',  explanation: '4 small squares + 1 large (2×2) = 5' }],
    medium: [{ cols: 3, rows: 2, answer: '8',  explanation: '6 (1×1) + 2 (2×1)... actually 6+2=8' }],
    hard:   [{ cols: 3, rows: 3, answer: '14', explanation: '9 (1×1) + 4 (2×2) + 1 (3×3) = 14' }],
  },

  _makeShapePuzzles: {
    easy:   [{ sticks: 6,  target: '2 triangles', hint: 'Arrange 6 matchsticks to form 2 separate triangles.' }],
    medium: [{ sticks: 12, target: '4 squares',   hint: 'Use 12 matchsticks to form 4 separate squares (3 each).' }],
    hard:   [{ sticks: 9,  target: '3 triangles', hint: 'Share sticks between triangles — 9 matchsticks for 3 triangles.' }],
  },

  // ─── Main Generate ────────────────────────────────────────────────────────

  generate(subtype, difficulty) {
    const gen = this;

    if (subtype === 'fix-equation') {
      const pool = this._fixEquationPuzzles[difficulty] || this._fixEquationPuzzles.easy;
      const puzzle = pool[this._rnd(0, pool.length - 1)];
      return {
        type: 'matchstick', subtype, difficulty,
        title: 'Fix the Equation',
        instruction: `${puzzle.instruction}\n\n${puzzle.wrong}`,
        answer: puzzle.answer,
        hint: 'Think about which segment of a digit can be moved to change its value.',
        renderFn(ctx, x, y, w, h) {
          const segW = 40, segH = 70;
          // Estimate total equation width (rough: 7 chars × ~65px)
          const totalW = puzzle.wrong.replace(/[^0-9]/g, '').length * (segW + 14) +
                         puzzle.wrong.replace(/[0-9]/g, '').length * (segW + 18);
          const startX = x + (w - totalW * 0.95) / 2;
          const startY = y + (h - segH) / 2 - 20;
          gen._drawEquation(ctx, puzzle.wrong, startX, startY, segW, segH);

          // Instruction text
          ctx.font = 'bold 26px Arial, sans-serif';
          ctx.fillStyle = '#6C63FF';
          ctx.textAlign = 'center';
          ctx.fillText(puzzle.instruction, x + w / 2, startY + segH + 52);
          ctx.font = '20px Arial, sans-serif';
          ctx.fillStyle = '#E74C3C';
          ctx.fillText('⚠ This equation is WRONG — fix it!', x + w / 2, startY - 30);
          ctx.textAlign = 'left';
        }
      };
    }

    if (subtype === 'move-matches') {
      const pool = this._moveMatchPuzzles[difficulty] || this._moveMatchPuzzles.easy;
      const puzzle = pool[this._rnd(0, pool.length - 1)];
      return {
        type: 'matchstick', subtype, difficulty,
        title: 'Move Matches',
        instruction: puzzle.instruction,
        answer: puzzle.answer,
        hint: `You can only move ${puzzle.move} matchstick(s).`,
        renderFn(ctx, x, y, w, h) {
          const totalGridW = puzzle.cols * puzzle.cellSize;
          const totalGridH = puzzle.rows * puzzle.cellSize;
          const gx = x + (w - totalGridW) / 2;
          const gy = y + (h - totalGridH) / 2 - 30;
          gen._drawSquareGrid(ctx, puzzle.cols, puzzle.rows, gx, gy, puzzle.cellSize);

          ctx.font = 'bold 26px Arial, sans-serif';
          ctx.fillStyle = '#6C63FF';
          ctx.textAlign = 'center';
          ctx.fillText(puzzle.instruction, x + w / 2, gy + totalGridH + 52);
          ctx.font = '20px Arial, sans-serif';
          ctx.fillStyle = '#888';
          ctx.fillText(`Moves allowed: ${puzzle.move}`, x + w / 2, y + h - 22);
          ctx.textAlign = 'left';
        }
      };
    }

    if (subtype === 'count-squares') {
      const puzzle = (this._countSquaresPuzzles[difficulty] || this._countSquaresPuzzles.easy)[0];
      const totalCount = (() => {
        let total = 0;
        const cols = puzzle.cols, rows = puzzle.rows;
        for (let w2 = 1; w2 <= Math.min(cols, rows); w2++) {
          for (let h2 = 1; h2 <= Math.min(rows, cols); h2++) {
            if (w2 === h2) {
              total += (cols - w2 + 1) * (rows - h2 + 1);
            }
          }
        }
        return total;
      })();

      return {
        type: 'matchstick', subtype, difficulty,
        title: 'Count the Squares',
        instruction: `How many squares (of ALL sizes) can you find in this ${puzzle.cols}×${puzzle.rows} matchstick grid?`,
        answer: `${puzzle.answer} squares — ${puzzle.explanation}`,
        hint: 'Count small squares first, then larger squares made of multiple cells.',
        renderFn(ctx, x, y, w, h) {
          const cellSize = difficulty === 'hard' ? 90 : 100;
          const totalGridW = puzzle.cols * cellSize;
          const totalGridH = puzzle.rows * cellSize;
          const gx = x + (w - totalGridW) / 2;
          const gy = y + (h - totalGridH) / 2 - 30;
          gen._drawSquareGrid(ctx, puzzle.cols, puzzle.rows, gx, gy, cellSize);

          ctx.font = 'bold 30px Arial, sans-serif';
          ctx.fillStyle = '#1A1A2E';
          ctx.textAlign = 'center';
          ctx.fillText('How many squares can you find?', x + w / 2, gy - 28);
          ctx.font = '22px Arial, sans-serif';
          ctx.fillStyle = '#888';
          ctx.fillText('(Include ALL sizes — small AND large!)', x + w / 2, y + h - 22);
          ctx.textAlign = 'left';
        }
      };
    }

    // make-shape
    const puzzle = (this._makeShapePuzzles[difficulty] || this._makeShapePuzzles.easy)[0];
    return {
      type: 'matchstick', subtype, difficulty,
      title: 'Make the Shape',
      instruction: `Use exactly ${puzzle.sticks} matchsticks to make ${puzzle.target}.\n${puzzle.hint}`,
      answer: `Arrange ${puzzle.sticks} matchsticks into ${puzzle.target}.`,
      hint: puzzle.hint,
      renderFn(ctx, x, y, w, h) {
        const cx = x + w / 2;
        const cy = y + h / 2;

        // Draw matchstick count display
        const stickSpacing = 22;
        const stickLen = 55;
        const totalW = puzzle.sticks * stickSpacing;
        const startX = cx - totalW / 2 + stickSpacing / 2;
        const stickY = y + h * 0.32;

        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillStyle = '#1A1A2E';
        ctx.textAlign = 'center';
        ctx.fillText(`You have ${puzzle.sticks} matchsticks:`, cx, stickY - 36);

        for (let i = 0; i < puzzle.sticks; i++) {
          const sx = startX + i * stickSpacing;
          gen._drawStick(ctx, sx, stickY, sx, stickY - stickLen);
        }

        // Target description box
        const bx = cx - 260, by = stickY + 28;
        ctx.fillStyle = 'rgba(108,99,255,0.10)';
        ctx.strokeStyle = '#6C63FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, 520, 80, 14);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillStyle = '#6C63FF';
        ctx.fillText(`Make: ${puzzle.target}`, cx, by + 50);

        ctx.font = '20px Arial, sans-serif';
        ctx.fillStyle = '#888';
        ctx.fillText(puzzle.hint, cx, y + h - 22);
        ctx.textAlign = 'left';
      }
    };
  },
};
