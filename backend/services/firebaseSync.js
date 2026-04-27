const { auth, db, admin } = require('../config/firebase');

const syncUserWithFirebase = async (userData) => {
  try {
    const uid = userData._id?.toString() || userData.id?.toString();
    if (!uid) {
      console.warn('Firebase sync skipped: no user ID');
      return null;
    }

    let userRecord;
    try {
      userRecord = await auth.updateUser(uid, {
        email: userData.email,
        displayName: userData.username || userData.name || '',
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          uid,
          email: userData.email,
          displayName: userData.username || userData.name || '',
        });
      } else {
        throw error;
      }
    }

    await db.collection('users').doc(uid).set({
      username: userData.username || userData.name || '',
      email: userData.email,
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      authMethod: userData.authMethod || 'custom_jwt',
    }, { merge: true });

    return userRecord;
  } catch (error) {
    console.error('Firebase sync error (non-fatal):', error.message);
    return null;
  }
};

const generateFirebaseToken = async (uid) => {
  try {
    const firebaseToken = await auth.createCustomToken(uid);
    return firebaseToken;
  } catch (error) {
    console.error('Firebase token generation error (non-fatal):', error.message);
    return null;
  }
};

module.exports = { syncUserWithFirebase, generateFirebaseToken };
