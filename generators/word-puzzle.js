/**
 * Word & Rebus Puzzles Generator
 * Subtypes: anagram, word-chain, rebus, missing-letter, word-analogy
 */
'use strict';

window.WordPuzzleGenerator = {
  name: 'Word & Rebus Puzzles',
  subtypes: [
    { value: 'anagram',        label: 'Letter Tile Anagram' },
    { value: 'word-chain',     label: 'Word Ladder Chain' },
    { value: 'rebus',          label: 'Visual Rebus Riddle' },
    { value: 'missing-letter', label: 'Missing Letter Clue' },
    { value: 'word-analogy',   label: 'Word Analogy' }
  ],

  generate(subtype, difficulty) {
    switch (subtype) {
      case 'anagram': return this._genAnagram(difficulty);
      case 'word-chain': return this._genWordChain(difficulty);
      case 'rebus': return this._genRebus(difficulty);
      case 'missing-letter': return this._genMissingLetter(difficulty);
      case 'word-analogy': return this._genAnalogy(difficulty);
      default: return this._genAnagram(difficulty);
    }
  },

  _genAnagram(diff) {
    const words = [
      { scram: ['E', 'P', 'A', 'N', 'L', 'T'], sol: 'PLANET', hint: 'Celestial body in orbit' },
      { scram: ['G', 'E', 'O', 'M', 'E', 'T'], sol: 'GEOMETRY', hint: 'Branch of mathematics with angles and shapes' },
      { scram: ['T', 'R', 'I', 'N', 'A', 'G'], sol: 'RATING / GARNIT', hint: 'Three-sided polygon' }
    ];
    const pick = { scram: ['G', 'E', 'O', 'M', 'E', 'T', 'R', 'Y'], sol: 'GEOMETRY', hint: 'Mathematical study of shapes and sizes' };

    return {
      type: 'word-puzzle',
      subtype: 'anagram',
      difficulty: diff,
      title: 'Word Tile Anagram',
      instruction: 'Rearrange all the wooden letter tiles to reveal the hidden mathematical or scientific word.',
      answer: pick.sol,
      hint: pick.hint,
      renderFn: (ctx, x, y, w, h) => {
        const letters = pick.scram;
        const tileSize = 85;
        const gap = 16;
        const totalW = letters.length * tileSize + (letters.length - 1) * gap;
        const startX = x + (w - totalW) / 2;
        const cy = y + h / 2 - 40;

        letters.forEach((letter, i) => {
          const bx = startX + i * (tileSize + gap);
          // Wooden style tile
          ctx.fillStyle = '#FEF3C7';
          ctx.strokeStyle = '#B45309';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(bx, cy, tileSize, tileSize, 12);
          ctx.fill();
          ctx.stroke();

          // Letter
          ctx.fillStyle = '#78350F';
          ctx.font = 'bold 46px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(letter, bx + tileSize / 2, cy + tileSize / 2);
        });

        // Prompt
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Clue: ' + pick.hint, x + w / 2, cy + tileSize + 60);
      }
    };
  },

  _genWordChain(diff) {
    return {
      type: 'word-puzzle',
      subtype: 'word-chain',
      difficulty: diff,
      title: 'Word Ladder Puzzle',
      instruction: 'Change one letter at each step to transform the start word into the goal word.',
      answer: 'COLD ➔ CORD ➔ CARD ➔ WARD ➔ WARM',
      hint: 'Each step must be a valid English word.',
      renderFn: (ctx, x, y, w, h) => {
        const steps = ['COLD', 'CORD', '????', 'WARM'];
        const boxW = 160, boxH = 90, gap = 20;
        const totalW = steps.length * boxW + (steps.length - 1) * gap;
        const startX = x + (w - totalW) / 2;
        const cy = y + h / 2 - 40;

        steps.forEach((st, idx) => {
          const bx = startX + idx * (boxW + gap);
          const isTarget = (st === '????');

          ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
          ctx.strokeStyle = isTarget ? '#DC2626' : '#1E3A8A';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(bx, cy, boxW, boxH, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isTarget ? '#DC2626' : '#1E3A8A';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(st, bx + boxW / 2, cy + boxH / 2);

          if (idx < steps.length - 1) {
            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 28px Arial';
            ctx.fillText('➔', bx + boxW + gap / 2, cy + boxH / 2);
          }
        });
      }
    };
  },

  _genRebus(diff) {
    return {
      type: 'word-puzzle',
      subtype: 'rebus',
      difficulty: diff,
      title: 'Visual Rebus Riddle',
      instruction: 'Decipher the visual symbols and word placement to identify the common English phrase.',
      answer: '"STAND UNDER" or "UNDERSTAND" (Word Stand placed over Understand)',
      hint: 'Look closely at the position of the words relative to each other.',
      renderFn: (ctx, x, y, w, h) => {
        const cx = x + w / 2;
        const cy = y + h / 2 - 30;

        // Container
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cx - 240, cy - 120, 480, 240, 16);
        ctx.fill();
        ctx.stroke();

        // Top word
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 54px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('STAND', cx, cy - 30);

        // Divider
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 160, cy);
        ctx.lineTo(cx + 160, cy);
        ctx.stroke();

        // Bottom word
        ctx.fillStyle = '#1E3A8A';
        ctx.font = 'bold 44px Arial';
        ctx.fillText('I', cx, cy + 50);
      }
    };
  },

  _genMissingLetter(diff) {
    return {
      type: 'word-puzzle',
      subtype: 'missing-letter',
      difficulty: diff,
      title: 'Missing Letter Equation',
      instruction: 'Fill in the blank letters to spell out an important geometry concept.',
      answer: 'RADIUS',
      hint: 'Distance from the center of a circle to any point on its circumference.',
      renderFn: (ctx, x, y, w, h) => {
        const letters = ['R', 'A', '?', 'I', 'U', 'S'];
        const size = 90;
        const gap = 16;
        const totalW = letters.length * size + (letters.length - 1) * gap;
        const startX = x + (w - totalW) / 2;
        const cy = y + h / 2 - 40;

        letters.forEach((l, i) => {
          const bx = startX + i * (size + gap);
          const isQ = (l === '?');

          ctx.fillStyle = isQ ? '#FEF2F2' : '#FFFFFF';
          ctx.strokeStyle = isQ ? '#DC2626' : '#1E3A8A';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(bx, cy, size, size, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isQ ? '#DC2626' : '#1E3A8A';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(l, bx + size / 2, cy + size / 2);
        });
      }
    };
  },

  _genAnalogy(diff) {
    return {
      type: 'word-puzzle',
      subtype: 'word-analogy',
      difficulty: diff,
      title: 'Mathematical Word Analogy',
      instruction: 'Complete the proportional analogy based on geometric dimensional relationships.',
      answer: 'C) VOLUME (Length is 1D, Area is 2D, Volume is 3D)',
      hint: 'Square represents 2-dimensional area, while Cube represents 3 dimensions.',
      renderFn: (ctx, x, y, w, h) => {
        const cx = x + w / 2;
        const cy = y + 100;

        ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#1E3A8A';
        ctx.textAlign = 'center';
        ctx.fillText('SQUARE  :  AREA   ::   CUBE  :  ?', cx, cy);

        // Options A, B, C, D
        const opts = ['A) Side', 'B) Perimeter', 'C) Volume', 'D) Degree'];
        opts.forEach((opt, idx) => {
          const ox = x + 160 + (idx % 2) * 360;
          const oy = cy + 90 + Math.floor(idx / 2) * 80;

          ctx.fillStyle = (idx === 2) ? '#FEF2F2' : '#FFFFFF';
          ctx.strokeStyle = (idx === 2) ? '#DC2626' : '#94A3B8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(ox, oy, 300, 60, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = (idx === 2) ? '#DC2626' : '#0F172A';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(opt, ox + 25, oy + 38);
        });
      }
    };
  }
};
