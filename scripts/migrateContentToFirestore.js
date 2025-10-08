// Migration script to populate Firestore with initial content
// Run this script once to set up your Firebase content

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Challenge content to migrate
const challenges = [
  {
    day: 1,
    title: "Labeling the phone as object",
    description: "Today, you'll learn to see your phone for what it really is—just an object, not an extension of yourself.",
    enabled: true,
    order: 1,
    finalButtonText: "Start Challenge", // Customizable!
    cards: [
      {
        id: 1,
        type: 'intro',
        title: 'Labeling the phone as object',
        content: "Today, you'll learn to see your phone for what it really is—just an object, not an extension of yourself.",
        // imageUrl: "https://your-cdn.com/images/day1-objects.png", // Optional: host images on CDN
      },
      {
        id: 2,
        type: 'instruction',
        title: 'How it works',
        content: "Throughout the day, we'll send you gentle reminders to notice your phone as a physical object. When you pick it up, feel its weight. Notice its edges. See it as a tool, not a companion.",
      },
      {
        id: 3,
        type: 'notification',
        title: 'Reminders',
        content: "We'll send you 3-4 mindful moments today. Each one takes just 10 seconds—a brief pause to recenter.",
        buttonText: 'Enable Reminders',
      },
      {
        id: 4,
        type: 'why',
        title: 'Why this works',
        content: 'When we label our phones as objects, we break the emotional attachment. Research shows that creating cognitive distance from our devices reduces compulsive checking by up to 40%.',
      },
    ],
  },
  {
    day: 2,
    title: "Bathroom Break",
    description: "Create your first phone-free space.",
    enabled: true,
    order: 2,
    finalButtonText: "Let's Do This", // Custom button text!
    cards: [
      {
        id: 1,
        type: 'intro',
        title: 'Bathroom Break',
        content: "Our phones feel like extensions of ourselves, which is why it's important to remember what it's like to be physically away from them. Your bathroom is the easiest place to start.",
        // imageUrl: "https://your-cdn.com/images/day2-bathroom.png",
      },
      {
        id: 2,
        type: 'instruction',
        title: 'How it works',
        content: "Today, make an effort to leave your phone outside of the door every time you enter your bathroom. If you forget, don't beat yourself up, just try to remember for next time. We'll send you some reminders throughout the day.",
      },
      {
        id: 3,
        type: 'notification',
        title: 'Reminders',
        content: "We'll remind you throughout the day to leave your phone outside when using the bathroom.",
        buttonText: 'Enable Reminders',
      },
      {
        id: 4,
        type: 'why',
        title: 'Why this works',
        content: "When you pair your phone with routine habits, it strengthens compulsive & mindless use. By making your bathroom a phone-free space, you'll start to gain insight into this pattern—the first step to breaking it.",
      },
    ],
  },
  {
    day: 3,
    title: "One Word Check-In",
    description: "Start to identify how your phone makes you feel.",
    enabled: true,
    order: 3,
    finalButtonText: "Begin Practice", // Another custom button!
    cards: [
      {
        id: 1,
        type: 'intro',
        title: 'One Word Check-In',
        content: "Today, you'll begin your journey by identifying the emotions that drive compulsive phone use.",
      },
      {
        id: 2,
        type: 'instruction',
        title: 'How it works',
        content: "When you pick up your phone throughout the day, try saying one word out loud to describe your emotional state before you begin using it. Don't force it; just do it whenever you remember to.",
      },
      {
        id: 3,
        type: 'instruction',
        title: 'Example',
        content: "If you're bored during work, for example, and find yourself opening Instagram, simply say \"bored\" out loud. You can also try doing it while already using your phone, or after you lock it—whatever feels most natural.",
      },
      {
        id: 4,
        type: 'why',
        title: 'Why this works',
        content: "Most of the time, you check your phone automatically, without noticing the emotions driving the behavior. By naming a feeling out loud, even once a day, you build what's called affect labeling, a proven technique that increases self-awareness and reduces compulsive patterns.",
      },
    ],
  },
];

// Course content to migrate
const courseContent = [
  {
    day: 1,
    title: "Labeling the phone as object",
    description: "Reframe how you see the phone and the world around you.",
    enabled: true,
    order: 1
  },
  {
    day: 2,
    title: "Bathroom Break",
    description: "Create your first phone-free space.",
    enabled: true,
    order: 2
  },
  {
    day: 3,
    title: "One Word Check-In",
    description: "Start to identify how your phone makes you feel.",
    enabled: true,
    order: 3
  },
  // Add more days as needed...
];

async function migrateContent() {
  try {
    console.log('Starting content migration...');

    // Migrate challenges
    console.log('\nMigrating challenges...');
    for (const challenge of challenges) {
      const docRef = db.collection('challenges').doc(`day${challenge.day}`);
      await docRef.set(challenge);
      console.log(`✓ Migrated Day ${challenge.day}: ${challenge.title}`);
    }

    // Migrate course content
    console.log('\nMigrating course content...');
    for (const content of courseContent) {
      const docRef = db.collection('courseContent').doc(`day${content.day}`);
      await docRef.set(content);
      console.log(`✓ Migrated course content Day ${content.day}: ${content.title}`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nYour copywriter can now:');
    console.log('1. Edit content directly in Firebase Console');
    console.log('2. Change finalButtonText for each challenge (e.g., "Let\'s Do This")');
    console.log('3. Enable/disable challenges with the enabled flag');
    console.log('4. Reorder content with the order field');
    console.log('5. Add new challenge days following the same structure');

  } catch (error) {
    console.error('Migration failed:', error);
  }

  process.exit();
}

// Run the migration
migrateContent();