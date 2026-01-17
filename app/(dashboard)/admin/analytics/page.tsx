'use client';

import { useEffect, useState } from 'react';
import { Users, Briefcase, CheckCircle, UserMinus, Rocket, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Analytics {
    kpis: {
        totalStudents: number;
        totalInternships: number;
        totalAllocations: number;
        unallocatedStudents: number;
    };
    studentStatus: {
        pending: number;
        matched: number;
        accepted: number;
    };
    internshipStatus: {
        open: number;
        closed: number;
    };
    allocationMetrics: {
        proposed: number;
        accepted: number;
        rejected: number;
        successRate: string;
    };
    topInternships: Array<{ title: string; applications: number }>;
    allocationTrend: Array<{ date: string; allocations: number }>;
    dropouts: number;
}

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/admin/analytics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            } else {
                toast.error('Failed to load analytics');
            }
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerAllocation = async () => {
        setTriggering(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/admin/trigger-allocation', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Allocation Triggered!', {
                    description: data.message
                });
                // Refresh analytics after a delay
                setTimeout(fetchAnalytics, 2000);
            } else {
                toast.error(data.message || 'Failed to trigger allocation');
            }
        } catch (error) {
            toast.error('Failed to trigger allocation');
        } finally {
            setTriggering(false);
        }
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading analytics...</div>;
    if (!analytics) return <div className="text-muted">No data available</div>;

    const kpiData = [
        {
            label: 'Total Students',
            value: analytics.kpis.totalStudents,
            icon: <Users className="w-6 h-6" />,
            bgColor: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            label: 'Total Internships',
            value: analytics.kpis.totalInternships,
            icon: <Briefcase className="w-6 h-6" />,
            bgColor: 'bg-secondary',
            textColor: 'text-foreground'
        },
        {
            label: 'Successful Allocations',
            value: analytics.kpis.totalAllocations,
            icon: <CheckCircle className="w-6 h-6" />,
            bgColor: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            label: 'Unallocated Students',
            value: analytics.kpis.unallocatedStudents,
            icon: <UserMinus className="w-6 h-6" />,
            bgColor: 'bg-secondary',
            textColor: 'text-muted'
        }
    ];

    const studentStatusData = [
        { name: 'Pending', value: analytics.studentStatus.pending, color: '#FD5E53' },
        { name: 'Matched', value: analytics.studentStatus.matched, color: '#FFF5E6' },
        { name: 'Accepted', value: analytics.studentStatus.accepted, color: '#666666' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mission Dashboard</h1>
                    <p className="text-muted mt-1">Real-time analytics and system overview</p>
                </div>
                <button
                    onClick={handleTriggerAllocation}
                    disabled={triggering}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                    <Rocket className="w-5 h-5" />
                    {triggering ? 'Triggering...' : 'Trigger Allocation Round'}
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                                <div className={kpi.textColor}>{kpi.icon}</div>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">{kpi.value.toLocaleString()}</div>
                        <div className="text-sm text-muted font-medium">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Internships */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" /> Top Internships by Applications
                    </h3>
                    {analytics.topInternships.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.topInternships}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#EBE9E1" />
                                <XAxis dataKey="title" tick={{ fill: '#71717a', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#71717a' }} />
                                <Tooltip cursor={{ fill: '#F2EFE5' }} />
                                <Bar dataKey="applications" fill="#FD5E53" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted">
                            No internship data available
                        </div>
                    )}
                </div>

                {/* Student Status Distribution */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Student Allocation Status
                    </h3>
                    {studentStatusData.some(d => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={studentStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {studentStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted">
                            No student data available
                        </div>
                    )}
                </div>
            </div>

            {/* Metrics Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-foreground mb-6">Allocation Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-sm text-muted mb-1">Proposed</div>
                        <div className="text-2xl font-bold text-foreground">{analytics.allocationMetrics.proposed}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted mb-1">Accepted</div>
                        <div className="text-2xl font-bold text-primary">{analytics.allocationMetrics.accepted}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted mb-1">Rejected</div>
                        <div className="text-2xl font-bold text-muted">{analytics.allocationMetrics.rejected}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted mb-1">Success Rate</div>
                        <div className="text-2xl font-bold text-primary">{analytics.allocationMetrics.successRate}%</div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-foreground mb-4">System Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm text-foreground">Open Internships: <strong>{analytics.internshipStatus.open}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <span className="text-sm text-foreground">Closed Internships: <strong>{analytics.internshipStatus.closed}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span className="text-sm text-foreground">Total Dropouts: <strong>{analytics.dropouts}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
