# NBanana_AI 🍌🤖

NBanana_AI is a full-stack AI-powered image transformation web application that allows users to upload images and apply predefined AI-based photo transformations through a simple and intuitive web interface. The project demonstrates end-to-end integration of frontend, backend, and third-party AI services.

---

## 🚀 Project Overview

The goal of NBanana_AI is to simplify AI image transformation by providing:
- A clean user interface for image uploads
- A secure backend that handles AI API communication
- A scalable architecture that separates concerns between frontend and backend

This project was built to move beyond static or UI-only demos and showcase real-world full-stack development skills.

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- JavaScript
- HTML5 / CSS3

### Backend
- Node.js
- Express.js
- REST API architecture

### Other Tools & Concepts
- Environment variables (`.env`)
- API integration
- Modular code structure
- Client–server communication

---

## ✨ Features

- Upload images through a web interface
- Apply predefined AI image transformation effects
- Backend securely communicates with AI services
- Clean separation of frontend and backend logic
- Easy to extend with new AI transformation options

---

## 🧠 How It Works

1. User uploads an image from the frontend
2. Frontend sends the image request to the backend API
3. Backend processes the request and forwards it to the AI service
4. AI service applies the transformation
5. Processed image is returned to the frontend and displayed to the user

---

## 📂 Project Structure
NBanana_AI/
├── Backend/
│ ├── controllers/
│ │ └── NBController.js
│ ├── routes/
│ │ └── NBRoutes.js
│ ├── photoTransformOptions.js
│ ├── index.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md



---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Backend Setup
```bash
cd Backend
npm install
npm start

cd frontend
npm install
npm run dev

