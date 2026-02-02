'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Mail, Users, Building2, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCredentials, setShowCredentials] = useState(true);
    const router = useRouter();

    const testCredentials = {
        admin: { name: 'Admin', email: 'admin@gmail.com', password: '12341234' },
        students: [
            { name: 'Ajinkya Dhumal', email: 'ajinkya@gmail.com', password: '12341234', skills: 'React, Python, Node.js' },
            { name: 'Priya Sharma', email: 'priya@gmail.com', password: '12341234', skills: 'Java, Spring Boot, AWS' },
            { name: 'Rahul Verma', email: 'rahul@gmail.com', password: '12341234', skills: 'Python, Data Science' },
            { name: 'Ananya Patel', email: 'ananya@gmail.com', password: '12341234', skills: 'Flutter, UI/UX' },
            { name: 'Vikram Singh', email: 'vikram@gmail.com', password: '12341234', skills: 'AutoCAD, SolidWorks' }
        ],
        organizations: [
            { name: 'TechCorp India', email: 'techcorp@gmail.com', password: '12341234', type: 'Technology' },
            { name: 'National AI Lab', email: 'national@gmail.com', password: '12341234', type: 'AI/ML' },
            { name: 'MobileFirst', email: 'mobilefirst@gmail.com', password: '12341234', type: 'Mobile Dev' },
            { name: 'BHEL', email: 'bel@gmail.com', password: '12341234', type: 'Manufacturing' },
            { name: 'CloudNine Tech', email: 'cloudnine@gmail.com', password: '12341234', type: 'Cloud' }
        ]
    };

    const quickLogin = (email: string, password: string) => {
        setEmail(email);
        setPassword(password);
        toast.info('Credentials filled! Click Sign In');
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                toast.success('Login Successful');

                if (data.role === 'STUDENT') router.push('/student/matches');
                else if (data.role === 'ORG') router.push('/org/candidates');
                else if (data.role === 'ADMIN') router.push('/admin/analytics');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (err) {
            toast.error('Login failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="flex gap-6 w-full max-w-6xl">
                {/* Login Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome Back</h1>
                    <p className="text-muted">Sign in to your InternMatch account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 shadow-md hover:shadow-lg">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary font-semibold hover:underline">
                            Create Account
                        </Link>
                    </p>

            {/* Test Credentials Panel */}
            <div className="bg-white rounded-2xl shadow-xl flex-1 border border-gray-100 overflow-hidden">
                <div 
                    className="bg-primary/5 p-4 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setShowCredentials(!showCredentials)}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">Test Credentials</h3>
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">FOR TESTING</span>
                    </div>
                    {showCredentials ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>

                {showCredentials && (
                    <div className="p-4 max-h-150 overflow-y-auto">
                        {/* Admin Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Lock className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold text-foreground">Admin</h4>
                            </div>
                            <div 
                                className="p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group"
                                onClick={() => quickLogin(testCredentials.admin.email, testCredentials.admin.password)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-foreground">{testCredentials.admin.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-muted">{testCredentials.admin.email}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(testCredentials.admin.email, 'Email');
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Copy className="w-3 h-3 text-muted hover:text-primary" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-primary font-medium mt-1">Full Dashboard Access</p>
                                    </div>
                                    <span className="text-xs bg-primary text-white px-2 py-1 rounded font-bold ml-2">
                                        ADMIN
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Students Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold text-foreground">Students (5)</h4>
                            </div>
                            <div className="space-y-2">
                                {testCredentials.students.map((student, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                                        onClick={() => quickLogin(student.email, student.password)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-foreground">{student.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-muted">{student.email}</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(student.email, 'Email');
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Copy className="w-3 h-3 text-muted hover:text-primary" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted mt-1">Skills: {student.skills}</p>
                                            </div>
                                            <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded ml-2">
                                                Click to fill
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organizations Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold text-foreground">Organizations (5)</h4>
                            </div>
                            <div className="space-y-2">
                                {testCredentials.organizations.map((org, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                                        onClick={() => quickLogin(org.email, org.password)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-foreground">{org.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-muted">{org.email}</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(org.email, 'Email');
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Copy className="w-3 h-3 text-muted hover:text-primary" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted mt-1">Type: {org.type}</p>
                                            </div>
                                            <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded ml-2">
                                                Click to fill
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                            <p className="text-xs text-muted text-center">
                                🔑 All passwords: <code className="bg-white px-2 py-1 rounded font-mono text-primary">12341234</code>
                            </p>
                        </div>
                    </div>
                )}
            </div>
            </div>
                </div>
            </div>
        </div>
    );
}

