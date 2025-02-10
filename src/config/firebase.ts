import { initializeApp } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-2lLsoIo7ggVCMhmdlA6Uu89FauPuVzY",
    authDomain: "akwaaba-trek-tourism.firebaseapp.com",
    projectId: "akwaaba-trek-tourism",
    storageBucket: "akwaaba-trek-tourism.firebasestorage.app",
    messagingSenderId: "32575931117",
    appId: "1:32575931117:web:e732c88562a271053e02e4",
    measurementId: "G-7PJ2T2QNW4"
};

const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });
export const db = getFirestore(app);
export const storage = getStorage(app);