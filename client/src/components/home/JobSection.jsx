import React, { useState, useEffect } from 'react';
import { AIService } from '../../services/ai-service';
import { useAuth } from '../../context/AuthContext';

import { useNavigate } from 'react-router-dom';

const JobSection = () => {
    const { userProfile, currentUser } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [displayQuery, setDisplayQuery] = useState('Search for jobs to get started');
    const [selectedJob, setSelectedJob] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const RAPID_API_KEY = '997b52feb0mshdbcd0f2b8112940p1cc865jsnd7b462c5ba22';

    const fetchJobs = async () => {
        if (!currentUser) {
            alert("Please login to use this feature");
            navigate('/login');
            return;
        }
        setLoading(true);
        const fullQuery = `${searchQuery} in ${searchLocation}`;
        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(fullQuery)}&num_pages=2`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();

            if (result.data && result.data.length > 0) {
                const formattedJobs = result.data.map(job => ({
                    id: job.job_id,
                    role: job.job_title,
                    company: job.employer_name,
                    location: (job.job_city ? job.job_city + ", " : "") + (job.job_country || 'Remote'),
                    salary: (() => {
                        const min = job.job_min_salary;
                        const max = job.job_max_salary;
                        const currency = job.job_salary_currency || "";
                        const period = job.job_salary_period || "";
                        if (min || max) {
                            let salaryStr = currency + " ";
                            if (min && max && min !== max) {
                                salaryStr += `${min.toLocaleString()} - ${max.toLocaleString()}`;
                            } else {
                                salaryStr += (min || max).toLocaleString();
                            }
                            if (period) salaryStr += ` per ${period}`;
                            return salaryStr;
                        }
                        return "Not disclosed by employer";
                    })(),
                    qualifications: job.job_highlights?.Qualifications?.join(', ') || "See description",
                    requirements: job.job_highlights?.Responsibilities?.join(', ') || "Check details",
                    skills: job.job_required_skills || [job.job_title],
                    description: job.job_description || "No description provided.",
                    applyLink: job.job_apply_link,
                    source: job.job_publisher
                }));
                setJobs(formattedJobs);
                setDisplayQuery(fullQuery);
            } else {
                setJobs([]);
                setDisplayQuery(`No jobs found for "${fullQuery}"`);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchJobs();
        }
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setAnalysisResult(null);
    };

    const handleAIAnalysis = async () => {
        if (!userProfile) return alert("Please complete your profile first!");
        setIsAnalyzing(true);
        try {
            const jobContext = {
                title: selectedJob.role,
                description: selectedJob.description,
                qualifications: selectedJob.qualifications,
                skills: selectedJob.skills
            };
            const userExp = parseFloat(userProfile.experience) || 0;
            const analysis = await AIService.analyzeSkills(userProfile.skills || [], jobContext, userExp);
            setAnalysisResult(analysis);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Analysis failed.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <section id="jobs" className="content-section">
            <div className="jobs-container">
                <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
                    <i className="fas fa-briefcase" style={{ marginRight: '10px', color: 'var(--accent-primary)' }}></i>
                    {displayQuery.includes('No jobs found') ? displayQuery : `Recent Jobs: ${displayQuery}`}
                </h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        style={{ flexGrow: 0.5 }}
                    />
                    <button className="nav-btn" onClick={fetchJobs}>Search</button>
                </div>

                <div className="jobs-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center' }}><i className="fas fa-spinner fa-spin fa-2x"></i><p>Fetching real-time jobs...</p></div>
                    ) : jobs.length > 0 ? (
                        jobs.map(job => (
                            <div key={job.id} className="job-card">
                                <h3>{job.role}</h3>
                                <div className="company">{job.company}</div>
                                <div className="location"><i className="fas fa-map-marker-alt"></i> {job.location}</div>
                                <div className="salary" style={{ fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '20px' }}>
                                    <i className="fas fa-money-bill-wave"></i> {job.salary}
                                </div>
                                <button className="details-btn" onClick={() => handleJobClick(job)}>More Details</button>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center' }}><p>No jobs found. Try a different search.</p></div>
                    )}
                </div>
            </div>

            {selectedJob && (
                <div className="modal" onClick={(e) => { if (e.target.className === 'modal') setSelectedJob(null); }}>
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setSelectedJob(null)}>&times;</span>
                        <div className="modal-header">
                            <h2>{selectedJob.role}</h2>
                            <p><strong>{selectedJob.company}</strong> | {selectedJob.location}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Source: {selectedJob.source}</p>
                        </div>
                        <div style={{ margin: '20px 0', display: 'flex', gap: '12px' }}>
                            <a href={selectedJob.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textAlign: 'center', flex: 1, padding: '12px' }}>
                                <i className="fas fa-external-link-alt"></i> Apply on Official Site
                            </a>
                        </div>

                        {analysisResult && (
                            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>AI Skill & Experience Report</h4>
                                    <div style={{ background: analysisResult.matchPercentage > 70 ? '#dcfce7' : '#fef9c3', color: analysisResult.matchPercentage > 70 ? '#166534' : '#854d0e', padding: '6px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
                                        {analysisResult.matchPercentage}% Overall Match
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '10px', background: analysisResult.experienceFeedback.includes('Gap') ? '#fff1f2' : '#f0fdf4', border: `1px solid ${analysisResult.experienceFeedback.includes('Gap') ? '#fecaca' : '#bbf7d0'}` }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Experience Check</p>
                                    <p style={{ fontSize: '0.9rem', color: analysisResult.experienceFeedback.includes('Gap') ? '#991b1b' : '#166534', fontWeight: 500 }}>
                                        <i className={`fas ${analysisResult.experienceFeedback.includes('Gap') ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                                        {analysisResult.experienceFeedback}
                                    </p>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Missing Skills</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {analysisResult.missingSkills.length > 0 ?
                                            analysisResult.missingSkills.map(s => <span key={s} style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>{s}</span>) :
                                            <span style={{ color: '#166534', fontSize: '0.9rem', fontWeight: 500 }}><i className="fas fa-check-circle"></i> No missing skills!</span>}
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Recommended Learning</p>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {analysisResult.recommendations.map(rec => (
                                            <div key={rec.skill} style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '12px' }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{rec.skill}</p>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    {rec.resources.map((res, i) => <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}><i className="fas fa-external-link-alt"></i> {res.name}</a>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="detail-section">
                            <h4>Description</h4>
                            <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{selectedJob.description.substring(0, 1500)}...</p>
                        </div>
                        <div className="detail-section">
                            <h4>Qualifications</h4>
                            <p>{selectedJob.qualifications}</p>
                        </div>

                        <button className="ai-match-btn" onClick={handleAIAnalysis} disabled={isAnalyzing}>
                            {isAnalyzing ? <><i className="fas fa-spinner fa-spin"></i> AI Analyzing...</> : <><i className="fas fa-robot"></i> AI Skill Analysis & Recommendations</>}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default JobSection;
