import { useState, ReactNode, useRef, ChangeEvent } from "react";

const frequencies = [
  "1 vez ao dia.",
  "de 12 em 12h.",
  "a cada 8h.",
  "até 4 vezes ao dia.",
];

export default function FrequencyInput({}) {
  const [value, setValue] = useState(frequencies[0]);

  function handlePrev(event: React.MouseEvent<HTMLButtonElement>) {
    const index = frequencies.indexOf(value);
    if (index != -1) {
      if (index > 0) {
        setValue(frequencies[index - 1]);
      }
    }
  }

  function handleNext(event: React.MouseEvent<HTMLButtonElement>) {
    const index = frequencies.indexOf(value);
    if (index != -1) {
      if (index !== frequencies.length - 1) {
        setValue(frequencies[index + 1]);
      }
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return (
    <div className="relative z-0 flex ">
      <MoveButton onClick={handlePrev}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-neutral-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </MoveButton>
      <input
        type="text"
        id="floating_standard_frequency"
        name="frequency"
        className="block text-center py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        value={value}
        onChange={handleChange}
      />
      <label
        htmlFor="frequency"
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      ></label>
      <MoveButton onClick={handleNext}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-neutral-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </MoveButton>
    </div>
  );
}

function MoveButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1 border-2 border-neutral-200 bg-neutral-100 rounded-full shadow-md hover:scale-110 active:bg-neutral-300"
    >
      {children}
    </button>
  );
}
