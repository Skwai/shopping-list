import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const app = initializeApp(config.public.firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);

  return {
    provide: {
      auth,
      analytics,
    },
  };
});
