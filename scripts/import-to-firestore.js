const admin = require('firebase-admin');
const fs = require('fs');

// IMPORTANT: Download your service account key from:
// Firebase Console → Project Settings → Service Accounts → Generate New Private Key
// Save it as 'service-account-key.json' in this scripts folder

const serviceAccount = require('./service-account-key.json');
const data = require('./firestore-import.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importData() {
  try {
    // Import challenges
    for (const [docId, docData] of Object.entries(data.challenges)) {
      await db.collection('challenges').doc(docId).set(docData);
      console.log(`✓ Imported challenge: ${docId}`);
    }

    // Import courseContent
    for (const [docId, docData] of Object.entries(data.courseContent)) {
      await db.collection('courseContent').doc(docId).set(docData);
      console.log(`✓ Imported course content: ${docId}`);
    }

    console.log('\n✅ All data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
  process.exit();
}

importData();