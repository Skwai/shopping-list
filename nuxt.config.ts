// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nuxt-csurf"],
  build: {
    transpile: ["trpc-nuxt"],
  },
  runtimeConfig: {
    firebaseProjectId: "shopping-7f794",
    firebaseClientEmail:
      "firebase-adminsdk-wbkfg@shopping-7f794.iam.gserviceaccount.com",
    // Private key should be injected as an environment variable
    firebasePrivateKey: "",
    public: {
      firebaseConfig: {
        // Paste the firebase client credentials here
        apiKey: "AIzaSyBLujfZ_8078GK4fcT4em0PmvZVj9RhLWw",
        authDomain: "shopping-7f794.firebaseapp.com",
        projectId: "shopping-7f794",
        storageBucket: "shopping-7f794.appspot.com",
        messagingSenderId: "794127887883",
        appId: "1:794127887883:web:8f64bcd69551a81f90a10e",
      },
    },
  },
});
