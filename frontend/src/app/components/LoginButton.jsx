import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

// Guard: check if Google OAuth is configured before the component mounts
const isGoogleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

/**
 * Inner button — only rendered when VITE_GOOGLE_CLIENT_ID is set.
 * Keeps useGoogleLogin() away from any render path where clientId is undefined.
 */
const GoogleLoginButton = () => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                const code = codeResponse.code;
                const result = await googleLogin(code);

                if (result.success) {
                    toast.success('Google login successful!');
                    navigate('/');
                } else {
                    toast.error(result.message || 'Google authentication failed');
                }
            } catch (error) {
                console.error('Google Login Error:', error);
                toast.error('An error occurred during Google Login');
            }
        },
        onError: () => {
            console.error('Login Failed. Please try again.');
            toast.error('Google Login failed. Please try again.');
        },
        flow: 'auth-code',
        scope: 'openid email profile',
    });

    return (
        <button
            onClick={() => login()}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            id="google-signin-button"
            type="button"
        >
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
            />
            Sign in with Google
        </button>
    );
};

/**
 * Public-facing LoginButton wrapper.
 * Renders a disabled placeholder if Google OAuth is not configured,
 * preventing any crash from useGoogleLogin when clientId is undefined.
 */
const LoginButton = () => {
    if (!isGoogleConfigured) {
        return (
            <button
                disabled
                className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed"
                id="google-signin-button-disabled"
                type="button"
                title="Google Sign-In is not configured"
            >
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5 opacity-40"
                />
                Sign in with Google
            </button>
        );
    }

    return (
        <div className="google-login-container">
            <GoogleLoginButton />
        </div>
    );
};

export default LoginButton;
