export type ThemeItemType = {
  name: string;
  color: string;
  base: string;
  active: string;
};
export const themeList: ThemeItemType[] = [
  {
    name: "theme-one",
    color: "bg-rose-400",
    base: "theme-one-base",
    active: "theme-one-active",
  },
  {
    name: "theme-two",
    color: "bg-sky-400",
    base: "theme-two-base",
    active: "theme-two-active",
  },
  {
    name: "theme-three",
    color: "bg-violet-300",
    base: "theme-three-base",
    active: "theme-three-active",
  },
  {
    name: "theme-four",
    color: "bg-amber-300",
    base: "theme-four-base",
    active: "theme-four-active",
  },
  {
    name: "theme-five",
    color: "bg-emerald-300",
    base: "theme-five-base",
    active: "theme-five-active",
  },
  {
    name: "theme-six",
    color: "bg-indigo-500",
    base: "theme-six-base",
    active: "theme-six-active",
  },
];
