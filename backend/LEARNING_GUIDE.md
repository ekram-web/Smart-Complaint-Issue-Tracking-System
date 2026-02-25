# Backend Development Learning Guide

This document explains everything we built and how it works.

---

## 📚 Table of Contents

1. [Understanding Backend Basics](#understanding-backend-basics)
2. [Project Structure](#project-structure)
3. [The Request-Response Cycle](#the-request-response-cycle)
4. [Database Design](#database-design)
5. [Authentication System](#authentication-system)
6. [CRUD Pattern](#crud-pattern)
7. [Role-Based Access Control](#role-based-access-control)
8. [What We Built](#what-we-built)

---

## 🎯 Understanding Backend Basics

### What is a Backend?

Think of it like a **restaurant**:
- **Frontend** = Dining area (what customers see - website/app)
- **Backend** = Kitchen (where food is prepared - your code)
- **Database** = Storage room (where ingredients are kept - your data)

### The Flow

```
User Browser → Backend Server → Database
     ↓              ↓              ↓
  Request      Process Data    Store Data
     ↑              ↑              ↑
  Response    ← Return Data ← Fetch Data
```

---

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database blueprint (tables design)
│
├── src/
│   ├── config/
│   │   └── database.ts        # Connect to database
│   │
│   ├── utils/                 # Helper tools
│   │   ├── password.ts        # Encrypt/decrypt passwords
│   │   ├── jwt.ts             # Create/verify login tokens
│   │   ├── response.ts        # Standard response format
│   │   └── ticketId.ts        # Generate ticket IDs
│   │
│   ├── middlewares/           # Security guards
│   │   ├── auth.ts            # Check if logged in
│   │   └── errorHandler.ts   # Handle errors
│   │
│   ├── controllers/           # Business logic (WHAT HAPPENS)
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   └── ticket.controller.ts
│   │
│   ├── routes/                # API endpoints (URLs)
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   └── ticket.routes.ts
│   │
│   └── server.ts              # MAIN FILE (starts everything)
│
├── .env                       # Secrets (database password, JWT secret)
├── package.json               # List of libraries
└── tsconfig.json              # TypeScript settings
```

---

## 🔄 The Request-Response Cycle

### Example: Student Logs In

**Step 1:** Student types email & password, clicks "Login"
```javascript
POST http://localhost:5000/api/auth/login
{
  "email": "john@astu.edu.et",
  "password": "123456"
}
```

**Step 2:** Request arrives at `server.ts`
- Express receives the request
- Routes it to `authRoutes`

**Step 3:** `auth.routes.ts` finds the right function
- Sees method is POST and path is `/login`
- Calls the `login` function from controller

**Step 4:** `auth.controller.ts` does the work
1. Get email and password from request
2. Find user in database
3. Check if password is correct
4. Generate JWT token
5. Send response back

**Step 5:** Response goes back to frontend
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "u001", "name": "John", "role": "STUDENT" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🗄️ Database Design

### Our Tables

**USER TABLE**
```
| id   | name     | email              | password | role    |
|------|----------|-------------------|----------|---------|
| u001 | John Doe | john@astu.edu.et  | ******* | STUDENT |
| u002 | Jane     | jane@astu.edu.et  | ******* | STAFF   |
```

**CATEGORY TABLE**
```
| id   | name       | department    |
|------|------------|---------------|
| c001 | Dormitory  | Housing Dept  |
| c002 | Laboratory | Lab Mgmt      |
```

**TICKET TABLE**
```
| id   | ticketId      | title      | status      | authorId | categoryId |
|------|---------------|------------|-------------|----------|------------|
| t001 | ASTU-2024-001 | Broken AC  | OPEN        | u001     | c001       |
| t002 | ASTU-2024-002 | No WiFi    | IN_PROGRESS | u001     | c002       |
```

### Relationships

```
USER ──┬─── creates ───> TICKET
       └─── assigned to ─> TICKET

CATEGORY ─── has many ───> TICKET

TICKET ──┬─── has many ───> ATTACHMENT
         └─── has many ───> REMARK
```

---

## 🔐 Authentication System

### How It Works

**1. Register**
```
User sends: name, email, password
   ↓
Validate data
   ↓
Hash password (encrypt)
   ↓
Save to database
   ↓
Create JWT token
   ↓
Return: user + token
```

**2. Login**
```
User sends: email, password
   ↓
Find user in database
   ↓
Compare password with hash
   ↓
Create JWT token
   ↓
Return: user + token
```

**3. Protected Routes**
```
User sends request with token
   ↓
Middleware checks token
   ↓
If valid: allow access
If invalid: reject (401)
```

### Password Security

```javascript
// User types: "123456"
// We save: "$2a$10$xyz...abc" (encrypted)
// Hacker sees: "$2a$10$xyz...abc" (useless!)

// When user logs in:
hashPassword("123456") === "$2a$10$xyz...abc" ✓
```

### JWT Tokens

```javascript
// After login, create token:
const token = generateToken({
  userId: "u001",
  email: "john@astu.edu.et",
  role: "STUDENT"
});
// Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// On protected routes, verify token:
const user = verifyToken(token);
// Result: { userId: "u001", email: "john@astu.edu.et", role: "STUDENT" }
```

---

## 📝 CRUD Pattern

**CRUD = Create, Read, Update, Delete**

This is the MOST COMMON pattern in backend development.

### Example: Category Management

**CREATE** - Add new category
```typescript
const category = await prisma.category.create({
  data: { name: "Dormitory", department: "Housing" }
});
```

**READ** - Get categories
```typescript
// Get all
const categories = await prisma.category.findMany();

// Get one
const category = await prisma.category.findUnique({
  where: { id: "c001" }
});
```

**UPDATE** - Modify category
```typescript
const category = await prisma.category.update({
  where: { id: "c001" },
  data: { department: "New Department" }
});
```

**DELETE** - Remove category
```typescript
await prisma.category.delete({
  where: { id: "c001" }
});
```

---

## 🔒 Role-Based Access Control

Different users see different data!

### Example: Viewing Tickets

```typescript
// STUDENT: Only see their own tickets
if (userRole === 'STUDENT') {
  where.authorId = userId;
}

// STAFF: Only see assigned tickets
if (userRole === 'STAFF') {
  where.assignedToId = userId;
}

// ADMIN: See all tickets (no filter)
```

### Example Scenario

```
John (STUDENT) logs in:
  → Sees only his 3 tickets

Jane (STAFF) logs in:
  → Sees only 10 tickets assigned to her

Admin logs in:
  → Sees all 150 tickets in system
```

---

## ✅ What We Built

### 1. Authentication System
- **Register**: Create new user with encrypted password
- **Login**: Authenticate user and return JWT token
- **Get Profile**: Retrieve logged-in user information

**Routes:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

---

### 2. Category Management
- **Create Category**: Admin can add new complaint categories
- **Get All Categories**: List all categories (public)
- **Get Single Category**: View category with ticket count
- **Update Category**: Admin can modify category details
- **Delete Category**: Admin can remove categories

**Routes:**
- `GET /api/categories` - List all
- `GET /api/categories/:id` - Get one
- `POST /api/categories` - Create (Admin only)
- `PUT /api/categories/:id` - Update (Admin only)
- `DELETE /api/categories/:id` - Delete (Admin only)

---

### 3. Ticket/Complaint System
- **Create Ticket**: Students submit complaints
- **Get All Tickets**: Role-based filtering
- **Get Single Ticket**: View details with attachments and remarks
- **Update Ticket**: Staff/Admin change status, assign to staff
- **Add Remark**: All users can add comments

**Ticket Lifecycle:**
```
OPEN → IN_PROGRESS → RESOLVED
```

**Routes:**
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets (filtered by role)
- `GET /api/tickets/:id` - Get single ticket
- `PUT /api/tickets/:id` - Update ticket (Staff/Admin)
- `POST /api/tickets/:id/remarks` - Add comment

---

## 🎯 The Pattern for ANY Feature

For every feature, follow this pattern:

1. **Database Model** (What data to store) - `schema.prisma`
2. **Controller** (What happens when user requests) - `controllers/`
3. **Route** (What URL to call) - `routes/`
4. **Middleware** (Who can access) - `middlewares/`
5. **Add to server** - `server.ts`
6. **Test** (Make sure it works)
7. **Commit** (Save to Git)

---

## 📊 Git Commits We Made

1. **Commit 1**: Project Setup (package.json, tsconfig.json)
2. **Commit 2**: Database Schema (Prisma models)
3. **Commit 3**: Utilities & Config (password, JWT, database)
4. **Commit 4**: Authentication System (register, login, profile)
5. **Commit 5**: Category Management (CRUD operations)
6. **Commit 6**: Ticket System (create, view, update, comment)

---

## 🚀 Next Steps

**Still to build:**
- File Upload (attach images to tickets)
- Admin Dashboard (statistics and user management)
- Testing the API
- Frontend integration
- Deployment

---

## 💡 Key Concepts to Remember

1. **Request-Response Cycle** - Browser asks, server answers
2. **Routes** - Map URLs to functions
3. **Controllers** - Do the actual work
4. **Middleware** - Check permissions before allowing
5. **Database** - Store data permanently
6. **CRUD** - Create, Read, Update, Delete (most common pattern)
7. **Role-Based Access** - Different users see different data
8. **JWT Tokens** - Prove you're logged in without password
9. **Password Hashing** - Never store plain passwords
10. **Validation** - Always check data before saving

---

## 📚 Resources

- **README.md** - Setup instructions
- **API.md** - Complete API documentation
- **schema.prisma** - Database structure
- **Git commits** - See history of what we built

---

## 🎓 What You Learned

You now know how to:
- ✅ Structure a backend project
- ✅ Design a database with relationships
- ✅ Implement authentication with JWT
- ✅ Build CRUD operations
- ✅ Add role-based access control
- ✅ Validate user input
- ✅ Handle errors gracefully
- ✅ Write clean, organized code
- ✅ Use Git for version control

**You can now build ANY backend feature using these patterns!** 🎉

---

*Created: February 24, 2026*
*Project: ASTU Smart Complaint & Issue Tracking System*
