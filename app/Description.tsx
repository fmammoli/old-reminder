import { ReactNode } from "react";

export default function Description({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto font-sans font-light text-sm sm:px-12 dark:transition-colors text-skin-base transition-colors delay-200">
      <div className=" flex items-center gap-1 ">
        <h3 className="font-sans text-lg font-medium">{title}</h3>
        {icon && <a href="">{icon}</a>}
      </div>

      {children}
    </div>
  );
}
