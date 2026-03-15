import React from 'react';

const Hero = () => {
    return (
        <section id="home" className="hero-section content-section">
            <div className="hero-content">
                <h1>Elevate Your Career with <span className="highlight">AI</span></h1>
                <p>Discover the perfect job and bridge your skill gaps with our AI-driven enhancement system.</p>
                <div className="hero-btns">
                    <a href="#jobs" className="btn-primary">Explore Jobs</a>
                    <a href="/profile" className="btn-secondary">Update Profile</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
