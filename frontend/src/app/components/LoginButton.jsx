import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

/**
 * Reusable Google Login Button component.
 * Sends the Google token to the backend for verification.
 */
const LoginButton = () => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const result = await googleLogin(token);
            
            if (result.success) {
                toast.success('Google login successful!');
                navigate('/');
            } else {
                toast.error(result.message || 'Google authentication failed');
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error("An error occurred during Google Login");
        }
    };

    const handleError = () => {
        console.error("Login Failed. Please try again.");
        toast.error("Google Login failed. Please try again.");
    };

    return (
        <div className="google-login-container">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap // Optional: enables Google One Tap
            />
        </div>
    );
};

export default LoginButton;
