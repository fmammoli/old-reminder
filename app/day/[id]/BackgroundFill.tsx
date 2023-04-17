import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, memo, useEffect, useRef } from "react";

const fill = {
  open: ({ height = 1000 }) => {
    // console.log("open");
    return {
      clipPath: `circle(${1000 * 2 + 200}px at 50% 20rem)`,
      transition: {
        delay: 0.45,
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    };
  },
  closed: () => {
    // console.log("closed");
    return {
      clipPath: "circle(30px at 50% 19rem)",
      transition: {
        type: "spring",
        delay: 0,
        stiffness: 400,
        damping: 40,
      },
    };
  },
  fadeOut: ({ color }: { color: string }) => {
    // console.log("fadeOut");
    return {
      backgroundColor: ["#0000", "#ffff"],
      transition: { duration: 1000 },
    };
  },
};

export const FillBackground = memo(FillBackgroundBase);

export function FillBackgroundBase({
  color = "bg-gray-400",
  children,
  isVisible,
  fadeOut = false,
}: {
  children?: ReactNode;
  color?: string;
  isVisible: boolean;
  fadeOut?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useRef({ height: 0, width: 0 });

  return (
    <>
      <motion.div
        ref={containerRef}
        id="fillBackgroundContainer"
        className={`absolute w-full h-full top-0 left-0`}
        custom={dimensions.current.height}
      >
        {false ? (
          <motion.div
            id="fillBackground"
            className={` w-full h-full`}
          ></motion.div>
        ) : (
          <AnimatePresence>
            {isVisible && (
              <motion.div
                key={"myAnimation"}
                id="fillBackgroundInner"
                variants={fill}
                initial={"closed"}
                animate={"open"}
                exit={"closed"}
                className={`w-full h-full ${color} transition-colors duration-700`}
                custom={{ height: dimensions.current.height, color: color }}
              ></motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </>
  );
}
export default FillBackgroundBase;
