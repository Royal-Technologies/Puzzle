/**
 * NumberSequenceGenerator
 * Generates number sequence puzzles: arithmetic, geometric,
 * Fibonacci-style, mixed rule, and next-in-series.
 */
window.NumberSequenceGenerator = {
  name: 'Number Sequence',
  subtypes: [
    { value: 'arithmetic',     label: 'Arithmetic Sequence' },
    { value: 'geometric',      label: 'Geometric Sequence' },
    { value: 'fibonacci',      label: 'Fibonacci-style' },
    { value: 'mixed-rule',     label: 'Find the Rule' },
    { value: 'next-in-series', label: 'Next in Series' },
  ],

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** Draw a single number box (rounded rect + number/?) */
  _drawBox(ctx, cx, cy, bw, bh, label, isUnknown) {
    const x = cx - bw / 2;
    const y = cy - bh / 2;
    const r = 14;

    // Background
    ctx.fillStyle = isUnknown ? 'rgba(108,99,255,0.18)' : 'rgba(240,242,255,0.85)';
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + bw - r, y);
    ctx.quadraticCurveTo(x + bw, y, x + bw, y + r);
    ctx.lineTo(x + bw, y + bh - r);
    ctx.quadraticCurveTo(x + bw, y + bh, x + bw - r, y + bh);
    ctx.lineTo(x + r, y + bh);
    ctx.quadraticCurveTo(x, y + bh, x, y + bh - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = isUnknown ? '#6C63FF' : '#CCCCCC';
    ctx.lineWidth = isUnknown ? 2.5 : 1.5;
    ctx.stroke();

    // Label
    ctx.font = isUnknown
      ? 'bold 42px Arial, sans-serif'
      : `bold ${String(label).length > 4 ? '28' : '36'}px Arial, sans-serif`;
    ctx.fillStyle = isUnknown ? '#E74C3C' : '#1A1A2E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(label), cx, cy);
    ctx.textBaseline = 'alphabetic';
  },

  /** Draw an arrow → between two boxes */
  _drawArrow(ctx, fromX, toX, cy) {
    const midX = (fromX + toX) / 2;
    ctx.strokeStyle = '#AAAACC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX + 8, cy);
    ctx.lineTo(toX - 8, cy);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX - 8, cy);
    ctx.lineTo(toX - 18, cy - 7);
    ctx.lineTo(toX - 18, cy + 7);
    ctx.closePath();
    ctx.fillStyle = '#AAAACC';
    ctx.fill();
  },

  /** Layout and draw a sequence of boxes */
  _renderSequenceRow(ctx, x, y, w, h, terms, hideLast, ruleText, hintText) {
    const count = terms.length;
    const boxW = Math.min(120, (w - (count - 1) * 24 - 40) / count);
    const boxH = boxW * 0.72;
    const arrowW = 24;
    const totalW = count * boxW + (count - 1) * arrowW;
    const startX = x + (w - totalW) / 2 + boxW / 2;
    const cy = y + h / 2 - 30;

    for (let i = 0; i < count; i++) {
      const cx = startX + i * (boxW + arrowW);
      const isUnknown = hideLast && i >= count - hideLast;
      this._drawBox(ctx, cx, cy, boxW, boxH, isUnknown ? '?' : terms[i], isUnknown);

      // Arrow
      if (i < count - 1) {
        this._drawArrow(ctx, cx + boxW / 2, cx + boxW / 2 + arrowW, cy);
      }
    }

    // Rule / hint text
    ctx.textAlign = 'center';
    if (ruleText) {
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillStyle = '#6C63FF';
      ctx.fillText(ruleText, x + w / 2, cy + boxH / 2 + 48);
    }
    if (hintText) {
      ctx.font = '20px Arial, sans-serif';
      ctx.fillStyle = '#888';
      ctx.fillText(hintText, x + w / 2, y + h - 22);
    }
    ctx.textAlign = 'left';
  },

  // ─── Subtype Generators ───────────────────────────────────────────────────

  _arithmetic(difficulty) {
    let start, diff, count;
    if (difficulty === 'easy') {
      start = this._rnd(1, 10); diff = this._rnd(2, 8); count = 6;
    } else if (difficulty === 'medium') {
      start = this._rnd(5, 50); diff = this._rnd(10, 30); count = 7;
    } else {
      start = this._rnd(10, 100); diff = this._rnd(15, 50) * (Math.random() < 0.5 ? -1 : 1); count = 8;
    }
    const terms = Array.from({ length: count }, (_, i) => start + i * diff);
    const missingCount = difficulty === 'hard' ? 2 : 1;
    const visible = terms.slice(0, count - missingCount);
    const answers = terms.slice(count - missingCount);
    const sign = diff >= 0 ? '+' : '−';
    return {
      terms,
      hideLast: missingCount,
      instruction: `Find the missing number(s) in this arithmetic sequence:\n${terms.slice(0, count - missingCount).join(', ')}, ?`,
      answer: answers.join(', '),
      hint: `The common difference is ${Math.abs(diff)} (${sign}${Math.abs(diff)} each step)`,
      ruleText: `Rule: ${sign} ${Math.abs(diff)} each step`,
    };
  },

  _geometric(difficulty) {
    let start, ratio, count;
    if (difficulty === 'easy') {
      start = this._rnd(1, 5); ratio = this._rnd(2, 4); count = 6;
    } else if (difficulty === 'medium') {
      start = this._rnd(2, 8); ratio = this._rnd(2, 5); count = 7;
    } else {
      start = this._rnd(1, 3); ratio = this._rnd(3, 6); count = 7;
    }
    const terms = Array.from({ length: count }, (_, i) => start * Math.pow(ratio, i));
    const missingCount = difficulty === 'hard' ? 2 : 1;
    return {
      terms,
      hideLast: missingCount,
      instruction: `Find the missing number(s) in this geometric sequence:\n${terms.slice(0, count - missingCount).join(', ')}, ?`,
      answer: terms.slice(count - missingCount).join(', '),
      hint: `Each term is multiplied by ${ratio}`,
      ruleText: `Rule: × ${ratio} each step`,
    };
  },

  _fibonacci(difficulty) {
    let a, b, count;
    if (difficulty === 'easy') {
      a = 1; b = 1; count = 8;
    } else if (difficulty === 'medium') {
      a = this._rnd(2, 8); b = this._rnd(2, 8); count = 8;
    } else {
      a = this._rnd(3, 12); b = this._rnd(3, 12); count = 9;
    }
    const terms = [a, b];
    while (terms.length < count) {
      terms.push(terms[terms.length - 1] + terms[terms.length - 2]);
    }
    const missingCount = difficulty === 'hard' ? 2 : 1;
    return {
      terms,
      hideLast: missingCount,
      instruction: `Each number is the sum of the two before it. Find the missing number(s):\n${terms.slice(0, count - missingCount).join(', ')}, ?`,
      answer: terms.slice(count - missingCount).join(', '),
      hint: 'Add the last two numbers to get the next.',
      ruleText: 'Rule: add last two',
    };
  },

  _mixedRule(difficulty) {
    const rules = [
      // Squares
      { gen: (n) => n * n, terms: [1,4,9,16,25,36,49], rule: 'Perfect squares (n²)', hint: 'Think about square numbers.' },
      // Cubes
      { gen: (n) => n * n * n, terms: [1,8,27,64,125,216], rule: 'Perfect cubes (n³)', hint: 'Think about cube numbers.' },
      // Triangular
      { gen: (n) => n * (n + 1) / 2, terms: [1,3,6,10,15,21,28], rule: 'Triangular numbers', hint: 'Add 1, 2, 3, 4… each time.' },
      // Powers of 2
      { gen: (n) => Math.pow(2, n), terms: [1,2,4,8,16,32,64], rule: 'Powers of 2', hint: 'Double each time.' },
      // Odd numbers
      { gen: (n) => 2 * n - 1, terms: [1,3,5,7,9,11,13], rule: 'Odd numbers', hint: 'Add 2 each time starting from 1.' },
    ];
    const choice = rules[this._rnd(0, rules.length - 1)];
    const count = difficulty === 'hard' ? 7 : 6;
    const terms = choice.terms.slice(0, count);
    const missingCount = difficulty === 'hard' ? 2 : 1;
    return {
      terms,
      hideLast: missingCount,
      instruction: `Find the rule and the missing number(s):\n${terms.slice(0, count - missingCount).join(', ')}, ?`,
      answer: terms.slice(count - missingCount).join(', '),
      hint: choice.hint,
      ruleText: `Rule: ${choice.rule}`,
    };
  },

  _nextInSeries(difficulty) {
    const series = [
      { terms: [2, 5, 10, 17, 26, 37, 50], rule: '+3, +5, +7, +9...', hint: 'The difference increases by 2 each time.' },
      { terms: [3, 6, 11, 18, 27, 38, 51], rule: '+3, +5, +7, +9...', hint: 'Differences are odd numbers.' },
      { terms: [1, 2, 4, 7, 11, 16, 22],  rule: '+1, +2, +3, +4...', hint: 'The difference increases by 1 each time.' },
      { terms: [5, 10, 20, 35, 55, 80, 110], rule: '+5, +10, +15...', hint: 'Differences increase by 5.' },
      { terms: [1, 3, 7, 15, 31, 63, 127], rule: '×2 +1 each step', hint: 'Try doubling and adding 1.' },
      { terms: [2, 3, 5, 8, 13, 21, 34],  rule: 'Fibonacci-like', hint: 'Each term is the sum of the previous two.' },
    ];
    const hardSeries = [
      { terms: [1, 1, 2, 6, 24, 120, 720], rule: 'Factorials (n!)', hint: 'Multiply by 2, then 3, then 4…' },
      { terms: [4, 9, 25, 49, 121, 169, 289], rule: 'Squares of primes', hint: 'These are squares of prime numbers.' },
    ];
    const pool = difficulty === 'hard' ? [...series, ...hardSeries] : series;
    const choice = pool[this._rnd(0, pool.length - 1)];
    const count = difficulty === 'hard' ? 7 : 6;
    const terms = choice.terms.slice(0, count);
    const missingCount = difficulty === 'hard' ? 2 : 1;
    return {
      terms,
      hideLast: missingCount,
      instruction: `What comes next?\n${terms.slice(0, count - missingCount).join(', ')}, ?`,
      answer: terms.slice(count - missingCount).join(', '),
      hint: choice.hint,
      ruleText: `Rule: ${choice.rule}`,
    };
  },

  // ─── Main Generate ────────────────────────────────────────────────────────

  generate(subtype, difficulty) {
    let data;
    switch (subtype) {
      case 'arithmetic':     data = this._arithmetic(difficulty);    break;
      case 'geometric':      data = this._geometric(difficulty);     break;
      case 'fibonacci':      data = this._fibonacci(difficulty);     break;
      case 'mixed-rule':     data = this._mixedRule(difficulty);     break;
      case 'next-in-series': data = this._nextInSeries(difficulty);  break;
      default:               data = this._arithmetic(difficulty);
    }

    const gen = this;
    return {
      type: 'number-sequence',
      subtype,
      difficulty,
      title: this.subtypes.find(s => s.value === subtype)?.label || subtype,
      instruction: data.instruction,
      answer: data.answer,
      hint: data.hint,
      renderFn(ctx, x, y, w, h) {
        // Title bar for sequence type
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillStyle = '#6C63FF';
        ctx.textAlign = 'center';
        ctx.fillText('Find the missing number(s)', x + w / 2, y + 44);
        ctx.textAlign = 'left';

        gen._renderSequenceRow(ctx, x, y + 40, w, h - 40, data.terms, data.hideLast, data.ruleText, data.hint);
      }
    };
  },
};
