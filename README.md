# 🏋️ TrainLib
### Fitness & Gym Management Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.3-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**A seamless, full-stack fitness ecosystem for Enthusiasts, Trainers, and Admins.**

[🌐 Live Website](https://train-lib-seven.vercel.app) • [💻 Frontend Repository](https://github.com/shafikulnayem10/PH_A-10-TrainLib-Client) • [⚙️ Backend Repository](https://github.com/shafikulnayem10/PH_A-10-TrainLib-Server)

</div>

---

## 🎯 Purpose

**TrainLib** is designed to revolutionize the fitness industry by providing a unified platform where:

- **⚡ Fitness Enthusiasts** can effortlessly discover classes, book secure sessions, and engage with a vibrant health-focused community.
- **💪 Certified Trainers** can efficiently manage their class schedules, track student progress, and share industry knowledge.
- **👑 Platform Administrators** can seamlessly oversee overall operations, manage users, and ensure high-quality control.

The platform aims to make fitness accessible, engaging, and professionally managed for everyone.

---

## ✨ Key Features

### 👤 User Features

- **Secure Auth:** Seamless registration and login using email/password or Google OAuth via Better Auth.
- **Browse & Filter:** Easily search and filter diverse fitness classes by name and category.
- **Smart Booking:** Hassle-free and secure class booking with Stripe payment integration.
- **Personal Favorites:** Save preferred classes to a personal list for quick, future access.
- **Community Forum:** Read, comment, and actively engage with informative fitness content.
- **Trainer Application:** Submit professional applications to become a verified platform trainer.
- **User Dashboard:** Track booked classes, favorite items, and trainer application updates dynamically.

### 🏋️ Trainer Features

- **Class Management:** Full CRUD control to create, update, and delete specialized fitness classes.
- **Student Tracking:** View and monitor enrolled students dedicated to each specific class.
- **Knowledge Sharing:** Write, manage, and publish interactive community forum posts.
- **Trainer Dashboard:** Analyze overall impact with stats on total classes and overall student enrollment.

### 👑 Admin Features

- **User Control:** Block/unblock users instantly or promote trusted members to Admin roles.
- **Application Review:** Review, approve, or reject incoming trainer applications with ease.
- **Content Moderation:** Maintain platform quality by moderating classes and deleting inappropriate forum posts.
- **Financial Oversight:** Monitor all transaction histories directly processed through the Stripe gateway.
- **Platform Analytics:** Gain insights via a comprehensive dashboard powered by **Recharts** visualization.

### 🔒 Security Features

- **RBAC:** Strict Role-Based Access Control protecting User, Trainer, and Admin routes.
- **Session Management:** Secure authentication and session handling through Better Auth.
- **Soft Block Mechanism:** Suspended users can still safely browse content but are restricted from performing mutations or actions.

---

## 🛠️ Technology Stack

### Frontend & UI

- **Framework:** Next.js (v16.2.9) with App Router Architecture
- **Library & Animation:** React (v19.2.4) & Framer Motion (v12.40.0)
- **Styling & Components:** Tailwind CSS (v4.x) & HeroUI (v3.2.1)
- **Data Visualization:** Recharts (v3.8.1)
- **Icons & Toasts:** Lucide React, Gravity UI Icons & React Hot Toast
- **Authentication:** Better Auth (v1.6.19)
- **Payments:** Stripe.js (v9.8.0)

### Backend & Database

- **Server Environment:** Node.js with Express.js (v4.x) Framework
- **Database:** MongoDB (v7.3.0)
- **Payment Gateway:** Stripe SDK (v22.2.1)
- **Utilities:** CORS, Dotenv

### DevOps & Third-Party Services

- **Hosting:** Vercel (Frontend & Serverless Backend)
- **Cloud Database:** MongoDB Atlas
- **Image CDN:** ImgBB API
- **Payment Processing:** Stripe

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have the following installed or configured:

- Node.js (v18 or higher)
- npm
- MongoDB Atlas Cloud Account
- Stripe Developer Account
- ImgBB API Key

### 1. Clone the Frontend Repository

**Frontend Repository:** [PH_A-10-TrainLib-Client](https://github.com/shafikulnayem10/PH_A-10-TrainLib-Client)

```bash
git clone https://github.com/shafikulnayem10/PH_A-10-TrainLib-Client.git

cd PH_A-10-TrainLib-Client

npm install
```

Create a `.env.local` file in the root directory and configure the required environment variables, including Better Auth, ImgBB, and Stripe public keys.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 2. Clone the Backend Repository

**Backend Repository:** [PH_A-10-TrainLib-Server](https://github.com/shafikulnayem10/PH_A-10-TrainLib-Server)

```bash
git clone https://github.com/shafikulnayem10/PH_A-10-TrainLib-Server.git

cd PH_A-10-TrainLib-Server

npm install
```

Create a `.env` file in the root directory and configure the required environment variables, such as:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Add any other environment variables required by the backend configuration.

Start the backend server:

```bash
node index.js
```

**Note:** Never commit `.env` or `.env.local` files containing private credentials to GitHub.

---

## 📱 Responsive Design

TrainLib offers a fully responsive layout tailored for all standard modern viewports:

- **Mobile (320px — 768px):** Clean, finger-friendly layouts equipped with an interactive hamburger menu.
- **Tablet (768px — 1024px):** Fluid grids adapting perfectly to medium screens.
- **Desktop (1024px+):** Full-scale optimized dashboard view featuring smooth sidebar navigation.

---

## 👨‍💻 Author

**Shafiqul Islam Nayem**

- GitHub: [@shafikulnayem10](https://github.com/shafikulnayem10)
- LinkedIn: [Shafiqul Islam Nayem](https://www.linkedin.com/in/shafiqulislamnayem/)

---

<div align="center">

**⭐ If you find TrainLib interesting, consider giving this repository a star!**

Made with ❤️ by Shafiqul Islam Nayem

</div>
