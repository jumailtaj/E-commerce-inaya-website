import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

/**
 * Reusable Google Login Button component.
 * Sends the Google auth code to the backend for exchange.
 */
const LoginButton = () => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                // Get the authorization code from the response
                const code = codeResponse.code;
                const result = await googleLogin(code);
                
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
        },
        onError: () => {
            console.error("Login Failed. Please try again.");
            toast.error("Google Login failed. Please try again.");
        },
        flow: 'auth-code',
    });

    return (
        <div className="google-login-container">
            <button 
                onClick={() => login()}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                id="google-signin-button"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
            </button>
        </div>
    );
};

export default LoginButton;

