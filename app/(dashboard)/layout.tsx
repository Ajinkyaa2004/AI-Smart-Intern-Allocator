'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    User,
    Target,
    ClipboardList,
    Users,
    LayoutDashboard,
    FileText,
    LogOut,
    Star
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState<string>('');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Basic Auth Check
        const userData = localStorage.getItem('userInfo');
        if (!userData) {
            router.push('/login');
        } else {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Fetch display name based on role
            if (parsedUser.role === 'STUDENT') {
                fetchStudentName(parsedUser);
            } else if (parsedUser.role === 'ORG') {
                fetchOrgName(parsedUser);
            } else {
                // For ADMIN, use email username
                setDisplayName(parsedUser.email.split('@')[0]);
            }
        }
    }, [router]);

    const fetchStudentName = async (userData: any) => {
        try {
            const res = await fetch('/api/v1/student/profile', {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.personal && data.personal.name) {
                    setDisplayName(data.personal.name);
                } else {
                    setDisplayName(userData.email.split('@')[0]);
                }
            } else {
                setDisplayName(userData.email.split('@')[0]);
            }
        } catch (error) {
            setDisplayName(userData.email.split('@')[0]);
        }
    };

    const fetchOrgName = async (userData: any) => {
        try {
            const res = await fetch('/api/v1/org/profile', {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.name) {
                    setDisplayName(data.name);
                } else {
                    setDisplayName(userData.email.split('@')[0]);
                }
            } else {
                setDisplayName(userData.email.split('@')[0]);
            }
        } catch (error) {
            setDisplayName(userData.email.split('@')[0]);
        }
    };

    if (!user) return <div className="flex h-screen items-center justify-center text-primary">Loading...</div>;

    const isStudent = user.role === 'STUDENT';
    const isOrg = user.role === 'ORG';

    const studentLinks = [
        { href: '/student/profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
        { href: '/student/matches', label: 'My Allocations', icon: <Target className="w-5 h-5" /> },
        { href: '/student/feedback', label: 'Rate Internship', icon: <Star className="w-5 h-5" /> },
    ];

    const orgLinks = [
        { href: '/org/profile', label: 'Organization Profile', icon: <User className="w-5 h-5" /> },
        { href: '/org/postings', label: 'Internship Postings', icon: <ClipboardList className="w-5 h-5" /> },
        { href: '/org/candidates', label: 'Allocated Candidates', icon: <Users className="w-5 h-5" /> },
        { href: '/org/ratings', label: 'Rate Interns', icon: <Star className="w-5 h-5" /> },
    ];

    const adminLinks = [
        { href: '/admin/analytics', label: 'Mission Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { href: '/admin/logs', label: 'Transparency Logs', icon: <FileText className="w-5 h-5" /> },
    ];

    const links = isStudent ? studentLinks : (isOrg ? orgLinks : adminLinks);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary/50 border-r border-gray-200 hidden md:flex flex-col backdrop-blur-sm">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary">
                        InternMatch
                    </h1>
                    <span className="text-xs text-muted uppercase tracking-widest font-semibold">{user.role} Dashboard</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {links.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary font-medium shadow-sm'
                                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userInfo');
                            router.push('/login');
                        }}
                        className="flex items-center gap-2 text-primary hover:opacity-80 text-sm font-medium px-4 transition-opacity"
                    >
                        <LogOut className="w-4 h-4" />
                        Start Over / Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background">
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 h-16 flex items-center px-8 justify-between sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-foreground">
                        Welcome back, {displayName || 'User'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                            {displayName ? displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
