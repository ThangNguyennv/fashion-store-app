# fashion-store-app
---
This is a complete full-stack fashion website project, including a customer-facing site (Client) and an administrative system (Admin). The project is built on the MERN stack (MongoDB, Express, React, Node) but modernized with Vite, TypeScript, and JWT.

<img width="1918" height="919" alt="image" src="https://github.com/user-attachments/assets/e168bbfe-cf73-4ebe-85ac-47bdc1fcc411" />

- Frontend Deploy (Vercel): [https://luxues-store.vercel.app]

- Backend Deploy (Render): [https://luxues-store.onrender.com]

---

## 1. Key Features

The project is divided into two separate parts: front-end (Client) and back-end (Admin/API).

1.1. Client

- Authentication:

  - Registration and Login using bcrypt (password hashing) and JWT (JSON Web Token).

  - Uses httpOnly cookies for token storage, enhancing security (prevents XSS).

  - Google Login (OAuth 2.0): Integrated with Passport.js for quick sign-in/sign-up via Google.

  - Secure "Forgot Password" flow using temporary JWTs sent via email (or OTP).

- Shopping:

  - Advanced Cart Logic: Automatically creates carts for guests. When a guest logs in, the system automatically merges the guest cart into their account cart.

  - Product listing page with multi-level filtering: Filter by Category (multi-level), Price (slider), Color, and Size.

  - Product Sorting: Sort by "Default" (position), Name (A-Z, Z-A), and especially sort by Discounted Price (calculated via Aggregation).

  - Product detail page with an image gallery (Image Swiper), color/size selection, and review display.

- Search:

  - "Classic Search" (pressing Enter) navigates to a paginated results page.
 
  - Real-time search suggestions (using debounce) directly under the search bar.

- User Account (Private Routes):

  - Account information page (update avatar, details).
 
  - "My Orders" page (view history, filter orders).
 
  - Cancel order (if status allows).
 
  - Product Reviews: Allows verified purchasers to leave a rating and upload images.

- Chat Real-time:

  - Uses Socket.io for 1-on-1 real-time chat with Admin.
 
  - Automatic authentication via httpOnly cookie on socket connection.
 
  - Displayed as a convenient chat bubble on the site.

1.2. Admin

- Admin Authentication: Separate login system, also using JWT (cookie tokenAdmin) and bcrypt.

- Authorization: Integrates role_id logic into the JWT payload to control API access (e.g., Super Admin vs. Editor).

- Dashboard: Overview of revenue, orders, and new users.

- Full CRUD Management:

  - Product Management (Add, Edit, Delete, Update Status).
 
  - Order Management (View details, update status: Processing -> Transporting -> Confirmed...).
 
  - Brand & Brand Category Management.
 
  - User (Client) & Account (Admin) Management.
 
  - Role & Permission Management.

- Excel Export:

  - Feature to export the entire (filtered) order list to an .xlsx file using exceljs on the backend.

- Real-time Chat (Admin View):

  - 2-column interface displaying all customer chat sessions.
 
  - Receive real-time messages and reply directly to each customer.

## 2. Tech Stack

2.1. Frontend (in front-end folder)

- Framework/Library: React 19, Vite

- Language: TypeScript

- Styling: Tailwind CSS, Framer Motion (for animations)

- Routing: React Router v7+

- State Management: React Context

- API Client: Axios

- Real-time: Socket.io-client

- Components: Material-UI (MUI) (for Skeletons, Menus, Dialogs), Swiper.js (for sliders)

2.2. Backend (in back-end folder)

- Framework: Node.js, Express.js

- Language: TypeScript

- Database: MongoDB (with Mongoose)

- Authentication: jsonwebtoken (JWT), bcrypt (Hashing), passport, passport-google-oauth20

- Real-time: Socket.io

- API: REST API, Cookie-Parser, CORS

- File Upload: Multer (file handling), Cloudinary (image storage)

- Others: exceljs (Excel Export), mongoose-slug-updater

2.3. Deployment

- Frontend: Vercel (connected to the front-end directory and vercel.json for SPA routing)

- Backend: Render (connected to the back-end directory and running npm run build & npm run start)

## 3. Local Installation and Setup

- This is a Monorepo project (managed in 2 separate folders).
```
git clone https://github.com/ThangNguyennv/luxues-store.git
```

3.1. Backend Setup

1. Open a terminal, cd into the back-end directory:

```
cd back-end
```

2. Install packages:

```
npm install
````

3. Create a .env file in the back-end root and fill in the environment variables:
```
# Server port
PORT=3100
API_ROOT=http://localhost:3100

# Your MongoDB connection string
MONGO_URL=mongodb+srv://...

# Frontend URL (for CORS config)
CLIENT_URL=http://localhost:5173

# Cloundinary
CLOUD_NAME=...
CLOUD_KEY=...
CLOUD_SECRET=...

# Session Key 
SESSION_SECRET=Sodsfo89sdFDfdasdgdsf65asd

# Tính năng gửi mail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-google-app-password

# Payment API Keys
VNP_TMN_CODE=ZPIAQCW7
VNP_HASH_SECRET=7CVJIOQL9KSC3FEZLEUCKT362HKSGZB4
ZALOPAY_APP_ID=2554
ZALOPAY_KEY1=sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn
ZALOPAY_KEY2=trMrHtvjo6myautxDUiAcYsVtaeQ8nhf
ZALOPAY_ENDPOINT_CREATE=https://sb-openapi.zalopay.vn/v2/create
ZALOPAY_ENDPOINT_QUERY=https://sb-openapi.zalopay.vn/v2/query

# Secret Keys (CREATE YOUR OWN COMPLEX RANDOM STRINGS)
JWT_SECRET=fghfghKDASDJD9UOH7T7GHOIIOJDOIH8998$%%$^$%DF
JWT_SECRET_RESET=ijhduashOHDOAUHSDohdohs993rnfwe$@&%^&^%@
JWT_SECRET_ADMIN=dfgdfg43534gregfdg$$34greasdasdasdsadasd

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3100/user/auth/google/callback
```

4. Start the backend server:

```
npm run dev
```


3.2. Frontend Setup

1. Open a second terminal, cd into the front-end directory:

```
cd front-end
```


2. Install packages:

```
npm install
```


3. Create a .env.development file in the front-end root:
```
# Link to the local running backend API
VITE_API_ROOT=http://localhost:3100
# (Create a tinymce account, get the key, and paste it here)
VITE_TINYMCE_API_KEY=...
```

4. Start the frontend server:

```
npm run dev
```


5. Open your browser and navigate to http://localhost:5173.

--- 

### Contact: If you have any problems, you can contact with me thangnv1029@gmail.com
---

### Note: With more time, I will try to update more features and further optimize the website for performance.
