import {
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "react-query";
import { useDebounce } from "use-debounce";
import Downshift, { useCombobox } from "downshift";
import { ViewportList } from "react-viewport-list";

async function fetchSearchData() {
  const res = await fetch("/api/hello");
  console.log(res);
  return res.json();
}

const queryClient = new QueryClient();

export default function NameSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const queryClient = useQueryClient();

  const { status, data, error, isFetching } = useQuery(
    "searchData",
    fetchSearchData
  );

  // const fuse = new Fuse(data, { keys: ["value"] });

  const [text, setText] = useState("");

  const [debouncedValue] = useDebounce(text, 200);

  function getDataFilter(inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function Filter(item: { value: string }) {
      return (
        !inputValue || item.value.toLowerCase().includes(lowerCasedInputValue)
        // book.title.toLowerCase().includes(lowerCasedInputValue) ||
        // book.author.toLowerCase().includes(lowerCasedInputValue)
        // !inputValue || fuse.search(lowerCasedInputValue)
      );
    };
  }

  const ref = useRef<null | HTMLDivElement>(null);

  function ComboBox() {
    const [items, setItems] = useState<{ value: string }[]>(
      data || [{ value: "" }]
    );
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
        if (inputValue?.length && inputValue.length > 0) {
          setItems(data.filter(getDataFilter(inputValue ? inputValue : "")));
        }
      },
      items,
      itemToString(item) {
        return item ? item.value : "";
      },
    });

    return (
      <>
        <QueryClientProvider client={queryClient}>
          <div className="relative w-full">
            <div className="relative flex flex-col gap-1">
              <div className="flex shadow-sm bg-white gap-0.5">
                <input
                  id="name"
                  name="name"
                  placeholder=" "
                  className="w-full p-1.5 block rounded-t-lg px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  {...getInputProps()}
                />
                <label
                  className="w-fit absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  {...getLabelProps()}
                >
                  Nome do medicamento:
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
            <div
              className={`absolute w-full bg-white mt-1 shadow-md flex flex-col max-h-80 overflow-y-scroll  p-0 z-20 ${
                !(isOpen && items.length) && "hidden"
              }`}
              ref={ref}
              {...getMenuProps()}
            >
              {isOpen && isFetching && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}

              {isOpen && status === "success" && (
                <ViewportList items={items}>
                  {(item, index) => (
                    <div key={item.value} className="item">
                      <div
                        className={[
                          highlightedIndex === index && "bg-blue-300",
                          selectedItem === item && "font-bold",
                          "py-2 px-3 shadow-sm flex flex-col",
                        ].join(" ")}
                        key={`${item.value}${index}`}
                        {...getItemProps({ item, index })}
                      >
                        <span className="text-sm text-gray-700">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  )}
                </ViewportList>
              )}
            </div>
          </div>
        </QueryClientProvider>
      </>
    );
  }
  return <ComboBox></ComboBox>;
}
