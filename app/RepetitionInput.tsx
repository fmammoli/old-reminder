export default function RepetitionInput({ date }: { date: Date }) {
  const repetitionList = [
    "1 dia",
    "3 dias",
    "5 dias",
    "7 dias",
    "15 dias",
    "1 mês",
    "uso contínuo",
  ];
  return (
    <div className="relative">
      <div
        id="floating_outlined_repetitions"
        className="my-8 block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 "
        placeholder=" "
      >
        <div className="flex items-center justify-evenly flex-wrap">
          {repetitionList.map((item, i) => (
            <div key={`repetitions-radio-${i}`} className="py-4">
              <input
                id={`repetitions-radio-${i}`}
                type="radio"
                name="repetitions-radio"
                className="peer hidden"
                value={item}
              />
              <label
                htmlFor={`repetitions-radio-${i}`}
                className={`cursor-pointer text-sm text-sky-600 rounded-lg ${item} block border-2 border-sky-300 px-2 py-1 peer-checked:bg-skin-accent-fill peer-checked:text-skin-inverted peer-checked:ring-2 ring-sky-400 `}
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>
      <label
        htmlFor="floating_outlined"
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-2 z-10 origin-[0] bg-skin-fill dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        Tempo de uso
      </label>
    </div>
  );
}
