# MediFinder - Pharmacy Finder App

A modern React-based web application that helps residents of Kigali, Rwanda find pharmacies with their prescribed medicines in stock and verify insurance acceptance before visiting.

## 🎯 Problem Statement

**Context (Kigali City, Rwanda):**
- Difficulty locating pharmacies with required medicines
- Many people move across the city searching for pharmacies that stock their prescribed drugs
- Patients often don't know whether a pharmacy has their medicine, causing wasted trips and delays
- Insurance-related barriers - pharmacies may prefer cash payments over insurance claims

**Impact:**
- Time wasted traveling between pharmacies
- Delayed access to medication
- Financial and emotional stress for patients

**Solution:**
A digital platform that displays pharmacies with prescribed medicine in stock, shows insurance acceptance, enables online ordering with home delivery, and provides prescription verification.

## ✨ Features

### For Patients
- 🔍 **Medicine Search**: Search for medicines by name and location
- 🏥 **Insurance Filtering**: Filter pharmacies by insurance type (RSSB, Mutuelle, Private-A, Private-B)
- 📍 **Interactive Maps**: View pharmacy locations on an interactive map
- 📋 **Prescription Upload**: Upload and verify prescriptions digitally
- 🛒 **Online Ordering**: Order medicines online with delivery options
- 🔔 **Notifications**: Receive order status updates and notifications
- 🚚 **Home Delivery**: Optional home delivery service

### For Pharmacy Staff
- 📊 **Dashboard**: Manage pharmacy operations
- 💊 **Stock Management**: Update medicine availability and prices
- 📦 **Order Management**: View and process incoming orders
- ✅ **Prescription Verification**: Verify uploaded prescriptions

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone or download this project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
medifinder-app/
├── src/
│   ├── views/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Pharmacies.tsx  # Search/Medicine finder
│   │   ├── PharmacyDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Prescription.tsx
│   │   ├── PharmacyDashboard.tsx
│   │   ├── Notifications.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── ui/                 # UI components
│   │   ├── RootLayout.tsx
│   │   └── MapView.tsx
│   ├── store/              # State management
│   │   └── cartStore.ts
│   ├── services/           # API services
│   │   ├── api.ts
│   │   └── data.ts
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── router.tsx          # Route configuration
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📱 Pages

1. **Home** (`/`) - Landing page with search
2. **Search** (`/pharmacies`) - Medicine finder
3. **Pharmacy Details** (`/pharmacies/:id`) - Pharmacy information
4. **Cart** (`/cart`) - Shopping cart
5. **Prescription** (`/prescription`) - Prescription upload
6. **Dashboard** (`/dashboard`) - Pharmacy dashboard
7. **Notifications** (`/notifications`) - Order status
8. **Login** (`/login`) - Login page
9. **Signup** (`/signup`) - Signup page

## 🎨 Design System

### Colors
- **Primary**: Blue tones (#0284c7, #0369a1)
- **Pharmacy**: Green tones (#22c55e, #16a34a)
- **Accent**: Yellow/Orange tones (#f59e0b, #d97706)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (Optional)
The frontend works with mock data by default. To connect to a backend:
1. Start the backend server (if available)
2. Update `VITE_API_URL` in `.env` file
3. The frontend will automatically use the API if available

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the actual port.

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### Build Errors
```bash
npm run build
```
Check for TypeScript errors in the terminal.

## 📚 Tech Stack

### Main Dependencies
- **React** 18.3.1 - UI library
- **React Router DOM** 6.26.2 - Client-side routing
- **Tailwind CSS** 3.4.14 - Utility-first CSS framework
- **Zustand** 4.5.2 - State management
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 4.2.1 - React wrapper for Leaflet

### Dev Dependencies
- **Vite** 5.4.8 - Build tool and dev server
- **TypeScript** 5.6.3 - Type safety
- **@vitejs/plugin-react** 4.3.1 - Vite React plugin

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist` folder will contain the production build.

### Deploy to
- **Vercel** - `vercel deploy`
- **Netlify** - Drag and drop `dist` folder
- **AWS S3 + CloudFront** - Upload `dist` folder
- **Any static hosting service**

## 📝 Notes

- The app uses mock data by default
- Backend is optional - frontend works standalone
- All images are loaded from Unsplash (requires internet connection)
- Maps use OpenStreetMap (requires internet connection)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 👥 Authors

- Your Name/Team

## 🙏 Acknowledgments

- Kigali City, Rwanda - For the problem context
- Unsplash - For pharmacy images
- OpenStreetMap - For map data

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Real-time stock updates
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Multi-language support (Kinyarwanda, English, French)
- [ ] Pharmacy analytics
- [ ] Doctor prescription system integration

---

**Made with ❤️ for Kigali, Rwanda**


