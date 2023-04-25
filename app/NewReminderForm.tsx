import Image, { StaticImageData } from "next/image";
import FrequencyInput from "./FrequencyInput";
import RepetitionInput from "./RepetitionInput";
import { FormEvent, useState } from "react";
// To use Html5QrcodeScanner (more info below)
import { Html5QrcodeScanner } from "html5-qrcode";

// To use Html5Qrcode (more info below)
import { Html5Qrcode } from "html5-qrcode";
import Html5QrcodePlugin from "./HTML5Qrcodeplugin";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase/clientApp";

import NameSearch from "./NameSearch";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import TimePicker from "./TimePicker";
import { ThemeItemType, themeList } from "./ThemeList";

const hours = new Array(24).fill(0).map((item, i) => {
  if (i < 10) return `0${i}`;
  return i;
});

const minutes = new Array(60).fill(0).map((item, i) => {
  if (i < 10) return `0${i}`;
  return i;
});

const queryClient = new QueryClient();

export default function NewReminderForm({
  iconList,
  colorList,
  date,
  onClose,
  onSubmit,
}: {
  iconList: StaticImageData[];
  colorList: ThemeItemType[];
  date: Date;
  onClose: () => void;
  onSubmit: (newItem: any) => void;
}) {
  function handleSubmit(event: React.FormEvent) {
    // Prevent the browser from reloading the page
    event.preventDefault();

    // Read the form data
    const form = event.currentTarget as typeof event.currentTarget & {
      name: { value: string };
      amount: { value: string };
      frequency: { value: string };
      "repetitions-radio": { value: string };
      "theme-radio": { value: string };
      theme: { value: string };
      ["icon-radio"]: { value: number };
      shouldTakeAt: { value: string };
      shhouldTakeAtDate: { value: Date };
      observations: { value: string };
    };

    const hours = form.shouldTakeAt.value.split(":")[0];
    const minutes = form.shouldTakeAt.value.split(":")[1];
    const shouldTakeAt = new Date(
      new Date(date).setHours(parseInt(hours), parseInt(minutes), 0)
    );

    console.log(shouldTakeAt);
    const newItem = {
      title: form.name.value.toLowerCase(),
      amount: form.amount.value,
      frequency: form.frequency.value,
      useUntil: form["repetitions-radio"].value,
      color: themeList.find((item) => item.name === form["theme-radio"].value)
        ?.color,
      theme: form["theme-radio"].value,
      checked: false,
      icon: iconList[form["icon-radio"].value],
      observations: form.observations.value,
      shouldTakeAtString: form.shouldTakeAt.value,
      date: date,
      dateString: date.toLocaleDateString("pt-Br", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      monthYearString: date.toLocaleDateString("pt-Br", {
        month: "2-digit",
        year: "numeric",
      }),
      yearString: date.toLocaleDateString("pt-Br", {
        year: "numeric",
      }),
      shouldTakeAt: shouldTakeAt,
      createdAt: new Date(),
    };
    console.log(newItem);

    onSubmit(newItem);
  }

  const [showScan, setShowScan] = useState(false);

  const [scanResult, setScanResult] = useState<null | string>(null);

  const [name, setName] = useState("");

  function handleScanClick() {
    setShowScan(!showScan);
  }
  function onNewScanResult(decodedText: string) {
    console.log(decodedText);
    if (decodedText && decodedText !== "") {
      console.log("decoded");
      //   setScanResult(decodedText);
      setName(decodedText);
      setShowScan(false);
    }
  }

  function handleNameChange(event: any) {
    setName(event.currentTarget.value);
  }

  return (
    <div className=" ">
      <form
        action=""
        onSubmit={handleSubmit}
        className="py-4 bg-skin-fill px-4"
      >
        <div className="flex justify-between items-center">
          <h2 className={`text-lg ${"text-skin-accent"} capitalize`}>
            {date.toLocaleDateString("pt-Br", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </h2>
          <button
            type={"submit"}
            className="rounded-xl font-semibold text-amber-500 border-2 border-amber-400 hover:bg-amber-300 hover:text-skin-inverted px-4 py-2 flex gap-2 items-center active:bg-amber-400 hover:scale-110 transition-transform"
          >
            Salvar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(60svh)] md:max-h-[80svh] overflow-scroll my-4">
          <div className="">
            <div className="relative">
              <input
                type="text"
                id="floating_filled_barCode"
                className="hidden rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={scanResult || ""}
                disabled
              />
              <label
                htmlFor="floating_filled_barCode"
                className="hidden absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Código de Barras:
              </label>
            </div>
            {showScan && (
              <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
              />
            )}
          </div>
          <div className="flex mb-4 gap-2">
            <QueryClientProvider client={queryClient}>
              <NameSearch value={name} onChange={handleNameChange}></NameSearch>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
            <div className="mt-1 mr-1">
              <input
                id={"scanToggle"}
                name={"scanToggle"}
                type="checkbox"
                className="sr-only peer/scan"
                onChange={handleScanClick}
              />
              <label
                htmlFor="scanToggle"
                className="block border-sky-400 border-2 text-skin-accent rounded-xl hover:text-skin-inverted hover:bg-sky-300 hover:scale-110 active:bg-skin-accent-fill peer-checked/scan:bg-skin-accent-fill peer-checked/scan:text-skin-inverted"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                  />
                </svg>
              </label>
            </div>
          </div>

          <div className=" hidden relative z-0 my-4">
            <input
              type="text"
              id="concentration"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="concentration"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Concentração
            </label>
          </div>
          <div className="md:flex items-center my-4 gap-8 relative isolate">
            <div className="relative z-0 my-4">
              <input
                type="text"
                id="amount"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="amount"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Quantidade
              </label>
            </div>

            <FrequencyInput></FrequencyInput>
          </div>

          <div className="">
            <TimePicker></TimePicker>
          </div>

          <RepetitionInput date={date}></RepetitionInput>
          <div className="">
            <div className="relative">
              <div
                id="floating_outlined_colors"
                className="my-8 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 "
                placeholder=" "
              >
                <div className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] justify-items-center">
                  {colorList.map((item, i) => (
                    <div key={`theme-radio-${i}`} className="py-4">
                      <input
                        id={`theme-radio-${i}`}
                        type="radio"
                        name="theme-radio"
                        className="peer hidden"
                        value={item.name}
                      />
                      <label
                        htmlFor={`theme-radio-${i}`}
                        className={`rounded-lg ${item.color} block h-10 w-10 peer-checked:ring-4 ring-amber-300`}
                      ></label>
                    </div>
                  ))}
                </div>
              </div>
              <label
                htmlFor="floating_outlined"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-2 z-10 origin-[0] bg-skin-fill dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Tema:
              </label>
            </div>
            <div className="relative">
              <div
                id="floating_outlined_icons"
                className="my-8 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 "
                placeholder=" "
              >
                <div className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] justify-items-center">
                  {iconList.map((item, i) => (
                    <div className="py-4" key={`icon-radio-${i}`}>
                      <input
                        id={`icon-radio-${i}`}
                        type="radio"
                        name="icon-radio"
                        className="peer hidden"
                        value={i}
                      />
                      <label
                        htmlFor={`icon-radio-${i}`}
                        className={`rounded-lg block h-10 w-10 peer-checked:ring-4 ring-amber-300 relative`}
                      >
                        <Image src={item} alt={""}></Image>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <label
                htmlFor="floating_outlined"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4  top-2 z-10 origin-[0] bg-skin-fill dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Ícone:
              </label>
            </div>
          </div>
          <label
            htmlFor="observations"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Observações:
          </label>
          <textarea
            id="observations"
            name="observations"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          {Array(5)
            .fill("")
            .map((v, i) => (
              <div key={`fill-${i}`} className="h-12 py-4"></div>
            ))}
        </div>
      </form>
    </div>
  );
}
