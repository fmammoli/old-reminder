"use client";
import Image, { StaticImageData } from "next/image";
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

import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MedicineType } from "./day/[id]/page";
import { BottomSheet } from "./BottomSheet";

import Overlay from "./Overlay";
import MedicineListItem from "./MedicineListItem";
import MedicineList from "./MedicineList";
import NewReminderForm from "./NewReminderForm";
import { TileArgs } from "react-calendar/dist/cjs/shared/types";

const inter = Inter({ subsets: ["latin"] });

const now = new Date();

const formatedNow = now.toLocaleDateString("pt-Br", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const colorList = [
  "bg-rose-400",
  "bg-sky-400",
  "bg-violet-300",
  "bg-amber-300",
  "bg-emerald-300",
  "bg-indigo-500",
];

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

const medicineList: MedicineType[] = [
  {
    id: "1",
    title: "Azitromicina",
    concentration: "300mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-rose-400",
    theme: "theme-one",
    checked: true,
    icon: icon,
    shouldTaketAt: "09:00",
  },
  {
    id: "2",
    title: "Decongex",
    concentration: "700mg",
    amount: "2 capsule",
    frequency: "once a day",
    color: "bg-sky-400",
    theme: "theme-two",
    checked: false,
    icon: icon,
    shouldTaketAt: "12:00",
  },
  {
    id: "3",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "4",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "5",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "6",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "7",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "8",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "9",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "10",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-violet-300",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
];

const remindersData = {
  [formatedNow]: {
    id: "1-data",
    details: "Some crazy text",
    reminders: medicineList,
  },
};

export default function Home() {
  const [date, setDate] = useState(now);
  const [data, setData] = useState(remindersData);

  const [modal, setModal] = useState(false);

  const dateString = date.toLocaleDateString("pt-Br", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  function handleCalendarChange(value: Date | null | (Date | null)[]) {
    if (value && !Array.isArray(value)) {
      setDate(value);
      if (
        data[
          value.toLocaleDateString("pt-Br", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        ]?.reminders?.length > 0
      ) {
        setModal(!modal);
      }
    }
  }

  function handleBottomSheetDoubleClick(event: any) {
    console.log(event.detail);
    if (event.detail >= 2) {
      setModal((modalState) => !modalState);
    }
  }

  let toCompleteSheetList = 6;
  const reminders =
    data[
      date.toLocaleDateString("br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    ]?.reminders || [];
  toCompleteSheetList = Math.max(toCompleteSheetList - reminders.length, 0);

  const [isFormOpen, setFormOpen] = useState(false);

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
        {data[dateKey]?.reminders?.slice(0, 4).map((item, i) => (
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

  return (
    <main
      className={
        "relative bg-skin-fill md:container md:mx-auto md:rounded-xl md:py-2 overflow-hidden max-h-screen h-screen"
      }
    >
      <section>
        <nav className="flex justify-between items-center max-w-2xl mx-auto pt-2">
          <button className="relative w-8 h-8 rounded-full shadow-sm border-neutral-200 border-1 flex justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 stroke-neutral-300 stroke-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </button>

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
            onChange={handleCalendarChange}
            tileContent={tileContentIndicators}
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
                      colorList={colorList}
                      date={date}
                      onClose={() => {
                        setFormOpen(false);
                        setModal(false);
                      }}
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

                      <MedicineList fill={toCompleteSheetList}>
                        {data[dateString]?.reminders?.map((item) => {
                          return (
                            <MedicineListItem
                              key={item.id}
                              dateString={dateString}
                              {...item}
                            ></MedicineListItem>
                          );
                        })}
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
