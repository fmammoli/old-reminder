import { useRef, useState } from "react";
import Picker from "./Picker";

const hours = new Array(24).fill(0).map((item, i) => {
  if (i < 10) return `0${i}`;
  return i.toString();
});

const minutes = new Array(60).fill(0).map((item, i) => {
  if (i < 10) return `0${i}`;
  return i.toString();
});

const repetitionList = [
  { text: "ao acordar", value: "07:00" },
  { text: "manhã", value: "10:30" },
  { text: "no almoço", value: "12:30" },
  { text: "à tarde", value: "16:00" },
  { text: "à noite", value: "19:00" },
  { text: "antes de dormir", value: "22:30" },
];

export default function TimePicker({}: {}) {
  const now = new Date()
    .toLocaleTimeString("pt-Br", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .split(":");
  const hour = hours.indexOf(now[0]);
  const minute = minutes.indexOf(now[1]);
  console.log(hour + ":" + minute);
  const [valueHourIndex, setValueHourIndex] = useState(0);
  const [valueMinuteIndex, setValueMinuteIndex] = useState(0);

  function handleButtonChange(event: any) {
    const buttonValue = event.target.value;

    const hour = buttonValue.split(":")[0];
    const hourIndex = hours.indexOf(hour);

    const minute = buttonValue.split(":")[1];
    const minuteIndex = minutes.indexOf(minute);

    setValueHourIndex(hourIndex);
    setValueMinuteIndex(minuteIndex);
  }

  const valueRef = useRef({ hour: "00", minutes: "00" });
  const [value, setValue] = useState("00:00");

  function handleChange(newValue: string, from: string) {
    if (from === "hours") {
      valueRef.current = { ...valueRef.current, hour: newValue };

      setValue((v) => {
        return `${newValue}:${v.split(":")[1]}`;
      });
    }
    if (from === "minutes") {
      valueRef.current = { ...valueRef.current, minutes: newValue };

      setValue((v) => {
        return `${v.split(":")[0]}:${newValue}`;
      });
    }

    console.log(valueRef.current);
  }
  return (
    <div>
      <div className="relative">
        <div
          id="floating_outlined_repetitions"
          className="my-8 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 "
          placeholder=" "
        >
          <div className="flex items-center justify-evenly flex-wrap">
            {repetitionList.map((item, i) => (
              <div key={`time-picker-radio-${i}`} className="py-4">
                <input
                  id={`time-picker-radio-${i}`}
                  type="radio"
                  name="time-picker-radio"
                  className="peer hidden"
                  value={item.value}
                  onChange={handleButtonChange}
                />
                <label
                  htmlFor={`time-picker-radio-${i}`}
                  className={`cursor-pointer text-sm text-sky-600 rounded-lg ${item} block border-2 border-sky-300 px-2 py-1 peer-checked:bg-skin-accent-fill peer-checked:text-skin-inverted peer-checked:ring-2 ring-sky-400 `}
                >
                  {item.text}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Picker
              name={"hours"}
              data={hours}
              start={valueHourIndex}
              onChange={handleChange}
            ></Picker>
            <Picker
              name={"minutes"}
              data={minutes}
              start={valueMinuteIndex}
              onChange={handleChange}
            ></Picker>
          </div>
        </div>
        <input
          type="text"
          id={"shouldTakeAt"}
          name={"shouldTakeAt"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="hidden"
        />
        <label
          htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-2 z-10 origin-[0] bg-skin-fill dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          Horário
        </label>
      </div>
    </div>
  );
}
