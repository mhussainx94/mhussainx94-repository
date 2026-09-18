import type { ExperienceEntry } from "@/types";

/**
 * Add a new role by appending another object to this array — the
 * Experience section, the section reveal animation, and the mobile
 * layout all already handle any number of entries.
 *
 * `current: true` shows a "current" badge instead of an end date.
 * Exact month/day for startDate/endDate wasn't on file for the entry
 * below, so it's given as a bare year rather than a guessed month.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "pkcert-internship",
    role: "Cybersecurity Intern",
    organization: "PKCERT (National CERT Pakistan)",
    location: "Islamabad, Pakistan",
    startDate: "1-7-2026",
    endDate: "30-8-2026",
    current: false,
description:
  "Completed a Software Security internship with the Software Screening & Lab Directorate at National CERT, gaining hands-on experience in vulnerability assessment, web application security, and security testing. Worked with controlled security labs including DVWA and Metasploitable 2, and participated in the Vulnerability Disclosure Program (VDP), conducting authorized security testing and reconnaissance of government web assets and documenting security findings for responsible disclosure.",

technologies: [
  "Vulnerability Assessment",
  "Web Application Security",
  "Black-Box Testing",
  "VDP",
  "OWASP",
  "DVWA",
  "Metasploitable 2",
  "Security Testing",
  "Vulnerability Reporting",
],
  },
];
