import { ReactElement, useCallback, useState } from "react";
import { motion, AnimatePresence, Point } from "framer-motion";
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

const transitionOptions = {
  x: { type: "spring", stiffness: 400, damping: 25 },
  opacity: { duration: 0.2 },
};

export default function Gallery({
  children,
  onChange,
  current,
  startAt,
}: {
  current: ReminderType;
  children: ReactElement[] | ReactElement;
  onChange: (reminderId: string, direction: number) => void;
  startAt?: string;
}) {
  let initialPage = 0;
  if (startAt && Array.isArray(children)) {
    initialPage = children.findIndex(
      (item) => item.props.reminderId === startAt
    );
  }
  const [[page, direction], setPage] = useState([initialPage, 0]);

  const [dragging, setDragging] = useState(false);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  let length = 0;
  if (Array.isArray(children)) {
    length = children.length;
  }

  const index = wrap(0, length, page);

  const paginate = useCallback(
    (newDirection: number) => {
      if (Array.isArray(children)) {
        if (page + newDirection < length && page + newDirection >= 0) {
          setPage([page + newDirection, newDirection]);
          onChange(
            children[page + newDirection].props.reminderId,
            newDirection
          );
        }
      }
    },
    [page, setPage, onChange, children, length]
  );

  const handleDragStart = useCallback(
    (e: MouseEvent) => {
      setDragging(true);
    },
    [setDragging]
  );

  const handleDragEnd = useCallback(
    (
      e: MouseEvent,
      { offset, velocity }: { offset: Point; velocity: Point }
    ) => {
      setDragging(false);
      const swipe = swipePower(offset.x, velocity.x);

      if (swipe < -swipeConfidenceThreshold) {
        paginate(1);
      } else if (swipe > swipeConfidenceThreshold) {
        paginate(-1);
      }
    },
    [setDragging, paginate]
  );

  return (
    <>
      <div className="flex justify-between">
        <div className="relative">
          <button
            className="prev absolute left-0 top-24 rounded-lg p-2 mx-1 text-skin-base active:opacity-50 active:bg-[#ffffff50] transition-colors"
            onClick={() => paginate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 align-middle"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              dragSnapToOrigin
              key={page}
              custom={direction}
              variants={variants}
              className="absolute w-full top-12 flex justify-center"
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionOptions}
              onDragStart={handleDragStart}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
            >
              <div
                className={
                  dragging ? "pointer-events-none" : "pointer-events-auto"
                }
              >
                {Array.isArray(children) ? children[index] : children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative">
          <button
            className="prev absolute right-0 top-24 rounded-lg p-2 mx-1 text-skin-base active:opacity-50 active:bg-[#ffffff50] transition-colors"
            onClick={() => paginate(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
