import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDebounce } from "use-debounce";

async function searchMedicines(text: string) {
  const result = await fetch(`https://bula.vercel.app/pesquisar?nome=${text}`);

  return result.json();
}

export default function NameSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const [debouncedValue] = useDebounce(text, 200);

  // Queries
  const { data, status } = useQuery("medicines", () =>
    searchMedicines(debouncedValue)
  );

  function handleChange(event: any) {
    setText(event.target.value);
  }

  //   useEffect(() => {
  //     async function SearchMedicine(text: string) {
  //       try {
  //         const result = await fetch(
  //           `https://bula.vercel.app/pesquisar?nome=${text}`
  //         );
  //         const data = await result.json();
  //         return data;
  //       } catch (error) {
  //         throw new Error("Error");
  //       }
  //     }
  //     if (input.length > 2) {
  //       SearchMedicine(input).then((r) => console.log(r));
  //     }
  //   }, [input]);

  return (
    <>
      <div className="relative w-full">
        <input
          type="text"
          id="name"
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          onChange={handleChange}
        />
        <p>{debouncedValue}</p>
        <p>{text}</p>

        <label
          htmlFor="name"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          Nome do remédio
        </label>
        {text !== "" && (
          <div className="absolute z-10 mt-2 overflow-hidden rounded-md bg-white w-full border-[1px] border-grey-200">
            <div className="cursor-pointer py-2 px-3 hover:bg-slate-100">
              <p className="text-sm font-medium text-gray-600">Amoxicilina</p>
              <p className="text-sm text-gray-500">Medley</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
