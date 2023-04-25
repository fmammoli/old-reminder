"use client";
import Image, { StaticImageData } from "next/image";
import { Inter } from "next/font/google";
import icon from "/public/images/capsule.png";

import PillIcon from "/public/images/icons8-pill-100.png";
import PillIcon2 from "/public/images/icons8-pill-64.png";
import PillsIcon from "/public/images/icons8-pills-100.png";
import MdmaIcon from "/public/images/icons8-mdma-100.png";
import BandageIcon from "/public/images/icons8-bandage-100.png";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import Title from "./Title";
import ScheduledTime from "./ScheduledTime";
import Description from "./Description";
import ActionButton from "./ActionButton";
import { PanInfo, motion, useAnimate, useMotionValue } from "framer-motion";
import Hole from "./Hole";
import FloatingButton from "./FloatingButton";
import ButtonGroup from "./ButtonGroup";
import Slider from "./Slider";
import BackgroundFill from "./BackgroundFill";
import { ReminderType } from "@/app/Types";

const inter = Inter({ subsets: ["latin"] });

const themes = [
  ["theme-one-base", "theme-one-active"],
  ["theme-two-base", "theme-two-active"],
  ["theme-three-base", "theme-three-active"],
  ["theme-four-base", "theme-four-active"],
];

export type MedicineType = {
  id: string;
  title: string;
  concentration: string;
  amount: string;
  frequency: string;
  color: string;
  theme: string;
  checked: boolean;
  icon: StaticImageData;
  shouldTaketAt: string;
  takenAt?: string;
};

export default function PresentationContent({
  reminders,
}: {
  reminders: ReminderType[];
}) {
  const [medicines, setMedicines] = useState(medicineList);
  const [theme, setTheme] = useState<string>("theme-one-base");
  const [current, setCurrent] = useState(medicineList[0]);
  const [fade, setFade] = useState(false);

  function handleButtonClick(
    event: ChangeEvent<HTMLInputElement>,
    newChecked: string[]
  ) {
    const takenAt = new Date().toLocaleString("pt-Br", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMedicines((medicines) =>
      medicines.map((item) => {
        return {
          ...item,
          checked: newChecked.includes(`check-${item.id}`),
          takenAt: newChecked.includes(`check-${item.id}`)
            ? takenAt
            : undefined,
        };
      })
    );

    setCurrent((c) => {
      return {
        ...c,
        checked: newChecked.includes(`check-${c.id}`),
        takenAt: newChecked.includes(`check-${c.id}`) ? takenAt : undefined,
      };
    });

    const currentIndex = medicines.findIndex((a) => a.id === current.id);
    if (theme.includes("base")) {
      setTheme(themes[currentIndex][1]);
    } else {
      setTheme(themes[currentIndex][0]);
    }
    setFade(!fade);
  }

  function handleSlideChange(current: number, direction: "+1" | "-1") {
    if (medicines[current].checked === true) {
      setTheme(themes[current][1]);
      setFade(true);
    } else {
      setTheme(themes[current][0]);
      setFade(false);
    }
    setCurrent(medicines[current]);
  }

  return (
    <main className={`${theme} md:container md:mx-auto md:my-4`}>
      <div className={`relative md:rounded-xl pb-8 bg-skin-fill`}>
        <BackgroundFill
          isVisible={current.checked}
          color={current.color}
        ></BackgroundFill>

        <section className="relative">
          <Menu
            title={data.date.toLocaleString("pt-Br", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          ></Menu>
        </section>
        <section className="mt-12 relative">
          <Title
            title={`${current.title}, ${current.concentration}`}
            subtitle={`${current.amount}, ${current.frequency}`}
          ></Title>

          <div className="" id="crouselContainer relative">
            <Slider data={medicines} onSlideChange={handleSlideChange}>
              <ButtonGroup onChange={handleButtonClick}>
                {medicines.map((item) => (
                  <div
                    id={item.id}
                    color={item.color}
                    key={`img-check-${item.id}`}
                    className="relative"
                  >
                    <Image src={item.icon} alt=""></Image>
                  </div>
                ))}
              </ButtonGroup>
            </Slider>
          </div>

          <div className="flex justify-center py-14">
            <Hole fade={fade}></Hole>
          </div>

          <ScheduledTime
            scheduledTo={current.shouldTaketAt}
            checkedAt={current.takenAt}
          ></ScheduledTime>

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
