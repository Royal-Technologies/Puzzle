/**
 * GeometryGenerator
 * Generates geometry puzzles: missing angles, area/perimeter,
 * shape identification, shape sequences, and shaded region problems.
 */
window.GeometryGenerator = {
  name: 'Geometry',
  subtypes: [
    { value: 'missing-angle',   label: 'Missing Angle' },
    { value: 'area-perimeter',  label: 'Area & Perimeter' },
    { value: 'identify-shape',  label: 'Identify the Shape' },
    { value: 'shape-sequence',  label: 'Shape Sequence' },
    { value: 'shaded-region',   label: 'Shaded Region Area' },
  ],

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Random integer in [min, max] */
  _rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** Draw a rounded rectangle path */
  _roundRect(ctx, x, y, w, h, r) {
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
  },

  /** Wrap text within a max width, return lines array */
  _wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  },

  // ─── Subtype: missing-angle ───────────────────────────────────────────────

  _missingAngle(difficulty) {
    if (difficulty === 'easy') {
      // Right triangle: angles are 90, A, B where A+B=90
      const a = this._rnd(20, 70);
      const b = 90 - a;
      return {
        instruction: `In a right triangle, two angles are 90° and ${a}°. Find the missing angle x.`,
        answer: `${b}°`,
        hint: 'The sum of angles in a triangle is 180°.',
        renderData: { shape: 'triangle', angles: [90, a, null] }
      };
    }
    if (difficulty === 'medium') {
      // Quadrilateral: three angles given, find fourth
      const a = this._rnd(60, 110);
      const b = this._rnd(60, 110);
      const c = this._rnd(60, 110);
      const d = 360 - a - b - c;
      return {
        instruction: `A quadrilateral has three angles: ${a}°, ${b}°, and ${c}°. Find angle x.`,
        answer: `${d}°`,
        hint: 'The sum of angles in a quadrilateral is 360°.',
        renderData: { shape: 'quad', angles: [a, b, c, null] }
      };
    }
    // hard: pentagon, sum = 540
    const sides = this._rnd(0,1) === 0 ? 5 : 6;
    const sum = (sides - 2) * 180;
    const known = [];
    for (let i = 0; i < sides - 1; i++) {
      known.push(this._rnd(80, 160));
    }
    const missing = sum - known.reduce((a, b) => a + b, 0);
    const shapeName = sides === 5 ? 'pentagon' : 'hexagon';
    return {
      instruction: `A regular ${shapeName} has interior angles summing to ${sum}°. Given angles: ${known.join('°, ')}°. Find angle x.`,
      answer: `${missing}°`,
      hint: `Sum of interior angles of a ${shapeName} = (${sides}−2)×180° = ${sum}°`,
      renderData: { shape: shapeName, sides, known, sum }
    };
  },

  // ─── Subtype: area-perimeter ──────────────────────────────────────────────

  _areaPerimeter(difficulty) {
    if (difficulty === 'easy') {
      const w = this._rnd(4, 18);
      const h = this._rnd(4, 18);
      const askArea = Math.random() < 0.5;
      return {
        instruction: askArea
          ? `Find the AREA of a rectangle with width ${w} cm and height ${h} cm.`
          : `Find the PERIMETER of a rectangle with width ${w} cm and height ${h} cm.`,
        answer: askArea ? `${w * h} cm²` : `${2 * (w + h)} cm`,
        hint: askArea ? 'Area = width × height' : 'Perimeter = 2×(width + height)',
        renderData: { shape: 'rect', w, h, askArea }
      };
    }
    if (difficulty === 'medium') {
      const base = this._rnd(6, 20);
      const height = this._rnd(4, 16);
      const askArea = Math.random() < 0.5;
      const side2 = this._rnd(5, 15);
      const side3 = this._rnd(5, 15);
      return {
        instruction: askArea
          ? `Find the AREA of a triangle with base ${base} cm and height ${height} cm.`
          : `Find the PERIMETER of a triangle with sides ${base} cm, ${side2} cm, and ${side3} cm.`,
        answer: askArea ? `${(base * height) / 2} cm²` : `${base + side2 + side3} cm`,
        hint: askArea ? 'Area of triangle = ½ × base × height' : 'Perimeter = sum of all sides',
        renderData: { shape: 'triangle', base, height, side2, side3, askArea }
      };
    }
    // hard: compound shape
    const W = this._rnd(12, 20);
    const H = this._rnd(10, 16);
    const cw = this._rnd(3, W - 3);
    const ch = this._rnd(2, H - 2);
    const area = W * H - cw * ch;
    return {
      instruction: `A rectangle ${W}×${H} cm has a smaller ${cw}×${ch} cm rectangle cut from one corner. Find the shaded area.`,
      answer: `${area} cm²`,
      hint: 'Area = large rectangle − small rectangle cut out',
      renderData: { shape: 'compound', W, H, cw, ch }
    };
  },

  // ─── Subtype: identify-shape ──────────────────────────────────────────────

  _identifyShape(difficulty) {
    const shapeData = [
      { name: 'Square',        props: ['4 equal sides', '4 right angles (90°)', 'Diagonals are equal'] },
      { name: 'Rectangle',     props: ['2 pairs of equal sides', '4 right angles (90°)', 'Diagonals bisect each other'] },
      { name: 'Equilateral Triangle', props: ['3 equal sides', '3 angles of 60°', '3 lines of symmetry'] },
      { name: 'Regular Hexagon', props: ['6 equal sides', 'Interior angles = 120°', '6 lines of symmetry'] },
      { name: 'Rhombus',       props: ['4 equal sides', 'Opposite angles equal', 'Diagonals bisect at 90°'] },
      { name: 'Trapezoid',     props: ['Exactly one pair of parallel sides', 'Non-parallel sides called legs', 'One pair of parallel sides'] },
      { name: 'Pentagon',      props: ['5 sides', 'Interior angles sum = 540°', '5 vertices'] },
      { name: 'Octagon',       props: ['8 sides', 'Interior angles sum = 1080°', '8 vertices'] },
    ];
    const idx = this._rnd(0, shapeData.length - 1);
    const shape = shapeData[idx];
    return {
      instruction: `A shape has these properties:\n• ${shape.props.join('\n• ')}\n\nWhat shape is this?`,
      answer: shape.name,
      hint: `Count the sides and check the angle properties.`,
      renderData: { shape: shape.name.toLowerCase().replace(/\s+/g, '_'), props: shape.props }
    };
  },

  // ─── Subtype: shape-sequence ──────────────────────────────────────────────

  _shapeSequence(difficulty) {
    if (difficulty === 'easy') {
      const seq = ['circle', 'square', 'triangle', 'circle', 'square', 'triangle', '?'];
      return {
        instruction: 'What comes next in the shape sequence?',
        answer: 'Triangle (the pattern repeats: circle, square, triangle)',
        hint: 'Look for a repeating pattern.',
        renderData: { type: 'repeat', seq }
      };
    }
    if (difficulty === 'medium') {
      // Sides increase: 3, 4, 5, 6, ?
      const shapesBySides = {3:'triangle',4:'square',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon'};
      const start = 3;
      const count = 4;
      const seqSides = Array.from({length: count}, (_, i) => start + i);
      const nextSides = start + count;
      const seq = seqSides.map(s => shapesBySides[s]);
      seq.push('?');
      return {
        instruction: 'Each shape has one more side than the previous. What shape comes next?',
        answer: `${shapesBySides[nextSides]} (${nextSides} sides)`,
        hint: 'Count the number of sides in each shape.',
        renderData: { type: 'sides', seq, seqSides, nextSides }
      };
    }
    // hard: 2×3 grid pattern, missing one
    const shapes = ['circle', 'square', 'triangle', 'circle', 'square', '?'];
    return {
      instruction: 'The grid follows a pattern. What shape belongs in the missing cell (marked ?).',
      answer: 'Triangle — each row contains circle, square, triangle',
      hint: 'Look at each row and column for a pattern.',
      renderData: { type: 'grid', shapes }
    };
  },

  // ─── Subtype: shaded-region ───────────────────────────────────────────────

  _shadedRegion(difficulty) {
    if (difficulty === 'easy') {
      const side = this._rnd(12, 20);
      const r = Math.floor(side / 2 - this._rnd(0, 2));
      const squareArea = side * side;
      const circleArea = +(Math.PI * r * r).toFixed(2);
      const shaded = +(squareArea - circleArea).toFixed(2);
      return {
        instruction: `A circle (radius ${r} cm) is drawn inside a square (side ${side} cm). Find the shaded area outside the circle. Use π = 3.14`,
        answer: `${(squareArea - Math.round(3.14 * r * r * 100) / 100).toFixed(2)} cm²`,
        hint: 'Shaded area = Area of square − Area of circle',
        renderData: { type: 'circle-in-square', side, r }
      };
    }
    if (difficulty === 'medium') {
      const w1 = this._rnd(10, 16), h1 = this._rnd(6, 12);
      const w2 = this._rnd(4, w1 - 2), h2 = this._rnd(3, h1 - 1);
      const overlap = w2 * h2;
      const total = w1 * h1 + w2 * h2 - overlap;
      return {
        instruction: `Two rectangles overlap. Rectangle A is ${w1}×${h1} cm. Rectangle B is ${w2}×${h2} cm. The overlap is ${overlap} cm². Find the total non-overlapping shaded area.`,
        answer: `${w1 * h1 + w2 * h2 - 2 * overlap} cm²`,
        hint: 'Non-overlapping area = Area A + Area B − 2×overlap',
        renderData: { type: 'two-rects', w1, h1, w2, h2 }
      };
    }
    // hard: triangle inside rectangle
    const W = this._rnd(12, 20), H = this._rnd(8, 14);
    const triBase = W, triHeight = H;
    const shadedArea = W * H - 0.5 * triBase * triHeight;
    return {
      instruction: `A triangle with base ${triBase} cm and height ${triHeight} cm is drawn inside a rectangle ${W}×${H} cm. Find the shaded (non-triangle) area.`,
      answer: `${shadedArea} cm²`,
      hint: 'Shaded = Rectangle area − Triangle area',
      renderData: { type: 'tri-in-rect', W, H }
    };
  },

  // ─── Main Generate ────────────────────────────────────────────────────────

  generate(subtype, difficulty) {
    let data;
    switch (subtype) {
      case 'missing-angle':  data = this._missingAngle(difficulty);  break;
      case 'area-perimeter': data = this._areaPerimeter(difficulty); break;
      case 'identify-shape': data = this._identifyShape(difficulty); break;
      case 'shape-sequence': data = this._shapeSequence(difficulty); break;
      case 'shaded-region':  data = this._shadedRegion(difficulty);  break;
      default:               data = this._missingAngle(difficulty);
    }

    const gen = this;
    return {
      type: 'geometry',
      subtype,
      difficulty,
      title: this.subtypes.find(s => s.value === subtype)?.label || subtype,
      instruction: data.instruction,
      answer: data.answer,
      hint: data.hint,
      renderFn(ctx, x, y, w, h) {
        switch (subtype) {
          case 'missing-angle':  gen._renderMissingAngle(ctx, x, y, w, h, data, difficulty);  break;
          case 'area-perimeter': gen._renderAreaPerimeter(ctx, x, y, w, h, data, difficulty); break;
          case 'identify-shape': gen._renderIdentifyShape(ctx, x, y, w, h, data);            break;
          case 'shape-sequence': gen._renderShapeSequence(ctx, x, y, w, h, data);            break;
          case 'shaded-region':  gen._renderShadedRegion(ctx, x, y, w, h, data, difficulty); break;
        }
      }
    };
  },

  // ─── Render: missing-angle ────────────────────────────────────────────────

  _renderMissingAngle(ctx, x, y, w, h, data, difficulty) {
    const rd = data.renderData;
    const cx = x + w / 2;
    const cy = y + h / 2 + 10;

    if (rd.shape === 'triangle') {
      // Draw right triangle
      const size = Math.min(w, h) * 0.50;
      const tx = cx - size / 2, ty = cy + size / 2;
      const verts = [
        [tx,          ty],
        [tx + size,   ty],
        [tx,          ty - size * 0.7]
      ];
      ctx.beginPath();
      ctx.moveTo(verts[0][0], verts[0][1]);
      verts.forEach(v => ctx.lineTo(v[0], v[1]));
      ctx.closePath();
      ctx.fillStyle = 'rgba(108,99,255,0.12)';
      ctx.fill();
      ctx.strokeStyle = '#6C63FF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Right angle marker
      const sq = 18;
      ctx.beginPath();
      ctx.moveTo(verts[0][0] + sq, verts[0][1]);
      ctx.lineTo(verts[0][0] + sq, verts[0][1] - sq);
      ctx.lineTo(verts[0][0],      verts[0][1] - sq);
      ctx.strokeStyle = '#1A1A2E';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Angle labels
      const labels = rd.angles.map((a, i) => a === null ? 'x°?' : `${a}°`);
      const colors = rd.angles.map(a => a === null ? '#E74C3C' : '#1A1A2E');
      const offsets = [[-30, 22], [18, 22], [-42, -10]];
      labels.forEach((lbl, i) => {
        ctx.font = `bold 26px Arial, sans-serif`;
        ctx.fillStyle = colors[i];
        ctx.fillText(lbl, verts[i][0] + offsets[i][0], verts[i][1] + offsets[i][1]);
      });
    } else if (rd.shape === 'quad') {
      // Draw a convex quadrilateral
      const s = Math.min(w, h) * 0.42;
      const verts = [
        [cx - s,      cy + s * 0.6],
        [cx + s * 0.7, cy + s * 0.7],
        [cx + s * 0.8, cy - s * 0.5],
        [cx - s * 0.6, cy - s * 0.8],
      ];
      ctx.beginPath();
      ctx.moveTo(verts[0][0], verts[0][1]);
      verts.forEach(v => ctx.lineTo(v[0], v[1]));
      ctx.closePath();
      ctx.fillStyle = 'rgba(46,196,182,0.12)';
      ctx.fill();
      ctx.strokeStyle = '#2EC4B6';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const labels = rd.angles.map((a, i) => a === null ? 'x°?' : `${a}°`);
      const colors = rd.angles.map(a => a === null ? '#E74C3C' : '#1A1A2E');
      const offs = [[-46, 22], [8, 22], [8, -10], [-46, -10]];
      labels.forEach((lbl, i) => {
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillStyle = colors[i];
        ctx.fillText(lbl, verts[i][0] + offs[i][0], verts[i][1] + offs[i][1]);
      });
    } else {
      // Polygon (pentagon/hexagon)
      const sides = rd.sides;
      const radius = Math.min(w, h) * 0.25;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (2 * Math.PI * i / sides) - Math.PI / 2;
        const px = cx + radius * Math.cos(angle);
        const py = cy + radius * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,101,132,0.12)';
      ctx.fill();
      ctx.strokeStyle = '#FF6584';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label each vertex
      for (let i = 0; i < sides; i++) {
        const angle = (2 * Math.PI * i / sides) - Math.PI / 2;
        const lx = cx + (radius + 38) * Math.cos(angle);
        const ly = cy + (radius + 38) * Math.sin(angle);
        const isUnknown = i === sides - 1;
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillStyle = isUnknown ? '#E74C3C' : '#1A1A2E';
        ctx.textAlign = 'center';
        ctx.fillText(isUnknown ? 'x°?' : `${rd.known[i]}°`, lx, ly + 6);
      }
      ctx.textAlign = 'left';
    }

    // Hint at bottom
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'center';
    ctx.fillText(data.hint, cx, y + h - 30);
    ctx.textAlign = 'left';
  },

  // ─── Render: area-perimeter ───────────────────────────────────────────────

  _renderAreaPerimeter(ctx, x, y, w, h, data, difficulty) {
    const rd = data.renderData;
    const cx = x + w / 2;
    const cy = y + h / 2 - 20;

    if (rd.shape === 'rect') {
      const rw = Math.min(w * 0.5, rd.w * 28);
      const rh = Math.min(h * 0.4, rd.h * 28);
      const rx = cx - rw / 2, ry = cy - rh / 2;
      ctx.fillStyle = 'rgba(108,99,255,0.15)';
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = '#6C63FF';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(rx, ry, rw, rh);

      // Dimension labels
      ctx.font = 'bold 26px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'center';
      ctx.fillText(`${rd.w} cm`, cx, ry - 14);
      ctx.save();
      ctx.translate(rx - 18, cy);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${rd.h} cm`, 0, 0);
      ctx.restore();

      // Question mark
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillStyle = '#E74C3C';
      ctx.fillText(rd.askArea ? 'Area = ?' : 'Perimeter = ?', cx, cy + rh / 2 + 50);
    } else if (rd.shape === 'triangle') {
      const base = Math.min(w * 0.55, rd.base * 22);
      const triH = Math.min(h * 0.45, rd.height * 22);
      const bx = cx - base / 2, by = cy + triH / 2;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + base, by);
      ctx.lineTo(bx + base * 0.35, by - triH);
      ctx.closePath();
      ctx.fillStyle = 'rgba(46,196,182,0.15)';
      ctx.fill();
      ctx.strokeStyle = '#2EC4B6';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Height dashed line
      if (rd.askArea) {
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx + base * 0.35, by - triH);
        ctx.lineTo(bx + base * 0.35, by);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillStyle = '#1A1A2E';
        ctx.textAlign = 'left';
        ctx.fillText(`h = ${rd.height} cm`, bx + base * 0.35 + 8, by - triH / 2);
      }
      ctx.textAlign = 'center';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.fillText(`base = ${rd.base} cm`, cx, by + 32);
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillStyle = '#E74C3C';
      ctx.fillText(rd.askArea ? 'Area = ?' : 'Perimeter = ?', cx, by + 75);
    } else {
      // Compound shape
      const scale = Math.min((w * 0.55) / rd.W, (h * 0.45) / rd.H);
      const rw = rd.W * scale, rh = rd.H * scale;
      const cw2 = rd.cw * scale, ch2 = rd.ch * scale;
      const rx = cx - rw / 2, ry = cy - rh / 2;

      // Big rect
      ctx.fillStyle = 'rgba(108,99,255,0.18)';
      ctx.fillRect(rx, ry, rw, rh);
      // Cut-out (white)
      ctx.fillStyle = '#fff';
      ctx.fillRect(rx + rw - cw2, ry, cw2, ch2);

      ctx.strokeStyle = '#6C63FF';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.strokeStyle = '#E74C3C';
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(rx + rw - cw2, ry, cw2, ch2);
      ctx.setLineDash([]);

      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'center';
      ctx.fillText(`${rd.W} cm`, cx, ry - 14);
      ctx.fillText(`${rd.H} cm`, rx - 36, cy);
      ctx.fillStyle = '#E74C3C';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillText(`${rd.cw}×${rd.ch} cm cut`, rx + rw - cw2 / 2, ry + ch2 + 18);
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText('Shaded Area = ?', cx, ry + rh + 50);
    }
    ctx.textAlign = 'left';

    // Hint
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#777';
    ctx.textAlign = 'center';
    ctx.fillText(data.hint, cx, y + h - 22);
    ctx.textAlign = 'left';
  },

  // ─── Render: identify-shape ───────────────────────────────────────────────

  _renderIdentifyShape(ctx, x, y, w, h, data) {
    const rd = data.renderData;
    const cx = x + w / 2;

    // Draw the shape on left half
    const shapeCx = x + w * 0.3;
    const shapeCy = y + h * 0.45;
    const size = Math.min(w, h) * 0.22;
    const sname = rd.shape;

    ctx.fillStyle = 'rgba(108,99,255,0.15)';
    ctx.strokeStyle = '#6C63FF';
    ctx.lineWidth = 2.5;

    if (sname.includes('square')) {
      ctx.beginPath();
      ctx.rect(shapeCx - size, shapeCy - size, size * 2, size * 2);
      ctx.fill(); ctx.stroke();
    } else if (sname.includes('rectangle')) {
      ctx.beginPath();
      ctx.rect(shapeCx - size * 1.4, shapeCy - size * 0.7, size * 2.8, size * 1.4);
      ctx.fill(); ctx.stroke();
    } else if (sname.includes('triangle')) {
      ctx.beginPath();
      ctx.moveTo(shapeCx, shapeCy - size);
      ctx.lineTo(shapeCx + size, shapeCy + size * 0.7);
      ctx.lineTo(shapeCx - size, shapeCy + size * 0.7);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (sname.includes('hexagon')) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = shapeCx + size * Math.cos(a);
        const py = shapeCy + size * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (sname.includes('rhombus')) {
      ctx.beginPath();
      ctx.moveTo(shapeCx, shapeCy - size);
      ctx.lineTo(shapeCx + size * 1.2, shapeCy);
      ctx.lineTo(shapeCx, shapeCy + size);
      ctx.lineTo(shapeCx - size * 1.2, shapeCy);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (sname.includes('pentagon')) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (2 * Math.PI * i / 5) - Math.PI / 2;
        const px = shapeCx + size * Math.cos(a);
        const py = shapeCy + size * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (sname.includes('octagon')) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i;
        const px = shapeCx + size * Math.cos(a);
        const py = shapeCy + size * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else {
      // trapezoid
      ctx.beginPath();
      ctx.moveTo(shapeCx - size * 0.6, shapeCy - size * 0.6);
      ctx.lineTo(shapeCx + size * 0.6, shapeCy - size * 0.6);
      ctx.lineTo(shapeCx + size, shapeCy + size * 0.6);
      ctx.lineTo(shapeCx - size, shapeCy + size * 0.6);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // "?" label on shape
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillStyle = '#E74C3C';
    ctx.textAlign = 'center';
    ctx.fillText('?', shapeCx, shapeCy + 12);

    // Properties list on right
    const listX = x + w * 0.52;
    let listY = y + h * 0.24;
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'left';
    ctx.fillText('Properties:', listX, listY);
    listY += 12;
    rd.props.forEach(prop => {
      listY += 38;
      ctx.font = '24px Arial, sans-serif';
      ctx.fillStyle = '#444';
      ctx.fillText('• ' + prop, listX, listY);
    });

    // Question
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillStyle = '#6C63FF';
    ctx.textAlign = 'center';
    ctx.fillText('What shape is this?', cx, y + h - 36);
    ctx.textAlign = 'left';
  },

  // ─── Render: shape-sequence ───────────────────────────────────────────────

  _renderShapeSequence(ctx, x, y, w, h, data) {
    const rd = data.renderData;
    const seq = rd.seq;
    const count = seq.length;
    const cellW = Math.min(130, (w - 40) / count);
    const cellH = cellW;
    const startX = x + (w - count * (cellW + 16)) / 2;
    const rowY = y + h / 2 - cellH / 2;

    const colorMap = {
      circle:   '#6C63FF',
      square:   '#2EC4B6',
      triangle: '#FF6584',
      pentagon: '#F7C59F',
      hexagon:  '#E74C3C',
      heptagon: '#6C63FF',
      octagon:  '#2EC4B6',
    };

    seq.forEach((shape, i) => {
      const bx = startX + i * (cellW + 16);
      const by = rowY;
      const bcx = bx + cellW / 2;
      const bcy = by + cellH / 2;
      const r = cellW * 0.34;
      const isQ = shape === '?';

      // Box background
      ctx.fillStyle = isQ ? 'rgba(108,99,255,0.18)' : 'rgba(240,240,255,0.6)';
      this._roundRect(ctx, bx, by, cellW, cellH, 12);
      ctx.fill();
      ctx.strokeStyle = isQ ? '#6C63FF' : '#CCCCCC';
      ctx.lineWidth = isQ ? 2.5 : 1.5;
      this._roundRect(ctx, bx, by, cellW, cellH, 12);
      ctx.stroke();

      if (isQ) {
        ctx.font = 'bold 44px Arial, sans-serif';
        ctx.fillStyle = '#E74C3C';
        ctx.textAlign = 'center';
        ctx.fillText('?', bcx, bcy + 16);
      } else {
        const col = colorMap[shape] || '#6C63FF';
        ctx.fillStyle = col + '55';
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.5;

        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(bcx, bcy, r, 0, 2 * Math.PI);
          ctx.fill(); ctx.stroke();
        } else if (shape === 'square') {
          ctx.beginPath();
          ctx.rect(bcx - r, bcy - r, r * 2, r * 2);
          ctx.fill(); ctx.stroke();
        } else if (shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(bcx, bcy - r);
          ctx.lineTo(bcx + r, bcy + r * 0.7);
          ctx.lineTo(bcx - r, bcy + r * 0.7);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        } else {
          // Generic polygon by sides
          const sides = { pentagon:5, hexagon:6, heptagon:7, octagon:8 }[shape] || 5;
          ctx.beginPath();
          for (let j = 0; j < sides; j++) {
            const a = (2 * Math.PI * j / sides) - Math.PI / 2;
            const px = bcx + r * Math.cos(a);
            const py = bcy + r * Math.sin(a);
            j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        }

        // Label shape name below
        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'center';
        ctx.fillText(shape, bcx, by + cellH + 22);
      }

      // Arrow between
      if (i < count - 1) {
        ctx.font = '26px Arial, sans-serif';
        ctx.fillStyle = '#AAA';
        ctx.textAlign = 'center';
        ctx.fillText('→', bx + cellW + 8, bcy + 10);
      }
    });

    ctx.textAlign = 'center';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillStyle = '#6C63FF';
    ctx.fillText('What comes next?', x + w / 2, y + h - 30);
    ctx.textAlign = 'left';
  },

  // ─── Render: shaded-region ────────────────────────────────────────────────

  _renderShadedRegion(ctx, x, y, w, h, data, difficulty) {
    const rd = data.renderData;
    const cx = x + w / 2;
    const cy = y + h / 2 - 30;

    if (rd.type === 'circle-in-square') {
      const scale = Math.min(w * 0.5, h * 0.55) / rd.side;
      const sqS = rd.side * scale;
      const sqX = cx - sqS / 2, sqY = cy - sqS / 2;
      const rPx = rd.r * scale;

      // Shaded square
      ctx.fillStyle = 'rgba(108,99,255,0.35)';
      ctx.fillRect(sqX, sqY, sqS, sqS);

      // White circle (unshaded)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, 2 * Math.PI);
      ctx.fill();

      // Outlines
      ctx.strokeStyle = '#6C63FF';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(sqX, sqY, sqS, sqS);
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, 2 * Math.PI);
      ctx.strokeStyle = '#2EC4B6';
      ctx.stroke();

      // Dimension labels
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'center';
      ctx.fillText(`${rd.side} cm`, cx, sqY - 12);
      ctx.fillText(`r = ${rd.r} cm`, cx + rPx * 0.6, cy - 10);

      // Shaded label
      ctx.fillStyle = 'rgba(108,99,255,0.8)';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillText('Shaded = ?', cx, cy + sqS / 2 + 40);
    } else if (rd.type === 'two-rects') {
      const scale = Math.min(w * 0.4 / rd.w1, h * 0.4 / rd.h1);
      const rw1 = rd.w1 * scale, rh1 = rd.h1 * scale;
      const rw2 = rd.w2 * scale, rh2 = rd.h2 * scale;
      const r1x = cx - rw1 * 0.6, r1y = cy - rh1 / 2;
      const r2x = r1x + rw1 - rw2 * 0.6, r2y = cy - rh2 * 0.4;

      ctx.fillStyle = 'rgba(108,99,255,0.3)';
      ctx.fillRect(r1x, r1y, rw1, rh1);
      ctx.fillStyle = 'rgba(46,196,182,0.3)';
      ctx.fillRect(r2x, r2y, rw2, rh2);

      ctx.strokeStyle = '#6C63FF'; ctx.lineWidth = 2.5;
      ctx.strokeRect(r1x, r1y, rw1, rh1);
      ctx.strokeStyle = '#2EC4B6';
      ctx.strokeRect(r2x, r2y, rw2, rh2);

      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'center';
      ctx.fillText(`${rd.w1}×${rd.h1}`, r1x + rw1 / 2, r1y - 12);
      ctx.fillText(`${rd.w2}×${rd.h2}`, r2x + rw2 / 2, r2y - 12);
      ctx.fillStyle = '#E74C3C';
      ctx.font = 'bold 26px Arial, sans-serif';
      ctx.fillText('Non-overlapping area = ?', cx, cy + Math.max(rh1, rh2) / 2 + 48);
    } else {
      // Triangle in rect
      const scale = Math.min(w * 0.55 / rd.W, h * 0.48 / rd.H);
      const rw = rd.W * scale, rh = rd.H * scale;
      const rx = cx - rw / 2, ry = cy - rh / 2;

      // Shaded rect
      ctx.fillStyle = 'rgba(108,99,255,0.3)';
      ctx.fillRect(rx, ry, rw, rh);
      // White triangle
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + rw, ry);
      ctx.lineTo(rx + rw / 2, ry + rh);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.strokeStyle = '#6C63FF'; ctx.lineWidth = 2.5;
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + rw, ry);
      ctx.lineTo(rx + rw / 2, ry + rh);
      ctx.closePath();
      ctx.strokeStyle = '#2EC4B6';
      ctx.stroke();

      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillStyle = '#1A1A2E';
      ctx.textAlign = 'center';
      ctx.fillText(`${rd.W} cm`, cx, ry - 12);
      ctx.fillText(`${rd.H} cm`, rx - 36, cy);
      ctx.font = 'bold 26px Arial, sans-serif';
      ctx.fillStyle = '#E74C3C';
      ctx.fillText('Shaded Area = ?', cx, ry + rh + 44);
    }

    // Hint
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText(data.hint, cx, y + h - 22);
    ctx.textAlign = 'left';
  },
};
