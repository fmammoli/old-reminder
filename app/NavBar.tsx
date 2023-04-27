import Image from "next/image";
export default function NavBar({
  loggedIn,
  photoURL = "https://ui-avatars.com/api/?size=32",
  onLogin,
  onLogout,
}: {
  loggedIn: boolean;
  photoURL?: string;
  onLogin: () => void;
  onLogout: () => void;
}) {
  return (
    <nav className="flex justify-between items-center max-w-2xl mx-auto pt-2 isolate">
      <label htmlFor="dropdownMenu" className="relative">
        <input id={"dropdownMenu"} type="checkbox" className="hidden peer" />
        <div
          className="relative rounded-full shadow-md active:bg-gray-200 flex justify-center items-center "
          data-dropdown-toggle="dropdown"
        >
          {!loggedIn ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-400 stroke-[0.8]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <div className="relative border-1 border-gray-200 rounded-full">
              <Image
                src={photoURL}
                alt={"Profile picture"}
                height={48}
                width={48}
                className="rounded-full"
              ></Image>
            </div>
          )}
        </div>

        <div
          id="dropdown"
          className="absolute hidden -z-1 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 peer-checked:block"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
            onClick={() => console.log("ul")}
          >
            {!loggedIn && (
              <li>
                <button
                  onClick={onLogin}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Login with Google
                </button>
              </li>
            )}

            {loggedIn && (
              <li>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </div>
      </label>

      <div>
        <h1 className="font-sans text-2xl text-skin-accent font-extrabold decoration-wavy decoration-yellow-400 underline">
          Reminder
        </h1>
      </div>
      <button className="relative w-12 h-12 rounded-full text-neutral-500 flex justify-center items-center ">
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
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
          />
        </svg>
      </button>
    </nav>
  );
}
