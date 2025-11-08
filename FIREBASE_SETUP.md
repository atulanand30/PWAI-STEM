# Firebase Setup Instructions

## Setting up Firestore Security Rules

You need to deploy these security rules to your Firebase project. You can do this in two ways:

### Option 1: Using Firebase Console (Recommended for beginners)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pwai-b8b35`
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste it into the rules editor
6. Click **Publish**

### Option 2: Using Firebase CLI

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your existing project
   - Use the existing `firestore.rules` file

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Security Rules Explanation

The rules ensure:
- ✅ Users can only read/write their own documents in `users` collection
- ✅ Users can only read/write their own documents in `userProgress` collection
- ✅ All other collections are denied by default
- ✅ Only authenticated users can access these resources

## Testing the Rules

After deploying, test your rules:
1. Try marking a video as watched - it should work if you're logged in
2. Try accessing another user's progress - it should be denied
3. Check browser console for any permission errors

## Troubleshooting

If you see permission errors:
1. Verify you're logged in (check `user` object in AuthContext)
2. Check Firebase Console → Firestore → Rules to ensure rules are published
3. Verify the user ID matches the document ID in Firestore
4. Check browser console for specific error messages





