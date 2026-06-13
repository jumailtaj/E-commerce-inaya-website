const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { syncUserWithFirebase, generateFirebaseToken } = require('../services/firebaseSync');


// Generate JWT
const generateToken = (id) => {
  const SECRET = process.env.JWT_SECRET || "inaya_jwt_fallback_secret_2024";
  return jwt.sign({ id }, SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);
    const name = req.body.name;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with role based on secret key
    const role = (process.env.ADMIN_SECRET && req.body.adminSecret === process.env.ADMIN_SECRET) ? 'admin' : 'user';
    console.log(`User ${email} registering with role: ${role}`);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    if (user) {
      await syncUserWithFirebase({ ...user.toObject(), authMethod: 'custom_jwt' });
      const firebaseToken = await generateFirebaseToken(user._id.toString());
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        firebaseToken: firebaseToken || null
      });
    } else {

      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    // Check for user email
    const user = await User.findOne({ email });

    let isMatch = false;
    if (user) {
      const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

      if (isHashed) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        isMatch = password === user.password;
        if (isMatch) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
        }
      }
    }

    console.log("[LOGIN ATTEMPT]", email);
    console.log("[PASSWORD LENGTH]", password.length);
    console.log("[USER FOUND]", !!user);
    console.log("[PASSWORD MATCH]", isMatch);
    console.log("[ROLE]", user?.role);

    if (user && isMatch) {
      await syncUserWithFirebase({ ...user.toObject(), authMethod: 'custom_jwt' });
      const firebaseToken = await generateFirebaseToken(user._id.toString());
      return res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        firebaseToken: firebaseToken || null
      });
    }


    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const { OAuth2Client } = require('google-auth-library');

// @desc    Authenticate with Google
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = async (req, res) => {
  const { token: code } = req.body; 

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing' });
  }

  // Ensure dotenv is refreshed in serverless environments
  if (!process.env.GOOGLE_CLIENT_ID && !process.env.VITE_GOOGLE_CLIENT_ID) {
    require('dotenv').config();
  }

  // Flexible key detection: support both standard and VITE_ prefixed names
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.VITE_GOOGLE_CLIENT_SECRET;

  // Diagnostic logging (does not leak secrets)
  console.log('[Auth] Checking Google Config:', {
    hasId: !!GOOGLE_CLIENT_ID,
    idLength: GOOGLE_CLIENT_ID?.length || 0,
    hasSecret: !!GOOGLE_CLIENT_SECRET,
    secretLength: GOOGLE_CLIENT_SECRET?.length || 0
  });

  // Pre-flight check
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('[Auth] Configuration Error: Google credentials are missing from environment.');
    return res.status(503).json({ 
      message: 'Google login is not configured on this server. Please contact support.' 
    });
  }

  // Use a fresh client instance per request to avoid state corruption
  const client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
  );

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: 'postmessage'
    });
    
    if (!tokens.id_token) {
      console.error('Exchange successful but no id_token returned. Scopes might be missing.');
      return res.status(401).json({ message: 'Google did not return an ID token. Please try again.' });
    }

    // Verify the ID token to get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let isNewUser = false;
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      isNewUser = true;
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(googleId + (process.env.JWT_SECRET || 'google_fallback'), 10), // Dummy password
        role: 'user',
        isGoogleUser: true,
      });
    }

    await syncUserWithFirebase({ ...user.toObject(), authMethod: 'google_oauth' });
    const firebaseToken = await generateFirebaseToken(user._id.toString());

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      firebaseToken: firebaseToken || null,
      isNewUser
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    
    // Return more specific error message if available
    const errorMsg = error.response?.data?.error_description || error.message || 'Invalid Google token';
    res.status(401).json({ message: errorMsg });
  }
};

// @desc    Get user data
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  signup,
  login,
  googleLogin,
  getMe,
};
