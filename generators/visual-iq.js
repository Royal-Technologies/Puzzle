/**
 * Visual IQ Puzzles Generator
 * Fully Randomized, Clean, Simple, Deterministic Visual IQ Puzzles
 * Subtypes:
 *   1. odd-one-out: Find the figure that violates the pattern (dynamically shuffled)
 *   2. matrix-2x2: Complete the 2×2 visual matrix (randomized shapes & rules)
 *   3. count-shapes: Count total triangles in geometric figures (varied diagrams)
 *   4. shape-analogy: A is to B as C is to ? (randomized analogies & shapes)
 *   5. spatial-rotation: Find the exact rotated figure without mirroring (varied glyphs)
 * Branding: Bright Path | Royal Technologies
 */
'use strict';

window.VisualIQGenerator = (function () {

  // ── Random Helpers ──
  function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  // ── Safe Round Rect Helper ──
  function drawRoundedBox(ctx, x, y, w, h, r, fillColor, strokeColor, lineWidth) {
    r = Math.min(r || 8, Math.abs(w) / 2, Math.abs(h) / 2);
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

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth || 2;
      ctx.stroke();
    }
  }

  // ── Regular Polygon ──
  function drawPolygon(ctx, cx, cy, radius, sides, fillColor, strokeColor, lineWidth, rotRad) {
    rotRad = rotRad !== undefined ? rotRad : -Math.PI / 2;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotRad + (i * 2 * Math.PI) / sides;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth || 2;
      ctx.stroke();
    }
  }

  // ── Circle ──
  function drawCircle(ctx, cx, cy, radius, fillColor, strokeColor, lineWidth) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth || 2;
      ctx.stroke();
    }
  }

  // ── Multiple Choice Badge (A, B, C, D, E) ──
  function drawOptionBadge(ctx, x, y, letter, highlight) {
    ctx.save();
    const bg = highlight ? '#DC2626' : '#1E293B';
    drawCircle(ctx, x, y, 16, bg, '#FFFFFF', 1.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x, y);
    ctx.restore();
  }

  // Color palettes
  const THEME_COLORS = [
    { fill: '#EFF6FF', stroke: '#1E3A8A' },
    { fill: '#F5F3FF', stroke: '#5B21B6' },
    { fill: '#ECFDF5', stroke: '#065F46' },
    { fill: '#FFFBEB', stroke: '#92400E' },
    { fill: '#FEF2F2', stroke: '#991B1B' }
  ];

  return {
    name: 'Visual IQ Puzzles',
    subtypes: [
      { value: 'odd-one-out',     label: 'Odd One Out' },
      { value: 'matrix-2x2',      label: '2×2 Pattern Matrix' },
      { value: 'count-shapes',    label: 'Count the Triangles' },
      { value: 'shape-analogy',   label: 'Shape Analogy (A:B :: C:?)' },
      { value: 'spatial-rotation',label: 'Spatial Rotation' }
    ],

    generate: function (subtype, difficulty) {
      switch (subtype) {
        case 'odd-one-out':      return this._genOddOneOut(difficulty);
        case 'matrix-2x2':       return this._genMatrix2x2(difficulty);
        case 'count-shapes':     return this._genCountShapes(difficulty);
        case 'shape-analogy':    return this._genShapeAnalogy(difficulty);
        case 'spatial-rotation': return this._genSpatialRotation(difficulty);
        default:                 return this._genOddOneOut(difficulty);
      }
    },

    // =========================================================================
    // 1. ODD ONE OUT (Randomized Pools, Shuffled Positions A-E)
    // =========================================================================
    _genOddOneOut: function (diff) {
      const mode = pickOne(['curved', 'parity', 'dots', 'rotation']);

      let items = [];
      let oddIndex = 0;
      let reason = '';

      if (mode === 'curved') {
        // 4 Polygons and 1 Curved Circle
        const polys = shuffle([
          { type: 'poly', sides: 3, name: 'Triangle' },
          { type: 'poly', sides: 4, name: 'Square' },
          { type: 'poly', sides: 5, name: 'Pentagon' },
          { type: 'poly', sides: 6, name: 'Hexagon' },
          { type: 'poly', sides: 8, name: 'Octagon' }
        ]).slice(0, 4);

        const circleItem = { type: 'circle', name: 'Circle', isOdd: true };
        const rawItems = shuffle([...polys, circleItem]);

        oddIndex = rawItems.findIndex(it => it.isOdd);
        const oddLetter = ['A', 'B', 'C', 'D', 'E'][oddIndex];
        reason = `Option ${oddLetter} (Circle — it is the only curved figure with no straight edges or vertices; all other 4 figures are polygons)`;

        items = rawItems.map((it, idx) => ({
          ...it,
          id: ['A', 'B', 'C', 'D', 'E'][idx],
          color: it.isOdd ? '#DC2626' : '#1E3A8A',
          fill: it.isOdd ? '#FEE2E2' : '#EFF6FF'
        }));

      } else if (mode === 'parity') {
        // 4 Even-sided polygons and 1 Odd-sided polygon
        const evenPool = shuffle([
          { sides: 4, label: '4 Sides' },
          { sides: 6, label: '6 Sides' },
          { sides: 8, label: '8 Sides' },
          { sides: 10, label: '10 Sides' }
        ]);
        const oddPool = shuffle([
          { sides: 3, label: '3 Sides' },
          { sides: 5, label: '5 Sides' },
          { sides: 7, label: '7 Sides' }
        ]);

        const chosenEven = evenPool.slice(0, 4);
        const chosenOdd = { ...oddPool[0], isOdd: true };

        const rawItems = shuffle([...chosenEven, chosenOdd]);
        oddIndex = rawItems.findIndex(it => it.isOdd);
        const oddLetter = ['A', 'B', 'C', 'D', 'E'][oddIndex];
        reason = `Option ${oddLetter} (${chosenOdd.label} — it has an odd number of sides (${chosenOdd.sides}), whereas all other four figures have an even number of sides)`;

        items = rawItems.map((it, idx) => ({
          type: 'poly',
          sides: it.sides,
          name: it.label,
          id: ['A', 'B', 'C', 'D', 'E'][idx],
          color: it.isOdd ? '#DC2626' : '#1E3A8A',
          fill: it.isOdd ? '#FEE2E2' : '#EFF6FF'
        }));

      } else if (mode === 'dots') {
        // 4 Shapes where dots == sides, 1 shape with mismatched dots
        const shapesPool = shuffle([
          { sides: 3, name: 'Triangle' },
          { sides: 4, name: 'Square' },
          { sides: 5, name: 'Pentagon' },
          { sides: 6, name: 'Hexagon' },
          { sides: 8, name: 'Octagon' }
        ]);

        const rawItems = shapesPool.map((s, idx) => {
          if (idx === 0) {
            // Mismatch
            const diffDots = s.sides === 3 ? 5 : s.sides - 2;
            return { type: 'poly', sides: s.sides, dots: diffDots, name: s.name, isOdd: true };
          }
          return { type: 'poly', sides: s.sides, dots: s.sides, name: s.name, isOdd: false };
        });

        const shuffled = shuffle(rawItems);
        oddIndex = shuffled.findIndex(it => it.isOdd);
        const oddLetter = ['A', 'B', 'C', 'D', 'E'][oddIndex];
        const oddShape = shuffled[oddIndex];
        reason = `Option ${oddLetter} (${oddShape.name} — it contains ${oddShape.dots} dots instead of matching its ${oddShape.sides} sides, whereas all other figures contain dots equal to their number of sides)`;

        items = shuffled.map((it, idx) => ({
          ...it,
          id: ['A', 'B', 'C', 'D', 'E'][idx],
          color: '#0F172A',
          fill: '#F8FAFC'
        }));

      } else {
        // Rotation / Arrows direction: 4 pointing clockwise (up, right, down, left), 1 inverted!
        const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
        const normalAngles = shuffle(angles);
        const invertedAngle = pickOne([Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4]);

        const rawItems = [
          { angle: normalAngles[0], isOdd: false, label: 'Oriented' },
          { angle: normalAngles[1], isOdd: false, label: 'Oriented' },
          { angle: normalAngles[2], isOdd: false, label: 'Oriented' },
          { angle: normalAngles[3], isOdd: false, label: 'Oriented' },
          { angle: invertedAngle, isOdd: true, label: 'Diagonal' }
        ];

        const shuffled = shuffle(rawItems);
        oddIndex = shuffled.findIndex(it => it.isOdd);
        const oddLetter = ['A', 'B', 'C', 'D', 'E'][oddIndex];
        reason = `Option ${oddLetter} (The arrow points along a 45° diagonal axis, while all other four arrows are aligned with the cardinal axes: Up, Down, Left, or Right)`;

        items = shuffled.map((it, idx) => ({
          type: 'arrow',
          angle: it.angle,
          isOdd: it.isOdd,
          id: ['A', 'B', 'C', 'D', 'E'][idx],
          color: it.isOdd ? '#DC2626' : '#1E3A8A',
          fill: it.isOdd ? '#FEE2E2' : '#EFF6FF'
        }));
      }

      return {
        type: 'visual-iq',
        subtype: 'odd-one-out',
        difficulty: diff,
        title: 'Odd One Out — Visual IQ',
        instruction: 'Which figure does NOT belong with the other four?',
        answer: reason,
        hint: 'Carefully compare the shapes, straight edges, dots, or orientations across all five options.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cardW = 155, cardH = 220, gap = 24;
          const totalW = 5 * cardW + 4 * gap;
          const startX = x + (w - totalW) / 2;
          const startY = y + (h - cardH) / 2 - 20;

          items.forEach((item, i) => {
            const bx = startX + i * (cardW + gap);
            const by = startY;
            const cx = bx + cardW / 2;
            const cy = by + cardH / 2 - 10;

            // Box
            drawRoundedBox(ctx, bx, by, cardW, cardH, 14, '#FFFFFF', '#0F172A', 2.5);
            drawOptionBadge(ctx, bx + 26, by + 26, item.id);

            if (item.type === 'circle') {
              drawCircle(ctx, cx, cy, 48, item.fill, item.color, 3.5);
            } else if (item.type === 'poly') {
              drawPolygon(ctx, cx, cy, 48, item.sides, item.fill, item.color, 3.5);
              if (item.dots) {
                for (let d = 0; d < item.dots; d++) {
                  const a = (d * 2 * Math.PI) / item.dots - Math.PI / 2;
                  const rad = item.dots === 1 ? 0 : 20;
                  drawCircle(ctx, cx + rad * Math.cos(a), cy + rad * Math.sin(a), 5, '#DC2626', '#991B1B', 1);
                }
              }
            } else if (item.type === 'arrow') {
              // Draw an arrow with orientation
              ctx.save();
              ctx.translate(cx, cy);
              ctx.rotate(item.angle);
              ctx.fillStyle = item.color;
              ctx.strokeStyle = item.color;
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(-8, 30);
              ctx.lineTo(8, 30);
              ctx.lineTo(8, -10);
              ctx.lineTo(24, -10);
              ctx.lineTo(0, -36);
              ctx.lineTo(-24, -10);
              ctx.lineTo(-8, -10);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }

            // Label
            ctx.fillStyle = '#475569';
            ctx.font = '600 15px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(item.name || (item.sides ? item.sides + ' Sides' : 'Figure ' + item.id), cx, by + cardH - 22);
          });
          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 2. 2×2 PATTERN MATRIX (Randomized Rules, Dynamic Shuffled Choices)
    // =========================================================================
    _genMatrix2x2: function (diff) {
      const ruleType = pickOne(['fill-change', 'dot-count', 'shape-rotation']);

      let matrixData = {};
      let options = [];
      let correctLetter = 'A';
      let explanation = '';

      if (ruleType === 'fill-change') {
        const shapes = shuffle([
          { name: 'Square', sides: 4, rot: Math.PI / 4 },
          { name: 'Triangle', sides: 3, rot: -Math.PI / 2 },
          { name: 'Hexagon', sides: 6, rot: 0 },
          { name: 'Diamond', sides: 4, rot: 0 }
        ]);
        const s1 = shapes[0];
        const s2 = shapes[1];

        matrixData = {
          c00: { shape: s1, solid: false },
          c10: { shape: s1, solid: true },
          c01: { shape: s2, solid: false },
          c11: '?'
        };

        const rawOpts = [
          { shape: s2, solid: true, isCorrect: true }, // Correct!
          { shape: s2, solid: false, isCorrect: false },
          { shape: s1, solid: true, isCorrect: false },
          { shape: shapes[2], solid: true, isCorrect: false }
        ];

        const shuffledOpts = shuffle(rawOpts);
        const correctIdx = shuffledOpts.findIndex(o => o.isCorrect);
        correctLetter = ['A', 'B', 'C', 'D'][correctIdx];

        options = shuffledOpts.map((o, idx) => ({
          ...o,
          id: ['A', 'B', 'C', 'D'][idx]
        }));

        explanation = `Option ${correctLetter} (Solid ${s2.name} — from row 1, the shape remains the same while hollow changes to solid)`;

      } else if (ruleType === 'dot-count') {
        const shapes = shuffle(['circle', 'square']);
        const s1 = shapes[0];
        const s2 = shapes[1];
        const startDots = rnd(1, 2);

        matrixData = {
          c00: { shape: s1, dots: startDots },
          c10: { shape: s1, dots: startDots + 1 },
          c01: { shape: s2, dots: startDots + 1 },
          c11: '?'
        };

        const targetDots = startDots + 2;
        const rawOpts = [
          { shape: s2, dots: targetDots, isCorrect: true },
          { shape: s2, dots: startDots, isCorrect: false },
          { shape: s1, dots: targetDots, isCorrect: false },
          { shape: s2, dots: targetDots + 1, isCorrect: false }
        ];

        const shuffledOpts = shuffle(rawOpts);
        const correctIdx = shuffledOpts.findIndex(o => o.isCorrect);
        correctLetter = ['A', 'B', 'C', 'D'][correctIdx];

        options = shuffledOpts.map((o, idx) => ({
          ...o,
          id: ['A', 'B', 'C', 'D'][idx]
        }));

        explanation = `Option ${correctLetter} (${s2.toUpperCase()} with ${targetDots} dots — in each row, the dot count increases by 1 from left to right: ${startDots + 1} + 1 = ${targetDots})`;

      } else {
        // shape-rotation (Up ➔ Right)
        matrixData = {
          c00: { type: 'arrow', rot: 0 }, // Up
          c10: { type: 'arrow', rot: Math.PI / 2 }, // Right
          c01: { type: 'triangle', rot: -Math.PI / 2 }, // Pointing Up
          c11: '?'
        };

        const rawOpts = [
          { type: 'triangle', rot: 0, isCorrect: true }, // Pointing Right
          { type: 'triangle', rot: -Math.PI / 2, isCorrect: false },
          { type: 'arrow', rot: Math.PI / 2, isCorrect: false },
          { type: 'triangle', rot: Math.PI, isCorrect: false }
        ];

        const shuffledOpts = shuffle(rawOpts);
        const correctIdx = shuffledOpts.findIndex(o => o.isCorrect);
        correctLetter = ['A', 'B', 'C', 'D'][correctIdx];

        options = shuffledOpts.map((o, idx) => ({
          ...o,
          id: ['A', 'B', 'C', 'D'][idx]
        }));

        explanation = `Option ${correctLetter} (Triangle pointing Right — each figure in row 1 rotates 90° clockwise, so the upward triangle rotates to point right)`;
      }

      return {
        type: 'visual-iq',
        subtype: 'matrix-2x2',
        difficulty: diff,
        title: 'Visual IQ — 2×2 Matrix',
        instruction: 'Which figure replaces the question mark (?) to complete the matrix logically?',
        answer: explanation,
        hint: 'Look horizontally from left to right: observe what changes and what stays the same.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cy = y + h / 2 - 20;

          const matX = x + 80;
          const cellW = 150, cellH = 150, gap = 16;
          const matW = 2 * cellW + gap;
          const matH = 2 * cellH + gap;
          const matY = cy - matH / 2;

          drawRoundedBox(ctx, matX - 14, matY - 14, matW + 28, matH + 28, 16, '#F8FAFC', '#0F172A', 3);

          function renderCell(cellData, bx, by) {
            drawRoundedBox(ctx, bx, by, cellW, cellH, 10, '#FFFFFF', '#94A3B8', 2);
            const fcx = bx + cellW / 2;
            const fcy = by + cellH / 2;

            if (cellData === '?') {
              drawRoundedBox(ctx, bx, by, cellW, cellH, 10, '#FEF2F2', '#DC2626', 3);
              ctx.fillStyle = '#DC2626';
              ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('?', fcx, fcy);
              return;
            }

            if (cellData.shape && cellData.shape.sides) {
              const fill = cellData.solid ? '#1E3A8A' : null;
              drawPolygon(ctx, fcx, fcy, 42, cellData.shape.sides, fill, '#1E3A8A', 3.5, cellData.shape.rot);
            } else if (cellData.dots !== undefined) {
              if (cellData.shape === 'square') {
                drawPolygon(ctx, fcx, fcy, 42, 4, '#F1F5F9', '#1E3A8A', 3, Math.PI / 4);
              } else {
                drawCircle(ctx, fcx, fcy, 42, '#F1F5F9', '#1E3A8A', 3);
              }
              for (let d = 0; d < cellData.dots; d++) {
                const dx = fcx + (d - (cellData.dots - 1) / 2) * 20;
                drawCircle(ctx, dx, fcy, 5, '#DC2626', '#DC2626', 1);
              }
            } else if (cellData.type === 'arrow') {
              ctx.save();
              ctx.translate(fcx, fcy);
              ctx.rotate(cellData.rot);
              ctx.fillStyle = '#1E3A8A';
              ctx.beginPath();
              ctx.moveTo(-6, 25); ctx.lineTo(6, 25); ctx.lineTo(6, -8);
              ctx.lineTo(18, -8); ctx.lineTo(0, -28); ctx.lineTo(-18, -8); ctx.lineTo(-6, -8);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            } else if (cellData.type === 'triangle') {
              drawPolygon(ctx, fcx, fcy, 42, 3, '#1E3A8A', '#0F172A', 3, cellData.rot);
            }
          }

          // Draw the 4 matrix cells
          renderCell(matrixData.c00, matX, matY);
          renderCell(matrixData.c10, matX + cellW + gap, matY);
          renderCell(matrixData.c01, matX, matY + cellH + gap);
          renderCell(matrixData.c11, matX + cellW + gap, matY + cellH + gap);

          // Options on Right
          const optStartX = matX + matW + 80;
          const optW = 180, optH = 140, optGapX = 24, optGapY = 24;

          options.forEach((opt, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const bx = optStartX + col * (optW + optGapX);
            const by = matY + row * (optH + optGapY + 12);
            const fcx = bx + optW / 2;
            const fcy = by + optH / 2 + 8;

            drawRoundedBox(ctx, bx, by, optW, optH, 12, '#FFFFFF', '#0F172A', 2);
            drawOptionBadge(ctx, bx + 24, by + 24, opt.id);

            if (opt.shape && opt.shape.sides) {
              const fill = opt.solid ? '#1E3A8A' : null;
              drawPolygon(ctx, fcx, fcy, 34, opt.shape.sides, fill, '#1E3A8A', 3, opt.shape.rot);
            } else if (opt.dots !== undefined) {
              if (opt.shape === 'square') {
                drawPolygon(ctx, fcx, fcy, 34, 4, '#F8FAFC', '#1E3A8A', 2.5, Math.PI / 4);
              } else {
                drawCircle(ctx, fcx, fcy, 34, '#F8FAFC', '#1E3A8A', 2.5);
              }
              for (let d = 0; d < opt.dots; d++) {
                const dx = fcx + (d - (opt.dots - 1) / 2) * 16;
                drawCircle(ctx, dx, fcy, 4.5, '#DC2626', '#DC2626', 1);
              }
            } else if (opt.type === 'arrow') {
              ctx.save();
              ctx.translate(fcx, fcy);
              ctx.rotate(opt.rot);
              ctx.fillStyle = '#1E3A8A';
              ctx.beginPath();
              ctx.moveTo(-5, 20); ctx.lineTo(5, 20); ctx.lineTo(5, -6);
              ctx.lineTo(14, -6); ctx.lineTo(0, -22); ctx.lineTo(-14, -6); ctx.lineTo(-5, -6);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            } else if (opt.type === 'triangle') {
              drawPolygon(ctx, fcx, fcy, 34, 3, '#1E3A8A', '#0F172A', 2.5, opt.rot);
            }
          });

          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 3. COUNT THE TRIANGLES (Varied Levels, Divided Triangle & Square)
    // =========================================================================
    _genCountShapes: function (diff) {
      // Pick between Divided Triangle (with random verticals & horizontals) or 8-Spoke Square
      const diagType = pickOne(['divided-triangle', 'eight-spoke-square']);

      let total = 0;
      let options = [];
      let explanation = '';
      let diagConfig = {};

      if (diagType === 'divided-triangle') {
        const V = rnd(1, 2); // 1 or 2 vertical dividing lines from apex
        const H = rnd(1, 2); // 1 or 2 horizontal lines
        // Base segments = V + 1
        // Triangles per horizontal tier = (V + 1)(V + 2) / 2
        // Total = Tiers * (V + 1)(V + 2) / 2
        const tierTriangles = ((V + 1) * (V + 2)) / 2;
        total = tierTriangles * (H + 1);

        diagConfig = { type: 'triangle', V, H };
        explanation = `${total} Triangles (Each tier has ${tierTriangles} triangles, and there are ${H + 1} horizontal levels: ${tierTriangles} × ${H + 1} = ${total})`;

      } else {
        // 8-Spoke Square (Square with 2 diagonals and 2 medians)
        total = 16;
        diagConfig = { type: 'square' };
        explanation = `16 Triangles (8 small single-cell, 4 medium corner triangles formed by 2 cells, and 4 large half-square diagonal triangles)`;
      }

      // Generate distractors
      const distractors = [total - 2, total + 2, total + 4].map(v => Math.max(1, v));
      const rawChoices = [
        { val: `${total} Triangles`, isCorrect: true },
        { val: `${distractors[0]} Triangles`, isCorrect: false },
        { val: `${distractors[1]} Triangles`, isCorrect: false },
        { val: `${distractors[2]} Triangles`, isCorrect: false }
      ];

      const shuffled = shuffle(rawChoices);
      const correctIdx = shuffled.findIndex(c => c.isCorrect);
      const correctLetter = ['A', 'B', 'C', 'D'][correctIdx];

      options = shuffled.map((c, i) => ({
        ...c,
        id: ['A', 'B', 'C', 'D'][i]
      }));

      return {
        type: 'visual-iq',
        subtype: 'count-shapes',
        difficulty: diff,
        title: 'Triangle Counting Challenge',
        instruction: 'How many total triangles of all sizes can you find in this figure?',
        answer: `Option ${correctLetter} (${explanation})`,
        hint: 'Count the smallest individual triangles first, then look for combinations that form larger triangles.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cx = x + w / 2;
          const cy = y + 210;

          const diagW = 440, diagH = 300;
          drawRoundedBox(ctx, cx - diagW / 2, cy - diagH / 2, diagW, diagH, 16, '#F8FAFC', '#0F172A', 3);

          if (diagConfig.type === 'triangle') {
            const topY = cy - 110;
            const botY = cy + 110;
            const halfBase = 150;

            ctx.strokeStyle = '#1E3A8A';
            ctx.lineWidth = 4;
            ctx.fillStyle = 'rgba(224,231,255,0.3)';

            // Outer triangle
            ctx.beginPath();
            ctx.moveTo(cx, topY);
            ctx.lineTo(cx + halfBase, botY);
            ctx.lineTo(cx - halfBase, botY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Vertical radiating lines from apex to base
            const segments = diagConfig.V + 1;
            for (let v = 1; v <= diagConfig.V; v++) {
              const bx = cx - halfBase + (v * (2 * halfBase)) / segments;
              ctx.beginPath();
              ctx.moveTo(cx, topY);
              ctx.lineTo(bx, botY);
              ctx.stroke();
            }

            // Horizontal crossbars
            const hLevels = diagConfig.H;
            for (let hIndex = 1; hIndex <= hLevels; hIndex++) {
              const frac = hIndex / (hLevels + 1);
              const hy = topY + frac * (botY - topY);
              const hw = halfBase * frac;
              ctx.beginPath();
              ctx.moveTo(cx - hw, hy);
              ctx.lineTo(cx + hw, hy);
              ctx.stroke();
            }

          } else {
            // 8-Spoke Square
            const sqSize = 130;
            ctx.fillStyle = '#EFF6FF';
            ctx.strokeStyle = '#1E3A8A';
            ctx.lineWidth = 4;
            ctx.fillRect(cx - sqSize, cy - sqSize, sqSize * 2, sqSize * 2);
            ctx.strokeRect(cx - sqSize, cy - sqSize, sqSize * 2, sqSize * 2);

            ctx.beginPath();
            ctx.moveTo(cx - sqSize, cy - sqSize); ctx.lineTo(cx + sqSize, cy + sqSize);
            ctx.moveTo(cx + sqSize, cy - sqSize); ctx.lineTo(cx - sqSize, cy + sqSize);
            ctx.moveTo(cx - sqSize, cy); ctx.lineTo(cx + sqSize, cy);
            ctx.moveTo(cx, cy - sqSize); ctx.lineTo(cx, cy + sqSize);
            ctx.stroke();
          }

          // Options below
          const optY = cy + diagH / 2 + 55;
          const optW = 160, optH = 75, gap = 24;
          const totalOptW = 4 * optW + 3 * gap;
          const optStartX = cx - totalOptW / 2;

          options.forEach((opt, idx) => {
            const bx = optStartX + idx * (optW + gap);
            drawRoundedBox(ctx, bx, optY, optW, optH, 12, '#FFFFFF', '#0F172A', 2.5);
            drawOptionBadge(ctx, bx + 22, optY + 22, opt.id);

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(opt.val, bx + optW / 2 + 10, optY + optH / 2);
          });

          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 4. SHAPE ANALOGY (A : B :: C : ?)
    // =========================================================================
    _genShapeAnalogy: function (diff) {
      // Pick 4 distinct shapes for outer/inner inversion
      const shapesPool = shuffle(['circle', 'square', 'triangle', 'pentagon']);
      const s1 = shapesPool[0];
      const s2 = shapesPool[1];
      const s3 = shapesPool[2];
      const s4 = shapesPool[3];

      // Pair 1: S1 inside S2 ➔ S2 inside S1 (swap places!)
      // Pair 2: S3 inside S4 ➔ [ ? ] (Correct: S4 inside S3)
      const correctOuter = s4;
      const correctInner = s3;

      const rawOpts = [
        { outer: correctOuter, inner: correctInner, isCorrect: true },
        { outer: s3, inner: s4, isCorrect: false },
        { outer: s1, inner: s3, isCorrect: false },
        { outer: s4, inner: s2, isCorrect: false }
      ];

      const shuffled = shuffle(rawOpts);
      const correctIdx = shuffled.findIndex(o => o.isCorrect);
      const correctLetter = ['A', 'B', 'C', 'D'][correctIdx];

      const options = shuffled.map((o, idx) => ({
        ...o,
        id: ['A', 'B', 'C', 'D'][idx]
      }));

      const explanation = `Option ${correctLetter} (${correctOuter.toUpperCase()} with inner ${correctInner.toUpperCase()} — the inner and outer shapes swap positions: the inside shape becomes the outer container, and the outer container moves inside)`;

      return {
        type: 'visual-iq',
        subtype: 'shape-analogy',
        difficulty: diff,
        title: 'Shape Analogy IQ Test',
        instruction: 'Figure 1 is to Figure 2 as Figure 3 is to [ ? ]. Which option completes the analogy?',
        answer: explanation,
        hint: 'Examine the relationship between Figure 1 and Figure 2: how do the outer and inner shapes transform?',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cx = x + w / 2;
          const topY = y + 70;
          const boxSize = 120;

          function renderNested(bx, by, outS, inS) {
            drawRoundedBox(ctx, bx, by, boxSize, boxSize, 12, '#FFFFFF', '#0F172A', 2.5);
            const fcx = bx + boxSize / 2;
            const fcy = by + boxSize / 2;

            function drawSingle(shape, r, isInner) {
              const fill = isInner ? '#DC2626' : '#EFF6FF';
              const stroke = isInner ? '#DC2626' : '#1E3A8A';
              const lw = isInner ? 1 : 3;
              if (shape === 'circle') drawCircle(ctx, fcx, fcy, r, fill, stroke, lw);
              else if (shape === 'square') drawPolygon(ctx, fcx, fcy, r, 4, fill, stroke, lw, Math.PI / 4);
              else if (shape === 'triangle') drawPolygon(ctx, fcx, fcy, r, 3, fill, stroke, lw);
              else if (shape === 'pentagon') drawPolygon(ctx, fcx, fcy, r, 5, fill, stroke, lw);
            }

            drawSingle(outS, 42, false);
            drawSingle(inS, 18, true);
          }

          // Pair 1: S2 containing S1 ➔ S1 containing S2
          const p1X = cx - 360;
          renderNested(p1X, topY, s2, s1);

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('➔', p1X + boxSize + 30, topY + boxSize / 2);

          renderNested(p1X + boxSize + 60, topY, s1, s2);

          // Double Colon ::
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 36px Arial';
          ctx.fillText('::', cx - 20, topY + boxSize / 2);

          // Pair 2: S4 containing S3 ➔ [ ? ]
          const p2X = cx + 80;
          renderNested(p2X, topY, s4, s3);

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('➔', p2X + boxSize + 30, topY + boxSize / 2);

          const qbx = p2X + boxSize + 60;
          drawRoundedBox(ctx, qbx, topY, boxSize, boxSize, 12, '#FEF2F2', '#DC2626', 3);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
          ctx.fillText('?', qbx + boxSize / 2, topY + boxSize / 2);

          // Options (A, B, C, D)
          const optY = topY + boxSize + 85;
          const optW = 180, optH = 150, optGap = 24;
          const totalW = 4 * optW + 3 * optGap;
          const startOptX = cx - totalW / 2;

          options.forEach((opt, idx) => {
            const bx = startOptX + idx * (optW + optGap);
            drawRoundedBox(ctx, bx, optY, optW, optH, 14, '#FFFFFF', '#0F172A', 2);
            drawOptionBadge(ctx, bx + 24, optY + 24, opt.id);

            const ocx = bx + optW / 2;
            const ocy = optY + optH / 2 + 10;

            function drawSingle(shape, r, isInner) {
              const fill = isInner ? '#DC2626' : '#EFF6FF';
              const stroke = isInner ? '#DC2626' : '#1E3A8A';
              const lw = isInner ? 1 : 2.5;
              if (shape === 'circle') drawCircle(ctx, ocx, ocy, r, fill, stroke, lw);
              else if (shape === 'square') drawPolygon(ctx, ocx, ocy, r, 4, fill, stroke, lw, Math.PI / 4);
              else if (shape === 'triangle') drawPolygon(ctx, ocx, ocy, r, 3, fill, stroke, lw);
              else if (shape === 'pentagon') drawPolygon(ctx, ocx, ocy, r, 5, fill, stroke, lw);
            }

            drawSingle(opt.outer, 36, false);
            drawSingle(opt.inner, 15, true);
          });

          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 5. SPATIAL ROTATION (Randomized Target Glyph & Shuffled Choices A-D)
    // =========================================================================
    _genSpatialRotation: function (diff) {
      // Pick a random target rotation challenge:
      // Target at angle 0. Rotated options: 90° CW, 180°, 270° CW, or mirrored!
      const targetAngle = pickOne([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]);
      const requestedRot = pickOne([
        { label: '90° clockwise', angle: Math.PI / 2 },
        { label: '180°', angle: Math.PI },
        { label: '90° counter-clockwise', angle: -Math.PI / 2 }
      ]);

      const correctRotAngle = targetAngle + requestedRot.angle;

      const rawOpts = [
        { rot: correctRotAngle, mirror: false, isCorrect: true },
        { rot: correctRotAngle, mirror: true, isCorrect: false },
        { rot: correctRotAngle + Math.PI, mirror: true, isCorrect: false },
        { rot: correctRotAngle + Math.PI / 2, mirror: false, isCorrect: false }
      ];

      const shuffled = shuffle(rawOpts);
      const correctIdx = shuffled.findIndex(o => o.isCorrect);
      const correctLetter = ['A', 'B', 'C', 'D'][correctIdx];

      const options = shuffled.map((o, idx) => ({
        ...o,
        id: ['A', 'B', 'C', 'D'][idx]
      }));

      const explanation = `Option ${correctLetter} (Exact ${requestedRot.label} rotation — notice that the red dot and arm preserve their true relative positions without being mirrored)`;

      return {
        type: 'visual-iq',
        subtype: 'spatial-rotation',
        difficulty: diff,
        title: 'Spatial Rotation IQ Test',
        instruction: `Which figure (A, B, C, or D) is an exact ${requestedRot.label} rotation of the Target Figure (without flipping or mirroring)?`,
        answer: explanation,
        hint: `Follow the orientation of the red dot: when rotating ${requestedRot.label}, track where the dot moves.`,
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cy = y + h / 2 - 20;

          function drawGlyph(fcx, fcy, scale, rotRad, isMirrored) {
            ctx.save();
            ctx.translate(fcx, fcy);
            if (isMirrored) ctx.scale(-1, 1);
            ctx.rotate(rotRad);

            const s = scale;
            ctx.fillStyle = '#1E3A8A';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 3;

            // L-stem
            ctx.beginPath();
            ctx.rect(-12 * s, -45 * s, 24 * s, 90 * s);
            ctx.fill();
            ctx.stroke();

            // L-arm
            ctx.beginPath();
            ctx.rect(12 * s, 15 * s, 36 * s, 30 * s);
            ctx.fill();
            ctx.stroke();

            // Red dot on top tip
            ctx.fillStyle = '#DC2626';
            ctx.beginPath();
            ctx.arc(0, -32 * s, 7 * s, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // Target Figure on Left
          const leftX = x + 180;
          drawRoundedBox(ctx, leftX - 110, cy - 140, 220, 280, 16, '#F8FAFC', '#0F172A', 3);

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText('TARGET FIGURE', leftX, cy - 100);

          drawGlyph(leftX, cy + 20, 1.15, targetAngle, false);

          // 4 Options (A, B, C, D) on the Right
          const rightX = x + 460;
          const cardW = 195, cardH = 135, gapX = 30, gapY = 24;

          options.forEach((opt, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const bx = rightX + col * (cardW + gapX);
            const by = cy - 140 + row * (cardH + gapY);

            drawRoundedBox(ctx, bx, by, cardW, cardH, 12, '#FFFFFF', '#0F172A', 2);
            drawOptionBadge(ctx, bx + 24, by + 24, opt.id);

            drawGlyph(bx + cardW / 2 + 10, by + cardH / 2 + 6, 0.75, opt.rot, opt.mirror);
          });

          ctx.restore();
        }
      };
    }
  };

})();
