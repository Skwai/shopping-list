import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const config = useRuntimeConfig();

export const app = initializeApp({
  credential: cert({
    projectId: config.firebaseProjectId,
    clientEmail: config.firebaseClientEmail,
    privateKey: config.firebasePrivateKey,
  }),
});

export const decodeSessionCookie = async (session: string) => {
  try {
    const decoded = await getAuth().verifySessionCookie(session);

    return decoded;
  } catch (err) {
    console.error(err);

    return undefined;
  }
};
