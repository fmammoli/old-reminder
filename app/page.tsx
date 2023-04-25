"use client";
import Image from "next/image";
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

import Overlay from "./Overlay";
import MedicineListItem from "./MedicineListItem";
import MedicineList from "./MedicineList";
import NewReminderForm from "./NewReminderForm";
import { OnArgs } from "react-calendar/dist/cjs/shared/types";
import { auth, db } from "../firebase/clientApp";
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";

import {
  CollectionReference,
  addDoc,
  collection,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { ReminderType } from "./Types";

import { useAuthContext } from "@/contexts/AuthContext";
import { themeList } from "./ThemeList";

const inter = Inter({ subsets: ["latin"] });

const now = new Date();

const formatedNow = now.toLocaleDateString("pt-Br", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

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
  const [date, setDate] = useState(now);

  const dateString = date.toLocaleString("pt-Br", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [modal, setModal] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);

  // @ts-ignore
  const { user } = useAuthContext();

  const currentUser = user;

  useEffect(() => {
    console.log(user);
  }, [user]);

  const collectionRef = collection(
    db,
    "reminders"
  ) as CollectionReference<ReminderType>;

  const monthQuery = query(
    collectionRef,
    where("userUid", "==", user && user.uid),
    where(
      "monthYearString",
      "==",
      date.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" })
    )
  );

  const [monthData, loadingMonth, errorMonth] = useCollectionData(monthQuery);

  function handleCalendarDayChange(value: Date | null | (Date | null)[]) {
    console.log("changed calendar");
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
    console.log(event.detail);
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
      <div className={`flex justify-center items-center gap-1 pt-3 h-2`}>
        {monthData &&
          monthData
            ?.filter((item, i) => item.dateString === dateKey)
            .slice(0, 4)
            .map((item, i) => (
              <div
                key={`mini-indicator-${i}`}
                className={`rounded-full  h-2 w-2  ${
                  item.checked ? item.color : "bg-neutral-300"
                }`}
              ></div>
            ))}
      </div>
    );
  }
  const googleAuth = new GoogleAuthProvider();

  const [currentUserState, setCurrentUserState] = useState(user);

  async function login() {
    console.log("login in");
    const result = await signInWithPopup(auth, googleAuth);
    addUser(result);
    setCurrentUserState(result.user);
  }

  async function logout() {
    auth.signOut();
    setCurrentUserState(null);
  }

  async function addUser(user: UserCredential) {
    try {
      const docRef = await setDoc(doc(db, "users", user.user.uid), {
        uid: user.user.uid,
        displayName: user.user.displayName,
        email: user.user.email,
        isAnonymous: user.user.isAnonymous,
        photoUrl: user.user.photoURL,
      });
      console.log("Document written with ID: ", docRef);
      return docRef;
    } catch (e) {
      console.error("Error adding document: ", e);
      return e;
    }
  }

  async function addReminder(newItem: ReminderType) {
    try {
      const newDocRef = doc(collection(db, "reminders"));
      const docRef = await setDoc(newDocRef, {
        ...newItem,
        userUid: currentUser?.uid,
        id: newDocRef.id,
      });
      console.log("Document written with ID: ", newDocRef.id);
      setFormOpen(false);
      return docRef;
    } catch (e) {
      console.error("Error adding document: ", e);
      return e;
    }
  }

  const dayReminders = monthData?.filter(
    (item, i) =>
      (item as ReminderType).dateString ===
      date.toLocaleDateString("pt-Br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
  );

  return (
    <main
      className={
        "relative bg-skin-fill md:container md:mx-auto md:rounded-xl md:py-2 overflow-hidden max-h-screen h-screen"
      }
    >
      <section>
        <nav className="flex justify-between items-center max-w-2xl mx-auto pt-2 isolate">
          <label htmlFor="dropdownMenu" className="relative">
            <input
              id={"dropdownMenu"}
              type="checkbox"
              className="hidden peer"
            />
            <div
              className="relative rounded-full shadow-md active:bg-gray-200 flex justify-center items-center "
              data-dropdown-toggle="dropdown"
            >
              {!currentUser ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400 stroke-[0.8]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <div className="relative border-1 border-gray-200 rounded-full">
                  <Image
                    src={
                      currentUser.photoURL ||
                      "https://ui-avatars.com/api/?size=32"
                    }
                    alt={"Profile picture"}
                    height={48}
                    width={48}
                    className="rounded-full"
                  ></Image>
                </div>
              )}
            </div>

            <div
              id="dropdown"
              className="absolute hidden -z-1 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 peer-checked:block"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
                onClick={() => console.log("ul")}
              >
                {!currentUser && (
                  <li>
                    <button
                      onClick={login}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Login with Google
                    </button>
                  </li>
                )}

                {currentUser && (
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </label>

          <div>
            <h1 className="font-sans text-2xl text-skin-accent font-extrabold decoration-wavy decoration-yellow-400 underline">
              Reminder
            </h1>
          </div>
          <button className="relative w-12 h-12 rounded-full text-neutral-500 flex justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
              />
            </svg>
          </button>
        </nav>
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
            prevLabel={
              <div className=" text-gray-400 px-5 py-2 active:bg-gray-200 active:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </div>
            }
            nextLabel={
              <div className=" text-gray-400 px-5 py-2 active:bg-gray-200  active:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            }
          ></Calendar>
        </section>

        <section className="bg-skin-fill mt-1 oveflow-[initial]">
          <Overlay isVisible={modal} onClose={() => setModal(false)}></Overlay>
          <div className=" w-full">
            <BottomSheet
              isOpen={modal}
              onOpen={() => setModal(true)}
              onClose={() => {
                setModal(false);
                setFormOpen(false);
              }}
              popUpDistance={isFormOpen ? "top" : "middle"}
            >
              <div
                className={`${
                  isFormOpen ? "bg-skin-fill" : "bg-skin-accent-fill"
                } rounded-t-xl max-w-2xl mx-auto border-2 border-sky-500`}
              >
                <div
                  className="cursor-grab active:cursor-grabbing py-4 "
                  onClick={handleBottomSheetDoubleClick}
                >
                  <div className="max-w-md mx-auto w-1/2 h-2 bg-neutral-200 rounded-full mt-4 hover:bg-neutral-300"></div>
                </div>

                <div className="">
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
                    <div className="px-4 ">
                      <div className="mb-4 flex justify-between">
                        <h2
                          className={`text-lg ${"text-skin-inverted"} capitalize`}
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

                      <MedicineList fill={6}>
                        {loadingMonth && <p>Loading...</p>}
                        {dayReminders &&
                          (dayReminders as ReminderType[]).map((item, i) => (
                            <div key={i}>
                              <MedicineListItem
                                {...item}
                                shouldTakeAt={item.shouldTakeAt.toDate()}
                              ></MedicineListItem>
                            </div>
                          ))}
                      </MedicineList>
                    </div>
                  )}
                </div>
              </div>
            </BottomSheet>
          </div>
        </section>
      </div>
    </main>
  );
}
