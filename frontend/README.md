# ASTU Smart Complaint System - Frontend

Modern React frontend for the ASTU complaint management system.

## 🚀 Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Icons:** Material Symbols + React Icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on port 5000

## 🔧 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5174`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                    # API service layer
│   │   ├── axios.ts           # Axios configuration
│   │   ├── auth.ts            # Authentication API
│   │   ├── tickets.ts         # Tickets API
│   │   ├── categories.ts      # Categories API
│   │   ├── admin.ts           # Admin API
│   │   └── uploads.ts         # File upload API
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── context/
│   │   └── AuthContext.tsx    # Global auth state
│   ├── pages/
│   │   ├── auth/              # Login & Register
│   │   ├── student/           # Student pages
│   │   ├── staff/             # Staff pages
│   │   ├── admin/             # Admin pages
│   │   └── Profile.tsx
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── public/                     # Static assets
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 👥 User Roles & Access

### Student
- View personal dashboard
- Create new tickets
- View own tickets
- Add comments to own tickets
- Upload attachments

### Staff
- View assigned tickets
- Update ticket status
- Add comments and internal notes
- Upload attachments to assigned tickets

### Admin
- Full system access
- View analytics dashboard
- Manage all tickets
- Manage users and roles
- Manage categories

## 🎨 Features

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes
- Auto-redirect on unauthorized access

### Ticket Management
- Create tickets with file uploads
- View ticket details with comments
- Real-time status updates
- Priority and category filtering

### Admin Dashboard
- System statistics
- Tickets by status/priority/category
- User management
- Category management

### UI/UX
- Responsive design (mobile-first)
- Dark mode support
- Loading states
- Empty states
- Toast notifications
- Modal dialogs

## 🔌 API Integration

All API calls go through the centralized axios instance with:
- Automatic token injection
- Request/response interceptors
- Global error handling
- 401 auto-redirect to login

## 📦 Available Scripts

- `npm run dev` - Start development server (port 5174)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing the Application

### Test Accounts (from backend seed)
```
Admin:   admin@astu.edu.et   / admin123
Staff:   staff@astu.edu.et   / staff123
Student: student@astu.edu.et / student123
```

### Testing Flow

1. **Student Flow:**
   - Login as student
   - Create a new ticket
   - Upload an attachment
   - Add a comment
   - View ticket status

2. **Staff Flow:**
   - Login as staff
   - View assigned tickets
   - Update ticket status to IN_PROGRESS
   - Add internal note
   - Mark as RESOLVED

3. **Admin Flow:**
   - Login as admin
   - View dashboard statistics
   - Manage users (change roles)
   - Manage categories
   - View all tickets

## 🎨 UI Components

### Badge Component
Shows status and priority with color coding:
- **Status:** OPEN (blue), IN_PROGRESS (orange), RESOLVED (green)
- **Priority:** LOW (gray), MEDIUM (yellow), HIGH (red)

### Card Component
Reusable card container with shadow and hover effects

### Button Component
Multiple variants: primary, secondary, danger, ghost

### Modal Component
Overlay modal for forms and confirmations

### LoadingSpinner Component
Animated loading indicator

### EmptyState Component
Friendly message when no data exists

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Environment Variables for Production
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Recommended Platforms
- **Vercel** (recommended) - Zero config deployment
- **Netlify** - Easy continuous deployment
- **GitHub Pages** - Free static hosting

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🔐 Security Features

- JWT tokens stored in localStorage
- Automatic token expiration handling
- Role-based route protection
- CSRF protection via token-based auth
- XSS protection via React's built-in escaping

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🐛 Troubleshooting

### Backend Connection Error
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env file
- Verify CORS is enabled on backend

### Login Not Working
- Clear localStorage and try again
- Check browser console for errors
- Verify backend database is seeded

### Styles Not Loading
- Run `npm install` to ensure TailwindCSS is installed
- Check if `index.css` is imported in `main.tsx`

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Built with ❤️ for Adama Science and Technology University**
