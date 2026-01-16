"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function MemberIdBanner() {
    const searchParams = useSearchParams();
    const memberId = searchParams.get("memberId");
    if (!memberId) return null;

    return (
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-purple/30 bg-brand-purple/10 px-4 py-2 text-sm">
            <span className="material-symbols-outlined text-brand-lime text-[18px]">badge</span>
            <span className="text-gray-200">Your Member ID:</span>
            <span className="font-mono font-bold text-white">{memberId}</span>
        </div>
    );
}

export default function CompleteProfilePage() {
    const router = useRouter();
    const [currentSection, setCurrentSection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        // A. Personal Information
        gender: "",
        age: "",
        nationalId: "",
        maritalStatus: "",
        childrenCount: "",
        
        // B. Contact & Location
        phoneNumber: "",
        residenceAddress: "",
        
        // C. Professional & Education
        employmentStatus: "",
        occupation: "",
        educationLevel: "",
        
        // D. Church Information
        departments: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDepartmentToggle = (dept: string) => {
        setFormData(prev => ({
            ...prev,
            departments: prev.departments.includes(dept)
                ? prev.departments.filter(d => d !== dept)
                : [...prev.departments, dept]
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setError(null);
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gender: formData.gender || undefined,
                    age: formData.age || undefined,
                    nationalId: formData.nationalId || undefined,
                    maritalStatus: formData.maritalStatus || undefined,
                    childrenCount: formData.childrenCount || undefined,
                    phoneNumber: formData.phoneNumber || undefined,
                    residenceAddress: formData.residenceAddress || undefined,
                    employmentStatus: formData.employmentStatus || undefined,
                    occupation: formData.occupation || undefined,
                    educationLevel: formData.educationLevel || undefined,
                    departments: formData.departments,
                }),
            });

            const data = (await res.json().catch(() => null)) as any;
            if (!res.ok) {
                setError(data?.message ?? "Failed to save profile");
                return;
            }

            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        router.push("/dashboard");
    };

    const departments = [
        "Disciples", "Ushers", "Pastoral", "Intercessory", 
        "Hospitality", "Media", "Praise & Worship", "Welfare",
        "Repair & Maintenance", "Prayer Line", "Sound"
    ];

    const sections = [
        { id: 1, title: "Personal Information", icon: "person" },
        { id: 2, title: "Contact & Location", icon: "location_on" },
        { id: 3, title: "Professional & Education", icon: "work" },
        { id: 4, title: "Church Information", icon: "church" },
    ];

    return (
        <div className="relative flex min-h-screen w-full bg-[#0a0a0a] text-white">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-black/0 to-brand-lime/10"></div>
            
            {/* Main Content */}
            <div className="relative w-full max-w-6xl mx-auto p-6 py-12">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex size-16 items-center justify-center bg-gradient-to-br from-brand-purple to-brand-lime rounded-2xl">
                        <span className="material-symbols-outlined text-white text-3xl">church</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
                    <p className="text-gray-400">Step 2 of 2 - Help us know you better</p>
                    <Suspense fallback={null}>
                        <MemberIdBanner />
                    </Suspense>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 flex justify-center overflow-x-auto">
                    <div className="flex items-center gap-2">
                        {sections.map((section, index) => (
                            <div key={section.id} className="flex items-center">
                                <button
                                    onClick={() => setCurrentSection(section.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                                        currentSection === section.id
                                            ? "bg-brand-purple text-white"
                                            : currentSection > section.id
                                            ? "bg-brand-lime/20 text-brand-lime"
                                            : "bg-white/5 text-gray-400"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{section.icon}</span>
                                    <span className="text-sm font-medium hidden sm:inline">{section.title}</span>
                                </button>
                                {index < sections.length - 1 && (
                                    <div className="w-8 h-0.5 bg-white/10 mx-1"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-4xl mx-auto">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}
                    
                    {/* Section 1: Personal Information */}
                    {currentSection === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-lime">person</span>
                                Personal Information
                            </h2>

                            {/* Profile Photo */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative mb-4">
                                    <div className="size-32 rounded-full bg-gradient-to-br from-brand-purple to-brand-lime flex items-center justify-center overflow-hidden">
                                        {profilePhoto ? (
                                            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-white text-5xl">person</span>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 size-10 bg-brand-purple hover:brightness-110 rounded-full flex items-center justify-center cursor-pointer transition-all">
                                        <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-400">Upload profile photo</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        required
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Age *</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        placeholder="25"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">National ID Number *</label>
                                    <input
                                        type="text"
                                        name="nationalId"
                                        value={formData.nationalId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        placeholder="12345678"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Marital Status *</label>
                                    <select
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        required
                                    >
                                        <option value="">Select status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Number of Children</label>
                                    <input
                                        type="number"
                                        name="childrenCount"
                                        value={formData.childrenCount}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Contact & Location */}
                    {currentSection === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-lime">location_on</span>
                                Contact & Location
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        placeholder="+254 712 345 678"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Residence Address *</label>
                                    <textarea
                                        name="residenceAddress"
                                        value={formData.residenceAddress}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                                        placeholder="Enter your full address..."
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Professional & Education */}
                    {currentSection === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-lime">work</span>
                                Professional & Education
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Employment Status *</label>
                                    <select
                                        name="employmentStatus"
                                        value={formData.employmentStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        required
                                    >
                                        <option value="">Select status</option>
                                        <option value="Employed">Employed</option>
                                        <option value="Self-Employed">Self-Employed</option>
                                        <option value="Unemployed">Unemployed</option>
                                        <option value="Student">Student</option>
                                        <option value="Retired">Retired</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Occupation *</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        placeholder="e.g., Software Engineer"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Level of Education *</label>
                                    <select
                                        name="educationLevel"
                                        value={formData.educationLevel}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                        required
                                    >
                                        <option value="">Select level</option>
                                        <option value="Primary">Primary</option>
                                        <option value="Secondary">Secondary</option>
                                        <option value="Certificate">Certificate</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                        <option value="Doctorate">Doctorate</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Church Information */}
                    {currentSection === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-lime">church</span>
                                Church Information
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold mb-3">Select Department(s)</label>
                                <p className="text-sm text-gray-400 mb-4">You can select multiple departments</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => handleDepartmentToggle(dept)}
                                            className={`px-4 py-3 rounded-xl border transition-all ${
                                                formData.departments.includes(dept)
                                                    ? "bg-brand-purple border-brand-purple/40 text-white"
                                                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-medium">{dept}</span>
                                                {formData.departments.includes(dept) && (
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {formData.departments.length > 0 && (
                                    <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                                        <p className="text-sm text-green-400">
                                            <span className="font-semibold">{formData.departments.length}</span> department(s) selected
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                            disabled={currentSection === 1}
                            aria-label="Previous"
                            title="Previous"
                            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="sr-only">Previous</span>
                        </button>

                        {currentSection < 4 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentSection(currentSection + 1)}
                                aria-label="Next"
                                title="Next"
                                className="px-4 py-3 bg-brand-purple hover:brightness-110 rounded-xl font-bold transition-all flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined">arrow_forward</span>
                                <span className="sr-only">Next</span>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                aria-label={loading ? "Completing" : "Complete"}
                                title={loading ? "Completing" : "Complete"}
                                className="px-4 py-3 bg-brand-purple hover:brightness-110 disabled:bg-brand-purple/50 rounded-xl font-bold transition-all disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        <span className="sr-only">Completing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <span className="sr-only">Complete</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Skip Option */}
                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Skip for now (complete later)
                    </button>
                </div>
            </div>
        </div>
    );
}
