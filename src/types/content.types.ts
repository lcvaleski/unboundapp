export interface ChallengeCard {
  id: number;
  type: string; // Now accepts any string value for custom screen types
  title?: string;
  content: string;
  buttonText?: string;
  imageUrl?: string;
}

export interface Challenge {
  day: number;
  title: string;
  description: string;
  cards: ChallengeCard[];
  finalButtonText?: string; // Configurable final button text
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