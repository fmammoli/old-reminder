export default function Hole({ fade = false }: { fade?: boolean }) {
  const fittings = {
    perfect: "w-[8.50rem] h-[8.50rem]",
    cool: "w-36 h-36",
  };

  return (
    <div
      className={`z-1 rounded-full opacity-100 transition-shadow ease-in-out duration-200 pointer-events-none  ${
        fittings.perfect
      } ${
        fade === true
          ? "delay-[180ms]"
          : "shadow-[inset_9.91px_9.91px_15px_#D9DADE_,_inset_-9.91px_-9.91px_15px_#FFFFFF]"
      } `}
    ></div>
  );
}
