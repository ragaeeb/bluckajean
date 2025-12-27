# bluckajean 📝

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/ac90e078-9dc5-4673-ba43-2ead61819db7.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/ac90e078-9dc5-4673-ba43-2ead61819db7)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/bluckajean)](https://bluckajean.vercel.app)
[![codecov](https://codecov.io/gh/ragaeeb/bluckajean/graph/badge.svg?token=H1YOTGY4NQ)](https://codecov.io/gh/ragaeeb/bluckajean)
[![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)](https://www.typescriptlang.org)
[![Node.js CI](https://github.com/ragaeeb/bluckajean/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/bluckajean/actions/workflows/build.yml)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![GitHub License](https://img.shields.io/github/license/ragaeeb/bluckajean)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, intuitive visual JSON array editor built with Vite, React 19, and TypeScript. Edit JSON data with intelligent field detection, automatic type inference, and a clean, responsive interface.

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
- Built with Vite and React 19
- Full TypeScript support with comprehensive type safety
- Tailwind CSS for styling
- Bun for fast package management and testing
- JSDoc documentation throughout the codebase

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.0

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
# Start the development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

### Building for Production

```bash
# Create an optimized production build
bun run build

# Preview the production build locally
bun run preview
```

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
│   ├── main.tsx                  # Vite entry point
│   ├── App.tsx                   # Main application component
│   ├── index.css                 # Global styles and Tailwind config
│   ├── components/
│   │   ├── ui/                   # UI primitives (Input, Label, Textarea)
│   │   ├── FieldEditor.tsx       # Individual field editor
│   │   ├── JsonItemEditor.tsx    # JSON item card component
│   │   └── Footer.tsx            # App footer
│   ├── lib/
│   │   └── utils.ts              # Utility functions (parsing, analysis)
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

### Core
- **[Vite](https://vite.dev)** - Fast build tool and dev server
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

### Styling
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com)** - Accessible component primitives

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

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `bun run build`
   - Publish directory: `dist`
3. **Deploy**: Netlify will automatically build and deploy your site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ragaeeb/bluckajean)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Format code (`bun run format`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Use Biome for formatting and linting
- Maintain type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ragaeeb Haq**

- GitHub: [@ragaeeb](https://github.com/ragaeeb)
- Project: [bluckajean](https://github.com/ragaeeb/bluckajean)

## 🙏 Acknowledgments

- Built with [Vite](https://vite.dev) and [React](https://react.dev)
- UI components from [Radix UI](https://www.radix-ui.com)
- Powered by [Bun](https://bun.sh)

## 📊 Project Stats

- **Language**: TypeScript
- **Build Tool**: Vite
- **Runtime**: Bun
- **License**: MIT
