import { ResourceItem } from "../types";

// Build reliable, pre-filled India job-search links from a job title.
// These are constructed on the client so the links are always valid.
export function buildJobSearchLinks(jobTitle: string): ResourceItem[] {
  const title = (jobTitle || "").trim();
  if (!title) return [];

  const q = encodeURIComponent(title);
  const naukriSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return [
    {
      title: "Naukri.com",
      link: `https://www.naukri.com/${naukriSlug}-jobs`,
    },
    {
      title: "LinkedIn Jobs (India)",
      link: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=India`,
    },
    {
      title: "Indeed India",
      link: `https://in.indeed.com/jobs?q=${q}&l=India`,
    },
    {
      title: "Internshala",
      link: `https://internshala.com/internships/${naukriSlug}-internship`,
    },
    {
      title: "Google Jobs",
      link: `https://www.google.com/search?q=${q}+jobs+in+india&ibp=htl;jobs`,
    },
  ];
}
