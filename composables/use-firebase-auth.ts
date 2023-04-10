import {
  GoogleAuthProvider,
  User,
  Auth,
  signInWithPopup,
  signInWithEmailAndPassword,
  getAuth,
  inMemoryPersistence,
} from "firebase/auth";

const googleAuthProvider = new GoogleAuthProvider();

let firebaseAuth: Auth;

const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    firebaseAuth = getAuth();

    // Disable session persistence as we'll use session cookies to manage sessions
    // https://firebase.google.com/docs/auth/admin/manage-cookies
    firebaseAuth.setPersistence(inMemoryPersistence);
  }

  return firebaseAuth;
};

export const useFirebaseAuth = () => {
  const { createSession } = useSession();

  const currentUser = ref<User>();

  const loginWithEmail = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password
    );

    if (user) {
      await createSession(user);
    }

    currentUser.value = user;

    return user;
  };

  const loginWithGoogle = async () => {
    const { createSession } = useSession();

    // Force Google to ask which account to use
    googleAuthProvider.setCustomParameters({
      prompt: "select_account",
    });

    const { user } = await signInWithPopup(
      getFirebaseAuth(),
      googleAuthProvider
    );

    if (user) {
      await createSession(user);
    }

    currentUser.value = user;

    return user;
  };

  return {
    loginWithGoogle,
    loginWithEmail,
  };
};
