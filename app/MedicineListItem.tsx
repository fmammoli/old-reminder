import Image, { StaticImageData } from "next/image";
import { Point, motion, useAnimation } from "framer-motion";
import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
} from "firebase/firestore";
import {
  useFirestoreDocumentDeletion,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { db } from "@/firebase/clientApp";
import { ReminderType } from "./Types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

const transitionOptions = {
  x: { type: "spring", stiffness: 400, damping: 25 },
  opacity: { duration: 0.2 },
};

const variants = {
  initial: { x: 0 },
  left: () => {
    return { x: 80 };
  },
  right: () => {
    return { x: -80 };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function MedicineListItem({
  dateString,
  color,
  icon,
  title,
  amount,
  frequency,
  shouldTakeAt,
  userUid,
  _id,
  checked = false,
  takenAt,
  date,
  onDelete,
  onUpdate,
}: {
  _id: string;
  dateString: string;
  color: string;
  icon: StaticImageData;
  title: string;
  amount: string;
  frequency: string;
  shouldTakeAt: Date;
  userUid: string;
  checked?: boolean | null;
  takenAt?: Date | null;
  date: Timestamp;
  onDelete: (_id: string) => void;
  onUpdate: (newList: ReminderType[]) => void;
}) {
  const controls = useAnimation();

  const [centered, setCentered] = useState(true);
  function handleDragEnd(
    e: MouseEvent,
    { offset, velocity }: { offset: Point; velocity: Point }
  ) {
    const swipe = swipePower(offset.x, velocity.x);
    console.log(swipe);
    if (swipe < -swipeConfidenceThreshold) {
      if (!checked) {
        controls.start("right");
        setCentered(false);
      } else {
        controls.start("initial");
        setCentered(true);
      }
    } else if (swipe > swipeConfidenceThreshold) {
      controls.start("left");
      setCentered(false);
    } else {
      controls.start("initial");
      setCentered(false);
    }
    setDragging(false);
  }

  const collectionRef = collection(
    db,
    "reminders"
  ) as CollectionReference<ReminderType>;

  const docRef = doc(collectionRef, _id);
  const deletionMutation = useFirestoreDocumentDeletion(docRef);

  function handleDeleteClick() {
    deletionMutation.mutate();
    onDelete(_id);
  }

  const queryClient = useQueryClient();

  const remindersMutation = useFirestoreDocumentMutation(
    docRef,
    {
      merge: true,
    },
    {
      onMutate: async (newReminder) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: [
            "reminders",
            { userUid },
            date.toDate().toLocaleDateString("pt-Br", {
              month: "2-digit",
              year: "numeric",
            }),
          ],
        });

        // Snapshot the previous value
        const previousList = queryClient.getQueryData<ReminderType[]>([
          "reminders",
          { userUid },
        ]);

        let newList = null;

        if (previousList) {
          newList = previousList.map((item, index) => {
            console.log(newReminder);
            if (item._id === newReminder._id) {
              return {
                ...item,
                ...newReminder,
              };
            } else {
              return item;
            }
          });
        }
        console.log(previousList);
        console.log(newList);

        // Optimistically update to the new value
        queryClient.setQueryData(
          [
            "reminders",
            { userUid },
            date.toDate().toLocaleDateString("pt-Br", {
              month: "2-digit",
              year: "numeric",
            }),
          ],
          newList
        );

        // setDayQuery(newDay as ReminderType[]);
        // Return a context with the previous and new todo
        controls.start("initial");
        setCentered(true);
        return { previousList };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newDay, context) => {
        console.log("eror");
        queryClient.setQueryData<ReminderType[]>(
          [
            "reminders",
            { userUid },
            date.toDate().toLocaleDateString("pt-Br", {
              month: "2-digit",
              year: "numeric",
            }),
          ],
          //@ts-ignore
          context.previousList
        );
      },
      // Always refetch after error or success:
      onSettled: (newList) => {
        console.log("settled");
        // queryClient.invalidateQueries({
        //   queryKey: [
        //     "reminders",
        //     { userUid },
        //     date.toDate().toLocaleDateString("pt-Br", {
        //       month: "2-digit",
        //       year: "numeric",
        //     }),
        //   ],
        // });
        // setCentered(true);
      },
    }
  );

  function handleCheckClick() {
    //@ts-ignore
    remindersMutation.mutate({
      _id: _id,
      checked: !checked,
      takenAt: Timestamp.fromDate(new Date()),
    });
  }

  const [dragging, setDragging] = useState(false);

  function handleDragStart() {
    setDragging(true);
  }
  const router = useRouter();
  function handleClick(e: any) {
    if (!dragging) {
      if (centered) {
        router.push(
          `/day/${userUid}/${dateString.split("/").join("-")}?start=${_id}`
        );
      } else {
        controls.start("initial");
        setCentered(true);
      }
    }
  }

  return (
    <li className="relative isolate">
      <div className="absolute flex justify-between w-full h-full -z-10 md:rounded-lg">
        <div className="bg-red-400 flex items-center sticky grow text-start md:rounded-l-lg px-2">
          <button
            className="px-4 p-8 hover:bg-[#ffffff20] active:bg-[#ffffff50] rounded-md"
            onClick={handleDeleteClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>

        <div className="bg-green-400 flex items-center sticky grow justify-end md:rounded-r-lg px-2">
          <button
            disabled={checked ? true : false}
            className=" px-4 p-8  hover:bg-[#ffffff20] active:bg-[#ffffff50] rounded-md"
            onClick={handleCheckClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <motion.div
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={1}
        drag={"x"}
        transition={transitionOptions}
        animate={controls}
        className={` bg-white border-b-[1px] border-gray-200 md:border-neutral-100 md:rounded-lg hover:bg-slate-50 active:bg-slate-200 cursor-pointer active:cursor-grabbing`}
        variants={variants}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div
          onClick={handleClick}
          className={`flex gap-4 px-2 py-4 md:p-4  ${
            dragging ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          <div
            className={`relative h-10 w-10 md:h-20 md:w-20 rounded-full  p-1  ${
              checked ? color : ""
            }`}
          >
            <Image src={icon} alt={""} fill></Image>
          </div>
          <div className="grow">
            <h3
              className={`text-md md:text-lg text-sky-500 font-sans md:font-medium capitalize`}
            >
              {title}
            </h3>
            <p className="text-sm md:text-md text-neutral-600 font-light">{`${amount}, ${frequency}`}</p>
            <div className="flex justify-between">
              <div className="flex gap-1 py-1 items-center">
                <p className="text-sm md:text-md text-neutral-600 font-light">
                  {checked && takenAt
                    ? new Date(takenAt).toLocaleString("pt-Br", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(shouldTakeAt).toLocaleString("pt-Br", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </p>
                <span className="inline-block ">
                  {checked && takenAt ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-[1.1rem] h-[1.1rem] align-baseline text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
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
                  )}
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
        </div>
      </motion.div>
    </li>
  );
}
