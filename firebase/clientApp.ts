/* eslint-disable */

import { initializeApp, getApps, FirebaseOptions } from "firebase/app"

export const createFirebaseApp = () => {
    const clientCredentials: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    if (getApps().length <= 0) {
        const app = initializeApp(clientCredentials)
        return app
    }
}
