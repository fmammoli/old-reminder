import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { MedicineType } from "./day/[id]/page";

export default function MedicineListItem({
  id,
  dateString,
  color,
  icon,
  title,
  concentration,
  amount,
  frequency,
  shouldTaketAt,
}: {
  id: string;
  dateString: string;
  color: string;
  icon: StaticImageData;
  title: string;
  concentration: string;
  amount: string;
  frequency: string;
  shouldTaketAt: string;
}) {
  return (
    <li className=" bg-skin-fill border-neutral-200 rounded-lg">
      <Link
        href={`/day/${dateString.split("/").join("-")}`}
        className="flex gap-4 p-4"
      >
        <div className={`relative h-20 w-20 rounded-full  p-1 ${color}`}>
          <Image src={icon} alt={""}></Image>
        </div>
        <div className="grow">
          <h3 className={`text-lg text-sky-500 font-sans font-medium`}>
            {title} <span>, {concentration}</span>
          </h3>
          <p className="text-md text-neutral-600 font-light">{`${amount}, ${frequency}`}</p>
          <div className="flex justify-between">
            <div className="flex gap-1 py-1 items-center">
              <p className="text-md text-neutral-600 font-light">
                {shouldTaketAt}
              </p>
              <span className="inline-block ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[1.1rem] h-[1.1rem] align-baseline text-neutral-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-400 stroke-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </li>
  );
}
