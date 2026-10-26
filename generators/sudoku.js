/**
 * SudokuGenerator
 * Generates Sudoku puzzles: classic 9×9, mini 4×4, and killer sudoku.
 */
window.SudokuGenerator = {
  name: 'Sudoku',
  subtypes: [
    { value: 'classic-9x9',   label: 'Classic 9×9' },
    { value: 'mini-4x4',      label: 'Mini 4×4' },
    { value: 'killer-sudoku', label: 'Killer Sudoku (Sums)' },
  ],

  // ─── Fisher-Yates shuffle ─────────────────────────────────────────────────
  _shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // ─── 9×9 Sudoku generation ────────────────────────────────────────────────

  /** Generate a solved 9×9 grid using backtracking */
  _generateFull9x9() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    this._solve9x9(grid);
    return grid;
  },

  _isValid9x9(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
      if (grid[i][col] === num) return false;
      const br = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const bc = 3 * Math.floor(col / 3) + (i % 3);
      if (grid[br][bc] === num) return false;
    }
    return true;
  },

  _solve9x9(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const nums = this._shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (this._isValid9x9(grid, row, col, num)) {
              grid[row][col] = num;
              if (this._solve9x9(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  },

  /** Remove `count` cells from a completed grid */
  _removeCells(grid, count) {
    const puzzle = grid.map(row => row.slice());
    const positions = this._shuffle(
      Array.from({ length: 81 }, (_, i) => i)
    );
    let removed = 0;
    for (const pos of positions) {
      if (removed >= count) break;
      const r = Math.floor(pos / 9);
      const c = pos % 9;
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        removed++;
      }
    }
    return puzzle;
  },

  // ─── 4×4 Sudoku generation ────────────────────────────────────────────────

  _generateFull4x4() {
    const grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    this._solve4x4(grid);
    return grid;
  },

  _isValid4x4(grid, row, col, num) {
    for (let i = 0; i < 4; i++) {
      if (grid[row][i] === num) return false;
      if (grid[i][col] === num) return false;
      const br = 2 * Math.floor(row / 2) + Math.floor(i / 2);
      const bc = 2 * Math.floor(col / 2) + (i % 2);
      if (grid[br][bc] === num) return false;
    }
    return true;
  },

  _solve4x4(grid) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) {
          const nums = this._shuffle([1, 2, 3, 4]);
          for (const num of nums) {
            if (this._isValid4x4(grid, row, col, num)) {
              grid[row][col] = num;
              if (this._solve4x4(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  },

  _removeCells4x4(grid, count) {
    const puzzle = grid.map(row => row.slice());
    const positions = this._shuffle(
      Array.from({ length: 16 }, (_, i) => i)
    );
    let removed = 0;
    for (const pos of positions) {
      if (removed >= count) break;
      const r = Math.floor(pos / 4);
      const c = pos % 4;
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        removed++;
      }
    }
    return puzzle;
  },

  // ─── Killer Sudoku cage generation ───────────────────────────────────────

  _generateCages(solution, cageSize) {
    const n = 9;
    const assigned = Array.from({ length: n }, () => Array(n).fill(false));
    const cages = [];

    const allCells = this._shuffle(
      Array.from({ length: n * n }, (_, i) => [Math.floor(i / n), i % n])
    );

    for (const [startR, startC] of allCells) {
      if (assigned[startR][startC]) continue;

      const cage = [[startR, startC]];
      assigned[startR][startC] = true;

      // Grow cage
      while (cage.length < cageSize) {
        const [lr, lc] = cage[cage.length - 1];
        const neighbors = [
          [lr - 1, lc], [lr + 1, lc], [lr, lc - 1], [lr, lc + 1]
        ].filter(([r, c]) =>
          r >= 0 && r < n && c >= 0 && c < n && !assigned[r][c]
        );
        if (neighbors.length === 0) break;
        const [nr, nc] = neighbors[Math.floor(Math.random() * neighbors.length)];
        cage.push([nr, nc]);
        assigned[nr][nc] = true;
      }

      const sum = cage.reduce((s, [r, c]) => s + solution[r][c], 0);
      cages.push({ cells: cage, sum });
    }

    return cages;
  },

  // ─── Main Generate ────────────────────────────────────────────────────────

  generate(subtype, difficulty) {
    const gen = this;

    if (subtype === 'classic-9x9') {
      const solution = this._generateFull9x9();
      const removeCount = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 45 : 55;
      const puzzle = this._removeCells(solution, removeCount);
      const given = 81 - removeCount;

      return {
        type: 'sudoku',
        subtype,
        difficulty,
        title: 'Classic 9×9 Sudoku',
        instruction: `Fill the grid so every row, column, and 3×3 box contains digits 1–9 exactly once. (${given} given)`,
        answer: 'See the completed solution grid.',
        hint: 'Start with rows, columns, or boxes that have the most given numbers.',
        renderFn(ctx, x, y, w, h) {
          gen._render9x9(ctx, x, y, w, h, puzzle);
        }
      };
    }

    if (subtype === 'mini-4x4') {
      const solution = this._generateFull4x4();
      const removeCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;
      const puzzle = this._removeCells4x4(solution, removeCount);

      return {
        type: 'sudoku',
        subtype,
        difficulty,
        title: 'Mini 4×4 Sudoku',
        instruction: 'Fill the grid so every row, column, and 2×2 box contains digits 1–4 exactly once.',
        answer: 'See the completed solution grid.',
        hint: 'Start with the 2×2 boxes that have the most given numbers.',
        renderFn(ctx, x, y, w, h) {
          gen._render4x4(ctx, x, y, w, h, puzzle);
        }
      };
    }

    // killer-sudoku
    const solution = this._generateFull9x9();
    const cageSize = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 3 : 2;
    const cages = this._generateCages(solution, cageSize);

    return {
      type: 'sudoku',
      subtype,
      difficulty,
      title: 'Killer Sudoku',
      instruction: 'Fill the grid (1–9 per row/column/box). Numbers in dashed cages must sum to the shown total. No repeats within a cage.',
      answer: 'See the completed solution grid.',
      hint: 'Use cage sums to eliminate possibilities. Small cages with low sums are very restrictive.',
      renderFn(ctx, x, y, w, h) {
        gen._renderKiller(ctx, x, y, w, h, cages);
      }
    };
  },

  // ─── Render: 9×9 ─────────────────────────────────────────────────────────

  _render9x9(ctx, x, y, w, h, puzzle) {
    const cellSize = 64;
    const gridSize = cellSize * 9;
    const gx = x + (w - gridSize) / 2;
    const gy = y + (h - gridSize) / 2;

    // Background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(gx, gy, gridSize, gridSize);

    // Thin cell lines
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + i * cellSize, gy);
      ctx.lineTo(gx + i * cellSize, gy + gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy + i * cellSize);
      ctx.lineTo(gx + gridSize, gy + i * cellSize);
      ctx.stroke();
    }

    // Thick 3×3 box borders
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + i * cellSize * 3, gy);
      ctx.lineTo(gx + i * cellSize * 3, gy + gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy + i * cellSize * 3);
      ctx.lineTo(gx + gridSize, gy + i * cellSize * 3);
      ctx.stroke();
    }

    // Numbers
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = puzzle[r][c];
        if (val !== 0) {
          // Alternate box shading
          const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
          if (boxIdx % 2 === 0) {
            ctx.fillStyle = 'rgba(108,99,255,0.05)';
            ctx.fillRect(gx + c * cellSize + 1, gy + r * cellSize + 1, cellSize - 1, cellSize - 1);
          }
          ctx.fillStyle = '#1A1A2E';
          ctx.fillText(String(val), gx + c * cellSize + cellSize / 2, gy + r * cellSize + cellSize / 2);
        }
      }
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  },

  // ─── Render: 4×4 ─────────────────────────────────────────────────────────

  _render4x4(ctx, x, y, w, h, puzzle) {
    const cellSize = 130;
    const gridSize = cellSize * 4;
    const gx = x + (w - gridSize) / 2;
    const gy = y + (h - gridSize) / 2;

    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(gx, gy, gridSize, gridSize);

    // Thin cell lines
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 0.8;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + i * cellSize, gy);
      ctx.lineTo(gx + i * cellSize, gy + gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy + i * cellSize);
      ctx.lineTo(gx + gridSize, gy + i * cellSize);
      ctx.stroke();
    }

    // Thick 2×2 box borders
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + i * cellSize * 2, gy);
      ctx.lineTo(gx + i * cellSize * 2, gy + gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy + i * cellSize * 2);
      ctx.lineTo(gx + gridSize, gy + i * cellSize * 2);
      ctx.stroke();
    }

    // Numbers
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        // Checker shading
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = 'rgba(108,99,255,0.06)';
          ctx.fillRect(gx + c * cellSize + 1, gy + r * cellSize + 1, cellSize - 1, cellSize - 1);
        }
        const val = puzzle[r][c];
        if (val !== 0) {
          ctx.fillStyle = '#1A1A2E';
          ctx.fillText(String(val), gx + c * cellSize + cellSize / 2, gy + r * cellSize + cellSize / 2);
        }
      }
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  },

  // ─── Render: Killer ───────────────────────────────────────────────────────

  _renderKiller(ctx, x, y, w, h, cages) {
    const cellSize = 64;
    const gridSize = cellSize * 9;
    const gx = x + (w - gridSize) / 2;
    const gy = y + (h - gridSize) / 2;

    const cageColors = [
      'rgba(108,99,255,0.08)', 'rgba(46,196,182,0.08)',
      'rgba(255,101,132,0.08)', 'rgba(247,197,159,0.15)',
      'rgba(52,211,153,0.08)', 'rgba(251,191,36,0.10)',
    ];

    // Fill cage backgrounds
    cages.forEach((cage, idx) => {
      ctx.fillStyle = cageColors[idx % cageColors.length];
      cage.cells.forEach(([r, c]) => {
        ctx.fillRect(gx + c * cellSize + 1, gy + r * cellSize + 1, cellSize - 1, cellSize - 1);
      });
    });

    // Thin cell lines
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + i * cellSize, gy);
      ctx.lineTo(gx + i * cellSize, gy + gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy + i * cellSize);
      ctx.lineTo(gx + gridSize, gy + i * cellSize);
      ctx.stroke();
    }

    // Thick box borders
    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(gx + i * cellSize * 3, gy);
      ctx.lineTo(gx + i * cellSize * 3, gy + gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy + i * cellSize * 3);
      ctx.lineTo(gx + gridSize, gy + i * cellSize * 3);
      ctx.stroke();
    }

    // Cage borders (dashed)
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1.8;
    cages.forEach((cage, idx) => {
      ctx.strokeStyle = cageColors[idx % cageColors.length].replace('0.08', '1').replace('0.10', '1').replace('0.15', '1');
      ctx.strokeStyle = '#888';
      cage.cells.forEach(([r, c]) => {
        const neighbors = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
        const cellSet = new Set(cage.cells.map(([a, b]) => `${a},${b}`));
        neighbors.forEach(([nr, nc]) => {
          if (!cellSet.has(`${nr},${nc}`)) {
            ctx.beginPath();
            if (nr === r - 1) { ctx.moveTo(gx + c * cellSize + 2, gy + r * cellSize + 2); ctx.lineTo(gx + (c + 1) * cellSize - 2, gy + r * cellSize + 2); }
            else if (nr === r + 1) { ctx.moveTo(gx + c * cellSize + 2, gy + (r + 1) * cellSize - 2); ctx.lineTo(gx + (c + 1) * cellSize - 2, gy + (r + 1) * cellSize - 2); }
            else if (nc === c - 1) { ctx.moveTo(gx + c * cellSize + 2, gy + r * cellSize + 2); ctx.lineTo(gx + c * cellSize + 2, gy + (r + 1) * cellSize - 2); }
            else if (nc === c + 1) { ctx.moveTo(gx + (c + 1) * cellSize - 2, gy + r * cellSize + 2); ctx.lineTo(gx + (c + 1) * cellSize - 2, gy + (r + 1) * cellSize - 2); }
            ctx.stroke();
          }
        });
      });

      // Sum label in top-left cell of cage
      const [topR, topC] = cage.cells.reduce((best, cur) =>
        cur[0] < best[0] || (cur[0] === best[0] && cur[1] < best[1]) ? cur : best
      );
      ctx.setLineDash([]);
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillStyle = '#E74C3C';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(String(cage.sum), gx + topC * cellSize + 4, gy + topR * cellSize + 3);
      ctx.setLineDash([4, 3]);
    });

    ctx.setLineDash([]);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  },
};
