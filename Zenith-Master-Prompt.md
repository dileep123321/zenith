# 🎯 The ZENITH Reconstruction Prompt

**User Role:** You are an AI Lead Architect & Senior Full-Stack Engineer.
**Project Name:** ZENITH
**Objective:** Build a premium, enterprise-grade project management and strategic repository platform from scratch using a step-by-step incremental approach.

---

## 🏗️ Phase 1: Core Architecture & Setup
"Initialize the foundation for a high-performance MERN ecosystem."

1.  **Project Root:** Create a workspace with `backend/` (Node.js/TypeScript) and `frontend/` (Next.js) directories.
2.  **Backend Init:** Setup Express with TypeScript. Implement a layered architecture: `Routes -> Controllers -> Services -> Repositories`.
3.  **Database:** Connect to MongoDB. Define schemas for Users and Projects (Nodes). Use TypeScript interfaces for all data models.
4.  **Local Dev:** Configure Docker Compose for a local Redis instance (required for session management).

---

## ⚡ Phase 2: Secure Identity & State
"Implement industrial-grade security and session handling."

1.  **Auth System:** Build a JWT-based authentication system with Access Tokens (short-lived) and Refresh Tokens.
2.  **Redis Integration:** Store Refresh Token sessions in Redis to allow for instant session revocation and horizontal scaling.
3.  **Validation:** Use Zod or a similar library to strictly validate all incoming API requests (e.g., login credentials, project metadata).

---

## 🎨 Phase 3: Premium UI & Experience
"Design the 'WOW' factor with Next.js and Framer Motion."

1.  **Design System:** Implement a custom Tailwind CSS theme featuring:
    *   **Color Palette:** Deep Obsidian, Electric Violet, and Neon Teal.
    *   **Typography:** Google Fonts (Outfit and Inter).
2.  **Glassmorphism:** Create a "Frosted Glass" UI using `backdrop-filter: blur(10px)` and semi-transparent backgrounds.
3.  **Animations:** Use Framer Motion for:
    *   Staggered entry animations for dashboard cards.
    *   Smooth page transitions.
    *   Micro-interactions (glow effects on hover, scaling on buttons).

---

## 🚀 Phase 4: Cloud Infrastructure (DevOps)
"Move from local development to production-ready orchestration."

1.  **Containerization:** Write optimized `Dockerfile`s for the backend and frontend.
2.  **Kubernetes (K8s):** Create manifest files for:
    *   **Deployments:** Scaling pods for each service.
    *   **Services:** Configuring LoadBalancers and ClusterIPs.
    *   **ConfigMaps & Secrets:** Managing environment variables safely.
3.  **GKE Deployment:** Setup a guide for deploying to Google Kubernetes Engine using GitHub Actions for automated CI/CD.

---

## 📈 Phase 5: Monitoring & Reliability
"Ensure the system is observable and healthy."

1.  **Metrics Stack:** Deploy Prometheus and Grafana into a dedicated monitoring namespace.
2.  **Health Checks:** Implement `/health` endpoints in the backend to allow K8s to manage pod lifecycles.
3.  **Dashboarding:** Configure Grafana dashboards to track CPU, Memory, and API success rates.

---

## 🏷️ Phase 6: Branding & Final Polish
"Infuse the ZENITH identity into every pixel."

1.  **Identity:** Replace all "Antigravity" or generic placeholders with **ZENITH** branding.
2.  **Documentation:** Generate a comprehensive `README.md` and an Architect's Guide detailing how to maintain and scale the platform.

---

### **Execution Instruction for the AI:**
> "Start at Phase 1. Before moving to the next Phase, ensure the current one is fully tested, bug-free, and adheres to the 'Premium Aesthetics' requirement. Always prioritize data integrity and security."
