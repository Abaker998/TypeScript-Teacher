# TypeScript Teacher

An interactive web application for learning TypeScript through hands-on coding exercises. Write real code, get instant feedback, and master TypeScript from beginner to advanced.

## Features

- **Interactive Code Editor** - Monaco editor (same as VS Code) with IntelliSense, autocomplete, and syntax highlighting
- **Instant Feedback** - Run your code and see results immediately with helpful error messages
- **26 Comprehensive Lessons** - Covering beginner, intermediate, and advanced TypeScript concepts
- **Hands-on Exercises** - Practice what you learn with coding challenges
- **Progress Tracking** - Your progress is saved locally as you complete exercises
- **Hint System** - Get hints when you're stuck on exercises
- **Dark Mode** - Toggle between light and dark themes
- **Search** - Find lessons by keyword (Cmd/Ctrl + K)
- **Glossary** - Quick reference for TypeScript terms with contextual examples
- **Capstone Project** - Build a complete Todo App applying all concepts learned

## Curriculum

### Beginner (8 lessons)
- Variables & Types
- Type Inference
- Functions
- Arrays & Objects
- Control Flow
- Error Handling
- Web Fundamentals
- Developer Tooling

### Intermediate (10 lessons)
- Interfaces
- Type Aliases
- Union & Literal Types
- Classes & OOP
- Generics
- Type Guards
- Enums & Modules
- Modern Operators
- Functional Programming
- Async Programming

### Advanced (7 lessons)
- Mapped Types
- Conditional Types
- Utility Types
- Template Literal Types
- The `infer` Keyword
- Decorators & Patterns
- Advanced Patterns

### Capstone (1 project)
- Build a Todo App (6 steps)

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Abaker998/TypeScript-Teacher.git
cd TypeScript-Teacher
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
│   ├── lessons/[slug]/     # Dynamic lesson pages
│   ├── glossary/           # Glossary page
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── CodeEditor.tsx      # Monaco code editor
│   ├── OutputPanel.tsx     # Code output display
│   ├── LessonContent.tsx   # Lesson content renderer
│   ├── HintsPanel.tsx      # Hints system
│   ├── SearchBar.tsx       # Search functionality
│   └── ...
├── lessons/                # Lesson content
│   ├── beginner/           # Beginner lessons
│   ├── intermediate/       # Intermediate lessons
│   ├── advanced/           # Advanced lessons
│   └── capstone/           # Capstone project
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT
