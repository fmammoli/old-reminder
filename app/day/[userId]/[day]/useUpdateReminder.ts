import { ReminderType } from "@/app/Types";
import { db } from "@/firebase/clientApp";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";

export function useUpdateReminder(reminder: ReminderType) {
  const remindersRef = collection(db, "reminders");
  const docRef = doc(remindersRef, reminder._id);
  const mutation = useFirestoreDocumentMutation(docRef);
  return mutation;
}
