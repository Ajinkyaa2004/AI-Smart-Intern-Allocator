# Startup Guide: AI-Based Smart Allocation Engine

## 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas) - Ensure it is running on `mongodb://localhost:27017` or update `.env`.

## 2. Installation
Open your terminal and run:
```bash
# Install all dependencies
npm install
```

## 3. Environment Setup
Check your `.env` file contains:
```env
MONGODB_URI=mongodb://localhost:27017/internmatch_ai
PORT=3000
JWT_SECRET=your_secure_secret_key_here
```

## 4. Running the Project
**Development Mode** (Runs both Next.js Frontend + Express Backend):
```bash
npm run dev
```
- Access App: [http://localhost:3000](http://localhost:3000)
- API Endpoint: `http://localhost:3000/api/v1`

## 5. Quick Functional Tour
### A. Authentication
1.  Go to `http://localhost:3000/login`
2.  **Student Demo**: Click "As Student" to view the Candidate Dashboard.
3.  **Org Demo**: Click "As Organization" to view the Ministry Dashboard.
4.  **Admin Demo**: Log in with Admin credentials (seed data required) to view Analytics.

### B. Core Features (API Testing via Postman/Curl)
*   **Trigger Allocation**: `POST /api/v1/allocation/run` (Header: `Authorization: Bearer <ADMIN_TOKEN>`)
*   **Report Dropout**: `POST /api/v1/allocation/dropout`
*   **Export Audit Log**: `GET /api/v1/allocation/export`

## 6. Project Structure Overview
*   `server.js`: **API Gateway**. Connects Express to Next.js.
*   `app/`: **Frontend**. Next.js App Router (Dashboards, Auth).
*   `server/services/allocationService.js`: **The Brain**. Contains the Weighted Scoring Algorithm.
*   `server/services/reallocationService.js`: **The Safety Net**. Handles Dropouts & Auto-Reassignment.

## 7. Troubleshooting
*   **Port 3000 Busy?**: Run `npx kill-port 3000` or `pkill -f "node server.js"`.
*   **MongoDB Error?**: Ensure `mongod` is running locally.

---
**System Status**: ✅ READY FOR DEMO
