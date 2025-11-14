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
- 🏥 **Insurance Filtering**: Filter pharmacies by insurance type (11+ providers including Britam, RSSB, Mutuelle, etc.)
- 📍 **Interactive Maps**: View pharmacy locations on an interactive map
- 🔐 **User Authentication**: Secure login and signup with JWT tokens
- 📋 **Prescription Upload**: Upload and verify prescriptions digitally
- 🛒 **Online Ordering**: Order medicines online with delivery options
- 🔔 **Notifications**: Receive order status updates and notifications
- 🚚 **Home Delivery**: Optional home delivery service
- 📊 **17 Pharmacies**: Search across multiple locations in Kigali

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

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Initialize and seed the database:**
   ```bash
   cd backend
   npm run seed
   cd ..
   ```

5. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

6. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

7. **Open in browser:**
   ```
   http://localhost:5173
   ```

### Quick Start (Both Servers)

To run both frontend and backend together:

**Terminal 1 (Backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 📁 Project Structure

```
medifinder-app/
├── src/                    # Frontend source code
│   ├── views/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Pharmacies.tsx  # Search/Medicine finder
│   │   ├── PharmacyDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Prescription.tsx
│   │   ├── PharmacyDashboard.tsx
│   │   ├── Notifications.tsx
│   │   ├── Login.tsx       # User login
│   │   └── Signup.tsx      # User registration
│   ├── ui/                 # UI components
│   │   ├── RootLayout.tsx
│   │   └── MapView.tsx
│   ├── store/              # State management
│   │   ├── cartStore.ts    # Shopping cart state
│   │   └── authStore.ts   # Authentication state
│   ├── services/           # API services
│   │   ├── api.ts         # API client
│   │   └── data.ts        # Mock data (fallback)
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── router.tsx          # Route configuration
│   └── main.tsx            # Entry point
├── backend/                # Backend API server
│   ├── src/
│   │   ├── server.js       # Express server
│   │   ├── routes/         # API routes
│   │   │   ├── pharmacies.js
│   │   │   └── auth.js
│   │   ├── services/       # Business logic
│   │   │   ├── pharmacyService.js
│   │   │   └── userService.js
│   │   └── database/       # Database layer
│   │       ├── schema.js   # Database schema
│   │       ├── seed.js     # Seed script
│   │       └── db.js       # Database connection
│   ├── data/              # Database files
│   │   └── medifinder.db  # SQLite database
│   ├── package.json
│   ├── README.md          # Backend documentation
│   ├── API_DOCS.md        # API documentation
│   └── DATABASE.md        # Database documentation
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Available Scripts

### Frontend
- `npm run dev` - Start frontend development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `cd backend && npm run dev` - Start backend server (port 3000)
- `cd backend && npm start` - Start backend server (production mode)
- `cd backend && npm run seed` - Seed/update database with pharmacy data

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

### Environment Variables

**Frontend** (optional):
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3000/api
```

**Backend** (optional):
Create a `.env` file in the `backend` directory:
```
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
```

### Backend & Database

The application includes a fully functional backend with SQLite database:

1. **Database**: SQLite database located at `backend/data/medifinder.db`
2. **Current Data**: 17 pharmacies across Kigali with complete stock information
3. **Authentication**: JWT-based authentication with password hashing
4. **API**: RESTful API with endpoints for pharmacies and authentication

**To update database:**
```bash
cd backend
npm run seed
```

**Database Documentation:**
- See `backend/DATABASE.md` for complete database documentation
- See `backend/API_DOCS.md` for API endpoint documentation

## 🐛 Troubleshooting

### Port Already in Use
- **Frontend (5173)**: Vite will automatically use the next available port (5174, 5175, etc.)
- **Backend (3000)**: Change `PORT` in `backend/.env` or kill the process using port 3000

### Backend Not Running
If you see "API unavailable" errors:
1. Make sure backend is running: `cd backend && npm run dev`
2. Check backend health: `curl http://localhost:3000/health`
3. Verify database exists: `ls backend/data/medifinder.db`

### Database Issues
If pharmacy data is missing:
```bash
cd backend
npm run seed
```

### Module Not Found
```bash
# Frontend
rm -rf node_modules
npm install

# Backend
cd backend
rm -rf node_modules
npm install
```

### Build Errors
```bash
npm run build
```
Check for TypeScript errors in the terminal.

## 📚 Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **React Router DOM** 6.26.2 - Client-side routing
- **Tailwind CSS** 3.4.14 - Utility-first CSS framework
- **Zustand** 4.5.2 - State management (cart & auth)
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 4.2.1 - React wrapper for Leaflet
- **TypeScript** 5.6.3 - Type safety
- **Vite** 5.4.8 - Build tool and dev server

### Backend
- **Express.js** 4.18.2 - Web framework
- **SQLite** (better-sqlite3) - Database
- **bcryptjs** 2.4.3 - Password hashing
- **jsonwebtoken** 9.0.2 - JWT authentication
- **CORS** 2.8.5 - Cross-origin resource sharing

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

- **Database**: The app uses SQLite database with 17 pharmacies across Kigali
- **Authentication**: User authentication is fully implemented with JWT tokens
- **API**: Backend API is required for full functionality (frontend falls back to mock data if backend is unavailable)
- **Data**: All pharmacy data is stored in the database and can be updated via seed script
- **Maps**: Maps use OpenStreetMap (requires internet connection)
- **Images**: Pharmacy images are loaded from Unsplash (requires internet connection)

## 🗄️ Database

The application uses SQLite database with the following:
- **17 Pharmacies** across Kigali sectors (Remera, Kacyiru, Kimironko, etc.)
- **30+ Medicines** with pricing and stock information
- **11 Insurance Providers** (Britam, Eden Care Medical, RSSB, etc.)
- **User Accounts** with secure password hashing

**Locations Covered:**
- Remera (4 pharmacies)
- Kacyiru (3 pharmacies)
- Kimironko (3 pharmacies)
- Gikondo, Gisozi, Kimihurura, Kinyinya, Masoro, Ndera, Nyamirambo (1 each)

See `backend/DATABASE.md` for complete database documentation.

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

- [x] User authentication ✅
- [x] Backend API with database ✅
- [x] Pharmacy search and filtering ✅
- [x] Insurance filtering ✅
- [ ] Real-time stock updates
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Multi-language support (Kinyarwanda, English, French)
- [ ] Pharmacy analytics
- [ ] Doctor prescription system integration
- [ ] Order management system
- [ ] Delivery tracking

---

**Made with ❤️ for Kigali, Rwanda**



