import { useEffect, useRef, ReactNode, useState } from "react";
import { PanInfo, motion, useAnimation, useDragControls } from "framer-motion";

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
  const controls = useAnimation();

  function onDragEnd(event: MouseEvent, info: PanInfo) {
    const swipe = swipePower(info.offset.y, info.velocity.y);

    if (swipe < -swipeConfidenceThreshold) {
      controls.start("visible");
    } else if (swipe > swipeConfidenceThreshold) {
      controls.start("hidden");
    }

    // if (swipe !== 0) {
    //   if (swipe < -swipeConfidenceThreshold) {
    //     controls.start("visible");
    //   } else if (swipe > swipeConfidenceThreshold) {
    //     controls.start("hidden");
    //   }
    // } else {
    //   if (info.offset.y < 0) {
    //     controls.start("visible");
    //   }
    //   if (info.offset.y > 0) {
    //     controls.start("hidden");
    //   }
    // }
  }
  const containerRef = useRef<null | HTMLDivElement>(null);
  const [constrains, setConstrains] = useState([0, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const parent = container.offsetParent as HTMLElement;
      if (parent) {
        const diff = parent.offsetHeight - container.offsetTop;
        const height = parent.offsetHeight - diff - 64;
        setConstrains([height, 0]);
      }
    }
  }, [isOpen, containerRef]);

  const control = useDragControls();
  return (
    <div className="w-full" ref={containerRef}>
      <motion.div
        id="draggableBottomSheet"
        drag="y"
        dragControls={control}
        dragConstraints={{ top: -constrains[0], bottom: 0 }}
        onDragStart={(e, info) => {
          if (
            //@ts-ignore
            !e.target?.parentElement?.parentElement.classList.contains(
              "draggableBottomSheet"
            )
          ) {
            //@ts-ignore
            control.componentControls.forEach((entry) => entry.stop(e, info));
            console.log(control);
          }
          // console.log(e.target);
          // console.log(control);
        }}
        onDragEnd={onDragEnd}
        initial="hidden"
        animate={controls}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 600,
        }}
        variants={{
          visible: () => {
            return {
              y: -constrains[0],
            };
          },
          hidden: () => {
            return { y: 0 };
          },
        }}
        dragElastic={0.2}
        className="draggableBottomSheet absolute w-full rounded-t-lg transition-colors h-screen"
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
