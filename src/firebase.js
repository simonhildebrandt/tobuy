import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";

import {
  getAuth,
  sendSignInLinkToEmail,
  connectAuthEmulator,
  onAuthStateChanged,
  signOut,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithCustomToken
} from "firebase/auth";


import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  collection,
  query,
  where,
  onSnapshot,
  connectFirestoreEmulator,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCSBsPgEqbzmaRjiR1g3PnF2Y44dJR4N3c",
  authDomain: "tobuy-25763.firebaseapp.com",
  projectId: "tobuy-25763",
  storageBucket: "tobuy-25763.appspot.com",
  messagingSenderId: "367809954932",
  appId: "1:367809954932:web:ce812977c9752b02a2fd21"
};

import { navigate } from './router';


// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});
// const db = getFirestore(app);


export const host = SITE_URL ? SITE_URL : "http://127.0.0.1:9000" ;

if (!SITE_URL) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
}


function withUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, userData => {
      if (userData) {
        // const uid = user.uid;
        console.log("We got a user!", userData);
        setUser(userData);
      } else {
        console.log("We're userless")
        setUser(false);
      }
    });

    return unsub;
  }, [])

  return user;
}

function sendSignInLink(email) {
  console.log(`return to host ${host}/login`);
  const actionCodeSettings = {
    url: host + '/login?next=/last-list',
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    console.log("sent!")
    window.localStorage.setItem('emailForSignIn', email);
  })
  .catch(err => console.error(err))
}

async function handleSigninLink() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    console.log("signin link!")

    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }

    signInWithEmailLink(auth, email, window.location.href)
    .then(async (result) => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      console.log("logged in!", result)

      await setupUser(result.user)
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
      console.error("failed login", error)
    })
    .finally(() => {
      navigate("/");
    });
  } else {
    console.log("not sign in link")
  }

}


export const objectFromDocs = snapshot => {
  const hash = {};
  snapshot.docs.map(doc => hash[doc.id] = doc.data());
  return hash;
}

function useFirestoreCollection(path, clauses = null) {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const col = collection(db, path);

    let q = query(
      col,
      ...(clauses ? clauses.map(clause => where(...clause)) : [])
    );

    const unsub = onSnapshot(q, querySnapshot => {
      setData(objectFromDocs(querySnapshot));
      setLoaded(true);
    });

    return () => { unsub() };
  }, [path]);

  return { data, loaded };
}

function useFirestoreDocument(path) {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, path), snapshot => {
      setData(snapshot.data());
      setLoaded(true);
    });

    return () => { unsub() };
  }, [path]);

  return { data, loaded };
}

function setupUser({uid, email}) {
  return setDoc(doc(db, 'users', uid), { email })
  .then(res => console.log('created!', res))
}

function addRecord(path, data) {
  console.log({path, data})
  return addDoc(collection(db, path), data)
}

function logout() {
  navigate("/");
  signOut(auth);
}

function updateRecord(path, data) {
  updateDoc(doc(db, path), data);
}

function deleteRecord(path) {
  deleteDoc(doc(db, path));
}

function batchUpdate(updates) {
  const batch = writeBatch(db);
  updates.forEach(([ref, u]) => batch.update(doc(db, ref), u))
  batch.commit();
}


export {
  logout,
  sendSignInLink,
  handleSigninLink,
  withUser,
  addRecord,
  updateRecord,
  deleteRecord,
  useFirestoreCollection,
  useFirestoreDocument,
  batchUpdate
}
