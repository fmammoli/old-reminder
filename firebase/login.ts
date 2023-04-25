import { auth } from "./clientApp";
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";

const googleAuth = new GoogleAuthProvider();

export default async function login<UserCredential>() {
  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, googleAuth);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
