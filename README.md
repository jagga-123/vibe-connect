# VibeConnect - Premium Glassmorphic MERN Social Media Application

VibeConnect is a complete, modern social feed application built as a MERN Stack Full-Stack Internship Assignment. It features a premium, professional glassmorphism dashboard UI with dark/light mode toggles, instant micro-animated like triggers, real-time comment boxes, full search functionality, and local file uploads.

---

## 📂 Project Structure & Directories

The project is structured into two clean directories:

```text
VibeConnect/
├── backend/                  # Node.js + Express.js API Server
│   ├── controllers/          # Business logic (auth & posts)
│   ├── middleware/           # authMiddleware (JWT verification)
│   ├── models/               # MongoDB models (User & Post)
│   ├── routes/               # API Router mappings
│   ├── uploads/              # Local image uploads directory
│   ├── .env.example          # Template environment configurations
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main server entrypoint
│
├── frontend/                 # Vite + React.js SPA Client
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, Sidebar, PostCard...)
│   │   ├── context/          # AuthContext (login/signup states)
│   │   ├── pages/            # Login, Signup, Feed, Profile pages
│   │   ├── services/         # api.js (Axios setup with JWT interceptor)
│   │   ├── App.jsx           # Main routing & Theme provider
│   │   ├── index.css         # Custom CSS tokens & Glassmorphic styles
│   │   └── main.jsx          # React app DOM mount point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite config
│
└── README.md                 # Project Setup & Guide (This file)
```

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React.js (Vite compiler), Material UI (MUI) for professional widgets/icons, and Vanilla CSS variables for custom styling.
- **Backend**: Node.js & Express.js server, JWT sessions, bcrypt password encryption.
- **Database**: MongoDB (via Mongoose ODM) restricted to **only 2 collections** (`Users` and `Posts`) with embedded sub-documents for comments and likes.
- **Image Uploads**: **Multer** local storage for instant zero-configuration local runs (images are saved in `backend/uploads/` and served statically).

---

## 💻 How to Run the Project (Step-by-Step)

Here are the complete instructions to set up and run VibeConnect locally on your computer.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a local **MongoDB** server running (e.g., MongoDB Community Server or MongoDB Compass) on port `27017` (default), OR use a MongoDB Atlas URI.

---

### Step 1: Open Terminal and Navigate to the Folder
Open your computer's terminal (Command Prompt, PowerShell, or Git Bash) and run:
```bash
cd c:\Users\sande\OneDrive\Desktop\VibeConnect
```

---

### Step 2: Set up Backend Environment variables
1. Open the folder `backend/`.
2. Locate the file `.env.example`.
3. Create a copy of this file and rename it to `.env`.
4. Inside `.env`, modify the parameters if needed:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/vibeconnect
   JWT_SECRET=vibeconnect_jwt_secret_key_2026
   ```

---

### Step 3: Run the Backend Server
Open a terminal panel and run:
```bash
# Go to backend folder
cd c:\Users\sande\OneDrive\Desktop\VibeConnect\backend

# Install node dependencies
npm install

# Start the server
npm start
```
You should see:
* `Successfully connected to MongoDB.`
* `Server is running on port 5000`

---

### Step 4: Run the Frontend App
Open a **new** terminal panel (do not close the backend terminal) and run:
```bash
# Go to frontend folder
cd c:\Users\sande\OneDrive\Desktop\VibeConnect\frontend

# Install react dependencies
npm install

# Start Vite development server
npm run dev
```
You should see:
* `  VITE v8.x.x  ready in ... ms`
* `  ➜  Local:   http://localhost:5173/`

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔒 API Endpoints Map

### Authentication (`/api/auth`)
* `POST /api/auth/signup` - Registers a new user. Assigns a dynamic initial avatar, hashes password, returns JWT token.
* `POST /api/auth/login` - Verifies email & password, returns JWT token and user profile details.

### Posts & Interactions (`/api/posts`)
* `POST /api/posts/create` - Creates a post (text, image file, or both). Requires JWT token.
* `GET /api/posts` - Fetches feed list. Supports pagination query `page=1&limit=5` and search query `search=query`.
* `PUT /api/posts/:id/like` - Toggles like/unlike state. Adds or removes user information from the likes list.
* `POST /api/posts/:id/comment` - Appends a comment to the post list.

---

## 🚀 Deployment Steps (Production Ready)

### 1. Database (MongoDB Atlas)
1. Register on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 Database Cluster.
3. Add a database user with password, and whitelist all network access (`0.0.0.0/0`).
4. Copy the connection string (e.g. `mongodb+srv://...`) and paste it as `MONGO_URI` in your production environment.

### 2. Backend (Render)
1. Push your code repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set **Root Directory** to `backend`.
5. Set **Start Command** to `npm start`.
6. Add your Environment Variables in Render configurations:
   - `MONGO_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_secure_random_key`
   - `PORT` = `5000`
7. Click **Deploy Web Service**. Render will generate a URL for you (e.g., `https://vibeconnect-api.onrender.com`).

### 3. Frontend (Vercel / Netlify)
1. Go to Vercel and link your GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Set the Environment Variable:
   - `VITE_API_URL` = `https://vibeconnect-api.onrender.com/api` (Point to your Render backend API)
6. Click **Deploy**. Vercel will host your client application (e.g., `https://vibeconnect.vercel.app`).
