import { useState, useEffect, useRef, ReactNode } from "react";
import ReactDOM from "react-dom";
import { PanInfo, motion, useAnimation } from "framer-motion";

export function BottomSheet({
  isOpen,
  onClose,
  onOpen,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children?: ReactNode;
}) {
  const prevIsOpen = usePrevious(isOpen);
  const controls = useAnimation();

  function onDragEnd(event: MouseEvent, info: PanInfo) {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
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

  return (
    <motion.div
      drag="y"
      onDragEnd={onDragEnd}
      initial="hidden"
      animate={controls}
      transition={{
        type: "spring",
        damping: 40,
        stiffness: 400,
      }}
      variants={{
        visible: { y: "-50%" },
        hidden: { y: 0 },
      }}
      dragConstraints={{}}
      dragElastic={0.2}
      className="inline-block w-full rounded-t-lg "
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
