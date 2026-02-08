# 🚀 SMART INTERNSHIP ALLOCATION SYSTEM

## 🧠 AI-Based Smart Allocation Engine for PM Internship Scheme

A **full-stack web application** designed to **fairly, transparently, and efficiently allocate internships to students at scale** using an explainable AI-based approach.

---

# 📌 PROJECT OVERVIEW

The **Smart Internship Allocation System** addresses critical challenges faced by large-scale government internship programs such as the **PM Internship Scheme**.

With thousands of applicants and limited internship capacities across regions and sectors, traditional allocation systems struggle with:

❌ Skill mismatches  
❌ Preference conflicts  
❌ Delays and dropouts  
❌ Lack of transparency  

This project introduces an **AI-driven, explainable, and scalable allocation platform** built using the **MERN stack** to solve these issues.

---

# 🎯 OBJECTIVES

✅ Automate internship allocation at scale  
✅ Match students and internships based on skills and preferences  
✅ Enforce government constraints (capacity, inclusion, regional balance)  
✅ Provide **explainable and transparent allocation decisions**  
✅ Reduce internship underutilization caused by dropouts  

---

# 🧠 CORE FEATURES

## 🤖 AI Allocation Engine (Core)
- **Machine Learning-based matching** using Random Forest Regressor
- **Hybrid scoring system**: ML predictions (60%) + Rule-based logic (40%)
- Learns from historical allocation data and ratings
- Confidence scores for each prediction
- Weighted scoring based on:
  - Skills match (most important)
  - Academic performance (GPA)
  - Domain & location preferences
  - Historical success patterns
- Capacity-aware allocation  
- Waitlist generation
- **Explainable AI**: Shows both ML predictions and rule-based breakdowns

---

## 🔍 Explainable & Fair Allocation
- Clear **"Why this internship?"** explanation with ML confidence
- Allocation reasoning stored and displayed  
- Blind resume allocation to reduce bias
- Feature importance tracking
  - Name, gender, college excluded during scoring  

---

## 🧑‍🎓 STUDENT MODULE
- Profile creation (skills, education, preferences)  
- Resume upload (PDF)  
- Internship recommendations  
- Skill-gap identification  
- Allocation status with explanation  

---

## 🏢 ORGANIZATION MODULE
- Organization registration  
- Internship posting & management  
- View allocated candidates  
- Accept / reject candidates  
- Report dropouts  

---

## 🏛️ ADMIN (GOVERNMENT) DASHBOARD
- System-wide monitoring  
- Allocation trigger & re-run  
- Explainable allocation logs  
- Internship utilization analytics  
- User & internship management  

---

## 🔁 DROPOUT AUTO RE-ALLOCATION
- Detect student or organization dropouts  
- Automatically assign next best candidate  
- Prevent internship wastage  

---

## � NOTIFICATION SYSTEM
- **In-App Notifications**: Real-time updates in dashboard  
- **Email Notifications**: Configurable SMTP email alerts  
  - Student allocation confirmation  
  - Organization candidate alerts  
  - Allocation status updates  
  - Dropout & reassignment notifications  
- Priority-based notification system (URGENT, HIGH, MEDIUM, LOW)
- Notification history tracking

---

## 📊 ANALYTICS & REPORTS
- Allocated vs unallocated internships  
- Dropout statistics  
- Utilization rate  
- **Fairness Metrics**: Skill match distribution, regional balance  
- **Utilization Tracking**: Internship capacity usage, waitlist stats  
- Exportable reports (CSV / PDF)  

---

## 📈 SCALABILITY & PERFORMANCE
- **Batch Processing**: Handles 10,000+ students in single allocation run  
- **Data Simulation**: Built-in synthetic data generator for testing  
- **Performance Metrics**:
  - Allocation time: ~2-5 seconds for 1,000 allocations
  - ML prediction: <100ms per student-internship pair
  - Database optimization with indexing
- **Horizontal Scaling Ready**: Stateless API design  

---

# 🛠️ TECH STACK

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB |
| **Machine Learning** | **Python, scikit-learn, Random Forest** |
| Authentication | JWT |
| File Processing | pdf-parse, multer |
| Email Service | Nodemailer (SMTP) |
| Charts | Recharts |
| Integration | python-shell (Node ↔ Python) |

---

# 🤖 MACHINE LEARNING INTEGRATION

This project includes a **real ML model** for intelligent matching:

- **Algorithm**: Random Forest Regressor (100 trees)
- **Training Data**: Historical allocations + ratings
- **Features**: 15 engineered features (skills, GPA, preferences, etc.)
- **Hybrid Approach**: 60% ML + 40% Rule-based
- **Output**: Match scores (0-1) with confidence intervals

📚 **Full Documentation**: See [ML_INTEGRATION.md](ML_INTEGRATION.md)

### Quick Setup
```bash
# Install Python dependencies
pip3 install -r ml/requirements.txt

# Train model (need historical data)
curl -X POST http://localhost:3000/api/v1/ml/train \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Enable ML scoring in .env
USE_ML_SCORING=true
```

---

# 🧪 TESTING & SIMULATION

## Generate Sample Data
Test the system with realistic synthetic data:

```bash
# Generate 1,000 students and 200 internships
python3 ml/generate_sample_data.py

# Or specify custom counts
python3 ml/generate_sample_data.py --students 5000 --internships 500
```

## Run Load Tests
```bash
# Test allocation performance
node test-allocation-performance.js
```

## Metrics Dashboard
Access real-time metrics at `/admin/analytics`:
- **Allocation Rate**: % of students successfully matched
- **Fairness Score**: Distribution of match quality across demographics
- **Capacity Utilization**: % of internship slots filled
- **Average Match Score**: Mean compatibility score
- **Regional Balance**: Geographic distribution of allocations
- **Skills Gap Analysis**: Unmet skill requirements

---

# 📧 EMAIL NOTIFICATION SETUP

## Configuration

Add these environment variables to `.env`:

```bash
# Email Service (SMTP)
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=InternMatch AI <noreply@internmatch.ai>
```

## Supported Email Providers

### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
# Use App Password (not regular password)
```

### Outlook/Office365
```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
```

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## Email Templates

Custom email templates are available in `server/templates/emails/`:
- `allocation-confirmation.html`
- `candidate-alert.html`
- `dropout-notification.html`
- `rating-request.html`

---

## 🤝 Connect With Me  

<p align="center">
  <a href="https://www.linkedin.com/in/ajinkya842004/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:dhumalajinkya2004@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://github.com/Ajinkyaa2004" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://itsajinkya.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-4CAF50?style=for-the-badge&logo=about.me&logoColor=white" />
  </a>
</p>

---

# 🚀 QUICK COMMAND REFERENCE

## Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing & Performance
```bash
# Run performance tests
node test-allocation-performance.js

# Test database connection
node test-db.js

# Test ML model
bash test-ml.sh
```

## Data Generation
```bash
# Generate sample data (1000 students, 200 internships)
python3 ml/generate_full_sample_data.py

# Custom data generation
python3 ml/generate_full_sample_data.py --students 5000 --internships 500

# Seed database
node seed-data.js
```

## Email Setup
```bash
# Quick email setup
bash setup-email.sh

# Test email service
node -e "require('./server/services/emailService').sendEmail({to:'test@example.com', subject:'Test', html:'<h1>Test</h1>'})"
```

## ML Operations
```bash
# Install Python dependencies
pip3 install -r ml/requirements.txt

# Train model
curl -X POST http://localhost:3000/api/v1/ml/train \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Check model status
curl -X GET http://localhost:3000/api/v1/ml/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

**Built with ❤️ for fair and transparent internship allocation**

