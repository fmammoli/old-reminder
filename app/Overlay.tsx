import { AnimatePresence, motion } from "framer-motion";

export default function Overlay({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id={"overlay"}
          className="absolute h-full w-full top-0 left-0 bg-[#00000000]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>
      )}
    </AnimatePresence>
  );
}
