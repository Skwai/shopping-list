import { User } from "firebase/auth";

export const useSession = () => {
  const { clearUser, setUser } = useCurrentUser();

  const sessionCookie = useCookie("session", {
    maxAge: 14 * 24 * 60 * 60 * 1000,
  });

  const sessionToken = useState("session", () => sessionCookie.value);

  const setToken = (token: string) => {
    sessionCookie.value = token;
    sessionToken.value = token;
  };

  const clearToken = () => {
    sessionToken.value = null;
    sessionCookie.value = null;
  };

  const createSession = async (firebaseUser: User) => {
    const idToken = await firebaseUser.getIdToken();

    const { token, user } = await useTrpc().sessions.createSession.mutate({
      idToken,
    });

    setToken(token);
    setUser(user);
  };

  const authenticated = computed(() => {
    return !!sessionToken.value;
  });

  const destroySession = () => {
    clearToken();
    clearUser();
  };

  return {
    sessionCookie,
    authenticated,
    createSession,
    destroySession,
  };
};
