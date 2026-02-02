# 🔐 Test Credentials - InternMatch AI

## Database Status: ✅ POPULATED & UPDATED

- **Students**: 5
- **Organizations**: 5  
- **Internships**: 10 positions (21 total vacancies)
- **Server**: http://localhost:3000
- **All Passwords**: `12341234` (for easy testing)

---

## 👨‍🎓 STUDENT ACCOUNTS

### 1. Ajinkya Dhumal (You)
- **Email**: `ajinkya@gmail.com`
- **Password**: `12341234`
- **GPA**: 8.7/10
- **Skills**: Python (4★), React (5★), Node.js (4★), MongoDB (3★), Machine Learning (3★)
- **Preferences**: Mumbai, Pune, Bangalore | Technology, AI/ML, Web Development
- **Min Stipend**: ₹15,000
- **Expected Matches**: Full Stack Dev, ML Research, Data Science

---

### 2. Priya Sharma@gmail.com`
- **Password**: `12341234@student.edu`
- **Password**: `priya@123`
- **GPA**: 9.2/10 ⭐ (Highest)
- **Skills**: Java (5★), Spring Boot (4★), MySQL (4★), AWS (3★), Docker (3★)
- **Preferences**: Delhi, Noida, Gurgaon, Bangalore | Technology, Cloud Computing, Backend
- **Min Stipend**: ₹20,000
- **Expected Matches**: Backend Dev, Cloud Infrastructure, DevOps

---

### 3. Rahul Verma
- **Email**: `rahul@gmail.com`
- **Password**: `12341234`
- **GPA**: 8.9/10
- **Skills**: Python (4★), Data Science (5★), TensorFlow (4★), SQL (4★), Power BI (3★)
- **Preferences**: Bangalore, Hyderabad, Pune | AI/ML, Data Science, Analytics
- **Min Stipend**: ₹18,000
- **Expected Matches**: ML Research, Data Science

---

### 4. Ananya Patel
- **Email**: `ananya@gmail.com`
- **Password**: `12341234`
- **GPA**: 8.5/10
- **Skills**: Flutter (5★), Dart (4★), Firebase (4★), React Native (3★), UI/UX Design (4★)
- **Preferences**: Pune, Mumbai, Bangalore | Mobile Development, Technology, UI/UX
- **Min Stipend**: ₹12,000
- **Expected Matches**: Flutter Dev, Mobile UI/UX Designer

---

### 5. Vikram Singh
- **Email**: `vikram@gmail.com`
- **Password**: `12341234`
- **GPA**: 7.8/10
- **Skills**: AutoCAD (4★), SolidWorks (4★), MATLAB (3★), Python (2★), Project Management (3★)
- **Preferences**: Kolkata, Mumbai, Delhi, Chennai | Manufacturing, Automotive, Core Engineering
- **Min Stipend**: ₹10,000
- **Expected Matches**: Mechanical Engineering, Project Management

---

## 🏢 ORGANIZATION ACCOUNTS

### 1. TechCorp India Pvt Ltd
- **Email**: `techcorp@gmail.com`
- **Password**: `12341234`
- **Type**: Private Company
- **Sector**: Technology
- **Locations**: Mumbai, Bangalore, Pune

**Internships**:
1. **Full Stack Developer Intern**
   - Location: Mumbai
   - Stipend: ₹15,000
   - Vacancies: 3
   - Min GPA: 7.5
   - Skills: React, Node.js, MongoDB, JavaScript
   
2. **Backend Developer Intern**
   - Location: Bangalore
   - Stipend: ₹18,000
   - Vacancies: 2
   - Min GPA: 8.0
   - Skills: Java, Spring Boot, MySQL

---

### 2. National AI Research Lab
- **Email**: `national@gmail.com`
- **Password**: `12341234`
- **Type**: Government Ministry
- **Sector**: AI/ML
- **Locations**: Delhi, Bangalore

**Internships**:
1. **Machine Learning Research Intern**
   - Location: Delhi
   - Stipend: ₹25,000 💰 (Highest)
   - Vacancies: 2
   - Min GPA: 8.5
   - Skills: Python, Machine Learning, TensorFlow, Data Science
   
2. **Data Science Intern**
   - Location: Bangalore
   - Stipend: ₹20,000
   - Vacancies: 3
   - Min GPA: 8.0
   - Skills: Python, Data Science, SQL, Power BI

---

### 3. MobileFirst Solutions
- **Email**: `mobilefirst@gmail.com`
- **Password**: `12341234`
- **Type**: Private Company
- **Sector**: Mobile Development
- **Locations**: Pune, Mumbai

**Internships**:
1. **Flutter Developer Intern**
   - Location: Pune
   - Stipend: ₹12,000
   - Vacancies: 2
   - Min GPA: 7.0
   - Skills: Flutter, Dart, Firebase
   
2. **Mobile UI/UX Designer Intern**
   - Location: Mumbai
   - Stipend: ₹14,000
   - Vacancies: 2
   - Min GPA: 7.5
   - Skills: UI/UX Design, Flutter, React Native

---

### 4. Bharat Heavy Electricals Limited (BHEL)
- **Email**: `bel@gmail.com`
- **Password**: `12341234`
- **Type**: Public Sector Unit (PSU)
- **Sector**: Manufacturing
- **Locations**: Delhi, Mumbai, Kolkata

**Internships**:
1. **Mechanical Engineering Intern**
   - Location: Kolkata
   - Stipend: ₹12,000
   - Vacancies: 3
   - Min GPA: 7.0
   - Skills: AutoCAD, SolidWorks, MATLAB
   
2. **Project Management Intern**
   - Location: Mumbai
   - Stipend: ₹15,000
   - Vacancies: 2
   - Min GPA: 7.5
   - Skills: Project Management, AutoCAD, Python

---

### 5. CloudNine Technologies
- **Email**: `cloudnine@gmail.com`
- **Password**: `12341234`
- **Type**: Private Company
- **Sector**: Cloud Computing
- **Locations**: Bangalore, Hyderabad, Pune

**Internships**:
1. **Cloud Infrastructure Intern**
   - Location: Bangalore
   - Stipend: ₹22,000
   - Vacancies: 2
   - Min GPA: 8.0
   - Skills: AWS, Docker, Python
   
2. **DevOps Intern**
   - Location: Pune
   - Stipend: ₹18,000
   - Vacancies: 2
   - Min GPA: 7.5
   - Skills: Docker, AWS, Java

---

## 🧪 Testing the Trigger Allocation Round

### Step 1: Start the Server
```bash
npm run dev
```
Server should be running at: http://localhost:3000

### Step 2: Login as Admin
- Go to: http://localhost:3000/login
- Use admin credentials (if you have them, or create one)

### Step 3: Trigger Allocation
1. Navigate to **Admin Dashboard** → **Analytics**
2. Click the **"Trigger Allocation Round"** button
3. Wait for the success message

### Step 4: Expected Results
The allocation engine will create matches based on:
- **45%** - Skill matching
- **20%** - Domain/sector alignment
- **20%** - Location preferences
- **15%** - GPA score

**Expected Matches**:
- **Ajinkya** → Full Stack Dev (Mumbai) - High React/Node.js match
- **Priya** → Backend Dev (Bangalore) OR Cloud Infrastructure - Perfect Java/AWS skills
- **Rahul** → ML Research OR Data Science - Excellent Data Science skills
- **Ananya** → Flutter Dev (Pune) - Perfect Flutter/Dart match
- **Vikram** → Mechanical Engineering (Kolkata) - AutoCAD/SolidWorks match

### Step 5: Verify Results
1. Check **Admin Logs** to see all allocations
2. Login as students to see their matches
3. Login as organizations to review candidates

---

## 📊 Quick Database Check

Run this to verify data:
```bash
mongosh internmatch_ai --eval "
  console.log('Students:', db.students.countDocuments());
  console.log('Organizations:', db.organizations.countDocuments());
  console.log('Internships:', db.internships.countDocuments());
  console.log('Pending Students:', db.students.countDocuments({allocationStatus: 'PENDING'}));
"
```

---

## 🔄 Re-seed Database

If you need to reset and re-populate:
```bash
node seed-data.js
```

This will:
- Clear all test students and organizations
- Keep admin accounts
- Create fresh data
- Reset allocation statuses to PENDING

---

## 📝 Notes

- All students start with `allocationStatus: 'PENDING'`
- All internships start with `status: 'OPEN'`
- Total vacancies: 21 positions
- Total students: 5
- **Allocation should create 5 matches** (1:1 student-internship ratio)
- Some internships will have remaining vacancies
- Scores will vary from 30% to 90%+ based on matching criteria

---

**Last Updated**: January 19, 2026
**Status**: ✅ Ready for Testing
