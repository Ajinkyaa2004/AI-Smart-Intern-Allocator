# 🧪 InternMatch AI - Testing Guide

## 🚀 Quick Start for Testing

### Step 1: Start the Application
```bash
npm run dev
```
The app will run on: **http://localhost:3000**

---

## 👥 User Registration & Testing

### **No Pre-created Accounts - Start Fresh!**

All users must register through the application. No hardcoded data or demo accounts exist.

---

## 📝 Registration Process

### 1. **Navigate to Registration**
- Go to: `http://localhost:3000/register`
- Or click "Create Account" from the login page

### 2. **Create Test Accounts**

#### **Admin Account** (You)
```
Email: admin@internmatch.com
Password: admin123
Role: Admin
```

#### **Student Account** (Your Student Tester)
```
Email: student@test.com
Password: student123
Role: Student
```

#### **Organization Account** (Your Organization Tester)
```
Email: org@company.com
Password: org123
Role: Organization
```

---

## 🔐 Login After Registration

1. Go to: `http://localhost:3000/login`
2. Enter your registered credentials
3. You'll be redirected to your role-specific dashboard

---

## 📊 Testing Workflow

### **Phase 1: Account Creation (All Users)**
- [ ] Admin registers at `/register`
- [ ] Student registers at `/register`
- [ ] Organization registers at `/register`
- [ ] All users can successfully log in

### **Phase 2: Student Profile Setup**
**Student should:**
- [ ] Navigate to "My Profile"
- [ ] View profile information
- [ ] Check "My Allocations" page (will be empty initially)

### **Phase 3: Organization Setup**
**Organization should:**
- [ ] Navigate to "Internship Postings"
- [ ] Click "Create New" to post internships (functionality to be added)
- [ ] View "Allocated Candidates" (will be empty initially)

### **Phase 4: Admin Operations**
**Admin should:**
- [ ] Navigate to "Mission Dashboard"
- [ ] View analytics and statistics
- [ ] Check "Transparency Logs"
- [ ] Trigger allocation rounds (when ready)

---

## 🔄 Current System Status

### ✅ **Working Features:**
- User Registration (All Roles)
- User Login with JWT Authentication
- Role-based Dashboard Access
- Protected Routes
- Profile Viewing

### 🚧 **Features to Test (Static Data Currently):**
- Student Profile Data
- Internship Postings
- Allocation System
- Candidate Matching
- Dropout Reporting

---

## 🎯 Next Steps for Full Testing

### **To Enable Full Dynamic Testing, We Need:**

1. **Student Profile Form** - Allow students to enter:
   - Academic details (Institution, Degree, GPA)
   - Skills
   - Location preferences
   - Domain interests

2. **Organization Posting Form** - Allow orgs to create:
   - Internship title
   - Location
   - Required skills
   - Vacancies

3. **Admin Allocation Trigger** - Button to run AI matching

4. **Database Integration** - All forms should save to MongoDB

---

## 📞 Support

If you encounter any issues during testing:
1. Check the browser console (F12)
2. Check the terminal for backend errors
3. Verify MongoDB connection in `.env`

---

## 🔑 Important Notes

- **All data is real** - No mock/hardcoded data
- **Passwords are hashed** - Secure authentication
- **JWT tokens** - Session management
- **Role-based access** - Each user sees only their dashboard

---

## 🎨 Theme Colors (Strict Palette)
- **Background**: Cream White (#FDFBF7)
- **Primary**: Sunset Orange (#FD5E53)
- **Text**: Black (#1a1a1a) / Gray (#666666)

---

**Happy Testing! 🚀**
