/**
 * Visual Pattern Generator
 * Subtypes: matrix-pattern, shape-transform, odd-one-out, complete-series, mirror-image
 * Mathematics Marvels | Royal Technologies
 */
'use strict';

window.VisualPatternGenerator = (function () {

  function safeRoundRect(ctx, x, y, w, h, r) {
    if (r === undefined) r = 8;
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return {
    name: 'Visual Pattern Puzzles',
    subtypes: [
      { value: 'matrix-pattern',  label: 'Matrix Pattern (3×3)' },
      { value: 'shape-transform', label: 'Shape Transformation' },
      { value: 'odd-one-out',     label: 'Odd One Out' },
      { value: 'complete-series', label: 'Complete the Series' },
      { value: 'mirror-image',    label: 'Mirror Image' }
    ],

    generate: function (subtype, difficulty) {
      switch (subtype) {
        case 'matrix-pattern':  return this._genMatrix(difficulty);
        case 'shape-transform': return this._genTransform(difficulty);
        case 'odd-one-out':     return this._genOddOneOut(difficulty);
        case 'complete-series': return this._genSeries(difficulty);
        case 'mirror-image':    return this._genMirror(difficulty);
        default:                return this._genMatrix(difficulty);
      }
    },

    // ── 1. Matrix Pattern ──
    _genMatrix: function (diff) {
      const symbols = ['●', '■', '▲', '◆', '★', '✖'];
      const s1 = symbols[Math.floor(Math.random() * symbols.length)];
      let s2 = symbols[Math.floor(Math.random() * symbols.length)];
      while (s2 === s1) s2 = symbols[Math.floor(Math.random() * symbols.length)];
      let s3 = symbols[Math.floor(Math.random() * symbols.length)];
      while (s3 === s1 || s3 === s2) s3 = symbols[Math.floor(Math.random() * symbols.length)];

      const grid = [
        [s1, s2, s3],
        [s2, s3, s1],
        [s3, s1, '?']
      ];

      return {
        type: 'visual-pattern',
        subtype: 'matrix-pattern',
        difficulty: diff,
        title: 'Visual Matrix Pattern',
        instruction: 'Find the symbol that replaces the question mark in the 3×3 grid.',
        answer: s2,
        hint: 'Notice each row and column contains each symbol exactly once (Latin square rule).',
        renderFn: function (ctx, x, y, w, h) {
          const cellSize = Math.min(w * 0.75, h * 0.75) / 3;
          const startX = x + (w - cellSize * 3) / 2;
          const startY = y + (h - cellSize * 3) / 2 - 10;

          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              const cx = startX + c * cellSize;
              const cy = startY + r * cellSize;
              const isTarget = (r === 2 && c === 2);

              ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
              ctx.fillRect(cx, cy, cellSize, cellSize);
              ctx.strokeRect(cx, cy, cellSize, cellSize);

              const val = grid[r][c];
              if (val === '?') {
                ctx.fillStyle = '#DC2626';
                ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
              } else {
                ctx.fillStyle = '#1E3A8A';
                ctx.font = 'bold 50px "Segoe UI", Arial, sans-serif';
              }
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(val, cx + cellSize / 2, cy + cellSize / 2);
            }
          }
        }
      };
    },

    // ── 2. Shape Transformation ──
    _genTransform: function (diff) {
      const shapes = [
        { left: '▲', right: '■', left2: '■', ans: 'Pentagon (⬟)' },
        { left: '⚪', right: '⚫', left2: '◻️', ans: 'Filled Square (◼️)' },
        { left: '○', right: '◎', left2: '□', ans: 'Square inside Square (▣)' }
      ];
      const item = shapes[Math.floor(Math.random() * shapes.length)];

      return {
        type: 'visual-pattern',
        subtype: 'shape-transform',
        difficulty: diff,
        title: 'Shape Transformation',
        instruction: 'Figure A is related to B in a certain way. Find the matching shape for Figure C.',
        answer: item.ans,
        hint: 'Analyze the rule applied from left to right.',
        renderFn: function (ctx, x, y, w, h) {
          const centerY = y + h / 2 - 20;
          ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Row 1
          ctx.fillStyle = '#0F172A';
          ctx.fillText(item.left, x + w * 0.25, centerY - 80);
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText('➜', x + w * 0.5, centerY - 80);
          ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.fillText(item.right, x + w * 0.75, centerY - 80);

          // Divider
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + 100, centerY);
          ctx.lineTo(x + w - 100, centerY);
          ctx.stroke();

          // Row 2
          ctx.fillText(item.left2, x + w * 0.25, centerY + 80);
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText('➜', x + w * 0.5, centerY + 80);
          ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#DC2626';
          ctx.fillText('?', x + w * 0.75, centerY + 80);
        }
      };
    },

    // ── 3. Odd One Out ──
    _genOddOneOut: function (diff) {
      const sets = [
        { items: ['Triangle (3)', 'Square (4)', 'Circle (0)', 'Pentagon (5)', 'Hexagon (6)'], odd: 'Circle', reason: 'Circle has no straight edges or vertices' },
        { items: ['Cube', 'Sphere', 'Cone', 'Cylinder', 'Rectangle'], odd: 'Rectangle', reason: 'Rectangle is 2D while others are 3D solids' },
        { items: ['Equilateral', 'Isosceles', 'Scalene', 'Parallelogram', 'Right-angle'], odd: 'Parallelogram', reason: 'Parallelogram is a quadrilateral, others are triangles' }
      ];
      const pick = sets[Math.floor(Math.random() * sets.length)];

      return {
        type: 'visual-pattern',
        subtype: 'odd-one-out',
        difficulty: diff,
        title: 'Odd One Out Geometry',
        instruction: 'Four of these shapes share a common geometrical rule. Which one does NOT belong?',
        answer: `${pick.odd} (${pick.reason})`,
        hint: 'Think about dimensions and geometric properties.',
        renderFn: function (ctx, x, y, w, h) {
          const cardW = 160;
          const cardH = 120;
          const totalW = 5 * cardW + 4 * 16;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 60;

          pick.items.forEach((item, i) => {
            const bx = startX + i * (cardW + 16);
            ctx.fillStyle = '#F8FAFC';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, bx, cy, cardW, cardH, 12);
            ctx.fill();
            ctx.stroke();

            // Option letter
            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(String.fromCharCode(65 + i), bx + cardW / 2, cy + 35);

            // Label
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
            ctx.fillText(item.split(' ')[0], bx + cardW / 2, cy + 80);
          });
        }
      };
    },

    // ── 4. Complete Series (Diverse Pattern Sequences) ──
    _genSeries: function (diff) {
      const seriesPool = [
        {
          items: ['3 Sides (▲)', '4 Sides (■)', '5 Sides (⬟)', '6 Sides (⬢)', '?'],
          ans: 'Heptagon (7-sided regular polygon)',
          hint: 'Count the number of vertices or sides in each consecutive figure: +1 side each step.'
        },
        {
          items: ['2 Dots (●●)', '4 Dots (●●●●)', '6 Dots (●●●●●●)', '8 Dots', '?'],
          ans: '10 Dots (Pattern adds 2 dots at each step: +2)',
          hint: 'Observe the arithmetic progression of the dots.'
        },
        {
          items: ['1 Square (■)', '4 Squares (2×2)', '9 Squares (3×3)', '16 Squares (4×4)', '?'],
          ans: '25 Squares (5×5 square numbers: 1², 2², 3², 4², 5² = 25)',
          hint: 'Think about square numbers: 1, 4, 9, 16...'
        },
        {
          items: ['Up (⬆)', 'Right (➡)', 'Down (⬇)', 'Left (⬅)', '?'],
          ans: 'Up (⬆) — 90° clockwise continuous rotation completes a full cycle',
          hint: 'Track the clockwise rotation angle (90° at each step).'
        },
        {
          items: ['1 Ring (◎)', '2 Rings', '3 Rings', '4 Rings', '?'],
          ans: '5 Concentric Rings (+1 outer ring added at each step)',
          hint: 'Count the number of concentric circles.'
        }
      ];

      const sPick = seriesPool[Math.floor(Math.random() * seriesPool.length)];

      return {
        type: 'visual-pattern',
        subtype: 'complete-series',
        difficulty: diff,
        title: 'Complete the Geometric Series',
        instruction: 'Identify the transformation rule and determine the next figure in the sequence.',
        answer: sPick.ans,
        hint: sPick.hint,
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const boxSize = 140;
          const gap = 24;
          const totalW = 5 * boxSize + 4 * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 70;

          sPick.items.forEach((s, idx) => {
            const bx = startX + idx * (boxSize + gap);
            const isQ = idx === 4;

            ctx.fillStyle = isQ ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy, boxSize, boxSize, 14);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.font = isQ ? 'bold 64px "Segoe UI", Arial, sans-serif' : 'bold 36px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const symbol = s.includes('(') ? s.split('(')[1].replace(')', '') : s;
            ctx.fillText(symbol, bx + boxSize / 2, cy + boxSize / 2);

            if (idx < 4) {
              ctx.fillStyle = '#94A3B8';
              ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
              ctx.fillText('➜', bx + boxSize + gap / 2, cy + boxSize / 2);
            }
          });
          ctx.restore();
        }
      };
    },

    // ── 5. Mirror Image (Randomized Shapes & Asymmetric Details) ──
    _genMirror: function (diff) {
      const shapes = [
        { name: 'Triangle with offset flag', type: 'triangle-flag', ans: 'Option B is the exact lateral reflection across the vertical axis.' },
        { name: 'Asymmetric L-block with target dot', type: 'l-block', ans: 'Option B (the arm points left instead of right, dot reflects symmetrically).' },
        { name: 'Letter F Glyph', type: 'letter-f', ans: 'Option B (backwards F with horizontal bars facing the mirror line).' },
        { name: 'Diagonal Wedge with notch', type: 'wedge', ans: 'Option B (laterally inverted wedge reflection).' }
      ];

      const sh = shapes[Math.floor(Math.random() * shapes.length)];

      return {
        type: 'visual-pattern',
        subtype: 'mirror-image',
        difficulty: diff,
        title: 'Mirror Image Reflection',
        instruction: `If the ${sh.name} on the left is reflected across the dashed mirror line, what does it look like?`,
        answer: sh.ans,
        hint: 'Lateral inversion: left and right swap across the mirror line, while top and bottom stay identical.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const midX = x + w / 2;
          const cy = y + h / 2 - 30;

          // Mirror line
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 3.5;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(midX, y + 40);
          ctx.lineTo(midX, y + h - 80);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('MIRROR LINE', midX, y + 25);

          // Draw the Left Shape
          ctx.fillStyle = '#1E3A8A';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          if (sh.type === 'letter-f') {
            const fx = midX - 120;
            ctx.fillRect(fx - 15, cy - 70, 25, 140);
            ctx.fillRect(fx + 10, cy - 70, 50, 22);
            ctx.fillRect(fx + 10, cy - 20, 35, 20);
          } else if (sh.type === 'l-block') {
            const lx = midX - 120;
            ctx.fillRect(lx - 20, cy - 60, 30, 120);
            ctx.fillRect(lx + 10, cy + 20, 50, 40);
            ctx.fillStyle = '#DC2626';
            ctx.beginPath();
            ctx.arc(lx - 5, cy - 40, 8, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(midX - 160, cy - 80);
            ctx.lineTo(midX - 60, cy);
            ctx.lineTo(midX - 160, cy + 80);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Accent dot
            ctx.fillStyle = '#DC2626';
            ctx.beginPath();
            ctx.arc(midX - 90, cy, 10, 0, Math.PI * 2);
            ctx.fill();
          }

          // Right side question mark
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 72px "Segoe UI", Arial, sans-serif';
          ctx.fillText('?', midX + 110, cy);
          ctx.restore();
        }
      };
    }
  };

})();
