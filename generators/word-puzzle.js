/**
 * Word & Rebus Puzzles Generator
 * Subtypes: anagram, word-chain, rebus, missing-letter, word-analogy
 * Mathematics Marvels | Royal Technologies
 */
'use strict';

window.WordPuzzleGenerator = (function () {

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
    name: 'Word & Rebus Puzzles',
    subtypes: [
      { value: 'anagram',        label: 'Letter Tile Anagram' },
      { value: 'word-chain',     label: 'Word Ladder Chain' },
      { value: 'rebus',          label: 'Visual Rebus Riddle' },
      { value: 'missing-letter', label: 'Missing Letter Clue' },
      { value: 'word-analogy',   label: 'Word Analogy' }
    ],

    generate: function (subtype, difficulty) {
      switch (subtype) {
        case 'anagram':        return this._genAnagram(difficulty);
        case 'word-chain':     return this._genWordChain(difficulty);
        case 'rebus':          return this._genRebus(difficulty);
        case 'missing-letter': return this._genMissingLetter(difficulty);
        case 'word-analogy':   return this._genAnalogy(difficulty);
        default:               return this._genAnagram(difficulty);
      }
    },

    // ── 1. Anagram ──
    _genAnagram: function (diff) {
      const words = [
        { scram: ['G', 'E', 'O', 'M', 'E', 'T', 'R', 'Y'], sol: 'GEOMETRY', hint: 'Branch of math dealing with points, lines, angles and shapes' },
        { scram: ['T', 'R', 'I', 'A', 'N', 'G', 'L', 'E'], sol: 'TRIANGLE', hint: 'Three-sided polygon whose angles sum to 180°' },
        { scram: ['F', 'R', 'A', 'C', 'T', 'I', 'O', 'N'], sol: 'FRACTION', hint: 'Numerical quantity that is not a whole number' },
        { scram: ['E', 'Q', 'U', 'A', 'T', 'I', 'O', 'N'], sol: 'EQUATION', hint: 'Mathematical statement that two expressions are equal' },
        { scram: ['P', 'O', 'L', 'Y', 'G', 'O', 'N'],     sol: 'POLYGON',  hint: 'Closed 2D shape with straight sides' },
        { scram: ['A', 'L', 'G', 'E', 'B', 'R', 'A'],     sol: 'ALGEBRA',  hint: 'Branch of math using letters and symbols' }
      ];
      const pick = words[Math.floor(Math.random() * words.length)];

      return {
        type: 'word-puzzle',
        subtype: 'anagram',
        difficulty: diff,
        title: 'Letter Tile Anagram',
        instruction: 'Rearrange all the letter tiles to form a fundamental mathematical term.',
        answer: pick.sol,
        hint: pick.hint,
        renderFn: function (ctx, x, y, w, h) {
          const letters = pick.scram;
          const tileSize = Math.min(90, Math.floor((w - 60) / letters.length) - 12);
          const gap = 12;
          const totalW = letters.length * tileSize + (letters.length - 1) * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 40;

          letters.forEach((letter, i) => {
            const bx = startX + i * (tileSize + gap);

            // Tile card
            ctx.fillStyle = '#FEF3C7';
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy, tileSize, tileSize, 12);
            ctx.fill();
            ctx.stroke();

            // Letter
            ctx.fillStyle = '#78350F';
            ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, bx + tileSize / 2, cy + tileSize / 2);
          });

          // Clue text
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💡 Clue: ' + pick.hint, x + w / 2, cy + tileSize + 70);
        }
      };
    },

    // ── 2. Word Chain / Ladder ──
    _genWordChain: function (diff) {
      const ladders = [
        { steps: ['COLD', 'CORD', '????', 'WARM'], missing: 'CARD', sol: 'COLD ➔ CORD ➔ CARD ➔ WARD ➔ WARM' },
        { steps: ['HEAD', 'HEAL', '????', 'TELL'], missing: 'TEAL', sol: 'HEAD ➔ HEAL ➔ TEAL ➔ TELL' },
        { steps: ['LINE', 'LONE', '????', 'CONE'], missing: 'CONE', sol: 'LINE ➔ LONE ➔ BONE ➔ CONE' }
      ];
      const lad = ladders[Math.floor(Math.random() * ladders.length)];

      return {
        type: 'word-puzzle',
        subtype: 'word-chain',
        difficulty: diff,
        title: 'Word Ladder Puzzle',
        instruction: 'Change exactly one letter at each step to bridge from start word to goal word.',
        answer: lad.sol,
        hint: 'Each step must be a valid English dictionary word.',
        renderFn: function (ctx, x, y, w, h) {
          const steps = lad.steps;
          const boxW = 160, boxH = 90, gap = 20;
          const totalW = steps.length * boxW + (steps.length - 1) * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 30;

          steps.forEach((st, idx) => {
            const bx = startX + idx * (boxW + gap);
            const isTarget = (st === '????');

            ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isTarget ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy, boxW, boxH, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isTarget ? '#DC2626' : '#0F172A';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(st, bx + boxW / 2, cy + boxH / 2);

            if (idx < steps.length - 1) {
              ctx.fillStyle = '#64748B';
              ctx.font = 'bold 32px Arial';
              ctx.fillText('➔', bx + boxW + gap / 2, cy + boxH / 2);
            }
          });
        }
      };
    },

    // ── 3. Rebus Riddle ──
    _genRebus: function (diff) {
      return {
        type: 'word-puzzle',
        subtype: 'rebus',
        difficulty: diff,
        title: 'Visual Rebus Word Riddle',
        instruction: 'Decipher the positional word placement to uncover the hidden common English expression.',
        answer: '"I UNDERSTAND" (The word STAND is placed physically over I)',
        hint: 'Look closely at which word is over or under the other.',
        renderFn: function (ctx, x, y, w, h) {
          const cx = x + w / 2;
          const cy = y + h / 2 - 30;

          // Box container
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, cx - 220, cy - 110, 440, 220, 16);
          ctx.fill();
          ctx.stroke();

          // Top: STAND
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 54px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('STAND', cx, cy - 25);

          // Divider bar
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx - 140, cy + 5);
          ctx.lineTo(cx + 140, cy + 5);
          ctx.stroke();

          // Bottom: I
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 44px Arial';
          ctx.fillText('I', cx, cy + 55);
        }
      };
    },

    // ── 4. Missing Letter ──
    _genMissingLetter: function (diff) {
      const items = [
        { letters: ['R', 'A', '?', 'I', 'U', 'S'], ans: 'RADIUS', clue: 'Distance from circle center to boundary' },
        { letters: ['A', '?', 'G', 'L', 'E'],      ans: 'ANGLE',  clue: 'Figure formed by two rays sharing a vertex' },
        { letters: ['P', 'R', '?', 'S', 'M'],      ans: 'PRISM',  clue: 'Solid 3D geometric figure with flat faces' }
      ];
      const it = items[Math.floor(Math.random() * items.length)];

      return {
        type: 'word-puzzle',
        subtype: 'missing-letter',
        difficulty: diff,
        title: 'Missing Letter Clue',
        instruction: `Find the missing letter (?) to complete the geometry term: "${it.clue}"`,
        answer: it.ans,
        hint: it.clue,
        renderFn: function (ctx, x, y, w, h) {
          const letters = it.letters;
          const size = 90;
          const gap = 16;
          const totalW = letters.length * size + (letters.length - 1) * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 40;

          letters.forEach((l, i) => {
            const bx = startX + i * (size + gap);
            const isQ = (l === '?');

            ctx.fillStyle = isQ ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy, size, size, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(l, bx + size / 2, cy + size / 2);
          });
        }
      };
    },

    // ── 5. Word Analogy ──
    _genAnalogy: function (diff) {
      return {
        type: 'word-puzzle',
        subtype: 'word-analogy',
        difficulty: diff,
        title: 'Dimensional Word Analogy',
        instruction: 'Complete the proportional geometric analogy based on spatial dimensions.',
        answer: 'C) VOLUME (Square is 2D area, Cube is 3D volume)',
        hint: 'Square represents 2-dimensional area, while Cube represents 3 dimensions.',
        renderFn: function (ctx, x, y, w, h) {
          const cx = x + w / 2;
          const cy = y + 100;

          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.fillText('SQUARE  :  AREA   ::   CUBE  :  ?', cx, cy);

          // Options A, B, C, D (neutral styling, answer not revealed on canvas!)
          const opts = ['A) Side', 'B) Perimeter', 'C) Volume', 'D) Degree'];
          opts.forEach((opt, idx) => {
            const ox = x + 160 + (idx % 2) * 350;
            const oy = cy + 90 + Math.floor(idx / 2) * 80;

            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, ox, oy, 300, 60, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(opt, ox + 25, oy + 38);
          });
        }
      };
    }
  };

})();
