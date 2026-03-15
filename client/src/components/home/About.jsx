import React from 'react';

const About = () => {
    return (
        <section id="about" className="content-section">
            <div className="about-container">
                <div className="about-header">
                    <h1>About Us</h1>
                    <p>Empowering careers through Artificial Intelligence.</p>
                </div>
                <div className="about-content">
                    <div className="about-text">
                        <h3>Our Mission</h3>
                        <p>We believe that everyone deserves a fulfilling career. Our mission is to bridge the gap between talent and opportunity by providing AI-driven tools that help users discover their potential, master new skills, and find their dream jobs.</p>
                    </div>
                    <div className="about-features">
                        <div className="feature-item">
                            <i className="fas fa-search"></i>
                            <h4>Smart Job Discovery</h4>
                            <p>Find relevant opportunities worldwide using our real-time search engine.</p>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-chart-line"></i>
                            <h4>Skill Gap Analysis</h4>
                            <p>Identify missing skills and get curated learning resources to bridge them.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
