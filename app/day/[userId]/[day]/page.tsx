"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Menu from "./Menu";
import Title from "./Title";
import ScheduledTime from "./ScheduledTime";
import Description from "./Description";
import Hole from "./Hole";
import { FillBackgroundBase } from "./BackgroundFill";
import { ReminderType } from "@/app/Types";
import { auth, db } from "../../../../firebase/clientApp";

import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useAuthUser } from "@react-query-firebase/auth";
import {
  useFirestoreDocumentMutation,
  useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { ThemeItemType, themeList } from "@/app/ThemeList";
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
  const date = useMemo(
    () =>
      new Date(
        Date.parse(
          `${[...day.split("-")].reverse().join("-")}T00:00:00.000-03:00`
        )
      ),
    [day]
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

  const [dayQuery, setDayQuery] = useState(dayQueryRes.data);

  const found = dayQueryRes.data?.find((item) => item._id === start);

  const [current, setCurrent] = useState<ReminderType | null>(found || null);

  const docRef = doc(collectionRef, current?._id ? current._id : start);

  //Load the first current after dayQuery finishes fetching
  useEffect(() => {
    if (!current) {
      if (dayQueryRes.status === "success" && dayQueryRes.data) {
        setDayQuery(dayQueryRes.data);
        const found = dayQueryRes.data?.find((item) => item._id === start);
        if (found) {
          setCurrent(found);
        }
      }
    }
  }, [dayQueryRes, setDayQuery, current, setCurrent, start]);

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
        // queryClient.invalidateQueries({
        //   queryKey: ["reminders", { userUid }, { day }],
        // });
        // queryClient.invalidateQueries({
        //   queryKey: ["reminders", { userUid }],
        // });
      },
    }
  );

  async function updateReminder(toUpdate: ReminderType, fields: {}) {
    remindersMutation.mutate({ ...toUpdate, ...fields });
  }

  function handleButtonClick(
    reminderId: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (current) {
      const takenAt = new Date();

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

  function takenAtToString(current: ReminderType | null) {
    if (current) {
      if (current.checked && current.takenAt) {
        return new Date(current.takenAt.toDate()).toLocaleString("pt-Br", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } else {
      return undefined;
    }
  }
  const takenAtString = takenAtToString(current);

  function resolveTheme(
    current: ReminderType | null,
    themeList: ThemeItemType[]
  ) {
    if (current) {
      const found = themeList.find((item) => item.name === current.theme);
      if (found) {
        return current.checked ? found?.active : found?.base;
      }
    } else {
      return "theme-one";
    }
  }

  const theme = resolveTheme(current, themeList);

  return (
    <main className={`${theme} md:container md:mx-auto md:my-4`}>
      <div className={`relative md:rounded-xl pb-8 bg-skin-fill `}>
        {current && (
          <FillBackgroundBase
            isVisible={current.checked}
            color={current.color}
          ></FillBackgroundBase>
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

          <div id="crouselContainer" className="relative">
            {current && dayQuery && (
              <Gallery
                onChange={handleSlideChange}
                current={current}
                startAt={current._id}
              >
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
                        data-checked={item.checked}
                      >
                        <Image
                          className="pointer-events-none align-middle"
                          src={item.icon}
                          alt=""
                        ></Image>
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
