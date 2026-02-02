require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const Student = require('./server/models/Student');
const Organization = require('./server/models/Organization');
const Internship = require('./server/models/Internship');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data except admin users
        console.log('🗑️  Clearing existing test data...');
        const adminUsers = await User.find({ role: 'ADMIN' });
        const adminUserIds = adminUsers.map(u => u._id);
        
        await Internship.deleteMany({});
        await Organization.deleteMany({});
        await Student.deleteMany({});
        await User.deleteMany({ role: { $in: ['STUDENT', 'ORG'] } });

        // ========================
        // CREATE ADMIN ACCOUNT
        // ========================
        console.log('👨‍💼 Creating admin account...');
        
        const existingAdmin = await User.findOne({ role: 'ADMIN' });
        if (!existingAdmin) {
            await User.create({
                email: 'admin@gmail.com',
                password: '12341234',
                role: 'ADMIN',
                isVerified: true
            });
            console.log('   ✓ Created admin: admin@gmail.com');
        } else {
            console.log('   ✓ Admin already exists: ' + existingAdmin.email);
        }

        // ========================
        // CREATE STUDENT ACCOUNTS
        // ========================
        console.log('👨‍🎓 Creating student accounts...');

        const studentData = [
            {
                email: 'ajinkya@gmail.com',
                password: '12341234',
                personal: {
                    name: 'Ajinkya Dhumal',
                    gender: 'Male',
                    dob: new Date('2004-05-15'),
                    category: 'General'
                },
                contacts: {
                    phone: '+91-9876543210',
                    address: '123 MG Road',
                    city: 'Mumbai',
                    state: 'Maharashtra'
                },
                academic: {
                    degree: 'B.Tech Computer Science',
                    institution: 'Mumbai University',
                    gpa: 8.7,
                    passingYear: 2026
                },
                skills: [
                    { name: 'Python', level: 4, isVerified: true },
                    { name: 'React', level: 5, isVerified: true },
                    { name: 'Node.js', level: 4, isVerified: false },
                    { name: 'MongoDB', level: 3, isVerified: false },
                    { name: 'Machine Learning', level: 3, isVerified: true }
                ],
                preferences: {
                    locations: ['Mumbai', 'Pune', 'Bangalore'],
                    domains: ['Technology', 'AI/ML', 'Web Development'],
                    minStipend: 15000
                }
            },
            {
                email: 'priya@gmail.com',
                password: '12341234',
                personal: {
                    name: 'Priya Sharma',
                    gender: 'Female',
                    dob: new Date('2003-08-22'),
                    category: 'General'
                },
                contacts: {
                    phone: '+91-9876543211',
                    address: '456 Park Street',
                    city: 'Delhi',
                    state: 'Delhi'
                },
                academic: {
                    degree: 'B.Tech Information Technology',
                    institution: 'Delhi Technological University',
                    gpa: 9.2,
                    passingYear: 2026
                },
                skills: [
                    { name: 'Java', level: 5, isVerified: true },
                    { name: 'Spring Boot', level: 4, isVerified: true },
                    { name: 'MySQL', level: 4, isVerified: false },
                    { name: 'AWS', level: 3, isVerified: true },
                    { name: 'Docker', level: 3, isVerified: false }
                ],
                preferences: {
                    locations: ['Delhi', 'Noida', 'Gurgaon', 'Bangalore'],
                    domains: ['Technology', 'Cloud Computing', 'Backend Development'],
                    minStipend: 20000
                }
            },
            {
                email: 'rahul@gmail.com',
                password: '12341234',
                personal: {
                    name: 'Rahul Verma',
                    gender: 'Male',
                    dob: new Date('2004-11-10'),
                    category: 'OBC'
                },
                contacts: {
                    phone: '+91-9876543212',
                    address: '789 Brigade Road',
                    city: 'Bangalore',
                    state: 'Karnataka'
                },
                academic: {
                    degree: 'B.Tech Electronics',
                    institution: 'IIT Bangalore',
                    gpa: 8.9,
                    passingYear: 2026
                },
                skills: [
                    { name: 'Python', level: 4, isVerified: true },
                    { name: 'Data Science', level: 5, isVerified: true },
                    { name: 'TensorFlow', level: 4, isVerified: true },
                    { name: 'SQL', level: 4, isVerified: false },
                    { name: 'Power BI', level: 3, isVerified: false }
                ],
                preferences: {
                    locations: ['Bangalore', 'Hyderabad', 'Pune'],
                    domains: ['AI/ML', 'Data Science', 'Analytics'],
                    minStipend: 18000
                }
            },
            {
                email: 'ananya@gmail.com',
                password: '12341234',
                personal: {
                    name: 'Ananya Patel',
                    gender: 'Female',
                    dob: new Date('2003-03-18'),
                    category: 'General'
                },
                contacts: {
                    phone: '+91-9876543213',
                    address: '321 FC Road',
                    city: 'Pune',
                    state: 'Maharashtra'
                },
                academic: {
                    degree: 'B.Tech Computer Science',
                    institution: 'College of Engineering Pune',
                    gpa: 8.5,
                    passingYear: 2026
                },
                skills: [
                    { name: 'Flutter', level: 5, isVerified: true },
                    { name: 'Dart', level: 4, isVerified: true },
                    { name: 'Firebase', level: 4, isVerified: false },
                    { name: 'React Native', level: 3, isVerified: false },
                    { name: 'UI/UX Design', level: 4, isVerified: true }
                ],
                preferences: {
                    locations: ['Pune', 'Mumbai', 'Bangalore'],
                    domains: ['Mobile Development', 'Technology', 'UI/UX'],
                    minStipend: 12000
                }
            },
            {
                email: 'vikram@gmail.com',
                password: '12341234',
                personal: {
                    name: 'Vikram Singh',
                    gender: 'Male',
                    dob: new Date('2004-07-25'),
                    category: 'SC'
                },
                contacts: {
                    phone: '+91-9876543214',
                    address: '555 Salt Lake',
                    city: 'Kolkata',
                    state: 'West Bengal'
                },
                academic: {
                    degree: 'B.Tech Mechanical Engineering',
                    institution: 'Jadavpur University',
                    gpa: 7.8,
                    passingYear: 2026
                },
                skills: [
                    { name: 'AutoCAD', level: 4, isVerified: true },
                    { name: 'SolidWorks', level: 4, isVerified: true },
                    { name: 'MATLAB', level: 3, isVerified: false },
                    { name: 'Python', level: 2, isVerified: false },
                    { name: 'Project Management', level: 3, isVerified: true }
                ],
                preferences: {
                    locations: ['Kolkata', 'Mumbai', 'Delhi', 'Chennai'],
                    domains: ['Manufacturing', 'Automotive', 'Core Engineering'],
                    minStipend: 10000
                }
            }
        ];

        const createdStudents = [];

        for (const data of studentData) {
            // Create User
            const user = await User.create({
                email: data.email,
                password: data.password,
                role: 'STUDENT',
                isVerified: true
            });

            // Create Student Profile
            const student = await Student.create({
                user: user._id,
                blindId: `STU-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                personal: data.personal,
                contacts: data.contacts,
                academic: data.academic,
                skills: data.skills,
                preferences: data.preferences,
                availability: true,
                allocationStatus: 'PENDING'
            });

            createdStudents.push({ email: data.email, blindId: student.blindId });
            console.log(`   ✓ Created student: ${data.personal.name} (${data.email})`);
        }

        // ========================
        // CREATE ORGANIZATIONS
        // ========================
        console.log('\n🏢 Creating organizations...');

        const orgData = [
            {
                email: 'techcorp@gmail.com',
                password: '12341234',
                name: 'TechCorp India Pvt Ltd',
                type: 'PRIVATE',
                sector: 'Technology',
                locations: ['Mumbai', 'Bangalore', 'Pune'],
                contactPerson: {
                    name: 'Rajesh Kumar',
                    email: 'rajesh@techcorp.in',
                    phone: '+91-9988776655'
                },
                internships: [
                    {
                        title: 'Full Stack Developer Intern',
                        description: 'Work on MERN stack projects, develop web applications, and collaborate with senior developers.',
                        requiredSkills: [
                            { skill: 'React', weight: 2 },
                            { skill: 'Node.js', weight: 2 },
                            { skill: 'MongoDB', weight: 1 },
                            { skill: 'JavaScript', weight: 1 }
                        ],
                        minGPA: 7.5,
                        location: 'Mumbai',
                        stipend: 15000,
                        vacancies: 3
                    },
                    {
                        title: 'Backend Developer Intern',
                        description: 'Build RESTful APIs, work with databases, and optimize server-side logic.',
                        requiredSkills: [
                            { skill: 'Java', weight: 2 },
                            { skill: 'Spring Boot', weight: 2 },
                            { skill: 'MySQL', weight: 1 }
                        ],
                        minGPA: 8.0,
                        location: 'Bangalore',
                        stipend: 18000,
                        vacancies: 2
                    }
                ]
            },
            {
                email: 'national@gmail.com',
                password: '12341234',
                name: 'National AI Research Lab',
                type: 'MINISTRY',
                sector: 'AI/ML',
                locations: ['Delhi', 'Bangalore'],
                contactPerson: {
                    name: 'Dr. Sunita Reddy',
                    email: 'sunita@ailab.gov.in',
                    phone: '+91-9988776656'
                },
                internships: [
                    {
                        title: 'Machine Learning Research Intern',
                        description: 'Research on deep learning models, work on computer vision projects, and publish papers.',
                        requiredSkills: [
                            { skill: 'Python', weight: 2 },
                            { skill: 'Machine Learning', weight: 3 },
                            { skill: 'TensorFlow', weight: 2 },
                            { skill: 'Data Science', weight: 1 }
                        ],
                        minGPA: 8.5,
                        location: 'Delhi',
                        stipend: 25000,
                        vacancies: 2
                    },
                    {
                        title: 'Data Science Intern',
                        description: 'Analyze large datasets, build predictive models, and create data visualizations.',
                        requiredSkills: [
                            { skill: 'Python', weight: 2 },
                            { skill: 'Data Science', weight: 3 },
                            { skill: 'SQL', weight: 1 },
                            { skill: 'Power BI', weight: 1 }
                        ],
                        minGPA: 8.0,
                        location: 'Bangalore',
                        stipend: 20000,
                        vacancies: 3
                    }
                ]
            },
            {
                email: 'mobilefirst@gmail.com',
                password: '12341234',
                name: 'MobileFirst Solutions',
                type: 'PRIVATE',
                sector: 'Mobile Development',
                locations: ['Pune', 'Mumbai'],
                contactPerson: {
                    name: 'Amit Shah',
                    email: 'amit@mobilefirst.com',
                    phone: '+91-9988776657'
                },
                internships: [
                    {
                        title: 'Flutter Developer Intern',
                        description: 'Develop cross-platform mobile applications using Flutter and Dart.',
                        requiredSkills: [
                            { skill: 'Flutter', weight: 3 },
                            { skill: 'Dart', weight: 2 },
                            { skill: 'Firebase', weight: 1 }
                        ],
                        minGPA: 7.0,
                        location: 'Pune',
                        stipend: 12000,
                        vacancies: 2
                    },
                    {
                        title: 'Mobile UI/UX Designer Intern',
                        description: 'Design beautiful mobile interfaces and create engaging user experiences.',
                        requiredSkills: [
                            { skill: 'UI/UX Design', weight: 3 },
                            { skill: 'Flutter', weight: 1 },
                            { skill: 'React Native', weight: 1 }
                        ],
                        minGPA: 7.5,
                        location: 'Mumbai',
                        stipend: 14000,
                        vacancies: 2
                    }
                ]
            },
            {
                email: 'bel@gmail.com',
                password: '12341234',
                name: 'Bharat Heavy Electricals Limited',
                type: 'PSU',
                sector: 'Manufacturing',
                locations: ['Delhi', 'Mumbai', 'Kolkata'],
                contactPerson: {
                    name: 'S.K. Mishra',
                    email: 'skmishra@bhel.gov.in',
                    phone: '+91-9988776658'
                },
                internships: [
                    {
                        title: 'Mechanical Engineering Intern',
                        description: 'Work on manufacturing processes, quality control, and equipment design.',
                        requiredSkills: [
                            { skill: 'AutoCAD', weight: 2 },
                            { skill: 'SolidWorks', weight: 2 },
                            { skill: 'MATLAB', weight: 1 }
                        ],
                        minGPA: 7.0,
                        location: 'Kolkata',
                        stipend: 12000,
                        vacancies: 3
                    },
                    {
                        title: 'Project Management Intern',
                        description: 'Assist in project planning, execution monitoring, and documentation.',
                        requiredSkills: [
                            { skill: 'Project Management', weight: 2 },
                            { skill: 'AutoCAD', weight: 1 },
                            { skill: 'Python', weight: 1 }
                        ],
                        minGPA: 7.5,
                        location: 'Mumbai',
                        stipend: 15000,
                        vacancies: 2
                    }
                ]
            },
            {
                email: 'cloudnine@gmail.com',
                password: '12341234',
                name: 'CloudNine Technologies',
                type: 'PRIVATE',
                sector: 'Cloud Computing',
                locations: ['Bangalore', 'Hyderabad', 'Pune'],
                contactPerson: {
                    name: 'Neha Kapoor',
                    email: 'neha@cloudnine.tech',
                    phone: '+91-9988776659'
                },
                internships: [
                    {
                        title: 'Cloud Infrastructure Intern',
                        description: 'Work with AWS services, deploy applications, and manage cloud resources.',
                        requiredSkills: [
                            { skill: 'AWS', weight: 3 },
                            { skill: 'Docker', weight: 2 },
                            { skill: 'Python', weight: 1 }
                        ],
                        minGPA: 8.0,
                        location: 'Bangalore',
                        stipend: 22000,
                        vacancies: 2
                    },
                    {
                        title: 'DevOps Intern',
                        description: 'Set up CI/CD pipelines, automate deployments, and monitor systems.',
                        requiredSkills: [
                            { skill: 'Docker', weight: 2 },
                            { skill: 'AWS', weight: 2 },
                            { skill: 'Java', weight: 1 }
                        ],
                        minGPA: 7.5,
                        location: 'Pune',
                        stipend: 18000,
                        vacancies: 2
                    }
                ]
            }
        ];

        const createdOrgs = [];

        for (const data of orgData) {
            // Create User
            const user = await User.create({
                email: data.email,
                password: data.password,
                role: 'ORG',
                isVerified: true
            });

            // Create Organization
            const org = await Organization.create({
                user: user._id,
                name: data.name,
                type: data.type,
                sector: data.sector,
                locations: data.locations,
                contactPerson: data.contactPerson
            });

            // Create Internships
            const internshipIds = [];
            for (const internship of data.internships) {
                const createdInternship = await Internship.create({
                    org: org._id,
                    ...internship,
                    status: 'OPEN',
                    filledCount: 0
                });
                internshipIds.push(createdInternship._id);
                console.log(`   ✓ Created internship: ${internship.title}`);
            }

            createdOrgs.push({
                email: data.email,
                name: data.name,
                internships: internshipIds.length
            });
            console.log(`   ✓ Created organization: ${data.name} (${data.email})`);
        }

        console.log('\n' + '='.repeat(80));
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
        console.log('='.repeat(80));

        console.log('\n📊 SUMMARY:');
        console.log(`   • Students: ${createdStudents.length}`);
        console.log(`   • Organizations: ${createdOrgs.length}`);
        console.log(`   • Total Internships: ${createdOrgs.reduce((sum, org) => sum + org.internships, 0)}`);

        console.log('\n' + '='.repeat(80));
        console.log('🔐 LOGIN CREDENTIALS');
        console.log('='.repeat(80));

        console.log('\n👨‍🎓 STUDENTS:');
        console.log('─'.repeat(80));
        studentData.forEach((student, index) => {
            console.log(`\n${index + 1}. ${student.personal.name}`);
            console.log(`   Email    : ${student.email}`);
            console.log(`   Password : ${student.password}`);
            console.log(`   Skills   : ${student.skills.map(s => s.name).join(', ')}`);
            console.log(`   Preferred: ${student.preferences.domains.join(', ')}`);
        });

        console.log('\n\n🏢 ORGANIZATIONS:');
        console.log('─'.repeat(80));
        orgData.forEach((org, index) => {
            console.log(`\n${index + 1}. ${org.name}`);
            console.log(`   Email    : ${org.email}`);
            console.log(`   Password : ${org.password}`);
            console.log(`   Type     : ${org.type}`);
            console.log(`   Sector   : ${org.sector}`);
            console.log(`   Internships: ${org.internships.length}`);
            org.internships.forEach((internship, i) => {
                console.log(`      ${i + 1}. ${internship.title} (${internship.vacancies} positions)`);
            });
        });

        console.log('\n' + '='.repeat(80));
        console.log('✅ READY TO TEST TRIGGER ALLOCATION!');
        console.log('='.repeat(80));
        console.log('\n📝 Next Steps:');
        console.log('   1. Login as Admin at http://localhost:3000/login');
        console.log('   2. Go to Admin Dashboard → Analytics');
        console.log('   3. Click "Trigger Allocation Round"');
        console.log('   4. Check the results in Logs section');
        console.log('   5. Login as students/organizations to see their matches');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
