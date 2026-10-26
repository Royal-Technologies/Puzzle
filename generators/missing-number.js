/**
 * Missing Number / Math Riddle Generator
 * Subtypes: number-box, magic-square, number-triangle, math-riddle, cross-number
 */
'use strict';

window.MissingNumberGenerator = {
  name: 'Missing Number / Math Riddles',
  subtypes: [
    { value: 'number-box',      label: 'Number Matrix Box' },
    { value: 'magic-square',    label: 'Magic Square' },
    { value: 'number-triangle',  label: 'Number Triangle' },
    { value: 'math-riddle',     label: 'Math Riddle' },
    { value: 'cross-number',    label: 'Cross-Number Puzzle' }
  ],

  generate(subtype, difficulty) {
    switch (subtype) {
      case 'number-box': return this._genNumberBox(difficulty);
      case 'magic-square': return this._genMagicSquare(difficulty);
      case 'number-triangle': return this._genNumberTriangle(difficulty);
      case 'math-riddle': return this._genMathRiddle(difficulty);
      case 'cross-number': return this._genCrossNumber(difficulty);
      default: return this._genNumberBox(difficulty);
    }
  },

  _genNumberBox(diff) {
    // 3x3 pattern: Col 1 + Col 2 = Col 3 or Row multiplication
    const a = Math.floor(Math.random() * 5) + 3;
    const b = Math.floor(Math.random() * 5) + 4;
    const grid = [
      [a, a * 2, a * 3],
      [b, b * 2, b * 3],
      [7, 14, '?']
    ];
    const ans = (7 * 3).toString();

    return {
      type: 'missing-number',
      subtype: 'number-box',
      difficulty: diff,
      title: 'Missing Number Matrix',
      instruction: 'Discover the mathematical pattern in rows or columns to find the missing value.',
      answer: ans + ' (Rule: Column 3 = Column 1 × 3)',
      hint: 'Compare each number in a row with the first number of that row.',
      renderFn: (ctx, x, y, w, h) => {
        const cellSize = 130;
        const startX = x + (w - cellSize * 3) / 2;
        const startY = y + 50;

        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 3;

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const cx = startX + c * cellSize;
            const cy = startY + r * cellSize;
            const isTarget = (r === 2 && c === 2);

            ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(cx, cy, cellSize, cellSize, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isTarget ? '#DC2626' : '#1E3A8A';
            ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(grid[r][c], cx + cellSize / 2, cy + cellSize / 2);
          }
        }
      }
    };
  },

  _genMagicSquare(diff) {
    // 3x3 normal magic square with magic constant 15
    const base = [
      [8, 1, 6],
      [3, 5, 7],
      [4, 9, 2]
    ];
    const hiddenR = Math.floor(Math.random() * 3);
    const hiddenC = Math.floor(Math.random() * 3);
    const ans = base[hiddenR][hiddenC].toString();

    return {
      type: 'missing-number',
      subtype: 'magic-square',
      difficulty: diff,
      title: '3×3 Magic Square',
      instruction: 'All rows, columns, and diagonals add up to 15. What number replaces the question mark?',
      answer: ans,
      hint: 'Pick any complete row or column to confirm the magic sum of 15.',
      renderFn: (ctx, x, y, w, h) => {
        const cellSize = 140;
        const startX = x + (w - cellSize * 3) / 2;
        const startY = y + 40;

        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const cx = startX + c * cellSize;
            const cy = startY + r * cellSize;
            const isTarget = (r === hiddenR && c === hiddenC);

            ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
            ctx.fillRect(cx, cy, cellSize, cellSize);
            ctx.strokeRect(cx, cy, cellSize, cellSize);

            ctx.fillStyle = isTarget ? '#DC2626' : '#1E3A8A';
            ctx.font = isTarget ? 'bold 54px Arial' : 'bold 46px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isTarget ? '?' : base[r][c], cx + cellSize / 2, cy + cellSize / 2);
          }
        }
      }
    };
  },

  _genNumberTriangle(diff) {
    return {
      type: 'missing-number',
      subtype: 'number-triangle',
      difficulty: diff,
      title: 'Number Triangle Puzzle',
      instruction: 'The central number is generated from the numbers at the three vertices. Find ?',
      answer: '42 (Rule: Top × (Left + Right) = Central number)',
      hint: 'Apply arithmetic operations between the vertex points.',
      renderFn: (ctx, x, y, w, h) => {
        const cx = x + w / 2;
        const cy = y + h / 2 - 20;
        const r = 180;

        // Draw big triangle
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 4;
        ctx.fillStyle = '#F8FAFC';

        const topX = cx, topY = cy - r;
        const leftX = cx - r * 1.1, leftY = cy + r * 0.8;
        const rightX = cx + r * 1.1, rightY = cy + r * 0.8;

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(rightX, rightY);
        ctx.lineTo(leftX, leftY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Node circle helper
        function drawNode(nx, ny, val, isRed) {
          ctx.fillStyle = isRed ? '#FEF2F2' : '#FFFFFF';
          ctx.strokeStyle = isRed ? '#DC2626' : '#1E3A8A';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(nx, ny, 36, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isRed ? '#DC2626' : '#0F172A';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, nx, ny);
        }

        drawNode(topX, topY, '6', false);
        drawNode(leftX, leftY, '4', false);
        drawNode(rightX, rightY, '3', false);
        drawNode(cx, cy + 20, '?', true);
      }
    };
  },

  _genMathRiddle(diff) {
    const riddles = [
      {
        q: 'I am a 2-digit number.\nMy tens digit is 3 more than my units digit.\nThe sum of my digits is 9.\nWhat number am I?',
        a: '63 (tens=6, units=3; 6=3+3 and 6+3=9)'
      },
      {
        q: 'Multiply me by 4 and add 12,\nyou get 40.\nWhat number am I?',
        a: '7 (4 × 7 + 12 = 40)'
      },
      {
        q: 'A father is 4 times as old as his son.\nIn 20 years, he will be twice as old as his son.\nHow old is the son now?',
        a: '10 years old (Father=40, in 20 yrs: Father=60, Son=30)'
      }
    ];
    const item = riddles[Math.floor(Math.random() * riddles.length)];

    return {
      type: 'missing-number',
      subtype: 'math-riddle',
      difficulty: diff,
      title: 'Mind-Bending Math Riddle',
      instruction: 'Solve this mental arithmetic riddle without using pen and paper!',
      answer: item.a,
      hint: 'Break down the statement into a simple algebraic relation.',
      renderFn: (ctx, x, y, w, h) => {
        const cardX = x + 60;
        const cardY = y + 50;
        const cardW = w - 120;
        const cardH = h - 140;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 16);
        ctx.fill();
        ctx.stroke();

        // Decorative icon
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💡', cardX + cardW / 2, cardY + 70);

        // Riddle text
        ctx.fillStyle = '#0F172A';
        ctx.font = '600 32px "Segoe UI", Arial, sans-serif';
        const lines = item.q.split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, cardX + cardW / 2, cardY + 160 + i * 50);
        });
      }
    };
  },

  _genCrossNumber(diff) {
    return {
      type: 'missing-number',
      subtype: 'cross-number',
      difficulty: diff,
      title: 'Cross-Number Arithmetic',
      instruction: 'Fill in the grid so all horizontal and vertical equations are true.',
      answer: '? = 8 (5 + 3 = 8 and 14 - 6 = 8)',
      hint: 'Solve either the horizontal row or the vertical column intersection.',
      renderFn: (ctx, x, y, w, h) => {
        const cx = x + w / 2;
        const cy = y + h / 2 - 20;

        ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Row 1: 5 + 3 = ?
        ctx.fillStyle = '#1E3A8A';
        ctx.fillText('5', cx - 140, cy);
        ctx.fillText('+', cx - 70, cy);
        ctx.fillText('3', cx, cy);
        ctx.fillText('=', cx + 70, cy);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 44px Arial';
        ctx.fillText('?', cx + 140, cy);

        // Column passing through ?: 14 - 6 = ?
        ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#1E3A8A';
        ctx.fillText('14', cx + 140, cy - 140);
        ctx.fillText('−', cx + 140, cy - 90);
        ctx.fillText('6', cx + 140, cy - 40);
      }
    };
  }
};
