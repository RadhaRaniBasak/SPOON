<div align="center">

# Spoon

### A calm, neuro-inclusive workspace built on Spoon Theory.
**Plan your day with your energy, not against it.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

 
 [Report a Bug](https://github.com/RadhaRaniBasak/RHYTHM/issues)

<!-- Replace with a real screenshot or GIF -->

</div>

---

## Table of Contents

- [Why Spoon](#why-spoon)
- [What is Spoon Theory?](#what-is-spoon-theory)
- [Features](#features)
- [Design Principles](#design-principles)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Accessibility](#accessibility)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Why Spoon

Most productivity tools assume you wake up with the same energy every day. A to-do list doesn't know you slept badly, are in pain, or spent yesterday masking at work. It just grows, and when you can't keep up, it makes you feel like you failed.

**Spoon starts from energy, not time.** It asks how you slept and how much you have today, then recommends activities and adjusts the interface to match. It is built for people whose capacity changes from day to day, including those with chronic illness, ADHD, autism, long COVID, burnout, and caregivers.

## What is Spoon Theory?

Spoon Theory was created by **Christine Miserandino** in 2003 to explain what living with chronic illness feels like. Each "spoon" is one unit of energy. Everyday activities such as getting dressed, cooking, commuting, and socializing each cost spoons, and when they're gone, they're gone. Borrowing from tomorrow is possible, but it has a price. Spoon turns that metaphor into a planning tool.

## Features

| Feature | What it does |
|---|---|
| **Personal hero card** | A "Hello, name" greeting with an astronaut illustration and orbit rings that sets a calm tone for the day |
| **Sleep and pace check-in** | Log your sleep quality and choose a pace mode (for example, Low-Effort) so the day matches your actual capacity |
| **Recommended activities** | Gentle suggestions grouped by category, such as Focus and Move, filtered to your pace |
| **One-line capture** | Write one or more activities in a single sentence; the multi-task sentence splitter turns it into separate, organized cards |
| **Quick Start (5-minute flow)** | Begin any activity with a five-minute flow bar and no commitment beyond it, to beat the hardest part: starting |
| **Brown noise shield** | A 380 Hz brown-noise sound shield synthesized live in the browser with the Web Audio API, with no audio files |
| **Mood calendar** | A monthly calendar with hand-drawn mood faces (Blueberry, Green Sprout, Sunny Yellow) for pressure-free reflection |
| **Saved for Later** | Park activities without deleting them or marking them as failed |

## Design Principles

1. **Energy is the unit, not time.** Plan in capacity first, hours second.
2. **The interface should never cost energy.** Fewer clicks and fewer decisions when you have less to give.
3. **No guilt.** No streaks, no failure states, no "overdue".
4. **Quiet visuals.** No confetti, no noisy badges, no literal spoon graphics.
5. **Gentle motion.** Slow, soft transitions that respect `prefers-reduced-motion`.
6. **The user stays in control.** Every adaptation is a suggestion, never a lock.

### Palette

| Name | Hex | Use |
|---|---|---|
| Botanical Sage | `#7C9070` | Primary accents, calm highlights |
| Forest | `#354939` | Headings, deep surfaces |
| Warm Stone | `#EAE8E1` | Backgrounds, cards |
| Charcoal | `#404040` | Body text |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Audio | Web Audio API (procedural noise synthesis) |

## Getting Started

### Prerequisites

- Node.js **18.17** or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/RadhaRaniBasak/RHYTHM.git
cd RHYTHM

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:3000**. No API keys or environment variables are needed to run Spoon locally.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the codebase |

## Project Structure

```
RHYTHM/
├── app/          # Next.js App Router: pages, layouts, global styles
├── lib/          # Pure helpers (activity logic, parsing, audio)
├── store/        # Zustand store: activities, pace mode, sleep, calendar
├── types/        # Shared TypeScript types
├── LICENSE
├── package.json
└── tsconfig.json
```

## Architecture

- **One source of truth.** App state lives in a Zustand store. Recommendations, pace mode, and the calendar all read from it, so the interface cannot drift out of sync.
- **Pure logic is separate from UI.** Parsing and activity logic live in `lib/` as plain functions that are easy to reason about and test.
- **Procedural audio.** Sound is generated in the browser with the Web Audio API, so there is nothing to download and it works offline.
- **Typed end to end.** Shared types in `types/` keep store, logic, and UI consistent.

## Accessibility

Spoon is designed for people whose capacity changes, so accessibility is a core requirement:

- Respects `prefers-reduced-motion`
- Keyboard navigation with visible focus states
- Semantic HTML and ARIA labels
- Low-contrast-risk palette choices checked against WCAG 2.1 AA
- Neutral, low-pressure wording throughout

## Roadmap

**Executive-function support**
- [ ] **Pick one for me**: one tap dims all other cards and opens Quick Start for the best-fitting activity
- [ ] **Transition bridge**: a calm 60-second reset card when the next activity is in a different category
- [ ] **Voice capture**: a microphone in the capture bar using the browser's Web Speech API

**Sensory and time awareness**
- [ ] **Sound profiles**: warm brown, soft pink, and an optional binaural theta pulse
- [ ] **Time-horizon arc**: orbit rings that show how much of the day remains
- [ ] **Breath pacer**: an optional 4-7-8 breathing circle inside Quick Start

**Guilt-free continuity**
- [ ] **Calendar day inspector**: tap a date to see that day's sleep, completed activities, and pace mode
- [ ] **Wrap up today**: one tap moves unfinished tasks to Saved for Later with a reassuring summary

## FAQ

**Is Spoon a medical tool?**
No. It is a planning and pacing tool inspired by Spoon Theory. It does not diagnose, treat, or monitor any condition and is not a substitute for professional care.

**What does "neuro-inclusive" mean here?**
The interface is designed around executive-function and sensory needs. It does not read brain activity.

**Why energy instead of time?**
For many people, energy is the limiting resource. Two tasks that take the same time can cost very different amounts of energy.

**A note on voice capture (planned).**
Browser speech recognition may send audio to a cloud service depending on the browser. Spoon will always offer typing as an equal alternative.

## Contributing

Ideas and feedback are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Acknowledgements

- **Christine Miserandino**, creator of [Spoon Theory](https://butyoudontlooksick.com/articles/written-by-christine/the-spoon-theory/)
- The chronic illness, disability, and neurodivergent communities who keep this metaphor alive
- The maintainers of Next.js, React, Tailwind CSS, Zustand, Framer Motion, and Lucide

## License

Released under the **MIT License**. See [`LICENSE`](LICENSE).

<div align="center">

*Made with care, for every kind of energy.*

</div>
