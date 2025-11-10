import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

let app: FirebaseApp;
let db: Database;

export function getFirebaseApp(): FirebaseApp {
	if (!getApps().length) {
		app = initializeApp({
			apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
			authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
			databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
			projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
			storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
			appId: import.meta.env.VITE_FIREBASE_APP_ID,
		});
	} else if (!app) {
		app = getApps()[0]!;
	}
	return app;
}

export function getFirebaseDatabase(): Database {
	if (!db) {
		const appInstance = getFirebaseApp();
		db = getDatabase(appInstance);
	}
	return db;
}


