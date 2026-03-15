import React, { useState } from 'react';
import { AIService } from '../../services/ai-service';
import { useAuth } from '../../context/AuthContext';

const CareerRoadmap = () => {
    const { userProfile } = useAuth();
    const [currentRole, setCurrentRole] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

    const handleGenerateRoadmap = async () => {
        if (!currentRole.trim()) return alert("Please enter your current role first!");
        if (!userProfile) return alert("Profile is still loading or not set...");
        setIsGeneratingRoadmap(true);
        try {
            const roadmapData = await AIService.generateCareerRoadmap(currentRole, userProfile);
            setRoadmap(roadmapData);
        } catch (error) {
            console.error("Roadmap generation error:", error);
            alert("AI service error. Using fallback.");
            setRoadmap([
                { year: "Year 1", role: "Junior Specialist", desc: "Gain fundamental experience", skills: ["Basics", "Tools"] },
                { year: "Year 3", role: "Senior Specialist", desc: "Lead small projects", skills: ["Leadership", "Architecture"] },
                { year: "Year 5", role: "Manager / Architect", desc: "Strategic planning", skills: ["Strategy", "Management"] }
            ]);
        } finally {
            setIsGeneratingRoadmap(false);
        }
    };

    return (
        <section id="career" className="content-section">
            <div className="career-container">
                <div className="career-header">
                    <h1>Your Personalized Career Roadmap</h1>
                    <p>AI-generated 5-year career projection based on your current profile.</p>
                </div>
                <div className="career-form">
                    <h3>Ready to see your future?</h3>
                    <p>Tell us about your current position and we'll build a personalized 5-year roadmap.</p>
                    <div style={{ margin: '20px 0' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>What is your current role?</label>
                        <input
                            type="text"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                            placeholder="e.g. Junior Web Developer, Data Analyst, Student, etc."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f2027', color: 'white', border: '1px solid #31534b', fontSize: '1rem' }}
                        />
                        <p style={{ fontSize: '0.85rem', color: '#bdc3c7', marginTop: '8px' }}>Be specific! Examples: 'Fresher looking for first job', 'Junior React Developer with 1 year experience'</p>
                    </div>
                    <button className="ai-generate-btn" onClick={handleGenerateRoadmap} disabled={isGeneratingRoadmap}>
                        {isGeneratingRoadmap ? <><i className="fas fa-spinner fa-spin"></i> AI is analyzing...</> : <><i className="fas fa-magic"></i> Generate Career Path</>}
                    </button>
                </div>

                {roadmap && (
                    <div className="roadmap" style={{ display: 'block' }}>
                        {roadmap.map((item, index) => (
                            <div key={index} className="roadmap-item">
                                <div className="roadmap-dot"></div>
                                <div className="roadmap-content">
                                    <div className="year-label">{item.year}</div>
                                    <h4>{item.role}</h4>
                                    <p>{item.desc}</p>
                                    <div className="skills-needed">
                                        <strong>Key Skills to acquire:</strong><br />
                                        {item.skills.map(s => <span key={s}>{s}</span>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CareerRoadmap;
