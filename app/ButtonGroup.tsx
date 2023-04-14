import { ChangeEvent, ReactElement, ReactNode, useState } from "react";
import FloatingButton from "./FloatingButton";

export default function ButtonGroup({
  onChange,
  children,
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  children: ReactElement[] | ReactElement;
}) {
  const [checked, setChecked] = useState<string>("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setChecked(checked === event.target.id ? "" : event.target.id);
    onChange(event);
  }

  console.log(children);
  return (
    <>
      <div className="relative flex w-full py-12 ">
        {Array.isArray(children) ? (
          children.map((item: ReactElement, i) => {
            const a = { ...item, [item.props.isChecked]: checked };
            return (
              <div
                className="flex min-w-full justify-center "
                key={`check-${i}`}
              >
                <FloatingButton
                  isChecked={checked}
                  inputKey={`check-${i}`}
                  onChange={handleChange}
                >
                  {item}
                </FloatingButton>
              </div>
            );
          })
        ) : (
          <FloatingButton
            key={`check-s`}
            isChecked={checked}
            inputKey={`check-1`}
            onChange={handleChange}
          >
            {children}
          </FloatingButton>
        )}
      </div>
    </>
  );
}
