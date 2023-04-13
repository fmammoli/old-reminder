"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import icon from "/public/images/capsule.png";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const themes = ["theme-one"];
const modes = ["base", "active"];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const [theme, setTheme] = useState<string>(themes[0]);
  const [mode, setMode] = useState<string>(modes[0]);

  function handleChange() {
    if (mode === modes[0]) {
      setMode(modes[1]);
    } else {
      setMode(modes[0]);
    }

    // if (theme === `${themes[0]}-${modes[0]}`) {
    //   setTheme(`${themes[0]}-${modes[1]}`);
    // } else {
    //   setTheme(`${themes[0]}-${modes[0]}`);
    // }
  }

  return (
    <main className={`  md:container md:mx-auto  md:my-4 ${theme}-${mode}`}>
      <div className="relative isolate overflow-hidden bg-skin-fill md:rounded-xl ">
        <nav className="flex justify-between items-center px-4 py-4 text-skin-base transition-colors delay-200">
          <a href="">
            <svg
              className="w-8 h-8 "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          </a>
          <h2 className="font-sans first-letter:uppercase text-xl font-light">
            {new Date().toLocaleString("pt-Br", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </h2>
          <a href="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </a>
        </nav>
        <section className="px-12 mt-12">
          <div className="mx-auto max-w-md text-center font-sans text-skin-base ">
            <h1 className="text-4xl font-light font-sans text-skin-muted transition-colors delay-200">
              Azitromicina, 300mg
            </h1>
            <p className="text-md font-extralight italic transition-colors delay-200">
              1 capsule, once a day
            </p>
          </div>

          <div className="relative flex justify-center items-center py-12">
            <label htmlFor="check">
              <input
                id="check"
                type="checkbox"
                className="peer hidden z-20 absolute"
                onChange={handleChange}
              />

              <div className="bg-skin-accent-fill  absolute w-20 h-20 top-1/2 left-1/2 rounded-full -z-10 -translate-x-1/2 -translate-y-1/2 transition-transform ease-in-out peer-checked:delay-[200ms] peer-checked:duration-[800ms] duration-[400ms] peer-checked:scale-[30] will-change-transform transform-gpu"></div>

              <div className="bg-skin-fill absolute rounded-full -translate-y-6 peer-checked:translate-y-2 shadow-2xl transition-all ease-out duration-200 peer-checked:duration-[500ms] peer-checked:scale-95 border border-gray-200 p-8 z-10 peer-checked:border-none peer-checked:shadow-none">
                <div className="relative w-20 h-20 max-w-full flex items-center justify-center">
                  <div className="aspect-square w-14 bg-skin-accent-fill rounded-full"></div>
                  <Image src={icon} alt="capsule" fill></Image>
                </div>
              </div>

              <div className="z-10 rounded-full  transition-opacity ease-out peer-checked:delay-[110ms] opacity-100 peer-checked:opacity-0  w-36 h-36  shadow-[inset_9.91px_9.91px_15px_#D9DADE_,_inset_-9.91px_-9.91px_15px_#FFFFFF]"></div>
            </label>
          </div>
          <div className="mx-auto max-w-md text-center flex justify-center items-center gap-2 ">
            <h2 className="text-5xl font-light font-sans text-skin-accent transition-colors delay-300">
              09:00
            </h2>
            <label htmlFor="alarm">
              <input type="checkbox" id="alarm" className=" peer hidden" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-skin-inverted stroke-[2px] transition-colors delay-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-skin-inverted stroke-[2px] hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
                />
              </svg>
            </label>
          </div>

          <div className="max-w-md mx-auto font-sans font-light pt-12 text-sm sm:px-12 dark:transition-colors text-skin-base transition-colors delay-200">
            <div className=" flex items-center gap-1 ">
              <h3 className="font-sans text-lg font-medium">Observações:</h3>
            </div>

            <p className="py-4 leading-relaxed">
              Tomar a cápsulo depois da refeição.
            </p>
          </div>

          <div className="max-w-md mx-auto font-sans font-light py-12 text-sm sm:px-12 dark:transition-colors text-skin-base transition-colors delay-200">
            <div className=" flex items-center gap-1 ">
              <h3 className="font-sans text-lg font-medium">Bula:</h3>
              <a href="">
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
              </a>
            </div>

            <p className="py-4 leading-relaxed">
              Azitromicina é um antibiótico usado no tratamento de várias
              infecções bacterianas.[1] Entre as indicações mais comuns estão no
              tratamento de otite média, faringite estreptocócica, pneumonia,
              diarreia do viajante e outras infecções intestinais.[1] Pode
              também ser usada no tratamento de várias infecções sexualmente
              transmissíveis, incluindo clamídia e gonorreia.[1] Em associação
              com outros fármacos, pode também ser usada no tratamento de
              malária.[1] Pode ser administrada por via oral ou intravenosa ou
              endovenosa.[1]
            </p>
            <p>
              Os efeitos adversos mais comuns são náuseas, vómitos, diarreia e
              indisposição no estômago.[1] Entre outros possíveis efeitos
              adversos, menos comuns, estão reações alérgicas, como anafilaxia,
              QT longo ou um tipo de diarreia causado por Clostridium
              difficile.[1] O uso durante a gravidez não está indicado exceto em
              caso de necessidade expressa.[2][1] A sua segurança durante a
              amamentação não está firmemente estabelecida, mas é provavelmente
              segura.[3] A azitromicina é um antibiótico do grupo dos
              macrólidos.[1] O mecanismo de ação envolve a diminuição da
              produção de proteínas, impedindo o crescimento das bactérias.[1]
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
