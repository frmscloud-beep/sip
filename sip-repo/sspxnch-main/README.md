# Sip n Chat AI Management System

A modern, full-featured café management system built with React, featuring AI-powered drink recommendations, customer kiosk ordering, and comprehensive admin dashboard.

## Features

### Customer Features
- **Interactive Menu** - Browse drinks and snacks by category with beautiful product cards
- **AI Drink Recommender** - Get personalized drink suggestions based on preferences using Gemini AI
- **Smart Cart System** - Add items with size selection and add-ons, manage quantities
- **Kiosk-Style Checkout** - Review and confirm orders with ease

### Admin Features
- **Authentication** - Google and Facebook login via Firebase
- **Dashboard Analytics** - View total products, low stock alerts, and inventory value
- **Product Management** - Add new products with category, price, and stock
- **Real-time Inventory** - Update stock levels and manage products

## Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS v4 with custom café theme
- **Routing**: React Router v6
- **Authentication**: Firebase Auth (Google & Facebook)
- **Database**: Firebase Firestore
- **AI**: Google Gemini API
- **Icons**: Lucide React

## Color Palette

- Beige: `#f5ebe0`
- Light Brown: `#b08968`
- Dark Brown: `#7f5539`
- Accent Amber: `#d97706`
- Text: `#1f1f1f`

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── MenuItemCard.jsx
│   └── CartSummary.jsx
├── pages/             # Route pages
│   ├── Landing.jsx
│   ├── Menu.jsx
│   ├── QuizBot.jsx
│   ├── Checkout.jsx
│   └── AdminDashboard.jsx
├── context/           # React Context providers
│   └── CartContext.jsx
├── lib/               # External service configs
│   ├── firebase.js
│   └── gemini.js
├── data/              # Static data
│   └── menuData.json
├── App.jsx            # Main app component
└── main.tsx           # Entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create or update the `.env` file in the project root with your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** with Google and Facebook providers
4. Enable **Firestore Database**
5. Copy your Firebase config to `.env`

### 4. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `.env` as `VITE_GEMINI_API_KEY`

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Usage Guide

### Customer Flow
1. Start at the landing page
2. Click "Customer Kiosk" to browse the menu
3. Use "Ask AI" to get personalized recommendations
4. Add items to cart with size and add-on options
5. Review order in checkout and confirm

### Admin Flow
1. Click "Admin Login" from landing page
2. Sign in with Google or Facebook
3. View dashboard analytics
4. Manage products in "Products" tab
5. Update inventory in "Inventory" tab

## Menu Categories

- **Milk Tea**: Taro, Okinawa, Wintermelon, Brown Sugar, Salted Caramel, Moffee, Cookies n Cream
- **Iced Coffee**: Spanish Latte, Caramel Macchiato, Dark Mocha, Matcha Espresso, Cafe Latte
- **Espresso (Hot Drinks)**: Matcha, Chocolate, Red Velvet, Arabica Coffee
- **Non-Coffee**: Red Velvet, Dark Choco, Iced Matcha, Milk Caramel
- **Fruit Soda**: Blue Lemonade, Green Apple, Strawberry, Blueberry, Lemon, Lychee
- **Snacks**: Fish Ball, Mini Hotdogs, Kikiam, Chicken Skin, French Fries

## Pricing

- Small: ₱39
- Medium: ₱49
- Large: ₱59
- Hot Drinks: ₱49
- Snacks: ₱20-45
- Add-ons: ₱10 each

## Notes

- This is a kiosk management system - no payment processing or delivery features
- Admin authentication requires Firebase configuration
- AI recommendations require Gemini API key
- All data is managed through Firebase Firestore in production
- Demo mode available without configuration (limited features)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

Fully responsive design optimized for:
- Desktop (1920px+)
- Tablet/Kiosk (768px - 1919px)
- Mobile (320px - 767px)

## License

This project is for educational and commercial use.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
