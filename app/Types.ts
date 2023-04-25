import { Timestamp } from "firebase/firestore";
import { StaticImageData } from "next/image";

export type ReminderType = {
  id: string;
  amount: string;
  userUid: string;
  shouldTakeAtString: string;
  theme: string;
  frequency: string;
  dateString: string;
  color: string;
  date: Timestamp;
  shouldTakeAt: Timestamp;
  title: string;
  monthYearString: string;
  yearString: string;
  observations: string;
  checked: boolean;
  icon: StaticImageData;
  createdAt: Timestamp;
  useUntil: string;
  takenAt?: Timestamp | undefined;
};
