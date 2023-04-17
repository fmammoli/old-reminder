import { AnimatePresence, motion } from "framer-motion";

const variants = {
  initial: {
    scale: 1,
    y: "-3rem",
    transition: { delay: 0.5 },
  },
  drop: {
    scale: 0.7,
    y: 0,
    fontWeight: 100,
    transition: {
      delay: 0.2,
    },
  },
};

export default function ScheduledTime({
  scheduledTo,
  checkedAt,
  preserve,
}: {
  scheduledTo: string;
  checkedAt?: string | undefined;
  preserve?: boolean;
}) {
  return (
    <div className="mx-auto max-w-md text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={checkedAt && { opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0, delay: 0 } }}
      >
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-5xl min-h-[3rem] font-light font-sans text-skin-accent transition-colors delay-skin-alternate-close ease-in-out">
            {checkedAt}
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 font-sans text-skin-check"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </motion.div>

      <div className=" flex justify-center items-center gap-2 ">
        <motion.div
          variants={variants}
          initial={"initial"}
          animate={checkedAt && "drop"}
          className="mx-auto max-w-md text-center flex justify-center items-center gap-2 "
        >
          <h2
            className={`${
              !checkedAt ? "text-skin-accent" : "text-skin-base"
            } text-5xl font-sans transition-colors delay-skin-alternate-close ease-in-out`}
          >
            {scheduledTo}
          </h2>
          <label htmlFor="alarm" className="">
            <input type="checkbox" id="alarm" className=" peer hidden" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                !checkedAt ? "text-skin-inverted " : "text-skin-base"
              } w-10 h-10  transition-colors delay-skin-alternate-close ease-in-out`}
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
        </motion.div>
      </div>
    </div>
  );
}
