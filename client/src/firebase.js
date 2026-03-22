    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import {getAuth, GoogleAuthProvider } from "firebase/auth"
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "genwebai-47e85.firebaseapp.com",
    projectId: "genwebai-47e85",
    storageBucket: "genwebai-47e85.firebasestorage.app",
    messagingSenderId: "1559568549",
    appId: "1:1559568549:web:9729568a25d7f3b5956d4c"
    };

    console.log(import.meta.env.VITE_FIREBASE_API_KEY)
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app)


    const provider = new GoogleAuthProvider()

    export {auth , provider}