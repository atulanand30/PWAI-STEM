import { db } from './firebase';
import { doc, setDoc, getDoc} from 'firebase/firestore';

// Progress tracking service
export class ProgressService {
  static COLLECTION_NAME = 'userProgress';
  
  static async initializeUserProgress(userId) {
    try {
      if (!userId) {
        console.error('User ID is required to initialize progress');
        return false;
      }
      
      const progressRef = doc(db, this.COLLECTION_NAME, userId);
      const progressDoc = await getDoc(progressRef);
      
      if (!progressDoc.exists()) {
        const initialData = {
          userId: userId, // Explicitly store userId in the document
          science: {},
          math: {},
          technology: {},
          engineering: {},
          initialized: true,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        await setDoc(progressRef, initialData);
        console.log(`Initialized user progress document for user: ${userId}`);
        return true;
      } else {
        // Ensure existing documents also have userId (for migration)
        const existingData = progressDoc.data();
        if (!existingData.userId) {
          await setDoc(progressRef, { ...existingData, userId: userId }, { merge: true });
          console.log(`Updated existing progress document with userId: ${userId}`);
        }
      }
      return true;
    } catch (error) {
      console.error('Error initializing user progress:', error);
      return false;
    }
  }
  // Mark a lesson as completed
  static async markLessonCompleted(userId, subject, lessonId) {
    try {
      if (!userId) {
        console.error('User ID is required');
        return false;
      }
      
      // First ensure user progress document exists
      await this.initializeUserProgress(userId);
      
      const normalizedSubject = subject.toLowerCase();
      const progressRef = doc(db, this.COLLECTION_NAME, userId);
      
      // Get current document
      const progressDoc = await getDoc(progressRef);
      const currentData = progressDoc.exists() ? progressDoc.data() : {};
      
      // Ensure userId is always in the document
      if (!currentData.userId) {
        currentData.userId = userId;
      }
      
      // Ensure subject structure exists
      if (!currentData[normalizedSubject]) {
        currentData[normalizedSubject] = {};
      }
      
      // Merge lesson data (preserve existing fields like videoWatched if already set)
      currentData[normalizedSubject][lessonId] = {
        ...(currentData[normalizedSubject][lessonId] || {}),
        completed: true,
        completedAt: new Date().toISOString(),
        videoWatched: true,
        lastUpdated: new Date().toISOString()
      };
      
      // Always update userId and lastUpdated timestamp
      currentData.userId = userId;
      currentData.lastUpdated = new Date().toISOString();
      
      // Update the document using setDoc with merge to avoid overwriting unrelated fields
      await setDoc(progressRef, currentData, { merge: true });
      
      console.log(`Lesson marked as completed for ${normalizedSubject} lesson ${lessonId}`);
      console.log('Updated data:', currentData[normalizedSubject][lessonId]);
      console.log('User ID:', userId);
      
      return true;
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('User ID:', userId);
      
      // Check if it's a permission error
      if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED') {
        console.error('⚠️ Permission denied. Make sure Firestore security rules are deployed.');
        console.error('See FIREBASE_SETUP.md for instructions.');
      }
      
      return false;
    }
  }

  // Mark a video as watched
  static async markVideoWatched(userId, subject, lessonId) {
    try {
      if (!userId) {
        console.error('User ID is required');
        return false;
      }
      
      // First ensure user progress document exists
      await this.initializeUserProgress(userId);
      
      const normalizedSubject = subject.toLowerCase();
      const progressRef = doc(db, this.COLLECTION_NAME, userId);
      
      // Get current document
      const progressDoc = await getDoc(progressRef);
      const currentData = progressDoc.exists() ? progressDoc.data() : {};
      
      // Ensure userId is always in the document
      if (!currentData.userId) {
        currentData.userId = userId;
      }
      
      // Ensure subject structure exists
      if (!currentData[normalizedSubject]) {
        currentData[normalizedSubject] = {};
      }
      
      // Merge lesson data (preserve existing fields like completed if already set)
      currentData[normalizedSubject][lessonId] = {
        ...(currentData[normalizedSubject][lessonId] || {}),
        videoWatched: true,
        videoWatchedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Always update userId and lastUpdated timestamp
      currentData.userId = userId;
      currentData.lastUpdated = new Date().toISOString();
      
      // Update the document using merge to preserve existing fields
      await setDoc(progressRef, currentData, { merge: true });
      
      console.log(`Video marked as watched for ${normalizedSubject} lesson ${lessonId}`);
      console.log('Updated data:', currentData[normalizedSubject][lessonId]);
      console.log('User ID:', userId);
      
      // Consider the operation successful if no error is thrown
      return true;
    } catch (error) {
      console.error('Error marking video as watched:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('User ID:', userId);
      
      // Check if it's a permission error
      if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED') {
        console.error('⚠️ Permission denied. Make sure Firestore security rules are deployed.');
        console.error('See FIREBASE_SETUP.md for instructions.');
      }
      
      return false;
    }
  }

  // Get user progress
  static async getUserProgress(userId) {
    try {
      if (!userId) {
        console.error('User ID is required to get progress');
        throw new Error('User ID is required');
      }
      
      // Initialize if needed
      await this.initializeUserProgress(userId);
      
      const progressRef = doc(db, this.COLLECTION_NAME, userId);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const data = progressDoc.data();
        
        // Validate that the document belongs to the requested user
        if (data.userId && data.userId !== userId) {
          console.error(`User ID mismatch! Document userId: ${data.userId}, requested: ${userId}`);
          throw new Error('Progress document belongs to a different user');
        }
        
        // Ensure userId is in the returned data
        const progressData = { ...data, userId: userId };
        console.log(`Retrieved user progress for user: ${userId}`, progressData);
        return progressData;
      } else {
        console.log(`No progress document found for user: ${userId}`);
        return { userId: userId };
      }
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error; // Propagate error to handle it in the component
    }
  }

  // Get progress statistics
  static async getProgressStats(userId) {
    try {
      if (!userId) {
        console.error('User ID is required to get progress stats');
        throw new Error('User ID is required');
      }
      
      const progress = await this.getUserProgress(userId);
      
      // Validate userId in progress data
      if (progress.userId && progress.userId !== userId) {
        console.error(`User ID mismatch in progress stats! Expected: ${userId}, Got: ${progress.userId}`);
        throw new Error('Progress data does not match requested user');
      }
      
      // Ensure subjects match the normalized case in storage
      const subjects = ['science', 'math', 'technology', 'engineering'];
      const lessonsPerSubject = 3; // Introduction, Basic, Advanced
      
      console.log(`Current progress for user ${userId}:`, progress); // Debug logging
      
      const stats = {
        userId: userId, // Include userId in stats for clarity
        totalLessons: subjects.length * lessonsPerSubject,
        completedLessons: 0,
        videosWatched: 0,
        subjectProgress: {},
        overallProgress: 0
      };

      subjects.forEach(subject => {
        stats.subjectProgress[subject] = {
          completed: 0,
          videosWatched: 0,
          total: lessonsPerSubject,
          progress: 0
        };

        for (let lessonId = 1; lessonId <= lessonsPerSubject; lessonId++) {
          // Access nested structure: progress[subject][lessonId]
          const subjectData = progress[subject];
          const lessonData = subjectData && subjectData[lessonId] ? subjectData[lessonId] : null;
          
          if (lessonData) {
            if (lessonData.completed) {
              stats.completedLessons++;
              stats.subjectProgress[subject].completed++;
            }
            if (lessonData.videoWatched) {
              stats.videosWatched++;
              stats.subjectProgress[subject].videosWatched++;
            }
          }
        }

        // Calculate subject progress percentage
        stats.subjectProgress[subject].progress = 
          Math.round((stats.subjectProgress[subject].completed / lessonsPerSubject) * 100);
      });

      // Calculate overall progress
      stats.overallProgress = Math.round((stats.completedLessons / stats.totalLessons) * 100);

      return stats;
    } catch (error) {
      console.error('Error getting progress stats:', error);
      return {
        totalLessons: 12,
        completedLessons: 0,
        videosWatched: 0,
        subjectProgress: {},
        overallProgress: 0
      };
    }
  }

  // Check if lesson is completed
  static async isLessonCompleted(userId, subject, lessonId) {
    try {
      if (!userId) {
        console.error('User ID is required to check lesson completion');
        return false;
      }
      
      const progress = await this.getUserProgress(userId);
      
      // Validate userId
      if (progress.userId && progress.userId !== userId) {
        console.error(`User ID mismatch! Expected: ${userId}, Got: ${progress.userId}`);
        return false;
      }
      
      const normalizedSubject = subject.toLowerCase();

      // Check if the data exists in the correct structure
      const subjectData = progress[normalizedSubject];
      if (!subjectData) {
        console.log(`No data found for subject: ${normalizedSubject} for user: ${userId}`);
        return false;
      }

      const lessonData = subjectData[lessonId];
      if (!lessonData) {
        console.log(`No data found for lesson: ${lessonId} in subject: ${normalizedSubject} for user: ${userId}`);
        return false;
      }

      const isCompleted = lessonData.completed || false;
      console.log(`Lesson completion status for user ${userId}, ${normalizedSubject}/${lessonId}: ${isCompleted}`);
      return isCompleted;
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  }

  // Check if video is watched
  static async isVideoWatched(userId, subject, lessonId) {
    try {
      if (!userId) {
        console.error('User ID is required to check video watch status');
        return false;
      }
      
      const progress = await this.getUserProgress(userId);
      
      // Validate userId
      if (progress.userId && progress.userId !== userId) {
        console.error(`User ID mismatch! Expected: ${userId}, Got: ${progress.userId}`);
        return false;
      }
      
      const normalizedSubject = subject.toLowerCase();
      
      // Check if the data exists in the correct structure
      const subjectData = progress[normalizedSubject];
      if (!subjectData) {
        console.log(`No data found for subject: ${normalizedSubject} for user: ${userId}`);
        return false;
      }

      const lessonData = subjectData[lessonId];
      if (!lessonData) {
        console.log(`No data found for lesson: ${lessonId} in subject: ${normalizedSubject} for user: ${userId}`);
        return false;
      }

      const isWatched = lessonData.videoWatched || false;
      console.log(`Video watched status for user ${userId}, ${normalizedSubject}/${lessonId}: ${isWatched}`);
      return isWatched;
    } catch (error) {
      console.error('Error checking video watch status:', error);
      return false;
    }
  }
}
