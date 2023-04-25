"use client";
import Image, { StaticImageData } from "next/image";
import { Inter } from "next/font/google";
import icon from "/public/images/capsule.png";
import { ChangeEvent, useEffect, useState } from "react";
import Menu from "./Menu";
import Title from "./Title";
import ScheduledTime from "./ScheduledTime";
import Description from "./Description";
import Hole from "./Hole";
import ButtonGroup from "./ButtonGroup";
import Slider from "./Slider";
import BackgroundFill from "./BackgroundFill";
import { ReminderType } from "@/app/Types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../firebase/clientApp";
import { useAuthContext } from "@/contexts/AuthContext";
import { UserCredential } from "firebase/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { data } from "autoprefixer";

import { ThemeItemType, themeList } from "@/app/ThemeList";
const inter = Inter({ subsets: ["latin"] });

const themes = [
  ["theme-one-base", "theme-one-active"],
  ["theme-two-base", "theme-two-active"],
  ["theme-three-base", "theme-three-active"],
  ["theme-four-base", "theme-four-active"],
];

export default function Page({
  params: { userId, day },
}: {
  params: { userId: string; day: string };
}) {
  const date = new Date(
    Date.parse(`${[...day.split("-")].reverse().join("-")}T00:00:00.000-03:00`)
  );
  // @ts-ignore
  const { user } = useAuthContext();

  const placeholderReminder: ReminderType = {
    id: "",
    amount: "",
    userUid: "",
    shouldTakeAtString: "00:00",
    theme: "",
    frequency: "",
    dateString: "",
    color: "",
    date: Timestamp.fromDate(date),
    shouldTakeAt: Timestamp.fromDate(new Date()),
    title: "My Medicine",
    monthYearString: "",
    yearString: "",
    observations: "",
    checked: false,
    icon: icon,
    createdAt: Timestamp.fromDate(new Date()),
    useUntil: "",
  };

  const collectionRef = collection(
    db,
    "reminders"
  ) as CollectionReference<ReminderType>;

  const dayQuery = query(
    collectionRef,
    where("userUid", "==", user && user.uid),
    where(
      "dateString",
      "==",
      date.toLocaleDateString("pt-Br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    )
  );

  const [dayData, loadingDay, errorDay] = useCollectionData(dayQuery);

  const [current, setCurrent] = useState<ReminderType | null>(null);

  async function updateReminder(toUpdate: ReminderType, fields: {}) {
    setCurrent({ ...toUpdate, ...fields });
    const docRef = doc(db, "reminders", toUpdate.id);
    const result = await updateDoc(docRef, fields);
    setCurrent({ ...toUpdate, ...fields });
    console.log(result);
  }

  function handleButtonClick(
    event: ChangeEvent<HTMLInputElement>,
    newChecked: string[]
  ) {
    if (current) {
      const takenAt = new Date();

      updateReminder(current, {
        checked: !current.checked,
        takenAt: !current.checked ? Timestamp.fromDate(takenAt) : null,
      });
    }
  }

  useEffect(() => {
    if (loadingDay === false && dayData && !current) {
      console.log("starting current");
      setCurrent(dayData[0]);
    }
  }, [loadingDay, dayData, setCurrent, current]);

  function handleSlideChange(current: number, direction: "+1" | "-1") {
    if (dayData) {
      setCurrent(dayData[current]);
    }
  }

  let takenAtString: string | undefined = "";
  if (dayData && current) {
    if (current.checked && current.takenAt) {
      takenAtString = new Date(current.takenAt.toDate()).toLocaleString(
        "pt-Br",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }
  } else {
    takenAtString = undefined;
  }

  let theme = "theme-one";
  if (current) {
    theme = `${current.theme}-${current.checked ? "active" : "base"}`;
  }

  return (
    <main className={`${theme} md:container md:mx-auto md:my-4`}>
      <div className={`relative md:rounded-xl pb-8 bg-skin-fill`}>
        {current && (
          <BackgroundFill
            isVisible={current.checked}
            color={current.color}
          ></BackgroundFill>
        )}

        <section className="relative">
          <Menu
            title={date.toLocaleString("pt-Br", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          ></Menu>
        </section>
        <section className="mt-12 relative">
          {current && (
            <Title
              title={`${current.title}`}
              subtitle={`${current.amount}, ${current.frequency}`}
            ></Title>
          )}

          <div className="" id="crouselContainer relative">
            {current && dayData && (
              <Slider data={dayData} onSlideChange={handleSlideChange}>
                <ButtonGroup onChange={handleButtonClick}>
                  {dayData.map((item) => (
                    <div
                      id={item.id}
                      color={item.color}
                      key={`img-check-${item.id}`}
                      className="relative"
                      data-checked={item.checked}
                    >
                      <Image src={item.icon} alt=""></Image>
                    </div>
                  ))}
                </ButtonGroup>
              </Slider>
            )}
          </div>

          <div className="flex justify-center py-14">
            <Hole fade={current ? current.checked : false}></Hole>
          </div>

          {current && (
            <ScheduledTime
              scheduledTo={current.shouldTakeAtString}
              checkedAt={takenAtString}
            ></ScheduledTime>
          )}

          <div className="flex flex-col justify-center px-10">
            <div className="pt-12">
              <Description title={"Observações:"}>
                <p className="py-4 leading-relaxed">
                  Tomar a cápsulo depois da refeição.
                </p>
              </Description>
            </div>
            <div className="pt-4">
              <Description
                title={"Bula:"}
                icon={
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
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                }
              >
                <p className="py-4 leading-relaxed">a</p>
                <p>q</p>
              </Description>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
