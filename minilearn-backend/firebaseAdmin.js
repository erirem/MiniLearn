const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Adjust this path as necessary

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Create Firestore reference

module.exports = { admin, db }; // Export both admin and db
