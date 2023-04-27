import { ReactNode } from "react";

export default function FloatingButton({
  reminderId,
  isChecked,
  inputKey = "check",
  onChange,
  color,
  children,
}: {
  reminderId: string;
  isChecked: boolean;
  inputKey?: string;
  onChange: (reminderId: string, event: any) => void;
  color: string;
  children?: ReactNode;
}) {
  const fittings = {
    perfect: "translate-y-2",
    cool: "translate-y-[0.50rem]",
  };

  function handleChange(event: any) {
    onChange(reminderId, event);
    // if (event.detail < 2 && isChecked) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   console.log("prevented");
    // } else {
    //   console.log("unprevented");
    // }
  }
  // console.log(isChecked);
  return (
    <div className="flex col">
      <label htmlFor={inputKey}>
        <div
          className={`${
            isChecked
              ? `${fittings.perfect} duration-[500ms] border-none shadow-none scale-[90%]`
              : " -translate-y-8 shadow-2xl"
          } focus:translate-y-[0.5rem] w-[146px] h-[146px] flex justify-center items-center  cursor-pointer bg-skin-fill  rounded-full transition-all ease-out duration-200 border border-gray-200  z-10 will-change-[shadow]`}
        >
          <input
            id={inputKey}
            type="checkbox"
            className={"hidden z-20"}
            onChange={handleChange}
            defaultChecked={false}
          />
          <div className={`relative flex items-center justify-center`}>
            <div className={`w-28 h-28 rounded-full ${color}`}></div>
            <div className="absolute w-20 h-20 flex justify-center items-center">
              {children}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}
