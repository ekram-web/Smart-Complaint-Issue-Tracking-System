# Frontend Development Plan
## ASTU Smart Complaint System

---

## ✅ COMPLETED PHASES

### Phase 1: Foundation & Setup ✅
**Commit:** "Phase 1: Setup frontend with dependencies and TailwindCSS"
- Installed React Router, Axios, React Icons, TailwindCSS
- Configured TailwindCSS with custom theme
- Added Inter font and Material Symbols icons
- Created LEARNING_GUIDE.md and DEVELOPMENT_WORKFLOW.md

### Phase 2: TypeScript Types & API Layer ✅
**Commit:** "Phase 2: Add TypeScript types and API service layer"
- Created comprehensive type system (User, Ticket, Category, etc.)
- Setup Axios with interceptors (auto-adds JWT token)
- Created auth API service (login, register, getProfile)
- Added environment variables (.env.local)

### Phase 3: Authentication Pages ✅
**Commit:** "Phase 3: Build Login and Register pages"
- Built Login page with form validation
- Built Register page with role selection
- Split-screen design with hero image
- Form validation and error handling
- Show/hide password toggle
- **TESTED & WORKING:** Successfully logs in and stores JWT token

---

## 🎯 REMAINING PHASES

### Phase 4: AuthContext & Protected Routes (NEXT)
**Goal:** Manage user state globally and protect routes

**What we'll build:**
1. **AuthContext** (`src/context/AuthContext.tsx`)
   - Store current user globally
   - Provide login/logout functions
   - Check if user is authenticated
   
2. **ProtectedRoute Component** (`src/components/ProtectedRoute.tsx`)
   - Redirect to login if not authenticated
   - Check user role (Student/Staff/Admin)
   - Prevent unauthorized access

3. **Update App.tsx**
   - Wrap app with AuthProvider
   - Add protected routes for dashboard

**Why this is important:**
- Right now, anyone can access `/dashboard` by typing the URL
- We need to check if user is logged in
- We need to redirect based on role

**Commit:** "Phase 4: Add AuthContext and protected routes"

**Time estimate:** 30 minutes

---

### Phase 5: Reusable UI Components
**Goal:** Build basic components we'll use everywhere

**What we'll build:**
1. **Button** (`src/components/ui/Button.tsx`)
   - Primary, secondary, danger variants
   - Loading state
   - Disabled state

2. **Badge** (`src/components/ui/Badge.tsx`)
   - Status badges (OPEN, IN_PROGRESS, RESOLVED)
   - Priority badges (LOW, MEDIUM, HIGH)
   - Role badges (STUDENT, STAFF, ADMIN)

3. **Card** (`src/components/ui/Card.tsx`)
   - Container for content
   - With shadow and border

**Why this is important:**
- Reusable components = faster development
- Consistent design across the app
- Easy to update styling in one place

**Commit:** "Phase 5: Create reusable UI components"

**Time estimate:** 20 minutes

---

### Phase 6: Layout Components (Navbar & Sidebar)
**Goal:** Build the app shell that wraps all pages

**What we'll build:**
1. **Navbar** (`src/components/layout/Navbar.tsx`)
   - Logo
   - Search bar
   - Notifications icon
   - User profile dropdown with logout

2. **Sidebar** (`src/components/layout/Sidebar.tsx`)
   - Navigation menu
   - Different menus for Student/Staff/Admin
   - Active state highlighting
   - Collapsible on mobile

3. **Layout** (`src/components/layout/Layout.tsx`)
   - Combines Navbar + Sidebar + Content
   - Responsive (sidebar collapses on mobile)

**Why this is important:**
- Every page after login needs this layout
- Navigation between pages
- Professional look and feel

**Commit:** "Phase 6: Build layout components (Navbar & Sidebar)"

**Time estimate:** 45 minutes

---

### Phase 7: Student Dashboard
**Goal:** Main page students see after login

**What we'll build:**
1. **Dashboard Page** (`src/pages/student/Dashboard.tsx`)
   - Welcome message with user name
   - 4 stats cards (Total, Open, In Progress, Resolved)
   - Recent tickets table
   - Floating "Create Ticket" button

2. **API Integration**
   - Fetch user's tickets from backend
   - Display real data (not hardcoded)

3. **TicketCard Component** (`src/components/tickets/TicketCard.tsx`)
   - Display ticket info
   - Status and priority badges
   - Click to view details

**Why this is important:**
- First thing users see after login
- Shows system is working
- Most impressive for competition

**Commit:** "Phase 7: Build student dashboard with stats and tickets"

**Time estimate:** 1 hour

---

### Phase 8: Create Ticket Form
**Goal:** Let students submit complaints

**What we'll build:**
1. **Create Ticket Page** (`src/pages/student/CreateTicket.tsx`)
   - Title input
   - Category dropdown (fetch from backend)
   - Description textarea
   - Location input
   - Priority selector (radio buttons)
   - File upload (drag & drop)
   - Submit button

2. **API Integration**
   - POST to `/api/tickets`
   - Upload file to `/api/uploads/ticket/:id`
   - Redirect to ticket detail after creation

**Why this is important:**
- Core functionality of the system
- Students need to submit complaints
- File upload is impressive feature

**Commit:** "Phase 8: Build create ticket form with file upload"

**Time estimate:** 1 hour

---

### Phase 9: Ticket Detail Page
**Goal:** View full ticket information and comments

**What we'll build:**
1. **Ticket Detail Page** (`src/pages/student/TicketDetail.tsx`)
   - Ticket header (ID, status, priority, dates)
   - Full description
   - Attachments (images/PDFs)
   - Comments timeline
   - Add comment form

2. **API Integration**
   - GET `/api/tickets/:id`
   - POST `/api/tickets/:id/remarks` (add comment)

**Why this is important:**
- See full ticket information
- Track progress with comments
- Download attachments

**Commit:** "Phase 9: Build ticket detail page with comments"

**Time estimate:** 45 minutes

---

### Phase 10: Staff Dashboard (Optional)
**Goal:** Staff can view assigned tickets

**What we'll build:**
1. **Staff Dashboard** (`src/pages/staff/Dashboard.tsx`)
   - Assigned tickets list
   - Quick status update buttons
   - Filter by status

2. **Update Ticket Status**
   - Change status (OPEN → IN_PROGRESS → RESOLVED)
   - Add internal notes

**Why this is important:**
- Staff need to manage tickets
- Shows role-based features
- Complete the workflow

**Commit:** "Phase 10: Build staff dashboard"

**Time estimate:** 45 minutes

---

### Phase 11: Admin Dashboard (Optional)
**Goal:** Admin can see everything and manage system

**What we'll build:**
1. **Admin Dashboard** (`src/pages/admin/Dashboard.tsx`)
   - Statistics overview
   - Charts (tickets by status, category, priority)
   - Recent tickets
   - Recent users

2. **User Management** (`src/pages/admin/Users.tsx`)
   - List all users
   - Update user roles
   - View user details

3. **Category Management** (`src/pages/admin/Categories.tsx`)
   - List categories
   - Create/Edit/Delete categories

**Why this is important:**
- Admin needs full control
- System management
- Impressive for competition

**Commit:** "Phase 11: Build admin dashboard and management pages"

**Time estimate:** 1.5 hours

---

### Phase 12: Polish & Optimization
**Goal:** Make it production-ready

**What we'll do:**
1. **Error Handling**
   - Toast notifications for success/error
   - Better error messages
   - Retry failed requests

2. **Loading States**
   - Skeleton screens
   - Loading spinners
   - Smooth transitions

3. **Responsive Design**
   - Test on mobile
   - Fix any layout issues
   - Touch-friendly buttons

4. **Performance**
   - Optimize images
   - Lazy load components
   - Cache API responses

**Commit:** "Phase 12: Polish UI and optimize performance"

**Time estimate:** 1 hour

---

## 📊 TOTAL TIME ESTIMATE

- **Minimum Viable Product (MVP):** Phases 4-9 = ~4.5 hours
- **Full System:** Phases 4-12 = ~7.5 hours
- **With breaks and testing:** 1-2 days of focused work

---

## 🎯 RECOMMENDED APPROACH

### For Competition (Minimum):
Build Phases 4-9 to have a working student complaint system:
- ✅ Login/Register
- ✅ Student Dashboard
- ✅ Create Ticket
- ✅ View Ticket Details
- ✅ Comments

This demonstrates:
- Full authentication
- Core functionality
- Professional UI
- Working system

### For Full System:
Add Phases 10-11 for complete role-based system:
- Staff can manage tickets
- Admin can manage everything
- Complete workflow

---

## 📝 COMMIT STRATEGY

Each phase = 1 clear commit with:
- What was built
- Why it's important
- What works

Example:
```
Phase 4: Add AuthContext and protected routes

Created global authentication state:
- AuthContext provides user data to all components
- ProtectedRoute checks authentication before rendering
- Automatic redirect to login if not authenticated
- Role-based route protection

Features:
- useAuth() hook for easy access to user data
- Persistent login (checks localStorage on app load)
- Logout clears token and redirects to login

Ready for Phase 5: Build reusable UI components
```

---

## 🚀 NEXT STEP

**Phase 4: AuthContext & Protected Routes**

This is crucial because:
1. Right now anyone can access `/dashboard` by typing URL
2. We need to protect routes
3. We need global user state
4. Foundation for all other pages

**Ready to start Phase 4?**

---

**Last Updated:** February 25, 2026  
**Current Phase:** Phase 3 Complete ✅  
**Next Phase:** Phase 4 - AuthContext & Protected Routes
