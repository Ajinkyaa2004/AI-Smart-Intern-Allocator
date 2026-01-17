'use client';

import { useEffect, useState } from 'react';
import { Plus, MapPin, Users, X, Save, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
    skill: string;
    weight: number;
}

interface Internship {
    _id: string;
    title: string;
    description: string;
    location: string;
    vacancies: number;
    filledCount: number;
    status: string;
    stipend: number;
    minGPA: number;
    requiredSkills: Skill[];
}

export default function OrgPostings() {
    const [postings, setPostings] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        vacancies: 1,
        stipend: 0,
        minGPA: 0,
        requiredSkills: [] as Skill[]
    });

    const [newSkill, setNewSkill] = useState({ skill: '', weight: 1 });

    useEffect(() => {
        fetchPostings();
    }, []);

    const fetchPostings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/org/postings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setPostings(data);
            } else {
                const error = await res.json();
                if (error.message.includes('profile not found')) {
                    toast.info('Please create your organization profile first');
                }
            }
        } catch (error) {
            toast.error('Failed to load postings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.location || !formData.description) {
            toast.error('Please fill all required fields');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/org/postings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Internship posted successfully!');
                setShowForm(false);
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    vacancies: 1,
                    stipend: 0,
                    minGPA: 0,
                    requiredSkills: []
                });
                fetchPostings();
            } else {
                toast.error(data.message || 'Failed to create posting');
            }
        } catch (error) {
            toast.error('Failed to create posting');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.skill) {
            setFormData({
                ...formData,
                requiredSkills: [...formData.requiredSkills, { ...newSkill }]
            });
            setNewSkill({ skill: '', weight: 1 });
        }
    };

    const removeSkill = (index: number) => {
        setFormData({
            ...formData,
            requiredSkills: formData.requiredSkills.filter((_, i) => i !== index)
        });
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading postings...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-foreground">Internship Postings</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                    {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showForm ? 'Cancel' : 'Create New'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" /> New Internship Posting
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-2">Job Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Product Management Intern"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., New Delhi"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Vacancies *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.vacancies}
                                    onChange={e => setFormData({ ...formData, vacancies: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Stipend (₹/month)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.stipend}
                                    onChange={e => setFormData({ ...formData, stipend: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Minimum GPA</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={formData.minGPA}
                                    onChange={e => setFormData({ ...formData, minGPA: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-2">Required Skills</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.requiredSkills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1.5 bg-secondary/30 rounded-lg text-sm flex items-center gap-2 border border-gray-100">
                                            {skill.skill} (Weight: {skill.weight})
                                            <button type="button" onClick={() => removeSkill(index)} className="text-muted hover:text-foreground">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newSkill.skill}
                                        onChange={e => setNewSkill({ ...newSkill, skill: e.target.value })}
                                        placeholder="Skill name (e.g., Python)"
                                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={newSkill.weight}
                                        onChange={e => setNewSkill({ ...newSkill, weight: parseInt(e.target.value) })}
                                        placeholder="Weight"
                                        className="w-24 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Creating...' : 'Create Posting'}
                        </button>
                    </form>
                </div>
            )}

            {/* Postings List */}
            {postings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No Postings Yet</h3>
                    <p className="text-muted mb-6">Create your first internship posting to get started</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Create First Posting
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/30 border-b border-gray-100 text-muted text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-medium">Job Title</th>
                                <th className="p-5 font-medium">Location</th>
                                <th className="p-5 font-medium">Capacity</th>
                                <th className="p-5 font-medium">Status</th>
                                <th className="p-5 font-medium">Stipend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {postings.map((job) => (
                                <tr key={job._id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="p-5 font-medium text-foreground">{job.title}</td>
                                    <td className="p-5 text-muted flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-4 h-4 text-muted" />
                                            <span className="font-medium">{job.filledCount}</span> <span className="text-muted">/ {job.vacancies}</span>
                                        </div>
                                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(job.filledCount / job.vacancies) * 100}%` }} />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'OPEN' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-secondary text-muted border border-border'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-5 font-medium text-foreground">₹{job.stipend.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
