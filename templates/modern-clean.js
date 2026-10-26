/* ============================================================
   Bright Path Puzzle Template (1080×1080 px)
   Branding: Bright Path | Royal Technologies
   ============================================================ */

'use strict';

window.ModernCleanTemplate = (function () {

  const W = 1080;
  const H = 1080;

  // Single unified card layout (NO double lines, NO awkward separated banner)
  const HEADER_H    = 145; // 0 -> 145
  const CARD_X      = 50;
  const CARD_Y      = 155; // 155 -> 965 (One seamless card)
  const CARD_W      = 980;
  const CARD_H      = 810;
  const FOOTER_Y    = 975; // 975 -> 1080
  const FOOTER_H    = 105;

  const BG_THEMES = {
    'cream-paper': {
      outerBg: '#0A192F',
      cardBg: '#FAF6EE',
      headerGrad: ['#0A192F', '#1E3A8A'],
      borderColor: '#D8CEBF',
      paperTexture: true,
      textColor: '#0F172A',
      isDark: false
    },
    'clean-white': {
      outerBg: '#0F172A',
      cardBg: '#FFFFFF',
      headerGrad: ['#0F172A', '#1E293B'],
      borderColor: '#CBD5E1',
      paperTexture: false,
      textColor: '#0F172A',
      isDark: false
    },
    'warm-parchment': {
      outerBg: '#1C1917',
      cardBg: '#F5EFEB',
      headerGrad: ['#1C1917', '#44403C'],
      borderColor: '#D7CCC8',
      paperTexture: true,
      textColor: '#1C1917',
      isDark: false
    },
    'dark-slate': {
      outerBg: '#030712',
      cardBg: '#0F172A',
      headerGrad: ['#030712', '#1E293B'],
      borderColor: '#334155',
      paperTexture: false,
      textColor: '#F8FAFC',
      isDark: true
    }
  };

  const DIFF_COLORS = {
    easy:   '#10B981',
    medium: '#F59E0B',
    hard:   '#EF4444'
  };

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

  function render(canvas, puzzleData, options) {
    options = options || {};
    const themeKey = options.bgTheme || 'cream-paper';
    const titleMode = options.titleMode || 'nopen';
    const theme = BG_THEMES[themeKey] || BG_THEMES['cream-paper'];

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // 1. Outer canvas frame
    ctx.fillStyle = theme.outerBg;
    ctx.fillRect(0, 0, W, H);

    // 2. Header
    _drawHeader(ctx, puzzleData, theme, titleMode);

    // 3. Single Unified Card (No double lines!)
    _drawUnifiedCard(ctx, puzzleData, theme);

    // 4. Footer with "Bright Path"
    _drawFooter(ctx, theme);
  }

  function _drawHeader(ctx, puzzleData, theme, titleMode) {
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, theme.headerGrad[0]);
    grad.addColorStop(1, theme.headerGrad[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Category Badge (Top-Left)
    const typeLabel = (puzzleData.type || 'PUZZLE').toUpperCase().replace(/-/g, ' ');
    drawBadge(ctx, typeLabel, 36, 18, 'rgba(255,255,255,0.22)', '#FFFFFF');

    // Difficulty Badge (Top-Right)
    const diff = (puzzleData.difficulty || 'medium').toLowerCase();
    const diffColor = DIFF_COLORS[diff] || DIFF_COLORS.medium;
    drawBadge(ctx, '⚡ ' + diff.toUpperCase(), W - 140, 18, diffColor, '#FFFFFF');

    // Main Header Title
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (titleMode === 'nopen') {
      ctx.font = 'bold 44px "Arial Black", Impact, Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fillText('NO PEN! NO PAPER!!', W / 2, 65);

      ctx.shadowBlur = 0;
      ctx.font = 'bold 22px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FBBF24'; // Golden
      const sub = (puzzleData.title || 'Challenge').toUpperCase();
      ctx.fillText('✦  ' + sub + '  ✦', W / 2, 108);
    } else {
      ctx.font = 'bold 42px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fillText(puzzleData.title || 'Brain Teaser', W / 2, 68);

      ctx.shadowBlur = 0;
      ctx.font = 'bold 20px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FBBF24';
      ctx.fillText('✦  BRIGHT PATH  ✦', W / 2, 108);
    }
    ctx.restore();

    // Golden accent border line
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, HEADER_H - 3, W, 3);
  }

  // ── Single Unified Card (Instruction at top + Diagram below) ──
  function _drawUnifiedCard(ctx, puzzleData, theme) {
    ctx.save();
    // Card Background
    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2.5;
    safeRoundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 14);
    ctx.fill();
    ctx.stroke();

    if (theme.paperTexture) {
      _applyPaperTexture(ctx, CARD_X, CARD_Y, CARD_W, CARD_H);
    }

    // Top Instruction Section inside the card (Height: 90px)
    const instH = 85;
    ctx.fillStyle = theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
    ctx.beginPath();
    ctx.rect(CARD_X + 2, CARD_Y + 2, CARD_W - 4, instH);
    ctx.fill();

    // Divider line between instruction and diagram
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CARD_X + 20, CARD_Y + instH);
    ctx.lineTo(CARD_X + CARD_W - 20, CARD_Y + instH);
    ctx.stroke();

    // Instruction text
    const text = puzzleData.instruction || 'Solve the puzzle below:';
    ctx.fillStyle = theme.textColor;
    ctx.font = '600 22px Inter, "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, text, CARD_X + CARD_W / 2, CARD_Y + instH / 2, CARD_W - 80, 28);

    // Clip strictly within the remaining diagram zone of the card
    const diagramY = CARD_Y + instH + 10;
    const diagramH = CARD_H - instH - 20;

    ctx.save();
    ctx.beginPath();
    safeRoundRect(ctx, CARD_X + 4, diagramY, CARD_W - 8, diagramH, 10);
    ctx.clip();

    // Call puzzle-specific render function
    if (typeof puzzleData.renderFn === 'function') {
      try {
        puzzleData.renderFn(ctx, CARD_X + 20, diagramY + 10, CARD_W - 40, diagramH - 20);
      } catch (err) {
        console.error('Puzzle render error:', err);
        ctx.fillStyle = '#DC2626';
        ctx.font = '24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Render error: ' + err.message, W / 2, diagramY + diagramH / 2);
      }
    }
    ctx.restore();

    ctx.restore();
  }

  function _applyPaperTexture(ctx, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;

    for (let py = y + 25; py < y + h; py += 18) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
      ctx.stroke();
    }
    ctx.restore();
  }

  function _drawFooter(ctx, theme) {
    // Top border line
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, FOOTER_Y, W, 3);

    // Background
    ctx.fillStyle = '#0A192F';
    ctx.fillRect(0, FOOTER_Y + 3, W, FOOTER_H);

    ctx.save();
    // Left branding: Bright Path (as requested!)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  Bright Path', 60, FOOTER_Y + FOOTER_H / 2);

    // Right credit
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 20px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Royal Technologies  •  royaltechbd.com', W - 60, FOOTER_Y + FOOTER_H / 2);
    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
    const words = String(text).split(' ');
    const lines = [];
    let curLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = curLine ? curLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(curLine);
        curLine = words[i];
      } else {
        curLine = testLine;
      }
    }
    if (curLine) lines.push(curLine);

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, idx) => {
      ctx.fillText(line, x, startY + idx * lineHeight);
    });
  }

  function drawBadge(ctx, text, x, y, bgColor, textColor) {
    ctx.save();
    ctx.font = 'bold 16px Inter, "Segoe UI", Arial, sans-serif';
    const textW = ctx.measureText(text).width;
    const padX = 16, padY = 7;
    const bw = textW + padX * 2;
    const bh = 30;

    ctx.fillStyle = bgColor;
    safeRoundRect(ctx, x, y, bw, bh, bh / 2);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + bw / 2, y + bh / 2 + 1);
    ctx.restore();
  }

  return {
    render: render,
    wrapText: wrapText,
    roundRect: safeRoundRect,
    drawBadge: drawBadge
  };

})();
