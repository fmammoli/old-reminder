import { Agent } from "https";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useDebounce } from "use-debounce";
import Downshift, { useCombobox } from "downshift";

// import d from "/public/data.json";

const books = [
  { author: "Harper Lee", title: "To Kill a Mockingbird" },
  { author: "Lev Tolstoy", title: "War and Peace" },
  { author: "Fyodor Dostoyevsy", title: "The Idiot" },
  { author: "Oscar Wilde", title: "A Picture of Dorian Gray" },
  { author: "George Orwell", title: "1984" },
  { author: "Jane Austen", title: "Pride and Prejudice" },
  { author: "Marcus Aurelius", title: "Meditations" },
  { author: "Fyodor Dostoevsky", title: "The Brothers Karamazov" },
  { author: "Lev Tolstoy", title: "Anna Karenina" },
  { author: "Fyodor Dostoevsky", title: "Crime and Punishment" },
];

async function fetchSearchData() {
  console.log("alo");
  const res = await fetch("data.json");
  console.log(res);
  return res.json();
}

export default function NameSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  // console.log(d);
  // const queryClient = useQueryClient();
  // const query = useQuery("searchData", fetchSearchData);
  // console.log(query);
  const [text, setText] = useState("");

  const [debouncedValue] = useDebounce(text, 200);

  // useEffect(() => {
  //   async function fetchSearchData() {
  //     console.log("alo");
  //     const res = await fetch("/public/data.json");
  //     console.log(res);
  //     return res.json();
  //   }
  //   fetchSearchData();
  // }, []);

  function getBooksFilter(inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function booksFilter(book: { title: string; author: string }) {
      return (
        !inputValue ||
        book.title.toLowerCase().includes(lowerCasedInputValue) ||
        book.author.toLowerCase().includes(lowerCasedInputValue)
      );
    };
  }

  function ComboBox() {
    const [items, setItems] = useState(books);
    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem,
    } = useCombobox({
      onInputValueChange({ inputValue }) {
        setItems(books.filter(getBooksFilter(inputValue ? inputValue : "")));
      },
      items,
      itemToString(item) {
        return item ? item.title : "";
      },
    });
    return (
      <>
        <div className="relative w-full">
          <div className="relative flex flex-col gap-1">
            <div className="flex shadow-sm bg-white gap-0.5">
              <input
                placeholder=" "
                className="w-full p-1.5 block rounded-t-lg px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                {...getInputProps()}
              />
              <label
                className="w-fit absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                {...getLabelProps()}
              >
                Choose your favorite book:
              </label>
              <button
                aria-label="toggle menu"
                className="px-2"
                type="button"
                {...getToggleButtonProps()}
              >
                {isOpen ? <>&#8593;</> : <>&#8595;</>}
              </button>
            </div>
          </div>
          <ul
            className={`absolute w-full bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-20 ${
              !(isOpen && items.length) && "hidden"
            }`}
            {...getMenuProps()}
          >
            {isOpen &&
              items.map((item: any, index) => (
                <li
                  className={[
                    highlightedIndex === index && "bg-blue-300",
                    selectedItem === item && "font-bold",
                    "py-2 px-3 shadow-sm flex flex-col",
                  ].join(" ")}
                  key={`${item.value}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <span>{item.title}</span>
                  <span className="text-sm text-gray-700">{item.author}</span>
                </li>
              ))}
          </ul>
        </div>
      </>
    );
  }
  return <ComboBox></ComboBox>;
}
// {text !== "" && (
//   <div className="absolute z-10 mt-2 overflow-hidden rounded-md bg-white w-full border-[1px] border-grey-200">
//     <div className="cursor-pointer py-2 px-3 hover:bg-slate-100">
//       <p className="text-sm font-medium text-gray-600">Amoxicilina</p>
//       <p className="text-sm text-gray-500">Medley</p>
//     </div>
//   </div>
// )}
