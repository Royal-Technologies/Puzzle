/**
 * Visual IQ Puzzles Generator
 * Clean, Simple, Deterministic Visual IQ Puzzles
 * Subtypes:
 *   1. odd-one-out: Find the figure that does not belong
 *   2. matrix-2x2: Complete the 2×2 Raven-style visual matrix
 *   3. count-shapes: Count total triangles in geometric figures
 *   4. shape-analogy: A is to B as C is to ?
 *   5. spatial-rotation: Find the exact rotated figure (not mirrored)
 * Branding: Bright Path | Royal Technologies
 */
'use strict';

window.VisualIQGenerator = (function () {

  // ── Helper: Safe Round Rect (portable, zero canvas state bugs) ──
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

  // ── Helper: Regular Polygon ──
  function drawPolygon(ctx, cx, cy, radius, sides, fillColor, strokeColor, lineWidth, rotRad) {
    rotRad = rotRad || -Math.PI / 2; // Point up by default
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

  // ── Helper: Circle ──
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

  // ── Helper: Star ──
  function drawStar(ctx, cx, cy, points, outerR, innerR, fillColor, strokeColor, lineWidth) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = -Math.PI / 2 + (i * Math.PI) / points;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
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

  // ── Helper: Multiple Choice Badge (A, B, C, D) ──
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
    // 1. ODD ONE OUT
    // =========================================================================
    _genOddOneOut: function (diff) {
      if (diff === 'easy') {
        return {
          type: 'visual-iq',
          subtype: 'odd-one-out',
          difficulty: diff,
          title: 'Odd One Out — Visual IQ',
          instruction: 'Which figure does NOT belong with the others?',
          answer: 'Option C (Circle — it is the only curved shape with no straight sides or vertices, while all others are polygons)',
          hint: 'Count the sides and straight edges of each figure.',
          renderFn: function (ctx, x, y, w, h) {
            ctx.save();
            const cardW = 155, cardH = 220, gap = 24;
            const totalW = 5 * cardW + 4 * gap;
            const startX = x + (w - totalW) / 2;
            const startY = y + (h - cardH) / 2 - 20;

            const items = [
              { id: 'A', type: 'poly', sides: 4, name: 'Square' },
              { id: 'B', type: 'poly', sides: 3, name: 'Triangle' },
              { id: 'C', type: 'circle', name: 'Circle' }, // Odd one out!
              { id: 'D', type: 'poly', sides: 5, name: 'Pentagon' },
              { id: 'E', type: 'poly', sides: 6, name: 'Hexagon' }
            ];

            items.forEach((item, i) => {
              const bx = startX + i * (cardW + gap);
              const by = startY;
              const cx = bx + cardW / 2;
              const cy = by + cardH / 2 - 10;

              // Card Background
              drawRoundedBox(ctx, bx, by, cardW, cardH, 14, '#FFFFFF', '#0F172A', 2.5);

              // Badge
              drawOptionBadge(ctx, bx + 26, by + 26, item.id);

              // Shape
              if (item.type === 'circle') {
                drawCircle(ctx, cx, cy, 48, '#FEE2E2', '#DC2626', 3.5);
              } else {
                drawPolygon(ctx, cx, cy, 48, item.sides, '#E0E7FF', '#3730A3', 3.5);
              }

              // Name label
              ctx.fillStyle = '#475569';
              ctx.font = '600 16px "Segoe UI", Arial, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'alphabetic';
              ctx.fillText(item.name, cx, by + cardH - 22);
            });
            ctx.restore();
          }
        };
      }

      if (diff === 'medium') {
        return {
          type: 'visual-iq',
          subtype: 'odd-one-out',
          difficulty: diff,
          title: 'Odd One Out — Sides Parity',
          instruction: 'Which figure does NOT belong with the other four?',
          answer: 'Option D (Pentagon — it has 5 sides (an odd number), whereas all other figures have an even number of sides: 4, 6, 8, 10)',
          hint: 'Count the number of vertices and sides in each polygon.',
          renderFn: function (ctx, x, y, w, h) {
            ctx.save();
            const cardW = 155, cardH = 220, gap = 24;
            const totalW = 5 * cardW + 4 * gap;
            const startX = x + (w - totalW) / 2;
            const startY = y + (h - cardH) / 2 - 20;

            const items = [
              { id: 'A', sides: 4, label: '4 Sides' },
              { id: 'B', sides: 6, label: '6 Sides' },
              { id: 'C', sides: 8, label: '8 Sides' },
              { id: 'D', sides: 5, label: '5 Sides' }, // Odd!
              { id: 'E', sides: 10, label: '10 Sides' }
            ];

            items.forEach((item, i) => {
              const bx = startX + i * (cardW + gap);
              const by = startY;
              const cx = bx + cardW / 2;
              const cy = by + cardH / 2 - 10;

              drawRoundedBox(ctx, bx, by, cardW, cardH, 14, '#FFFFFF', '#0F172A', 2.5);
              drawOptionBadge(ctx, bx + 26, by + 26, item.id);

              const color = item.sides === 5 ? '#DC2626' : '#1E3A8A';
              const fill = item.sides === 5 ? '#FEE2E2' : '#EFF6FF';
              drawPolygon(ctx, cx, cy, 48, item.sides, fill, color, 3);

              ctx.fillStyle = '#475569';
              ctx.font = '600 16px "Segoe UI", Arial, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'alphabetic';
              ctx.fillText(item.label, cx, by + cardH - 22);
            });
            ctx.restore();
          }
        };
      }

      // Hard: Internal Dots Rule
      return {
        type: 'visual-iq',
        subtype: 'odd-one-out',
        difficulty: diff,
        title: 'Odd One Out — Logical Pattern',
        instruction: 'Find the figure that violates the internal rule followed by the rest.',
        answer: 'Option C (Pentagon — each figure has internal dots matching its number of sides: 3 for triangle, 4 for square, 6 for hexagon, but the pentagon has only 3 dots instead of 5)',
        hint: 'Compare the number of dots inside each shape with the shape’s number of sides.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cardW = 155, cardH = 220, gap = 24;
          const totalW = 5 * cardW + 4 * gap;
          const startX = x + (w - totalW) / 2;
          const startY = y + (h - cardH) / 2 - 20;

          const items = [
            { id: 'A', sides: 3, dots: 3 },
            { id: 'B', sides: 4, dots: 4 },
            { id: 'C', sides: 5, dots: 3 }, // Mismatch!
            { id: 'D', sides: 6, dots: 6 },
            { id: 'E', sides: 8, dots: 8 }
          ];

          items.forEach((item, i) => {
            const bx = startX + i * (cardW + gap);
            const by = startY;
            const cx = bx + cardW / 2;
            const cy = by + cardH / 2 - 10;

            drawRoundedBox(ctx, bx, by, cardW, cardH, 14, '#FFFFFF', '#0F172A', 2.5);
            drawOptionBadge(ctx, bx + 26, by + 26, item.id);
            drawPolygon(ctx, cx, cy, 52, item.sides, '#F8FAFC', '#0F172A', 3);

            // Draw internal dots arranged neatly
            const dotR = 5;
            for (let d = 0; d < item.dots; d++) {
              const dotAngle = (d * 2 * Math.PI) / item.dots - Math.PI / 2;
              const rad = item.dots === 1 ? 0 : 22;
              const dx = cx + rad * Math.cos(dotAngle);
              const dy = cy + rad * Math.sin(dotAngle);
              drawCircle(ctx, dx, dy, dotR, '#DC2626', '#991B1B', 1);
            }

            ctx.fillStyle = '#475569';
            ctx.font = '600 15px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(`${item.sides} sides, ${item.dots} dots`, cx, by + cardH - 22);
          });
          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 2. 2×2 PATTERN MATRIX
    // =========================================================================
    _genMatrix2x2: function (diff) {
      if (diff === 'easy') {
        return {
          type: 'visual-iq',
          subtype: 'matrix-2x2',
          difficulty: diff,
          title: 'Visual IQ — 2×2 Matrix',
          instruction: 'Which figure replaces the question mark (?) to complete the matrix?',
          answer: 'Option A (Solid Filled Triangle — following row 1, the shape remains the same while hollow becomes solid)',
          hint: 'Look horizontally: what change happens from the first column to the second column?',
          renderFn: function (ctx, x, y, w, h) {
            ctx.save();
            const cy = y + h / 2 - 20;

            // Left 2×2 Matrix
            const matX = x + 80;
            const cellW = 150, cellH = 150, gap = 16;
            const matW = 2 * cellW + gap;
            const matH = 2 * cellH + gap;
            const matY = cy - matH / 2;

            drawRoundedBox(ctx, matX - 14, matY - 14, matW + 28, matH + 28, 16, '#F8FAFC', '#0F172A', 3);

            // Cells (0,0), (1,0), (0,1), (1,1)
            // (0,0): Hollow Square
            drawRoundedBox(ctx, matX, matY, cellW, cellH, 10, '#FFFFFF', '#94A3B8', 2);
            drawPolygon(ctx, matX + cellW / 2, matY + cellH / 2, 42, 4, null, '#1E3A8A', 4, Math.PI / 4);

            // (1,0): Solid Square
            drawRoundedBox(ctx, matX + cellW + gap, matY, cellW, cellH, 10, '#FFFFFF', '#94A3B8', 2);
            drawPolygon(ctx, matX + cellW + gap + cellW / 2, matY + cellH / 2, 42, 4, '#1E3A8A', '#0F172A', 3, Math.PI / 4);

            // (0,1): Hollow Triangle
            drawRoundedBox(ctx, matX, matY + cellH + gap, cellW, cellH, 10, '#FFFFFF', '#94A3B8', 2);
            drawPolygon(ctx, matX + cellW / 2, matY + cellH + gap + cellH / 2, 44, 3, null, '#DC2626', 4);

            // (1,1): Question Mark Box
            const qx = matX + cellW + gap;
            const qy = matY + cellH + gap;
            drawRoundedBox(ctx, qx, qy, cellW, cellH, 10, '#FEF2F2', '#DC2626', 3);
            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', qx + cellW / 2, qy + cellH / 2);

            // Right Options (A, B, C, D)
            const optStartX = matX + matW + 80;
            const optW = 180, optH = 140, optGapX = 24, optGapY = 24;

            const opts = [
              { id: 'A', type: 'tri', solid: true, color: '#DC2626' }, // Correct!
              { id: 'B', type: 'tri', solid: false, color: '#DC2626' },
              { id: 'C', type: 'circle', solid: true, color: '#1E3A8A' },
              { id: 'D', type: 'square', solid: true, color: '#1E3A8A' }
            ];

            opts.forEach((opt, idx) => {
              const col = idx % 2;
              const row = Math.floor(idx / 2);
              const bx = optStartX + col * (optW + optGapX);
              const by = matY + row * (optH + optGapY + 12);
              const cx = bx + optW / 2;
              const cy2 = by + optH / 2 + 6;

              drawRoundedBox(ctx, bx, by, optW, optH, 12, '#FFFFFF', '#0F172A', 2);
              drawOptionBadge(ctx, bx + 24, by + 24, opt.id);

              if (opt.type === 'tri') {
                drawPolygon(ctx, cx, cy2, 38, 3, opt.solid ? opt.color : null, opt.color, 3.5);
              } else if (opt.type === 'circle') {
                drawCircle(ctx, cx, cy2, 36, opt.solid ? opt.color : null, opt.color, 3.5);
              } else {
                drawPolygon(ctx, cx, cy2, 36, 4, opt.solid ? opt.color : null, opt.color, 3.5, Math.PI / 4);
              }
            });

            ctx.restore();
          }
        };
      }

      // Medium: Dot Count Pattern
      return {
        type: 'visual-iq',
        subtype: 'matrix-2x2',
        difficulty: diff,
        title: 'Visual IQ — Pattern Progression',
        instruction: 'Which figure completes the 2×2 pattern matrix logically?',
        answer: 'Option B (Circle with 3 dots — shape stays circle, dots increase: 2 + 1 = 3)',
        hint: 'Notice how the number of dots increases from left to right in each row.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cy = y + h / 2 - 20;
          const matX = x + 80;
          const cellW = 150, cellH = 150, gap = 16;
          const matW = 2 * cellW + gap;
          const matH = 2 * cellH + gap;
          const matY = cy - matH / 2;

          drawRoundedBox(ctx, matX - 14, matY - 14, matW + 28, matH + 28, 16, '#F8FAFC', '#0F172A', 3);

          function renderCellWithDots(bx, by, shape, dotCount) {
            drawRoundedBox(ctx, bx, by, cellW, cellH, 10, '#FFFFFF', '#94A3B8', 2);
            const cx = bx + cellW / 2;
            const cy2 = by + cellH / 2;
            if (shape === 'square') {
              drawPolygon(ctx, cx, cy2, 44, 4, '#F1F5F9', '#1E3A8A', 3, Math.PI / 4);
            } else {
              drawCircle(ctx, cx, cy2, 44, '#F1F5F9', '#1E3A8A', 3);
            }
            for (let d = 0; d < dotCount; d++) {
              const dx = cx + (d - (dotCount - 1) / 2) * 20;
              drawCircle(ctx, dx, cy2, 5, '#DC2626', '#DC2626', 1);
            }
          }

          // (0,0): Square with 1 dot
          renderCellWithDots(matX, matY, 'square', 1);
          // (1,0): Square with 2 dots
          renderCellWithDots(matX + cellW + gap, matY, 'square', 2);
          // (0,1): Circle with 2 dots
          renderCellWithDots(matX, matY + cellH + gap, 'circle', 2);

          // (1,1): Question mark
          const qx = matX + cellW + gap;
          const qy = matY + cellH + gap;
          drawRoundedBox(ctx, qx, qy, cellW, cellH, 10, '#FEF2F2', '#DC2626', 3);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', qx + cellW / 2, qy + cellH / 2);

          // Options
          const optStartX = matX + matW + 80;
          const optW = 180, optH = 140, optGapX = 24, optGapY = 24;
          const opts = [
            { id: 'A', shape: 'circle', dots: 1 },
            { id: 'B', shape: 'circle', dots: 3 }, // Correct!
            { id: 'C', shape: 'square', dots: 3 },
            { id: 'D', shape: 'circle', dots: 4 }
          ];

          opts.forEach((opt, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const bx = optStartX + col * (optW + optGapX);
            const by = matY + row * (optH + optGapY + 12);
            const cx = bx + optW / 2;
            const cy2 = by + optH / 2 + 8;

            drawRoundedBox(ctx, bx, by, optW, optH, 12, '#FFFFFF', '#0F172A', 2);
            drawOptionBadge(ctx, bx + 24, by + 24, opt.id);

            if (opt.shape === 'square') {
              drawPolygon(ctx, cx, cy2, 34, 4, '#F8FAFC', '#1E3A8A', 2.5, Math.PI / 4);
            } else {
              drawCircle(ctx, cx, cy2, 34, '#F8FAFC', '#1E3A8A', 2.5);
            }
            for (let d = 0; d < opt.dots; d++) {
              const dx = cx + (d - (opt.dots - 1) / 2) * 16;
              drawCircle(ctx, dx, cy2, 4.5, '#DC2626', '#DC2626', 1);
            }
          });

          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 3. COUNT THE TRIANGLES
    // =========================================================================
    _genCountShapes: function (diff) {
      if (diff === 'easy') {
        return {
          type: 'visual-iq',
          subtype: 'count-shapes',
          difficulty: diff,
          title: 'Triangle Counting Challenge',
          instruction: 'How many total triangles are hidden in this geometrical figure?',
          answer: 'Option B (6 Triangles: 2 small top, 1 combined top, 2 bottom halves, 1 full large triangle)',
          hint: 'Count the top level triangles first (2 small + 1 combined = 3), then the full triangles down to the base.',
          renderFn: function (ctx, x, y, w, h) {
            ctx.save();
            const cx = x + w / 2;
            const cy = y + 210;

            // Frame for Diagram
            const diagW = 440, diagH = 300;
            drawRoundedBox(ctx, cx - diagW / 2, cy - diagH / 2, diagW, diagH, 16, '#F8FAFC', '#0F172A', 3);

            // Large Triangle
            const topY = cy - 110;
            const botY = cy + 110;
            const midY = (topY + botY) / 2;
            const halfBase = 150;

            ctx.strokeStyle = '#1E3A8A';
            ctx.lineWidth = 4;
            ctx.fillStyle = 'rgba(224,231,255,0.3)';

            // Outer Triangle
            ctx.beginPath();
            ctx.moveTo(cx, topY);
            ctx.lineTo(cx + halfBase, botY);
            ctx.lineTo(cx - halfBase, botY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Vertical Median from apex to base
            ctx.beginPath();
            ctx.moveTo(cx, topY);
            ctx.lineTo(cx, botY);
            ctx.stroke();

            // Horizontal Midline
            ctx.beginPath();
            ctx.moveTo(cx - halfBase / 2, midY);
            ctx.lineTo(cx + halfBase / 2, midY);
            ctx.stroke();

            // Multiple choice options below
            const optY = cy + diagH / 2 + 55;
            const optW = 160, optH = 75, gap = 24;
            const totalOptW = 4 * optW + 3 * gap;
            const optStartX = cx - totalOptW / 2;

            const opts = [
              { id: 'A', val: '4 Triangles' },
              { id: 'B', val: '6 Triangles' }, // Correct!
              { id: 'C', val: '8 Triangles' },
              { id: 'D', val: '10 Triangles' }
            ];

            opts.forEach((opt, idx) => {
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
      }

      // Medium / Hard: 8-Spoke Divided Square (16 triangles)
      return {
        type: 'visual-iq',
        subtype: 'count-shapes',
        difficulty: diff,
        title: 'Geometrical Triangle IQ',
        instruction: 'Find the total number of triangles of all sizes in this square network.',
        answer: 'Option C (16 Triangles: 8 small 1-cell, 4 corner 2-cell, and 4 large half-square diagonal triangles)',
        hint: 'Combine single adjacent segments to find larger overlapping triangles.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cx = x + w / 2;
          const cy = y + 210;

          const sqSize = 130;
          const diagW = 440, diagH = 300;
          drawRoundedBox(ctx, cx - diagW / 2, cy - diagH / 2, diagW, diagH, 16, '#F8FAFC', '#0F172A', 3);

          // Outer Square
          ctx.fillStyle = '#EFF6FF';
          ctx.strokeStyle = '#1E3A8A';
          ctx.lineWidth = 4;
          ctx.fillRect(cx - sqSize, cy - sqSize, sqSize * 2, sqSize * 2);
          ctx.strokeRect(cx - sqSize, cy - sqSize, sqSize * 2, sqSize * 2);

          // Diagonals
          ctx.beginPath();
          ctx.moveTo(cx - sqSize, cy - sqSize);
          ctx.lineTo(cx + sqSize, cy + sqSize);
          ctx.moveTo(cx + sqSize, cy - sqSize);
          ctx.lineTo(cx - sqSize, cy + sqSize);

          // Cross Bisectors
          ctx.moveTo(cx - sqSize, cy);
          ctx.lineTo(cx + sqSize, cy);
          ctx.moveTo(cx, cy - sqSize);
          ctx.lineTo(cx, cy + sqSize);
          ctx.stroke();

          // 4 Options below
          const optY = cy + diagH / 2 + 55;
          const optW = 160, optH = 75, gap = 24;
          const totalOptW = 4 * optW + 3 * gap;
          const optStartX = cx - totalOptW / 2;

          const opts = [
            { id: 'A', val: '12 Triangles' },
            { id: 'B', val: '14 Triangles' },
            { id: 'C', val: '16 Triangles' }, // Correct!
            { id: 'D', val: '18 Triangles' }
          ];

          opts.forEach((opt, idx) => {
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
      return {
        type: 'visual-iq',
        subtype: 'shape-analogy',
        difficulty: diff,
        title: 'Shape Analogy IQ Test',
        instruction: 'Figure A is to Figure B as Figure C is to [ ? ]. Which option completes the analogy?',
        answer: 'Option B (Large Square with inner Circle — inner and outer shapes swap positions)',
        hint: 'In the first pair, the inner shape becomes the outer container, and the outer shape moves inside.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cx = x + w / 2;
          const topY = y + 70;

          // Top Analogy Row: [Box 1] ➔ [Box 2]   ::   [Box 3] ➔ [ ? ]
          const boxSize = 120;
          const spacing = 40;

          function drawNestedFigure(bx, by, outerShape, innerShape) {
            drawRoundedBox(ctx, bx, by, boxSize, boxSize, 12, '#FFFFFF', '#0F172A', 2.5);
            const fcx = bx + boxSize / 2;
            const fcy = by + boxSize / 2;

            // Outer shape
            if (outerShape === 'circle') drawCircle(ctx, fcx, fcy, 42, '#EFF6FF', '#1E3A8A', 3);
            else if (outerShape === 'square') drawPolygon(ctx, fcx, fcy, 42, 4, '#EFF6FF', '#1E3A8A', 3, Math.PI / 4);
            else if (outerShape === 'triangle') drawPolygon(ctx, fcx, fcy, 42, 3, '#FEF2F2', '#DC2626', 3);

            // Inner shape
            if (innerShape === 'circle') drawCircle(ctx, fcx, fcy, 18, '#DC2626', '#DC2626', 1);
            else if (innerShape === 'square') drawPolygon(ctx, fcx, fcy, 18, 4, '#1E3A8A', '#1E3A8A', 1, Math.PI / 4);
            else if (innerShape === 'triangle') drawPolygon(ctx, fcx, fcy, 18, 3, '#059669', '#059669', 1);
          }

          // Pair 1: Circle with inner Square ➔ Square with inner Circle
          const p1X = cx - 360;
          drawNestedFigure(p1X, topY, 'circle', 'square');

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('➔', p1X + boxSize + 30, topY + boxSize / 2);

          drawNestedFigure(p1X + boxSize + 60, topY, 'square', 'circle');

          // Double Colon Divider ::
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 36px Arial';
          ctx.fillText('::', cx - 20, topY + boxSize / 2);

          // Pair 2: Triangle with inner Circle ➔ [ ? ]
          const p2X = cx + 80;
          drawNestedFigure(p2X, topY, 'triangle', 'circle');

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('➔', p2X + boxSize + 30, topY + boxSize / 2);

          // Question box
          const qbx = p2X + boxSize + 60;
          drawRoundedBox(ctx, qbx, topY, boxSize, boxSize, 12, '#FEF2F2', '#DC2626', 3);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
          ctx.fillText('?', qbx + boxSize / 2, topY + boxSize / 2);

          // Bottom Multiple Choice Options (A, B, C, D)
          const optY = topY + boxSize + 85;
          const optW = 180, optH = 150, optGap = 24;
          const totalW = 4 * optW + 3 * optGap;
          const startOptX = cx - totalW / 2;

          const options = [
            { id: 'A', outer: 'triangle', inner: 'square' },
            { id: 'B', outer: 'circle', inner: 'triangle' }, // Correct!
            { id: 'C', outer: 'square', inner: 'triangle' },
            { id: 'D', outer: 'circle', inner: 'square' }
          ];

          options.forEach((opt, idx) => {
            const bx = startOptX + idx * (optW + optGap);
            drawRoundedBox(ctx, bx, optY, optW, optH, 14, '#FFFFFF', '#0F172A', 2);
            drawOptionBadge(ctx, bx + 24, optY + 24, opt.id);

            const ocx = bx + optW / 2;
            const ocy = optY + optH / 2 + 10;

            if (opt.outer === 'circle') drawCircle(ctx, ocx, ocy, 36, '#EFF6FF', '#1E3A8A', 2.5);
            else if (opt.outer === 'square') drawPolygon(ctx, ocx, ocy, 36, 4, '#EFF6FF', '#1E3A8A', 2.5, Math.PI / 4);
            else if (opt.outer === 'triangle') drawPolygon(ctx, ocx, ocy, 36, 3, '#FEF2F2', '#DC2626', 2.5);

            if (opt.inner === 'circle') drawCircle(ctx, ocx, ocy, 15, '#DC2626', '#DC2626', 1);
            else if (opt.inner === 'square') drawPolygon(ctx, ocx, ocy, 15, 4, '#1E3A8A', '#1E3A8A', 1, Math.PI / 4);
            else if (opt.inner === 'triangle') drawPolygon(ctx, ocx, ocy, 15, 3, '#059669', '#059669', 1);
          });

          ctx.restore();
        }
      };
    },

    // =========================================================================
    // 5. SPATIAL ROTATION (NOT MIRRORED)
    // =========================================================================
    _genSpatialRotation: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'spatial-rotation',
        difficulty: diff,
        title: 'Spatial Rotation IQ Test',
        instruction: 'Which figure (A, B, C, or D) is an exact 90° clockwise rotation of the Target Figure (without flipping or mirroring)?',
        answer: 'Option B (Exact 90° clockwise rotation with the red dot preserved on the long arm)',
        hint: 'Track the direction of the red dot: when rotating 90° clockwise, top points to the right.',
        renderFn: function (ctx, x, y, w, h) {
          ctx.save();
          const cy = y + h / 2 - 20;

          // Helper to draw an L-polyomino with colored dot
          function drawLFigure(fcx, fcy, scale, rotRad, isMirrored) {
            ctx.save();
            ctx.translate(fcx, fcy);
            if (isMirrored) ctx.scale(-1, 1);
            ctx.rotate(rotRad);

            const s = scale;
            ctx.fillStyle = '#1E3A8A';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 3;

            // Vertical arm
            ctx.beginPath();
            ctx.rect(-12 * s, -45 * s, 24 * s, 90 * s);
            ctx.fill();
            ctx.stroke();

            // Horizontal base
            ctx.beginPath();
            ctx.rect(12 * s, 15 * s, 36 * s, 30 * s);
            ctx.fill();
            ctx.stroke();

            // Accent red dot on top tip
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

          drawLFigure(leftX, cy + 20, 1.15, 0, false);

          // 4 Multiple Choice Options (A, B, C, D) on the Right
          const rightX = x + 460;
          const cardW = 195, cardH = 135, gapX = 30, gapY = 24;

          const options = [
            { id: 'A', rot: Math.PI, mirror: false, label: '180°' },
            { id: 'B', rot: Math.PI / 2, mirror: false, label: '90° CW' }, // Correct!
            { id: 'C', rot: Math.PI / 2, mirror: true, label: 'Mirrored' },
            { id: 'D', rot: -Math.PI / 2, mirror: true, label: 'Mirrored' }
          ];

          options.forEach((opt, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const bx = rightX + col * (cardW + gapX);
            const by = cy - 140 + row * (cardH + gapY);

            drawRoundedBox(ctx, bx, by, cardW, cardH, 12, '#FFFFFF', '#0F172A', 2);
            drawOptionBadge(ctx, bx + 24, by + 24, opt.id);

            drawLFigure(bx + cardW / 2 + 10, by + cardH / 2 + 6, 0.75, opt.rot, opt.mirror);
          });

          ctx.restore();
        }
      };
    }
  };

})();
