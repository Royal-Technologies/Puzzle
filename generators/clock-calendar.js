/**
 * Clock, Calendar & Time Puzzles Generator
 * Subtypes: read-clock, time-elapsed, day-calculation, calendar-puzzle, time-zones
 */
'use strict';

window.ClockCalendarGenerator = {
  name: 'Clock, Calendar & Time Puzzles',
  subtypes: [
    { value: 'read-clock',      label: 'Read the Analog Clock' },
    { value: 'time-elapsed',    label: 'Elapsed Time Calculation' },
    { value: 'day-calculation', label: 'Day of the Week Calculation' },
    { value: 'calendar-puzzle', label: 'Calendar Month Riddle' },
    { value: 'time-zones',      label: 'World Time Zones' }
  ],

  generate(subtype, difficulty) {
    switch (subtype) {
      case 'read-clock': return this._genReadClock(difficulty);
      case 'time-elapsed': return this._genTimeElapsed(difficulty);
      case 'day-calculation': return this._genDayCalc(difficulty);
      case 'calendar-puzzle': return this._genCalendar(difficulty);
      case 'time-zones': return this._genTimeZones(difficulty);
      default: return this._genReadClock(difficulty);
    }
  },

  _genReadClock(diff) {
    const hours = 3;
    const minutes = 20;

    return {
      type: 'clock-calendar',
      subtype: 'read-clock',
      difficulty: diff,
      title: 'Analog Clock Time',
      instruction: 'Look at the positions of the hour and minute hands. What time is shown?',
      answer: '3:20 (or 20 past 3)',
      hint: 'The short hand points slightly past 3, the long minute hand points at 4 (4 × 5 = 20 min).',
      renderFn: (ctx, x, y, w, h) => {
        const cx = x + w / 2;
        const cy = y + h / 2 - 20;
        const radius = 170;

        // Dial
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hour marks & numbers
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let num = 1; num <= 12; num++) {
          const ang = (num * Math.PI) / 6;
          const nx = cx + Math.sin(ang) * (radius - 35);
          const ny = cy - Math.cos(ang) * (radius - 35);
          ctx.fillText(num.toString(), nx, ny);
        }

        // Hour hand (at 3:20 => 3 + 20/60 = 3.33 => 100 degrees)
        const hourAng = (hours + minutes / 60) * (Math.PI / 6);
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(hourAng) * (radius * 0.5), cy - Math.cos(hourAng) * (radius * 0.5));
        ctx.stroke();

        // Minute hand (at 20 min => 120 degrees)
        const minAng = minutes * (Math.PI / 30);
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(minAng) * (radius * 0.75), cy - Math.cos(minAng) * (radius * 0.75));
        ctx.stroke();

        // Center pin
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  },

  _genTimeElapsed(diff) {
    return {
      type: 'clock-calendar',
      subtype: 'time-elapsed',
      difficulty: diff,
      title: 'Elapsed Time Riddle',
      instruction: 'A train departed at 08:45 AM and reached its destination at 01:15 PM. How long was the journey?',
      answer: '4 hours and 30 minutes',
      hint: 'Calculate time from 8:45 AM to 12:00 PM (3h 15m), then add 1h 15m.',
      renderFn: (ctx, x, y, w, h) => {
        const startX = x + 160;
        const cy = y + h / 2 - 30;

        // Departure box
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(startX, cy - 60, 240, 120, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1E3A8A';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DEPARTURE', startX + 120, cy - 25);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('08:45 AM', startX + 120, cy + 25);

        // Arrow
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 44px Arial';
        ctx.fillText('➔', x + w / 2, cy);

        // Arrival box
        const endX = x + w - 400;
        ctx.beginPath();
        ctx.roundRect(endX, cy - 60, 240, 120, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('ARRIVAL', endX + 120, cy - 25);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('01:15 PM', endX + 120, cy + 25);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('Elapsed Duration = ?', x + w / 2, cy + 120);
      }
    };
  },

  _genDayCalc(diff) {
    return {
      type: 'clock-calendar',
      subtype: 'day-calculation',
      difficulty: diff,
      title: 'Day of the Week Calculation',
      instruction: 'If today is Wednesday, what day of the week will it be exactly 45 days from today?',
      answer: 'Sunday (45 ÷ 7 = 6 weeks remainder 3 days; Wednesday + 3 days = Sunday)',
      hint: 'Divide the number of days by 7 and find the remainder.',
      renderFn: (ctx, x, y, w, h) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const cardW = 95, cardH = 90, gap = 12;
        const totalW = 7 * cardW + 6 * gap;
        const startX = x + (w - totalW) / 2;
        const cy = y + h / 2 - 50;

        days.forEach((day, i) => {
          const bx = startX + i * (cardW + gap);
          const isToday = (day === 'Wed');

          ctx.fillStyle = isToday ? '#DC2626' : '#FFFFFF';
          ctx.strokeStyle = '#1E3A8A';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(bx, cy, cardW, cardH, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isToday ? '#FFFFFF' : '#0F172A';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(day, bx + cardW / 2, cy + 50);

          if (isToday) {
            ctx.fillStyle = '#DC2626';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('TODAY', bx + cardW / 2, cy - 15);
          }
        });

        ctx.fillStyle = '#1E3A8A';
        ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+ 45 Days = What Day?', x + w / 2, cy + 150);
      }
    };
  },

  _genCalendar(diff) {
    return {
      type: 'clock-calendar',
      subtype: 'calendar-puzzle',
      difficulty: diff,
      title: 'Calendar Month Logic',
      instruction: 'In a certain month, exactly 3 Tuesdays fall on even dates. What day of the week is the 21st of that month?',
      answer: 'Sunday (The 5 Tuesdays must fall on dates 2, 9, 16, 23, 30. If Tuesday is the 23rd, 21st is Sunday)',
      hint: 'A month can have at most 5 Tuesdays. To have 3 even Tuesdays, the first Tuesday must be the 2nd.',
      renderFn: (ctx, x, y, w, h) => {
        const cardX = x + 100;
        const cardY = y + 50;
        const cardW = w - 200;
        const cardH = h - 140;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1E3A8A';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🗓️ MONTHLY CALENDAR RIDDLE', cardX + cardW / 2, cardY + 60);

        ctx.fillStyle = '#0F172A';
        ctx.font = '600 28px "Segoe UI", Arial, sans-serif';
        ctx.fillText('Condition: Exactly 3 Tuesdays fall on even dates.', cardX + cardW / 2, cardY + 140);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('What day of the week is the 21st?', cardX + cardW / 2, cardY + 220);
      }
    };
  },

  _genTimeZones(diff) {
    return {
      type: 'clock-calendar',
      subtype: 'time-zones',
      difficulty: diff,
      title: 'Global Time Zone Challenge',
      instruction: 'If it is 03:00 PM in London (UTC +0), what time is it in Tokyo (UTC +9)?',
      answer: '12:00 Midnight (same night)',
      hint: 'Add 9 hours to 3:00 PM (15:00 + 9:00 = 24:00 midnight).',
      renderFn: (ctx, x, y, w, h) => {
        const startX = x + 140;
        const cy = y + h / 2 - 30;

        // London
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(startX, cy - 70, 260, 140, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1E3A8A';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LONDON (UTC +0)', startX + 130, cy - 30);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 40px Arial';
        ctx.fillText('03:00 PM', startX + 130, cy + 30);

        // Arrow
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('+ 9 Hours ➔', x + w / 2, cy);

        // Tokyo
        const endX = x + w - 400;
        ctx.beginPath();
        ctx.roundRect(endX, cy - 70, 260, 140, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('TOKYO (UTC +9)', endX + 130, cy - 30);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 44px Arial';
        ctx.fillText('?', endX + 130, cy + 30);
      }
    };
  }
};
