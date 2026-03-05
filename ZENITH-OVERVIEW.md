# Welcome to ZENITH

**Zenith** is a premium, enterprise-grade project management and strategic repository platform. It is designed for high-stakes environments where teams need to manage mission-critical projects with a focus on deep visibility, modern aesthetics, and solid data integrity.

---

## 1. Why Zenith? (The Purpose)

In the enterprise world, generic project tracking tools are often too simple. Zenith was created to provide a **"command center"** feel. It focuses on:
*   **Strategic Repository**: A central "vault" for all your development and business initiatives.
*   **Mission-Critical Tracking**: Managing projects that are "Active," "Planning," or "Completed."
*   **Elite Branding**: Using custom colors, glassmorphism, and premium fonts to make the management experience feel executive and powerful.

---

## 2. What it Uses (The Technology Stack)

Zenith is built using the **MERN** stack (with a modern twist):

### **Frontend** (The Face)
*   **Next.js (Web Framework)**: The most modern React framework for speed, server-side rendering, and responsive UI.
*   **Tailwind CSS (Styling)**: For the high-end, dark-mode design, allowing utility-first rapid styling.
*   **Framer Motion (Animations)**: To provide those smooth "WOW" animations when you navigate between dashboard cards.
*   **Lucide React**: For sharp, technical, and customizable SVG icons.

### **Backend** (The Brain)
*   **Node.js & Express**: Handling the high-performance API logic and routes for users and projects.
*   **TypeScript**: Ensuring strong typing across the server, which eliminates hidden bugs in the code.
*   **JWT (JSON Web Tokens)**: Securely logging users in, issuing Access Tokens and Refresh Tokens to protect data.
*   **Redis**: Super-fast in-memory "session storage" to securely manage and scale your login sessions.

### **Database** (The Vault)
*   **MongoDB**: An enterprise-ready NoSQL database storing your users and project schemas reliably.

---

## 3. Core Features (The Capabilities)

### 🔐 **Secure Initialization**
A technical login and registration system that requires an "Access Key" (Password) and "Verify Key" with high-security validation rules (requiring letters and numbers).

### 📊 **Enterprise Dashboard**
A live overview of your system health, active project counts, and team trends. It uses "Glass Cards" to keep the data highly readable while looking incredibly futuristic.

### 📁 **Repository Management**
The ability to "Initialize Node" to create new projects. Each project is tracked with its own status, description, and timeline, fully synchronized with MongoDB.

---

## 4. How to Run It Locally

To start the Zenith command center locally:

1.  **Database**: Make sure your local MongoDB server is running on port `27018`.
2.  **Infrastructure**: Use Docker Compose to spin up Redis (the session manager):
    ```bash
    docker compose up -d redis
    ```
3.  **Backend**: Open a terminal, go to the backend folder, and start the development server:
    ```bash
    cd backend
    npm run dev
    ```
    *(The backend API will run on port 5000)*
4.  **Frontend**: Open another terminal, go to the frontend folder, and start the website:
    ```bash
    cd frontend
    npm run dev
    ```
    *(The frontend will be accessible at http://localhost:3000)*

**Zenith is your absolute connection point for project success.**
