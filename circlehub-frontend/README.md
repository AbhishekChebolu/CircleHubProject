# CircleHub Frontend

Modern, beautiful React frontend for CircleHub social media platform.

## 🎨 Features

- **Modern UI/UX** - Clean, attractive design with smooth animations
- **Dark Mode** - Full dark mode support with system preference detection
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Live feed updates and interactions
- **Glassmorphism** - Beautiful glass-like UI elements
- **Smooth Animations** - Engaging hover effects and transitions

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm
- Backend server running at `http://localhost:8080`

### Steps

1. **Install Dependencies**
   ```bash
   cd circlehub-frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:5173
   ```

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── circle/         # Circle-related components
│   ├── common/         # Common/shared components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   ├── messages/       # Messaging components
│   ├── post/           # Post-related components
│   └── profile/        # Profile components
│
├── contexts/           # React contexts
│   ├── AuthContext.jsx    # Authentication state
│   └── ThemeContext.jsx   # Dark/Light theme
│
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx
│   ├── ExplorePage.jsx
│   └── CreatePostPage.jsx
│
├── services/           # API services
│   └── api.js         # Axios instance and API calls
│
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   └── dateUtils.js
│
├── App.jsx             # Main app component with routing
├── main.jsx            # React entry point
└── index.css           # Global styles and Tailwind
```

## 🎯 Key Features Implemented

### Authentication
- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Management
- ✅ Protected Routes
- ✅ Auto-redirect based on auth status

### Home Feed
- ✅ View posts from circles
- ✅ Like/Unlike posts
- ✅ Comment on posts
- ✅ Beautiful post cards with user info

### Circles
- ✅ Browse all circles
- ✅ Search circles
- ✅ Filter by category
- ✅ Create new circles
- ✅ Beautiful circle cards

### UI/UX
- ✅ Responsive Navbar with search
- ✅ Left sidebar navigation
- ✅ Right sidebar suggestions
- ✅ Dark/Light mode toggle
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling

### Create Content
- ✅ Create posts
- ✅ Upload images (URL)
- ✅ Select circle for post
- ✅ Rich text content

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple accent
- **Background**: Gray-50 (light) / Gray-900 (dark)
- **Cards**: White (light) / Gray-800 (dark)

### Components
- **Cards**: Rounded-2xl with soft shadows
- **Buttons**: Gradient primary, solid secondary
- **Inputs**: Rounded-xl with focus rings
- **Animations**: Fade-in, slide-up, scale on hover

## 🔌 API Integration

The frontend connects to the backend at `http://localhost:8080/api`

### Configured Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /circles` - Get all circles
- `POST /circles/create` - Create circle
- `POST /circles/join` - Join circle
- `GET /posts/circle/:id` - Get circle posts
- `POST /posts/create` - Create post
- `POST /posts/:id/like` - Toggle like
- `POST /comments/add` - Add comment
- `GET /comments/post/:id` - Get post comments

## 🚀 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 Usage Flow

1. **Landing Page** → Beautiful hero section with features
2. **Register/Login** → Create account or sign in
3. **Home Feed** → View posts from joined circles
4. **Explore** → Discover new circles
5. **Create Circle** → Start your own community
6. **Create Post** → Share content in circles
7. **Interact** → Like, comment, and engage

## 🌈 Theme Support

Toggle between light and dark mode using the button in the navbar.

Theme preference is:
- Saved in localStorage
- Respects system preference on first visit
- Smooth transitions between themes

## 📱 Responsive Design

- **Mobile**: Single column, hamburger menu
- **Tablet**: Adapted layout
- **Desktop**: Full 3-column layout

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token injection in requests
- Protected routes with auth check
- Secure logout clearing all data

## 🎨 Customization

### Change Primary Color

Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#yourcolor',
    600: '#yourdarkercolor',
  }
}
```

### Add New Components

1. Create component in `/src/components/`
2. Import and use in pages
3. Follow naming conventions

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3000
```

### Backend Connection Issues
- Ensure backend is running on port 8080
- Check CORS configuration
- Verify API endpoints

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Follow the existing code style
2. Use functional components with hooks
3. Add comments for complex logic
4. Test before committing

## 📄 License

MIT License

## ✨ Credits

Built with ❤️ using React, Vite, and TailwindCSS

---

**Enjoy building with CircleHub Frontend! 🎉**
