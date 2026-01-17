'use client';

import { useEffect, useState } from 'react';
import { FileDown, Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Log {
    id: string;
    type: string;
    details: string;
    status: string;
    time: string;
}

export default function AdminLogs() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/admin/logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            } else {
                toast.error('Failed to load logs');
            }
        } catch (error) {
            toast.error('Failed to load logs');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <CheckCircle className="w-3 h-3" />;
            case 'WARN': return <AlertTriangle className="w-3 h-3" />;
            case 'INFO': return <Info className="w-3 h-3" />;
            default: return <Activity className="w-3 h-3" />;
        }
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading logs...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Transparency Logs</h1>
                <a
                    href="http://localhost:3000/api/v1/allocation/export"
                    target="_blank"
                    className="bg-white hover:bg-gray-50 text-foreground border border-gray-200 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                >
                    <FileDown className="w-4 h-4 text-muted" /> Export Full Audit (CSV)
                </a>
            </div>

            {logs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No Activity Yet</h3>
                    <p className="text-muted">System logs will appear here as actions are performed</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/30 border-b border-gray-100 text-muted text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-medium">Event Type</th>
                                <th className="p-5 font-medium">Details</th>
                                <th className="p-5 font-medium">Status</th>
                                <th className="p-5 font-medium">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="p-5 font-bold text-xs font-mono text-primary flex items-center gap-2">
                                        <Activity className="w-3 h-3 opacity-50" />
                                        {log.type}
                                    </td>
                                    <td className="p-5 text-sm text-foreground">{log.details}</td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${log.status === 'SUCCESS' ? 'bg-primary/10 text-primary border border-primary/30' :
                                                (log.status === 'WARN' ? 'bg-foreground/10 text-foreground border border-foreground/20' : 'bg-secondary text-muted border border-border')
                                            }`}>
                                            {getStatusIcon(log.status)}
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-muted font-medium">{log.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
