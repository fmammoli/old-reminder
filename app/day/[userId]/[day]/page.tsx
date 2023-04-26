"use client";
import Image from "next/image";
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
import { auth, db } from "../../../../firebase/clientApp";

import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuthUser } from "@react-query-firebase/auth";
import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentMutation,
  useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { themeList } from "@/app/ThemeList";
import Gallery from "./Gallery";
import FloatingButton from "./FloatingButton";
import { useQueryClient } from "react-query";

const inter = Inter({ subsets: ["latin"] });

export default function Page({
  params: { userId, day },
  searchParams: { start },
}: {
  params: { userId: string; day: string };
  searchParams: { start: string };
}) {
  const date = new Date(
    Date.parse(`${[...day.split("-")].reverse().join("-")}T00:00:00.000-03:00`)
  );
  const queryClient = useQueryClient();

  const user = useAuthUser(["user"], auth);

  const userUid = user.data ? user.data.uid : null;

  const collectionRef = collection(
    db,
    "reminders"
  ) as CollectionReference<ReminderType>;

  const dayQueryRef = query(
    collectionRef,
    where("userUid", "==", userUid),
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

  const dayQueryRes = useFirestoreQueryData(
    ["reminders", { userUid }, { day }],
    dayQueryRef,
    { idField: "_id", subscribe: true },
    { enabled: user.data ? true : false }
  );
  const monthQueryRef = query(
    collectionRef,
    where("userUid", "==", userUid),
    where(
      "monthYearString",
      "==",
      date.toLocaleDateString("pt-Br", { month: "2-digit", year: "numeric" })
    )
  );

  const monthQuery = useFirestoreQueryData(
    ["reminders", { userUid }],
    monthQueryRef,
    { idField: "_id", subscribe: true },
    { enabled: user.data ? true : false }
  );

  function filterDay(data: ReminderType[], day: Date) {
    return (dayData = data.filter(
      (item) =>
        item.dateString ===
        date.toLocaleDateString("pt-Br", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
    ));
  }

  let dayData: ReminderType[] | null = null;
  if (!monthQuery.isLoading && monthQuery.data) {
    dayData = filterDay(monthQuery.data, date);
  }

  const [dayQuery, setDayQuery] = useState(dayQueryRes.data);

  let found: ReminderType | null = null;
  if (!monthQuery.isLoading && monthQuery.data) {
    found = monthQuery.data.find((item) => item._id === start) || null;
  }

  const [current, setCurrent] = useState<ReminderType | null>(found);

  const docRef = doc(collectionRef, current?._id ? current._id : start);

  const remindersMutation = useFirestoreDocumentMutation(
    docRef,
    {
      merge: true,
    },
    {
      onMutate: async (newReminder) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: ["reminders", { userUid }, { day }],
        });

        // Snapshot the previous value
        const previousDay = queryClient.getQueryData<ReminderType[]>([
          "reminders",
          { userUid },
          { day },
        ]);

        let newDay = null;
        if (previousDay) {
          newDay = previousDay.map((item, index) => {
            if (item._id === newReminder._id) {
              return { ...newReminder };
            } else {
              return item;
            }
          });
        } else {
          newDay = [newReminder];
        }

        // Optimistically update to the new value
        queryClient.setQueryData(["reminders", { userUid }, { day }], newDay);
        setCurrent(newReminder as ReminderType);
        setDayQuery(newDay as ReminderType[]);
        // setDayQuery(newDay as ReminderType[]);
        // Return a context with the previous and new todo
        return { previousDay, newDay };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newDay, context) => {
        queryClient.setQueryData<ReminderType[]>(
          ["reminders", { userUid }, { day }],
          //@ts-ignore
          context.previousDay
        );
        //@ts-ignore
        setDayQuery(context.previousDay as ReminderType[]);
      },
      // Always refetch after error or success:
      onSettled: (newTodo) => {
        queryClient.invalidateQueries({
          queryKey: ["reminders", { userUid }, { day }],
        });
      },
    }
  );

  useEffect(() => {
    if (!dayQuery && monthQuery.status === "success") {
      setDayQuery(filterDay(monthQuery.data, date));
    }
  }, [monthQuery, dayQuery, start, date, setDayQuery, filterDay]);

  useEffect(() => {
    if (!current && monthQuery.status === "success") {
      found = monthQuery.data.find((item) => item._id === start) || null;
      if (found) {
        setCurrent(found);
      }
    }
  }, [monthQuery, current, setCurrent]);

  async function updateReminder(toUpdate: ReminderType, fields: {}) {
    remindersMutation.mutate({ ...toUpdate, ...fields });
  }

  function handleButtonClick(
    reminderId: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (current) {
      const takenAt = new Date();
      console.log(current);
      updateReminder(current, {
        checked: !current.checked,
        takenAt: !current.checked ? Timestamp.fromDate(takenAt) : null,
      });
    }
  }

  function handleSlideChange(reminderId: string, direction: number) {
    if (dayQuery) {
      const found = dayQuery.find((item) => item._id === reminderId);
      if (found) {
        setCurrent(found);
      }
    }
  }

  let takenAtString: string | undefined = "";
  if (dayQuery && current) {
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
    const found = themeList.find((item) => item.name === current.theme);
    if (found) {
      theme = current.checked ? found?.active : found?.base;
    }
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
            {current && dayQuery && (
              <Gallery onChange={handleSlideChange} current={current}>
                {dayQuery.map((item, index) => {
                  return (
                    <FloatingButton
                      key={item._id}
                      reminderId={item._id}
                      isChecked={item.checked}
                      color={item.color}
                      onChange={handleButtonClick}
                    >
                      <div
                        key={`img-check-${item._id}`}
                        className="relative"
                        data-checked={item.checked}
                      >
                        <Image src={item.icon} alt=""></Image>
                      </div>
                    </FloatingButton>
                  );
                })}
              </Gallery>
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
