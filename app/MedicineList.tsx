import { ReactNode } from "react";

export default function medicineList({
  fill,
  children,
}: {
  fill: number;
  children: ReactNode;
}) {
  return (
    <ul className="flex flex-col gap-2 max-h-[calc(60svh)]  md:max-h-[80svh] overflow-auto">
      {children}

      <li className="h-[400px]"></li>
      {/* {Array(4)
        .fill("")
        .map((v, i) => (
          <div key={`fill-${i}`} className="h-[200px] w-10 py-4"></div>
        ))} */}
    </ul>
  );
}
