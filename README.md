# Code Tutor

An interactive web application for learning programming through hands-on coding exercises. Write real code, get instant feedback, and master multiple languages from beginner to advanced.

## Supported Languages

- **TypeScript** - JavaScript with syntax for types
- **C#** - Modern, object-oriented language for .NET

## Features

- **Interactive Code Editor** - Monaco editor (same as VS Code) with IntelliSense, autocomplete, and syntax highlighting
- **Instant Feedback** - Run your code and see results immediately with helpful error messages
- **30 Comprehensive Lessons per Language** - Covering beginner, intermediate, and advanced concepts
- **Hands-on Exercises** - Practice what you learn with coding challenges
- **Progress Tracking** - Your progress is saved locally as you complete exercises
- **Hint System** - Get hints when you're stuck on exercises
- **Dark Mode** - Toggle between light and dark themes
- **Search** - Find lessons by keyword (Cmd/Ctrl + K)
- **Glossary** - Quick reference for programming terms with contextual examples
- **Capstone Project** - Build a complete Todo App applying all concepts learned

## Curriculum

Each language includes 30 lessons:

### Beginner (8 lessons)
- Variables & Types
- Type Inference
- Functions/Methods
- Collections & Objects
- Control Flow
- Error Handling
- Web Fundamentals
- Developer Tooling

### Intermediate (10 lessons)
- Interfaces
- Type Aliases
- Union Types / Nullable Types
- Classes & OOP
- Generics
- Type Guards
- Enums & Modules
- Modern Operators
- Functional Programming / LINQ
- Async Programming

### Advanced (7 lessons)
- Advanced Type Features
- Reflection / Attributes
- Extension Methods
- Advanced Patterns
- Dependency Injection
- And more...

### Tests & Capstone (5)
- Beginner Test
- Intermediate Test
- Advanced Test
- Todo App Capstone
- Master Test

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Abaker998/Code-Tutor.git
cd Code-Tutor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Search:** [Fuse.js](https://fusejs.io/)
- **Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [lang]/             # Language-specific routes
│   │   ├── lessons/[slug]/ # Dynamic lesson pages
│   │   ├── glossary/       # Glossary page
│   │   └── page.tsx        # Language home page
│   └── page.tsx            # Landing page (language selection)
├── components/             # React components
│   ├── CodeEditor.tsx      # Monaco code editor
│   ├── OutputPanel.tsx     # Code output display
│   ├── LessonContent.tsx   # Lesson content renderer
│   ├── HintsPanel.tsx      # Hints system
│   ├── SearchBar.tsx       # Search functionality
│   └── ...
├── lessons/                # Lesson content
│   ├── typescript/         # TypeScript lessons
│   └── csharp/             # C# lessons
├── hooks/                  # Custom React hooks
├── contexts/               # React contexts
├── data/                   # Static data (languages, paths)
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT
