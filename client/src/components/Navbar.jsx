import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">AI Job Finder</div>
            <ul className="nav-links">
                <li><Link to="/home" className={location.pathname === '/home' ? 'nav-link active' : 'nav-link'}>Home</Link></li>
                {/* Anchor links on Home page might need handling if not on home page */}
                {location.pathname === '/home' ? (
                    <>
                        <li><a href="#jobs" className="nav-link">Jobs</a></li>
                        <li><a href="#career" className="nav-link">Career Path</a></li>
                        <li><a href="#about" className="nav-link">About Us</a></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/home#jobs" className="nav-link">Jobs</Link></li>
                        <li><Link to="/home#career" className="nav-link">Career Path</Link></li>
                    </>
                )}
                <li><Link to="/resume-builder" className={location.pathname === '/resume-builder' ? 'nav-link active' : 'nav-link'}>Resume Builder</Link></li>
                <li><Link to="/profile" className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}>Profile</Link></li>
                <li><button onClick={handleLogout} className="nav-btn" id="logout-btn">Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
