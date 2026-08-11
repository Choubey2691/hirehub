# 💼 HireHub – Full-Stack Job Portal & ATS Platform

HireHub is a production-quality, full-stack recruitment and job portal platform built from scratch with modern web technologies (**React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, **Mongoose**, **JWT Auth**, **Multer**, and **Recharts**).

---

## 🌟 Features Overview

### 👨‍💻 Job Seekers
- **Account & Security:** Secure JWT registration/login, session persistence with httpOnly cookies & localStorage.
- **Rich Candidate Profile:** Manage personal info, bio, skills tags, education history, work experience, projects showcase, and upload PDF resumes.
- **Job Search Engine:** Search by title, skills, or company with multi-dimensional filtering (Location, Job Type, Work Mode, Experience, Min Salary) with live pagination & sorting.
- **Job Details & 1-Click Application:** Detailed job specifications, company profile summary, duplicate application check, and direct PDF resume attachment modal.
- **Application Tracking:** Track application status updates (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).
- **Saved Bookmarks:** Save & bookmark positions for quick review.
- **In-App Notifications:** Real-time notification feed when recruiters change application status.

### 🏢 Recruiters
- **Employer Profile:** Create & manage organization profiles (logo, company size, website, industry, location).
- **Job Listing Management:** Post, edit, close/activate, and delete job openings.
- **Applicant Tracking System (ATS):** Filter candidates by job requisition or status, search by candidate name/email, view full candidate profile, view PDF resumes, and update application status in real-time.
- **Recruiter Analytics Dashboard:** Recharts visualizations showing applicant distribution across job postings and hiring metrics.

### 🛡️ Admin Portal
- **Platform Analytics:** Global system stats (total users, seekers, recruiters, companies, active jobs, applications, status breakdown).
- **User Moderation:** View all users, toggle Block/Unblock account status, or delete accounts.
- **Employer & Job Moderation:** Review all registered companies and active job listings.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v3, React Router DOM v6, Axios, Recharts, Framer Motion, Lucide React Icons.
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, JWT, bcryptjs, Multer, Helmet, CORS, Cookie-Parser, Morgan, MongoMemoryServer fallback.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/hirehub.git
cd hirehub
```

### 2. Backend Setup
```bash
cd server
npm install
node seed.js    # Populate database with demo accounts & 15+ jobs
npm run dev     # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev     # Starts Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

The database comes pre-seeded (`node seed.js`) with the following test credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Job Seeker** | `seeker@hirehub.com` | `password123` |
| **Recruiter** | `recruiter@hirehub.com` | `password123` |
| **Admin** | `admin@hirehub.com` | `password123` |

---

## 📡 REST API Documentation Overview

### Auth APIs
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user & set token
- `POST /api/auth/logout` – Clear cookie / session
- `GET /api/auth/me` – Get current logged-in user

### Jobs APIs
- `GET /api/jobs` – Search & filter job listings (supports `search`, `location`, `jobType`, `workMode`, `experience`, `minSalary`, `page`, `limit`, `sort`)
- `GET /api/jobs/:id` – Get single job details
- `POST /api/jobs` – Create job (Recruiter)
- `PUT /api/jobs/:id` – Update job (Recruiter)
- `DELETE /api/jobs/:id` – Delete job (Recruiter/Admin)
- `GET /api/jobs/recruiter/my-jobs` – Get recruiter posted jobs

### Application & ATS APIs
- `POST /api/applications/:jobId` – Apply for job with PDF resume & cover letter
- `GET /api/applications/my-applications` – Get job seeker applications
- `GET /api/applications/job/:jobId` – Get candidate applicants (Recruiter)
- `PUT /api/applications/:id/status` – Update application status (triggers notification)

---

## 📸 Platform Architecture & Layout

HireHub follows clean architectural separation:
- `server/` handles security, database models, REST APIs, Multer storage, and notification dispatching.
- `client/` handles design tokens, React contexts (Auth, Toast), responsive layouts, page components, and Axios services.
