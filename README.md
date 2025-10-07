# bluckajean 📝

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/ac90e078-9dc5-4673-ba43-2ead61819db7.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/ac90e078-9dc5-4673-ba43-2ead61819db7)
[![Netlify Status](https://api.netlify.com/api/v1/badges/cd992526-abbd-46ea-af0f-3dcc0d3b3dcd/deploy-status)](https://app.netlify.com/projects/bluckajean/deploys)
[![codecov](https://codecov.io/gh/ragaeeb/bluckajean/graph/badge.svg?token=H1YOTGY4NQ)](https://codecov.io/gh/ragaeeb/bluckajean)
[![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)](https://www.typescriptlang.org)
[![Node.js CI](https://github.com/ragaeeb/bluckajean/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/bluckajean/actions/workflows/build.yml)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![GitHub License](https://img.shields.io/github/license/ragaeeb/bluckajean)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, intuitive visual JSON array editor built with Next.js 15, React 19, and TypeScript. Edit JSON data with intelligent field detection, automatic type inference, and a clean, responsive interface.

## Demo

[Demo on Netlify](https://bluckajean.netlify.app)

## ✨ Features

### Intelligent JSON Parsing
- **Automatic Error Correction**: Handles missing brackets, trailing commas, and common JSON formatting issues
- **Smart Type Detection**: Automatically identifies strings, numbers, and booleans
- **Long Text Recognition**: Detects fields with >100 characters or newlines for optimized display

### Dynamic User Interface
- **Adaptive Input Controls**: Renders the appropriate UI component based on field type
  - Text inputs for short strings
  - Textareas for long text (with RTL support)
  - Number inputs with custom styling (no spinners)
- **Responsive Layout**: Numeric fields grouped horizontally, text fields stacked vertically
- **Real-Time Editing**: Changes are tracked and can be copied back to the JSON input

### Developer Experience
- Built with Next.js 15 and React 19
- Full TypeScript support with comprehensive type safety
- Tailwind CSS for styling
- Bun for fast package management and testing
- Comprehensive test coverage with Bun's built-in test runner
- JSDoc documentation throughout the codebase

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.2.23
- Node.js (for Next.js compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/ragaeeb/bluckajean.git
cd bluckajean

# Install dependencies
bun install
```

### Development

```bash
# Start the development server with Turbopack
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
# Create an optimized production build
bun run build

# Start the production server
bun run start
```

## 🧪 Testing

The project uses Bun's built-in test runner for fast, reliable testing.

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Generate coverage report
bun test --coverage
```

### Test Coverage

Comprehensive unit tests for core utilities:
- `parseJson`: JSON parsing with error correction
- `analyzeJsonStructure`: Field type detection and metadata extraction

## 📖 Usage

### Basic Example

1. **Paste JSON**: Copy your JSON array into the textarea
   ```json
   [
     {
       "name": "John Doe",
       "age": 30,
       "bio": "A software developer with a passion for creating intuitive user interfaces."
     }
   ]
   ```

2. **Edit Visually**: The editor automatically creates appropriate input fields
   - Short text fields for names
   - Number inputs for ages
   - Textareas for long descriptions

3. **Copy Updated JSON**: Focus the textarea to see your changes reflected in JSON format

### Supported Field Types

| Type | Detection | UI Component |
|------|-----------|--------------|
| String (short) | Text ≤100 chars, no newlines | Text input |
| String (long) | Text >100 chars or contains newlines | Textarea (RTL) |
| Number | Numeric values | Number input |
| Boolean | true/false | Text input |

### Advanced Features

#### Error Correction

The parser automatically fixes common JSON issues:

```javascript
// Missing opening bracket
'{"name": "John"}]' → [{"name": "John"}]

// Missing closing bracket
'[{"name": "John"}' → [{"name": "John"}]

// Trailing commas
'[{"name": "John",}]' → [{"name": "John"}]
```

#### RTL Support

Long text fields automatically enable RTL (right-to-left) text direction, perfect for editing content in Arabic, Hebrew, and other RTL languages.

## 🏗️ Project Structure

```
bluckajean/
├── src/
│   ├── app/
│   │   └── page.tsx              # Main application component
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── FieldEditor.tsx       # Individual field editor
│   │   └── JsonItemEditor.tsx    # JSON item card component
│   ├── lib/
│   │   └── utils.ts              # Utility functions (parsing, analysis)
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── tests/
│   └── utils.test.ts             # Unit tests
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

### Core
- **[Next.js 15](https://nextjs.org)** - React framework with Turbopack
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

### Styling
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com)** - Accessible component primitives
- **[Lucide React](https://lucide.dev)** - Icon library

### Development Tools
- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Biome](https://biomejs.dev)** - Fast formatter and linter
- **[Semantic Release](https://semantic-release.gitbook.io)** - Automated version management

## 📝 Code Quality

### Type Safety
All components and utilities are fully typed with TypeScript, providing excellent IDE support and compile-time error checking.

### Documentation
Comprehensive JSDoc comments throughout the codebase explain:
- Component props and behavior
- Function parameters and return types
- Usage examples
- Edge cases and special considerations

### Testing
Unit tests cover critical functionality:
- JSON parsing edge cases
- Type detection accuracy
- Error handling
- Data structure analysis

## 🚀 Deployment

### Netlify

This project is configured for deployment on Netlify:

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `bun run build`
   - Publish directory: `.next`
3. **Environment Variables**: None required for basic deployment
4. **Deploy**: Netlify will automatically build and deploy your site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ragaeeb/bluckajean)

### Vercel

Alternative deployment on Vercel (Next.js creators):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun test`)
5. Format code (`bun run format`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Write tests for new functionality
- Use Biome for formatting and linting
- Maintain type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ragaeeb Haq**

- GitHub: [@ragaeeb](https://github.com/ragaeeb)
- Project: [bluckajean](https://github.com/ragaeeb/bluckajean)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) and [React](https://react.dev)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)
- Powered by [Bun](https://bun.sh)

## 📊 Project Stats

- **Language**: TypeScript
- **Framework**: Next.js 15
- **Runtime**: Bun
- **Deployment**: Netlify
- **License**: MIT

---
