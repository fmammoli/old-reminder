import { PanInfo, motion, useMotionValue } from "framer-motion";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";

export default function Slider({
  data,
  children,
}: {
  data: any[];
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const dragContrainsRef = useRef<null | HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const [current, setCurrent] = useState(0);

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
      if (offsetX < 0) {
        if (Math.abs(offsetX) > clientWidth / 20) {
          nextView(current);
        }
      } else {
        if (Math.abs(offsetX) > clientWidth / 20) {
          prevView(current);
        }
      }
    }
  }

  function nextView(current: number) {
    if (dragContrainsRef && dragContrainsRef.current) {
      const clientWidth = dragContrainsRef.current.clientWidth;
      if (current < data.length - 1) {
        console.log("going to next");
        console.log(
          `clinetWidth: ${clientWidth}  current:${current}  res=${
            -clientWidth * (current + 1)
          }`
        );
        x.set(-clientWidth * (current + 1));
        setCurrent(current + 1);
      }
    }
  }

  function prevView(current: number) {
    if (dragContrainsRef && dragContrainsRef.current) {
      const clientWidth = dragContrainsRef.current.clientWidth;
      if (current > 0) {
        console.log("going to prev");
        console.log(
          `clinetWidth: ${clientWidth}  current:${current}  res=${
            -clientWidth * (current - 1)
          }`
        );
        x.set(-clientWidth * (current - 1));
        setCurrent(current - 1);
      }
    }
  }

  return (
    <>
      <div className="absolute flex justify-center w-full">
        <button onClick={(e) => prevView(current)}>Prev</button>
        <motion.div
          id="carousel"
          className="overflow-x-auto flex-grow"
          ref={dragContrainsRef}
        >
          <motion.div
            id="innerCarousel"
            drag="x"
            className="flex cursor-grab transition-all"
            style={{ x }}
            dragConstraints={{ right: 0, left: -carouselWidth }}
            onDragEnd={handleOnDragEnd}
          >
            {children}
          </motion.div>
        </motion.div>

        <button onClick={(e) => nextView(current)}>Next</button>
      </div>
    </>
  );
}
