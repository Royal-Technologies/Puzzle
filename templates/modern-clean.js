/* ============================================================
   Mathematics Marvels & Puzzle Template (1080×1080 px)
   Royal Technologies | royaltechbd.com
   ============================================================ */

'use strict';

window.ModernCleanTemplate = (function () {

  const W = 1080;
  const H = 1080;

  // Strict non-overlapping zones
  const HEADER_H    = 140; // 0 -> 140
  const BANNER_Y    = 148;
  const BANNER_H    = 80;  // 148 -> 228
  const CONTENT_X   = 50;
  const CONTENT_Y   = 236; // 236 -> 960 (strictly isolated!)
  const CONTENT_W   = 980;
  const CONTENT_H   = 724;
  const FOOTER_Y    = 968; // 968 -> 1080
  const FOOTER_H    = 112;

  const BG_THEMES = {
    'cream-paper': {
      outerBg: '#0A192F',
      cardBg: '#FAF6EE',
      bannerBg: '#F3ECE0',
      bannerText: '#0F172A',
      headerGrad: ['#0A192F', '#1E3A8A'],
      borderColor: '#D8CEBF',
      paperTexture: true,
      textColor: '#0F172A',
      isDark: false
    },
    'clean-white': {
      outerBg: '#0F172A',
      cardBg: '#FFFFFF',
      bannerBg: '#F1F5F9',
      bannerText: '#0F172A',
      headerGrad: ['#0F172A', '#1E293B'],
      borderColor: '#CBD5E1',
      paperTexture: false,
      textColor: '#0F172A',
      isDark: false
    },
    'warm-parchment': {
      outerBg: '#1C1917',
      cardBg: '#F5EFEB',
      bannerBg: '#E8DFD3',
      bannerText: '#1C1917',
      headerGrad: ['#1C1917', '#44403C'],
      borderColor: '#D7CCC8',
      paperTexture: true,
      textColor: '#1C1917',
      isDark: false
    },
    'dark-slate': {
      outerBg: '#030712',
      cardBg: '#0F172A',
      bannerBg: '#1E293B',
      bannerText: '#F8FAFC',
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

    // 3. Isolated Instruction Banner
    _drawInstructionBanner(ctx, puzzleData, theme);

    // 4. Content Area
    _drawContentCard(ctx, puzzleData, theme);

    // 5. Footer
    _drawFooter(ctx, theme);
  }

  function _drawHeader(ctx, puzzleData, theme, titleMode) {
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, theme.headerGrad[0]);
    grad.addColorStop(1, theme.headerGrad[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Category Badge
    const typeLabel = (puzzleData.type || 'PUZZLE').toUpperCase().replace(/-/g, ' ');
    drawBadge(ctx, typeLabel, 30, 18, 'rgba(255,255,255,0.18)', '#FFFFFF');

    // Difficulty Badge
    const diff = (puzzleData.difficulty || 'medium').toLowerCase();
    const diffColor = DIFF_COLORS[diff] || DIFF_COLORS.medium;
    drawBadge(ctx, '⚡ ' + diff.toUpperCase(), W - 145, 18, diffColor, '#FFFFFF');

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
      ctx.fillText(puzzleData.title || 'Math Puzzle', W / 2, 68);

      ctx.shadowBlur = 0;
      ctx.font = 'bold 20px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FBBF24';
      ctx.fillText('✦  MATHEMATICS MARVELS  ✦', W / 2, 108);
    }
    ctx.restore();

    // Golden accent border line
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, HEADER_H - 3, W, 3);
  }

  function _drawInstructionBanner(ctx, puzzleData, theme) {
    const bx = CONTENT_X;
    const by = BANNER_Y;
    const bw = CONTENT_W;
    const bh = BANNER_H;

    ctx.save();
    ctx.fillStyle = theme.bannerBg;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1.5;
    roundRect(ctx, bx, by, bw, bh, 10);
    ctx.fill();
    ctx.stroke();

    const text = puzzleData.instruction || 'Solve the puzzle below:';
    ctx.fillStyle = theme.bannerText;
    ctx.font = '600 22px Inter, "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, text, bx + bw / 2, by + bh / 2, bw - 60, 28);
    ctx.restore();
  }

  function _drawContentCard(ctx, puzzleData, theme) {
    ctx.save();
    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    roundRect(ctx, CONTENT_X, CONTENT_Y, CONTENT_W, CONTENT_H, 12);
    ctx.fill();
    ctx.stroke();

    if (theme.paperTexture) {
      _applyPaperTexture(ctx, CONTENT_X, CONTENT_Y, CONTENT_W, CONTENT_H);
    }

    // Clip strictly within content card
    ctx.beginPath();
    roundRect(ctx, CONTENT_X + 2, CONTENT_Y + 2, CONTENT_W - 4, CONTENT_H - 4, 10);
    ctx.clip();

    // Call puzzle-specific render function with safe padded dimensions
    if (typeof puzzleData.renderFn === 'function') {
      try {
        puzzleData.renderFn(ctx, CONTENT_X + 20, CONTENT_Y + 20, CONTENT_W - 40, CONTENT_H - 40);
      } catch (err) {
        console.error('Puzzle render error:', err);
        ctx.fillStyle = '#DC2626';
        ctx.font = '24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Render error: ' + err.message, W / 2, CONTENT_Y + CONTENT_H / 2);
      }
    }
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
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  Mathematics Marvels', 60, FOOTER_Y + FOOTER_H / 2);

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

  function roundRect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawBadge(ctx, text, x, y, bgColor, textColor) {
    ctx.save();
    ctx.font = 'bold 16px Inter, "Segoe UI", Arial, sans-serif';
    const textW = ctx.measureText(text).width;
    const padX = 16, padY = 7;
    const bw = textW + padX * 2;
    const bh = 30;

    ctx.fillStyle = bgColor;
    roundRect(ctx, x, y, bw, bh, bh / 2);
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
    roundRect: roundRect,
    drawBadge: drawBadge
  };

})();
