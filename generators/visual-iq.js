/**
 * Visual IQ Puzzles Generator
 * Subtypes: rotation, paper-fold, cube-view, embedded-figure, counting-shapes
 * Mathematics Marvels | Royal Technologies
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

  return {
    name: 'Visual IQ Puzzles',
    subtypes: [
      { value: 'rotation',        label: 'Spatial Rotation' },
      { value: 'paper-fold',      label: 'Paper Folding & Punching' },
      { value: 'cube-view',       label: '3D Cube Net View' },
      { value: 'embedded-figure', label: 'Embedded Figure' },
      { value: 'counting-shapes', label: 'Count the Triangles/Squares' }
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
        instruction: 'Figure A is rotated 90° clockwise. Which of the options (A, B, C, D) is the correct matching figure?',
        answer: 'Option B is the exact 90° clockwise rotation.',
        hint: 'Track the orientation of the longest arm during the rotation.',
        renderFn: function (ctx, x, y, w, h) {
          const leftX = x + 160;
          const cy = y + h / 2 - 30;

          // Original Card
          ctx.strokeStyle = '#0F172A';
          ctx.fillStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, leftX - 80, cy - 80, 160, 160, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('ORIGINAL (A)', leftX, cy - 95);

          // L-shape with circle in original
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(leftX - 35, cy - 35, 22, 65);
          ctx.fillRect(leftX - 35, cy + 10, 55, 20);
          ctx.beginPath();
          ctx.arc(leftX + 25, cy - 20, 10, 0, Math.PI * 2);
          ctx.fill();

          // 4 Options on right (neutral styling)
          const rightStartX = x + w - 380;
          const options = ['A', 'B', 'C', 'D'];
          options.forEach((opt, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const ox = rightStartX + col * 150;
            const oy = cy - 80 + row * 150;

            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            ctx.fillStyle = '#FFFFFF';
            safeRoundRect(ctx, ox, oy, 120, 120, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(opt, ox + 60, oy + 25);

            // Shape representation
            ctx.fillStyle = (opt === 'B') ? '#DC2626' : '#1E3A8A';
            if (opt === 'A') {
              ctx.fillRect(ox + 35, oy + 40, 20, 50);
            } else if (opt === 'B') {
              // 90 deg clockwise
              ctx.fillRect(ox + 30, oy + 45, 60, 20);
              ctx.fillRect(ox + 30, oy + 45, 20, 45);
            } else if (opt === 'C') {
              // Flipped
              ctx.fillRect(ox + 50, oy + 40, 20, 50);
              ctx.fillRect(ox + 25, oy + 70, 45, 20);
            } else {
              ctx.fillRect(ox + 30, oy + 65, 55, 20);
            }
          });
        }
      };
    },

    // ── 2. Paper Folding ──
    _genPaperFold: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'paper-fold',
        difficulty: diff,
        title: 'Paper Folding & Punching',
        instruction: 'A square sheet of paper is folded in half twice and punched at the outer corner. What does it look like unfolded?',
        answer: 'Option C: 4 symmetrical punch holes arranged around the center of the sheet.',
        hint: 'Unfolding reflects the hole across both vertical and horizontal fold axes.',
        renderFn: function (ctx, x, y, w, h) {
          const cy = y + h / 2 - 20;
          const startX = x + 80;

          // Step 1: Flat paper
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          ctx.fillStyle = '#F8FAFC';
          ctx.strokeRect(startX, cy - 70, 140, 140);
          ctx.fillRect(startX, cy - 70, 140, 140);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 18px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('1. Square Sheet', startX + 70, cy + 100);

          // Arrow
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('➔', startX + 185, cy);

          // Step 2: Folded
          const fX = startX + 230;
          ctx.strokeRect(fX, cy - 70, 70, 140);
          ctx.fillText('2. Fold', fX + 35, cy + 100);

          // Arrow
          ctx.fillText('➔', fX + 115, cy);

          // Step 3: Punched
          const pX = fX + 160;
          ctx.strokeRect(pX, cy - 35, 70, 70);
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(pX + 35, cy, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.fillText('3. Punch Hole', pX + 35, cy + 100);

          // Target prompt
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 44px Arial';
          ctx.fillText('? Unfolded', x + w - 160, cy);
        }
      };
    },

    // ── 3. Cube Net ──
    _genCubeView: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'cube-view',
        difficulty: diff,
        title: '3D Isometric Cube Net',
        instruction: 'Which unfolded cross-net can be folded to form the 3D cube displayed on the left?',
        answer: 'Net A matches the adjacent face orientations.',
        hint: 'Opposite faces in the flat net never touch or share an edge on the folded cube.',
        renderFn: function (ctx, x, y, w, h) {
          const cx = x + 240;
          const cy = y + h / 2 - 20;

          // 3D Isometric Cube
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          // Top face
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 80);
          ctx.lineTo(cx + 70, cy - 40);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - 70, cy - 40);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Left face
          ctx.fillStyle = '#94A3B8';
          ctx.beginPath();
          ctx.moveTo(cx - 70, cy - 40);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy + 80);
          ctx.lineTo(cx - 70, cy + 40);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right face
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + 70, cy - 40);
          ctx.lineTo(cx + 70, cy + 40);
          ctx.lineTo(cx, cy + 80);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Symbols
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 28px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('●', cx, cy - 40);
          ctx.fillText('▲', cx - 35, cy + 30);
          ctx.fillText('■', cx + 35, cy + 30);

          // Prompt on right
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillText('Identify the matching folded Net:', x + w - 280, cy - 30);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 50px Arial';
          ctx.fillText('( Net A / B / C / D )', x + w - 280, cy + 35);
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
        instruction: 'The simple target shape (X) is hidden completely inside the complex figure. Can you locate it?',
        answer: 'Located in the upper-right section of the complex matrix.',
        hint: 'The hidden shape maintains the exact same orientation without rotation.',
        renderFn: function (ctx, x, y, w, h) {
          const leftX = x + 180;
          const cy = y + h / 2 - 20;

          // Target simple shape
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 4;
          ctx.strokeRect(leftX - 60, cy - 60, 120, 120);

          ctx.beginPath();
          ctx.moveTo(leftX - 60, cy);
          ctx.lineTo(leftX + 60, cy);
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 22px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Target Shape (X)', leftX, cy + 95);

          // Complex figure on right
          const rightX = x + w - 300;
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;

          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
              const bx = rightX - 120 + i * 70;
              const by = cy - 100 + j * 70;
              ctx.strokeRect(bx, by, 70, 70);
              if ((i + j) % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + 70, by + 70);
                ctx.stroke();
              }
            }
          }
        }
      };
    },

    // ── 5. Counting Shapes ──
    _genCounting: function (diff) {
      return {
        type: 'visual-iq',
        subtype: 'counting-shapes',
        difficulty: diff,
        title: 'Count All Triangles',
        instruction: 'How many total triangles can you find in this geometrical figure? (Include overlapping sizes)',
        answer: '16 Triangles (8 small 1-cell, 4 medium 2-cell, 4 large quadrant triangles)',
        hint: 'Count the single-cell triangles first, then combine adjacent pairs.',
        renderFn: function (ctx, x, y, w, h) {
          const cx = x + w / 2;
          const cy = y + h / 2 - 20;
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

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 34px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Total Triangles = ?', cx, cy + size + 45);
        }
      };
    }
  };

})();
