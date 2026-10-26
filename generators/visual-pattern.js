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

    // ── 4. Complete Series ──
    _genSeries: function (diff) {
      const series = ['3 Sides (▲)', '4 Sides (■)', '5 Sides (⬟)', '6 Sides (⬢)', '?'];
      return {
        type: 'visual-pattern',
        subtype: 'complete-series',
        difficulty: diff,
        title: 'Complete the Geometric Series',
        instruction: 'Identify the rule and determine the next figure in the sequence.',
        answer: 'Heptagon (7-sided polygon)',
        hint: 'Count the number of vertices or sides in each consecutive figure.',
        renderFn: function (ctx, x, y, w, h) {
          const boxSize = 140;
          const gap = 24;
          const totalW = 5 * boxSize + 4 * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 70;

          series.forEach((s, idx) => {
            const bx = startX + idx * (boxSize + gap);
            const isQ = idx === 4;

            ctx.fillStyle = isQ ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy, boxSize, boxSize, 14);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.font = isQ ? 'bold 64px "Segoe UI", Arial, sans-serif' : 'bold 44px "Segoe UI", Arial, sans-serif';
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
        }
      };
    },

    // ── 5. Mirror Image ──
    _genMirror: function (diff) {
      return {
        type: 'visual-pattern',
        subtype: 'mirror-image',
        difficulty: diff,
        title: 'Mirror Image Reflection',
        instruction: 'If the object on the left is reflected across the dashed red mirror line, what does it look like?',
        answer: 'Option B is the exact lateral inversion.',
        hint: 'Left and right flip, top and bottom remain unchanged.',
        renderFn: function (ctx, x, y, w, h) {
          const midX = x + w / 2;
          const cy = y + h / 2 - 30;

          // Mirror line
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 3;
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

          // Left shape
          ctx.fillStyle = '#1E3A8A';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.moveTo(midX - 160, cy - 80);
          ctx.lineTo(midX - 60, cy);
          ctx.lineTo(midX - 160, cy + 80);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right side question mark
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 72px "Segoe UI", Arial, sans-serif';
          ctx.fillText('?', midX + 110, cy);
        }
      };
    }
  };

})();
