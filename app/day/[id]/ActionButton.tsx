import { ChangeEvent, ReactNode, useState } from "react";
import FloatingButton from "./FloatingButton";

export default function ActionButton({
  inputKey,
  handleChange,
  children,
  fillBackground = false,
  checked,
  color,
}: {
  inputKey: string;
  handleChange: ({
    event,
    inputKey,
    fillBackground,
  }: {
    event: ChangeEvent<HTMLInputElement>;
    inputKey: string;
    fillBackground?: boolean;
  }) => void;
  children?: ReactNode;
  fillBackground?: boolean;
  checked: string;
  color: number;
}) {
  function onClick(event: ChangeEvent<HTMLInputElement>) {
    return handleChange({
      event: event,
      inputKey: checked === inputKey ? "" : inputKey,
      fillBackground: fillBackground,
    });
  }

  const colors = ["bg-rose-400", "bg-teal-500", "bg-amber-200", "bg-green-200"];

  return (
    <div className="relative flex justify-center items-center py-12">
      {fillBackground && (
        <div
          id="fillBackground"
          className={`${
            checked === inputKey
              ? "scale-[30] duration-[800ms] delay-[200ms] "
              : ""
          } bg-skin-accent-fill absolute w-20 h-20 top-1/2 left-1/2 rounded-full -z-10 -translate-x-1/2 -translate-y-1/2 transition-transform ease-in-out transform-gpu`}
        ></div>
      )}
    </div>
  );
}
