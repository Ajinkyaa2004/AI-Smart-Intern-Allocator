'use client';

import { useEffect, useState, useRef } from 'react';
import { User, GraduationCap, Code2, MapPin, Briefcase, Lock, Plus, X, Save, Upload, FileText, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
    name: string;
    level: number;
}

interface ProfileData {
    personal: { name: string; gender: string; category: string };
    contacts: { phone: string; city: string; state: string };
    academic: { degree: string; institution: string; gpa: number; passingYear: number };
    skills: Skill[];
    preferences: { locations: string[]; domains: string[]; minStipend: number };
    resumePath?: string;
    resumeUploadedAt?: string;
}

export default function StudentProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profileExists, setProfileExists] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<ProfileData>({
        personal: { name: '', gender: 'Male', category: 'General' },
        contacts: { phone: '', city: '', state: '' },
        academic: { degree: '', institution: '', gpa: 0, passingYear: new Date().getFullYear() },
        skills: [],
        preferences: { locations: [], domains: [], minStipend: 0 }
    });

    const [blindId, setBlindId] = useState('');
    const [newSkill, setNewSkill] = useState({ name: '', level: 3 });
    const [newLocation, setNewLocation] = useState('');
    const [newDomain, setNewDomain] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/student/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok && data.exists !== false) {
                setProfile(data);
                setBlindId(data.blindId);
                setProfileExists(true);
            } else {
                setEditing(true); // Auto-enable editing for new profiles
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!profile.personal.name) {
            toast.error('Name is required');
            return;
        }
        if (!profile.academic.degree || !profile.academic.institution || !profile.academic.gpa) {
            toast.error('Academic details are required');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/student/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                setProfile(data.student);
                setBlindId(data.student.blindId);
                setProfileExists(true);
                setEditing(false);
            } else {
                toast.error(data.message || 'Failed to save profile');
            }
        } catch (error) {
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.name) {
            setProfile({
                ...profile,
                skills: [...profile.skills, { ...newSkill }]
            });
            setNewSkill({ name: '', level: 3 });
        }
    };

    const removeSkill = (index: number) => {
        setProfile({
            ...profile,
            skills: profile.skills.filter((_, i) => i !== index)
        });
    };

    const addLocation = () => {
        if (newLocation && !profile.preferences.locations.includes(newLocation)) {
            setProfile({
                ...profile,
                preferences: {
                    ...profile.preferences,
                    locations: [...profile.preferences.locations, newLocation]
                }
            });
            setNewLocation('');
        }
    };

    const removeLocation = (loc: string) => {
        setProfile({
            ...profile,
            preferences: {
                ...profile.preferences,
                locations: profile.preferences.locations.filter(l => l !== loc)
            }
        });
    };

    const addDomain = () => {
        if (newDomain && !profile.preferences.domains.includes(newDomain)) {
            setProfile({
                ...profile,
                preferences: {
                    ...profile.preferences,
                    domains: [...profile.preferences.domains, newDomain]
                }
            });
            setNewDomain('');
        }
    };

    const removeDomain = (domain: string) => {
        setProfile({
            ...profile,
            preferences: {
                ...profile.preferences,
                domains: profile.preferences.domains.filter(d => d !== domain)
            }
        });
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/resume/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Resume Uploaded!', {
                    description: `Extracted ${data.extractedData.totalSkillsExtracted} skills automatically`
                });

                // Refresh profile to show new skills
                fetchProfile();
            } else {
                toast.error(data.message || 'Failed to upload resume');
            }
        } catch (error) {
            toast.error('Failed to upload resume');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleResumeDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/resume/download', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Resume downloaded');
            } else {
                toast.error('Failed to download resume');
            }
        } catch (error) {
            toast.error('Failed to download resume');
        }
    };

    const handleResumeDelete = async () => {
        if (!confirm('Are you sure you want to delete your resume?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/resume/delete', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success('Resume deleted');
                fetchProfile();
            } else {
                toast.error('Failed to delete resume');
            }
        } catch (error) {
            toast.error('Failed to delete resume');
        }
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                {profileExists && !editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md"
                    >
                        Edit Profile
                    </button>
                )}
                {editing && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                        {profileExists && (
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    fetchProfile();
                                }}
                                className="px-6 py-2 bg-white border border-gray-200 text-foreground rounded-xl font-medium hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {/* Header */}
                <div className="p-8 flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-secondary text-primary flex items-center justify-center">
                        <User className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                        {editing ? (
                            <input
                                type="text"
                                value={profile.personal.name}
                                onChange={e => setProfile({ ...profile, personal: { ...profile.personal, name: e.target.value } })}
                                placeholder="Enter your full name"
                                className="text-2xl font-bold text-foreground border-b-2 border-primary/30 focus:border-primary outline-none w-full"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-foreground">{profile.personal.name || 'No Name Set'}</h2>
                        )}
                        <p className="text-muted mt-1">{JSON.parse(localStorage.getItem('userInfo') || '{}').email}</p>
                        {blindId && (
                            <div className="flex gap-2 mt-3">
                                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-mono font-medium border border-primary/20 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Blind ID: {blindId}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resume Upload Section */}
                <div className="p-8 border-t border-gray-50 bg-secondary/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                        <FileText className="h-5 w-5 text-primary" /> Resume
                    </h3>

                    {profile.resumePath ? (
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Resume Uploaded</p>
                                    <p className="text-sm text-muted">
                                        {profile.resumeUploadedAt && new Date(profile.resumeUploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleResumeDownload}
                                    className="px-4 py-2 bg-white border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                                <button
                                    onClick={handleResumeDelete}
                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-white hover:border-primary/50 transition-all">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                className="hidden"
                            />
                            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h4 className="font-bold text-foreground mb-2">Upload Your Resume</h4>
                            <p className="text-sm text-muted mb-4">
                                PDF only, max 5MB. We'll automatically extract your skills!
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Choose File'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Academic */}
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <GraduationCap className="h-5 w-5 text-primary" /> Academic Background
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-muted block text-sm mb-2">Institution</span>
                            {editing ? (
                                <input
                                    type="text"
                                    value={profile.academic.institution}
                                    onChange={e => setProfile({ ...profile, academic: { ...profile.academic, institution: e.target.value } })}
                                    placeholder="e.g., IIT Delhi"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg">{profile.academic.institution || 'Not set'}</span>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block text-sm mb-2">Degree</span>
                            {editing ? (
                                <input
                                    type="text"
                                    value={profile.academic.degree}
                                    onChange={e => setProfile({ ...profile, academic: { ...profile.academic, degree: e.target.value } })}
                                    placeholder="e.g., B.Tech Computer Science"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg">{profile.academic.degree || 'Not set'}</span>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block text-sm mb-2">GPA / CGPA</span>
                            {editing ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    value={profile.academic.gpa}
                                    onChange={e => setProfile({ ...profile, academic: { ...profile.academic, gpa: parseFloat(e.target.value) } })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg">{profile.academic.gpa || 'Not set'}</span>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block text-sm mb-2">Passing Year</span>
                            {editing ? (
                                <input
                                    type="number"
                                    value={profile.academic.passingYear}
                                    onChange={e => setProfile({ ...profile, academic: { ...profile.academic, passingYear: parseInt(e.target.value) } })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg">{profile.academic.passingYear || 'Not set'}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Code2 className="h-5 w-5 text-primary" /> Skills & Verification
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {profile.skills.map((skill, index) => (
                            <div key={index} className="px-4 py-2 bg-secondary/30 rounded-xl text-sm flex items-center gap-3 border border-gray-100">
                                <span className="font-medium text-foreground">{skill.name}</span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < skill.level ? 'bg-primary' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                                {editing && (
                                    <button onClick={() => removeSkill(index)} className="text-muted hover:text-foreground">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {editing && (
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={newSkill.name}
                                    onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                                    placeholder="Skill name (e.g., Python, React)"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <select
                                    value={newSkill.level}
                                    onChange={e => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                                    className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="1">Beginner</option>
                                    <option value="2">Basic</option>
                                    <option value="3">Intermediate</option>
                                    <option value="4">Advanced</option>
                                    <option value="5">Expert</option>
                                </select>
                            </div>
                            <button
                                onClick={addSkill}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Preferences */}
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Briefcase className="h-5 w-5 text-primary" /> Allocation Preferences
                    </h3>
                    <div className="grid grid-cols-2 gap-10 text-sm">
                        <div>
                            <span className="text-muted block mb-3 font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Preferred Locations
                            </span>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profile.preferences.locations.map(l => (
                                    <span key={l} className="px-3 py-1.5 border border-gray-200 rounded-lg text-foreground bg-white flex items-center gap-2">
                                        {l}
                                        {editing && (
                                            <button onClick={() => removeLocation(l)} className="text-muted hover:text-foreground">
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {editing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newLocation}
                                        onChange={e => setNewLocation(e.target.value)}
                                        placeholder="Add location"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                                    />
                                    <button
                                        onClick={addLocation}
                                        className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block mb-3 font-medium flex items-center gap-2">
                                <Briefcase className="h-4 w-4" /> Interest Domains
                            </span>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profile.preferences.domains.map(d => (
                                    <span key={d} className="px-3 py-1.5 border border-gray-200 rounded-lg text-foreground bg-white flex items-center gap-2">
                                        {d}
                                        {editing && (
                                            <button onClick={() => removeDomain(d)} className="text-muted hover:text-foreground">
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {editing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newDomain}
                                        onChange={e => setNewDomain(e.target.value)}
                                        placeholder="Add domain"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                                    />
                                    <button
                                        onClick={addDomain}
                                        className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
