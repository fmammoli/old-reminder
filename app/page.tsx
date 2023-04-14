"use client";
import Image from "next/image";
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

const inter = Inter({ subsets: ["latin"] });

const themes = ["theme-one"];
const modes = ["base", "active"];

const medicines = [
  {
    id: "1",
    title: "Azitromicina",
    concentration: "300mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-rose-400",
  },
  {
    id: "2",
    title: "Bzitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-teal-200",
  },
  {
    id: "3",
    title: "Czitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-sky-200",
  },
  {
    id: "4",
    title: "Dzitromicina",
    concentration: "700mg",
    amount: "1 capsule",
    frequency: "once a day",
    color: "bg-purple-200",
  },
];

export default function Home() {
  const [theme, setTheme] = useState<string>("theme-one-base");
  const [mode, setMode] = useState<string>(modes[0]);
  const [checked, setChecked] = useState<string>("");

  const [current, setCurrent] = useState(0);

  function handleChange({
    event,
    inputKey,
    fillBackground,
  }: {
    event: ChangeEvent<HTMLInputElement> | undefined;
    inputKey: string;
    fillBackground?: boolean;
  }) {
    // if (theme === modes[0]) {
    //   setMode(modes[1]);
    //   setTheme(`${themes[0]}-${modes[1]}`);
    // } else {
    //   setMode(modes[0]);
    //   setTheme(`${themes[0]}-${modes[0]}`);
    // }

    if (fillBackground) {
      if (theme === `${themes[0]}-${modes[0]}`) {
        setTheme("theme-one-active");
      } else {
        setTheme("theme-one-base");
      }
    }
    setChecked(inputKey);
  }

  const [fade, setFade] = useState(false);

  function handleButtonChange() {
    setFade(!fade);
  }

  function handleSlideChange(current: number) {
    setFade(false);
  }

  return (
    <main className={`${theme} md:container md:mx-auto md:my-4 `}>
      <div className="relative isolate overflow-hidden bg-skin-fill md:rounded-xl pb-8">
        <Menu></Menu>
        <section className="mt-12">
          <Title></Title>

          <div className="" id="crouselContainer relative">
            <Slider data={medicines} onSlideChange={handleSlideChange}>
              <ButtonGroup onChange={handleButtonChange}>
                <Image src={icon} alt=""></Image>
                <Image src={icon} alt=""></Image>
                <p>AA</p>
              </ButtonGroup>
            </Slider>
          </div>

          <div className="flex justify-center py-14">
            <Hole fade={fade}></Hole>
          </div>

          <ScheduledTime></ScheduledTime>

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
