# AI-Based Smart Allocation Engine - System Architecture

## 1. High-Level Architecture Diagram

This architecture follows a **Monolithic-First** approach (for speed and consistency) with **Service-Oriented** internal design to ensure scalability for government use cases.

```mermaid
graph TD
    Client[User Client (Browser)]
    LB[Load Balancer / Reverse Proxy]
    
    subgraph "Application Layer (Node.js)"
        NextJS[Next.js App Router (Frontend/SSR)]
        Express[Express.js Custom Server (API Gateway)]
        
        subgraph "Core Services"
            Auth[Auth Service & RBAC]
            Profile[Profile Management (KYC)]
            Match[AI Allocation Engine]
            Comms[Notification Service]
        end
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB Primary DB)]
        Redis[(Redis Cache - Sessions/Queue)]
    end

    Client --> LB
    LB --> NextJS
    NextJS -- API Calls --> Express
    Express --> Auth
    Express --> Match
    Match --> MongoDB
    Auth --> MongoDB
```

---

## 2. File & Folder Structure

We will adopt a structure that clearly separates the **Next.js Frontend** (Presentation) from the **Express Backend** (Business Logic/API).

```bash
/
├── app/                        # Next.js App Router (Frontend)
│   ├── (auth)/                 # Public Auth Pages (Login/Register)
│   ├── (dashboard)/            # Protected Dashboard Layouts
│   │   ├── student/            # Student View
│   │   ├── org/                # Organization View
│   │   └── admin/              # Admin/Ministry View
│   ├── api/                    # (Avoid using NextAuth handlers here, delegate to Express)
│   ├── components/             # Reusable UI Components
│   └── globals.css             # Tailwind Styles
│
├── server/                     # Express Backend Logic
│   ├── config/                 # DB, Env, Constants
│   ├── controllers/            # Request Handlers (Input validation, Response formatting)
│   ├── middlewares/            # RBAC, Auth checks, Error handling
│   ├── models/                 # Mongoose Schemas (Strict Typing)
│   ├── routes/                 # API Route Definitions
│   ├── services/               # Business Logic & AI Algorithms
│   │   ├── auth.service.js
│   │   ├── matching.service.js # CORE: The Smart Allocation Logic
│   │   └── notification.service.js
│   └── utils/                  # Helper functions (Logger, Validators)
│
├── public/                     # Static Assets
├── server.js                   # Entry Point (Mounts Express & Next)
└── package.json
```

---

## 3. Role-Based Routing Plan (RBAC)

The system enforces strict separation of concerns based on user roles: **Student**, **Organization**, and **Admin**.

### A. Frontend Routes (Next.js)
| Role   | Route Pattern | Purpose |
| :--- | :--- | :--- |
| **Public** | `/` | Landing Page |
| **Student** | `/dashboard/student/profile` | Resume & Skill Set |
| | `/dashboard/student/matches` | View Allocated Internships |
| **Organization** | `/dashboard/org/postings` | Create Internship Requirements |
| | `/dashboard/org/candidates` | View Aligned Candidates |
| **Admin** | `/dashboard/admin/analytics` | Master View of matching rates |
| | `/dashboard/admin/config` | Adjust Allocation Weights |

### B. Backend Routes (Express API)
All API routes are prefixed with `/api/v1` and protected by `verifyToken` and `roleGuard` middleware.

- **`/api/v1/auth/*`**: Login, Register via Government SSO/Email.
- **`/api/v1/student/*`**: Read/Write profile, view status.
- **`/api/v1/org/*`**: Post vacancies, validate candidates.
- **`/api/v1/admin/*`**: Trigger allocation commands, view system health.

---

## 4. Service Boundaries

To maintain clean code and scalability, specific responsibilities are isolated into services:

### 1. Authentication & Security Service (`auth.service.js`)
- **Responsibility**: Handle Login/Signup, JWT Token issuance, Password hashing.
- **Security**: Implements Rate Limiting and Session management.

### 2. Allocation & Matching Engine (`matching.service.js`) - **THE CORE**
- **Responsibility**: Runs the matching algorithm.
- **Logic**:
    1.  **Fetch**: Retrieve active Students and Vacancies.
    2.  **Filter**: Hard constraints (Location, Degree, Language).
    3.  **Score**: AI Scoring (Skill embedding similarity, Academic Preference).
    4.  **Optimize**: Stable Marriage Algorithm or Weighted Bipartite Matching to ensure fairness.
- **Output**: Writes `Allocation` records to DB.

### 3. Analytics Service (`analytics.service.js`)
- **Responsibility**: Aggregates data for the Admin Dashboard.
- **Metrics**: Utilization Rate, regional distribution, sector-wise demand.

### 4. Notification Layer
- **Responsibility**: Email/SMS alerts when allocation results are published.
