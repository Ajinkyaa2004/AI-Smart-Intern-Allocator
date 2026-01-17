# Final Review & Viva Preparation

## 1. System Checklist ✅
- [x] **Tech Stack**: Next.js (FE), Express (BE), MongoDB (DB).
- [x] **Architecture**: Monolithic service-oriented design.
- [x] **Auth**: RBAC (Student, Org, Admin) with JWT & Bcrypt.
- [x] **Core AI**: Weighted scoring algorithm (Skills 50%, Preference 30%, GPA 20%).
- [x] **Fairness**: Blind Allocation (PII removed before scoring).
- [x] **Resilience**: Auto-reallocation upon dropout.
- [x] **Transparency**: Admin logs & CSV export.

## 2. API Endpoints Reference
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/register` | Public | Create new account |
| **POST** | `/api/v1/auth/login` | Public | Get JWT Token |
| **POST** | `/api/v1/allocation/run` | Admin | Trigger AI Match Batch |
| **GET** | `/api/v1/allocation/results/:id` | Admin | View specific batch details |
| **GET** | `/api/v1/allocation/export` | Admin | Download Audit CSV |
| **POST** | `/api/v1/allocation/dropout` | Admin/Org | Report dropout & Reallocate |

## 3. Security Review 🔒
*   **Authentication**: Stateless JWT used; tokens expire in 30 days.
*   **Password Storage**: Bcrypt hashing (`genSalt(10)`) prevents rainbow table attacks.
*   **Data Minimization**: Explainable AI reports use `BlindID`, keeping PII safe.
*   **Role Guards**: Middleware `authorize('ADMIN')` protects sensitive allocation triggers.

## 4. Scalability & Future Scope 🚀
*   **Optimization**: Currently uses Greedy algorithm ($O(N*M)$). For 1M+ users, can upgrade to **Gale-Shapley** (Stable Marriage) or **Min-Cost Max-Flow** network flow algorithms.
*   **Queueing**: Move "Run Batch" to a Redis Job Queue (BullMQ) to handle heavy compute asynchronously.
*   **AI Model**: Replace weighted heuristics with a Tensor model learning from successful past internships (Success/Retention rates).

## 5. Viva Explanation Guide 🎤
**"How does your AI work?"**
> *"It uses a deterministic weighted scoring system. We prioritize Skills (50%) to ensure competence, Location Preferences (30%) for intern satisfaction, and GPA (20%) for merit. We deliberately avoid using Name or Gender variables to ensure zero bias."*

**"What happens if someone leaves?"**
> *"The system uses an Event-Driven Reallocation service. When a 'Dropout' event is logged, the system instantly queries the Waitlist for the 'Next Best Fit' for that specific vacancy and auto-assigns the slot, ensuring maximum utilization."*
