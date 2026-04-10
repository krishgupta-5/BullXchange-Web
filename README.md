# BullXchange - Paper Trading Simulator

A professional paper trading platform that simulates real market conditions without financial risk. Practice stocks and F&O trading with virtual capital and live market data.

## Features

- **Risk-Free Trading**: Practice with virtual money without risking real capital
- **Live Market Data**: Real-time NSE/BSE stock quotes and market simulation
- **Stocks & F&O**: Trade both equities and derivatives (Call/Put options)
- **Virtual Capital**: Start with 10,00,000 in virtual cash
- **Professional Interface**: Terminal-grade trading experience
- **Mobile App**: Native Android application for on-the-go trading practice

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/krishgupta-5/BullXchange-Web.git
cd BullXchange-Web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
  app/                 # Next.js app router
    (auth)/           # Authentication routes
    (public)/         # Public routes
    admin/            # Admin dashboard
    globals.css       # Global styles
    layout.tsx        # Root layout
    page.tsx          # Landing page
  components/         # Reusable components
    Footer.tsx        # Footer component
    Navbar.tsx        # Navigation bar
  lib/               # Utility libraries
    firebase.ts       # Firebase configuration
public/              # Static assets
  app_icon.png       # Application icon
  QR IMAGE.png       # Download QR code
```

## Key Features

### Trading Simulation
- Real-time market data integration
- Paper trading with virtual capital
- Support for equities and derivatives
- Professional trading interface

### User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Mobile app integration
- Download QR code for easy access

### Data Sources
- Angel One Smart API for real-time market data
- Live NSE/BSE stock quotes
- Options chain data

## Download App

Scan the QR code on the website or download directly:
- **Android**: [Download from Mega.nz](https://mega.nz/file/9r91FSjJ#VNAMug3oWtpEyrWsMZ91Qw5qAvMe_T4LUe-D5Kai1PQ)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational and practice purposes only. All trading is simulated with virtual money.

## Contact

For suggestions and feedback:
- Email: [openforgein@gmail.com](mailto:openforgein@gmail.com)

## Disclaimer

**Important**: BullXchange is a paper trading simulator created for educational purposes only. It has no connection to real trading platforms and uses virtual currency only. All trades use simulated money and real market data for educational purposes.

---

Built with Next.js, React, and Tailwind CSS
