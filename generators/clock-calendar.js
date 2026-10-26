/**
 * Clock, Calendar & Time Puzzles Generator
 * Subtypes: read-clock, time-elapsed, day-calculation, calendar-puzzle, time-zones
 * Mathematics Marvels | Royal Technologies
 */
'use strict';

window.ClockCalendarGenerator = (function () {

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

  return {
    name: 'Clock, Calendar & Time Puzzles',
    subtypes: [
      { value: 'read-clock',      label: 'Read the Analog Clock' },
      { value: 'time-elapsed',    label: 'Elapsed Time Calculation' },
      { value: 'day-calculation', label: 'Day of the Week Calculation' },
      { value: 'calendar-puzzle', label: 'Calendar Month Riddle' },
      { value: 'time-zones',      label: 'World Time Zones' }
    ],

    generate: function (subtype, difficulty) {
      switch (subtype) {
        case 'read-clock':      return this._genReadClock(difficulty);
        case 'time-elapsed':    return this._genTimeElapsed(difficulty);
        case 'day-calculation': return this._genDayCalc(difficulty);
        case 'calendar-puzzle': return this._genCalendar(difficulty);
        case 'time-zones':      return this._genTimeZones(difficulty);
        default:                return this._genReadClock(difficulty);
      }
    },

    // ── 1. Read Analog Clock ──
    _genReadClock: function (diff) {
      const minuteOptions = diff === 'easy' ? [0, 15, 30, 45] : [5, 10, 20, 25, 35, 40, 50, 55];
      const hours = Math.floor(Math.random() * 12) + 1;
      const minutes = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
      const minStr = minutes < 10 ? '0' + minutes : String(minutes);
      const timeStr = `${hours}:${minStr}`;

      return {
        type: 'clock-calendar',
        subtype: 'read-clock',
        difficulty: diff,
        title: 'Analog Clock Time Challenge',
        instruction: 'Observe the positions of the hour hand (navy) and minute hand (red). What time is shown?',
        answer: `${timeStr} (Hour hand at ${hours}, Minute hand at ${minutes} min)`,
        hint: `Each number on the dial represents 5 minutes (5 × ${Math.round(minutes / 5)} = ${minutes} mins).`,
        renderFn: function (ctx, x, y, w, h) {
          const cx = x + w / 2;
          const cy = y + h / 2 - 20;
          const radius = 175;

          // Dial Outer & Inner
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Subtle ring
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius - 12, 0, Math.PI * 2);
          ctx.stroke();

          // 12 Numbers
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          for (let num = 1; num <= 12; num++) {
            const ang = (num * Math.PI) / 6;
            const nx = cx + Math.sin(ang) * (radius - 36);
            const ny = cy - Math.cos(ang) * (radius - 36);
            ctx.fillText(String(num), nx, ny);
          }

          // 60 Tick marks
          for (let i = 0; i < 60; i++) {
            const ang = (i * Math.PI) / 30;
            const isMajor = i % 5 === 0;
            const innerR = isMajor ? radius - 14 : radius - 8;
            ctx.strokeStyle = isMajor ? '#0F172A' : '#94A3B8';
            ctx.lineWidth = isMajor ? 2.5 : 1;
            ctx.beginPath();
            ctx.moveTo(cx + Math.sin(ang) * innerR, cy - Math.cos(ang) * innerR);
            ctx.lineTo(cx + Math.sin(ang) * (radius - 2), cy - Math.cos(ang) * (radius - 2));
            ctx.stroke();
          }

          // Hour Hand (Navy)
          const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI / 6);
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.sin(hourAngle) * (radius * 0.52), cy - Math.cos(hourAngle) * (radius * 0.52));
          ctx.stroke();

          // Minute Hand (Red)
          const minAngle = minutes * (Math.PI / 30);
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 4.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.sin(minAngle) * (radius * 0.78), cy - Math.cos(minAngle) * (radius * 0.78));
          ctx.stroke();

          // Center Pin
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    },

    // ── 2. Elapsed Time ──
    _genTimeElapsed: function (diff) {
      const scenarios = [
        { dep: '08:45 AM', arr: '01:15 PM', dur: '4 hours 30 minutes', hint: '8:45 AM to 12:00 PM (3h 15m) + 1h 15m = 4h 30m' },
        { dep: '09:20 AM', arr: '02:50 PM', dur: '5 hours 30 minutes', hint: '9:20 AM to 2:20 PM is 5h, then +30m' },
        { dep: '10:15 AM', arr: '04:45 PM', dur: '6 hours 30 minutes', hint: '10:15 to 4:15 is 6 hours, plus 30 minutes' }
      ];
      const sc = scenarios[Math.floor(Math.random() * scenarios.length)];

      return {
        type: 'clock-calendar',
        subtype: 'time-elapsed',
        difficulty: diff,
        title: 'Elapsed Time Calculation',
        instruction: `A flight departed at ${sc.dep} and arrived at ${sc.arr}. How long was the flight?`,
        answer: sc.dur,
        hint: sc.hint,
        renderFn: function (ctx, x, y, w, h) {
          const startX = x + 100;
          const cy = y + h / 2 - 30;

          // Departure Card
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, startX, cy - 70, 260, 140, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🛫 DEPARTURE', startX + 130, cy - 30);
          ctx.fillStyle = '#1E3A8A';
          ctx.font = 'bold 38px "Segoe UI", Arial, sans-serif';
          ctx.fillText(sc.dep, startX + 130, cy + 25);

          // Arrow
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 44px Arial';
          ctx.fillText('➔', x + w / 2, cy);

          // Arrival Card
          const endX = x + w - 360;
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, endX, cy - 70, 260, 140, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
          ctx.fillText('🛬 ARRIVAL', endX + 130, cy - 30);
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 38px "Segoe UI", Arial, sans-serif';
          ctx.fillText(sc.arr, endX + 130, cy + 25);

          // Duration Prompt
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 34px "Segoe UI", Arial, sans-serif';
          ctx.fillText('Total Duration = ?', x + w / 2, cy + 130);
        }
      };
    },

    // ── 3. Day of the Week ──
    _genDayCalc: function (diff) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const addDays = diff === 'easy' ? 25 : 45;
      const startIdx = 2; // Wednesday
      const targetIdx = (startIdx + (addDays % 7)) % 7;
      const targetDay = days[targetIdx];

      return {
        type: 'clock-calendar',
        subtype: 'day-calculation',
        difficulty: diff,
        title: 'Day of the Week Calculation',
        instruction: `If today is Wednesday, what day of the week will it be exactly ${addDays} days from today?`,
        answer: `${targetDay} (${addDays} ÷ 7 = ${Math.floor(addDays / 7)} weeks remainder ${addDays % 7} days)`,
        hint: `Divide ${addDays} by 7 and count forward by the remainder.`,
        renderFn: function (ctx, x, y, w, h) {
          const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const cardW = 95, cardH = 90, gap = 12;
          const totalW = 7 * cardW + 6 * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 50;

          shortDays.forEach((day, i) => {
            const bx = startX + i * (cardW + gap);
            const isToday = (day === 'Wed');

            ctx.fillStyle = isToday ? '#DC2626' : '#FFFFFF';
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 2.5;
            safeRoundRect(ctx, bx, cy, cardW, cardH, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isToday ? '#FFFFFF' : '#0F172A';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(day, bx + cardW / 2, cy + 50);

            if (isToday) {
              ctx.fillStyle = '#DC2626';
              ctx.font = 'bold 18px Arial';
              ctx.fillText('TODAY', bx + cardW / 2, cy - 14);
            }
          });

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Today + ${addDays} Days = What Day?`, x + w / 2, cy + 150);
        }
      };
    },

    // ── 4. Calendar Riddle ──
    _genCalendar: function (diff) {
      return {
        type: 'clock-calendar',
        subtype: 'calendar-puzzle',
        difficulty: diff,
        title: 'Calendar Month Logic',
        instruction: 'In a certain month, exactly 3 Tuesdays fall on even dates. What day of the week is the 21st of that month?',
        answer: 'Sunday (Tuesdays are on dates 2, 9, 16, 23, 30. If 23rd is Tuesday, 21st is Sunday)',
        hint: 'A month has at most 5 Tuesdays. To get 3 even Tuesdays, the 1st Tuesday must fall on the 2nd.',
        renderFn: function (ctx, x, y, w, h) {
          const cardX = x + 80;
          const cardY = y + 40;
          const cardW = w - 160;
          const cardH = h - 120;

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, cardX, cardY, cardW, cardH, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🗓️ MONTHLY CALENDAR RIDDLE', cardX + cardW / 2, cardY + 60);

          ctx.fillStyle = '#334155';
          ctx.font = '600 26px "Segoe UI", Arial, sans-serif';
          ctx.fillText('Condition: Exactly 3 Tuesdays fall on even dates.', cardX + cardW / 2, cardY + 140);

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillText('What day of the week is the 21st?', cardX + cardW / 2, cardY + 220);
        }
      };
    },

    // ── 5. Time Zones ──
    _genTimeZones: function (diff) {
      return {
        type: 'clock-calendar',
        subtype: 'time-zones',
        difficulty: diff,
        title: 'Global Time Zone Challenge',
        instruction: 'If it is 03:00 PM in London (UTC +0), what time is it in Tokyo (UTC +9)?',
        answer: '12:00 Midnight (same night)',
        hint: 'Add 9 hours to 3:00 PM (15:00 + 9:00 = 24:00 midnight).',
        renderFn: function (ctx, x, y, w, h) {
          const startX = x + 100;
          const cy = y + h / 2 - 30;

          // London
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, startX, cy - 70, 270, 140, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 22px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('LONDON (UTC +0)', startX + 135, cy - 28);
          ctx.fillStyle = '#1E3A8A';
          ctx.font = 'bold 40px Arial';
          ctx.fillText('03:00 PM', startX + 135, cy + 30);

          // Arrow
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 34px Arial';
          ctx.fillText('+ 9 Hours ➔', x + w / 2, cy);

          // Tokyo
          const endX = x + w - 370;
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, endX, cy - 70, 270, 140, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 22px Arial';
          ctx.fillText('TOKYO (UTC +9)', endX + 135, cy - 28);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 44px Arial';
          ctx.fillText('?', endX + 135, cy + 30);
        }
      };
    }
  };

})();
