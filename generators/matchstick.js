/**
 * MatchstickGenerator
 * Fully Randomized Matchstick Puzzles:
 *   1. fix-equation: Move sticks to fix arithmetic equations
 *   2. move-matches: Move sticks to transform shapes and square grids
 *   3. count-squares: Count all squares in dynamic, randomized matchstick grids
 *   4. make-shape: Form target geometric figures with a set count of sticks
 * Branding: Bright Path | Royal Technologies
 */
'use strict';

window.MatchstickGenerator = {
  name: 'Matchstick',
  subtypes: [
    { value: 'fix-equation',  label: 'Fix the Equation' },
    { value: 'move-matches',  label: 'Move Matches' },
    { value: 'count-squares', label: 'Count the Squares' },
    { value: 'make-shape',    label: 'Make the Shape' },
  ],

  // ─── Helpers ──────────────────────────────────────────────────────────────
  _rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /**
   * Draw a single matchstick with clean head and wooden body.
   */
  _drawStick(ctx, x1, y1, x2, y2, headAtStart = true) {
    ctx.save();
    // Shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1 + 2, y1 + 2);
    ctx.lineTo(x2 + 2, y2 + 2);
    ctx.stroke();

    // Wooden match body
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Sulfur Head
    const hx = headAtStart ? x1 : x2;
    const hy = headAtStart ? y1 : y2;
    ctx.beginPath();
    ctx.arc(hx, hy, 5.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  },

  // ─── 7-Segment Digit Drawing ──────────────────────────────────────────────
  _drawDigit(ctx, digit, ox, oy, segW, segH) {
    const m = 4;
    const t = segH / 2;

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

  _drawNumber(ctx, num, ox, oy, segW, segH) {
    const digits = String(Math.abs(num)).split('').map(Number);
    let curX = ox;
    digits.forEach((d) => {
      this._drawDigit(ctx, d, curX, oy, segW, segH);
      curX += segW + 14;
    });
    return curX - ox - 14;
  },

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

  _drawSquareGrid(ctx, cols, rows, gx, gy, cellSize) {
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        this._drawStick(ctx,
          gx + c * cellSize, gy + r * cellSize,
          gx + (c + 1) * cellSize, gy + r * cellSize, c === 0);
      }
    }
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r < rows; r++) {
        this._drawStick(ctx,
          gx + c * cellSize, gy + r * cellSize,
          gx + c * cellSize, gy + (r + 1) * cellSize, r === 0);
      }
    }
  },

  // ─── Pools for Fix Equation ───────────────────────────────────────────────
  _fixEquationPuzzles: {
    easy: [
      { wrong: '5+3=9', instruction: 'Move 1 matchstick to fix the equation.', answer: '5+3=8 or 6+3=9' },
      { wrong: '6+4=9', instruction: 'Move 1 matchstick to fix the equation.', answer: '5+4=9 or 6+4=10' },
      { wrong: '4-1=4', instruction: 'Move 1 matchstick to make the equation correct.', answer: '4-1=3' },
      { wrong: '3+3=9', instruction: 'Move 1 matchstick to fix the equation.', answer: '3+3=6' },
      { wrong: '8-3=4', instruction: 'Move 1 matchstick to fix the equation.', answer: '8-3=5 or 9-4=5' },
      { wrong: '2+3=6', instruction: 'Move 1 matchstick to fix the equation.', answer: '2+3=5 or 3+3=6' },
      { wrong: '9+3=5', instruction: 'Move 1 matchstick to fix the equation.', answer: '8-3=5' },
      { wrong: '7-2=4', instruction: 'Move 1 matchstick to fix the equation.', answer: '7-3=4 or 6-2=4' }
    ],
    medium: [
      { wrong: '8-5=4', instruction: 'Move 1 matchstick to make the equation true.', answer: '9-5=4 or 8-4=4' },
      { wrong: '3+8=8', instruction: 'Move 1 matchstick to make it correct.', answer: '3+5=8' },
      { wrong: '9-5=5', instruction: 'Move 1 matchstick to fix the equation.', answer: '9-4=5' },
      { wrong: '6+3=6', instruction: 'Move 1 matchstick to make the equation true.', answer: '5+3=8 or 6-0=6' },
      { wrong: '4+9=7', instruction: 'Move 1 matchstick to fix the equation.', answer: '4+3=7 or -4+11=7' },
      { wrong: '7+5=8', instruction: 'Move 1 matchstick to balance the equation.', answer: '7+1=8 or 3+5=8' }
    ],
    hard: [
      { wrong: '5+5=9', instruction: 'Move 1 matchstick to fix this tricky equation.', answer: '5+5=10 (move vertical from + to turn 9 into 10)' },
      { wrong: '8+3=4', instruction: 'Move 1 matchstick — think carefully!', answer: '9-5=4 or 0+4=4' },
      { wrong: '3+9=5', instruction: 'Move 1 matchstick to fix the equation.', answer: '9-4=5' },
      { wrong: '6-5=4', instruction: 'Move 1 matchstick to fix the equation.', answer: '6-5=1 or 9-5=4' },
      { wrong: '8+4=6', instruction: 'Move 1 matchstick to balance this equation.', answer: '0+4=4 or 8-4=4' },
      { wrong: '9+7=8', instruction: 'Move 1 matchstick to make this equation hold.', answer: '9-1=8 or 0+8=8' }
    ]
  },

  // ─── Pools for Move Matches ───────────────────────────────────────────────
  _moveMatchPuzzles: {
    easy: [
      { cols: 3, rows: 1, cellSize: 80, move: 1, instruction: 'Move 1 matchstick to leave exactly 2 squares.', answer: 'Remove an internal vertical stick and close the open end.' },
      { cols: 2, rows: 2, cellSize: 80, move: 2, instruction: 'Move 2 matchsticks to make the shape into a cross (+).', answer: 'Move two outer corner sticks inward.' },
      { cols: 2, rows: 1, cellSize: 85, move: 1, instruction: 'Move 1 matchstick to form 3 equal squares.', answer: 'Overlap one stick diagonally to create isometric triangles.' }
    ],
    medium: [
      { cols: 3, rows: 1, cellSize: 80, move: 2, instruction: 'Move 2 matchsticks to make 4 squares (overlapping allowed).', answer: 'Create a 2×2 arrangement using the central stick.' },
      { cols: 2, rows: 2, cellSize: 80, move: 3, instruction: 'Move 3 matchsticks to make 3 squares in a row.', answer: 'Rearrange outer perimeter sticks to collapse into a 3×1 grid.' },
      { cols: 3, rows: 2, cellSize: 65, move: 2, instruction: 'Move 2 matchsticks to leave only 4 squares.', answer: 'Break the intersection of two adjacent squares.' }
    ],
    hard: [
      { cols: 4, rows: 1, cellSize: 70, move: 3, instruction: 'Move 3 matchsticks to create exactly 3 squares.', answer: 'Rearrange carefully — create 3 separate or overlapping unit squares.' },
      { cols: 3, rows: 2, cellSize: 70, move: 4, instruction: 'Move 4 matchsticks to make a 3×1 row of squares.', answer: 'Collapse the two rows into one row of 3 squares.' },
      { cols: 3, rows: 3, cellSize: 60, move: 4, instruction: 'Move 4 matchsticks to turn the 3×3 grid into exactly 5 squares.', answer: 'Remove sticks from the four outer corners to leave 4 unit squares + 1 central square.' }
    ]
  },

  // ─── Pools for Make Shape ─────────────────────────────────────────────────
  _makeShapePool: {
    easy: [
      { sticks: 6,  target: '2 separate triangles', hint: 'Each triangle uses 3 separate matchsticks.' },
      { sticks: 7,  target: '2 triangles sharing 1 side', hint: 'Share 1 common matchstick between the two triangles: 3 + 3 - 1 = 5, or 7 for 3 triangles.' },
      { sticks: 8,  target: '2 separate squares', hint: 'Each square uses 4 separate matchsticks: 4 + 4 = 8.' },
      { sticks: 10, target: '2 squares sharing 1 side + 1 triangle', hint: 'Arrange them in an interconnected shape.' }
    ],
    medium: [
      { sticks: 9,  target: '3 equilateral triangles', hint: 'Share matchsticks between triangles (e.g. trapezoid partition).' },
      { sticks: 12, target: '5 squares (plus sign / cross)', hint: 'Form a central square with 4 adjacent squares sharing walls.' },
      { sticks: 10, target: '3 squares in a row', hint: '3 squares sharing common vertical walls: 4 + 3 + 3 = 10 sticks.' },
      { sticks: 8,  target: '1 square and 4 triangles', hint: 'Think in 3 dimensions or use internal diagonals.' }
    ],
    hard: [
      { sticks: 9,  target: '3 triangles sharing borders', hint: 'Share sticks between triangles — 9 matchsticks form a delta wing of 3 triangles.' },
      { sticks: 12, target: '6 equilateral triangles (Star of David / Hexagram)', hint: 'Create an interlocking 6-pointed star or hexagon with radial spokes.' },
      { sticks: 16, target: 'a 3D Cube (8 vertices, 12 edges + 4 diagonals)', hint: 'Think in three dimensions: 12 edges form a cube.' },
      { sticks: 13, target: '4 squares in an L-arrangement', hint: 'Arrange 4 interconnected squares sharing internal matchsticks.' }
    ]
  },

  // ─── Main Generate ────────────────────────────────────────────────────────
  generate(subtype, difficulty) {
    const gen = this;

    // 1. FIX THE EQUATION
    if (subtype === 'fix-equation') {
      const pool = this._fixEquationPuzzles[difficulty] || this._fixEquationPuzzles.hard;
      const puzzle = this._pick(pool);

      return {
        type: 'matchstick',
        subtype,
        difficulty,
        title: 'Fix the Equation',
        instruction: `${puzzle.instruction}\n\n${puzzle.wrong}`,
        answer: puzzle.answer,
        hint: 'Think about which single matchstick can be removed and relocated to change a digit or operator.',
        renderFn(ctx, x, y, w, h) {
          ctx.save();
          const segW = 42, segH = 75;
          const totalW = puzzle.wrong.replace(/[^0-9]/g, '').length * (segW + 14) +
                         puzzle.wrong.replace(/[0-9]/g, '').length * (segW + 20);
          const startX = x + (w - totalW * 0.95) / 2;
          const startY = y + (h - segH) / 2 - 30;

          // Header warning banner
          ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#DC2626';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText('⚠ This matchstick equation is WRONG — Fix it!', x + w / 2, startY - 40);

          gen._drawEquation(ctx, puzzle.wrong, startX, startY, segW, segH);

          // Instruction label below
          ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#1E3A8A';
          ctx.fillText(puzzle.instruction, x + w / 2, startY + segH + 70);
          ctx.restore();
        }
      };
    }

    // 2. MOVE MATCHES
    if (subtype === 'move-matches') {
      const pool = this._moveMatchPuzzles[difficulty] || this._moveMatchPuzzles.hard;
      const puzzle = this._pick(pool);

      return {
        type: 'matchstick',
        subtype,
        difficulty,
        title: 'Move Matches',
        instruction: puzzle.instruction,
        answer: puzzle.answer,
        hint: `You are allowed to move exactly ${puzzle.move} matchstick(s).`,
        renderFn(ctx, x, y, w, h) {
          ctx.save();
          const totalGridW = puzzle.cols * puzzle.cellSize;
          const totalGridH = puzzle.rows * puzzle.cellSize;
          const gx = x + (w - totalGridW) / 2;
          const gy = y + (h - totalGridH) / 2 - 25;

          gen._drawSquareGrid(ctx, puzzle.cols, puzzle.rows, gx, gy, puzzle.cellSize);

          ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#1E3A8A';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(puzzle.instruction, x + w / 2, gy + totalGridH + 60);

          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#DC2626';
          ctx.fillText(`Moves permitted: ${puzzle.move} matchstick(s)`, x + w / 2, y + h - 25);
          ctx.restore();
        }
      };
    }

    // 3. COUNT THE SQUARES (Dynamically Randomized Grids on every click!)
    if (subtype === 'count-squares') {
      // Pick random dimensions based on difficulty
      let gridOpts = [];
      if (difficulty === 'easy') {
        gridOpts = [
          { cols: 2, rows: 2 },
          { cols: 3, rows: 2 },
          { cols: 2, rows: 3 }
        ];
      } else if (difficulty === 'medium') {
        gridOpts = [
          { cols: 3, rows: 3 },
          { cols: 4, rows: 2 },
          { cols: 3, rows: 4 },
          { cols: 4, rows: 3 }
        ];
      } else {
        // Hard: Complex large grids
        gridOpts = [
          { cols: 4, rows: 4 },
          { cols: 3, rows: 3 },
          { cols: 5, rows: 3 },
          { cols: 4, rows: 5 },
          { cols: 5, rows: 4 }
        ];
      }

      const gridChoice = this._pick(gridOpts);
      const cols = gridChoice.cols;
      const rows = gridChoice.rows;

      // Calculate total squares of all sizes mathematically
      let total = 0;
      const breakdown = [];
      const maxDim = Math.min(cols, rows);
      for (let s = 1; s <= maxDim; s++) {
        const count = (cols - s + 1) * (rows - s + 1);
        total += count;
        breakdown.push(`${count} (${s}×${s})`);
      }

      const breakdownStr = breakdown.join(' + ') + ` = ${total}`;

      return {
        type: 'matchstick',
        subtype,
        difficulty,
        title: 'Count the Squares',
        instruction: `How many squares (of ALL sizes) can you find in this ${cols}×${rows} matchstick grid?`,
        answer: `${total} squares — ${breakdownStr}`,
        hint: 'Count small individual 1×1 squares first, then combine them into larger 2×2, 3×3, and 4×4 squares.',
        renderFn(ctx, x, y, w, h) {
          ctx.save();
          // Dynamic cell size to fit cleanly without overlapping
          const maxW = w - 120;
          const maxH = h - 200;
          const cellSize = Math.min(Math.floor(maxW / cols), Math.floor(maxH / rows), 95);

          const totalGridW = cols * cellSize;
          const totalGridH = rows * cellSize;
          const gx = x + (w - totalGridW) / 2;
          const gy = y + (h - totalGridH) / 2 - 20;

          // Top Question Banner
          ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(`How many squares in this ${cols}×${rows} grid?`, x + w / 2, gy - 30);

          // Draw the Matchstick Grid
          gen._drawSquareGrid(ctx, cols, rows, gx, gy, cellSize);

          // Bottom Prompt
          ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText('(Include ALL sizes — small, medium, and large!)', x + w / 2, gy + totalGridH + 45);
          ctx.restore();
        }
      };
    }

    // 4. MAKE THE SHAPE (Overlap-free, clean layout, randomized challenges!)
    const pool = this._makeShapePool[difficulty] || this._makeShapePool.hard;
    const puzzle = this._pick(pool);

    return {
      type: 'matchstick',
      subtype: 'make-shape',
      difficulty,
      title: 'Make the Shape',
      instruction: `Use exactly ${puzzle.sticks} matchsticks to make ${puzzle.target}.\n${puzzle.hint}`,
      answer: `Arrange ${puzzle.sticks} matchsticks into ${puzzle.target}.`,
      hint: puzzle.hint,
      renderFn(ctx, x, y, w, h) {
        ctx.save();
        const cx = x + w / 2;

        // Vertical positions cleanly separated:
        // 1. Text Title at top
        const titleY = y + 70;
        ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(`You have exactly ${puzzle.sticks} matchsticks:`, cx, titleY);

        // 2. Matchstick Bundle Rack (drawn in a clean tray well below the text)
        const stickH = 65;
        const stickGap = Math.min(32, Math.floor((w - 180) / puzzle.sticks));
        const totalRackW = (puzzle.sticks - 1) * stickGap;
        const rackStartX = cx - totalRackW / 2;
        const rackY = titleY + 35; // top of matchsticks

        // Tray background
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(cx - (totalRackW + 60) / 2, rackY - 10, totalRackW + 60, stickH + 20, 12);
        } else {
          ctx.rect(cx - (totalRackW + 60) / 2, rackY - 10, totalRackW + 60, stickH + 20);
        }
        ctx.fill();
        ctx.stroke();

        // Draw each vertical stick inside the tray
        for (let i = 0; i < puzzle.sticks; i++) {
          const sx = rackStartX + i * stickGap;
          // Draw stick vertically from bottom to top
          gen._drawStick(ctx, sx, rackY + stickH, sx, rackY, false);
        }

        // 3. Goal Target Card below the matchstick tray
        const targetCardY = rackY + stickH + 55;
        const cardW = 540, cardH = 95;
        const cardX = cx - cardW / 2;

        ctx.fillStyle = '#EFF6FF';
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(cardX, targetCardY, cardW, cardH, 16);
        } else {
          ctx.rect(cardX, targetCardY, cardW, cardH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#1E3A8A';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Target: ${puzzle.target}`, cx, targetCardY + cardH / 2);

        // 4. Hint at bottom
        ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(`Hint: ${puzzle.hint}`, cx, targetCardY + cardH + 50);

        ctx.restore();
      }
    };
  }
};
