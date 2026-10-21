export type SkillGroup = {
  title: string;
  skills: string[];
  /** Marks a group as in progress; it gets the accent treatment. */
  current?: boolean;
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Web",
    skills: ["HTML", "JavaScript", "Node Js"],
  },
  {
    title: "Backend & Data",
    skills: ["PHP", "Laravel", "Java", "SQL"],
  },
  {
    title: "Learning now",
    skills: ["Artificial Intelligence", "Machine Learning"],
    current: true,
  },
];
