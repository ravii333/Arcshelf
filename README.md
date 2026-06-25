# ArcShelf

**ArcShelf** is an open-source, community-powered archive for previous years' exam papers. Built by students, for students — it gives you a clean, centralized place to find and contribute mid-semester and final exam papers from universities and colleges.

---

## Features

- **Browse by Hierarchy** — Navigate papers through a University → College → Course structure
- **Search** — Quickly find papers by subject, course, or keyword
- **Community Contributions** — Submit exam papers (PDFs/Images) via a streamlined upload form
- **PDF Viewer** — View papers directly in the browser with a built-in PDF reader
- **User Authentication** — Register/login with JWT-based auth; protected submission routes
- **Cloud Storage** — All files stored and delivered via Cloudinary
- **University & College Management** — Admin pages to add and organize institutions
- **Responsive UI** — Clean, minimalist design with Tailwind CSS and Material-UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Routing | React Router DOM 7 |
| UI | Material-UI (MUI) + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Storage | Cloudinary + Multer |
| HTTP Client | Axios |

---

## Project Structure

```
arcshelf/
├── client/                         # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # Axios client + all API calls
│   │   ├── components/
│   │   │   ├── common/             # Card, ContributionCard, FeatureCard, PDFViewer, Icons
│   │   │   ├── forms/              # Input, Select, Textarea, FileUpload
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth context provider
│   │   ├── hooks/
│   │   │   └── useFetch.js         # Generic fetch hook
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SubmitQuestionPage.jsx
│   │   │   ├── QuestionDetailPage.jsx
│   │   │   ├── UniversitiesPage.jsx
│   │   │   └── CollegesPage.jsx
│   │   ├── theme/
│   │   │   └── theme.js            # MUI theme (green #128c43 palette)
│   │   └── main.jsx
│   ├── .env.development            # VITE_API_BASE_URL=http://localhost:5000
│   ├── .env.production             # VITE_API_BASE_URL=https://api-arcshelf.onrender.com
│   └── package.json
│
└── server/                         # Express backend
    ├── config/
    │   ├── db.js                   # MongoDB connection
    │   └── cloudinary.js           # Cloudinary + Multer storage setup
    ├── controllers/
    │   ├── collegeController.js
    │   └── pdfController.js
    ├── middleware/
    │   ├── authMiddleware.js        # JWT verification
    │   └── errorMiddleware.js
    ├── models/
    │   ├── userModel.js            # name, email, password (hashed)
    │   ├── Question.js             # course, semester, subject, examType, year, fileUrl
    │   ├── collegeModel.js         # name, slug, location, university ref
    │   └── universityModel.js      # name, slug, location
    ├── routes/
    │   ├── auth.js                 # POST /auth/register, POST /auth/login
    │   ├── questions.js            # GET/POST /questions, GET /questions/:id
    │   ├── colleges.js             # GET/POST /colleges, GET by university
    │   ├── universities.js         # GET/POST /universities
    │   └── pdf.js                  # GET /pdf/proxy (Cloudinary PDF proxy)
    ├── server.js                   # Entry point, CORS, routes, middleware
    └── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login, returns JWT (24h expiry) |

### Questions (Papers)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/questions` | No | Fetch all papers (populated) |
| GET | `/questions/:id` | No | Fetch a single paper |
| POST | `/questions` | Yes | Submit a new paper with file upload |

### Colleges
| Method | Endpoint | Description |
|---|---|---|
| GET | `/colleges` | List all colleges (with university) |
| POST | `/colleges` | Create a college |
| GET | `/colleges/by-university/:id` | Colleges under a university |

### Universities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/universities` | List all universities |
| POST | `/universities` | Create a university |

### PDF
| Method | Endpoint | Description |
|---|---|---|
| GET | `/pdf/proxy?url=<url>` | Proxy a Cloudinary PDF with correct headers |

---

## Data Models

**Question** — the core document
```
course, semester, subject, year
examType: "Mid Sem" | "Final Sem"
questionsText, markdownContent
fileUrl (Cloudinary), filePublicId
college → College → University
createdBy → User
```

**College**
```
name (unique), slug (unique), location
university → University
```

**University**
```
name (unique), slug (unique), location
```

**User**
```
name, email (unique), password (bcrypt hashed)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=http://localhost:5173
```

```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

### Client Setup

```bash
cd client
npm install
npm run dev       # Starts at http://localhost:5173
```

The client reads `VITE_API_BASE_URL` from `.env.development` or `.env.production` automatically.

---

## How It Works

### Submitting a Paper
1. Register/login → JWT stored in localStorage
2. Navigate to `/submit` (protected route)
3. Select university → college loads dynamically
4. Fill in course, subject, semester, year, exam type
5. Upload PDF → sent to server via multipart form
6. Server uploads to Cloudinary, saves Question to MongoDB
7. Redirects to the paper's detail page

### Viewing a Paper
1. Browse homepage or search
2. Click a paper → `/questions/:id`
3. Metadata and PDF loaded from MongoDB
4. PDF rendered via `/pdf/proxy` to handle CORS and headers correctly

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `VITE_API_BASE_URL` | client | Backend API base URL |
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | Secret for signing JWTs |
| `PORT` | server | Server port (default 5000) |
| `CLOUDINARY_CLOUD_NAME` | server | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | server | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | server | Cloudinary API secret |
| `ALLOWED_ORIGINS` | server | Comma-separated CORS origins |

---

## Contributing

Contributions are welcome. Open an issue or submit a pull request.

---

## License

MIT
