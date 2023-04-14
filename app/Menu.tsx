export default function Menu() {
  return (
    <nav className="flex justify-between items-center px-4 py-4 text-skin-base transition-colors ease-in-out delay-[150ms] duration-[400ms]">
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
  );
}
