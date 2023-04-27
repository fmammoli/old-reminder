import { useEffect, useRef, ReactNode, useState } from "react";
import { PanInfo, motion, useAnimation } from "framer-motion";

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 1000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function BottomSheet({
  isOpen,
  onClose,
  onOpen,
  children,
  popUpDistance = "middle",
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children?: ReactNode;
  popUpDistance?: "top" | "middle";
}) {
  const prevIsOpen = usePrevious(isOpen);
  const controls = useAnimation();

  function onDragEnd(event: MouseEvent, info: PanInfo) {
    const swipe = swipePower(info.offset.y, info.velocity.y);

    if (swipe < -swipeConfidenceThreshold) {
      controls.start("visible");
    } else if (swipe > swipeConfidenceThreshold) {
      controls.start("hidden");
    }

    // const shouldClose =
    //   info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 10);
    // if (shouldClose) {
    //   controls.start("hidden");
    //   onClose();
    // } else {
    //   controls.start("visible");
    //   onOpen();
    // }
  }

  // useEffect(() => {
  //   if (prevIsOpen && !isOpen) {
  //     controls.start("hidden");
  //   } else if (!prevIsOpen && isOpen) {
  //     controls.start("visible");
  //   }
  // }, [controls, isOpen, prevIsOpen]);

  const containerRef = useRef<null | HTMLDivElement>(null);
  const [constrains, setConstrains] = useState([0, 0]);

  useEffect(() => {
    if (containerRef.current) {
      if (containerRef.current.offsetParent) {
        const diff =
          (containerRef.current.offsetParent as HTMLElement).offsetHeight -
          containerRef.current.offsetTop;
        const heigth =
          (containerRef.current.offsetParent as HTMLElement).offsetHeight -
          diff -
          64;
        console.log(heigth);
        setConstrains([heigth, 0]);
      }
    }
  }, [isOpen]);

  return (
    <div className="w-full " ref={containerRef}>
      <motion.div
        drag="y"
        dragConstraints={{ top: -constrains[0], bottom: 0 }}
        onDragEnd={onDragEnd}
        initial="hidden"
        animate={controls}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 400,
        }}
        variants={{
          visible: (height) => {
            return {
              y: -constrains[0],
            };
          },
          hidden: (height) => {
            return { y: 0 };
          },
        }}
        custom={containerRef.current?.offsetHeight}
        dragElastic={0.2}
        className="absolute w-full rounded-t-lg transition-colors h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
}

function usePrevious(value: boolean) {
  const previousValueRef = useRef<boolean>(false);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
}
