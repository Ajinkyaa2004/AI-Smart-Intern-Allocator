import { NextRequest } from 'next/server';
import {
  acceptAllocation,
  chatbotReply,
  deleteNotification,
  getAllocationExportCsv,
  getAnalytics,
  getLogs,
  getMockState,
  getNotificationsForUser,
  getOrgAllocations,
  getOrgByUserId,
  getPendingOrgRatings,
  getPendingStudentRatings,
  getStudentAllocations,
  getStudentByUserId,
  getTokenFromRequest,
  getUserFromToken,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  makeAuthToken,
  publicUser,
  rejectAllocation,
  register,
  setOrgProfile,
  setStudentProfile,
  submitRating,
  triggerAllocation,
  ensureOrgProfile,
  ensureStudentProfile,
} from '../../../lib/mock-db';

export const dynamic = 'force-dynamic';

const json = (data: unknown, init?: ResponseInit) => Response.json(data, init);

const notFound = (message = 'Not found') => json({ message }, { status: 404 });
const unauthorized = (message = 'Unauthorized') => json({ message }, { status: 401 });
const forbidden = (message = 'Forbidden') => json({ message }, { status: 403 });

const getSegments = async (params: Promise<{ path: string[] }>) => {
  const resolved = await params;
  return resolved.path || [];
};

const getAuthenticatedUser = (request: Request) => {
  const token = getTokenFromRequest(request);
  const user = getUserFromToken(token);
  return { token, user };
};

const getJsonBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const resolveStudentProfile = (userId: string, email: string) => {
  const profile = getStudentByUserId(userId) || ensureStudentProfile(userId, email);
  return profile;
};

const resolveOrgProfile = (userId: string, email: string) => {
  const profile = getOrgByUserId(userId) || ensureOrgProfile(userId, email);
  return profile;
};

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const segments = await getSegments(context.params);
  const [section, item, action, subaction] = segments;
  const { user } = getAuthenticatedUser(request);
  const url = new URL(request.url);

  if (segments.length === 0) {
    return notFound();
  }

  if (section === 'auth') {
    return notFound();
  }

  if (section === 'student' && item === 'profile') {
    if (!user) return unauthorized();
    if (user.role !== 'STUDENT') return forbidden();
    const profile = resolveStudentProfile(user._id, user.email);
    return json(profile);
  }

  if (section === 'org' && item === 'profile') {
    if (!user) return unauthorized();
    if (user.role !== 'ORG') return forbidden();
    const profile = resolveOrgProfile(user._id, user.email);
    return json(profile);
  }

  if (section === 'admin' && item === 'analytics') {
    if (!user) return unauthorized();
    if (user.role !== 'ADMIN') return forbidden();
    return json(getAnalytics());
  }

  if (section === 'admin' && item === 'logs') {
    if (!user) return unauthorized();
    if (user.role !== 'ADMIN') return forbidden();
    return json(getLogs());
  }

  if (section === 'allocation' && item === 'student' && action) {
    if (!user) return unauthorized();
    const allocations = getStudentAllocations(action);
    return json(allocations);
  }

  if (section === 'allocation' && item === 'export') {
    if (!user) return unauthorized();
    if (user.role !== 'ADMIN') return forbidden();
    const csv = getAllocationExportCsv();
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="allocation-report.csv"',
      },
    });
  }

  if (section === 'org' && item === 'candidates') {
    if (!user) return unauthorized();
    if (user.role !== 'ORG') return forbidden();
    const allocations = getOrgAllocations(user._id).filter(allocation => allocation.status !== 'REJECTED');
    return json(allocations);
  }

  if (section === 'notifications') {
    if (!user) return unauthorized();

    if (item && action === 'read') {
      markNotificationAsRead(item);
      return json({ message: 'Notification marked as read' });
    }

    if (item) {
      deleteNotification(item);
      return json({ message: 'Notification deleted' });
    }

    const data = getNotificationsForUser(user._id);
    return json(data);
  }

  if (section === 'resume' && item === 'download') {
    const tokenFromQuery = url.searchParams.get('token');
    const tokenUser = getUserFromToken(tokenFromQuery);
    const activeUser = user || tokenUser;
    if (!activeUser) return unauthorized();

    const pdf = `%PDF-1.4\n%Mock resume for ${activeUser.email}\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  }

  if (section === 'ratings' && item === 'pending' && action === 'student') {
    if (!user) return unauthorized();
    if (user.role !== 'STUDENT') return forbidden();
    return json(getPendingStudentRatings(user._id));
  }

  if (section === 'ratings' && item === 'pending' && action === 'org') {
    if (!user) return unauthorized();
    if (user.role !== 'ORG') return forbidden();
    return json(getPendingOrgRatings(user._id));
  }

  if (section === 'chatbot' && item === 'ask') {
    return notFound('Use POST for chatbot queries');
  }

  if (section === 'ml' || section === 'resume' || section === 'ratings' || section === 'org' || section === 'student' || section === 'allocation' || section === 'admin') {
    return notFound();
  }

  return notFound();
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const segments = await getSegments(context.params);
  const [section, item, action] = segments;
  const { user } = getAuthenticatedUser(request);

  if (segments.length === 0) {
    return notFound();
  }

  if (section === 'auth' && item === 'login') {
    const body = await getJsonBody(request);
    const tokenUser = getMockState().users.find(current => current.email === String(body.email || '').trim().toLowerCase() && current.password === String(body.password || ''));

    if (!tokenUser) {
      return json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return json(publicUser(tokenUser));
  }

  if (section === 'auth' && item === 'register') {
    const body = await getJsonBody(request);
    const result = register(String(body.email || ''), String(body.password || ''), String(body.role || 'STUDENT') as 'ADMIN' | 'STUDENT' | 'ORG');
    if ('error' in result) {
      return json({ message: result.error }, { status: 400 });
    }
    return json(result.user, { status: 201 });
  }

  if (section === 'student' && item === 'profile') {
    if (!user) return unauthorized();
    if (user.role !== 'STUDENT') return forbidden();
    const body = await getJsonBody(request);
    const profile = setStudentProfile(user._id, body);
    return json({ message: 'Student profile saved successfully', student: profile });
  }

  if (section === 'org' && item === 'profile') {
    if (!user) return unauthorized();
    if (user.role !== 'ORG') return forbidden();
    const body = await getJsonBody(request);
    const profile = setOrgProfile(user._id, body);
    return json({ message: 'Organization profile saved successfully', org: profile });
  }

  if (section === 'admin' && item === 'trigger-allocation') {
    if (!user) return unauthorized();
    if (user.role !== 'ADMIN') return forbidden();
    const result = triggerAllocation();
    return json(result);
  }

  if (section === 'org' && item === 'postings') {
    if (!user) return unauthorized();
    if (user.role !== 'ORG') return forbidden();
    const body = await getJsonBody(request);
    const state = getMockState();
    const orgProfile = resolveOrgProfile(user._id, user.email);
    const internship = {
      _id: `intern-custom-${state.internships.length + 1}`,
      orgId: user._id,
      orgName: orgProfile.name,
      title: String(body.title || 'Untitled Internship'),
      location: String(body.location || orgProfile.locations[0] || 'Remote'),
      stipend: Number(body.stipend || 0),
      vacancies: Number(body.vacancies || 1),
      minGpa: Number(body.minGpa || 0),
      requiredSkills: Array.isArray(body.requiredSkills) ? body.requiredSkills : [],
      sector: orgProfile.sector,
    };
    state.internships.unshift(internship);
    return json({ message: 'Internship posting saved successfully', posting: internship }, { status: 201 });
  }

  if (section === 'org' && item === 'dropout') {
    if (!user) return unauthorized();
    if (user.role !== 'ORG') return forbidden();
    const body = await getJsonBody(request);
    const state = getMockState();
    state.allocations = state.allocations.filter(allocation => allocation._id !== String(body.allocationId));
    return json({ message: 'Dropout reported and candidate removed from active list.' });
  }

  if (section === 'resume' && item === 'upload') {
    if (!user) return unauthorized();
    const formData = await request.formData();
    const file = formData.get('resume');
    if (!file) {
      return json({ message: 'Resume file is required' }, { status: 400 });
    }

    if (user.role !== 'STUDENT') return forbidden();
    const profile = resolveStudentProfile(user._id, user.email);
    const resumePath = `/mock-resumes/${profile.blindId}.pdf`;
    profile.resumePath = resumePath;
    profile.resumeUploadedAt = new Date().toISOString();

    const extractedData = {
      skills: profile.skills.map(skill => ({ name: skill.name, level: String(skill.level) })),
      education: profile.academic,
      experience: [],
      totalSkillsExtracted: profile.skills.length,
    };

    return json({
      message: 'Resume uploaded successfully',
      extractedData,
      resumeUrl: `/api/v1/resume/download?token=${makeAuthToken(user)}`,
    });
  }

  if (section === 'ratings' && item === 'internship' && action) {
    if (!user) return unauthorized();
    const body = await getJsonBody(request);
    submitRating(action, 'student', body);
    return json({ message: 'Rating submitted successfully' });
  }

  if (section === 'ratings' && item === 'student' && action) {
    if (!user) return unauthorized();
    const body = await getJsonBody(request);
    submitRating(action, 'org', body);
    return json({ message: 'Rating submitted successfully' });
  }

  if (section === 'chatbot' && item === 'ask') {
    const body = await getJsonBody(request);
    const reply = chatbotReply(String(body.message || ''));
    return json({ success: true, ...reply });
  }

  return notFound();
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const segments = await getSegments(context.params);
  const [section, item, action] = segments;
  const { user } = getAuthenticatedUser(request);

  if (section === 'allocation' && item && action === 'accept') {
    if (!user) return unauthorized();
    const allocation = acceptAllocation(item);
    if (!allocation) return notFound('Allocation not found');
    return json({ message: 'Offer accepted successfully', allocation });
  }

  if (section === 'allocation' && item && action === 'reject') {
    if (!user) return unauthorized();
    const allocation = rejectAllocation(item);
    if (!allocation) return notFound('Allocation not found');
    return json({ message: 'Offer rejected successfully' });
  }

  if (section === 'notifications' && item === 'read-all') {
    if (!user) return unauthorized();
    markAllNotificationsAsRead(user._id);
    return json({ message: 'All notifications marked as read' });
  }

  if (section === 'notifications' && item && action === 'read') {
    if (!user) return unauthorized();
    markNotificationAsRead(item);
    return json({ message: 'Notification marked as read' });
  }

  return notFound();
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const segments = await getSegments(context.params);
  const [section, item] = segments;
  const { user } = getAuthenticatedUser(request);

  if (section === 'resume' && item === 'delete') {
    if (!user) return unauthorized();
    if (user.role !== 'STUDENT') return forbidden();
    const profile = resolveStudentProfile(user._id, user.email);
    delete profile.resumePath;
    delete profile.resumeUploadedAt;
    return json({ message: 'Resume deleted successfully' });
  }

  if (section === 'notifications' && item) {
    if (!user) return unauthorized();
    deleteNotification(item);
    return json({ message: 'Notification deleted' });
  }

  return notFound();
}
