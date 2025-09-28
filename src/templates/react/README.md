# <%= projectName %>

A modern React application built with TypeScript, Vite, and Tailwind CSS.

## Features

- ⚡️ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React features
- 🏷️ **TypeScript** - Type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📱 **React Router** - Client-side routing
- 🧩 **Component-based Architecture** - Modular and reusable components
- 🏗️ **Modern Project Structure** - Feature-based organization

## Project Structure

```
src/
├── assets/          # Images, icons, and static assets
├── components/      # Reusable UI components
├── features/        # Feature-based modules
├── hooks/           # Custom React hooks
├── lib/             # Third-party library configurations
├── pages/           # Route-level components
├── routes/          # React Router configuration
├── store/           # State management (if needed)
├── styles/          # Global styles and Tailwind CSS
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.