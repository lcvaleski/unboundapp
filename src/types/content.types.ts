export interface ChallengeCard {
  id: number;
  type: string; // Now accepts any string value for custom screen types
  title?: string;
  content: string;
  buttonText?: string;
  imageUrl?: string;
}

export interface NotificationMessage {
  time: 'morning' | 'afternoon' | 'evening';
  hour: number; // 24-hour format (e.g., 9 for 9am, 14 for 2pm)
  title: string;
  body: string;
}

export interface Challenge {
  day: number;
  title: string;
  description: string;
  cards: ChallengeCard[];
  finalButtonText?: string; // Configurable final button text
  notifications?: NotificationMessage[]; // Remote-configured notifications
  enabled: boolean;
  order: number;
}

export interface CourseContent {
  day: number;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
}