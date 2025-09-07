import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Progress tracking service
export class ProgressService {
  // Mark a lesson as completed
  static async markLessonCompleted(userId, subject, lessonId) {
    try {
      const progressRef = doc(db, 'userProgress', userId);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        // Update existing progress
        await updateDoc(progressRef, {
          [`${subject}.${lessonId}`]: {
            completed: true,
            completedAt: new Date().toISOString(),
            videoWatched: true
          }
        });
      } else {
        // Create new progress document
        await setDoc(progressRef, {
          [`${subject}.${lessonId}`]: {
            completed: true,
            completedAt: new Date().toISOString(),
            videoWatched: true
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      return false;
    }
  }

  // Mark a video as watched
  static async markVideoWatched(userId, subject, lessonId) {
    try {
      const progressRef = doc(db, 'userProgress', userId);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        await updateDoc(progressRef, {
          [`${subject}.${lessonId}.videoWatched`]: true,
          [`${subject}.${lessonId}.videoWatchedAt`]: new Date().toISOString()
        });
      } else {
        await setDoc(progressRef, {
          [`${subject}.${lessonId}`]: {
            videoWatched: true,
            videoWatchedAt: new Date().toISOString(),
            completed: false
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error marking video as watched:', error);
      return false;
    }
  }

  // Get user progress
  static async getUserProgress(userId) {
    try {
      const progressRef = doc(db, 'userProgress', userId);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        return progressDoc.data();
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {};
    }
  }

  // Get progress statistics
  static async getProgressStats(userId) {
    try {
      const progress = await this.getUserProgress(userId);
      const subjects = ['science', 'math', 'technology', 'engineering'];
      const lessonsPerSubject = 3; // Introduction, Basic, Advanced
      
      const stats = {
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
          const lessonKey = `${subject}.${lessonId}`;
          const lessonData = progress[lessonKey];
          
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
      const progress = await this.getUserProgress(userId);
      const lessonKey = `${subject}.${lessonId}`;
      return progress[lessonKey]?.completed || false;
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  }

  // Check if video is watched
  static async isVideoWatched(userId, subject, lessonId) {
    try {
      const progress = await this.getUserProgress(userId);
      const lessonKey = `${subject}.${lessonId}`;
      return progress[lessonKey]?.videoWatched || false;
    } catch (error) {
      console.error('Error checking video watch status:', error);
      return false;
    }
  }
}
