export type EducationItem = {
  title: string;
  institution: string;
  status: string;
  /** Still in progress; highlighted on the timeline. */
  current?: boolean;
};

// Listed newest first.
export const education: EducationItem[] = [
  {
    title: "BS Artificial Intelligence",
    institution: "Karachi University, Department of Computer Science",
    status: "In progress",
    current: true,
  },
  {
    title: "Diploma in Software Development",
    institution: "Aptech Pakistan",
    status: "Completed · 1 year",
  },
  {
    title: "German, A2 level",
    institution: "Goethe-Institut Karachi",
    status: "Completed",
  },
];
