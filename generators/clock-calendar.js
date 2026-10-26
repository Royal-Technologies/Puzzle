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
      const depHour = Math.floor(Math.random() * 8) + 1; // 1 to 8
      const depMin = [0, 15, 20, 30, 45, 50][Math.floor(Math.random() * 6)];
      const durHours = Math.floor(Math.random() * 4) + 3; // 3 to 6 hours
      const durMins = [15, 20, 30, 40, 45][Math.floor(Math.random() * 5)];

      const totalDepMinutes = depHour * 60 + depMin;
      const totalArrMinutes = totalDepMinutes + durHours * 60 + durMins;

      let arrHour24 = Math.floor(totalArrMinutes / 60);
      const arrMin = totalArrMinutes % 60;

      const formatTime = (h, m, isPM) => {
        const hh = h % 12 === 0 ? 12 : h % 12;
        const mm = m < 10 ? '0' + m : m;
        return `${hh < 10 ? '0' + hh : hh}:${mm} ${isPM ? 'PM' : 'AM'}`;
      };

      const depStr = formatTime(depHour, depMin, false); // AM
      const arrStr = formatTime(arrHour24, arrMin, arrHour24 >= 12); // PM

      const durStr = `${durHours} hour${durHours > 1 ? 's' : ''} ${durMins} minutes`;

      return {
        type: 'clock-calendar',
        subtype: 'time-elapsed',
        difficulty: diff,
        title: 'Elapsed Time Calculation',
        instruction: `A flight departed at ${depStr} and arrived at ${arrStr}. How long was the flight?`,
        answer: durStr,
        hint: `Break into steps: count the hours first, then the remaining minutes.`,
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
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillText(depStr, startX + 130, cy + 25);

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
          ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
          ctx.fillText(arrStr, endX + 130, cy + 25);

          // Duration Prompt
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 34px "Segoe UI", Arial, sans-serif';
          ctx.fillText('Total Duration = ?', x + w / 2, cy + 130);
        }
      };
    },

    // ── 3. Day of the Week (Dynamic Day & Number) ──
    _genDayCalc: function (diff) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const startIdx = Math.floor(Math.random() * 7);
      const startDay = days[startIdx];
      const startShort = shortDays[startIdx];

      const addDays = Math.floor(Math.random() * 60) + 18;
      const targetIdx = (startIdx + (addDays % 7)) % 7;
      const targetDay = days[targetIdx];

      return {
        type: 'clock-calendar',
        subtype: 'day-calculation',
        difficulty: diff,
        title: 'Day of the Week Calculation',
        instruction: `If today is ${startDay}, what day of the week will it be exactly ${addDays} days from today?`,
        answer: `${targetDay} (${addDays} ÷ 7 = ${Math.floor(addDays / 7)} weeks with remainder ${addDays % 7} days)`,
        hint: `Divide ${addDays} by 7 and count forward by the remainder (${addDays % 7} days from ${startDay}).`,
        renderFn: function (ctx, x, y, w, h) {
          const cardW = 95, cardH = 90, gap = 12;
          const totalW = 7 * cardW + 6 * gap;
          const startX = x + (w - totalW) / 2;
          const cy = y + h / 2 - 50;

          shortDays.forEach((day, i) => {
            const bx = startX + i * (cardW + gap);
            const isToday = (i === startIdx);

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
          ctx.fillText(`Today (${startDay}) + ${addDays} Days = What Day?`, x + w / 2, cy + 150);
        }
      };
    },

    // ── 4. Calendar Riddle (Diverse Pool) ──
    _genCalendar: function (diff) {
      const riddles = [
        {
          title: 'Condition: Exactly 3 Tuesdays fall on even dates.',
          q: 'In a 31-day month, exactly 3 Tuesdays fall on even dates. What day is the 21st?',
          a: 'Sunday (Tuesdays are on dates 2, 9, 16, 23, 30. If 23rd is Tuesday, 21st is Sunday)',
          h: 'A month has at most 5 Tuesdays. To get 3 even Tuesdays, the 1st Tuesday must fall on the 2nd.'
        },
        {
          title: 'Condition: 5 Fridays, 5 Saturdays, and 5 Sundays in a month.',
          q: 'A month has 5 Fridays, 5 Saturdays, and 5 Sundays. What day is the 1st of this month?',
          a: 'Friday (A 31-day month has 3 days that appear 5 times. These must be dates 1, 2, and 3)',
          h: '31 days = 4 weeks + 3 extra days. Those 3 days are the 1st, 2nd, and 3rd of the month.'
        },
        {
          title: 'Condition: Month begins on a Wednesday.',
          q: 'A 30-day month begins on a Wednesday. What day of the week is the last day of the month?',
          a: 'Thursday (30 ÷ 7 = 4 weeks + 2 days; 1st = Wed, 2nd = Thu, so 30th = Thu)',
          h: 'Calculate 30 mod 7 = 2.'
        },
        {
          title: 'Condition: Leap Year February.',
          q: 'In a leap year, February 1st is a Monday. What day of the week is March 1st?',
          a: 'Tuesday (February has 29 days in a leap year; 29 mod 7 = 1 day forward)',
          h: 'Remember that leap year February has 29 days.'
        }
      ];

      const r = riddles[Math.floor(Math.random() * riddles.length)];

      return {
        type: 'clock-calendar',
        subtype: 'calendar-puzzle',
        difficulty: diff,
        title: 'Calendar Month Logic',
        instruction: r.q,
        answer: r.a,
        hint: r.h,
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
          ctx.font = '600 24px "Segoe UI", Arial, sans-serif';
          ctx.fillText(r.title, cardX + cardW / 2, cardY + 135);

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
          ctx.fillText(r.q.split('.')[0] + '?', cardX + cardW / 2, cardY + 210);
        }
      };
    },

    // ── 5. Time Zones (Diverse City Pairs) ──
    _genTimeZones: function (diff) {
      const pairs = [
        { c1: 'LONDON (UTC +0)', c2: 'TOKYO (UTC +9)', t1: '03:00 PM', diffHours: 9, t2: '12:00 Midnight', label: '+ 9 Hours' },
        { c1: 'NEW YORK (UTC -5)', c2: 'PARIS (UTC +1)', t1: '10:00 AM', diffHours: 6, t2: '04:00 PM', label: '+ 6 Hours' },
        { c1: 'DHAKA (UTC +6)', c2: 'SYDNEY (UTC +10)', t1: '01:00 PM', diffHours: 4, t2: '05:00 PM', label: '+ 4 Hours' },
        { c1: 'DUBAI (UTC +4)', c2: 'NEW YORK (UTC -5)', t1: '06:00 PM', diffHours: -9, t2: '09:00 AM', label: '- 9 Hours' },
        { c1: 'TOKYO (UTC +9)', c2: 'LOS ANGELES (UTC -8)', t1: '11:00 AM', diffHours: -17, t2: '06:00 PM (Prev Day)', label: '- 17 Hours' }
      ];

      const p = pairs[Math.floor(Math.random() * pairs.length)];

      return {
        type: 'clock-calendar',
        subtype: 'time-zones',
        difficulty: diff,
        title: 'Global Time Zone Challenge',
        instruction: `If it is ${p.t1} in ${p.c1.split(' ')[0]}, what time is it in ${p.c2.split(' ')[0]}?`,
        answer: p.t2,
        hint: `Apply the timezone difference: ${p.label}.`,
        renderFn: function (ctx, x, y, w, h) {
          const startX = x + 100;
          const cy = y + h / 2 - 30;

          // Origin City
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, startX, cy - 70, 270, 140, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(p.c1, startX + 135, cy - 28);
          ctx.fillStyle = '#1E3A8A';
          ctx.font = 'bold 36px Arial';
          ctx.fillText(p.t1, startX + 135, cy + 30);

          // Arrow with offset
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 30px Arial';
          ctx.fillText(p.label + ' ➔', x + w / 2, cy);

          // Destination City
          const endX = x + w - 370;
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3;
          safeRoundRect(ctx, endX, cy - 70, 270, 140, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 20px Arial';
          ctx.fillText(p.c2, endX + 135, cy - 28);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 44px Arial';
          ctx.fillText('?', endX + 135, cy + 30);
        }
      };
    }
  };

})();
