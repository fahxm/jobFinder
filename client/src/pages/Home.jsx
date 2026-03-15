import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';
import JobSection from '../components/home/JobSection';
import CareerRoadmap from '../components/home/CareerRoadmap';
import About from '../components/home/About';
import AIChatbot from '../components/home/AIChatbot';
import '../styles/Main.css';

const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <JobSection />
            <CareerRoadmap />
            <About />
            <AIChatbot />
        </div>
    );
};

export default Home;
