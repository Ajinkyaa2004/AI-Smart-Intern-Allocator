'use client';

import { useEffect, useState } from 'react';
import { Hourglass, Sparkles, MapPin, Calculator, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentMatches() {
    const [allocation, setAllocation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch from /api/student/allocation
        setTimeout(() => {
            setLoading(false);
            // Mock data for visualization - uncomment to test
            /*
            setAllocation({
                internship: { title: 'Product Manager Intern', org: { name: 'Ministry of Electronics' }, location: 'New Delhi', stipend: 25000 },
                score: 0.92,
                breakdown: { skillMatch: 0.9, locationMatch: 1.0, gpaMatch: 0.8 },
                status: 'PROPOSED'
            });
            */
        }, 1000);
    }, []);

    const handleAccept = () => {
        toast.success("Offer Accepted! Congratulations.");
    };

    const handleReject = () => {
        toast.error("Offer Rejected.");
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading allocation status...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Internship Allocation Status</h1>

            {!allocation ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white/50">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center">
                            <Hourglass className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Allocation Pending</h3>
                    <p className="text-muted max-w-md mx-auto mt-2">
                        Your profile is being processed by our AI Allocation Engine.
                        You will be notified once a match is found based on your skills and preferences.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Match Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 border-b border-gray-100 bg-secondary/30">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3 border border-primary/30">
                                {allocation.status} MATCH
                            </span>
                            <h2 className="text-2xl font-bold text-foreground">{allocation.internship.title}</h2>
                            <p className="text-lg text-muted font-medium">{allocation.internship.org.name}</p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <span className="text-muted flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</span>
                                <span className="font-semibold text-foreground">{allocation.internship.location}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <span className="text-muted flex items-center gap-2"><Calculator className="h-4 w-4" /> Stipend</span>
                                <span className="font-semibold text-foreground">₹{allocation.internship.stipend}/mo</span>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button onClick={handleAccept} className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                    Accept Offer
                                </button>
                                <button onClick={handleReject} className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-xl transition-colors">
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Explainability Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                            <Sparkles className="h-5 w-5 text-primary" /> Why this match?
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-muted">Overall Match Score</span>
                                    <span className="font-bold text-primary">{(allocation.score * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary/60 to-primary" style={{ width: `${allocation.score * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 rounded-xl bg-secondary/20 border border-secondary/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BrainCircuit className="h-4 w-4 text-primary" />
                                        <div className="text-xs text-muted uppercase font-bold tracking-wider">Skill Alignment</div>
                                    </div>
                                    <div className="font-bold text-lg text-foreground">{(allocation.breakdown.skillMatch * 100).toFixed(0)}% Match</div>
                                    <p className="text-xs text-muted mt-1">Based on Python, AI/ML, and Project Management skills.</p>
                                </div>

                                <div className="p-4 rounded-xl bg-secondary/20 border border-secondary/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <div className="text-xs text-muted uppercase font-bold tracking-wider">Preference</div>
                                    </div>
                                    <div className="font-bold text-lg text-foreground">{(allocation.breakdown.locationMatch * 100).toFixed(0)}% Match</div>
                                    <p className="text-xs text-muted mt-1">Matches your preferred location: {allocation.internship.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
