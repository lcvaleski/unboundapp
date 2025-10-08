import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Challenge, CourseContent } from '../types/content.types';

const CACHE_KEY_CHALLENGES = '@content_challenges';
const CACHE_KEY_COURSE = '@content_course';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

export class ContentService {
  static async fetchChallenges(): Promise<Record<number, Challenge>> {
    try {
      const snapshot = await firestore()
        .collection('challenges')
        .where('enabled', '==', true)
        .orderBy('order')
        .get();

      const challenges: Record<number, Challenge> = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data() as Challenge;
        challenges[data.day] = data;
      });

      // Cache for offline use
      await AsyncStorage.setItem(
        CACHE_KEY_CHALLENGES,
        JSON.stringify({
          data: challenges,
          timestamp: Date.now()
        })
      );

      return challenges;
    } catch (error) {
      console.log('Error fetching challenges, trying cache:', error);
      return await this.getCachedChallenges();
    }
  }

  static async getCachedChallenges(): Promise<Record<number, Challenge>> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY_CHALLENGES);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Return cached data even if expired (better than nothing)
        return data;
      }
    } catch (error) {
      console.log('Cache read error:', error);
    }

    // Return default challenges as fallback
    return this.getDefaultChallenges();
  }

  static async fetchCourseContent(): Promise<CourseContent[]> {
    try {
      const snapshot = await firestore()
        .collection('courseContent')
        .where('enabled', '==', true)
        .orderBy('order')
        .get();

      const content = snapshot.docs.map(doc => doc.data() as CourseContent);

      // Cache for offline use
      await AsyncStorage.setItem(
        CACHE_KEY_COURSE,
        JSON.stringify({
          data: content,
          timestamp: Date.now()
        })
      );

      return content;
    } catch (error) {
      console.log('Error fetching course content, trying cache:', error);
      return await this.getCachedCourseContent();
    }
  }

  static async getCachedCourseContent(): Promise<CourseContent[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY_COURSE);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
    } catch (error) {
      console.log('Cache read error:', error);
    }

    // Return default content as fallback
    return [
      { day: 1, title: "Labeling the phone as object", description: "Reframe how you see the phone and the world around you.", enabled: true, order: 1 },
      { day: 2, title: "Bathroom Break", description: "Create your first phone-free space.", enabled: true, order: 2 },
      { day: 3, title: "One Word Check-In", description: "Start to identify how your phone makes you feel.", enabled: true, order: 3 },
    ];
  }

  // Fallback default challenges (same as current hardcoded ones)
  static getDefaultChallenges(): Record<number, Challenge> {
    return {
      1: {
        day: 1,
        title: "Labeling the phone as object",
        description: "Today, you'll learn to see your phone for what it really is",
        enabled: true,
        order: 1,
        finalButtonText: "Start Challenge",
        cards: [
          {
            id: 1,
            type: 'intro',
            title: 'Labeling the phone as object',
            content: "Today, you'll learn to see your phone for what it really is—just an object, not an extension of yourself.",
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
      2: {
        day: 2,
        title: "Bathroom Break",
        description: "Create your first phone-free space",
        enabled: true,
        order: 2,
        finalButtonText: "Let's Do This",
        cards: [
          {
            id: 1,
            type: 'intro',
            title: 'Bathroom Break',
            content: "Our phones feel like extensions of ourselves, which is why it's important to remember what it's like to be physically away from them. Your bathroom is the easiest place to start.",
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
      3: {
        day: 3,
        title: "One Word Check-In",
        description: "Identify emotions driving phone use",
        enabled: true,
        order: 3,
        finalButtonText: "Begin Practice",
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
    };
  }

  // Real-time listener for challenges
  static subscribeToChallenges(callback: (challenges: Record<number, Challenge>) => void) {
    return firestore()
      .collection('challenges')
      .where('enabled', '==', true)
      .onSnapshot(
        snapshot => {
          const challenges: Record<number, Challenge> = {};
          snapshot.docs.forEach(doc => {
            const data = doc.data() as Challenge;
            challenges[data.day] = data;
          });
          callback(challenges);
        },
        error => {
          console.log('Realtime update error:', error);
        }
      );
  }

  // Real-time listener for course content
  static subscribeToCourseContent(callback: (content: CourseContent[]) => void) {
    return firestore()
      .collection('courseContent')
      .where('enabled', '==', true)
      .orderBy('order')
      .onSnapshot(
        snapshot => {
          const content = snapshot.docs.map(doc => doc.data() as CourseContent);
          callback(content);
        },
        error => {
          console.log('Realtime update error:', error);
        }
      );
  }
}