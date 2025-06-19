# DocuMed AI

A medical data extraction application built with modern web technologies.

## 🏗️ Architecture

- **Frontend**: React.js with Liquid Glass UI (deployed on Vercel)
- **Backend**: Node.js/Express API (deployed on Render)
- **Database**: Stateless approach - no personal data storage
- **Design**: Dark/Light mode support

## 🚀 Features

- Medical document data extraction
- Secure, stateless processing
- Modern UI with Liquid Glass design
- GDPR/HIPAA compliant (no data retention)

## 📁 Project Structure

```
documed-ai/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── docs/             # Documentation
└── README.md         # This file
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Getting Started

1. Clone the repository
```bash
git clone https://github.com/glitchlabs-eng/documed-ai.git
cd documed-ai
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Start development servers
```bash
# Backend (runs on port 3001)
cd backend
npm run dev

# Frontend (runs on port 3000)
cd ../frontend
npm start
```

## 🚀 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.
