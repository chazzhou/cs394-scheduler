import {initializeApp} from 'firebase/app';
import {
    getDatabase,
    onValue,
    ref,
    set
} from 'firebase/database';
import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBM6ZSHyGsLW10fPc_JBOUvo9uwPeaJYL0",
    authDomain: "cs394-react-tutorial.firebaseapp.com",
    databaseURL: "https://cs394-react-tutorial-default-rtdb.firebaseio.com",
    projectId: "cs394-react-tutorial",
    storageBucket: "cs394-react-tutorial.appspot.com",
    messagingSenderId: "906362526576",
    appId: "1:906362526576:web:2110eba672813a5f87cdb5"

};

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));
export { firebaseSignOut as signOut };

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
};

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);