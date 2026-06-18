import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { AIService } from '../services/ai-service';
import '../styles/Main.css';

const Profile = () => {
    const { currentUser, userProfile, refreshProfile } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        qualification: '',
        experience: '',
        resumeSummary: '',
        skills: []
    });
    const [skillInput, setSkillInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // AI Resume Parsing State
    const [resumeText, setResumeText] = useState('');
    const [isParsing, setIsParsing] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.fullName || '',
                qualification: userProfile.qualification || '',
                experience: userProfile.experience || '',
                resumeSummary: userProfile.resumeSummary || '',
                skills: userProfile.skills || []
            });
        }
    }, [userProfile]);

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleParseResume = async () => {
        if (!resumeText.trim()) return;
        setIsParsing(true);
        try {
            const data = await AIService.parseResumeForProfile(resumeText);
            setFormData(prev => ({
                ...prev,
                fullName: data.fullName || prev.fullName,
                qualification: data.qualification || prev.qualification,
                experience: data.experience !== undefined ? data.experience : prev.experience,
                skills: Array.isArray(data.skills) ? [...new Set([...prev.skills, ...data.skills])] : prev.skills,
                resumeSummary: data.resumeSummary || prev.resumeSummary
            }));
            setResumeText('');
            alert("Profile fields successfully auto-filled from your resume!");
        } catch (error) {
            console.error("Resume Parse Error:", error);
            alert("Failed to parse resume. Please ensure the text contains clear resume details or try filling manually.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return alert("You must be logged in.");

        const token = localStorage.getItem('jobFinderToken');
        setIsSaving(true);
        try {
            const response = await fetch(`https://jobfinder-8yu2.onrender.com/api/user/${currentUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    qualification: formData.qualification,
                    experience: Number(formData.experience),
                    skills: formData.skills,
                    resumeSummary: formData.resumeSummary
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to save profile');

            refreshProfile(data); // Sync state locally
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Save Error:", error);
            alert("Error saving profile: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container" style={{ marginTop: '50px' }}>
                <div style={{ background: 'white', borderRadius: '20px', padding: '48px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px', borderBottom: '2px solid var(--border-color)', paddingBottom: '32px' }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--accent-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'var(--accent-primary)' }}>
                            <i className="fas fa-user"></i>
                        </div>
                        <div>
                            <h2>{formData.fullName || 'User Name'}</h2>
                            <p>{currentUser?.email}</p>
                        </div>
                    </div>

                    {/* AI Auto-fill Section */}
                    <div style={{ marginBottom: '40px', padding: '24px', background: '#f5f7fa', borderRadius: '15px', border: '2px dashed var(--accent-light)' }}>
                        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-wand-magic-sparkles"></i> Auto-fill with AI
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
                            Paste your resume text below and let AI automatically extract your details to fill out this profile form.
                        </p>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your raw resume content here..."
                            style={{ width: '100%', height: '120px', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '16px', resize: 'vertical', fontSize: '14px' }}
                        ></textarea>
                        <button
                            type="button"
                            onClick={handleParseResume}
                            disabled={isParsing || !resumeText.trim()}
                            className="ai-match-btn"
                            style={{ padding: '12px 24px', fontSize: '15px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                        >
                            {isParsing ? <><i className="fas fa-spinner fa-spin"></i> Analyzing Resume Details...</> : <><i className="fas fa-bolt"></i> Extract Details & Fill Form</>}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Full Name</label>
                            <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter your full name" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '15px' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Qualification</label>
                            <input type="text" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} placeholder="e.g. B.Tech Computer Science" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '15px' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Experience (Years)</label>
                            <input type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="e.g. 2" min="0" step="0.5" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '15px' }} />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Skills (Add multiple)</label>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Enter a skill (e.g. React)" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '15px' }} />
                                <button type="button" onClick={handleAddSkill} className="nav-btn">Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                                {formData.skills.map((skill, index) => (
                                    <div key={index} style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}>
                                        {skill} <i className="fas fa-times" onClick={() => handleRemoveSkill(skill)} style={{ cursor: 'pointer' }}></i>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Resume Summary</label>
                            <textarea value={formData.resumeSummary} onChange={(e) => setFormData({ ...formData, resumeSummary: e.target.value })} placeholder="Briefly describe your experience..." style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '15px', height: '120px', resize: 'vertical' }}></textarea>
                        </div>

                        <button type="submit" className="save-btn" disabled={isSaving} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginTop: '32px', width: '100%' }}>
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
