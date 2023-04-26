import { ChangeEvent, ReactElement, useState } from "react";
import FloatingButton from "./FloatingButton";

export const colors = [
  "bg-rose-400",
  "bg-sky-300",
  "bg-amber-200",
  "bg-green-200",
];

export default function ButtonGroup({
  onChange,
  children,
}: {
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    newChecked: string[]
  ) => void;
  children: ReactElement[] | ReactElement;
}) {
  const [checked, setChecked] = useState<string[]>(() => {
    if (Array.isArray(children)) {
      return (
        children
          .filter((item) => item.props["data-checked"] === true)
          .map((item) => `check-${item.props.id}`) || []
      );
    }
    return [];
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const index = checked.findIndex((item) => item === event.target.id);
    let newChecked = [];
    if (index === -1) {
      newChecked = [...checked, event.target.id];
    } else {
      newChecked = checked.filter((item) => item !== event.target.id);
    }
    setChecked(newChecked);
    onChange(event, newChecked);
  }

  return (
    <>
      <div className="relative flex w-full py-12 ">
        {Array.isArray(children) ? (
          children.map((item: ReactElement, i) => {
            return (
              <div
                className="flex min-w-full justify-center "
                key={`check-${item.props.id}`}
              >
                <FloatingButton
                  isChecked={
                    checked.includes(`check-${item.props.id}`) ? true : false
                  }
                  inputKey={`check-${item.props.id}`}
                  onChange={handleChange}
                  color={item.props.color}
                >
                  {item}
                </FloatingButton>
              </div>
            );
          })
        ) : (
          <FloatingButton
            key={`check-s`}
            isChecked={false}
            inputKey={`check-1`}
            onChange={handleChange}
            color={"bg-white"}
          >
            {children}
          </FloatingButton>
        )}
      </div>
    </>
  );
}
