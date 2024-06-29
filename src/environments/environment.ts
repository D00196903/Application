/**
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 */

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

/**
 * Environment configuration for the development mode.
 */
export const environment = {
  production: false,
  /**
   * Firebase configuration settings.
   */
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyDXOrBOF4cm7w1YkEk3IgHGtbudEFVUCLU",
    authDomain: "sosad-d7f9f.firebaseapp.com",
    databaseURL: "https://sosad-d7f9f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sosad-d7f9f",
    storageBucket: "sosad-d7f9f.appspot.com",
    messagingSenderId: "701803908671",
    appId: "1:701803908671:web:dcbe7268b85d3af12f328a",
    measurementId: "G-K01YLWCEXN",
  },
  /**
   * External API keys.
   */
  keys: {
    googleMaps: "AIzaSyDXOrBOF4cm7w1YkEk3IgHGtbudEFVUCLU",
  },
  /**
   * Firebase encryption secret.
   */
  FIREBASE_ENCRYPTION_SECRET: `-----BEGIN PRIVATE KEY-----
  <PRIVATE_KEY_CONTENTS>
  -----END PRIVATE KEY-----`,
};

// Initialize Firebase with the provided configuration
firebase.initializeApp(environment.FIREBASE_CONFIG);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
