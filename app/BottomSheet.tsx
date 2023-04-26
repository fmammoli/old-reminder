import { useEffect, useRef, ReactNode } from "react";
import { PanInfo, motion, useAnimation } from "framer-motion";

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
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 10);
    if (shouldClose) {
      controls.start("hidden");
      onClose();
    } else {
      controls.start("visible");
      onOpen();
    }
  }

  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      controls.start("hidden");
    } else if (!prevIsOpen && isOpen) {
      controls.start("visible");
    }
  }, [controls, isOpen, prevIsOpen]);

  const containerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight;
    }
  }, [isOpen]);

  return (
    <motion.div
      drag="y"
      ref={containerRef}
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
            y: "-72svh",
            transition: { delay: 0.18 },
          };
        },
        hidden: (height) => {
          return { y: 0 };
        },
      }}
      custom={containerRef.current?.offsetHeight}
      dragElastic={0.2}
      className="block w-full rounded-t-lg transition-colors  "
    >
      {children}
    </motion.div>
  );
}

function usePrevious(value: boolean) {
  const previousValueRef = useRef<boolean>(false);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
}
