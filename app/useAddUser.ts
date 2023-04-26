import { db } from "@/firebase/clientApp";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";

export function useAddUser(user: any) {
  const usersRef = collection(db, "users");
  const docRef = doc(usersRef, user.uid);
  const mutation = useFirestoreDocumentMutation(docRef);
  return mutation;
}
