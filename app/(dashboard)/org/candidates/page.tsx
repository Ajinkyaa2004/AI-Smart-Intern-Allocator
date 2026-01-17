'use client';

import { useEffect, useState } from 'react';
import { UserCheck, AlertOctagon, UserX, Award, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface Allocation {
    _id: string;
    student: {
        blindId: string;
        personal: { name: string };
    };
    internship: {
        title: string;
    };
    matchScore: number;
    status: string;
}

export default function OrgCandidates() {
    const [candidates, setCandidates] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/org/candidates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
            } else {
                const error = await res.json();
                if (error.message.includes('profile not found')) {
                    toast.info('Please create your organization profile first');
                }
            }
        } catch (error) {
            toast.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleDropout = async (allocationId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/org/dropout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ allocationId, reason: 'No Show' })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Dropout Reported', {
                    description: data.message
                });
                // Remove from UI
                setCandidates(prev => prev.filter(c => c._id !== allocationId));
            } else {
                toast.error(data.message || 'Failed to report dropout');
            }
        } catch (error) {
            toast.error('Failed to report dropout');
        }
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading candidates...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-foreground">Allocated Candidates</h1>

            {candidates.length === 0 ? (
                <div className="p-16 text-center text-muted bg-white/50 rounded-3xl border border-dashed border-gray-200">
                    <AlertOctagon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No Candidates Allocated Yet</h3>
                    <p className="text-sm">Candidates will appear here after the admin triggers an allocation round.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {candidates.map((c) => (
                        <div key={c._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex gap-4 items-center">
                                <div className="h-14 w-14 rounded-full bg-secondary text-primary flex items-center justify-center">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-foreground">{c.student.personal.name}</h3>
                                        <span className="text-xs bg-secondary text-muted px-2 py-1 rounded-md font-mono border border-gray-200">
                                            ID: {c.student.blindId}
                                        </span>
                                    </div>
                                    <p className="text-muted text-sm mt-1 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Role: {c.internship.title}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                <div className="text-right">
                                    <div className="text-xs text-muted uppercase font-bold mb-1 flex items-center justify-end gap-1">
                                        <Award className="w-3 h-3" /> Match
                                    </div>
                                    <div className="font-bold text-primary text-xl">{(c.matchScore * 100).toFixed(0)}%</div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs text-muted uppercase font-bold mb-1">Status</div>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
                                        {c.status}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleDropout(c._id)}
                                    className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 text-sm font-medium px-4 py-2 rounded-xl border border-red-100 hover:border-red-200 transition-all shadow-sm flex items-center gap-2"
                                >
                                    <UserX className="w-4 h-4" /> Report Dropout
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
