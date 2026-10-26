/**
 * Visual IQ Puzzles Generator
 * Subtypes: rotation, paper-fold, cube-view, embedded-figure, counting-shapes
 * Branding: Bright Path | Royal Technologies
 */
'use strict';

window.VisualIQGenerator = (function () {

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

  // Draw an asymmetric F-shape with a target dot
  function drawAsymShape(ctx, cx, cy, scale, rotAngleRad, isMirrored) {
    ctx.save();
    ctx.translate(cx, cy);
    if (isMirrored) ctx.scale(-1, 1);
    ctx.rotate(rotAngleRad);

    const s = scale;
    ctx.fillStyle = '#1E3A8A';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;

    // F-Stem
    ctx.beginPath();
    ctx.rect(-10 * s, -40 * s, 20 * s, 80 * s);
    ctx.fill();
    ctx.stroke();

    // Top arm
    ctx.beginPath();
    ctx.rect(10 * s, -40 * s, 36 * s, 20 * s);
    ctx.fill();
    ctx.stroke();

    // Middle arm
    ctx.beginPath();
    ctx.rect(10 * s, -10 * s, 24 * s, 18 * s);
    ctx.fill();
    ctx.stroke();

    // Red dot on top arm tip
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(36 * s, -30 * s, 6 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  return {
    name: 'Visual IQ Puzzles',
    subtypes: [
      { value: 'rotation',        label: 'Spatial Rotation' },
      { value: 'paper-fold',      label: 'Paper Folding & Punching' },
      { value: 'cube-view',       label: '3D Cube Net View' },
      { value: 'embedded-figure', label: 'Embedded Figure' },
      { value: 'counting-shapes', label: 'Count the Triangles' }
    ],

    generate: function (subtype, difficulty) {
      switch (subtype) {
        case 'rotation':        return this._genRotation(difficulty);
        case 'paper-fold':      return this._genPaperFold(difficulty);
        case 'cube-view':       return this._genCubeView(difficulty);
        case 'embedded-figure': return this._genEmbedded(difficulty);
        case 'counting-shapes': return this._genCounting(difficulty);
        default:                return this._genRotation(difficulty);
      }
    },

    // ── 1. Spatial Rotation ──
    _genRotation: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'rotation',
        difficulty: diff,
        title: 'Spatial Rotation IQ Test',
        instruction: 'The target figure on the left is rotated 90° clockwise. Which option (A, B, C, D) is the exact match?',
        answer: 'Option B (90° clockwise rotation with red dot preserved)',
        hint: 'Track the top arm and red dot rotating 90° to the right (pointing downward/right).',
        renderFn: function (ctx, x, y, w, h) {
          const cy = y + h / 2 - 20;

          // Target Original Box on Left
          const leftX = x + 180;
          ctx.fillStyle = '#F8FAFC';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, leftX - 110, cy - 130, 220, 260, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('TARGET FIGURE', leftX, cy - 85);

          // Draw Original (0° rotation, normal)
          drawAsymShape(ctx, leftX, cy + 20, 1.1, 0, false);

          // 4 Options (A, B, C, D) in 2×2 grid on the right
          const rightX = x + 460;
          const cardW = 200, cardH = 140, gapX = 40, gapY = 24;
          const opts = [
            { id: 'A', rot: Math.PI, mirror: false, label: '180°' },
            { id: 'B', rot: Math.PI / 2, mirror: false, label: '90° CW' }, // Correct!
            { id: 'C', rot: -Math.PI / 2, mirror: true, label: 'Flipped' },
            { id: 'D', rot: -Math.PI / 2, mirror: false, label: '270° CW' }
          ];

          opts.forEach((opt, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const bx = rightX + col * (cardW + gapX);
            const by = cy - 130 + row * (cardH + gapY);

            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, bx, by, cardW, cardH, 12);
            ctx.fill();
            ctx.stroke();

            // Label pill
            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(opt.id, bx + 16, by + 28);

            // Draw full rotated shape in every option!
            drawAsymShape(ctx, bx + cardW / 2 + 10, by + cardH / 2 + 10, 0.7, opt.rot, opt.mirror);
          });
        }
      };
    },

    // ── 2. Paper Folding & Hole Punch ──
    _genPaperFold: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'paper-fold',
        difficulty: diff,
        title: 'Paper Folding & Punching',
        instruction: 'A square paper is folded twice (half then quarter) and a circle is punched at the corner. What does it look like unfolded?',
        answer: 'Option C (4 symmetrical punch holes arranged evenly around the center)',
        hint: 'Unfolding reflects the punch hole across both vertical and horizontal fold axes.',
        renderFn: function (ctx, x, y, w, h) {
          const topY = y + 40;

          // 3 Folding Sequence Steps at Top
          const stepW = 120, stepH = 120;
          const stepX = x + 120;

          // Step 1: Flat Square
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          ctx.strokeRect(stepX, topY, stepW, stepH);
          ctx.fillRect(stepX, topY, stepW, stepH);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('1. Square Sheet', stepX + stepW / 2, topY + stepH + 24);

          // Arrow 1
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 28px Arial';
          ctx.fillText('➔', stepX + stepW + 35, topY + stepH / 2);

          // Step 2: Half Folded
          const s2X = stepX + stepW + 70;
          ctx.fillStyle = '#E2E8F0';
          ctx.strokeRect(s2X, topY, stepW / 2, stepH);
          ctx.fillRect(s2X, topY, stepW / 2, stepH);

          // Dashed original line
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#94A3B8';
          ctx.strokeRect(s2X + stepW / 2, topY, stepW / 2, stepH);
          ctx.setLineDash([]);

          ctx.fillStyle = '#0F172A';
          ctx.fillText('2. Fold Half', s2X + stepW / 4, topY + stepH + 24);

          // Arrow 2
          ctx.fillStyle = '#64748B';
          ctx.fillText('➔', s2X + stepW + 35, topY + stepH / 2);

          // Step 3: Quarter Fold + Hole
          const s3X = s2X + stepW + 70;
          ctx.fillStyle = '#CBD5E1';
          ctx.strokeStyle = '#0F172A';
          ctx.strokeRect(s3X, topY + stepH / 2, stepW / 2, stepH / 2);
          ctx.fillRect(s3X, topY + stepH / 2, stepW / 2, stepH / 2);

          // Red Hole Punch
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(s3X + stepW / 2, topY + stepH / 2, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0F172A';
          ctx.fillText('3. Punch Hole', s3X + stepW / 4, topY + stepH + 24);

          // 4 Multiple Choice Unfolded Options (A, B, C, D) Below
          const optY = topY + 220;
          const optSize = 130;
          const gap = 45;
          const totalOptW = 4 * optSize + 3 * gap;
          const startOptX = x + (w - totalOptW) / 2;

          const unfoldedOptions = [
            { id: 'A', holes: [[20, 20]] },
            { id: 'B', holes: [[20, 20], [110, 20]] },
            { id: 'C', holes: [[65, 30], [65, 100], [30, 65], [100, 65]] }, // Correct! 4 central holes
            { id: 'D', holes: [[20, 20], [110, 20], [20, 110], [110, 110]] }
          ];

          unfoldedOptions.forEach((opt, i) => {
            const bx = startOptX + i * (optSize + gap);

            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, bx, optY, optSize, optSize, 10);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(opt.id, bx + 12, optY + 24);

            // Punch holes
            ctx.fillStyle = '#0F172A';
            opt.holes.forEach(([hx, hy]) => {
              ctx.beginPath();
              ctx.arc(bx + hx, optY + hy, 7, 0, Math.PI * 2);
              ctx.fill();
            });
          });

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Which unfolded sheet (A, B, C, D) is correct?', x + w / 2, optY + optSize + 45);
        }
      };
    },

    // ── 3. 3D Cube Net View (Fully Drawn Isometric Cube + 4 Complete Nets!) ──
    _genCubeView: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'cube-view',
        difficulty: diff,
        title: '3D Cube Net Spatial Reasoning',
        instruction: 'Which unfolded flat cross-net can be folded to form the 3D cube shown on the left?',
        answer: 'Net A (Faces with Circle ●, Star ★, and Square ■ meet at the common vertex)',
        hint: 'Identify the shared vertex where the top, front, and side faces touch.',
        renderFn: function (ctx, x, y, w, h) {
          const cy = y + h / 2 - 20;

          // 1. Draw 3D Isometric Cube on Left
          const cx = x + 190;
          const cr = 75;

          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3.5;

          // Top Face
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.moveTo(cx, cy - cr);
          ctx.lineTo(cx + cr * 0.86, cy - cr * 0.5);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - cr * 0.86, cy - cr * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Left Face
          ctx.fillStyle = '#94A3B8';
          ctx.beginPath();
          ctx.moveTo(cx - cr * 0.86, cy - cr * 0.5);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy + cr);
          ctx.lineTo(cx - cr * 0.86, cy + cr * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right Face
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cr * 0.86, cy - cr * 0.5);
          ctx.lineTo(cx + cr * 0.86, cy + cr * 0.5);
          ctx.lineTo(cx, cy + cr);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Symbols on Cube faces
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('●', cx, cy - cr * 0.5);
          ctx.fillText('★', cx - cr * 0.45, cy + cr * 0.25);
          ctx.fillText('■', cx + cr * 0.45, cy + cr * 0.25);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.fillText('TARGET CUBE', cx, cy + cr + 45);

          // 2. Actually Draw 4 Full Cross Nets (A, B, C, D) on the Right!
          const startNetX = x + 440;
          const sq = 26; // net square size

          function drawCrossNet(nx, ny, topSym, leftSym, rightSym) {
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 1.8;

            // 4 vertical squares
            for (let r = 0; r < 4; r++) {
              ctx.fillRect(nx + sq, ny + r * sq, sq, sq);
              ctx.strokeRect(nx + sq, ny + r * sq, sq, sq);
            }
            // 2 side wings (row 1)
            ctx.fillRect(nx, ny + sq, sq, sq);
            ctx.strokeRect(nx, ny + sq, sq, sq);
            ctx.fillRect(nx + sq * 2, ny + sq, sq, sq);
            ctx.strokeRect(nx + sq * 2, ny + sq, sq, sq);

            // Symbols
            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (topSym) ctx.fillText(topSym, nx + sq + sq / 2, ny + sq / 2);
            if (leftSym) ctx.fillText(leftSym, nx + sq / 2, ny + sq + sq / 2);
            if (rightSym) ctx.fillText(rightSym, nx + sq + sq / 2, ny + sq + sq / 2);
          }

          const netConfigs = [
            { id: 'A', top: '●', left: '★', right: '■' }, // Correct!
            { id: 'B', top: '■', left: '●', right: '★' },
            { id: 'C', top: '★', left: '■', right: '●' },
            { id: 'D', top: '●', left: '■', right: '★' }
          ];

          netConfigs.forEach((net, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const bx = startNetX + col * 230;
            const by = cy - 140 + row * 160;

            // Option card
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = 2;
            safeRoundRect(ctx, bx, by, 200, 140, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(net.id, bx + 14, by + 26);

            // Draw the actual net
            drawCrossNet(bx + 75, by + 16, net.top, net.left, net.right);
          });
        }
      };
    },

    // ── 4. Embedded Figure ──
    _genEmbedded: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'embedded-figure',
        difficulty: diff,
        title: 'Hidden Embedded Figure',
        instruction: 'The simple target shape (X) is hidden completely inside the complex figure on the right. Can you spot it?',
        answer: 'Located in the upper-right section of the grid (connecting rows 1 & 2)',
        hint: 'Look for an exact match of the square containing the central diagonal and cross.',
        renderFn: function (ctx, x, y, w, h) {
          const cy = y + h / 2 - 20;

          // Target simple shape on left
          const leftX = x + 180;
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 4;
          ctx.strokeRect(leftX - 60, cy - 60, 120, 120);

          ctx.beginPath();
          ctx.moveTo(leftX - 60, cy);
          ctx.lineTo(leftX + 60, cy);
          ctx.moveTo(leftX, cy - 60);
          ctx.lineTo(leftX, cy + 60);
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Target Shape (X)', leftX, cy + 95);

          // Complex figure on right
          const rightX = x + 440;
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
              const bx = rightX + i * 80;
              const by = cy - 120 + j * 80;
              ctx.strokeRect(bx, by, 80, 80);
              if ((i + j) % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + 80, by + 80);
                ctx.stroke();
              }
              if (i === 2 && j === 0) {
                // Embedded cross
                ctx.beginPath();
                ctx.moveTo(bx, by + 40);
                ctx.lineTo(bx + 80, by + 40);
                ctx.moveTo(bx + 40, by);
                ctx.lineTo(bx + 40, by + 80);
                ctx.stroke();
              }
            }
          }

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Complex Line Network', rightX + 160, cy + 150);
        }
      };
    },

    // ── 5. Counting Shapes ──
    _genCounting: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'counting-shapes',
        difficulty: diff,
        title: 'Count All Triangles Challenge',
        instruction: 'How many total triangles can you find in this geometrical figure? (Include overlapping sizes)',
        answer: '16 Triangles (8 small 1-cell, 4 medium 2-cell, 4 large quadrant triangles)',
        hint: 'Count the single-cell triangles first (8), then combine adjacent pairs (4), then quadrants (4).',
        renderFn: function (ctx, x, y, w, h) {
          const cx = x + w / 2;
          const cy = y + h / 2 - 30;
          const size = 180;

          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 4;
          ctx.fillStyle = '#F8FAFC';

          // Outer square
          ctx.strokeRect(cx - size, cy - size, size * 2, size * 2);
          ctx.fillRect(cx - size, cy - size, size * 2, size * 2);

          // Diagonals
          ctx.beginPath();
          ctx.moveTo(cx - size, cy - size);
          ctx.lineTo(cx + size, cy + size);
          ctx.moveTo(cx + size, cy - size);
          ctx.lineTo(cx - size, cy + size);

          // Medians (cross)
          ctx.moveTo(cx - size, cy);
          ctx.lineTo(cx + size, cy);
          ctx.moveTo(cx, cy - size);
          ctx.lineTo(cx, cy + size);
          ctx.stroke();

          // Options A, B, C, D at bottom
          const opts = ['A) 12', 'B) 16', 'C) 18', 'D) 24'];
          opts.forEach((opt, idx) => {
            const bx = cx - 270 + idx * 140;
            const by = cy + size + 35;

            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, bx, by, 120, 50, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(opt, bx + 60, by + 32);
          });
        }
      };
    }
  };

})();
