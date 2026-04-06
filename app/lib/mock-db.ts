type Role = 'ADMIN' | 'STUDENT' | 'ORG';

type MockUser = {
  _id: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
};

type StudentProfile = {
  _id: string;
  userId: string;
  blindId: string;
  personal: {
    name: string;
    gender: string;
    category: string;
  };
  contacts: {
    phone: string;
    address?: string;
    city: string;
    state: string;
  };
  academic: {
    degree: string;
    institution: string;
    gpa: number;
    passingYear: number;
  };
  skills: Array<{ name: string; level: number; isVerified?: boolean }>;
  preferences: {
    locations: string[];
    domains: string[];
    minStipend: number;
  };
  resumePath?: string;
  resumeUploadedAt?: string;
};

type OrgProfile = {
  _id: string;
  userId: string;
  name: string;
  type: string;
  sector: string;
  locations: string[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
};

type Internship = {
  _id: string;
  orgId: string;
  orgName: string;
  title: string;
  location: string;
  stipend: number;
  vacancies: number;
  minGpa: number;
  requiredSkills: string[];
  sector: string;
};

type Allocation = {
  _id: string;
  studentId: string;
  orgId: string;
  internshipId: string;
  student: {
    _id: string;
    blindId: string;
    personal: { name: string; email: string };
  };
  internship: {
    _id: string;
    title: string;
    location: string;
    stipend: number;
    org: { name: string };
    organization?: { name: string };
  };
  score: number;
  matchScore: number;
  breakdown: {
    skillMatch: number;
    locationMatch: number;
    domainMatch: number;
    gpaMatch: number;
  };
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED';
  studentRated?: boolean;
  orgRated?: boolean;
  createdAt: string;
};

type Notification = {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
};

type LogEntry = {
  id: string;
  type: string;
  details: string;
  status: 'SUCCESS' | 'WARN' | 'INFO';
  time: string;
};

type RatingEntry = {
  _id: string;
  allocationId: string;
  allocationType: 'student' | 'org';
  overallScore: number;
  createdAt: string;
  payload: Record<string, unknown>;
};

type MockState = {
  users: MockUser[];
  students: Record<string, StudentProfile>;
  orgs: Record<string, OrgProfile>;
  internships: Internship[];
  allocations: Allocation[];
  notifications: Notification[];
  logs: LogEntry[];
  ratings: RatingEntry[];
  counters: {
    allocation: number;
    notification: number;
    log: number;
    rating: number;
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __internmatchMockState: MockState | undefined;
}

const now = () => new Date().toISOString();
const nextId = (prefix: string, counter: number) => `${prefix}-${counter}`;

const seedState = (): MockState => {
  const users: MockUser[] = [
    { _id: 'user-admin', email: 'admin@gmail.com', password: '12341234', role: 'ADMIN', isVerified: true },
    { _id: 'user-ajinkya', email: 'ajinkya@gmail.com', password: '12341234', role: 'STUDENT', isVerified: true },
    { _id: 'user-priya', email: 'priya@gmail.com', password: '12341234', role: 'STUDENT', isVerified: true },
    { _id: 'user-rahul', email: 'rahul@gmail.com', password: '12341234', role: 'STUDENT', isVerified: true },
    { _id: 'user-ananya', email: 'ananya@gmail.com', password: '12341234', role: 'STUDENT', isVerified: true },
    { _id: 'user-vikram', email: 'vikram@gmail.com', password: '12341234', role: 'STUDENT', isVerified: true },
    { _id: 'user-techcorp', email: 'techcorp@gmail.com', password: '12341234', role: 'ORG', isVerified: true },
    { _id: 'user-national', email: 'national@gmail.com', password: '12341234', role: 'ORG', isVerified: true },
    { _id: 'user-mobilefirst', email: 'mobilefirst@gmail.com', password: '12341234', role: 'ORG', isVerified: true },
    { _id: 'user-bhel', email: 'bel@gmail.com', password: '12341234', role: 'ORG', isVerified: true },
    { _id: 'user-cloudnine', email: 'cloudnine@gmail.com', password: '12341234', role: 'ORG', isVerified: true },
  ];

  const students: Record<string, StudentProfile> = {
    'user-ajinkya': {
      _id: 'student-ajinkya',
      userId: 'user-ajinkya',
      blindId: 'BLD-2026-001',
      personal: { name: 'Ajinkya Dhumal', gender: 'Male', category: 'General' },
      contacts: { phone: '+91-9876543210', address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra' },
      academic: { degree: 'B.Tech Computer Science', institution: 'Mumbai University', gpa: 8.7, passingYear: 2026 },
      skills: [
        { name: 'Python', level: 4, isVerified: true },
        { name: 'React', level: 5, isVerified: true },
        { name: 'Node.js', level: 4, isVerified: true },
        { name: 'MongoDB', level: 3, isVerified: true },
        { name: 'Machine Learning', level: 3, isVerified: true },
      ],
      preferences: { locations: ['Mumbai', 'Pune', 'Bangalore'], domains: ['Technology', 'AI/ML', 'Web Development'], minStipend: 15000 },
    },
    'user-priya': {
      _id: 'student-priya',
      userId: 'user-priya',
      blindId: 'BLD-2026-002',
      personal: { name: 'Priya Sharma', gender: 'Female', category: 'General' },
      contacts: { phone: '+91-9876543211', address: '456 Park Street', city: 'Delhi', state: 'Delhi' },
      academic: { degree: 'B.Tech Information Technology', institution: 'Delhi Technological University', gpa: 9.2, passingYear: 2026 },
      skills: [
        { name: 'Java', level: 5, isVerified: true },
        { name: 'Spring Boot', level: 4, isVerified: true },
        { name: 'MySQL', level: 4, isVerified: true },
        { name: 'AWS', level: 3, isVerified: true },
        { name: 'Docker', level: 3, isVerified: true },
      ],
      preferences: { locations: ['Delhi', 'Noida', 'Gurgaon', 'Bangalore'], domains: ['Technology', 'Cloud Computing', 'Backend Development'], minStipend: 20000 },
    },
    'user-rahul': {
      _id: 'student-rahul',
      userId: 'user-rahul',
      blindId: 'BLD-2026-003',
      personal: { name: 'Rahul Verma', gender: 'Male', category: 'General' },
      contacts: { phone: '+91-9876543212', address: '789 Residency Road', city: 'Bangalore', state: 'Karnataka' },
      academic: { degree: 'B.Sc Data Science', institution: 'Christ University', gpa: 8.9, passingYear: 2026 },
      skills: [
        { name: 'Python', level: 4, isVerified: true },
        { name: 'Data Science', level: 5, isVerified: true },
        { name: 'TensorFlow', level: 4, isVerified: true },
        { name: 'SQL', level: 4, isVerified: true },
        { name: 'Power BI', level: 3, isVerified: true },
      ],
      preferences: { locations: ['Bangalore', 'Hyderabad', 'Pune'], domains: ['AI/ML', 'Data Science', 'Analytics'], minStipend: 18000 },
    },
    'user-ananya': {
      _id: 'student-ananya',
      userId: 'user-ananya',
      blindId: 'BLD-2026-004',
      personal: { name: 'Ananya Patel', gender: 'Female', category: 'General' },
      contacts: { phone: '+91-9876543213', address: '12 FC Road', city: 'Pune', state: 'Maharashtra' },
      academic: { degree: 'B.Tech Information Technology', institution: 'Pune University', gpa: 8.5, passingYear: 2026 },
      skills: [
        { name: 'Flutter', level: 5, isVerified: true },
        { name: 'Dart', level: 4, isVerified: true },
        { name: 'Firebase', level: 4, isVerified: true },
        { name: 'React Native', level: 3, isVerified: true },
        { name: 'UI/UX Design', level: 4, isVerified: true },
      ],
      preferences: { locations: ['Pune', 'Mumbai', 'Bangalore'], domains: ['Mobile Development', 'Technology', 'UI/UX'], minStipend: 12000 },
    },
    'user-vikram': {
      _id: 'student-vikram',
      userId: 'user-vikram',
      blindId: 'BLD-2026-005',
      personal: { name: 'Vikram Singh', gender: 'Male', category: 'General' },
      contacts: { phone: '+91-9876543214', address: '44 Salt Lake', city: 'Kolkata', state: 'West Bengal' },
      academic: { degree: 'B.Tech Mechanical Engineering', institution: 'IIT Kharagpur', gpa: 7.8, passingYear: 2026 },
      skills: [
        { name: 'AutoCAD', level: 4, isVerified: true },
        { name: 'SolidWorks', level: 4, isVerified: true },
        { name: 'MATLAB', level: 3, isVerified: true },
        { name: 'Python', level: 2, isVerified: true },
        { name: 'Project Management', level: 3, isVerified: true },
      ],
      preferences: { locations: ['Kolkata', 'Mumbai', 'Delhi', 'Chennai'], domains: ['Manufacturing', 'Automotive', 'Core Engineering'], minStipend: 10000 },
    },
  };

  const orgs: Record<string, OrgProfile> = {
    'user-techcorp': {
      _id: 'org-techcorp',
      userId: 'user-techcorp',
      name: 'TechCorp India Pvt Ltd',
      type: 'PRIVATE',
      sector: 'Technology',
      locations: ['Mumbai', 'Bangalore', 'Pune'],
      contactPerson: { name: 'Riya Mehta', email: 'techcorp@gmail.com', phone: '+91-9000000001' },
    },
    'user-national': {
      _id: 'org-national',
      userId: 'user-national',
      name: 'National AI Research Lab',
      type: 'MINISTRY',
      sector: 'AI/ML',
      locations: ['Delhi', 'Bangalore'],
      contactPerson: { name: 'Arjun Verma', email: 'national@gmail.com', phone: '+91-9000000002' },
    },
    'user-mobilefirst': {
      _id: 'org-mobilefirst',
      userId: 'user-mobilefirst',
      name: 'MobileFirst Solutions',
      type: 'PRIVATE',
      sector: 'Mobile Development',
      locations: ['Pune', 'Mumbai'],
      contactPerson: { name: 'Nisha Rao', email: 'mobilefirst@gmail.com', phone: '+91-9000000003' },
    },
    'user-bhel': {
      _id: 'org-bhel',
      userId: 'user-bhel',
      name: 'Bharat Heavy Electricals Limited',
      type: 'PSU',
      sector: 'Manufacturing',
      locations: ['Delhi', 'Mumbai', 'Kolkata'],
      contactPerson: { name: 'K. Srinivasan', email: 'bel@gmail.com', phone: '+91-9000000004' },
    },
    'user-cloudnine': {
      _id: 'org-cloudnine',
      userId: 'user-cloudnine',
      name: 'CloudNine Technologies',
      type: 'PRIVATE',
      sector: 'Cloud Computing',
      locations: ['Bangalore', 'Hyderabad', 'Pune'],
      contactPerson: { name: 'Aditi Shah', email: 'cloudnine@gmail.com', phone: '+91-9000000005' },
    },
  };

  const internships: Internship[] = [
    { _id: 'intern-1', orgId: 'user-techcorp', orgName: 'TechCorp India Pvt Ltd', title: 'Full Stack Developer Intern', location: 'Mumbai', stipend: 15000, vacancies: 3, minGpa: 7.5, requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'], sector: 'Technology' },
    { _id: 'intern-2', orgId: 'user-techcorp', orgName: 'TechCorp India Pvt Ltd', title: 'Backend Developer Intern', location: 'Bangalore', stipend: 18000, vacancies: 2, minGpa: 8.0, requiredSkills: ['Java', 'Spring Boot', 'MySQL'], sector: 'Technology' },
    { _id: 'intern-3', orgId: 'user-national', orgName: 'National AI Research Lab', title: 'Machine Learning Research Intern', location: 'Delhi', stipend: 25000, vacancies: 2, minGpa: 8.5, requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'], sector: 'AI/ML' },
    { _id: 'intern-4', orgId: 'user-national', orgName: 'National AI Research Lab', title: 'Data Science Intern', location: 'Bangalore', stipend: 20000, vacancies: 3, minGpa: 8.0, requiredSkills: ['Python', 'Data Science', 'SQL', 'Power BI'], sector: 'AI/ML' },
    { _id: 'intern-5', orgId: 'user-mobilefirst', orgName: 'MobileFirst Solutions', title: 'Flutter Developer Intern', location: 'Pune', stipend: 12000, vacancies: 2, minGpa: 7.0, requiredSkills: ['Flutter', 'Dart', 'Firebase'], sector: 'Mobile Development' },
    { _id: 'intern-6', orgId: 'user-mobilefirst', orgName: 'MobileFirst Solutions', title: 'Mobile UI/UX Designer Intern', location: 'Mumbai', stipend: 14000, vacancies: 2, minGpa: 7.5, requiredSkills: ['UI/UX Design', 'Flutter', 'React Native'], sector: 'Mobile Development' },
    { _id: 'intern-7', orgId: 'user-bhel', orgName: 'Bharat Heavy Electricals Limited', title: 'Mechanical Engineering Intern', location: 'Kolkata', stipend: 12000, vacancies: 3, minGpa: 7.0, requiredSkills: ['AutoCAD', 'SolidWorks', 'MATLAB'], sector: 'Manufacturing' },
    { _id: 'intern-8', orgId: 'user-bhel', orgName: 'Bharat Heavy Electricals Limited', title: 'Project Management Intern', location: 'Mumbai', stipend: 15000, vacancies: 2, minGpa: 7.5, requiredSkills: ['Project Management', 'AutoCAD', 'Python'], sector: 'Manufacturing' },
    { _id: 'intern-9', orgId: 'user-cloudnine', orgName: 'CloudNine Technologies', title: 'Cloud Infrastructure Intern', location: 'Bangalore', stipend: 22000, vacancies: 2, minGpa: 8.0, requiredSkills: ['AWS', 'Docker', 'Python'], sector: 'Cloud Computing' },
    { _id: 'intern-10', orgId: 'user-cloudnine', orgName: 'CloudNine Technologies', title: 'DevOps Intern', location: 'Pune', stipend: 18000, vacancies: 2, minGpa: 7.5, requiredSkills: ['Docker', 'AWS', 'Java'], sector: 'Cloud Computing' },
  ];

  const notifications: Notification[] = [
    {
      _id: 'notif-1',
      userId: 'user-admin',
      type: 'SYSTEM',
      title: 'Demo Environment Ready',
      message: 'Static mock backend is active for deployment testing.',
      link: '/admin/analytics',
      read: false,
      priority: 'HIGH',
      createdAt: now(),
    },
  ];

  return {
    users,
    students,
    orgs,
    internships,
    allocations: [],
    notifications,
    logs: [
      { id: 'log-1', type: 'SYSTEM', details: 'Mock backend initialized', status: 'INFO', time: now() },
    ],
    ratings: [],
    counters: {
      allocation: 1,
      notification: 2,
      log: 2,
      rating: 1,
    },
  };
};

export const getMockState = (): MockState => {
  if (!globalThis.__internmatchMockState) {
    globalThis.__internmatchMockState = seedState();
  }

  return globalThis.__internmatchMockState;
};

export const resetMockState = () => {
  globalThis.__internmatchMockState = seedState();
  return globalThis.__internmatchMockState;
};

export const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader) return null;
  return authHeader.replace(/^Bearer\s+/i, '').trim();
};

export const getUserFromToken = (token: string | null | undefined) => {
  if (!token) return null;
  const state = getMockState();
  const normalizedToken = token.startsWith('mock:') ? token.slice(5) : token;
  return state.users.find(user => user._id === normalizedToken || user.email === normalizedToken) || null;
};

export const makeAuthToken = (user: MockUser) => `mock:${user._id}`;

export const publicUser = (user: MockUser) => ({
  _id: user._id,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  token: makeAuthToken(user),
});

export const getStudentByUserId = (userId: string) => getMockState().students[userId] || null;
export const getOrgByUserId = (userId: string) => getMockState().orgs[userId] || null;

export const ensureStudentProfile = (userId: string, email: string, nameFallback?: string) => {
  const state = getMockState();
  if (!state.students[userId]) {
    state.students[userId] = {
      _id: `student-${userId}`,
      userId,
      blindId: `BLD-${state.counters.allocation + 100}`,
      personal: { name: nameFallback || email.split('@')[0], gender: 'Other', category: 'General' },
      contacts: { phone: '', city: '', state: '' },
      academic: { degree: '', institution: '', gpa: 0, passingYear: new Date().getFullYear() },
      skills: [],
      preferences: { locations: [], domains: [], minStipend: 0 },
    };
  }

  return state.students[userId];
};

export const ensureOrgProfile = (userId: string, email: string, nameFallback?: string) => {
  const state = getMockState();
  if (!state.orgs[userId]) {
    state.orgs[userId] = {
      _id: `org-${userId}`,
      userId,
      name: nameFallback || email.split('@')[0],
      type: 'PRIVATE',
      sector: '',
      locations: [],
      contactPerson: { name: '', email, phone: '' },
    };
  }

  return state.orgs[userId];
};

const normalizeText = (value: string) => value.toLowerCase().trim();

const getSkillScore = (student: StudentProfile, internship: Internship) => {
  const studentSkills = student.skills.map(skill => normalizeText(skill.name));
  const requiredSkills = internship.requiredSkills.map(normalizeText);
  const matches = requiredSkills.filter(skill => studentSkills.includes(skill)).length;
  return requiredSkills.length === 0 ? 0 : matches / requiredSkills.length;
};

const getLocationScore = (student: StudentProfile, internship: Internship) =>
  student.preferences.locations.some(location => normalizeText(location) === normalizeText(internship.location)) ? 1 : 0;

const getDomainScore = (student: StudentProfile, internship: Internship) =>
  student.preferences.domains.some(domain => normalizeText(domain).includes(normalizeText(internship.sector)) || normalizeText(internship.sector).includes(normalizeText(domain))) ? 1 : 0;

const getGpaScore = (student: StudentProfile, internship: Internship) => {
  const normalized = Math.min(student.academic.gpa / 10, 1);
  return student.academic.gpa >= internship.minGpa ? normalized : normalized * 0.5;
};

const scoreInternship = (student: StudentProfile, internship: Internship) => {
  const skillMatch = getSkillScore(student, internship);
  const locationMatch = getLocationScore(student, internship);
  const domainMatch = getDomainScore(student, internship);
  const gpaMatch = getGpaScore(student, internship);

  const score = (skillMatch * 0.45) + (domainMatch * 0.2) + (locationMatch * 0.2) + (gpaMatch * 0.15);

  return {
    score,
    breakdown: {
      skillMatch,
      locationMatch,
      domainMatch,
      gpaMatch,
    },
  };
};

const addLog = (type: string, details: string, status: 'SUCCESS' | 'WARN' | 'INFO' = 'INFO') => {
  const state = getMockState();
  state.logs.unshift({ id: nextId('log', state.counters.log++), type, details, status, time: now() });
};

const addNotification = (userId: string, title: string, message: string, link?: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM') => {
  const state = getMockState();
  state.notifications.unshift({
    _id: nextId('notif', state.counters.notification++),
    userId,
    type: 'SYSTEM',
    title,
    message,
    link,
    read: false,
    priority,
    createdAt: now(),
  });
};

export const triggerAllocation = () => {
  const state = getMockState();
  const existingAccepted = state.allocations.filter(allocation => allocation.status === 'ACCEPTED');
  const acceptedStudentIds = new Set(existingAccepted.map(allocation => allocation.studentId));

  state.allocations = existingAccepted.slice();
  state.internships = seedState().internships.map(internship => ({ ...internship }));

  const activeInternships = state.internships.map(internship => ({ ...internship }));

  const allStudents = Object.values(state.students);
  const proposals: Allocation[] = [];

  allStudents.forEach((student) => {
    if (acceptedStudentIds.has(student.userId)) return;

    const ranked = activeInternships
      .filter(internship => internship.vacancies > 0)
      .map(internship => ({ internship, ...scoreInternship(student, internship) }))
      .sort((left, right) => right.score - left.score);

    const best = ranked[0];
    if (!best || best.score < 0.3) return;

    best.internship.vacancies -= 1;

    const allocation: Allocation = {
      _id: nextId('alloc', state.counters.allocation++),
      studentId: student.userId,
      orgId: best.internship.orgId,
      internshipId: best.internship._id,
      student: {
        _id: student._id,
        blindId: student.blindId,
        personal: { name: student.personal.name, email: state.users.find(user => user._id === student.userId)?.email || '' },
      },
      internship: {
        _id: best.internship._id,
        title: best.internship.title,
        location: best.internship.location,
        stipend: best.internship.stipend,
        org: { name: best.internship.orgName },
        organization: { name: best.internship.orgName },
      },
      score: best.score,
      matchScore: best.score,
      breakdown: best.breakdown,
      status: 'PROPOSED',
      createdAt: now(),
    };

    proposals.push(allocation);
    addNotification(student.userId, 'New Internship Match', `${best.internship.title} at ${best.internship.orgName} has been proposed for you.`, '/student/matches', 'HIGH');
    addNotification(best.internship.orgId, 'Candidate Proposed', `${student.personal.name} has been matched with ${best.internship.title}.`, '/org/candidates', 'HIGH');
  });

  state.allocations = [...state.allocations, ...proposals];
  addLog('ALLOCATION', `Generated ${proposals.length} internship proposals`, 'SUCCESS');

  return {
    message: `Allocation round completed with ${proposals.length} proposals.`,
    proposals: proposals.length,
  };
};

export const getAnalytics = () => {
  const state = getMockState();
  const totalStudents = Object.values(state.students).length;
  const totalInternships = state.internships.length;
  const proposed = state.allocations.filter(allocation => allocation.status === 'PROPOSED').length;
  const accepted = state.allocations.filter(allocation => allocation.status === 'ACCEPTED').length;
  const rejected = state.allocations.filter(allocation => allocation.status === 'REJECTED').length;
  const matched = proposed + accepted;
  const unallocatedStudents = Math.max(totalStudents - matched, 0);

  const internshipStatus = {
    open: state.internships.filter(internship => internship.vacancies > 0).length,
    closed: state.internships.filter(internship => internship.vacancies <= 0).length,
  };

  const topInternships = state.internships
    .map(internship => ({
      title: internship.title,
      applications: state.allocations.filter(allocation => allocation.internshipId === internship._id).length,
    }))
    .sort((left, right) => right.applications - left.applications)
    .slice(0, 5);

  return {
    kpis: {
      totalStudents,
      totalInternships,
      totalAllocations: matched,
      unallocatedStudents,
    },
    studentStatus: {
      pending: unallocatedStudents,
      matched,
      accepted,
    },
    internshipStatus,
    allocationMetrics: {
      proposed,
      accepted,
      rejected,
      successRate: matched === 0 ? '0.0' : ((accepted / matched) * 100).toFixed(1),
    },
    topInternships,
    allocationTrend: [
      { date: 'Day 1', allocations: Math.max(matched - 3, 0) },
      { date: 'Day 2', allocations: Math.max(matched - 1, 0) },
      { date: 'Today', allocations: matched },
    ],
    dropouts: 0,
  };
};

export const getLogs = () => getMockState().logs;

export const getNotificationsForUser = (userId: string) => {
  const state = getMockState();
  const notifications = state.notifications.filter(notification => notification.userId === userId || notification.userId === 'user-admin');
  return {
    notifications,
    unreadCount: notifications.filter(notification => !notification.read).length,
  };
};

export const markNotificationAsRead = (notificationId: string) => {
  const state = getMockState();
  const notification = state.notifications.find(item => item._id === notificationId);
  if (notification) notification.read = true;
};

export const markAllNotificationsAsRead = (userId: string) => {
  const state = getMockState();
  state.notifications.forEach(notification => {
    if (notification.userId === userId || notification.userId === 'user-admin') {
      notification.read = true;
    }
  });
};

export const deleteNotification = (notificationId: string) => {
  const state = getMockState();
  state.notifications = state.notifications.filter(notification => notification._id !== notificationId);
};

export const getStudentAllocations = (studentId: string) => getMockState().allocations.filter(allocation => allocation.studentId === studentId);
export const getOrgAllocations = (orgId: string) => getMockState().allocations.filter(allocation => allocation.orgId === orgId);

export const acceptAllocation = (allocationId: string) => {
  const state = getMockState();
  const allocation = state.allocations.find(item => item._id === allocationId);
  if (!allocation) return null;
  allocation.status = 'ACCEPTED';
  addLog('ALLOCATION', `Student accepted allocation for ${allocation.internship.title}`, 'SUCCESS');
  addNotification(allocation.orgId, 'Allocation Accepted', `${allocation.student.personal.name} accepted ${allocation.internship.title}.`, '/org/candidates', 'HIGH');
  return allocation;
};

export const rejectAllocation = (allocationId: string) => {
  const state = getMockState();
  const allocation = state.allocations.find(item => item._id === allocationId);
  if (!allocation) return null;
  const { studentId, orgId, internship } = allocation;
  state.allocations = state.allocations.filter(item => item._id !== allocationId);
  addLog('ALLOCATION', `Student rejected allocation for ${internship.title}`, 'WARN');
  addNotification(studentId, 'Allocation Rejected', `You rejected the offer for ${internship.title}.`, '/student/matches', 'MEDIUM');
  addNotification(orgId, 'Offer Rejected', `${internship.title} was rejected by the student.`, '/org/candidates', 'MEDIUM');
  return allocation;
};

export const setStudentProfile = (userId: string, profile: Partial<StudentProfile>) => {
  const state = getMockState();
  const existing = ensureStudentProfile(userId, state.users.find(user => user._id === userId)?.email || '', profile.personal?.name);
  const updated: StudentProfile = {
    ...existing,
    ...profile,
    personal: { ...existing.personal, ...(profile.personal || {}) },
    contacts: { ...existing.contacts, ...(profile.contacts || {}) },
    academic: { ...existing.academic, ...(profile.academic || {}) },
    skills: profile.skills ? [...profile.skills] : existing.skills,
    preferences: { ...existing.preferences, ...(profile.preferences || {}) },
  };
  state.students[userId] = updated;
  addLog('PROFILE', `Updated student profile for ${updated.personal.name}`, 'SUCCESS');
  return updated;
};

export const setOrgProfile = (userId: string, profile: Partial<OrgProfile>) => {
  const state = getMockState();
  const existing = ensureOrgProfile(userId, state.users.find(user => user._id === userId)?.email || '', profile.name);
  const updated: OrgProfile = {
    ...existing,
    ...profile,
    contactPerson: { ...existing.contactPerson, ...(profile.contactPerson || {}) },
    locations: profile.locations ? [...profile.locations] : existing.locations,
  };
  state.orgs[userId] = updated;
  addLog('PROFILE', `Updated organization profile for ${updated.name}`, 'SUCCESS');
  return updated;
};

export const login = (email: string, password: string) => {
  const state = getMockState();
  const user = state.users.find(item => item.email === email.trim().toLowerCase() && item.password === password);
  return user ? publicUser(user) : null;
};

export const register = (email: string, password: string, role: Role) => {
  const state = getMockState();
  const normalizedEmail = email.trim().toLowerCase();
  if (state.users.some(user => user.email === normalizedEmail)) {
    return { error: 'User already exists' };
  }

  const userId = `user-${normalizedEmail.split('@')[0].replace(/[^a-z0-9]+/g, '-')}`;
  const user: MockUser = {
    _id: userId,
    email: normalizedEmail,
    password,
    role,
    isVerified: true,
  };

  state.users.push(user);

  if (role === 'STUDENT') {
    ensureStudentProfile(userId, normalizedEmail);
  } else if (role === 'ORG') {
    ensureOrgProfile(userId, normalizedEmail);
  }

  addLog('AUTH', `Registered new ${role.toLowerCase()} account: ${normalizedEmail}`, 'SUCCESS');
  return { user: publicUser(user) };
};

export const getAllocationExportCsv = () => {
  const rows = [
    ['Student', 'Internship', 'Organization', 'Status', 'Score'],
    ...getMockState().allocations.map(allocation => [
      allocation.student.personal.name,
      allocation.internship.title,
      allocation.internship.org.name,
      allocation.status,
      allocation.score.toFixed(2),
    ]),
  ];

  return rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
};

export const submitRating = (allocationId: string, allocationType: 'student' | 'org', payload: Record<string, unknown>) => {
  const state = getMockState();
  const allocation = state.allocations.find(item => item._id === allocationId);
  if (!allocation) return null;

  const rating: RatingEntry = {
    _id: nextId('rating', state.counters.rating++),
    allocationId,
    allocationType,
    overallScore: Number(payload.overallScore || 0),
    createdAt: now(),
    payload,
  };

  state.ratings.push(rating);

  if (allocationType === 'student') {
    allocation.studentRated = true;
  } else {
    allocation.orgRated = true;
  }

  addLog('RATING', `Recorded ${allocationType} rating for ${allocation.internship.title}`, 'SUCCESS');
  return rating;
};

export const getPendingStudentRatings = (userId: string) => {
  const allocations = getMockState().allocations.filter(allocation => allocation.studentId === userId && allocation.status === 'ACCEPTED' && !allocation.studentRated);
  return { allocations };
};

export const getPendingOrgRatings = (orgId: string) => {
  const allocations = getMockState().allocations.filter(allocation => allocation.orgId === orgId && allocation.status === 'ACCEPTED' && !allocation.orgRated);
  return { allocations };
};

export const chatbotReply = (message: string) => {
  const normalized = normalizeText(message);
  if (normalized.includes('matching') || normalized.includes('how does matching work')) {
    return {
      response: 'InternMatch scores profiles using skills, location, domain preferences, and GPA. In this static demo, the same scoring rules still drive the allocation results.',
      suggestions: ['Why was I matched?', 'How can I improve my profile?', 'What skills should I learn?'],
    };
  }
  if (normalized.includes('not matched') || normalized.includes('why wasn')) {
    return {
      response: 'If you are not matched yet, trigger the allocation round from Admin Analytics. The demo will generate proposals based on the current profiles.',
      suggestions: ['Trigger allocation round', 'View my profile', 'Explain scoring weights'],
    };
  }
  if (normalized.includes('skills') || normalized.includes('learn')) {
    return {
      response: 'For this dataset, React, Node.js, Java, Spring Boot, Python, Data Science, Flutter, AWS, Docker, AutoCAD, and SolidWorks are the most useful skills.',
      suggestions: ['Show student credentials', 'Open my profile', 'How to upload a resume'],
    };
  }
  if (normalized.includes('profile')) {
    return {
      response: 'Open your dashboard profile page to update skills, education, and resume. The mock API will save the data in the current server instance.',
      suggestions: ['Open student profile', 'Open organization profile', 'How do I upload a resume?'],
    };
  }

  return {
    response: 'I can help with login, matching, profiles, allocation rounds, resumes, notifications, and ratings in this static demo.',
    suggestions: ['How does matching work?', 'Why was I matched?', 'How to improve my profile?'],
  };
};
