/**
 * Word & Rebus Puzzles Generator
 * Subtypes: anagram, word-chain, rebus, missing-letter, word-analogy
 * Branding: Bright Path | Royal Technologies
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

  // Fisher-Yates shuffle that is GUARANTEED not to equal the original word
  function scramble(word) {
    const letters = word.split('');
    for (let attempt = 0; attempt < 30; attempt++) {
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = letters[i];
        letters[i] = letters[j];
        letters[j] = temp;
      }
      if (letters.join('') !== word) {
        return letters;
      }
    }
    // Guaranteed fallback swap if needed
    letters.reverse();
    return letters;
  }

  // Scrabble-style letter points
  const LETTER_POINTS = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1,
    M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
    Y: 4, Z: 10
  };

  const WORD_BANK = [
    { word: 'TRIANGLE',   hint: 'Three-sided polygon whose interior angles sum to 180°' },
    { word: 'GEOMETRY',   hint: 'Branch of mathematics dealing with spatial relationships and shapes' },
    { word: 'FRACTION',   hint: 'Numerical representation of a part of a whole (numerator / denominator)' },
    { word: 'EQUATION',   hint: 'Mathematical statement asserting the equality of two expressions' },
    { word: 'POLYGON',    hint: 'Closed two-dimensional figure bounded by straight line segments' },
    { word: 'ALGEBRA',    hint: 'Branch of mathematics dealing with symbols and the rules for manipulating them' },
    { word: 'SYMMETRY',   hint: 'Balanced proportions and invariance under reflection or rotation' },
    { word: 'DIAMETER',   hint: 'Straight line passing from side to side through the center of a circle' },
    { word: 'PARALLEL',   hint: 'Lines in a plane that never meet or intersect however far extended' },
    { word: 'EXPONENT',   hint: 'Quantity representing the power to which a base number is raised' },
    { word: 'VARIABLE',   hint: 'Symbol representing a quantity that can assume any of a set of values' },
    { word: 'CYLINDER',   hint: 'Solid geometrical figure with straight parallel sides and circular ends' }
  ];

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

    // ── 1. Anagram (Guaranteed Scrambled + Balanced Full Card) ──
    _genAnagram: function (diff) {
      const pick = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
      const scrambledTiles = scramble(pick.word);

      return {
        type: 'word-puzzle',
        subtype: 'anagram',
        difficulty: diff,
        title: 'Mathematical Anagram',
        instruction: 'Unscramble the wooden letter tiles below to reveal the hidden mathematical term.',
        answer: pick.word,
        hint: pick.hint,
        renderFn: function (ctx, x, y, w, h) {
          const cy = y + h / 2 - 10;

          // 1. Rack Container Banner
          const rackW = w - 80;
          const rackH = 260;
          const rackX = x + 40;
          const rackY = cy - 130;

          // Wooden style rack background
          ctx.save();
          ctx.fillStyle = '#FDF6E2';
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, rackX, rackY, rackW, rackH, 18);
          ctx.fill();
          ctx.stroke();

          // Header label on rack
          ctx.fillStyle = '#92400E';
          ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🔤 SCRAMBLED LETTER TILES', rackX + rackW / 2, rackY + 45);

          // 2. Letter Tiles
          const count = scrambledTiles.length;
          const maxTile = 84;
          const tileSize = Math.min(maxTile, Math.floor((rackW - 60) / count) - 12);
          const gap = Math.min(16, Math.floor((rackW - count * tileSize) / (count + 1)));
          const totalW = count * tileSize + (count - 1) * gap;
          const startX = rackX + (rackW - totalW) / 2;
          const tileY = rackY + 85;

          scrambledTiles.forEach((letter, i) => {
            const bx = startX + i * (tileSize + gap);

            // Tile Drop Shadow
            ctx.fillStyle = 'rgba(180, 83, 9, 0.25)';
            safeRoundRect(ctx, bx + 3, tileY + 4, tileSize, tileSize, 12);
            ctx.fill();

            // Tile Base (Warm Scrabble Wood)
            ctx.fillStyle = '#FEF3C7';
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, tileY, tileSize, tileSize, 12);
            ctx.fill();
            ctx.stroke();

            // Letter
            ctx.fillStyle = '#78350F';
            ctx.font = 'bold 44px "Arial Black", Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, bx + tileSize / 2, tileY + tileSize / 2 - 3);

            // Subscript point
            const pt = LETTER_POINTS[letter] || 1;
            ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
            ctx.fillStyle = '#B45309';
            ctx.textAlign = 'right';
            ctx.fillText(String(pt), bx + tileSize - 8, tileY + tileSize - 8);
          });
          ctx.restore();

          // 3. Target Empty Answer Slots below rack
          const slotY = cy + 160;
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Target Word (${count} Letters):`, x + w / 2, slotY - 20);

          const slotSize = Math.min(48, tileSize * 0.7);
          const slotGap = 10;
          const totalSlotW = count * slotSize + (count - 1) * slotGap;
          const startSlotX = x + (w - totalSlotW) / 2;

          for (let s = 0; s < count; s++) {
            const sx = startSlotX + s * (slotSize + slotGap);
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 4]);
            safeRoundRect(ctx, sx, slotY, slotSize, slotSize, 8);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // 4. Clue text at bottom
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💡 Clue: ' + pick.hint, x + w / 2, slotY + slotSize + 55);
        }
      };
    },

    // ── 2. Word Chain ──
    _genWordChain: function (diff) {
      const ladders = [
        { steps: ['COLD', 'CORD', '????', 'WARM'], missing: 'CARD', sol: 'COLD ➔ CORD ➔ CARD ➔ WARD ➔ WARM' },
        { steps: ['HEAD', 'HEAL', '????', 'TELL'], missing: 'TEAL', sol: 'HEAD ➔ HEAL ➔ TEAL ➔ TELL' },
        { steps: ['LINE', 'LONE', '????', 'CONE'], missing: 'BONE', sol: 'LINE ➔ LONE ➔ BONE ➔ CONE' }
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
          const cy = y + h / 2 - 20;
          const steps = lad.steps;
          const boxW = 160, boxH = 95, gap = 20;
          const totalW = steps.length * boxW + (steps.length - 1) * gap;
          const startX = x + (w - totalW) / 2;

          steps.forEach((st, idx) => {
            const bx = startX + idx * (boxW + gap);
            const isTarget = (st === '????');

            ctx.fillStyle = isTarget ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isTarget ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy - boxH / 2, boxW, boxH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isTarget ? '#DC2626' : '#0F172A';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(st, bx + boxW / 2, cy);

            if (idx < steps.length - 1) {
              ctx.fillStyle = '#64748B';
              ctx.font = 'bold 32px Arial';
              ctx.fillText('➔', bx + boxW + gap / 2, cy);
            }
          });

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Find the missing intermediate 4-letter word (?)', x + w / 2, cy + boxH + 40);
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
          const cy = y + h / 2 - 20;

          // Box container
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, cx - 220, cy - 120, 440, 240, 16);
          ctx.fill();
          ctx.stroke();

          // Top: STAND
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 58px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('STAND', cx, cy - 30);

          // Divider bar
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx - 150, cy + 5);
          ctx.lineTo(cx + 150, cy + 5);
          ctx.stroke();

          // Bottom: I
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 46px Arial';
          ctx.fillText('I', cx, cy + 60);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
          ctx.fillText('What common phrase does this represent?', cx, cy + 180);
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
          const cy = y + h / 2 - 30;
          const letters = it.letters;
          const size = 90;
          const gap = 16;
          const totalW = letters.length * size + (letters.length - 1) * gap;
          const startX = x + (w - totalW) / 2;

          letters.forEach((l, i) => {
            const bx = startX + i * (size + gap);
            const isQ = (l === '?');

            ctx.fillStyle = isQ ? '#FEF2F2' : '#FFFFFF';
            ctx.strokeStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.lineWidth = 3;
            safeRoundRect(ctx, bx, cy - size / 2, size, size, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isQ ? '#DC2626' : '#0F172A';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(l, bx + size / 2, cy);
          });

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💡 Definition: ' + it.clue, x + w / 2, cy + 120);
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
          const cy = y + h / 2 - 60;

          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.fillText('SQUARE  :  AREA   ::   CUBE  :  ?', cx, cy);

          // Options A, B, C, D
          const opts = ['A) Side', 'B) Perimeter', 'C) Volume', 'D) Degree'];
          opts.forEach((opt, idx) => {
            const ox = x + 160 + (idx % 2) * 350;
            const oy = cy + 70 + Math.floor(idx / 2) * 85;

            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, ox, oy, 300, 65, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(opt, ox + 25, oy + 42);
          });
        }
      };
    }
  };

})();
