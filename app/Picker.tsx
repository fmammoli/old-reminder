import { motion, useAnimate } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";

const ITEM_HEIGHT = 28;

export default function Picker({
  data = [1, 2, 3, 4, 5],
  name = "default",
  start = 10,
  children,
  onChange,
}: {
  name: string;
  start: number;
  data?: any[];
  children?: ReactNode;
  onChange?: (newValue: string, name: string) => void;
}) {
  const [scope, animate] = useAnimate();
  const dragContrainsRef = useRef<null | HTMLDivElement>(null);

  const [carouselHeight, setCarouselHeight] = useState<number>(0);

  useEffect(() => {
    if (dragContrainsRef && dragContrainsRef.current) {
      setCarouselHeight(
        dragContrainsRef.current.scrollHeight -
          dragContrainsRef.current.offsetHeight
      );
    }
  }, []);

  function handleChange(inView: boolean, entry: IntersectionObserverEntry) {
    if (inView) {
      // setValue(
      //   (entry.target.lastElementChild as HTMLElement).dataset
      //     .timeValue || ""
      // );
      onChange &&
        onChange(
          (entry.target.lastElementChild as HTMLElement).dataset.timeValue ||
            "",
          name
        );
    }
  }

  return (
    <div className="relative bg-gray-50 isolate flex flex-col justify-center items-center max-h-36 rounded-lg shadow-inner border-2 border-gray-100">
      <div id="carousel" className="overflow-hidden" ref={dragContrainsRef}>
        <motion.div
          id="innerCarousel"
          drag="y"
          className="cursor-grab active:cursor-grabbing px-10 w-full"
          dragConstraints={{
            top: -carouselHeight - 2 * ITEM_HEIGHT,
            bottom: 0 + 2 * ITEM_HEIGHT,
          }}
          dragTransition={{
            power: 1,
            timeConstant: 700,
            bounceStiffness: 100,
          }}
          initial={{ y: -ITEM_HEIGHT * 2 }}
          animate={
            start !== undefined && {
              y: start * -ITEM_HEIGHT + 2 * ITEM_HEIGHT,
            }
          }
          ref={scope}
          dragMomentum={true}
        >
          {data.map((item, i) => (
            <InView
              root={dragContrainsRef.current}
              rootMargin="-49% 0px -49% 0px"
              key={`${name}-${i}`}
              onChange={handleChange}
            >
              {({ inView, ref, entry }) => (
                <motion.div
                  ref={ref}
                  animate={
                    inView
                      ? { opacity: 1, scale: 1.1, color: "#f59e0b" }
                      : { opacity: 0.3, scale: 0.6, color: "#6b7280" }
                  }
                  initial={{ opacity: 0.4, scale: 0.6, color: "#6b7280" }}
                  className="flex justify-center "
                >
                  <p className="text-xl font-bold" data-time-value={item}>
                    {item}
                  </p>
                </motion.div>
              )}
            </InView>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
