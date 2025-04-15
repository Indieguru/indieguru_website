// src/config/firebaseAdmin.js

import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import admin from "firebase-admin";

// Parse the service account JSON from an environment variable if stored as a JSON string,
// or import it from a secure location that's not committed to source control.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // You can add other options here if needed
});

export default admin;
