import { ChangeEvent, ReactNode } from "react";

export default function FloatingButton({
  isChecked,
  inputKey,
  onChange,
  color = "bg-rose-400",
  children,
}: {
  isChecked: string;
  inputKey: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  color?: string;
  children?: ReactNode;
}) {
  const fittings = {
    perfect: "translate-y-[0.20rem]",
    cool: "translate-y-[0.50rem]",
  };
  return (
    <div className="flex col ">
      <label htmlFor={inputKey}>
        <input
          id={inputKey}
          type="checkbox"
          className={"hidden z-20"}
          onChange={onChange}
          defaultChecked={false}
        />

        <div
          className={`${
            isChecked === inputKey
              ? `${fittings.perfect} duration-[500ms] scale-95 border-none shadow-none`
              : ""
          } bg-skin-fill -translate-y-4  rounded-full shadow-2xl  transition-all ease-out duration-200 border border-gray-200 p-8 z-10`}
        >
          <div className="relative w-20 h-20 max-w-full flex items-center justify-center">
            <div className={`aspect-square w-14 rounded-full  ${color}`}></div>
            {children}
          </div>
        </div>
      </label>
    </div>
  );
}
