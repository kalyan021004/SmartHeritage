const {
  getApps,
  initializeApp,
  cert
} = require("firebase-admin/app");

const {
  getAuth
} = require("firebase-admin/auth");

if (!getApps().length) {
  console.log("Initializing Firebase Admin...");

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });

  console.log("Firebase Admin initialized successfully");
}

const auth = getAuth();

module.exports = {
  auth
};