"use client";
import Image, { StaticImageData } from "next/image";
import { Inter } from "next/font/google";
import icon from "/public/images/capsule.png";
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

const medicineList: MedicineType[] = [
  {
    id: "1",
    title: "Azitromicina",
    concentration: "300mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-rose-400",
    theme: "theme-one",
    checked: false,
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
    color: "bg-amber-200",
    theme: "theme-three",
    checked: false,
    icon: icon,
    shouldTaketAt: "22:00",
  },
  {
    id: "4",
    title: "Dzitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-purple-200",
    theme: "theme-four",
    checked: false,
    icon: icon,
    shouldTaketAt: "24:00",
  },
];

export default function Home() {
  const [medicines, setMedicines] = useState(medicineList);
  const [theme, setTheme] = useState<string>("theme-one-base");

  const [checked, setChecked] = useState<string[]>([]);

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

  const [preserve, setPreserve] = useState(false);

  function handleSlideChange(current: number, direction: "+1" | "-1") {
    if (medicines[current].checked === true) {
      setTheme(themes[current][1]);
      setFade(true);
    } else {
      setTheme(themes[current][0]);
      setFade(false);
    }
    if (direction === "+1") {
      setPreserve(
        medicines[current - 1].checked !== medicines[current].checked
          ? true
          : false
          ? true
          : false
      );
    } else {
      setPreserve(
        medicines[current + 1].checked !== medicines[current].checked
          ? true
          : false
      );
    }
    setCurrent(medicines[current]);
  }

  return (
    <main className={`${theme} md:container md:mx-auto md:my-4`}>
      <BackgroundFill
        isVisible={current.checked}
        color={current.color}
      ></BackgroundFill>

      <div className={`overflow-hidden md:rounded-xl pb-8 bg-skin-fill `}>
        <section className="relative">
          <Menu></Menu>
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
                <p className="py-4 leading-relaxed">
                  Azitromicina é um antibiótico usado no tratamento de várias
                  infecções bacterianas.[1] Entre as indicações mais comuns
                  estão no tratamento de otite média, faringite estreptocócica,
                  pneumonia, diarreia do viajante e outras infecções
                  intestinais.[1] Pode também ser usada no tratamento de várias
                  infecções sexualmente transmissíveis, incluindo clamídia e
                  gonorreia.[1] Em associação com outros fármacos, pode também
                  ser usada no tratamento de malária.[1] Pode ser administrada
                  por via oral ou intravenosa ou endovenosa.[1]
                </p>
                <p>
                  Os efeitos adversos mais comuns são náuseas, vómitos, diarreia
                  e indisposição no estômago.[1] Entre outros possíveis efeitos
                  adversos, menos comuns, estão reações alérgicas, como
                  anafilaxia, QT longo ou um tipo de diarreia causado por
                  Clostridium difficile.[1] O uso durante a gravidez não está
                  indicado exceto em caso de necessidade expressa.[2][1] A sua
                  segurança durante a amamentação não está firmemente
                  estabelecida, mas é provavelmente segura.[3] A azitromicina é
                  um antibiótico do grupo dos macrólidos.[1] O mecanismo de ação
                  envolve a diminuição da produção de proteínas, impedindo o
                  crescimento das bactérias.[1]
                </p>
              </Description>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
