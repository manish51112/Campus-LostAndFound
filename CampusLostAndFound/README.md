# Campus Lost & Found Portal (MERN Stack)

A modern full-stack web application designed for college campuses to report, track, and recover lost and found personal belongings.

Developed specifically for **Semester 5 Full Stack Development** using the **MERN Stack**:
- **M** - **MongoDB** (with Mongoose ODM)
- **E** - **Express.js** (REST API framework)
- **R** - **React.js** (Component-based Single Page Application with Vite)
- **N** - **Node.js** (JavaScript server runtime)

---

## 📁 Project Structure

```text
CampusLostAndFound/
├── server/                    # Node.js + Express + MongoDB Backend
│   ├── config/db.js           # Database connection
│   ├── controllers/           # Business logic (authController, itemController)
│   ├── middleware/auth.js     # JWT token protection middleware
│   ├── models/                # Mongoose models (User, Item)
│   ├── routes/                # REST API routes (/api/auth, /api/items)
│   ├── .env                   # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── server.js              # Server entry point
│   └── package.json
│
└── client/                    # React.js Frontend (Vite)
    ├── src/
    │   ├── api.js             # Axios client with JWT interceptor
    │   ├── context/           # AuthContext (login, register, logout, persistence)
    │   ├── components/        # Navbar, ItemCard, ItemModal, PostItemModal, AuthModal, ProfileSettingsModal
    │   ├── pages/             # Home (Browse/Filter), MyPosts (Manage Listings)
    │   ├── App.jsx
    │   ├── index.css          # Modern responsive styling
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

---

### Step 1: Start the Backend (Server)

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd "d:\Study\Semester 5\Full Stack Devlopment\Canteen Prototype\CampusLostAndFound\server"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Check `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/campus_lost_found
   JWT_SECRET=campus_lost_and_found_jwt_secret_key_2026
   ```
   *Note: If using MongoDB Atlas, replace `MONGO_URI` with your connection string.*

4. Run the server:
   ```bash
   npm run dev
   ```
   *The server will start at `http://localhost:5000`.*

---

### Step 2: Start the Frontend (Client)

1. Open a second terminal and navigate to the `client` folder:
   ```bash
   cd "d:\Study\Semester 5\Full Stack Devlopment\Canteen Prototype\CampusLostAndFound\client"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://localhost:3000`.*

---

## 🔑 Key Features

1. **Authentication & Password Recovery (Security Questions):**
   - Student sign-up with Name, College Email, Password, optional Phone Number.
   - **Mandatory Security Question:** Set during registration from a curated list (e.g., *"What was the name of your first school?"*).
   - **Forgot Password Recovery:** Users who forget their password enter their registered email, answer their security question, and set a new password without needing phone numbers or external email servers.
   - **Update Security Details Anytime:** Logged-in students can change their security question, update their answer, or change their password via the **Account & Security Settings** modal.
2. **Post Lost or Found Items:**
   - Choose type (`Lost` or `Found`), category (*Electronics, ID Cards, Keys, Books, etc.*), campus location, date, description, photo link, and direct contact details.
3. **Smart Search & Category Filter:**
   - Real-time search across titles, descriptions, and locations.
   - Filter pills for *All Items*, *Lost Items Only (Red badge)*, and *Found Items Only (Green badge)*.
4. **My Listings Dashboard:**
   - View your own submitted items.
   - One-click status toggle to mark items as **"Claimed / Returned"**.
   - Delete listing option.

---

## 📡 REST API Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new student (with security question) | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `POST` | `/api/auth/security-question` | Retrieve security question for an email | No |
| `POST` | `/api/auth/reset-password` | Verify security answer and reset password | No |
| `PUT` | `/api/auth/update-profile` | Update profile, phone, security question & answer | Yes |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Yes |
| `GET` | `/api/items` | List items (supports search & filters) | No |
| `GET` | `/api/items/:id` | Fetch specific item details | No |
| `POST` | `/api/items` | Post a new Lost or Found item | Yes |
| `PUT` | `/api/items/:id` | Update item or change status | Yes (Owner) |
| `DELETE` | `/api/items/:id` | Delete item post | Yes (Owner) |
| `GET` | `/api/items/my-posts`| Retrieve all posts by current user | Yes |

---

## 🎓 Viva Questions & Answers (Evaluation Prep)

1. **Q: How does the application handle forgotten passwords without third-party email APIs?**
   *A:* The app implements a security-question identity verification flow. During account creation, the user selects a security question and provides an answer. If they forget their password, the server retrieves their question, verifies the provided answer (case-insensitive and trimmed), and hashes the new password with `bcryptjs`. Users can also update this question/answer anytime in their profile settings.

2. **Q: Why is MongoDB used instead of a relational database like MySQL?**
   *A:* MongoDB is a NoSQL document database that stores records as flexible JSON-like documents (BSON). Items can easily have optional fields like images, varied contact methods, or flexible metadata without altering rigid table structures.

3. **Q: What is the role of Express.js and Node.js?**
   *A:* Node.js provides the asynchronous JavaScript runtime outside the browser, while Express.js is the lightweight web framework used to define RESTful API endpoints, manage HTTP middleware, and process client requests.

4. **Q: How does React communicate with the backend?**
   *A:* React uses Axios to make asynchronous HTTP requests to Express endpoints. React's state hooks (`useState`, `useEffect`) store the returned JSON data and re-render UI cards dynamically.

5. **Q: How is user authentication protected?**
   *A:* Passwords are never stored in plain text; they are hashed using `bcryptjs` with salt before being saved. Upon login, a JWT is generated and signed with a secret key. The frontend sends this token in the `Authorization: Bearer <token>` header for protected routes.
