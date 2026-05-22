// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYT3RAn9LYOnThXFoMH5SDLjLkVKUanaY",
  authDomain: "nwspl-f448a.firebaseapp.com",
  projectId: "nwspl-f448a",
  storageBucket: "nwspl-f448a.firebasestorage.app",
  messagingSenderId: "335261314995",
  appId: "1:335261314995:web:7489a52113e21b6d22a5c6",
  measurementId: "G-TH1T0N3MS3"
};

// Initialize Firebase only if it hasn't been initialized yet to prevent Next.js errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);