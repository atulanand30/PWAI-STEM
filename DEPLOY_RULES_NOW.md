# ⚠️ URGENT: Deploy Firestore Security Rules

You're getting **"Missing or insufficient permissions"** errors because the Firestore security rules haven't been deployed yet.

## Quick Fix (Takes 2 minutes)

### Option 1: Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com/project/pwai-b8b35/firestore/rules
2. Click on the **Rules** tab
3. Copy and paste the entire content from `firestore.rules` file:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection - users can read/write their own user document
       match /users/{userId} {
         allow read: if request.auth != null && request.auth.uid == userId;
         allow create, update: if request.auth != null && request.auth.uid == userId;
         allow delete: if request.auth != null && request.auth.uid == userId;
       }
       
       // UserProgress collection - users can read/write their own progress document
       match /userProgress/{userId} {
         allow read: if request.auth != null && request.auth.uid == userId;
         allow create, update: if request.auth != null && request.auth.uid == userId;
         allow delete: if request.auth != null && request.auth.uid == userId;
       }
       
       // Deny all other access
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
4. Click **Publish**
5. Wait for "Rules published successfully" message
6. **Refresh your app** - the permission errors should be gone!

### Option 2: Firebase CLI

```bash
# If you don't have Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Verify It Worked

After deploying:
1. Open browser console
2. Try marking a video as watched
3. You should see "Video marked as watched" in console
4. No more permission errors!

## If Still Not Working

Check:
- [ ] You're logged in (check if `user` object exists)
- [ ] Rules show as "Published" in Firebase Console
- [ ] You deployed the correct project (`pwai-b8b35`)
- [ ] Clear browser cache and hard refresh (Ctrl+Shift+R)

