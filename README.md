# EventEase – Event Services Marketplace

A modern, full-stack **MERN (MongoDB, Express.js, React, Node.js)** marketplace application connecting customers planning celebrations with professional, vetted event service providers across India.

Inspired by platforms like Urban Company and WedMeGood, EventEase provides end-to-end discovery, multi-filter location search, side-by-side vendor comparison, real-time enquiry tracking, and dedicated dashboards for Customers, Vendors, and Platform Administrators.

---

## 🌟 Key Highlights & Capabilities

- **100% Pure MERN Stack**: Built exclusively using React (Vite, JSX), Tailwind CSS, React Router DOM, Node.js, Express.js, MongoDB, Mongoose ODM, JWT, bcrypt.js, and Axios.
- **Three User Roles with Strict RBAC**:
  - **Customer**: Browse categories, location-based city search, budget and rating filters, compare up to 3 vendors, save favourites, submit detailed event enquiries, track status in real-time, write reviews.
  - **Vendor**: Business profile creation, category selection, portfolio photo gallery, tiered packages (Silver, Gold, Platinum), individual services, availability status management, incoming enquiry acceptance/rejection/completion.
  - **Admin**: Approve or reject vendor registrations, manage service categories (CRUD), monitor all platform enquiries, deactivate/activate user accounts, moderate listings.
- **12 Service Categories**: Photographers, Videographers, Caterers, Decorators, Makeup artists, Mehendi artists, DJs & Music, Wedding Planners, Event Planners, Venues, Event Management, Entertainment.
- **10+ Supported Event Types**: Weddings, Engagements, Birthdays, Anniversaries, Baby showers, Housewarmings, Family functions, Corporate events, College fests, Concerts.
- **Location-Based Search**: Filter vendors by city (Mumbai, Delhi, Bengaluru, Jaipur, Goa, Hyderabad, Chennai, Pune, Kolkata, Udaipur) through database queries without forcing browser GPS permissions.
- **Side-by-Side Comparison**: Interactive comparison table comparing pricing, reviews, experience, services, and packages of up to 3 vendors.
- **Zero-Config Hybrid Image Uploads**: Multer file handler with automatic Cloudinary upload if API keys are set, or seamless local file serving fallback.
- **Realistic Seed Data Included**: 12 categories, 16 realistic vendors with high-resolution Unsplash photography, sample customers, sample enquiries, reviews, and admin account.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (v18+) with Vite |
| **Language** | JavaScript (ESModules + JSX) |
| **Styling & Design** | Tailwind CSS with custom Ivory/Charcoal/Amber design system |
| **Routing** | React Router DOM (v6) |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **HTTP Client** | Axios (with token interceptor) |
| **Backend Runtime** | Node.js (v20+) & Express.js |
| **Database** | MongoDB & Mongoose ODM (v8+) |
| **Authentication** | JWT (JSON Web Tokens) & bcryptjs password hashing |
| **File Uploads** | Multer + Cloudinary (with local fallback) |

---

## 📁 Project Directory Structure

```
Event Services Marketplace/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── categoryController.js # Category listing & admin CRUD
│   │   ├── vendorController.js   # Vendor search, filters, profile, services, packages
│   │   ├── enquiryController.js  # Enquiry submissions & status lifecycle
│   │   ├── favouriteController.js# Favourites toggle & customer list
│   │   ├── reviewController.js   # Customer reviews & average calculation
│   │   ├── adminController.js    # Approvals, stats, user moderation
│   │   └── uploadController.js   # Multer / Cloudinary file upload
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role-based access control
│   │   └── upload.js             # Multer disk storage and mime type filter
│   ├── models/
│   │   ├── User.js               # Customer, Vendor, Admin credentials & roles
│   │   ├── VendorProfile.js      # Business info, rating, city, portfolio, approval
│   │   ├── ServiceCategory.js    # Event service taxonomy
│   │   ├── Service.js            # Individual vendor services & pricing units
│   │   ├── Package.js            # Tiered packages (features, duration, price)
│   │   ├── Enquiry.js            # Event date, budget, status, notes
│   │   ├── Favourite.js          # Customer saved vendors
│   │   └── Review.js             # Customer feedback, ratings (1-5 stars)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── vendorRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── favouriteRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   ├── seed/
│   │   └── seed.js               # Comprehensive realistic database seeder
│   ├── utils/
│   │   └── cloudinary.js         # Cloudinary configuration & helpers
│   ├── test-flows.js             # End-to-end integration test runner
│   ├── server.js                 # Express server & static asset serving
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation, role badges, compare indicator
│   │   │   ├── Footer.jsx        # Event categories, support & brand links
│   │   │   ├── VendorCard.jsx    # Photo card with rating, pricing, compare & fav buttons
│   │   │   ├── CategoryCard.jsx  # Category visual card with dynamic icons
│   │   │   ├── EnquiryModal.jsx  # Modal for submitting custom event requests
│   │   │   ├── CompareDrawer.jsx # Floating bottom comparison bar
│   │   │   ├── RatingStars.jsx   # 5-star rating display with review counts
│   │   │   ├── Badge.jsx         # Status and availability badges
│   │   │   └── LoadingSpinner.jsx# Skeletons and loading spinners
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User session, JWT storage, role state
│   │   │   └── CompareContext.jsx# Shortlist & comparison state manager
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero, live search, categories, featured, how it works
│   │   │   ├── ExploreServices.jsx# Service directory with keyword filter
│   │   │   ├── SearchResults.jsx # Multi-filter sidebar, budget slider, sorting
│   │   │   ├── VendorProfile.jsx # Detail page with tabs (Services, Packages, Gallery, Reviews)
│   │   │   ├── CompareVendors.jsx# Side-by-side comparison matrix
│   │   │   ├── CustomerDashboard.jsx# Enquiry tracker, saved favourites, profile
│   │   │   ├── VendorDashboard.jsx  # Inquiries manager, packages, portfolio, profile
│   │   │   ├── AdminDashboard.jsx   # Approvals, categories CRUD, user moderation
│   │   │   ├── Login.jsx         # Authentication with quick demo fill buttons
│   │   │   ├── Register.jsx      # Customer or Vendor registration toggle
│   │   │   ├── HowItWorks.jsx    # Process breakdown for hosts & vendors
│   │   │   └── NotFound.jsx      # 404 page
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Routes and protected guards
│   │   ├── index.css             # Tailwind base & custom utilities
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **MongoDB**: Local MongoDB instance (`mongod`) running on `localhost:27017` OR a MongoDB Atlas connection string.

### 2. Configure Backend Environment
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eventease_db
JWT_SECRET=eventease_production_grade_secret_key_987654321_secure
JWT_EXPIRES_IN=7d

# Optional: Cloudinary credentials (leave blank for automatic local storage fallback)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Install Dependencies
```bash
# In backend/
cd backend
npm install

# In frontend/
cd ../frontend
npm install
```

### 4. Seed Database with Realistic Sample Data
Run the seeder to populate 12 categories, 16 verified vendors, sample enquiries, reviews, and test accounts:
```bash
cd backend
npm run seed
```

### 5. Run the Application

#### Option A: Running Both Servers Concurrently for Development
In terminal 1 (Backend API on `http://localhost:5000`):
```bash
cd backend
npm run dev
```

In terminal 2 (Vite Frontend on `http://localhost:5173`):
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

#### Option B: Unified Production Server (Single Port)
The backend automatically serves the pre-built frontend distribution from `http://localhost:5000`:
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```
Open **`http://localhost:5000`** in your browser.

---

## 🔑 Demo Login Accounts

All pre-seeded demo accounts use the password: **`password123`**

| Role | Email | Password | Access & Features |
|---|---|---|---|
| **Admin** | `admin@eventease.com` | `password123` | Vendor approval/rejection, Category CRUD, User moderation, Global Enquiry monitoring |
| **Vendor** | `karan.lens@eventease.com` | `password123` | Vendor Dashboard: Incoming enquiries, accept/reject, package management, portfolio photos |
| **Customer** | `customer@eventease.com` | `password123` | Customer Dashboard: Enquiry tracking timeline, favourite vendors list, submit reviews |

*(Note: The Login screen includes one-click demo login buttons to instantly populate credentials without manual typing!)*

---

## 📡 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register customer or vendor (creates initial vendor profile if vendor)
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `PUT /api/auth/profile` - Update name, phone, avatar

### Service Categories (`/api/categories`)
- `GET /api/categories` - List all categories (supports `?popular=true`)
- `GET /api/categories/:slugOrId` - Get category detail
- `POST /api/categories` - Create category *(Admin)*
- `PUT /api/categories/:id` - Update category *(Admin)*
- `DELETE /api/categories/:id` - Delete category *(Admin)*

### Vendors (`/api/vendors`)
- `GET /api/vendors` - Multi-filter search (supports `city`, `category`, `minPrice`, `maxPrice`, `rating`, `availability`, `search`, `sort`)
- `GET /api/vendors/:id` - Get vendor profile with populated services, packages, reviews
- `GET /api/vendors/me/profile` - Get logged-in vendor's own profile *(Vendor)*
- `PUT /api/vendors/me/profile` - Update business details, pricing, availability *(Vendor)*
- `POST /api/vendors/me/portfolio` - Add portfolio photo *(Vendor)*
- `DELETE /api/vendors/me/portfolio/:imageId` - Delete portfolio photo *(Vendor)*
- `POST /api/vendors/me/services` - Create service *(Vendor)*
- `PUT /api/vendors/me/services/:serviceId` - Update service *(Vendor)*
- `DELETE /api/vendors/me/services/:serviceId` - Delete service *(Vendor)*
- `POST /api/vendors/me/packages` - Create tiered package *(Vendor)*
- `PUT /api/vendors/me/packages/:packageId` - Update package *(Vendor)*
- `DELETE /api/vendors/me/packages/:packageId` - Delete package *(Vendor)*

### Enquiries (`/api/enquiries`)
- `POST /api/enquiries` - Submit new event enquiry *(Customer)*
- `GET /api/enquiries/customer` - Get customer's submitted enquiries *(Customer)*
- `GET /api/enquiries/vendor` - Get vendor's received enquiries with stats *(Vendor)*
- `PUT /api/enquiries/:id/status` - Accept, reject, or complete enquiry *(Vendor)*
- `GET /api/enquiries/admin/all` - Global enquiry monitor *(Admin)*

### Favourites (`/api/favourites`)
- `POST /api/favourites/toggle/:vendorId` - Add or remove vendor from saved list *(Customer)*
- `GET /api/favourites` - List customer's favourite vendors *(Customer)*
- `GET /api/favourites/check/:vendorId` - Check if vendor is in favourites *(Customer)*

### Reviews (`/api/reviews`)
- `GET /api/reviews/vendor/:vendorId` - List reviews for a vendor
- `POST /api/reviews/vendor/:vendorId` - Submit rating & review comment *(Customer)*

### Admin Operations (`/api/admin`)
- `GET /api/admin/stats` - Platform metrics & summary
- `GET /api/admin/vendors` - All vendors with filter by approval status (`?status=pending|approved`)
- `PUT /api/admin/vendors/:id/approval` - Approve or revoke vendor live status
- `DELETE /api/admin/vendors/:id` - Remove vendor listing
- `GET /api/admin/users` - All registered customers & vendors
- `PUT /api/admin/users/:id/toggle-status` - Activate or deactivate user account

---

## 🧪 Verification & Automated Testing

An automated end-to-end integration test runner is included at `backend/test-flows.js`.
To execute:
```bash
node backend/test-flows.js
```
The test suite validates:
1. API Health Check
2. 12 Categories loaded
3. City location search (e.g. Mumbai)
4. Budget range filtering
5. Customer, Vendor, and Admin authentication
6. Admin platform statistics
7. Customer enquiry creation & storage in MongoDB
8. Vendor enquiry retrieval & status update (`Pending` -> `Accepted`)
9. Customer tracking of accepted status
10. Favourite toggling
11. Customer review submission & automatic recalculation of vendor average rating

---

## 🔒 Security Best Practices Implemented

- Passwords hashed using bcrypt.js with salt rounds before saving to database.
- JWT tokens signed with secure server secrets and expiration time.
- Passwords omitted from query results by default (`select: false`).
- Role-based route authorization guards on backend REST APIs and frontend React routes.
- CORS restricted to allowed domains.
- Sanity checks on file uploads (mimetype restrictions, file size limit).
