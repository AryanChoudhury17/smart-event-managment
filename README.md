# 🏟️ Stadium-GPT

> AI-powered stadium operations and fan experience platform for FIFA World Cup 2026

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://openai.com)

---
 
## ✨ Features

- 🤖 **AI Chat Assistant** - Intelligent stadium navigation and fan support
- 🗺️ **Navigation** - Step-by-step directions with landmarks
- 👥 **Crowd Analytics** - Real-time density heatmaps and capacity insights
- 🌍 **Multilingual Support** - Assist fans in 25+ languages
- ♿ **Accessibility** - Inclusive routing for all guests
- 🚇 **Transport Intelligence** - Transit recommendations and parking info
- 📊 **Operations Dashboard** - Real-time metrics and alerts
- 🔔 **Smart Alerts** - Critical incidents and capacity warnings
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stadium-gpt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables
# OPENAI_API_KEY=your_api_key_here
# DATABASE_URL=your_database_url_here

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📁 Project Structure

```
stadium-gpt/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── chat/        # Chat interface
│   │   ├── dashboard/   # Dashboard components
│   │   ├── crowd/       # Crowd analytics
│   │   └── operations/  # Operations center
│   ├── lib/             # Utilities and helpers
│   │   ├── ai/          # OpenAI integration
│   │   └── db.ts        # Database client
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript definitions
├── prisma/              # Database schema
├── public/              # Static assets
└── package.json         # Dependencies
```

---

## 🛠️ Build & Deploy

### Development
```bash
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

---

## 🎯 Key Modules

### Dashboard
Access real-time stadium operations, alerts, and metrics at `/dashboard`

### Chat Interface  
Talk to StadiumGPT at `/dashboard/chat` for instant assistance

### Operations Center
Monitor crowd flow, incidents, and system health at `/dashboard/operations`

### Features
- 📍 Navigation guidance
- 👥 Crowd density tracking
- 🌐 Multilingual assistance
- ♿ Accessibility routing
- 🚗 Transportation info
- 🌱 Sustainability tips
- 🤝 Volunteer coordination

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 16, TypeScript |
| **Styling** | Tailwind CSS 4, Radix UI |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL |
| **AI** | OpenAI GPT-4o |
| **State** | Zustand |
| **Visualization** | Recharts, Lucide Icons |

---

## 🔐 Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stadium_gpt

# Auth (optional)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## 🌟 Performance Features

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Rate limiting
- ✅ API response caching

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 API Documentation

### POST `/api/chat`
Stream AI responses with real-time streaming support.

**Request:**
```json
{
  "messages": [{ "role": "user", "content": "How do I get to Section A?" }],
  "sessionType": "NAVIGATION",
  "language": "en"
}
```

**Response:** Server-Sent Events (SSE) stream

### GET `/api/health`
Health check endpoint for monitoring.

### GET `/api/operations/metrics`
Real-time operational metrics.

---

## 🎨 UI Components

Pre-built components for quick development:
- `MetricCard` - KPI display
- `DashboardHeader` - Navigation bar
- `AlertsFeed` - Real-time alerts
- `StadiumSelector` - Venue switcher
- `ChatInterface` - AI chat component
- `Heatmap` - Crowd density visualization

---

## 📊 Features in Development

- 🔮 Advanced crowd prediction
- 📈 Real-time analytics dashboard
- 🎫 Ticket integration
- 🏆 Gamification features
- 📱 Native mobile apps

---

## 🐛 Troubleshooting

**Build errors with Tailwind?**
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next`

**Database connection issues?**
- Verify `DATABASE_URL` is correct
- Run `npx prisma db push` to sync schema

**OpenAI API errors?**
- Check `OPENAI_API_KEY` is valid
- Ensure account has sufficient credits

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙌 Support

Need help? 
- 📧 Email: support@stadium-gpt.io
- 💬 Discord: [Join our community](https://discord.gg/stadium-gpt)
- 📖 Docs: [Full documentation](https://docs.stadium-gpt.io)

---

## 🎯 Roadmap

- Q3 2026: Beta launch for early venues
- Q4 2026: Full tournament deployment
- 2027: Post-tournament analytics platform

---

<div align="center">

**Made with ❤️ for FIFA World Cup 2026**

[⬆ back to top](#-stadium-gpt)

</div>
