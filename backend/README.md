# ASTU Smart Complaint System - Backend

A comprehensive complaint and issue tracking system for Adama Science and Technology University (ASTU).

## 🚀 Features

- **Authentication System**: JWT-based authentication with role-based access control
- **Category Management**: Organize complaints by type (Dormitory, Lab, Internet, etc.)
- **Ticket System**: Create, track, and manage complaints with status workflow
- **File Upload**: Attach images and PDFs to tickets
- **Admin Dashboard**: Analytics and user management
- **Role-Based Access**: Different permissions for Students, Staff, and Admins

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Zod
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/astu_complaints?schema=public"

# JWT Secret (change this to a random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV=development
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Push Database Schema
```bash
npm run db:push
```

### 5. Seed Database (Optional - adds test data)
```bash
npm run db:seed
```

This creates test accounts:
- **Admin**: admin@astu.edu.et / admin123
- **Staff**: staff@astu.edu.et / staff123
- **Student**: student@astu.edu.et / student123

### 6. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client setup
│   │   └── multer.ts          # File upload configuration
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── ticket.controller.ts
│   │   ├── upload.controller.ts
│   │   └── admin.controller.ts
│   ├── middlewares/           # Authentication & error handling
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── ticket.routes.ts
│   │   ├── upload.routes.ts
│   │   └── admin.routes.ts
│   ├── utils/                 # Helper functions
│   │   ├── password.ts
│   │   ├── jwt.ts
│   │   ├── response.ts
│   │   ├── ticketId.ts
│   │   └── seed.ts
│   ├── types/                 # TypeScript type definitions
│   │   └── express.d.ts
│   └── server.ts              # Main entry point
├── uploads/                   # Uploaded files storage
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (requires auth)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets (filtered by role)
- `GET /api/tickets/:id` - Get single ticket
- `PUT /api/tickets/:id` - Update ticket (Staff/Admin)
- `POST /api/tickets/:id/remarks` - Add comment

### Uploads
- `POST /api/uploads/ticket/:ticketId` - Upload file to ticket
- `GET /api/uploads/:id` - Download attachment

### Admin
- `GET /api/admin/dashboard` - Get system statistics (Admin only)
- `GET /api/admin/users` - List all users (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create migration files
- `npm run db:studio` - Open Prisma Studio (visual database browser)
- `npm run db:seed` - Seed database with test data

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT authentication with 7-day expiration
- Role-based access control (STUDENT, STAFF, ADMIN)
- Input validation with Zod
- SQL injection protection (Prisma ORM)
- File upload restrictions (images and PDFs only, 5MB max)

## 👥 User Roles

### Student
- Create complaints/tickets
- View own tickets
- Add comments to own tickets
- Upload attachments to own tickets

### Staff
- View assigned tickets
- Update ticket status
- Add comments to assigned tickets
- Upload attachments to assigned tickets

### Admin
- Full access to all tickets
- Manage categories
- Manage users and roles
- View dashboard statistics
- Assign tickets to staff

## 🎫 Ticket Lifecycle

```
OPEN → IN_PROGRESS → RESOLVED
```

- **OPEN**: Newly created ticket
- **IN_PROGRESS**: Staff is working on it
- **RESOLVED**: Issue has been fixed

## 📊 Database Schema

### User
- Stores students, staff, and admins
- Encrypted passwords
- Role-based permissions

### Category
- Types of complaints (Dormitory, Lab, Internet, etc.)
- Assigned to specific departments

### Ticket
- Main complaint record
- Unique ticket ID (ASTU-2024-001)
- Status tracking
- Priority levels

### Attachment
- File uploads linked to tickets
- Stores filename, path, type, and size

### Remark
- Comments and updates on tickets
- Can be internal (staff-only) or public

## 🧪 Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@astu.edu.et","password":"123456","role":"STUDENT"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@astu.edu.et","password":"123456"}'
```

**Get Profile:**
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman/Thunder Client

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. For protected routes, add header: `Authorization: Bearer YOUR_TOKEN`

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-secret-key"
PORT=5000
NODE_ENV=production
```

### Recommended Platforms

- **Backend**: Railway, Render, or Heroku
- **Database**: Supabase, Neon, or Railway PostgreSQL
- **File Storage**: Consider AWS S3 or Cloudinary for production

## 📝 Git Commits

The project was built with meaningful commits:
1. Project setup and dependencies
2. Database schema design
3. Utilities and configuration
4. Authentication system
5. Category management
6. Ticket system
7. File upload
8. Admin dashboard


---

**Built with ❤️ for Adama Science and Technology University**
