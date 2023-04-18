import { ReactNode } from "react";

export default function medicineList({
  fill,
  children,
}: {
  fill: number;
  children: ReactNode;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {children}

      {Array(fill)
        .fill("")
        .map((v, i) => (
          <div key={`fill-${i}`} className="h-12 py-4"></div>
        ))}
    </ul>
  );
}
