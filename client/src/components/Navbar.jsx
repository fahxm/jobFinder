import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useIsMobile from '../hooks/useIsMobile';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const isMobile = useIsMobile();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    if (isMobile) {
        return (
            <nav className="mobile-navbar">
                <div className="mobile-navbar-header">
                    <div className="logo">AI Job Finder</div>
                    <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} color="#1E293B" /> : <Menu size={28} color="#1E293B" />}
                    </button>
                </div>
                
                {isMenuOpen && (
                    <div className="mobile-menu-overlay">
                        <ul className="mobile-nav-links">
                            <li><Link to="/home" onClick={closeMenu} className={location.pathname === '/home' ? 'mobile-nav-link active' : 'mobile-nav-link'}>Home</Link></li>
                            {location.pathname === '/home' ? (
                                <>
                                    <li><a href="#jobs" onClick={closeMenu} className="mobile-nav-link">Jobs</a></li>
                                    <li><a href="#career" onClick={closeMenu} className="mobile-nav-link">Career Path</a></li>
                                    <li><a href="#about" onClick={closeMenu} className="mobile-nav-link">About Us</a></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/home#jobs" onClick={closeMenu} className="mobile-nav-link">Jobs</Link></li>
                                    <li><Link to="/home#career" onClick={closeMenu} className="mobile-nav-link">Career Path</Link></li>
                                </>
                            )}
                            <li><Link to="/resume-builder" onClick={closeMenu} className={location.pathname === '/resume-builder' ? 'mobile-nav-link active' : 'mobile-nav-link'}>Resume Builder</Link></li>
                            <li><Link to="/profile" onClick={closeMenu} className={location.pathname === '/profile' ? 'mobile-nav-link active' : 'mobile-nav-link'}>Profile</Link></li>
                            <li>
                                {currentUser ? (
                                    <button onClick={handleLogout} className="mobile-nav-btn">Logout</button>
                                ) : (
                                    <button onClick={() => { closeMenu(); navigate('/login'); }} className="mobile-nav-btn">Login</button>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        );
    }

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
                <li>
                    {currentUser ? (
                        <button onClick={handleLogout} className="nav-btn" id="logout-btn">Logout</button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="nav-btn" id="login-btn">Login</button>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
