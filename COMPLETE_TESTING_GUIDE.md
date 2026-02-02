# 🧪 COMPREHENSIVE TESTING GUIDE - InternMatch AI

## Test Credentials
All passwords: `12341234`

### Admin Account:
- Email: `admin@gmail.com`
- Password: `12341234`

### Student Accounts (5 total):
1. `ajinkya@gmail.com` / `12341234`
2. `priya@gmail.com` / `12341234`
3. `rahul@gmail.com` / `12341234`
4. `ananya@gmail.com` / `12341234`
5. `vikram@gmail.com` / `12341234`

### Organization Accounts (5 total):
1. `techcorp@gmail.com` / `12341234` - TechCorp
2. `national@gmail.com` / `12341234` - National Semiconductor
3. `mobilefirst@gmail.com` / `12341234` - MobileFirst Solutions
4. `bel@gmail.com` / `12341234` - Bharat Electronics
5. `cloudnine@gmail.com` / `12341234` - CloudNine Systems

---

## 🎯 Feature Testing Scenarios

### 1. Testing Notification System 🔔

**Test Case 1.1: View Notifications**
1. Login as any user
2. Look for bell icon in top-right header
3. Click the bell icon
4. Verify dropdown shows notifications (if any exist)
5. Check unread count badge displays correctly

**Test Case 1.2: Mark Notification as Read**
1. Login and open notification dropdown
2. Click on an unread notification (blue background)
3. Verify it navigates to relevant page
4. Return and check notification background is now white (read)
5. Verify unread count decreased

**Test Case 1.3: Delete Notification**
1. Open notification dropdown
2. Hover over a notification
3. Click the trash icon on the right
4. Verify notification is removed immediately
5. Check dropdown updates correctly

**Test Case 1.4: Mark All as Read**
1. Have multiple unread notifications
2. Click "Mark all read" button in dropdown header
3. Verify all notifications turn white (read)
4. Check unread count becomes 0

**Expected Results:**
- ✅ Bell icon always visible in header
- ✅ Unread count shows correct number (1-9 or 9+)
- ✅ Dropdown scrollable if many notifications
- ✅ Click outside closes dropdown
- ✅ Emoji icons show for different types
- ✅ Priority badges colored correctly (red/yellow/blue)
- ✅ Relative time displays ("5m ago", "2h ago")

---

### 2. Testing Rating & Feedback System ⭐

**Test Case 2.1: Student Rates Internship**
1. Login as student (`ajinkya@gmail.com`)
2. Go to "My Allocations" page
3. Accept an allocation (click "Accept Offer")
4. Navigate to "Rate Internship" in sidebar
5. Click "Rate This Internship" button
6. Click stars to rate each criterion (1-5):
   - Overall Experience
   - Learning Experience
   - Mentorship Quality
   - Work Environment
7. Type feedback in text area (optional)
8. Check/uncheck "Would recommend" checkbox
9. Click "Submit Feedback"
10. Verify success message appears
11. Check internship disappears from pending list

**Test Case 2.2: Organization Rates Student**
1. Login as organization (`techcorp@gmail.com`)
2. Navigate to "Rate Interns" page
3. Find allocated student in list
4. Click "Rate This Intern" button
5. Rate each criterion:
   - Overall Performance
   - Technical Skills
   - Communication Skills
   - Professionalism
   - Work Ethic
6. Add performance feedback (optional)
7. Check/uncheck "Would hire again"
8. Click "Submit Rating"
9. Verify success confirmation
10. Check student removed from pending list

**Test Case 2.3: No Pending Ratings**
1. Login as student with no accepted allocations
2. Go to "Rate Internship"
3. Verify empty state shows:
   - Gray star icon
   - "No Pending Feedback" message
   - Helpful description text

**Expected Results:**
- ✅ Star ratings interactive (hover effects, click to select)
- ✅ All 5 stars clickable (1-5 rating)
- ✅ Overall score required (can't submit with 0)
- ✅ Other scores optional (default 0)
- ✅ Feedback text optional
- ✅ Form resets after submission
- ✅ Only shows completed/accepted internships
- ✅ Each internship can only be rated once

---

### 3. Testing Multi-round Allocation 🔄

**Test Case 3.1: Accept Allocation**
1. Login as admin
2. Click "Trigger Allocation Round"
3. Wait for success notification
4. Login as student with allocation
5. Go to "My Allocations"
6. Click "Accept Offer" on proposed allocation
7. Verify status changes to "ACCEPTED"
8. Check notification sent to organization

**Test Case 3.2: Reject and Reallocate**
1. Login as student with allocation
2. Go to "My Allocations"
3. Click "Reject Offer"
4. Provide rejection reason (optional)
5. Confirm rejection
6. Verify message: "Allocation rejected. Searching for alternative matches..."
7. Check student status reset to PENDING
8. Login as admin and check logs
9. Verify reallocation attempt logged

**Test Case 3.3: View Allocation Details**
1. Login as student
2. Go to "My Allocations"
3. View allocation card showing:
   - Internship title
   - Organization name
   - Match score percentage
   - Score breakdown (Skills, Domain, Location, GPA)
   - Status badge
   - Accept/Reject buttons

**Expected Results:**
- ✅ Accept updates status immediately
- ✅ Reject triggers automatic reallocation search
- ✅ Notifications sent on both actions
- ✅ Organization notified of accept/reject
- ✅ Next best match found if available
- ✅ Rejection reason stored in database
- ✅ Student can be reallocated after rejection

---

### 4. Testing Resume Upload & AI Parsing 📄

**Test Case 4.1: Upload Valid PDF Resume**
1. Login as student (`priya@gmail.com`)
2. Go to "My Profile"
3. Scroll to "Resume Upload" section
4. Click "Choose File" or drag-drop PDF
5. Select a PDF resume (< 5MB)
6. Verify file name displays
7. Click "Upload Resume"
8. Wait for processing (AI parsing)
9. Verify success message appears
10. Check extracted data displayed:
    - Skills (with count)
    - Education (GPA if found)
    - Experience entries

**Test Case 4.2: Invalid File Type**
1. Try uploading a non-PDF file (.docx, .txt, .jpg)
2. Verify error: "Only PDF files are allowed"
3. Check file not uploaded

**Test Case 4.3: File Too Large**
1. Try uploading PDF > 5MB
2. Verify error: "File size must be less than 5MB"
3. Check upload blocked

**Test Case 4.4: Download Resume**
1. After successful upload
2. Click "Download" button
3. Verify PDF downloads to your computer
4. Open PDF and confirm it's your resume

**Test Case 4.5: Delete Resume**
1. With resume uploaded
2. Click "Delete" button
3. Confirm deletion in popup
4. Verify resume removed
5. Check upload section reappears

**Test Case 4.6: Auto-populated Profile**
1. Upload resume with clear skills section
2. After parsing, go to Skills section
3. Verify skills automatically added
4. Check no duplicate skills created
5. Confirm education fields updated if GPA found

**Expected Results:**
- ✅ Only PDF files accepted
- ✅ 5MB size limit enforced
- ✅ AI extracts 10-50+ skills typically
- ✅ GPA extracted if clearly listed
- ✅ Experience entries parsed (up to 5 shown)
- ✅ Skills merged with existing (no duplicates)
- ✅ Resume path stored in database
- ✅ Download works correctly
- ✅ Delete removes file and DB reference
- ✅ Upload progress shown during processing

---

### 5. Testing Advanced Analytics Dashboard 📊

**Test Case 5.1: View KPI Cards**
1. Login as admin (`admin@gmail.com`)
2. Navigate to "Mission Dashboard"
3. Verify 4 KPI cards display:
   - Total Students (count)
   - Total Internships (count)
   - Successful Allocations (count)
   - Unallocated Students (count)
4. Check numbers match actual data

**Test Case 5.2: View Charts**
1. On analytics page, scroll to charts section
2. Verify two charts render:
   - **Bar Chart:** Top Internships by Applications
   - **Pie Chart:** Student Allocation Status
3. Check bar chart shows internship titles
4. Verify pie chart shows percentages
5. Hover over chart elements for tooltips

**Test Case 5.3: Allocation Metrics**
1. View "Allocation Metrics" section
2. Check 4 metrics displayed:
   - Proposed (count)
   - Accepted (count)
   - Rejected (count)
   - Success Rate (percentage)
3. Verify success rate calculated correctly

**Test Case 5.4: System Status**
1. View "System Status" section
2. Check indicators show:
   - Open Internships (count)
   - Closed Internships (count)
   - Total Dropouts (count)
3. Verify color-coded dots (red, gray, beige)

**Test Case 5.5: Trigger Allocation Round**
1. Click "Trigger Allocation Round" button
2. Wait for processing
3. Check success notification appears
4. Verify analytics automatically refresh
5. Check KPI cards update with new data
6. Verify charts reflect new allocations

**Expected Results:**
- ✅ All numbers accurate and real-time
- ✅ Charts render smoothly (Recharts library)
- ✅ Tooltips show on hover
- ✅ Colors match brand palette
- ✅ Allocation trigger works instantly
- ✅ Auto-refresh after trigger (2s delay)
- ✅ No loading flickering
- ✅ Mobile responsive layout

---

## 🧪 Integration Testing

### End-to-End Flow 1: Complete Student Journey
1. Admin triggers allocation → Student gets notification
2. Student views allocation → Match details shown
3. Student accepts → Organization notified
4. Student completes internship → Rating request notification
5. Student rates internship → Rating stored
6. Organization rates student → Both ratings complete
7. Analytics dashboard updates → Success metrics increase

### End-to-End Flow 2: Organization Workflow
1. Organization creates internship posting
2. Admin triggers allocation
3. Organization receives notification about allocation
4. Student accepts → Organization notified
5. Organization views allocated candidates
6. After internship, rates student performance
7. Dashboard shows updated stats

### End-to-End Flow 3: Admin Oversight
1. View all students and organizations
2. Trigger allocation round
3. Monitor logs for allocations/dropouts
4. View analytics dashboard for success metrics
5. Check notifications sent to all parties
6. Review ratings submitted by both sides

---

## 🐛 Edge Cases to Test

### Notification Edge Cases:
- [ ] User with 0 notifications (empty state)
- [ ] User with 50+ notifications (scrolling)
- [ ] Deleted notification still in dropdown until refresh
- [ ] Notification click with broken link
- [ ] Multiple users reading same notification

### Rating Edge Cases:
- [ ] Rating with all 0 scores (should block)
- [ ] Rating with only overall score (should allow)
- [ ] Rating same allocation twice (should prevent)
- [ ] Rating before internship completed (shouldn't show)
- [ ] Very long feedback text (should truncate)

### Allocation Edge Cases:
- [ ] Reject allocation with no alternatives (graceful message)
- [ ] Multiple students rejecting same internship
- [ ] Organization capacity full
- [ ] Student already allocated elsewhere
- [ ] Zero match score (shouldn't allocate)

### Resume Edge Cases:
- [ ] Encrypted/password-protected PDF
- [ ] Resume with no clear skills section
- [ ] Non-English resume (might not parse)
- [ ] Corrupted PDF file
- [ ] Resume with only images (no text)

### Analytics Edge Cases:
- [ ] Zero students in system
- [ ] Zero internships posted
- [ ] All allocations rejected (0% success)
- [ ] Charts with no data (empty state)
- [ ] Very large numbers (>1000)

---

## 🔍 Visual Inspection Checklist

### Notification Bell:
- [ ] Bell icon visible in header
- [ ] Badge shows correct unread count
- [ ] Badge animates on new notification
- [ ] Dropdown aligned correctly
- [ ] Scrollbar appears if needed
- [ ] Close button works
- [ ] Click outside closes dropdown

### Rating Pages:
- [ ] Star icons render correctly
- [ ] Hover effect on stars
- [ ] Selected stars filled with yellow
- [ ] Unselected stars gray
- [ ] Form layout clean and aligned
- [ ] Submit button disabled when invalid
- [ ] Success message green themed

### Analytics Dashboard:
- [ ] KPI cards evenly spaced
- [ ] Charts render without distortion
- [ ] Colors match theme (red, beige, gray)
- [ ] Hover tooltips appear
- [ ] Responsive on mobile
- [ ] Trigger button prominent

### Resume Upload:
- [ ] Drag-drop area clearly marked
- [ ] File name displays after selection
- [ ] Upload progress indicator
- [ ] Extracted skills shown as chips
- [ ] Success checkmark green
- [ ] Error messages red

---

## 📊 Performance Testing

### Load Testing:
1. Create 50+ notifications → Check dropdown performance
2. Upload 5MB PDF → Verify parsing time < 10s
3. Trigger allocation with 100+ students → Check completion time
4. View analytics with 1000+ data points → Charts should load smoothly

### Browser Testing:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Network Testing:
- [ ] Test on slow 3G connection
- [ ] Test file upload on slow network
- [ ] Verify loading states appear
- [ ] Check timeout handling

---

## ✅ Verification Checklist

Before marking feature complete, verify:

### Notifications:
- [ ] Bell icon present in all dashboards
- [ ] Unread count accurate
- [ ] Notifications fetched from API
- [ ] Mark as read works
- [ ] Delete works
- [ ] Mark all as read works
- [ ] Dropdown closes on outside click

### Ratings:
- [ ] Student can rate accepted internships
- [ ] Organization can rate allocated students
- [ ] All 5 star ratings work
- [ ] Feedback text optional
- [ ] Checkboxes work
- [ ] Submit validation works
- [ ] Success message appears
- [ ] Data saved to database

### Multi-round:
- [ ] Accept updates status
- [ ] Reject triggers reallocation
- [ ] Notifications sent
- [ ] Logs updated
- [ ] Next best match found

### Resume:
- [ ] Upload accepts PDF only
- [ ] 5MB limit enforced
- [ ] AI parsing works
- [ ] Skills extracted
- [ ] Profile updated
- [ ] Download works
- [ ] Delete works

### Analytics:
- [ ] KPIs show correct numbers
- [ ] Charts render properly
- [ ] Trigger allocation works
- [ ] Auto-refresh after trigger
- [ ] All metrics accurate

---

## 🎯 Quick Smoke Test (5 minutes)

Run this to verify everything works:

1. **Login** as admin → Trigger allocation
2. **Login** as student → View allocation, click notification bell
3. **Accept allocation** → Check notification sent
4. **Upload resume** → Verify skills extracted
5. **Rate internship** → Submit feedback
6. **Login** as org → Rate student
7. **Back to admin** → Check analytics updated

If all 7 steps work, features are operational! ✅

---

## 🚨 Known Issues / Limitations

1. **Notifications:** Refresh every 30s, not true WebSocket real-time
2. **Resume parsing:** Works best with well-formatted PDFs
3. **Reallocation:** Only searches once, doesn't keep trying
4. **Analytics:** Trend chart limited to last 7 days
5. **Ratings:** Can't edit once submitted

---

## 📞 Support & Troubleshooting

### If notifications don't show:
1. Check JWT token in localStorage
2. Verify API endpoint responding: `/api/v1/notifications`
3. Check browser console for errors
4. Try logging out and back in

### If resume upload fails:
1. Confirm file is PDF format
2. Check file size < 5MB
3. Verify uploads/resumes/ folder exists
4. Check multer and pdf-parse installed

### If ratings don't submit:
1. Ensure allocation status is ACCEPTED
2. Check all required fields filled
3. Verify API routes registered in server.js
4. Check MongoDB connection

### If allocation fails:
1. Confirm students have PENDING status
2. Verify internships have capacity
3. Check MongoDB connection
4. Review admin logs for errors

---

## 🎉 Success Criteria

All features working if:
- ✅ Notifications bell shows and updates
- ✅ Star ratings submit successfully
- ✅ Rejection triggers reallocation
- ✅ Resume extracts skills correctly
- ✅ Analytics charts display data

---

**Happy Testing! 🧪**
