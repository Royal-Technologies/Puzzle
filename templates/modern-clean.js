/* ============================================================
   Bright Path Puzzle Template (1080×1080 px)
   Royal Noor Architectural & Scenic System
   20 Distinct Layout Architectures × 10 Royal Color Themes = 200 Unique Variations
   Brand: Bright Path | Royal Technologies (royaltechbd.com)
   ============================================================ */

'use strict';

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const exported = factory();
    module.exports = exported;
    if (typeof global !== 'undefined') {
      global.ModernCleanTemplate = exported;
      global.RoyalPuzzleTemplate = exported;
      if (global.window) {
        global.window.ModernCleanTemplate = exported;
        global.window.RoyalPuzzleTemplate = exported;
      }
    }
  } else {
    const exported = factory();
    root.ModernCleanTemplate = exported;
    root.RoyalPuzzleTemplate = exported;
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const W = 1080;
  const H = 1080;

  // ═════════════════════════════════════════════════════════════════
  // 1. TEN DISTINCT ROYAL COLOR THEMES (১০টি কালার থিম)
  // ═════════════════════════════════════════════════════════════════
  const THEMES = {
    'royal-emerald': {
      key: 'royal-emerald',
      name: 'পান্না সবুজ (Royal Emerald)',
      bgGrad: ['#011710', '#05291E', '#093E2F'],
      cardBg: '#042118',
      primaryGold: '#E5C383',
      secondaryGold: '#BF9546',
      accentGold: '#F9ECCE',
      banglaColor: '#FAF6EE',
      metaColor: '#D8BF89',
      borderColor: 'rgba(229, 195, 131, 0.45)',
      subtleLine: 'rgba(229, 195, 131, 0.18)',
      badgeBg: 'rgba(229, 195, 131, 0.15)',
      badgeBorder: 'rgba(229, 195, 131, 0.35)',
      badgeText: '#F9ECCE',
      isDark: true
    },
    'midnight-navy': {
      key: 'midnight-navy',
      name: 'গভীর নীলকান্ত (Midnight Navy)',
      bgGrad: ['#030C1A', '#081A36', '#0E2850'],
      cardBg: '#071830',
      primaryGold: '#EAC875',
      secondaryGold: '#C59E3F',
      accentGold: '#FDF2D4',
      banglaColor: '#F1F5F9',
      metaColor: '#D4B365',
      borderColor: 'rgba(234, 200, 117, 0.45)',
      subtleLine: 'rgba(234, 200, 117, 0.18)',
      badgeBg: 'rgba(234, 200, 117, 0.15)',
      badgeBorder: 'rgba(234, 200, 117, 0.35)',
      badgeText: '#FDF2D4',
      isDark: true
    },
    'imperial-black': {
      key: 'imperial-black',
      name: 'কাবার গিলাফ ও সোনা (Imperial Onyx)',
      bgGrad: ['#07080A', '#0F1116', '#171A21'],
      cardBg: '#0C0E13',
      primaryGold: '#F5D77F',
      secondaryGold: '#C99E32',
      accentGold: '#FFF4D6',
      banglaColor: '#FAF9F6',
      metaColor: '#D9B45C',
      borderColor: 'rgba(245, 215, 127, 0.5)',
      subtleLine: 'rgba(245, 215, 127, 0.18)',
      badgeBg: 'rgba(245, 215, 127, 0.15)',
      badgeBorder: 'rgba(245, 215, 127, 0.38)',
      badgeText: '#FFF4D6',
      isDark: true
    },
    'warm-parchment': {
      key: 'warm-parchment',
      name: 'মদিনা পাণ্ডুলিপি (Illuminated Parchment)',
      bgGrad: ['#1E1610', '#2E2218', '#3F2F22'],
      cardBg: '#F8F3E6',
      primaryGold: '#946E26',
      secondaryGold: '#6A4A0E',
      accentGold: '#B8892E',
      banglaColor: '#2B1E14',
      metaColor: '#6B4D18',
      borderColor: 'rgba(148, 110, 38, 0.4)',
      subtleLine: 'rgba(148, 110, 38, 0.2)',
      badgeBg: 'rgba(148, 110, 38, 0.1)',
      badgeBorder: 'rgba(148, 110, 38, 0.32)',
      badgeText: '#6A4A0E',
      isDark: false
    },
    'royal-maroon': {
      key: 'royal-maroon',
      name: 'দামেস্ক মেরুন (Damascus Crimson)',
      bgGrad: ['#1A040B', '#2D0A16', '#441223'],
      cardBg: '#22060F',
      primaryGold: '#F2CB75',
      secondaryGold: '#D49D34',
      accentGold: '#FCEECC',
      banglaColor: '#FDF5EC',
      metaColor: '#DEB059',
      borderColor: 'rgba(242, 203, 117, 0.45)',
      subtleLine: 'rgba(242, 203, 117, 0.18)',
      badgeBg: 'rgba(242, 203, 117, 0.15)',
      badgeBorder: 'rgba(242, 203, 117, 0.35)',
      badgeText: '#FCEECC',
      isDark: true
    },
    'ottoman-turquoise': {
      key: 'ottoman-turquoise',
      name: 'অটোমান ফিরোজা (Ottoman Turquoise)',
      bgGrad: ['#021B21', '#062F38', '#0A4652'],
      cardBg: '#04262E',
      primaryGold: '#62E5D5',
      secondaryGold: '#E5C370',
      accentGold: '#FBF3D4',
      banglaColor: '#EFFFFD',
      metaColor: '#52D4C4',
      borderColor: 'rgba(98, 229, 213, 0.42)',
      subtleLine: 'rgba(98, 229, 213, 0.18)',
      badgeBg: 'rgba(98, 229, 213, 0.15)',
      badgeBorder: 'rgba(98, 229, 213, 0.35)',
      badgeText: '#FBF3D4',
      isDark: true
    },
    'desert-amber': {
      key: 'desert-amber',
      name: 'মরু জাফরান ও অ্যাম্বার (Hijaz Amber)',
      bgGrad: ['#1F0E04', '#361808', '#4F260E'],
      cardBg: '#271105',
      primaryGold: '#F7BA45',
      secondaryGold: '#DC8D24',
      accentGold: '#FCE7B8',
      banglaColor: '#FAF4EC',
      metaColor: '#DE9837',
      borderColor: 'rgba(247, 186, 69, 0.45)',
      subtleLine: 'rgba(247, 186, 69, 0.18)',
      badgeBg: 'rgba(247, 186, 69, 0.15)',
      badgeBorder: 'rgba(247, 186, 69, 0.35)',
      badgeText: '#FCE7B8',
      isDark: true
    },
    'amethyst-violet': {
      key: 'amethyst-violet',
      name: 'রাজকীয় বেগুনি (Royal Amethyst)',
      bgGrad: ['#12071E', '#200D35', '#32164F'],
      cardBg: '#1A0B2A',
      primaryGold: '#EFD48E',
      secondaryGold: '#CFA64F',
      accentGold: '#F9EED4',
      banglaColor: '#F8F3FC',
      metaColor: '#D8B568',
      borderColor: 'rgba(239, 212, 142, 0.45)',
      subtleLine: 'rgba(239, 212, 142, 0.18)',
      badgeBg: 'rgba(239, 212, 142, 0.15)',
      badgeBorder: 'rgba(239, 212, 142, 0.35)',
      badgeText: '#F9EED4',
      isDark: true
    },
    'andalusian-olive': {
      key: 'andalusian-olive',
      name: 'আন্দালুসীয় অলিভ (Moorish Olive)',
      bgGrad: ['#071A12', '#0D2B1F', '#164230'],
      cardBg: '#092218',
      primaryGold: '#E7C67E',
      secondaryGold: '#BA943E',
      accentGold: '#F8EED5',
      banglaColor: '#FAF7F0',
      metaColor: '#D2AD5E',
      borderColor: 'rgba(231, 198, 126, 0.45)',
      subtleLine: 'rgba(231, 198, 126, 0.18)',
      badgeBg: 'rgba(231, 198, 126, 0.15)',
      badgeBorder: 'rgba(231, 198, 126, 0.35)',
      badgeText: '#F8EED5',
      isDark: true
    },
    'classic-ivory': {
      key: 'classic-ivory',
      name: 'শুভ্র মুক্তা আইভরি (Classic Pearl Ivory)',
      bgGrad: ['#161B22', '#21262D', '#30363D'],
      cardBg: '#FCFAF5',
      primaryGold: '#967228',
      secondaryGold: '#705315',
      accentGold: '#BD9645',
      banglaColor: '#172420',
      metaColor: '#705315',
      borderColor: 'rgba(150, 114, 40, 0.42)',
      subtleLine: 'rgba(150, 114, 40, 0.2)',
      badgeBg: 'rgba(150, 114, 40, 0.1)',
      badgeBorder: 'rgba(150, 114, 40, 0.32)',
      badgeText: '#705315',
      isDark: false
    }
  };

  const THEME_KEYS = Object.keys(THEMES);

  // ═════════════════════════════════════════════════════════════════
  // 2. TWENTY DISTINCT ARCHITECTURAL & SCENIC LAYOUTS (২০টি ডিজাইন)
  // ═════════════════════════════════════════════════════════════════
  const LAYOUTS = {
    // 🏛️ 1-10: Architectural Royal Frames
    'mihrab-arch': {
      key: 'mihrab-arch',
      name: '১. মেহরাব আর্চ (Mihrab Sanctuary Arch)',
      desc: 'মসজিদের মেহরাব ও খিলান অনুপ্রাণিত স্থাপত্য ফ্রেম'
    },
    'royal-minimal': {
      key: 'royal-minimal',
      name: '২. রাজকীয় মিনিমালিজম (Royal Modern Luxury)',
      desc: 'আধুনিক সূক্ষ্ম গোল্ডেন লাইন ও মিনিমাল আর্কিটেকচার'
    },
    'geometric-mandala': {
      key: 'geometric-mandala',
      name: '৩. ইসলামিক রজেট ও মান্ডালা (Sacred Rosette)',
      desc: 'কেন্দ্রীয় ১৬-কোণা ইসলামিক জ্যামিতিক রজেট ও নক্ষত্র'
    },
    'illuminated-manuscript': {
      key: 'illuminated-manuscript',
      name: '৪. মদিনা পাণ্ডুলিপি ফ্রেম (Illuminated Manuscript)',
      desc: 'পবিত্র কোরআনের প্রাচীন পাণ্ডুলিপি ও স্বর্ণালী কারতুশ'
    },
    'iznik-tiles': {
      key: 'iznik-tiles',
      name: '৫. অটোমান ইজনিক টাইলস (Ottoman Iznik Border)',
      desc: 'অটোমান প্রাসাদ ও মসজিদের জ্যামিতিক টাইলস সীমানা'
    },
    'architectural-pillars': {
      key: 'architectural-pillars',
      name: '৬. রাজকীয় স্তম্ভ ও তোরণ (Royal Twin Pillars)',
      desc: 'দুই পাশের মহিমান্বিত স্বর্ণস্তম্ভ ও উপরের রাজতোরণ'
    },
    'celestial-crescent': {
      key: 'celestial-crescent',
      name: '৭. হিলাল ও সেলিস্টিয়াল গ্যালাক্সি (Celestial Crescent)',
      desc: 'উজ্জ্বল স্বর্ণালী অর্ধচন্দ্র ও তারকাময় স্বর্গীয় আবহ'
    },
    'alhambra-palace': {
      key: 'alhambra-palace',
      name: '৮. আন্দালুসীয় আলহামব্রা (Alhambra Arabesque)',
      desc: 'আলহামব্রা প্রাসাদের বহু-খাঁজযুক্ত খিলান ও লতাপাতা'
    },
    'octagram-medallion': {
      key: 'octagram-medallion',
      name: '৯. আটকোণা মেডেলিয়ন (Rub el Hizb Seal)',
      desc: 'আটকোণা চ্যাম্ফার্ড বর্ডার ও পবিত্র রুব-এল-হিজব সিল'
    },
    'kiswah-gold-ribbon': {
      key: 'kiswah-gold-ribbon',
      name: '১০. কাবার গিলাফ স্বর্ণসূত্র ফিতা (Kiswah Silk Ribbon)',
      desc: 'কাবার গিলাফের অনুকরণে প্রশস্ত স্বর্ণলতা ফিতা ফ্রেম'
    },

    // 🌄 11-20: Royal Scenic & Artistic Backgrounds
    'scenic-mountain-twilight': {
      key: 'scenic-mountain-twilight',
      name: '১১. গোধূলি বেলার পাহাড় (Mountain Twilight)',
      desc: 'গোলাপী ও বেগুনি গোধূলি আকাশের নিচে দূর পাহাড়ের স্তরীভূত ছায়া'
    },
    'scenic-kaaba-parchment': {
      key: 'scenic-kaaba-parchment',
      name: '১২. ভিন্টেজ কাবা পাণ্ডুলিপি (Kaaba Vintage Sketch)',
      desc: 'প্রাচীন পাণ্ডুলিপির ওপর পবিত্র কাবা শরীফ ও মিনারের শৈল্পিক স্কেচ'
    },
    'scenic-rehal-quran': {
      key: 'scenic-rehal-quran',
      name: '১৩. কাঠের রেহাল ও কোরআন (Rehal & Quran Studio)',
      desc: 'কাঠের রেহালে উন্মুক্ত পবিত্র কোরআন ও আধুনিক মিনিমালিস্ট ফ্রেম'
    },
    'scenic-desert-stars': {
      key: 'scenic-desert-stars',
      name: '১৪. তারকাময় মরুভূমি (Desert Dunes & Stars)',
      desc: 'গভীর রাতের তারকাময় আকাশ ও আলোকিত মরু বালিয়াড়ি'
    },
    'scenic-golden-clouds': {
      key: 'scenic-golden-clouds',
      name: '১৫. সোনালী সূর্যাস্ত মেঘমালা (Golden Sunset Clouds)',
      desc: 'গোধূলির সোনালী সূর্যরশ্মি ও মোহময় মেঘমালার আবহ'
    },
    'scenic-mosque-dusk': {
      key: 'scenic-mosque-dusk',
      name: '১৬. গোধূলি মসজিদ গম্বুজ (Mosque Dome at Dusk)',
      desc: 'গভীর নীল গোধূলি আকাশে মহিমান্বিত মসজিদ গম্বুজ ও মিনারের অবয়ব'
    },
    'scenic-medina-sanctuary': {
      key: 'scenic-medina-sanctuary',
      name: '১৭. মদিনার শ্যামলিম প্রাঙ্গণ (Medina Emerald Sanctuary)',
      desc: 'মদিনার শ্যামলিম আবহ, সোনালী নূর ও পবিত্র জ্যামিতিক আভা'
    },
    'scenic-alabaster-gold': {
      key: 'scenic-alabaster-gold',
      name: '১৮. শুভ্র আইভরি ও সোনা (Alabaster Minimal Gold)',
      desc: 'শুভ্র শ্বেতশুভ্র ব্যাকগ্রাউন্ড ও সূক্ষ্ম ২৪ ক্যারেট স্বর্ণালী কারুকাজ'
    },
    'scenic-crimson-horizon': {
      key: 'scenic-crimson-horizon',
      name: '১৯. রক্তিম দামেস্ক দিগন্ত (Crimson Dusk Horizon)',
      desc: 'গোধূলির রক্তিম দিগন্ত ও দূর খেজুরবাগানের ছায়াময় দৃশ্য'
    },
    'scenic-kiswah-night': {
      key: 'scenic-kiswah-night',
      name: '২০. কাবার কালো রেশম (Kiswah Midnight Silk)',
      desc: 'কাবার গিলাফের খাঁটি কালো রেশম ও সোনালী হরফের এমব্রয়ডারি'
    }
  };

  const LAYOUT_KEYS = Object.keys(LAYOUTS);

  // Backward-compatible mapping for legacy bgTheme options
  const LEGACY_THEME_MAP = {
    'cream-paper':    { theme: 'warm-parchment',   layout: 'illuminated-manuscript' },
    'clean-white':    { theme: 'classic-ivory',    layout: 'royal-minimal' },
    'dark-slate':     { theme: 'midnight-navy',    layout: 'scenic-desert-stars' }
  };

  const DIFF_COLORS = {
    easy:   '#10B981',
    medium: '#F59E0B',
    hard:   '#EF4444'
  };

  // ═════════════════════════════════════════════════════════════════
  // 3. VECTOR DRAWING PRIMITIVES (জিরো গ্লিফ / পিওর ক্যানভাস)
  // ═════════════════════════════════════════════════════════════════

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

  function drawIslamicStar(ctx, cx, cy, outerRadius, innerRadius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    const points = 8;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawCrescentMoon(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -0.4 * Math.PI, 0.6 * Math.PI, false);
    ctx.arc(cx + r * 0.42, cy - r * 0.15, r * 0.88, 0.6 * Math.PI, -0.4 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawCornerBrackets(ctx, x, y, w, h, size, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    // Top-left
    ctx.beginPath(); ctx.moveTo(x, y + size); ctx.lineTo(x, y); ctx.lineTo(x + size, y); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(x + w - size, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + size); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(x, y + h - size); ctx.lineTo(x, y + h); ctx.lineTo(x + size, y + h); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(x + w - size, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - size); ctx.stroke();
    ctx.restore();
  }

  function drawBadge(ctx, text, x, y, bgColor, textColor, borderColor) {
    ctx.save();
    ctx.font = 'bold 15px Inter, "Segoe UI", Arial, sans-serif';
    const textW = ctx.measureText(text).width;
    const padX = 16, padY = 6;
    const bw = textW + padX * 2;
    const bh = 28;

    ctx.fillStyle = bgColor;
    safeRoundRect(ctx, x, y, bw, bh, bh / 2);
    ctx.fill();
    if (borderColor) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + bw / 2, y + bh / 2 + 1);
    ctx.restore();
    return bw;
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

  // ═════════════════════════════════════════════════════════════════
  // 4. SCENIC BACKGROUNDS (১০টি সিনিক ব্যাকগ্রাউন্ড)
  // ═════════════════════════════════════════════════════════════════

  function renderScenicBackground(ctx, layoutKey, cardX, cardY, cardW, cardH) {
    ctx.save();
    safeRoundRect(ctx, cardX, cardY, cardW, cardH, 22);
    ctx.clip();

    switch (layoutKey) {
      // 11. Mountain Twilight
      case 'scenic-mountain-twilight': {
        const sky = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        sky.addColorStop(0, '#E76F51');
        sky.addColorStop(0.25, '#C7517E');
        sky.addColorStop(0.55, '#56357A');
        sky.addColorStop(0.85, '#1B1A47');
        sky.addColorStop(1, '#0C0C24');
        ctx.fillStyle = sky;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Distant Mountain Ridge
        ctx.fillStyle = 'rgba(40, 24, 75, 0.6)';
        ctx.beginPath();
        ctx.moveTo(cardX, cardY + cardH - 140);
        ctx.bezierCurveTo(cardX + 200, cardY + cardH - 260, cardX + 450, cardY + cardH - 160, cardX + 650, cardY + cardH - 240);
        ctx.bezierCurveTo(cardX + 800, cardY + cardH - 290, cardX + 900, cardY + cardH - 180, cardX + cardW, cardY + cardH - 210);
        ctx.lineTo(cardX + cardW, cardY + cardH);
        ctx.lineTo(cardX, cardY + cardH);
        ctx.fill();

        // Mid Mountain Ridge
        ctx.fillStyle = 'rgba(24, 15, 48, 0.85)';
        ctx.beginPath();
        ctx.moveTo(cardX, cardY + cardH - 80);
        ctx.bezierCurveTo(cardX + 280, cardY + cardH - 170, cardX + 500, cardY + cardH - 100, cardX + 750, cardY + cardH - 180);
        ctx.bezierCurveTo(cardX + 880, cardY + cardH - 220, cardX + 940, cardY + cardH - 130, cardX + cardW, cardY + cardH - 140);
        ctx.lineTo(cardX + cardW, cardY + cardH);
        ctx.lineTo(cardX, cardY + cardH);
        ctx.fill();

        // Foreground Mountain Ridge
        ctx.fillStyle = '#0B0818';
        ctx.beginPath();
        ctx.moveTo(cardX, cardY + cardH);
        ctx.lineTo(cardX, cardY + cardH - 40);
        ctx.bezierCurveTo(cardX + 300, cardY + cardH - 90, cardX + 600, cardY + cardH - 50, cardX + cardW, cardY + cardH - 85);
        ctx.lineTo(cardX + cardW, cardY + cardH);
        ctx.fill();

        // Center reading vignette
        const vig = ctx.createRadialGradient(W / 2, H / 2 + 20, 100, W / 2, H / 2 + 20, 480);
        vig.addColorStop(0, 'rgba(10, 8, 26, 0.2)');
        vig.addColorStop(1, 'rgba(10, 8, 26, 0.65)');
        ctx.fillStyle = vig;
        ctx.fillRect(cardX, cardY, cardW, cardH);
        break;
      }

      // 12. Kaaba Vintage Parchment
      case 'scenic-kaaba-parchment': {
        const bg = ctx.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 540);
        bg.addColorStop(0, '#FAF5EC');
        bg.addColorStop(0.6, '#F2E8D7');
        bg.addColorStop(1, '#E2D1B8');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Delicate Kaaba Vector Sketch
        ctx.save();
        ctx.strokeStyle = 'rgba(109, 76, 39, 0.55)';
        ctx.fillStyle = 'rgba(109, 76, 39, 0.12)';
        ctx.lineWidth = 1.6;

        const kX = W / 2;
        const kY = cardY + 95;
        // Front face
        ctx.beginPath();
        ctx.moveTo(kX, kY + 28);
        ctx.lineTo(kX - 30, kY + 12);
        ctx.lineTo(kX - 30, kY - 20);
        ctx.lineTo(kX, kY - 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Side face
        ctx.beginPath();
        ctx.moveTo(kX, kY + 28);
        ctx.lineTo(kX + 30, kY + 12);
        ctx.lineTo(kX + 30, kY - 20);
        ctx.lineTo(kX, kY - 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top face
        ctx.beginPath();
        ctx.moveTo(kX, kY - 6);
        ctx.lineTo(kX - 30, kY - 20);
        ctx.lineTo(kX, kY - 34);
        ctx.lineTo(kX + 30, kY - 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden band
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(kX - 30, kY - 10);
        ctx.lineTo(kX, kY + 3);
        ctx.lineTo(kX + 30, kY - 10);
        ctx.stroke();
        ctx.restore();
        break;
      }

      // 13. Rehal & Quran Studio
      case 'scenic-rehal-quran': {
        const bg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        bg.addColorStop(0, '#383236');
        bg.addColorStop(0.5, '#252023');
        bg.addColorStop(1, '#151214');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Open book vector
        ctx.save();
        const rX = W / 2;
        const rY = cardY + 95;
        ctx.strokeStyle = '#D4AF37';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 1.8;

        // Left page
        ctx.beginPath();
        ctx.moveTo(rX, rY + 6);
        ctx.bezierCurveTo(rX - 25, rY - 12, rX - 50, rY - 6, rX - 56, rY - 22);
        ctx.lineTo(rX - 56, rY - 40);
        ctx.bezierCurveTo(rX - 50, rY - 26, rX - 25, rY - 30, rX, rY - 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right page
        ctx.beginPath();
        ctx.moveTo(rX, rY + 6);
        ctx.bezierCurveTo(rX + 25, rY - 12, rX + 50, rY - 6, rX + 56, rY - 22);
        ctx.lineTo(rX + 56, rY - 40);
        ctx.bezierCurveTo(rX + 50, rY - 26, rX + 25, rY - 30, rX, rY - 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        break;
      }

      // 14. Desert Dunes & Starfield
      case 'scenic-desert-stars': {
        const sky = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        sky.addColorStop(0, '#060A18');
        sky.addColorStop(0.4, '#0F1838');
        sky.addColorStop(0.7, '#1E234D');
        sky.addColorStop(1, '#0C0A14');
        ctx.fillStyle = sky;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Starfield dots
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        const stars = [
          [120, 100, 1.8], [240, 140, 1.2], [380, 80, 2.2], [520, 130, 1.4], [700, 95, 2.0], [850, 120, 1.5],
          [180, 220, 1.4], [310, 280, 1.8], [490, 240, 1.2], [660, 270, 2.4], [820, 230, 1.3], [930, 260, 1.9],
          [150, 360, 1.5], [400, 390, 1.2], [760, 380, 1.6], [880, 350, 2.0]
        ];
        stars.forEach(([sx, sy, sr]) => {
          ctx.beginPath();
          ctx.arc(cardX + sx * (cardW / 1000), cardY + sy * (cardH / 1000), sr, 0, Math.PI * 2);
          ctx.fill();
        });

        // Golden Crescent Moon
        drawCrescentMoon(ctx, cardX + cardW - 110, cardY + 95, 18, '#F5D77F');
        ctx.restore();

        // Sand Dunes
        ctx.fillStyle = 'rgba(38, 24, 16, 0.9)';
        ctx.beginPath();
        ctx.moveTo(cardX, cardY + cardH - 120);
        ctx.bezierCurveTo(cardX + 240, cardY + cardH - 190, cardX + 500, cardY + cardH - 130, cardX + 720, cardY + cardH - 180);
        ctx.bezierCurveTo(cardX + 860, cardY + cardH - 210, cardX + 930, cardY + cardH - 150, cardX + cardW, cardY + cardH - 160);
        ctx.lineTo(cardX + cardW, cardY + cardH);
        ctx.lineTo(cardX, cardY + cardH);
        ctx.fill();
        break;
      }

      // 15. Golden Sunset Clouds
      case 'scenic-golden-clouds': {
        const bg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        bg.addColorStop(0, '#F59E0B');
        bg.addColorStop(0.35, '#EA580C');
        bg.addColorStop(0.65, '#991B1B');
        bg.addColorStop(0.9, '#450A0A');
        bg.addColorStop(1, '#1C0608');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Radiant Sunburst Glow
        const sun = ctx.createRadialGradient(W / 2, cardY + cardH - 160, 20, W / 2, cardY + cardH - 160, 360);
        sun.addColorStop(0, 'rgba(254, 243, 199, 0.55)');
        sun.addColorStop(0.4, 'rgba(245, 158, 11, 0.35)');
        sun.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sun;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Soft cloud silhouettes
        ctx.fillStyle = 'rgba(30, 10, 14, 0.65)';
        ctx.beginPath();
        ctx.arc(cardX + 200, cardY + cardH - 90, 90, 0, Math.PI * 2);
        ctx.arc(cardX + 320, cardY + cardH - 110, 120, 0, Math.PI * 2);
        ctx.arc(cardX + 500, cardY + cardH - 95, 110, 0, Math.PI * 2);
        ctx.arc(cardX + 680, cardY + cardH - 120, 130, 0, Math.PI * 2);
        ctx.arc(cardX + 840, cardY + cardH - 85, 100, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // 16. Mosque Dome at Dusk
      case 'scenic-mosque-dusk': {
        const sky = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        sky.addColorStop(0, '#0A1128');
        sky.addColorStop(0.4, '#1C2541');
        sky.addColorStop(0.7, '#3A506B');
        sky.addColorStop(1, '#0B132B');
        ctx.fillStyle = sky;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Central Dome
        ctx.save();
        ctx.fillStyle = '#060B18';
        const mX = W / 2;
        const mY = cardY + cardH;

        ctx.beginPath();
        ctx.arc(mX, mY - 50, 110, Math.PI, 0);
        ctx.lineTo(mX + 110, mY);
        ctx.lineTo(mX - 110, mY);
        ctx.fill();

        // Moon in sky
        drawCrescentMoon(ctx, cardX + 110, cardY + 95, 18, '#F5D77F');
        ctx.restore();
        break;
      }

      // 17. Medina Emerald Sanctuary
      case 'scenic-medina-sanctuary': {
        const bg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        bg.addColorStop(0, '#011F16');
        bg.addColorStop(0.5, '#053E2C');
        bg.addColorStop(1, '#021811');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Halo
        const halo = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 450);
        halo.addColorStop(0, 'rgba(46, 213, 115, 0.12)');
        halo.addColorStop(0.5, 'rgba(212, 175, 55, 0.08)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = halo;
        ctx.fillRect(cardX, cardY, cardW, cardH);
        break;
      }

      // 18. Alabaster Minimal Gold
      case 'scenic-alabaster-gold': {
        const bg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        bg.addColorStop(0, '#FFFFFF');
        bg.addColorStop(0.5, '#F8FAFC');
        bg.addColorStop(1, '#F1F5F9');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);
        break;
      }

      // 19. Crimson Dusk Horizon
      case 'scenic-crimson-horizon': {
        const bg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        bg.addColorStop(0, '#38060E');
        bg.addColorStop(0.4, '#7F1D1D');
        bg.addColorStop(0.7, '#991B1B');
        bg.addColorStop(0.9, '#450A0A');
        bg.addColorStop(1, '#1A0407');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Distant Palm Silhouettes
        ctx.save();
        ctx.fillStyle = '#120204';
        const pY = cardY + cardH;
        ctx.fillRect(cardX, pY - 30, cardW, 30);
        const palmPositions = [cardX + 110, cardX + 160, cardX + cardW - 140];
        palmPositions.forEach(px => {
          ctx.fillRect(px, pY - 90, 5, 65);
          ctx.beginPath();
          ctx.arc(px + 2.5, pY - 90, 20, 0, Math.PI);
          ctx.fill();
        });
        ctx.restore();
        break;
      }

      // 20. Kiswah Midnight Silk
      case 'scenic-kiswah-night': {
        const bg = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        bg.addColorStop(0, '#07080A');
        bg.addColorStop(0.5, '#12141A');
        bg.addColorStop(1, '#08090C');
        ctx.fillStyle = bg;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Gold-Thread Kiswah Embroidery Band
        ctx.save();
        const bandY = cardY + 95;
        const bandH = 40;
        ctx.fillStyle = 'rgba(212, 175, 55, 0.16)';
        ctx.fillRect(cardX + 24, bandY, cardW - 48, bandH);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(cardX + 24, bandY, cardW - 48, bandH);
        ctx.restore();
        break;
      }
    }

    ctx.restore();
  }

  // ═════════════════════════════════════════════════════════════════
  // 5. ARCHITECTURAL FRAMES (১০টি স্থাপত্য ফ্রেম)
  // ═════════════════════════════════════════════════════════════════

  function renderLayoutFrame(ctx, layoutKey, theme, cardX, cardY, cardW, cardH) {
    ctx.save();

    // Scenic Photo Frames
    if (layoutKey.startsWith('scenic-')) {
      if (layoutKey === 'scenic-kaaba-parchment' || layoutKey === 'scenic-alabaster-gold') {
        ctx.strokeStyle = layoutKey === 'scenic-alabaster-gold' ? 'rgba(212, 175, 55, 0.65)' : 'rgba(109, 76, 39, 0.45)';
        ctx.lineWidth = 1.5;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();
        drawCornerBrackets(ctx, cardX + 24, cardY + 24, cardW - 48, cardH - 48, 24, '#D4AF37');
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(cardX + 16, cardY + 16, cardW - 32, cardH - 32);
        // Corner tick accents
        const cL = 20;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(cardX + 12, cardY + 16 + cL); ctx.lineTo(cardX + 16, cardY + 16); ctx.lineTo(cardX + 16 + cL, cardY + 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cardX + cardW - 16 - cL, cardY + 12); ctx.lineTo(cardX + cardW - 16, cardY + 16); ctx.lineTo(cardX + cardW - 12, cardY + 16 + cL); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cardX + 12, cardY + cardH - 16 - cL); ctx.lineTo(cardX + 16, cardY + cardH - 16); ctx.lineTo(cardX + 16 + cL, cardY + cardH - 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cardX + cardW - 16 - cL, cardY + cardH - 12); ctx.lineTo(cardX + cardW - 16, cardY + cardH - 16); ctx.lineTo(cardX + cardW - 12, cardY + cardH - 16 - cL); ctx.stroke();
      }
      ctx.restore();
      return;
    }

    switch (layoutKey) {
      // 1. Mihrab Arch
      case 'mihrab-arch': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();

        const archL = cardX + 80;
        const archR = cardX + cardW - 80;
        const archBase = cardY + 220;
        const archApex = cardY + 36;
        ctx.beginPath();
        ctx.moveTo(archL, archBase);
        ctx.lineTo(archL, cardY + 120);
        ctx.bezierCurveTo(archL - 10, archApex + 20, W / 2 - 50, archApex - 10, W / 2, archApex - 10);
        ctx.bezierCurveTo(W / 2 + 50, archApex - 10, archR + 10, archApex + 20, archR, cardY + 120);
        ctx.lineTo(archR, archBase);
        ctx.stroke();

        drawIslamicStar(ctx, W / 2, archApex - 10, 6, 3, theme.primaryGold);
        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 32, theme.primaryGold);
        break;
      }

      // 2. Royal Minimal
      case 'royal-minimal': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(cardX + 18, cardY + 18, cardW - 36, cardH - 36);

        ctx.strokeStyle = theme.subtleLine;
        ctx.lineWidth = 1;
        ctx.strokeRect(cardX + 24, cardY + 24, cardW - 48, cardH - 48);

        const corners = [
          [cardX + 21, cardY + 21],
          [cardX + cardW - 21, cardY + 21],
          [cardX + 21, cardY + cardH - 21],
          [cardX + cardW - 21, cardY + cardH - 21]
        ];
        corners.forEach(([cx, cy]) => {
          ctx.fillStyle = theme.primaryGold;
          ctx.fillRect(cx - 3, cy - 3, 6, 6);
        });
        break;
      }

      // 3. Geometric Mandala
      case 'geometric-mandala': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();

        ctx.save();
        ctx.strokeStyle = theme.subtleLine;
        ctx.lineWidth = 1.2;
        for (let angle = 0; angle < Math.PI; angle += Math.PI / 8) {
          ctx.beginPath();
          const r = 52;
          ctx.ellipse(W / 2, cardY + 85, r, r / 3, angle, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        drawIslamicStar(ctx, W / 2, cardY + 85, 9, 4.5, theme.primaryGold);
        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 34, theme.primaryGold);
        break;
      }

      // 4. Illuminated Manuscript
      case 'illuminated-manuscript': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2.4;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 14);
        ctx.stroke();

        ctx.strokeStyle = theme.subtleLine;
        ctx.lineWidth = 1;
        safeRoundRect(ctx, cardX + 20, cardY + 20, cardW - 40, cardH - 40, 10);
        ctx.stroke();

        // Decorative cartouche band
        ctx.fillStyle = theme.badgeBg;
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 1.2;
        safeRoundRect(ctx, cardX + 70, cardY + 36, cardW - 140, 56, 8);
        ctx.fill();
        ctx.stroke();

        drawIslamicStar(ctx, cardX + 85, cardY + 64, 6, 3, theme.primaryGold);
        drawIslamicStar(ctx, cardX + cardW - 85, cardY + 64, 6, 3, theme.primaryGold);
        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 36, theme.primaryGold);
        break;
      }

      // 5. Iznik Tiles
      case 'iznik-tiles': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 1.5;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();

        const step = 60;
        for (let x = cardX + 50; x <= cardX + cardW - 50; x += step) {
          drawIslamicStar(ctx, x, cardY + 20, 3, 1.5, theme.primaryGold);
          drawIslamicStar(ctx, x, cardY + cardH - 20, 3, 1.5, theme.primaryGold);
        }
        for (let y = cardY + 50; y <= cardY + cardH - 50; y += step) {
          drawIslamicStar(ctx, cardX + 20, y, 3, 1.5, theme.primaryGold);
          drawIslamicStar(ctx, cardX + cardW - 20, y, 3, 1.5, theme.primaryGold);
        }
        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 32, theme.primaryGold);
        break;
      }

      // 6. Architectural Pillars
      case 'architectural-pillars': {
        const pLeft = cardX + 38;
        const pRight = cardX + cardW - 38;
        const pTop = cardY + 30;
        const pBottom = cardY + cardH - 30;

        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 1.8;

        ctx.strokeRect(pLeft - 6, pTop, 12, pBottom - pTop);
        ctx.strokeRect(pLeft - 11, pTop - 6, 22, 8);
        ctx.strokeRect(pLeft - 11, pBottom - 2, 22, 8);

        ctx.strokeRect(pRight - 6, pTop, 12, pBottom - pTop);
        ctx.strokeRect(pRight - 11, pTop - 6, 22, 8);
        ctx.strokeRect(pRight - 11, pBottom - 2, 22, 8);

        ctx.beginPath();
        ctx.moveTo(pLeft + 11, pTop - 2);
        ctx.bezierCurveTo(pLeft + 80, pTop - 20, pRight - 80, pTop - 20, pRight - 11, pTop - 2);
        ctx.stroke();

        drawIslamicStar(ctx, W / 2, pTop - 14, 6, 3, theme.primaryGold);
        break;
      }

      // 7. Celestial Crescent
      case 'celestial-crescent': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();

        drawCrescentMoon(ctx, W / 2 - 140, cardY + 68, 11, theme.primaryGold);
        drawIslamicStar(ctx, W / 2 - 128, cardY + 68, 5, 2.5, theme.accentGold);
        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 30, theme.primaryGold);
        break;
      }

      // 8. Alhambra Palace
      case 'alhambra-palace': {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();

        const lobeY = cardY + 98;
        ctx.beginPath();
        ctx.moveTo(cardX + 60, lobeY);
        const lobeStep = (cardW - 120) / 5;
        for (let i = 0; i < 5; i++) {
          const lx = cardX + 60 + i * lobeStep;
          ctx.bezierCurveTo(lx + lobeStep * 0.2, lobeY - 26, lx + lobeStep * 0.8, lobeY - 26, lx + lobeStep, lobeY);
        }
        ctx.stroke();

        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 34, theme.primaryGold);
        break;
      }

      // 9. Octagram Medallion
      case 'octagram-medallion': {
        const ch = 22;
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cardX + 14 + ch, cardY + 14);
        ctx.lineTo(cardX + cardW - 14 - ch, cardY + 14);
        ctx.lineTo(cardX + cardW - 14, cardY + 14 + ch);
        ctx.lineTo(cardX + cardW - 14, cardY + cardH - 14 - ch);
        ctx.lineTo(cardX + cardW - 14 - ch, cardY + cardH - 14);
        ctx.lineTo(cardX + 14 + ch, cardY + cardH - 14);
        ctx.lineTo(cardX + 14, cardY + cardH - 14 - ch);
        ctx.lineTo(cardX + 14, cardY + 14 + ch);
        ctx.closePath();
        ctx.stroke();

        const cornerSeals = [
          [cardX + 26, cardY + 26],
          [cardX + cardW - 26, cardY + 26],
          [cardX + 26, cardY + cardH - 26],
          [cardX + cardW - 26, cardY + cardH - 26]
        ];
        cornerSeals.forEach(([cx, cy]) => {
          drawIslamicStar(ctx, cx, cy, 5.5, 2.8, theme.primaryGold);
        });
        break;
      }

      // 10. Kiswah Gold Ribbon
      case 'kiswah-gold-ribbon':
      default: {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 2;
        safeRoundRect(ctx, cardX + 14, cardY + 14, cardW - 28, cardH - 28, 16);
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = theme.badgeBg;
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = 1;
        ctx.fillRect(cardX + 35, cardY + 35, cardW - 70, 48);
        ctx.strokeRect(cardX + 35, cardY + 35, cardW - 70, 48);
        ctx.restore();

        drawCornerBrackets(ctx, cardX + 26, cardY + 26, cardW - 52, cardH - 52, 34, theme.primaryGold);
        break;
      }
    }

    ctx.restore();
  }

  // ═════════════════════════════════════════════════════════════════
  // 6. ARCHITECTURAL DIVIDERS (ডিভাইডার আর্ট)
  // ═════════════════════════════════════════════════════════════════

  function renderLayoutDivider(ctx, layoutKey, theme, sepY) {
    ctx.save();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1.2;

    switch (layoutKey) {
      case 'royal-minimal': {
        ctx.beginPath();
        ctx.moveTo(W / 2 - 120, sepY);
        ctx.lineTo(W / 2 - 25, sepY);
        ctx.moveTo(W / 2 + 25, sepY);
        ctx.lineTo(W / 2 + 120, sepY);
        ctx.stroke();
        drawIslamicStar(ctx, W / 2, sepY, 6, 3, theme.primaryGold);
        break;
      }
      case 'geometric-mandala': {
        ctx.beginPath();
        ctx.moveTo(W / 2 - 180, sepY);
        ctx.lineTo(W / 2 - 40, sepY);
        ctx.moveTo(W / 2 + 40, sepY);
        ctx.lineTo(W / 2 + 180, sepY);
        ctx.stroke();
        drawIslamicStar(ctx, W / 2, sepY, 10, 5, theme.primaryGold);
        drawIslamicStar(ctx, W / 2 - 24, sepY, 4.5, 2.2, theme.secondaryGold);
        drawIslamicStar(ctx, W / 2 + 24, sepY, 4.5, 2.2, theme.secondaryGold);
        break;
      }
      case 'celestial-crescent': {
        ctx.beginPath();
        ctx.moveTo(W / 2 - 160, sepY);
        ctx.lineTo(W / 2 - 30, sepY);
        ctx.moveTo(W / 2 + 30, sepY);
        ctx.lineTo(W / 2 + 160, sepY);
        ctx.stroke();
        drawCrescentMoon(ctx, W / 2 - 12, sepY, 6, theme.primaryGold);
        drawIslamicStar(ctx, W / 2 + 12, sepY, 5, 2.5, theme.accentGold);
        break;
      }
      default: {
        ctx.beginPath();
        ctx.moveTo(W / 2 - 180, sepY);
        ctx.lineTo(W / 2 - 36, sepY);
        ctx.stroke();

        drawIslamicStar(ctx, W / 2, sepY, 8.5, 4.2, theme.primaryGold);
        drawIslamicStar(ctx, W / 2 - 22, sepY, 4, 2, theme.secondaryGold);
        drawIslamicStar(ctx, W / 2 + 22, sepY, 4, 2, theme.secondaryGold);

        ctx.beginPath();
        ctx.moveTo(W / 2 + 36, sepY);
        ctx.lineTo(W / 2 + 180, sepY);
        ctx.stroke();
        break;
      }
    }

    ctx.restore();
  }

  // ═════════════════════════════════════════════════════════════════
  // 7. MAIN RENDER FUNCTION (20 Layouts × 10 Themes = 200 Variations)
  // ═════════════════════════════════════════════════════════════════

  function render(canvas, puzzleData, options) {
    options = options || {};

    // 1. Resolve Theme and Layout
    let themeKey = options.theme;
    let layoutKey = options.layout;

    // Handle legacy options.bgTheme (e.g. 'cream-paper', 'dark-slate')
    if (!themeKey && options.bgTheme && LEGACY_THEME_MAP[options.bgTheme]) {
      themeKey = LEGACY_THEME_MAP[options.bgTheme].theme;
      if (!layoutKey) layoutKey = LEGACY_THEME_MAP[options.bgTheme].layout;
    }

    // Default to random selection across all 200 variations if omitted or set to 'random'
    if (!layoutKey || layoutKey === 'random' || !LAYOUTS[layoutKey]) {
      const rIdx = Math.floor(Math.random() * LAYOUT_KEYS.length);
      layoutKey = LAYOUT_KEYS[rIdx];
    }
    if (!themeKey || themeKey === 'random' || !THEMES[themeKey]) {
      const rIdx = Math.floor(Math.random() * THEME_KEYS.length);
      themeKey = THEME_KEYS[rIdx];
    }

    let theme = THEMES[themeKey] || THEMES['royal-emerald'];

    // Dynamic contrast tweaks for light scenic styles
    if (layoutKey === 'scenic-kaaba-parchment') {
      theme = Object.assign({}, theme, {
        primaryGold: '#8B6538',
        secondaryGold: '#6D4C27',
        accentGold: '#B8892E',
        banglaColor: '#3D2817',
        metaColor: '#6D4C27',
        badgeBg: 'rgba(109, 76, 39, 0.12)',
        badgeBorder: 'rgba(109, 76, 39, 0.35)',
        badgeText: '#4A3219',
        isDark: false
      });
    } else if (layoutKey === 'scenic-alabaster-gold') {
      theme = Object.assign({}, theme, {
        primaryGold: '#D97706',
        secondaryGold: '#B45309',
        accentGold: '#F59E0B',
        banglaColor: '#0F172A',
        metaColor: '#047857',
        badgeBg: 'rgba(217, 119, 6, 0.12)',
        badgeBorder: 'rgba(217, 119, 6, 0.35)',
        badgeText: '#92400E',
        isDark: false
      });
    } else if (layoutKey.startsWith('scenic-')) {
      theme = Object.assign({}, theme, {
        primaryGold: '#F59E0B',
        secondaryGold: '#D97706',
        accentGold: '#FDE68A',
        banglaColor: '#FFFFFF',
        metaColor: '#FBBF24',
        badgeBg: 'rgba(255, 255, 255, 0.16)',
        badgeBorder: 'rgba(255, 255, 255, 0.35)',
        badgeText: '#FFFBEB',
        isDark: true
      });
    }

    const titleMode = options.titleMode || 'nopen';
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // 2. Outer Canvas Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, theme.bgGrad[0]);
    bgGrad.addColorStop(0.5, theme.bgGrad[1]);
    bgGrad.addColorStop(1, theme.bgGrad[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 3. Royal Main Card
    const cardX = 44;
    const cardY = 44;
    const cardW = W - 88; // 992
    const cardH = H - 88; // 992

    // Card Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 12;

    if (layoutKey === 'octagram-medallion') {
      const ch = 26;
      ctx.beginPath();
      ctx.moveTo(cardX + ch, cardY);
      ctx.lineTo(cardX + cardW - ch, cardY);
      ctx.lineTo(cardX + cardW, cardY + ch);
      ctx.lineTo(cardX + cardW, cardY + cardH - ch);
      ctx.lineTo(cardX + cardW - ch, cardY + cardH);
      ctx.lineTo(cardX + ch, cardY + cardH);
      ctx.lineTo(cardX, cardY + cardH - ch);
      ctx.lineTo(cardX, cardY + ch);
      ctx.closePath();
    } else {
      safeRoundRect(ctx, cardX, cardY, cardW, cardH, 22);
    }

    if (layoutKey.startsWith('scenic-')) {
      renderScenicBackground(ctx, layoutKey, cardX, cardY, cardW, cardH);
    } else {
      ctx.fillStyle = theme.cardBg;
      ctx.fill();
    }
    ctx.restore();

    // 4. Render Architectural Frame & Border Ornaments
    renderLayoutFrame(ctx, layoutKey, theme, cardX, cardY, cardW, cardH);

    // 5. Header Badges: Category (Left) and Difficulty (Right)
    const typeLabel = (puzzleData.type || puzzleData.category || 'PUZZLE').toUpperCase().replace(/-/g, ' ');
    const diff = (puzzleData.difficulty || 'medium').toLowerCase();
    const diffColor = DIFF_COLORS[diff] || DIFF_COLORS.medium;

    const bLeftW = drawBadge(ctx, typeLabel, cardX + 32, cardY + 22, theme.badgeBg, theme.badgeText, theme.badgeBorder);
    drawBadge(ctx, '⚡ ' + diff.toUpperCase(), cardX + cardW - 32 - 110, cardY + 22, diffColor, '#FFFFFF');

    // 6. Header Title Section
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const headerCenterY = cardY + 76;
    if (titleMode === 'nopen') {
      ctx.font = 'bold 38px "Arial Black", Impact, Inter, sans-serif';
      ctx.fillStyle = theme.isDark ? '#FFFFFF' : '#1A1A2E';
      if (theme.isDark) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 8;
      }
      ctx.fillText('NO PEN! NO PAPER!!', W / 2, headerCenterY);
      ctx.shadowBlur = 0;

      ctx.font = 'bold 18px Inter, Arial, sans-serif';
      ctx.fillStyle = theme.primaryGold;
      const sub = (puzzleData.title || 'Brain Teaser').toUpperCase();
      ctx.fillText('✦  ' + sub + '  ✦', W / 2, headerCenterY + 36);
    } else {
      ctx.font = 'bold 36px Inter, Arial, sans-serif';
      ctx.fillStyle = theme.isDark ? '#FFFFFF' : '#1A1A2E';
      if (theme.isDark) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 8;
      }
      ctx.fillText(puzzleData.title || 'Brain Teaser', W / 2, headerCenterY);
      ctx.shadowBlur = 0;

      ctx.font = 'bold 17px Inter, Arial, sans-serif';
      ctx.fillStyle = theme.primaryGold;
      ctx.fillText('✦  BRIGHT PATH • ROYAL TECHNOLOGIES  ✦', W / 2, headerCenterY + 36);
    }
    ctx.restore();

    // 7. Header Decorative Divider
    renderLayoutDivider(ctx, layoutKey, theme, cardY + 130);

    // 8. Instruction Section Banner
    const instY = cardY + 144;
    const instH = 58;
    const instX = cardX + 32;
    const instW = cardW - 64;

    ctx.save();
    ctx.fillStyle = theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
    safeRoundRect(ctx, instX, instY, instW, instH, 10);
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    const instText = puzzleData.instruction || 'Solve the puzzle below:';
    ctx.fillStyle = theme.isDark ? '#FFFFFF' : '#1A1A2E';
    ctx.font = '600 20px Inter, "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, instText, W / 2, instY + instH / 2, instW - 60, 24);
    ctx.restore();

    // 9. Inner Diagram Canvas Board (Pristine High-Contrast Plate)
    // Ensures all 10 generators (geometry, sudoku, clocks, matchsticks, etc.) render with 100% clarity
    const diagX = cardX + 32;
    const diagY = cardY + 214;
    const diagW = cardW - 64; // 928
    const diagH = 680;

    ctx.save();
    // Inner Board Soft Drop Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;

    // Pure white / crisp parchment plate
    ctx.fillStyle = '#FFFFFF';
    safeRoundRect(ctx, diagX, diagY, diagW, diagH, 14);
    ctx.fill();
    ctx.restore();

    // Inner Board Border & Corner Gold Brackets
    ctx.save();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1.5;
    safeRoundRect(ctx, diagX, diagY, diagW, diagH, 14);
    ctx.stroke();

    // Subtle corner brackets on inner board
    drawCornerBrackets(ctx, diagX + 8, diagY + 8, diagW - 16, diagH - 16, 18, theme.primaryGold);

    // Clip strictly within inner diagram area
    ctx.save();
    ctx.beginPath();
    safeRoundRect(ctx, diagX + 4, diagY + 4, diagW - 8, diagH - 8, 10);
    ctx.clip();

    // Call puzzle-specific render function
    if (typeof puzzleData.renderFn === 'function') {
      try {
        puzzleData.renderFn(ctx, diagX + 16, diagY + 16, diagW - 32, diagH - 32);
      } catch (err) {
        console.error('Puzzle render error:', err);
        ctx.fillStyle = '#DC2626';
        ctx.font = '22px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Render error: ' + err.message, W / 2, diagY + diagH / 2);
      }
    }
    ctx.restore();
    ctx.restore();

    // 10. Footer Section
    const footerSepY = diagY + diagH + 16;
    renderLayoutDivider(ctx, layoutKey, theme, footerSepY);

    const footerTextY = footerSepY + 32;
    ctx.save();
    // Left: "✦ Bright Path"
    ctx.fillStyle = theme.primaryGold;
    ctx.font = 'bold 28px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  Bright Path', cardX + 38, footerTextY);

    // Right: "Royal Technologies • royaltechbd.com"
    ctx.fillStyle = theme.metaColor || theme.secondaryGold;
    ctx.font = '500 18px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('Royal Technologies  •  royaltechbd.com', cardX + cardW - 38, footerTextY);
    ctx.restore();

    return {
      layout: layoutKey,
      theme: themeKey,
      layoutInfo: LAYOUTS[layoutKey],
      themeInfo: THEMES[themeKey]
    };
  }

  return {
    LAYOUTS: LAYOUTS,
    LAYOUT_KEYS: LAYOUT_KEYS,
    THEMES: THEMES,
    THEME_KEYS: THEME_KEYS,
    render: render,
    wrapText: wrapText,
    roundRect: safeRoundRect,
    drawBadge: drawBadge,
    drawIslamicStar: drawIslamicStar,
    drawCrescentMoon: drawCrescentMoon,
    drawCornerBrackets: drawCornerBrackets
  };

});
