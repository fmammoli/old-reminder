import { PanInfo, motion, useAnimate, useMotionValue } from "framer-motion";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";

export default function Slider({
  data,
  children,
  onSlideChange,
}: {
  data: any[];
  children: ReactNode;
  onSlideChange?: (current: number) => void;
}) {
  const x = useMotionValue(0);
  const dragContrainsRef = useRef<null | HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const [current, setCurrent] = useState(0);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (dragContrainsRef && dragContrainsRef.current) {
      setCarouselWidth(
        dragContrainsRef.current.scrollWidth -
          dragContrainsRef.current.offsetWidth
      );
    }
  }, []);

  function handleOnDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    console.log(info);
    console.log("grab");
    if (dragContrainsRef && dragContrainsRef.current) {
      const offsetX = info.offset.x;
      const clientWidth = dragContrainsRef.current.clientWidth;

      if (info.delta.x == 0) {
        if (offsetX < 0) {
          if (Math.abs(info.velocity.x) > 3) {
            nextView(current + 1);
          } else {
            if (Math.abs(offsetX) > clientWidth / 10) {
              nextView(current + 1);
            } else {
              nextView(current);
            }
          }
        } else {
          if (Math.abs(info.velocity.x) > 3) {
            prevView(current - 1);
          } else {
            if (Math.abs(offsetX) > clientWidth / 10) {
              prevView(current - 1);
            } else {
              prevView(current);
            }
          }
        }
      } else {
        if (info.delta.x > 0) {
          prevView(current - 1);
        } else {
          nextView(current + 1);
        }
      }
    }
  }

  function nextView(viewNumber: number) {
    if (dragContrainsRef && dragContrainsRef.current) {
      const clientWidth = dragContrainsRef.current.clientWidth;
      if (current < data.length - 2) {
        console.log("going to next");
        console.log(
          `clinetWidth: ${clientWidth}  current:${viewNumber}  res=${
            -clientWidth * viewNumber
          }`
        );
        console.log("to snap");
        animate(scope.current, {
          x: -clientWidth * viewNumber,
          type: "spring",
        });
        // x.set(-clientWidth * (current + 1));
        setCurrent(current + 1);
        onSlideChange && onSlideChange(current + 1);
      }
    }
  }

  function prevView(viewNumber: number) {
    if (dragContrainsRef && dragContrainsRef.current) {
      const clientWidth = dragContrainsRef.current.clientWidth;
      if (current > 0) {
        console.log("going to prev");
        console.log(
          `clinetWidth: ${clientWidth}  current:${viewNumber}  res=${
            -clientWidth * viewNumber
          }`
        );
        console.log("to snap back");
        animate(scope.current, {
          x: -clientWidth * viewNumber,
          type: "spring",
        });
        // x.set(-clientWidth * (current - 1));
        setCurrent(current - 1);

        onSlideChange && onSlideChange(current - 1);
      }
    }
  }

  return (
    <>
      <div className="absolute flex justify-center w-full">
        <button
          onClick={(e) => prevView(current - 1)}
          className="hover:opacity-50 active:opacity-30 transition-color"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <motion.div
          id="carousel"
          className="overflow-hidden flex-grow"
          ref={dragContrainsRef}
        >
          <motion.div
            id="innerCarousel"
            drag="x"
            className="flex cursor-grab active:cursor-grabbing"
            dragConstraints={{ right: 0, left: -carouselWidth }}
            onDragEnd={handleOnDragEnd}
            dragTransition={{
              power: 1,
              timeConstant: 700,
              bounceStiffness: 100,
            }}
            ref={scope}
          >
            {children}
          </motion.div>
        </motion.div>

        <button
          onClick={(e) => nextView(current + 1)}
          className="hover:opacity-50 active:opacity-30 transition-color"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
