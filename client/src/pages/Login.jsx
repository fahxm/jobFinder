import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useIsMobile from '../hooks/useIsMobile';
import '../styles/Login.css';

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const isMobile = useIsMobile();

    const handleRegisterClick = () => setIsActive(true);
    const handleLoginClick = () => setIsActive(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const result = await signup(name, signupEmail, signupPassword);
            if (result.success) {
                alert("Signup successful! Please sign in.");
                setIsActive(false);
            } else {
                alert("Signup failed: " + result.message);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("An unexpected error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/home');
            } else {
                alert("Login failed: " + result.message);
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("An unexpected error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = () => {
        alert("Social login is currently disabled while migrating to MongoDB. Please use email/password.");
    };

    const handleForgotPassword = () => {
        alert("Forgot password feature is not available right now");
    };

    if (isMobile) {
        return (
            <div className="login-body">
                <div className="mobile-auth-container">
                    {isActive ? (
                        <form onSubmit={handleSignup} className="mobile-form">
                            <h1>Create Account</h1>
                            <span>Register to use all site features</span>
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                            <div className="password-wrapper">
                                <input type={showSignupPassword ? "text" : "password"} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                                <i className="fa fa-eye" onClick={() => setShowSignupPassword(!showSignupPassword)}></i>
                            </div>
                            <div className="password-wrapper">
                                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                <i className="fa fa-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                            </div>
                            {signupPassword !== confirmPassword && confirmPassword && (
                                <p style={{ color: 'red', margin: '5px 0', fontSize: '12px' }}>Passwords do not match</p>
                            )}
                            <div className="checkbox-container" style={{ justifyContent: 'center' }}>
                                <input type="checkbox" id="terms-checkbox-mobile" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                                <label htmlFor="terms-checkbox-mobile">I agree to terms & conditions</label>
                            </div>
                            <button type="submit" disabled={!termsAccepted || loading} className="mobile-submit-btn">{loading ? 'Signing Up...' : 'Sign Up'}</button>
                            <p className="mobile-switch-text">
                                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleLoginClick(); }}>Sign In</a>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="mobile-form">
                            <h1>Sign In</h1>
                            <span>Welcome back! Please sign in.</span>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <div className="password-wrapper">
                                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <i className="fa fa-eye" onClick={() => setShowPassword(!showPassword)}></i>
                            </div>
                            <a href="#" onClick={handleForgotPassword} style={{ margin: '15px 0', display: 'block', textAlign: 'center' }}>Forgot your password?</a>
                            <button type="submit" disabled={loading} className="mobile-submit-btn">{loading ? 'Signing In...' : 'Sign In'}</button>
                            <p className="mobile-switch-text">
                                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleRegisterClick(); }}>Sign Up</a>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="login-body">
            <div className={`auth-container ${isActive ? 'active' : ''}`} id="container">
                {/* SIGN UP */}
                <div className="form-container sign-up">
                    <form onSubmit={handleSignup}>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon google-btn"><i className="fa-brands fa-google"></i></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon facebook-btn"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon github-btn"><i className="fa-brands fa-github"></i></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon microsoft-btn"><i className="fa-brands fa-microsoft"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />

                        <div className="password-wrapper">
                            <input type={showSignupPassword ? "text" : "password"} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                            <i className="fa fa-eye" onClick={() => setShowSignupPassword(!showSignupPassword)}></i>
                        </div>

                        <div className="password-wrapper">
                            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <i className="fa fa-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                        </div>

                        {signupPassword !== confirmPassword && confirmPassword && (
                            <p id="password-warning" style={{ color: 'red', visibility: 'visible', height: 'auto', margin: '5px 0' }}>
                                Passwords do not match
                            </p>
                        )}

                        <div className="checkbox-container">
                            <input type="checkbox" id="terms-checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                            <label htmlFor="terms-checkbox">I agree to all terms & conditions</label>
                        </div>
                        <button type="submit" disabled={!termsAccepted || loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
                    </form>
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in">
                    <form onSubmit={handleLogin}>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon google-btn"><i className="fa-brands fa-google"></i></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon facebook-btn"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon github-btn"><i className="fa-brands fa-github"></i></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialLogin(); }} className="icon microsoft-btn"><i className="fa-brands fa-microsoft"></i></a>
                        </div>
                        <span>or use your email password</span>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <div className="password-wrapper">
                            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <i className="fa fa-eye" onClick={() => setShowPassword(!showPassword)}></i>
                        </div>

                        <a href="#" onClick={handleForgotPassword} style={{ margin: '10px 0' }}>Forgot your password?</a>
                        <button type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                    </form>
                </div>

                {/* TOGGLE */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all site features</p>
                            <button className="hidden" onClick={handleLoginClick} id="login">Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Don't have an Account?</h1>
                            <p>Register with your personal details to use all site features</p>
                            <button className="hidden" onClick={handleRegisterClick} id="register">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
