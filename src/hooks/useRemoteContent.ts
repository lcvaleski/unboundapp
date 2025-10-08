import { useState, useEffect } from 'react';
import { ContentService } from '../services/contentService';
import { Challenge, CourseContent } from '../types/content.types';

export const useRemoteContent = (realTime: boolean = false) => {
  const [challenges, setChallenges] = useState<Record<number, Challenge>>({});
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeChallenges: (() => void) | null = null;
    let unsubscribeCourse: (() => void) | null = null;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (realTime) {
          // Use real-time listeners
          unsubscribeChallenges = ContentService.subscribeToChallenges(setChallenges);
          unsubscribeCourse = ContentService.subscribeToCourseContent(setCourseContent);
        } else {
          // Fetch once
          const [challengesData, courseData] = await Promise.all([
            ContentService.fetchChallenges(),
            ContentService.fetchCourseContent()
          ]);

          setChallenges(challengesData);
          setCourseContent(courseData);
        }
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content');

        // Load defaults on error
        setChallenges(ContentService.getDefaultChallenges());
        setCourseContent(await ContentService.getCachedCourseContent());
      } finally {
        setLoading(false);
      }
    };

    loadContent();

    // Cleanup
    return () => {
      if (unsubscribeChallenges) unsubscribeChallenges();
      if (unsubscribeCourse) unsubscribeCourse();
    };
  }, [realTime]);

  return {
    challenges,
    courseContent,
    loading,
    error,
    refreshContent: async () => {
      setLoading(true);
      try {
        const [challengesData, courseData] = await Promise.all([
          ContentService.fetchChallenges(),
          ContentService.fetchCourseContent()
        ]);
        setChallenges(challengesData);
        setCourseContent(courseData);
        setError(null);
      } catch (err) {
        setError('Failed to refresh content');
      } finally {
        setLoading(false);
      }
    }
  };
};