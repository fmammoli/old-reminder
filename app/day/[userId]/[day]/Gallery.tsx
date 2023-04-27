import { ReactElement, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { ReminderType } from "@/app/Types";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Gallery({
  children,
  onChange,
  current,
}: {
  current: ReminderType;
  children: ReactElement[] | ReactElement;
  onChange: (reminderId: string, direction: number) => void;
}) {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  let length = 0;
  if (Array.isArray(children)) {
    length = children.length;
  }

  const index = wrap(0, length, page);
  const paginate = (newDirection: number) => {
    if (Array.isArray(children)) {
      if (page + newDirection < length && page + newDirection >= 0) {
        // console.log(children);
        setPage([page + newDirection, newDirection]);
        onChange(children[page + newDirection].props.reminderId, newDirection);
      }
    }
  };

  return (
    <>
      <div className="absolute flex justify-around items-center py-14">
        <div className="prev" onClick={() => paginate(-1)}>
          {"<"}
        </div>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            className=" bg-white "
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 1000, damping: 20 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            {Array.isArray(children) ? children[index] : children}
          </motion.div>
        </AnimatePresence>
        <div className="next" onClick={() => paginate(1)}>
          {">"}
        </div>
      </div>
    </>
  );
}
