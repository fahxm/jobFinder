
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { AIService } from '../services/ai-service';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import '../styles/Main.css';

const ResumeBuilder = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const resumeRef = useRef(null);


    const [resumeContent, setResumeContent] = useState(() => {
        return localStorage.getItem('resumeContent') || '';
    });

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('resumeFormData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved resume data", e);
            }
        }
        return {
            contact: { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
            summary: '',
            skills: '',
            education: [{ school: '', degree: '', year: '', honors: '' }],
            workExperience: [{ company: '', role: '', duration: '', achievements: '' }],
            projects: [{ title: '', tech: '', impact: '' }],
            certifications: '',
            languages: ''
        };
    });

    // Save to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('resumeFormData', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        if (resumeContent) {
            localStorage.setItem('resumeContent', resumeContent);
        } else {
            localStorage.removeItem('resumeContent');
        }
    }, [resumeContent]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const content = await AIService.generateATSResume({ ...formData, skills: skillsArray });
            setResumeContent(content);
        } catch (error) {
            console.error("Failed to generate resume:", error);
            alert("Failed to generate resume. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!resumeRef.current) return;

        const opt = {
            margin: 15,
            filename: `${formData.contact.fullName ? formData.contact.fullName.replace(/\s+/g, '_') + '_' : ''}Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const element = resumeRef.current;
        const originalPadding = element.style.padding;
        const originalBoxShadow = element.style.boxShadow;

        element.style.padding = '20px';
        element.style.boxShadow = 'none';

        html2pdf().set(opt).from(element).save().then(() => {
            // Restore styles
            element.style.padding = originalPadding;
            element.style.boxShadow = originalBoxShadow;
        });
    };

    const updateContact = (field, value) => {
        setFormData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    };

    const addListField = (key, emptyObj) => {
        setFormData(prev => ({ ...prev, [key]: [...prev[key], emptyObj] }));
    };

    const updateListField = (key, index, field, value) => {
        const newList = [...formData[key]];
        newList[index][field] = value;
        setFormData(prev => ({ ...prev, [key]: newList }));
    };

    const removeListField = (key, index) => {
        const newList = formData[key].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [key]: newList }));
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container resume-builder-container" style={{ marginTop: '50px', maxWidth: '1000px' }}>
                <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ marginBottom: '10px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <i className="fas fa-file-invoice" style={{ color: 'var(--accent-primary)' }}></i>
                        AI ATS Resume Builder
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '15px' }}>
                        Transform your raw details into a high-impact, professional resume. Fields left empty will be automatically omitted.
                    </p>

                    {/* Contact Info */}
                    <div className="form-section" style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '2px solid var(--accent-light)', paddingBottom: '10px', marginBottom: '24px' }}>Contact Information</h3>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="e.g. John Doe" value={formData.contact.fullName} onChange={(e) => updateContact('fullName', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="e.g. john@example.com" value={formData.contact.email} onChange={(e) => updateContact('email', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" placeholder="e.g. +91 98765 43210" value={formData.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn URL</label>
                                <input type="text" placeholder="linkedin.com/in/username" value={formData.contact.linkedin} onChange={(e) => updateContact('linkedin', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>GitHub URL</label>
                                <input type="text" placeholder="github.com/username" value={formData.contact.github} onChange={(e) => updateContact('github', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Portfolio URL</label>
                                <input type="text" placeholder="yourportfolio.com" value={formData.contact.portfolio} onChange={(e) => updateContact('portfolio', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Summary & Skills */}
                    <div className="form-grid-2" style={{ marginBottom: '40px' }}>
                        <div className="form-group">
                            <h3 style={{ marginBottom: '15px' }}>Professional Summary</h3>
                            <label>Describe your career highlights and goals</label>
                            <textarea placeholder="e.g. Dedicated software engineer with 3+ years of experience in building scalable web applications..." value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })}></textarea>
                        </div>
                        <div className="form-group">
                            <h3 style={{ marginBottom: '15px' }}>Skills</h3>
                            <label>List your top technical and soft skills</label>
                            <textarea placeholder="e.g. React, Node.js, Python, SQL, Project Management, Agile..." value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })}></textarea>
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="form-section" style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '2px solid var(--accent-light)', paddingBottom: '10px', marginBottom: '20px' }}>Work Experience</h3>
                        {formData.workExperience.map((work, index) => (
                            <div key={index} style={{ marginBottom: '24px', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative', background: '#fcfcfd' }}>
                                <div className="form-grid-3" style={{ marginBottom: '20px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Company Name</label>
                                        <input type="text" placeholder="e.g. Google" value={work.company} onChange={(e) => updateListField('workExperience', index, 'company', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Job Title</label>
                                        <input type="text" placeholder="e.g. Senior Developer" value={work.role} onChange={(e) => updateListField('workExperience', index, 'role', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Duration</label>
                                        <input type="text" placeholder="Jan 2021 - Present" value={work.duration} onChange={(e) => updateListField('workExperience', index, 'duration', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Achievements & Responsibilities</label>
                                    <textarea placeholder="Mention projects you led, technologies used, and measurable impacts..." value={work.achievements} onChange={(e) => updateListField('workExperience', index, 'achievements', e.target.value)}></textarea>
                                </div>
                                {index > 0 && <button onClick={() => removeListField('workExperience', index)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}><i className="fas fa-times"></i></button>}
                            </div>
                        ))}
                        <button className="nav-btn" onClick={() => addListField('workExperience', { company: '', role: '', duration: '', achievements: '' })}>
                            <i className="fas fa-plus"></i> Add Experience
                        </button>
                    </div>

                    {/* Education */}
                    <div className="form-section" style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '2px solid var(--accent-light)', paddingBottom: '10px', marginBottom: '20px' }}>Education</h3>
                        {formData.education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                                <div className="form-grid-4">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Institution</label>
                                        <input type="text" placeholder="University Name" value={edu.school} onChange={(e) => updateListField('education', index, 'school', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Degree</label>
                                        <input type="text" placeholder="e.g. B.Tech CS" value={edu.degree} onChange={(e) => updateListField('education', index, 'degree', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Grad Year</label>
                                        <input type="text" placeholder="e.g. 2020" value={edu.year} onChange={(e) => updateListField('education', index, 'year', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>GPA / Honors</label>
                                        <input type="text" placeholder="e.g. 3.8 / Honors" value={edu.honors} onChange={(e) => updateListField('education', index, 'honors', e.target.value)} />
                                    </div>
                                </div>
                                {index > 0 && <button onClick={() => removeListField('education', index)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}>Remove Education</button>}
                            </div>
                        ))}
                        <button className="nav-btn" onClick={() => addListField('education', { school: '', degree: '', year: '', honors: '' })}>
                            <i className="fas fa-plus"></i> Add Education
                        </button>
                    </div>

                    {/* Projects */}
                    <div className="form-section" style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '2px solid var(--accent-light)', paddingBottom: '10px', marginBottom: '20px' }}>Key Projects</h3>
                        {formData.projects.map((proj, index) => (
                            <div key={index} style={{ marginBottom: '24px', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', background: '#fcfcfd' }}>
                                <div className="form-grid-2" style={{ marginBottom: '20px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Project Title</label>
                                        <input type="text" placeholder="e.g. E-Commerce Platform" value={proj.title} onChange={(e) => updateListField('projects', index, 'title', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Tech Stack</label>
                                        <input type="text" placeholder="e.g. React, Firebase" value={proj.tech} onChange={(e) => updateListField('projects', index, 'tech', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Impact & Contribution</label>
                                    <textarea placeholder="What problem did it solve? What was your specific contribution?..." value={proj.impact} onChange={(e) => updateListField('projects', index, 'impact', e.target.value)}></textarea>
                                </div>
                                {index > 0 && <button onClick={() => removeListField('projects', index)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}>Remove Project</button>}
                            </div>
                        ))}
                        <button className="nav-btn" onClick={() => addListField('projects', { title: '', tech: '', impact: '' })}>
                            <i className="fas fa-plus"></i> Add Project
                        </button>
                    </div>

                    {/* Certifications & Languages */}
                    <div className="form-grid-2" style={{ marginBottom: '40px' }}>
                        <div className="form-group">
                            <h3 style={{ marginBottom: '15px' }}>Certifications</h3>
                            <label>Professional certificates and licenses</label>
                            <input type="text" placeholder="e.g. AWS Certified Developer, Google Data Analytics" value={formData.certifications} onChange={(e) => setFormData({ ...formData, certifications: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <h3 style={{ marginBottom: '15px' }}>Languages</h3>
                            <label>Fluency and proficiency levels</label>
                            <input type="text" placeholder="e.g. English (Fluent), Hindi (Native), Spanish (Basic)" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} />
                        </div>
                    </div>

                    <button
                        className="ai-match-btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{ padding: '20px', fontSize: '18px' }}
                    >
                        {isGenerating ? <><i className="fas fa-spinner fa-spin"></i> Crafting Your Professional Resume...</> : <><i className="fas fa-magic"></i> Generate AI ATS Resume</>}
                    </button>

                    {resumeContent && (
                        <div id="resume-output" style={{ marginTop: '50px', padding: '40px', background: '#f9fafb', borderRadius: '15px', border: '2px dashed var(--accent-light)' }}>
                            <div className="profile-header-flex" style={{ marginBottom: '30px', borderBottom: 'none', paddingBottom: '0' }}>
                                <h3 style={{ color: 'var(--accent-primary)', marginBottom: 0 }}>Your Professional ATS Resume</h3>
                                <div className="resume-action-btns">
                                    <button className="nav-btn" onClick={() => { navigator.clipboard.writeText(resumeContent); alert("Resume copied to clipboard! You can paste it into a Word doc or Google Doc."); }}>
                                        <i className="fas fa-copy"></i> Copy Text
                                    </button>
                                    <button className="nav-btn" onClick={handleDownloadPDF} style={{ background: 'var(--accent-primary)', color: 'white', borderColor: 'var(--accent-primary)' }}>
                                        <i className="fas fa-download"></i> Download PDF
                                    </button>
                                </div>
                            </div>
                            <div className="resume-preview" ref={resumeRef}>
                                <ReactMarkdown>{resumeContent}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
