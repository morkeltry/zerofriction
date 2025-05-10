# Bankless - Modern Crypto Wallet

A futuristic crypto wallet with wallet abstraction mechanisms that provides a digital banking experience similar to Revolut. Built with React, TypeScript, and Tauri.

## Features

- 🏦 Modern banking-like interface
- 📊 Real-time balance tracking and visualization
- 💳 Easy on/off ramps for fiat currencies
- 💱 Built-in token swapping
- 🔐 Secure wallet abstraction
- 🎨 Beautiful, minimalist design

## Tech Stack

- [Tauri](https://tauri.app/) - Desktop application framework
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Privy](https://privy.io/) - Wallet abstraction
- [Recharts](https://recharts.org/) - Data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Rust (latest stable)
- Tauri CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bankless-tauri-app.git
cd bankless-tauri-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run tauri dev
```

### Building

To create a production build:

```bash
npm run tauri build
```

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── balance-card   # Balance display
│   ├── balance-chart  # Balance history chart
│   └── ...
├── lib/               # Utility functions
├── styles/            # Global styles
└── App.tsx           # Main application
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tauri](https://tauri.app/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Privy](https://privy.io/) for wallet abstraction
