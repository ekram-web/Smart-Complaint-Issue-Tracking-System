# ASTU Smart Complaint & Issue Tracking System 🎓

Welcome to the ASTU Smart Complaint System! A modern, full-stack complaint management platform built for Adama Science and Technology University. Featuring an AI-powered chatbot, real-time notifications, role-based access control, and a beautiful responsive UI.

## 🚀 Live Demo

- **Frontend**: [https://astu-complaint.vercel.app](https://astu-complaint.vercel.app)
- **Backend API**: [https://smart-complaint-issue-tracking-system.onrender.com](https://smart-complaint-issue-tracking-system.onrender.com)

## 🎯 Test Accounts

```
Admin:   admin@astu.edu.et   / admin123
Staff:   staff@astu.edu.et   / staff123
Student: student@astu.edu.et / student123
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 2.5 Flash

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (Render)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Validation**: Custom middleware

### Deployment
- **Frontend**: Vercel (Auto-deploy from GitHub)
- **Backend**: Render
- **Database**: Render PostgreSQL

## 🌟 Key Features

### Core Functionality
- ✅ **Role-Based Access Control**: Student, Staff, and Admin roles with specific permissions
- ✅ **Ticket Management**: Create, view, update, and track complaint tickets
- ✅ **Category System**: Organized complaints by Dormitory, Laboratory, Internet, Classroom, Library
- ✅ **Priority Levels**: LOW, MEDIUM, HIGH priority assignment
- ✅ **Status Tracking**: OPEN, IN_PROGRESS, RESOLVED workflow
- ✅ **File Attachments**: Upload images and documents with tickets
- ✅ **Real-time Notifications**: Get notified of ticket updates
- ✅ **Remarks System**: Add comments and updates to tickets

### Advanced Features
- 🤖 **AI Chatbot**: Gemini 2.5 Flash-powered assistant for instant help
- 🎨 **Modern UI/UX**: Glassmorphic design with smooth animations
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🔒 **Secure Authentication**: JWT-based auth with HTTP-only cookies
- 📊 **Analytics Dashboard**: Track ticket statistics and trends
- 🔍 **Advanced Filtering**: Filter by status, priority, category, and date


### User Roles & Permissions

#### Student
- Create and submit complaints
- View own tickets
- Add remarks to own tickets
- Upload attachments
- Track ticket status

#### Staff
- View all assigned tickets
- Update ticket status
- Add remarks and solutions
- Assign priorities
- Mark tickets as resolved

#### Admin
- Full system access
- User management (create, edit, delete)
- Category management
- View all tickets and analytics
- System configuration

## 📂 Project Structure

```
Smart-Complaint-Issue-Tracking-System/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # Reusable components
│   │   │   ├── layout/   # Layout components
│   │   │   └── ui/       # UI components
│   │   ├── context/      # React Context (Auth, Theme)
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   ├── staff/    # Staff pages
│   │   │   └── student/  # Student pages
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   └── ...
├── backend/              # Node.js + Express backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middlewares/  # Custom middleware
│   │   ├── routes/       # API routes
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── prisma/           # Prisma schema & migrations
│   │   └── schema.prisma
│   └── ...
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm 
- Google Gemini API key (for chatbot)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ekram-web/Smart-Complaint-Issue-Tracking-System.git
cd Smart-Complaint-Issue-Tracking-System
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials
```

3. **Configure Database**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/astu_complaints"
JWT_SECRET="your-secret-key"
PORT=5000
```

4. **Run Migrations & Seed**
```bash
npx prisma migrate dev
npm run seed
```

5. **Start Backend**
```bash
npm run dev
```

6. **Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env.local file
cp .env.example .env.local
```

7. **Configure Frontend Environment**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your-gemini-api-key
```

8. **Start Frontend**
```bash
npm run dev
```

9. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/check` - Check auth status

### Tickets
- `GET /api/tickets` - Get all tickets (filtered by role)
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics

### Uploads
- `POST /api/uploads` - Upload file

## 🤖 AI Chatbot

The system includes an AI-powered chatbot using Google Gemini 2.5 Flash:

- **Features**:
  - Answers questions about the complaint system
  - Helps users navigate the platform
  - Provides information about ticket categories
  - Explains how to submit complaints
  - Resizable chat window
  - Conversation history

- **Setup**:
  1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
  2. Add to `.env.local`: `VITE_GEMINI_API_KEY=your-key`
  3. For production, add to Vercel environment variables

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: System-wide dark mode support
- **Glassmorphism**: Modern glass-effect UI elements
- **Smooth Animations**: Framer Motion animations throughout
- **Loading States**: Skeleton loaders for better UX
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Client and server-side validation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration
- Secure file upload validation

## 📊 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role     @default(STUDENT)
  tickets   Ticket[]
  remarks   Remark[]
}

model Ticket {
  id          String   @id @default(uuid())
  ticketId    String   @unique
  title       String
  description String
  status      Status   @default(OPEN)
  priority    Priority @default(MEDIUM)
  category    Category @relation(fields: [categoryId])
  student     User     @relation(fields: [studentId])
  remarks     Remark[]
  attachments String[]
}

model Category {
  id      String   @id @default(uuid())
  name    String   @unique
  tickets Ticket[]
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Database (Render PostgreSQL)
1. Create PostgreSQL database
2. Copy connection string
3. Update `DATABASE_URL` in backend
4. Run migrations

## 📝 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm run seed         # Seed database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run migrations
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: Ekram abdu
- **Institution**: Adama Science and Technology University
- **Email**: unuse2001@gmail.com
- **linkdin**: https://www.linkedin.com/in/ekram-web/
  

## 🙏 Acknowledgments

- ASTU_STEM for the project opportunity
- Google Gemini AI for chatbot capabilities
- Vercel and Render for hosting
- Open source community for amazing tools

## 📞 Support

For support, email unuse2001@gmail.com


