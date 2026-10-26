# 🧩 Puzzle PNG Generator
### by Royal Technologies

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

> Generate **10 types of educational puzzles** as beautiful **1080×1080 PNG images** — no build tools, pure vanilla JS.

---

## ✨ Features

- 🧩 **10 puzzle types** — Geometry, Sudoku, Number Sequence, Matchstick, Logic, Visual Pattern, Missing Number, Visual IQ, Word & Rebus, Clock & Time
- 🖼️ **1080×1080 PNG export** — print-ready, social-media-ready images
- 🎯 **3 difficulty levels** — Easy, Medium, Hard
- 🎨 **Modern UI** — dark theme, gradient accents, responsive layout
- ⚡ **No build tools** — open `index.html` in any browser and go
- 🏷️ **Branded output** — every PNG is watermarked with Royal Technologies credit

---

## 📸 Screenshots

> _Screenshot coming soon — open the app and generate your first puzzle!_

---

## 🚀 Usage

1. **Clone or download** this repository
2. **Open** `index.html` in any modern browser (Chrome, Firefox, Edge)
3. **Select** a puzzle type from the tabs
4. **Choose** a difficulty (Easy / Medium / Hard)
5. **Choose** a subtype from the dropdown
6. **Click** 🎲 **Generate Puzzle**
7. **Click** 📥 **Export PNG** to download the 1080×1080 image

> No server required. No npm install. No build step.

---

## 🧩 Puzzle Types

| # | Type | Subtypes |
|---|------|----------|
| 1 | **Geometry** | Missing Angle, Area Calculation, Perimeter, Pythagorean, Circle Properties |
| 2 | **Sudoku** | 4×4 Easy, 6×6 Medium, 9×9 Classic, Diagonal Sudoku |
| 3 | **Number Sequence** | Arithmetic, Geometric, Fibonacci-style, Mixed Operations |
| 4 | **Matchstick** | Move Matchstick, Remove Matchstick, Add Matchstick, Equation Fix |
| 5 | **Logic** | Truth Table, Syllogism, Pattern Deduction, River Crossing |
| 6 | **Visual Pattern** | Shape Matrix, Color Pattern, Rotation, Odd-One-Out |
| 7 | **Missing Number** | Grid, Triangle, Circle, Square |
| 8 | **Visual IQ** | Analogy, Mirror Image, Paper Fold, Cube Net |
| 9 | **Word & Rebus** | Word Scramble, Rebus Puzzle, Wordplay, Acronym |
| 10 | **Clock & Time** | Read the Clock, Time Difference, Calendar Puzzle, Time Zones |

---

## 📁 Project Structure

```
Puzzle/
├── index.html                  # Main single-page app
├── assets/
│   ├── css/
│   │   └── style.css           # All styles (dark theme)
│   └── js/
│       └── app.js              # App shell / orchestration
├── generators/
│   ├── geometry.js             # Geometry puzzle generator
│   ├── sudoku.js               # Sudoku generator
│   ├── number-sequence.js      # Number sequence generator
│   ├── matchstick.js           # Matchstick puzzle generator
│   ├── logic.js                # Logic puzzle generator
│   ├── visual-pattern.js       # Visual pattern generator
│   ├── missing-number.js       # Missing number generator
│   ├── visual-iq.js            # Visual IQ generator
│   ├── word-puzzle.js          # Word & rebus generator
│   └── clock-calendar.js       # Clock & time generator
├── templates/
│   └── modern-clean.js         # Canvas layout/template renderer
├── export/
│   └── png-export.js           # PNG download module
└── README.md
```

---

## 🛠️ Adding a New Puzzle Generator

Each generator must expose a global object:

```js
window.MyGenerator = {
  name: 'My Puzzle Type',
  subtypes: [
    { value: 'type-a', label: 'Type A' },
    { value: 'type-b', label: 'Type B' },
  ],
  generate(subtype, difficulty) {
    return {
      type:        'my-type',
      subtype:     subtype,
      difficulty:  difficulty,
      title:       'My Puzzle Title',
      instruction: 'What is the answer?',
      answer:      '42',
      hint:        'Think carefully.',
      renderFn(ctx, x, y, w, h) {
        // Draw puzzle content here using Canvas 2D API
        ctx.fillStyle = '#333';
        ctx.fillText('Hello Puzzle!', x + w/2, y + h/2);
      }
    };
  }
};
```

Then add `<script src="generators/my-generator.js"></script>` to `index.html` and register it in `app.js`.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Credit

Developed with ❤️ by **Royal Technologies**

🌐 [royaltechbd.com](https://www.royaltechbd.com/)

---

> _"Make learning fun — one puzzle at a time."_
