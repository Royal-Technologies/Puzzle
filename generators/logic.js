/**
 * LogicGenerator
 * Generates logic puzzles: truth & lies, who did it, grid logic,
 * syllogisms, and river crossing.
 */
window.LogicGenerator = {
  name: 'Logic',
  subtypes: [
    { value: 'truth-lies',     label: 'Truth & Lies' },
    { value: 'who-is-it',      label: 'Who Did It?' },
    { value: 'grid-logic',     label: 'Grid Logic' },
    { value: 'syllogism',      label: 'Syllogism' },
    { value: 'river-crossing', label: 'River Crossing' },
  ],

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  /**
   * Wrap text and draw it line by line.
   * @returns {number} y position after last line
   */
  _drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let curY = y;
    for (const para of paragraphs) {
      const words = para.split(' ');
      let line = '';
      for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line, x, curY);
          curY += lineHeight;
          line = word;
        } else {
          line = test;
        }
      }
      if (line) { ctx.fillText(line, x, curY); curY += lineHeight; }
      curY += lineHeight * 0.2; // paragraph gap
    }
    return curY;
  },

  // ─── Puzzle Banks ─────────────────────────────────────────────────────────

  _truthLiesPuzzles: {
    easy: [
      {
        people: ['Alice', 'Bob', 'Carol'],
        roles: { Alice: 'truth', Bob: 'liar', Carol: 'truth' },
        statements: {
          Alice: 'I always tell the truth.',
          Bob:   'Alice is a liar.',
          Carol: 'Bob is the liar.',
        },
        answer: 'Bob is the liar. (Bob falsely says Alice is a liar; Alice and Carol tell the truth.)',
      },
      {
        people: ['Ava', 'Ben', 'Cara'],
        roles: { Ava: 'truth', Ben: 'truth', Cara: 'liar' },
        statements: {
          Ava:  'Ben always tells the truth.',
          Ben:  'Cara is lying.',
          Cara: 'Ava is a liar.',
        },
        answer: 'Cara is the liar. (Her statement about Ava is false.)',
      },
    ],
    medium: [
      {
        people: ['Dan', 'Eve', 'Finn'],
        roles: { Dan: 'liar', Eve: 'truth', Finn: 'liar' },
        statements: {
          Dan:  'Finn always tells the truth.',
          Eve:  'Dan is a liar.',
          Finn: 'Eve is a liar.',
        },
        answer: 'Dan and Finn are both liars. Eve tells the truth.',
      },
      {
        people: ['Gina', 'Hank', 'Iris'],
        roles: { Gina: 'truth', Hank: 'liar', Iris: 'liar' },
        statements: {
          Gina: 'Exactly one of us is a liar.',
          Hank: 'Gina is lying.',
          Iris: 'I tell the truth.',
        },
        answer: 'Hank and Iris lie. Gina\'s statement is false (there are 2 liars), but assume Gina lies — Hank and Iris lie.',
      },
    ],
    hard: [
      {
        people: ['Jack', 'Kim', 'Leo'],
        roles: { Jack: 'liar', Kim: 'truth', Leo: 'truth' },
        statements: {
          Jack: 'Kim and Leo are both liars.',
          Kim:  'Jack is the only liar.',
          Leo:  'Jack lied just now.',
        },
        answer: 'Jack is the only liar. Kim and Leo tell the truth.',
      },
      {
        people: ['Mia', 'Ned', 'Ora'],
        roles: { Mia: 'liar', Ned: 'liar', Ora: 'truth' },
        statements: {
          Mia: 'I am telling the truth.',
          Ned: 'Mia is telling the truth.',
          Ora: 'Both Mia and Ned are liars.',
        },
        answer: 'Mia and Ned are both liars. Ora tells the truth.',
      },
    ],
  },

  _whoIsItPuzzles: {
    easy: [
      {
        suspects: ['Alice', 'Bob', 'Carol'],
        crime: 'broke the vase',
        clues: [
          'The culprit was wearing a red hat.',
          'Bob never wears hats.',
          'Carol was wearing a blue hat that day.',
        ],
        answer: 'Alice — she was the only one who could have been wearing a red hat.',
      },
      {
        suspects: ['Dave', 'Emma', 'Frank'],
        crime: 'ate the last cookie',
        clues: [
          'The culprit had chocolate on their fingers.',
          'Emma had clean hands all day.',
          'Dave was seen near the cookie jar.',
        ],
        answer: 'Dave — he was near the cookie jar and could have had chocolate on his fingers.',
      },
    ],
    medium: [
      {
        suspects: ['Grace', 'Henry', 'Ivy', 'Jake'],
        crime: 'took the money',
        clues: [
          'The culprit was alone in the room between 2–3 PM.',
          'Grace was with Henry from 1–4 PM.',
          'Ivy left the building at 1:30 PM and returned at 3:30 PM.',
          'Jake was in the room from 2:15 PM to 2:45 PM.',
        ],
        answer: 'Jake — he was the only one alone in the room during the 2–3 PM window.',
      },
    ],
    hard: [
      {
        suspects: ['Leo', 'Maya', 'Nick', 'Olivia'],
        crime: 'sent the anonymous letter',
        clues: [
          'The sender knew the recipient\'s new address.',
          'Only Maya and Nick knew the new address.',
          'Nick was abroad when the letter was sent.',
          'Maya\'s handwriting matches a sample found.',
        ],
        answer: 'Maya — she knew the address, was present, and her handwriting matches.',
      },
    ],
  },

  _gridLogicPuzzles: {
    easy: {
      title: 'Match each person to their favourite colour.',
      people: ['Anna', 'Brad', 'Cara'],
      attributes: ['Red', 'Blue', 'Green'],
      clues: [
        'Anna\'s favourite is not Red.',
        'Brad likes Blue.',
        'Cara does not like Green.',
      ],
      solution: { Anna: 'Green', Brad: 'Blue', Cara: 'Red' },
      prefilled: { 'Brad-Blue': true },
    },
    medium: {
      title: 'Match each student to their subject and score.',
      people: ['Sam', 'Tina', 'Uri'],
      attributes: ['Math', 'Science', 'History'],
      clues: [
        'Sam did not take History.',
        'The Science student scored highest.',
        'Tina took History.',
        'Uri\'s subject is not Math.',
      ],
      solution: { Sam: 'Science', Tina: 'History', Uri: 'Math' },
      prefilled: { 'Tina-History': true },
    },
    hard: {
      title: 'Four friends each own a different pet and live on different floors.',
      people: ['Alex', 'Beth', 'Cole', 'Dana'],
      attributes: ['Dog', 'Cat', 'Fish', 'Bird'],
      clues: [
        'Alex does not have a Dog or Cat.',
        'Beth has the Bird.',
        'Cole\'s pet is not the Fish.',
        'Dana does not have the Bird.',
        'The person with the Fish lives on floor 2.',
      ],
      solution: { Alex: 'Fish', Beth: 'Bird', Cole: 'Dog', Dana: 'Cat' },
      prefilled: { 'Beth-Bird': true },
    },
  },

  _syllogismPuzzles: [
    { p1: 'All birds have wings.',       p2: 'A penguin is a bird.',          conclusion: 'A penguin has wings.',        valid: true  },
    { p1: 'All roses are flowers.',      p2: 'Some flowers fade quickly.',     conclusion: 'All roses fade quickly.',     valid: false },
    { p1: 'All cats are animals.',       p2: 'All animals need food.',         conclusion: 'All cats need food.',         valid: true  },
    { p1: 'Some students like math.',    p2: 'All students study.',            conclusion: 'Some students like math and study.', valid: true },
    { p1: 'No fish can walk.',           p2: 'A salmon is a fish.',            conclusion: 'A salmon cannot walk.',       valid: true  },
    { p1: 'All rectangles have 4 sides.', p2: 'A square has 4 sides.',        conclusion: 'A square is a rectangle.',    valid: false },
    { p1: 'All mammals breathe air.',    p2: 'Whales are mammals.',            conclusion: 'Whales breathe air.',         valid: true  },
    { p1: 'Some cars are electric.',     p2: 'All electric vehicles are quiet.', conclusion: 'All cars are quiet.',       valid: false },
  ],

  _riverCrossingPuzzles: [
    {
      title: 'Fox, Chicken & Grain',
      scenario: 'A farmer must cross a river with a fox, a chicken, and a bag of grain. The boat fits only the farmer + one item. The fox will eat the chicken if left alone together. The chicken will eat the grain if left alone together.',
      question: 'What is the minimum number of river crossings needed?',
      answer: '7 crossings minimum.',
      hint: 'Take the chicken first. Come back, take the fox (or grain). Return with the chicken. Take the other item. Come back alone. Finally take the chicken.',
      items: ['🧑', '🦊', '🐔', '🌾'],
    },
    {
      title: 'Torch & Bridge',
      scenario: 'Four people must cross a narrow bridge at night with one torch. At most 2 can cross at a time. Person A takes 1 min, B takes 2 min, C takes 5 min, D takes 10 min. When two cross together, they go at the slower person\'s pace.',
      question: 'What is the minimum total time needed for all to cross?',
      answer: '17 minutes.',
      hint: 'A & B cross (2 min). A returns (1 min). C & D cross (10 min). B returns (2 min). A & B cross (2 min). Total = 17 min.',
      items: ['A(1)', 'B(2)', 'C(5)', 'D(10)'],
    },
    {
      title: 'Three Missionaries & Cannibals',
      scenario: '3 missionaries and 3 cannibals must cross a river. The boat holds 1 or 2 people. Missionaries must never be outnumbered by cannibals on either bank.',
      question: 'What is the minimum number of crossings?',
      answer: '11 crossings.',
      hint: 'A classic puzzle. Start by sending 2 cannibals across, return 1, and so on.',
      items: ['M1', 'M2', 'M3', 'C1', 'C2', 'C3'],
    },
  ],

  // ─── Rendering Utilities ──────────────────────────────────────────────────

  /** Draw a simple person icon (circle head + stick body) */
  _drawPerson(ctx, cx, cy, size, name, role) {
    const headR = size * 0.28;
    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - size * 0.4, headR, 0, 2 * Math.PI);
    ctx.fillStyle = role === 'liar' ? 'rgba(231,76,60,0.25)' : 'rgba(108,99,255,0.18)';
    ctx.fill();
    ctx.strokeStyle = role === 'liar' ? '#E74C3C' : '#6C63FF';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.12);
    ctx.lineTo(cx, cy + size * 0.30);
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.25, cy + size * 0.05);
    ctx.lineTo(cx + size * 0.25, cy + size * 0.05);
    ctx.stroke();
    // Legs
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.30);
    ctx.lineTo(cx - size * 0.18, cy + size * 0.58);
    ctx.moveTo(cx, cy + size * 0.30);
    ctx.lineTo(cx + size * 0.18, cy + size * 0.58);
    ctx.stroke();
    // Name label
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'center';
    ctx.fillText(name, cx, cy + size * 0.78);
  },

  /** Draw a speech bubble with text */
  _drawSpeechBubble(ctx, bx, by, bw, bh, tailX, tailY, text, fontSize = 17) {
    const r = 12;
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
    ctx.lineTo(tailX + 12, by + bh);
    ctx.lineTo(tailX, tailY);
    ctx.lineTo(tailX - 6, by + bh);
    ctx.lineTo(bx + r, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fillStyle = '#FFFFF0';
    ctx.fill();
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'left';
    const words = text.split(' ');
    let line = '';
    let ty = by + fontSize + 8;
    const maxW = bw - 16;
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, bx + 8, ty);
        ty += fontSize + 4;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, bx + 8, ty);
  },

  // ─── Render Functions ─────────────────────────────────────────────────────

  _renderTruthLies(ctx, x, y, w, h, puzzle) {
    const count = puzzle.people.length;
    const personW = Math.min(160, w / (count + 1));
    const spacing = (w - count * personW) / (count + 1);
    const personH = 110;
    const personY = y + h * 0.46;

    puzzle.people.forEach((name, i) => {
      const cx = x + spacing * (i + 1) + personW * (i + 0.5);
      const role = puzzle.roles[name];
      this._drawPerson(ctx, cx, personY, personH, name, role);

      // Speech bubble
      const stmt = puzzle.statements[name];
      const bw = Math.min(240, w / count - 20);
      const bh = 70;
      const bx = cx - bw / 2;
      const by = personY - personH * 0.6 - bh - 14;
      this._drawSpeechBubble(ctx, bx, by, bw, bh, cx, personY - personH * 0.55, `"${stmt}"`, 15);
    });

    // Question
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillStyle = '#6C63FF';
    ctx.textAlign = 'center';
    ctx.fillText('Who is the liar?', x + w / 2, y + h * 0.72);

    // Clue: role legend
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('Each person either ALWAYS tells the truth or ALWAYS lies.', x + w / 2, y + h * 0.80);
    ctx.textAlign = 'left';
  },

  _renderWhoIsIt(ctx, x, y, w, h, puzzle) {
    const cx = x + w / 2;

    // Suspect boxes
    const count = puzzle.suspects.length;
    const boxW = Math.min(130, (w - 40) / count - 10);
    const boxH = 52;
    const startX = x + (w - count * (boxW + 12)) / 2;
    const boxY = y + 30;

    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'center';
    ctx.fillText('SUSPECTS', cx, boxY - 8);

    puzzle.suspects.forEach((name, i) => {
      const bx = startX + i * (boxW + 12);
      ctx.fillStyle = 'rgba(255,101,132,0.12)';
      ctx.strokeStyle = '#FF6584';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(bx, boxY, boxW, boxH, 10);
      ctx.fill();
      ctx.stroke();
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'center';
      ctx.fillText(name, bx + boxW / 2, boxY + 32);
    });

    // Crime
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#E74C3C';
    ctx.textAlign = 'center';
    ctx.fillText(`Crime: Someone ${puzzle.crime}`, cx, boxY + boxH + 36);

    // Clues
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.fillText('Clues:', cx, boxY + boxH + 72);
    ctx.textAlign = 'left';

    let clueY = boxY + boxH + 98;
    puzzle.clues.forEach((clue, i) => {
      ctx.font = '21px Arial, sans-serif';
      ctx.fillStyle = '#444';
      clueY = this._drawWrappedText(ctx, `${i + 1}. ${clue}`, x + 40, clueY, w - 80, 26);
    });

    // Question
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillStyle = '#6C63FF';
    ctx.textAlign = 'center';
    ctx.fillText('Who did it?', cx, y + h - 28);
    ctx.textAlign = 'left';
  },

  _renderGridLogic(ctx, x, y, w, h, puzzle) {
    const people = puzzle.people;
    const attrs  = puzzle.attributes;
    const rows   = people.length;
    const cols   = attrs.length;
    const cellW  = Math.min(140, (w - 220) / cols);
    const cellH  = 52;
    const labelW = 120;
    const gx = x + (w - (labelW + cols * cellW)) / 2;
    const gy = y + 50;

    // Title
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'center';
    ctx.fillText(puzzle.title, x + w / 2, gy - 20);

    // Column headers
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#6C63FF';
    ctx.textAlign = 'center';
    attrs.forEach((attr, ci) => {
      ctx.fillText(attr, gx + labelW + ci * cellW + cellW / 2, gy + 18);
    });

    // Rows
    people.forEach((person, ri) => {
      const ry = gy + 34 + ri * cellH;

      // Row label
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'right';
      ctx.fillText(person, gx + labelW - 8, ry + cellH / 2 + 6);

      attrs.forEach((attr, ci) => {
        const cx2 = gx + labelW + ci * cellW;
        const key = `${person}-${attr}`;
        const isPrefilled = puzzle.prefilled && puzzle.prefilled[key];

        ctx.fillStyle = isPrefilled ? 'rgba(46,196,182,0.18)' : (ri + ci) % 2 === 0 ? 'rgba(108,99,255,0.05)' : '#fff';
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 1;
        ctx.fillRect(cx2, ry, cellW, cellH);
        ctx.strokeRect(cx2, ry, cellW, cellH);

        if (isPrefilled) {
          ctx.font = 'bold 22px Arial, sans-serif';
          ctx.fillStyle = '#2EC4B6';
          ctx.textAlign = 'center';
          ctx.fillText('✓', cx2 + cellW / 2, ry + cellH / 2 + 8);
        }
      });
    });

    // Clues
    let clueY = gy + 34 + rows * cellH + 28;
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'left';
    ctx.fillText('Clues:', gx, clueY);
    clueY += 26;
    puzzle.clues.forEach((clue, i) => {
      ctx.font = '19px Arial, sans-serif';
      ctx.fillStyle = '#555';
      clueY = this._drawWrappedText(ctx, `${i + 1}. ${clue}`, gx, clueY, w - (gx - x) * 2, 24);
    });
    ctx.textAlign = 'left';
  },

  _renderSyllogism(ctx, x, y, w, h, puzzle) {
    const cx = x + w / 2;
    const pad = 50;
    let curY = y + 40;

    const drawSection = (label, text, color) => {
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.fillText(label, x + pad, curY);
      curY += 28;
      ctx.font = '24px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      curY = this._drawWrappedText(ctx, text, x + pad + 20, curY, w - pad * 2 - 20, 30);
      curY += 14;
    };

    // Box around content
    ctx.fillStyle = 'rgba(108,99,255,0.06)';
    ctx.strokeStyle = '#6C63FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x + 30, y + 20, w - 60, h - 100, 16);
    ctx.fill();
    ctx.stroke();

    curY = y + 52;
    drawSection('Premise 1:', puzzle.p1, '#6C63FF');
    drawSection('Premise 2:', puzzle.p2, '#2EC4B6');

    // Divider
    ctx.strokeStyle = '#DDDDEE';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 50, curY - 8);
    ctx.lineTo(x + w - 50, curY - 8);
    ctx.stroke();
    curY += 8;

    drawSection('Conclusion:', puzzle.conclusion, '#FF6584');

    // Validity checkbox area
    curY += 8;
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1A1A2E';
    ctx.fillText('Is the conclusion VALID or INVALID?', cx, curY);
    curY += 42;

    ['VALID ✓', 'INVALID ✗'].forEach((label, i) => {
      const bx = cx + (i === 0 ? -160 : 30);
      ctx.fillStyle = i === 0 ? 'rgba(46,196,182,0.15)' : 'rgba(231,76,60,0.12)';
      ctx.strokeStyle = i === 0 ? '#2EC4B6' : '#E74C3C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bx, curY, 120, 44, 10);
      ctx.fill();
      ctx.stroke();
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillStyle = i === 0 ? '#2EC4B6' : '#E74C3C';
      ctx.fillText(label, bx + 60, curY + 28);
    });
    ctx.textAlign = 'left';
  },

  _renderRiverCrossing(ctx, x, y, w, h, puzzle) {
    const cx = x + w / 2;
    const riverY = y + h * 0.38;
    const riverH = 90;

    // Sky / ground background hint
    ctx.fillStyle = 'rgba(255,255,255,0.0)';

    // Left bank
    ctx.fillStyle = '#A0C880';
    ctx.fillRect(x + 20, riverY - 60, w * 0.28, riverH + 120);
    // River
    ctx.fillStyle = 'rgba(46,196,182,0.35)';
    ctx.fillRect(x + 20 + w * 0.28, riverY, w * 0.44, riverH);
    // Ripples
    ctx.strokeStyle = 'rgba(46,196,182,0.6)';
    ctx.lineWidth = 1.5;
    for (let rx = x + 20 + w * 0.28 + 20; rx < x + 20 + w * 0.72 - 20; rx += 30) {
      ctx.beginPath();
      ctx.arc(rx, riverY + riverH / 2, 10, Math.PI, 0);
      ctx.stroke();
    }
    // Right bank
    ctx.fillStyle = '#D0C880';
    ctx.fillRect(x + 20 + w * 0.72, riverY - 60, w * 0.27, riverH + 120);

    // Bank labels
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'center';
    ctx.fillText('START', x + 20 + w * 0.14, riverY - 68);
    ctx.fillText('GOAL', x + 20 + w * 0.72 + w * 0.135, riverY - 68);

    // Boat in middle of river
    const boatCx = x + 20 + w * 0.50;
    const boatY = riverY + riverH * 0.55;
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(boatCx, boatY, 50, 16, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = '26px Arial, sans-serif';
    ctx.fillText('⛵', boatCx, boatY + 4);

    // Items on left bank
    const itemsLeft = puzzle.items;
    ctx.font = '28px Arial, sans-serif';
    const leftBankCx = x + 20 + w * 0.14;
    itemsLeft.forEach((item, i) => {
      const ix = leftBankCx + (i % 2 === 0 ? -28 : 28);
      const iy = riverY - 20 + Math.floor(i / 2) * 40;
      ctx.fillText(item.length <= 2 ? item : item[0], ix, iy);
    });

    // Question mark on right bank
    ctx.font = 'bold 40px Arial, sans-serif';
    ctx.fillStyle = '#E74C3C';
    ctx.fillText('?', x + 20 + w * 0.72 + w * 0.135, riverY + 12);

    // Puzzle title and scenario
    const textY = riverY + riverH + 28;
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#6C63FF';
    ctx.textAlign = 'center';
    ctx.fillText(puzzle.title, cx, y + 30);

    ctx.font = '19px Arial, sans-serif';
    ctx.fillStyle = '#444';
    ctx.textAlign = 'left';
    this._drawWrappedText(ctx, puzzle.scenario, x + 30, textY, w - 60, 24);

    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = '#E74C3C';
    ctx.textAlign = 'center';
    ctx.fillText(puzzle.question, cx, y + h - 22);
    ctx.textAlign = 'left';
  },

  // ─── Main Generate ────────────────────────────────────────────────────────

  generate(subtype, difficulty) {
    const gen = this;

    if (subtype === 'truth-lies') {
      const pool = this._truthLiesPuzzles[difficulty] || this._truthLiesPuzzles.easy;
      const puzzle = pool[this._rnd(0, pool.length - 1)];
      return {
        type: 'logic', subtype, difficulty,
        title: 'Truth & Lies',
        instruction: Object.entries(puzzle.statements)
          .map(([name, stmt]) => `${name} says: "${stmt}"`)
          .join('\n'),
        answer: puzzle.answer,
        hint: 'If someone lies, their statement about themselves or others must be false.',
        renderFn(ctx, x, y, w, h) { gen._renderTruthLies(ctx, x, y, w, h, puzzle); }
      };
    }

    if (subtype === 'who-is-it') {
      const pool = this._whoIsItPuzzles[difficulty] || this._whoIsItPuzzles.easy;
      const puzzle = pool[this._rnd(0, pool.length - 1)];
      return {
        type: 'logic', subtype, difficulty,
        title: 'Who Did It?',
        instruction: `Someone ${puzzle.crime}. Read the clues and find the culprit.\n\n` +
          puzzle.clues.map((c, i) => `${i + 1}. ${c}`).join('\n'),
        answer: puzzle.answer,
        hint: 'Eliminate suspects using each clue until only one remains.',
        renderFn(ctx, x, y, w, h) { gen._renderWhoIsIt(ctx, x, y, w, h, puzzle); }
      };
    }

    if (subtype === 'grid-logic') {
      const puzzle = this._gridLogicPuzzles[difficulty] || this._gridLogicPuzzles.easy;
      return {
        type: 'logic', subtype, difficulty,
        title: 'Grid Logic',
        instruction: `${puzzle.title}\n\nClues:\n` + puzzle.clues.map((c, i) => `${i + 1}. ${c}`).join('\n'),
        answer: Object.entries(puzzle.solution).map(([k, v]) => `${k} → ${v}`).join(', '),
        hint: 'Use process of elimination. Mark what\'s impossible to find what\'s certain.',
        renderFn(ctx, x, y, w, h) { gen._renderGridLogic(ctx, x, y, w, h, puzzle); }
      };
    }

    if (subtype === 'syllogism') {
      const pool = this._syllogismPuzzles;
      const puzzle = pool[this._rnd(0, pool.length - 1)];
      return {
        type: 'logic', subtype, difficulty,
        title: 'Syllogism',
        instruction: `Premise 1: ${puzzle.p1}\nPremise 2: ${puzzle.p2}\nConclusion: ${puzzle.conclusion}\n\nIs the conclusion valid?`,
        answer: puzzle.valid ? 'VALID — the conclusion logically follows.' : 'INVALID — the conclusion does not necessarily follow.',
        hint: 'Check if the conclusion MUST be true if both premises are true.',
        renderFn(ctx, x, y, w, h) { gen._renderSyllogism(ctx, x, y, w, h, puzzle); }
      };
    }

    // river-crossing
    const pool = this._riverCrossingPuzzles;
    const puzzle = pool[this._rnd(0, pool.length - 1)];
    return {
      type: 'logic', subtype, difficulty,
      title: 'River Crossing',
      instruction: `${puzzle.title}\n\n${puzzle.scenario}\n\n${puzzle.question}`,
      answer: puzzle.answer,
      hint: puzzle.hint,
      renderFn(ctx, x, y, w, h) { gen._renderRiverCrossing(ctx, x, y, w, h, puzzle); }
    };
  },
};
