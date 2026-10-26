/**
 * Missing Number / Math Riddle Generator
 * Subtypes: number-box, magic-square, number-triangle, math-riddle, cross-number
 * Fully Randomized, Clean, Deterministic
 * Branding: Bright Path | Royal Technologies
 */
'use strict';

window.MissingNumberGenerator = (function () {

  function safeRoundRect(ctx, x, y, w, h, r) {
    if (r === undefined) r = 8;
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return {
    name: 'Missing Number / Math Riddles',
    subtypes: [
      { value: 'number-box',      label: 'Number Matrix Box' },
      { value: 'magic-square',    label: 'Magic Square' },
      { value: 'number-triangle', label: 'Number Triangle' },
      { value: 'math-riddle',     label: 'Math Riddle' },
      { value: 'cross-number',    label: 'Cross-Number Puzzle' }
    ],

    generate: function (subtype, difficulty) {
      switch (subtype) {
        case 'number-box':      return this._genNumberBox(difficulty);
        case 'magic-square':    return this._genMagicSquare(difficulty);
        case 'number-triangle': return this._genNumberTriangle(difficulty);
        case 'math-riddle':     return this._genMathRiddle(difficulty);
        case 'cross-number':    return this._genCrossNumber(difficulty);
        default:                return this._genNumberBox(difficulty);
      }
    },

    // ── 1. Number Matrix Box (Randomized Multipliers & Operands) ──
    _genNumberBox: function (diff) {
      const mult1 = rnd(2, 3);
      const mult2 = mult1 + rnd(1, 2);

      const a = rnd(2, 6);
      const b = rnd(3, 8);
      const c = rnd(4, 9);

      const grid = [
        [a, a * mult1, a * mult2],
        [b, b * mult1, b * mult2],
        [c, c * mult1, '?']
      ];
      const ans = c * mult2;

      return {
        type: 'missing-number',
        subtype: 'number-box',
        difficulty: diff,
        title: 'Missing Number Matrix',
        instruction: 'Discover the mathematical pattern across rows or columns to find the missing value (?).',
        answer: `${ans} (Rule: In each row, Column 2 = Col 1 × ${mult1}, and Column 3 = Col 1 × ${mult2})`,
        hint: `Compare the numbers in Row 1: ${a} × ${mult1} = ${a * mult1}, and ${a} × ${mult2} = ${a * mult2}.`,
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cellSize = 130;
          const startX = x + (w - cellSize * 3) / 2;
          const startY = y + (h - cellSize * 3) / 2 - 10;

          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          for (let r = 0; r < 3; r++) {
            for (let col = 0; col < 3; col++) {
              const cx = startX + col * cellSize;
              const cy = startY + r * cellSize;
              const isTarget = (r === 2 && col === 2);

              ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
              safeRoundRect(ctx, cx, cy, cellSize, cellSize, 10);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = isTarget ? '#DC2626' : '#0F172A';
              ctx.font = isTarget ? 'bold 54px Arial' : 'bold 44px "Segoe UI", Arial, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(String(grid[r][col]), cx + cellSize / 2, cy + cellSize / 2);
            }
          }
          ctx.restore();
        }
      };
    },

    // ── 2. Magic Square (Random Scalar & Hidden Position) ──
    _genMagicSquare: function (diff) {
      const k = rnd(0, 4) * 3; // Scalar offset
      const base = [
        [8 + k, 1 + k, 6 + k],
        [3 + k, 5 + k, 7 + k],
        [4 + k, 9 + k, 2 + k]
      ];
      const magicSum = 15 + 3 * k;

      const hiddenR = rnd(0, 2);
      const hiddenC = rnd(0, 2);
      const ans = base[hiddenR][hiddenC];

      return {
        type: 'missing-number',
        subtype: 'magic-square',
        difficulty: diff,
        title: 'Magic Square Challenge',
        instruction: `In this magic square, all rows, columns, and diagonals sum to ${magicSum}. Find ?`,
        answer: `${ans} (Target row/col must sum to ${magicSum})`,
        hint: `Add the known numbers in the row or column containing the question mark, then subtract from ${magicSum}.`,
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cellSize = 130;
          const startX = x + (w - cellSize * 3) / 2;
          const startY = y + (h - cellSize * 3) / 2 - 10;

          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              const cx = startX + c * cellSize;
              const cy = startY + r * cellSize;
              const isTarget = (r === hiddenR && c === hiddenC);

              ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
              ctx.fillRect(cx, cy, cellSize, cellSize);
              ctx.strokeRect(cx, cy, cellSize, cellSize);

              ctx.fillStyle = isTarget ? '#DC2626' : '#0F172A';
              ctx.font = isTarget ? 'bold 54px Arial' : 'bold 44px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(isTarget ? '?' : String(base[r][c]), cx + cellSize / 2, cy + cellSize / 2);
            }
          }
          ctx.restore();
        }
      };
    },

    // ── 3. Number Triangle (Randomized Operands) ──
    _genNumberTriangle: function (diff) {
      const top = rnd(3, 8);
      const left = rnd(2, 6);
      const right = rnd(3, 7);
      const center = top * (left + right);

      return {
        type: 'missing-number',
        subtype: 'number-triangle',
        difficulty: diff,
        title: 'Number Triangle Puzzle',
        instruction: 'The central number is calculated from the three vertices using arithmetic. Find ?',
        answer: `${center} (Rule: Top × (Left + Right) = ${top} × (${left} + ${right}) = ${center})`,
        hint: 'Multiply the top apex number by the sum of the bottom two numbers.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cx = x + w / 2;
          const cy = y + h / 2 - 20;
          const r = 180;

          ctx.strokeStyle = '#0F172A';
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

          function drawNode(nx, ny, val, isRed) {
            ctx.fillStyle = isRed ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isRed ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(nx, ny, 36, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isRed ? '#DC2626' : '#0F172A';
            ctx.font = isRed ? 'bold 44px Arial' : 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(val), nx, ny);
          }

          drawNode(topX, topY, top, false);
          drawNode(leftX, leftY, left, false);
          drawNode(rightX, rightY, right, false);
          drawNode(cx, cy + 25, '?', true);
          ctx.restore();
        }
      };
    },

    // ── 4. Math Riddle (Diverse Pools) ──
    _genMathRiddle: function (diff) {
      const riddles = [
        {
          q: 'I am a 3-digit number.\nMy tens digit is 5 more than my units digit.\nMy hundreds digit is 8 less than my tens digit.\nWhat number am I?',
          a: '194 (Units = 4, Tens = 4 + 5 = 9, Hundreds = 9 - 8 = 1)',
          h: 'Set units digit = u, tens = u + 5, hundreds = (u + 5) - 8 = u - 3.'
        },
        {
          q: 'A father is 4 times as old as his son.\nIn 20 years, he will be twice as old as his son.\nHow old is the father right now?',
          a: '40 years old (Son is 10; in 20 years, son is 30 and father is 60)',
          h: 'F = 4S, and F + 20 = 2(S + 20).'
        },
        {
          q: 'If 3 cats can catch 3 mice in 3 minutes,\nhow many cats are needed to catch 100 mice in 100 minutes?',
          a: '3 cats (1 cat catches 1 mouse in 3 minutes)',
          h: 'Calculate the rate per cat.'
        },
        {
          q: 'A bat and a ball cost $1.10 in total.\nThe bat costs $1.00 more than the ball.\nHow much does the ball cost?',
          a: '$0.05 or 5 cents (Ball = $0.05, Bat = $1.05; Total = $1.10)',
          h: 'Bat + Ball = 1.10, Bat = Ball + 1.00.'
        },
        {
          q: 'Using only addition, how can you add eight 8s\nto get the number 1,000?',
          a: '888 + 88 + 8 + 8 + 8 = 1,000',
          h: 'Combine some of the 8s into multi-digit numbers like 888.'
        }
      ];

      const item = pickOne(riddles);

      return {
        type: 'missing-number',
        subtype: 'math-riddle',
        difficulty: diff,
        title: 'Classic Math Riddle',
        instruction: 'Read carefully and solve this mathematical brain riddle.',
        answer: item.a,
        hint: item.h,
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cardW = w - 100;
          const cardH = 340;
          const cardX = x + 50;
          const cardY = y + (h - cardH) / 2 - 10;

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, cardX, cardY, cardW, cardH, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 50px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText('💡', cardX + cardW / 2, cardY + 70);

          ctx.fillStyle = '#0F172A';
          ctx.font = '600 28px "Segoe UI", Arial, sans-serif';
          const lines = item.q.split('\n');
          lines.forEach((line, i) => {
            ctx.fillText(line, cardX + cardW / 2, cardY + 140 + i * 45);
          });
          ctx.restore();
        }
      };
    },

    // ── 5. Cross Number (Randomized Arithmetic Intersections) ──
    _genCrossNumber: function (diff) {
      const a = rnd(3, 9);
      const b = rnd(4, 12);
      const target = a + b;

      const c = rnd(target + 3, target + 15);
      const d = c - target;

      return {
        type: 'missing-number',
        subtype: 'cross-number',
        difficulty: diff,
        title: 'Cross-Number Arithmetic',
        instruction: 'Fill in the intersection (?) so both horizontal and vertical equations are true.',
        answer: `? = ${target} (${a} + ${b} = ${target} and ${c} − ${d} = ${target})`,
        hint: 'Solve either the horizontal row or the vertical column.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cx = x + w / 2;
          const cy = y + h / 2 - 20;

          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Horizontal equation: a + b = ?
          ctx.fillStyle = '#0F172A';
          ctx.fillText(String(a), cx - 140, cy);
          ctx.fillText('+', cx - 70, cy);
          ctx.fillText(String(b), cx, cy);
          ctx.fillText('=', cx + 70, cy);

          // Center '?'
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 48px Arial';
          ctx.fillText('?', cx + 140, cy);

          // Vertical equation passing through ?: c - d = ?
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.fillText(String(c), cx + 140, cy - 120);
          ctx.fillText('−', cx + 140, cy - 70);
          ctx.fillText(String(d), cx + 140, cy + 70);
          ctx.fillText('=', cx + 140, cy + 120);
          ctx.restore();
        }
      };
    }
  };

})();
