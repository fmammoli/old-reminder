import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, memo, useRef } from "react";

const fill = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 50% 45%)`,
    transition: {
      delay: 0.45,
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 50% 45%)",
    transition: {
      type: "spring",
      delay: 0,
      stiffness: 400,
      damping: 40,
    },
  },
  preserved: {
    backgroundColor: "#00000",

    transition: {
      type: "spring",
      delay: 0,
      stiffness: 1000,
      damping: 10,
    },
  },
};

const colorVariants = {
  visible: {
    backgroundColor: ["bg-rose-400", "bg-sky-400"],
    transition: {
      duration: "1s",
    },
  },
};

export const FillBackground = memo(FillBackgroundBase2);

export function FillBackgroundBase2({
  color = "bg-gray-400",
  children,
  isVisible,
  preserve,
}: {
  children?: ReactNode;
  color?: string;
  isVisible: boolean;
  preserve?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useRef({ height: 0, width: 0 });

  console.log(dimensions.current.height);
  return (
    <>
      <motion.div
        ref={containerRef}
        id="fillBackgroundContainer"
        custom={dimensions.current.height}
        className={`absolute w-full h-full ${preserve ? color : ""}`}
      >
        {false ? (
          <motion.div
            id="fillBackground"
            className={`absolute w-full h-full`}
          ></motion.div>
        ) : (
          <AnimatePresence>
            {isVisible && (
              <motion.div
                key={"myAnimation"}
                id="fillBackground"
                variants={fill}
                initial={"closed"}
                animate={"open"}
                exit={"closed"}
                className={`absolute w-full h-full ${color}`}
                style={{ transition: "background-color 400ms ease-in-out" }}
              ></motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </>
  );
}

// //This is the old way to fill the background, still working
// export function FillBackgroundBase({
//   play,
//   color = "bg-gray-400",
//   children,
//   preserve,
// }: {
//   play: boolean;
//   children?: ReactNode;
//   color?: string;
//   preserve?: boolean;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dimensions = useRef({ height: 0, width: 0 });

//   return (
//     <motion.div
//       ref={containerRef}
//       id="fillBackground"
//       animate={play ? "open" : "closed"}
//       custom={dimensions.current.height}
//     >
//       <motion.div
//         variants={fill}
//         className={`absolute w-full h-full ${color}`}
//       ></motion.div>
//     </motion.div>
//   );
// }

export default FillBackground;
