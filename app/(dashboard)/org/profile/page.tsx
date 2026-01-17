'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Briefcase, User, Phone, Mail, Plus, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
    name: string;
    type: string;
    sector: string;
    locations: string[];
    contactPerson: {
        name: string;
        email: string;
        phone: string;
    };
}

export default function OrgProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profileExists, setProfileExists] = useState(false);

    const [profile, setProfile] = useState<ProfileData>({
        name: '',
        type: 'PRIVATE',
        sector: '',
        locations: [],
        contactPerson: {
            name: '',
            email: '',
            phone: ''
        }
    });

    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/org/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok && data.exists !== false) {
                setProfile(data);
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
        if (!profile.name) {
            toast.error('Organization name is required');
            return;
        }
        if (!profile.sector) {
            toast.error('Sector is required');
            return;
        }
        if (!profile.contactPerson.name || !profile.contactPerson.email || !profile.contactPerson.phone) {
            toast.error('Contact person details are required');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/v1/org/profile', {
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
                setProfile(data.org);
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

    const addLocation = () => {
        if (newLocation && !profile.locations.includes(newLocation)) {
            setProfile({
                ...profile,
                locations: [...profile.locations, newLocation]
            });
            setNewLocation('');
        }
    };

    const removeLocation = (loc: string) => {
        setProfile({
            ...profile,
            locations: profile.locations.filter(l => l !== loc)
        });
    };

    if (loading) return <div className="text-primary font-medium animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Organization Profile</h1>
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
                        <Building2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                        {editing ? (
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Enter organization name"
                                className="text-2xl font-bold text-foreground border-b-2 border-primary/30 focus:border-primary outline-none w-full"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-foreground">{profile.name || 'No Name Set'}</h2>
                        )}
                        <p className="text-muted mt-1">{JSON.parse(localStorage.getItem('userInfo') || '{}').email}</p>
                    </div>
                </div>

                {/* Organization Details */}
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Building2 className="h-5 w-5 text-primary" /> Organization Details
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-muted block text-sm mb-2">Organization Type</span>
                            {editing ? (
                                <select
                                    value={profile.type}
                                    onChange={e => setProfile({ ...profile, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="MINISTRY">Ministry</option>
                                    <option value="PSU">PSU</option>
                                    <option value="PRIVATE">Private</option>
                                    <option value="NGO">NGO</option>
                                </select>
                            ) : (
                                <span className="font-semibold text-foreground text-lg">{profile.type || 'Not set'}</span>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block text-sm mb-2">Sector</span>
                            {editing ? (
                                <input
                                    type="text"
                                    value={profile.sector}
                                    onChange={e => setProfile({ ...profile, sector: e.target.value })}
                                    placeholder="e.g., IT, Manufacturing, Healthcare"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg">{profile.sector || 'Not set'}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Locations */}
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <MapPin className="h-5 w-5 text-primary" /> Office Locations
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {profile.locations.map((loc, index) => (
                            <div key={index} className="px-4 py-2 bg-secondary/30 rounded-xl text-sm flex items-center gap-3 border border-gray-100">
                                <span className="font-medium text-foreground">{loc}</span>
                                {editing && (
                                    <button onClick={() => removeLocation(loc)} className="text-muted hover:text-foreground">
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
                                    value={newLocation}
                                    onChange={e => setNewLocation(e.target.value)}
                                    placeholder="Add location (e.g., Mumbai, Delhi)"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <button
                                onClick={addLocation}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact Person */}
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <User className="h-5 w-5 text-primary" /> Contact Person Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <span className="text-muted block text-sm mb-2">Name</span>
                            {editing ? (
                                <input
                                    type="text"
                                    value={profile.contactPerson.name}
                                    onChange={e => setProfile({
                                        ...profile,
                                        contactPerson: { ...profile.contactPerson, name: e.target.value }
                                    })}
                                    placeholder="Contact person name"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted" />
                                    {profile.contactPerson.name || 'Not set'}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block text-sm mb-2">Email</span>
                            {editing ? (
                                <input
                                    type="email"
                                    value={profile.contactPerson.email}
                                    onChange={e => setProfile({
                                        ...profile,
                                        contactPerson: { ...profile.contactPerson, email: e.target.value }
                                    })}
                                    placeholder="contact@organization.com"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted" />
                                    {profile.contactPerson.email || 'Not set'}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-muted block text-sm mb-2">Phone</span>
                            {editing ? (
                                <input
                                    type="tel"
                                    value={profile.contactPerson.phone}
                                    onChange={e => setProfile({
                                        ...profile,
                                        contactPerson: { ...profile.contactPerson, phone: e.target.value }
                                    })}
                                    placeholder="+91 1234567890"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            ) : (
                                <span className="font-semibold text-foreground text-lg flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted" />
                                    {profile.contactPerson.phone || 'Not set'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
