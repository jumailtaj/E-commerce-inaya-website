import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

/**
 * Reusable Google Login Button component.
 * Decodes user info and logs it to console.
 */
const LoginButton = () => {
    const handleSuccess = (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const decoded = jwtDecode(token);
            
            console.log("Login Success! User Data:", {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                sub: decoded.sub // The user's unique Google ID
            });
            
            // You can now store this data in your app state or send it to your backend.
            alert(`Welcome, ${decoded.name}! Check the console for your details.`);
        } catch (error) {
            console.error("Failed to decode JWT:", error);
        }
    };

    const handleError = () => {
        console.error("Login Failed. Please try again.");
        alert("Google Login failed. Check your network or console for details.");
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
