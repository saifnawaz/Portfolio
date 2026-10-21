export type Project = {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
};

// Add projects here. While the list is empty, the section shows the
// "currently building" state below. Example entry:
//
// {
//   title: "Project name",
//   description: "One or two sentences on what it does and why.",
//   tags: ["Laravel", "SQL"],
//   liveUrl: "https://example.com",
//   repoUrl: "https://github.com/your-username/project",
// },
export const projects: Project[] = [];

export const projectsEmptyState = {
  label: "Currently building",
  title: "Projects coming soon",
  text: "A few projects are in progress. They'll appear here once they're ready.",
  linkLabel: "Follow along on GitHub",
};
