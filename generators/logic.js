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
      {
        suspects: ['Lucas', 'Oliver', 'Zoe'],
        crime: 'left the front door open',
        clues: [
          'The person was holding a soccer ball.',
          'Zoe was playing video games inside.',
          'Oliver was practicing piano upstairs.',
        ],
        answer: 'Lucas — the other two had clear alibis playing indoors.',
      },
    ],
    medium: [
      {
        suspects: ['Grace', 'Henry', 'Ivy', 'Jake'],
        crime: 'took the trophy from the cabinet',
        clues: [
          'The culprit was alone in the room between 2–3 PM.',
          'Grace was with Henry from 1–4 PM.',
          'Ivy left the building at 1:30 PM and returned at 3:30 PM.',
          'Jake was in the room from 2:15 PM to 2:45 PM.',
        ],
        answer: 'Jake — he was the only one alone in the room during the 2–3 PM window.',
      },
      {
        suspects: ['Aaron', 'Bella', 'Carl', 'Diana'],
        crime: 'borrowed the master key',
        clues: [
          'The person wore glasses.',
          'Aaron and Diana do not wear glasses.',
          'Bella was on a phone call with the manager all morning.',
        ],
        answer: 'Carl — he wears glasses and has no alibi.',
      },
      {
        suspects: ['Eva', 'Felix', 'Gina', 'Hugo'],
        crime: 'spilled paint in the studio',
        clues: [
          'The culprit has yellow paint on their shoes.',
          'Eva was wearing blue boots without a mark.',
          'Felix and Gina were working together in the computer lab.',
        ],
        answer: 'Hugo — he had access and yellow paint on his shoes.',
      },
    ],
    hard: [
      {
        suspects: ['Leo', 'Maya', 'Nick', 'Olivia'],
        crime: 'sent the anonymous coded letter',
        clues: [
          'The sender knew the recipient\'s confidential address.',
          'Only Maya and Nick knew the new address.',
          'Nick was on an international flight without internet.',
          'Maya\'s handwriting matches the handwriting sample found.',
        ],
        answer: 'Maya — she knew the address, was present, and her handwriting matches.',
      },
      {
        suspects: ['Marcus', 'Elena', 'Julian', 'Sophia'],
        crime: 'hacked the secure database',
        clues: [
          'The breach occurred from an IP address inside Terminal B.',
          'Elena and Sophia logged into Terminal A all afternoon.',
          'Marcus was presenting in the main auditorium until 5 PM.',
          'Julian was the only staff member logged into Terminal B.',
        ],
        answer: 'Julian — he was the only suspect logged into Terminal B during the breach.',
      },
      {
        suspects: ['Victor', 'Chloe', 'Nathan', 'Tara'],
        crime: 'swapped the display diamond with a fake',
        clues: [
          'The suspect had the vault passcode and visited after 8 PM.',
          'Only Victor and Tara knew the vault passcode.',
          'Tara checked out of the building security at 7:30 PM.',
          'Victor badge-swiped the vault door at 8:14 PM.',
        ],
        answer: 'Victor — he had the passcode and entered after 8 PM.',
      },
    ],
  },

  _gridLogicPuzzles: {
    easy: [
      {
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
      {
        title: 'Match each friend to their favorite fruit.',
        people: ['Ben', 'Daisy', 'Leo'],
        attributes: ['Apple', 'Banana', 'Mango'],
        clues: [
          'Ben is allergic to Apples.',
          'Daisy loves Mangoes.',
          'Leo does not like Apples.',
        ],
        solution: { Ben: 'Banana', Daisy: 'Mango', Leo: 'Apple' },
        prefilled: { 'Daisy-Mango': true },
      },
    ],
    medium: [
      {
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
      {
        title: 'Match each coworker to their morning drink.',
        people: ['Liam', 'Noah', 'Emma'],
        attributes: ['Coffee', 'Tea', 'Juice'],
        clues: [
          'Liam never drinks hot beverages.',
          'Noah drinks black Coffee every day.',
          'Emma prefers Herbal Tea.',
        ],
        solution: { Liam: 'Juice', Noah: 'Coffee', Emma: 'Tea' },
        prefilled: { 'Noah-Coffee': true },
      },
    ],
    hard: [
      {
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
      {
        title: 'Four athletes won medals in four different Olympic sports.',
        people: ['Ryan', 'Sara', 'Tom', 'Yuki'],
        attributes: ['Swimming', 'Judo', 'Archery', 'Track'],
        clues: [
          'Ryan does not compete in water sports.',
          'Sara won her medal in Archery.',
          'Tom does not do Track or Swimming.',
          'Yuki won gold in the pool.',
        ],
        solution: { Ryan: 'Track', Sara: 'Archery', Tom: 'Judo', Yuki: 'Swimming' },
        prefilled: { 'Sara-Archery': true },
      },
      {
        title: 'Four musicians each play a distinct classical instrument.',
        people: ['Chloe', 'Ethan', 'Mia', 'Lucas'],
        attributes: ['Piano', 'Violin', 'Flute', 'Cello'],
        clues: [
          'Chloe does not play string instruments.',
          'Ethan plays the grand Piano.',
          'Mia plays an instrument smaller than a Cello.',
          'Lucas does not play the Flute.',
        ],
        solution: { Chloe: 'Flute', Ethan: 'Piano', Mia: 'Violin', Lucas: 'Cello' },
        prefilled: { 'Ethan-Piano': true },
      },
    ],
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
      if (ctx.roundRect) ctx.roundRect(bx, boxY, boxW, boxH, 10);
      else ctx.rect(bx, boxY, boxW, boxH);
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
    if (ctx.roundRect) ctx.roundRect(x + 30, y + 20, w - 60, h - 100, 16);
    else ctx.rect(x + 30, y + 20, w - 60, h - 100);
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
      if (ctx.roundRect) ctx.roundRect(bx, curY, 120, 44, 10);
      else ctx.rect(bx, curY, 120, 44);
      ctx.fill();
      ctx.stroke();
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillStyle = i === 0 ? '#2EC4B6' : '#E74C3C';
      ctx.fillText(label, bx + 60, curY + 28);
    });
    ctx.textAlign = 'left';
  },

  _renderRiverCrossing(ctx, x, y, w, h, puzzle) {
    ctx.save();
    const cx = x + w / 2;
    const topY = y + 15;

    // 1. Puzzle Title
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(puzzle.title, cx, topY + 25);

    // 2. River Scene (Start Bank, River with Boat, Goal Bank)
    const riverY = topY + 55;
    const riverH = 170;
    const bankW = w * 0.28;
    const riverW = w * 0.38;

    // Left bank (Start)
    const leftX = x + 25;
    ctx.fillStyle = '#DCFCE7';
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(leftX, riverY, bankW, riverH, 12);
    else ctx.rect(leftX, riverY, bankW, riverH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('START BANK', leftX + bankW / 2, riverY + 28);

    // Items on start bank - rendered as neat chips
    const items = puzzle.items || ['Farmer', 'Fox', 'Chicken', 'Grain'];
    const isSmall = items.length > 4;
    const chipW = bankW * 0.42;
    const chipH = isSmall ? 28 : 34;
    const chipFont = isSmall ? 'bold 15px "Segoe UI", Arial, sans-serif' : 'bold 17px "Segoe UI", Arial, sans-serif';

    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const chX = leftX + (col === 0 ? 12 : bankW / 2 + 6);
      const chY = riverY + (isSmall ? 44 + row * 38 : 50 + row * 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#86EFAC';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(chX, chY, chipW, chipH, 8);
      else ctx.rect(chX, chY, chipW, chipH);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#14532D';
      ctx.font = chipFont;
      ctx.textAlign = 'center';
      ctx.fillText(item, chX + chipW / 2, chY + chipH / 2 + 5);
    });

    // River Water
    const riverStartX = leftX + bankW + 10;
    ctx.fillStyle = '#E0F2FE';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(riverStartX, riverY, riverW, riverH, 12);
    else ctx.rect(riverStartX, riverY, riverW, riverH);
    ctx.fill();
    ctx.stroke();

    // Water Ripples
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    for (let rx = riverStartX + 35; rx < riverStartX + riverW - 20; rx += 55) {
      ctx.beginPath();
      ctx.arc(rx, riverY + 45, 14, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(rx + 25, riverY + 125, 14, Math.PI, 0);
      ctx.stroke();
    }

    // Wooden Boat with Mast & Sail (Crisp Vector)
    const boatCx = riverStartX + riverW / 2;
    const boatCy = riverY + riverH / 2 + 12;
    const boatW = 84, boatH = 22;

    // Boat Hull
    ctx.fillStyle = '#92400E';
    ctx.strokeStyle = '#451A03';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boatCx - boatW / 2, boatCy);
    ctx.lineTo(boatCx + boatW / 2, boatCy);
    ctx.lineTo(boatCx + boatW / 2 - 12, boatCy + boatH);
    ctx.lineTo(boatCx - boatW / 2 + 12, boatCy + boatH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mast
    ctx.strokeStyle = '#451A03';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(boatCx, boatCy);
    ctx.lineTo(boatCx, boatCy - 38);
    ctx.stroke();

    // Sail
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(boatCx, boatCy - 38);
    ctx.lineTo(boatCx + 26, boatCy - 12);
    ctx.lineTo(boatCx, boatCy - 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right bank (Goal)
    const rightX = riverStartX + riverW + 10;
    ctx.fillStyle = '#FEF9C3';
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rightX, riverY, bankW, riverH, 12);
    else ctx.rect(rightX, riverY, bankW, riverH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#854D0E';
    ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL BANK', rightX + bankW / 2, riverY + 28);

    // Target question mark on goal bank
    ctx.font = 'bold 58px Arial, sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('?', rightX + bankW / 2, riverY + 115);

    // 3. Scenario Description Card below river
    const descY = riverY + riverH + 30;
    const descH = 155;
    const descW = w - 50;
    const descX = x + 25;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(descX, descY, descW, descH, 14);
    else ctx.rect(descX, descY, descW, descH);
    ctx.fill();
    ctx.stroke();

    ctx.font = '600 21px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'left';
    this._drawWrappedText(ctx, puzzle.scenario, descX + 25, descY + 38, descW - 50, 30);

    // 4. Question highlighted at bottom
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    ctx.fillText(puzzle.question, cx, descY + descH + 46);

    ctx.restore();
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
        instruction: 'One person is lying. Use deductive logic to discover who is telling the truth and who is the liar.',
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
        instruction: `Someone ${puzzle.crime}. Read the clues below to identify the culprit!`,
        answer: puzzle.answer,
        hint: 'Eliminate suspects using each clue until only one remains.',
        renderFn(ctx, x, y, w, h) { gen._renderWhoIsIt(ctx, x, y, w, h, puzzle); }
      };
    }

    if (subtype === 'grid-logic') {
      const rawPool = this._gridLogicPuzzles[difficulty] || this._gridLogicPuzzles.hard || this._gridLogicPuzzles.easy;
      const pool = Array.isArray(rawPool) ? rawPool : [rawPool];
      const puzzle = pool[this._rnd(0, pool.length - 1)];
      return {
        type: 'logic', subtype, difficulty,
        title: 'Grid Logic',
        instruction: `${puzzle.title}: Match each person with their correct item using the clues.`,
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
        instruction: 'Read the premises below and determine whether the conclusion logically follows.',
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
      instruction: puzzle.question,
      answer: puzzle.answer,
      hint: puzzle.hint,
      renderFn(ctx, x, y, w, h) { gen._renderRiverCrossing(ctx, x, y, w, h, puzzle); }
    };
  },
};
