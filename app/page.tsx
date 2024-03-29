"use client";

import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import icon from "/public/images/capsule.png";
import PillIcon from "/public/images/icons8-pill-100.png";
import PillsIcon from "/public/images/icons8-pills-100.png";
import MdmaIcon from "/public/images/icons8-mdma-100.png";
import BandageIcon from "/public/images/icons8-bandage-100.png";
import PillIcon3 from "/public/images/icons8-pill-64.png";
import PillsIcon2 from "/public/images/icons8-pills-64.png";
import PillsIcon4 from "/public/images/icons8-pills-68.png";
import PillsIcon5 from "/public/images/icons8-pills-68 (1).png";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";

import { BottomSheet } from "./BottomSheet";

import MedicineListItem from "./MedicineListItem";
import MedicineList from "./MedicineList";

const NewReminderForm = dynamic(() => import("./NewReminderForm"), {
  loading: () => <p>Loading...</p>,
});
import { OnArgs } from "react-calendar/dist/cjs/shared/types";
import { auth, db } from "../firebase/clientApp";
import { GoogleAuthProvider, User } from "firebase/auth";

import {
  CollectionReference,
  collection,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ReminderType } from "./Types";
import { themeList } from "./ThemeList";

import {
  useAuthUser,
  useAuthSignInWithPopup,
  useAuthSignOut,
} from "@react-query-firebase/auth";
import { UseQueryResult, useQueryClient } from "react-query";
import {
  useFirestoreCollectionMutation,
  useFirestoreQueryData,
  useFirestoreDocumentDeletion,
} from "@react-query-firebase/firestore";
import NavBar from "./NavBar";
import CalendarPrevButton from "./CalendarPrevButton";
import CalendarNextButton from "./CalendarNextButton";

const inter = Inter({ subsets: ["latin"] });

const now = new Date();

const iconList = [
  icon,
  PillIcon,
  PillsIcon,
  BandageIcon,
  MdmaIcon,
  PillIcon3,
  PillsIcon2,
  PillsIcon4,
  PillsIcon5,
];

export default function Home() {
  const queryClient = useQueryClient();

  const [date, setDate] = useState(now);

  const [modal, setModal] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);

  const user = useAuthUser(["user"], auth);
  const userUid = user.data ? user.data.uid : null;

  const collectionRef = collection(
    db,
    "reminders"
  ) as CollectionReference<ReminderType>;

  const queryRef = query(
    collectionRef,
    where("userUid", "==", userUid),
    where(
      "monthYearString",
      "==",
      date.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" })
    )
  );

  const monthQuery = useFirestoreQueryData(
    [
      "reminders",
      { userUid },
      date.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" }),
    ],
    queryRef,
    { idField: "_id", subscribe: true },
    { enabled: user.data ? true : false }
  );

  function handleCalendarDayChange(value: Date | null | (Date | null)[]) {
    if (value && !Array.isArray(value)) {
      setDate(value);
      setModal(!modal);
    }
  }
  function handleCalendarMonthChange({
    action,
    activeStartDate,
    value,
    view,
  }: OnArgs) {
    if (activeStartDate) {
      setDate(activeStartDate);
    }
  }

  function handleBottomSheetDoubleClick(event: any) {
    if (event.detail >= 2) {
      setModal((modalState) => !modalState);
    }
  }

  function handleOpenForm() {
    if (!modal) {
      setModal(true);
    }
    setFormOpen(!isFormOpen);
  }

  function tileContentIndicators({ date }: { date: Date }) {
    const dateKey = date.toLocaleDateString("pt-Br", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      <div className={`flex justify-center items-center gap-1 pt-1 h-2`}>
        {monthQuery &&
          monthQuery.data &&
          monthQuery.data
            .filter((item, i) => item.dateString === dateKey)
            .slice(0, 4)
            .map((item, i) => (
              <div
                key={`mini-indicator-${i}`}
                className={`rounded-full  h-2 w-2 ${
                  item.checked ? item.color : "bg-neutral-300"
                }`}
              ></div>
            ))}
      </div>
    );
  }

  const signInMutation = useAuthSignInWithPopup(auth, {
    onSuccess: async (user) => {
      addUser(user.user);
    },
  });

  const signOutMutation = useAuthSignOut(auth, {
    onSuccess: async (res) => {},
  });

  async function login() {
    signInMutation.mutate({
      provider: new GoogleAuthProvider(),
    });
  }

  async function logout() {
    signOutMutation.mutate();
  }

  async function addUser(newUser: User) {
    try {
      const docRef = doc(db, "users", newUser.uid);
      const res = await setDoc(docRef, {
        uid: newUser.uid,
        displayName: newUser.displayName,
        email: newUser.email,
        isAnonymous: newUser.isAnonymous,
        photoUrl: newUser.photoURL,
      });

      console.log(`User Added with id: ${newUser.uid}`);
    } catch (e) {
      console.error("Error adding document: ", e);
      return e;
    }
  }

  const remindersRef = collection(db, "reminders");
  const remindersMutation = useFirestoreCollectionMutation(remindersRef);

  async function addReminder(newItem: ReminderType) {
    try {
      remindersMutation.mutate(
        {
          ...newItem,
          userUid: user.data?.uid || "0",
        },
        {
          onSuccess: async (res) => {
            console.log(`Reminder added: ${res}`);
          },
        }
      );
      setFormOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      return e;
    }
  }

  const dayReminders =
    monthQuery &&
    monthQuery.data?.filter(
      (item, i) =>
        (item as ReminderType).dateString ===
        date.toLocaleDateString("pt-Br", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
    );

  function handleDelete(_id: string) {}

  function handleUpdate() {}

  function handleModalClose() {
    setModal(false);
  }

  function handleModalOpen() {
    setModal(true);
  }

  return (
    <main
      className={
        "relative bg-skin-fill md:container md:mx-auto md:rounded-xl md:py-2 overflow-hidden max-h-[100svh] h-[100svh]"
      }
    >
      <section>
        <NavBar
          onLogin={login}
          onLogout={logout}
          loggedIn={user.data ? true : false}
          photoURL={
            user.data && user.data.photoURL ? user.data.photoURL : undefined
          }
        ></NavBar>
      </section>
      <div className="bg-skin-fill">
        <section>
          <Calendar
            value={date}
            locale="pt-Br"
            prev2Label={null}
            next2Label={null}
            className={"bg-neutral-100 max-w-2xl mx-auto px-4"}
            maxDetail={"month"}
            minDetail={"month"}
            onClickDay={handleCalendarDayChange}
            onActiveStartDateChange={handleCalendarMonthChange}
            tileContent={tileContentIndicators}
            prevLabel={<CalendarPrevButton></CalendarPrevButton>}
            nextLabel={<CalendarNextButton></CalendarNextButton>}
          ></Calendar>
        </section>

        <section className="bg-skin-fill mt-1 oveflow-[initial] ">
          <BottomSheet
            isOpen={modal}
            onOpen={handleModalOpen}
            onClose={handleModalClose}
          >
            <div
              className={`${
                isFormOpen ? "bg-skin-fill" : "bg-skin-accent-fill"
              } h-full rounded-t-xl max-w-2xl mx-auto border-t-2 md:border-2 border-sky-500`}
            >
              <div
                className="cursor-grab active:cursor-grabbing pb-2 md:py-4 "
                onClick={handleBottomSheetDoubleClick}
              >
                <div className="draggableBar max-w-md mx-auto w-1/2 h-1 md:h-2 bg-neutral-200 rounded-full mt-4 hover:bg-neutral-300"></div>
              </div>

              <>
                {isFormOpen ? (
                  <NewReminderForm
                    iconList={iconList}
                    colorList={themeList}
                    date={date}
                    onClose={() => {
                      setFormOpen(false);
                      setModal(false);
                    }}
                    onSubmit={addReminder}
                  ></NewReminderForm>
                ) : (
                  <>
                    <div className="mb-4 flex justify-between px-4">
                      <h2
                        className={`md:text-lg ${"text-skin-inverted"} capitalize`}
                      >
                        {date.toLocaleDateString("pt-Br", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}
                      </h2>
                      <button
                        onClick={handleOpenForm}
                        className="rounded-full bg-amber-200 w-8 h-8 flex justify-center items-center active:bg-amber-300 hover:scale-125 transition-transform"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-skin-accent"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="md:px-4">
                      <MedicineList fill={6}>
                        {false && <p>Loading...</p>}
                        {dayReminders &&
                          (dayReminders as ReminderType[]).map((item, i) => (
                            <div key={i}>
                              <MedicineListItem
                                {...item}
                                shouldTakeAt={item.shouldTakeAt.toDate()}
                                takenAt={item.takenAt?.toDate()}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                              ></MedicineListItem>
                            </div>
                          ))}
                      </MedicineList>
                    </div>
                  </>
                )}
              </>
            </div>
          </BottomSheet>
        </section>
      </div>
    </main>
  );
}
