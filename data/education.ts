import type { EducationEntry } from "@/types";

/**
 * Array-shaped even though there's one entry today, so a second degree,
 * a diploma, or high-school record can be added without touching the
 * Education component.
 */
export const education: EducationEntry[] = [
  {
    id: "nutech-bscs",
    institution: "National University of Technology (NUTECH)",
    degree: "BS",
    field: "Computer Science",
    location: "Islamabad, Pakistan",
    startDate: "2024-09",
    endDate: "2028",
    studentId: "F24605062",
   coursework: [
  "Cyber Security",
  "Information Security",
  "Network Security",
  "Networking Fundamentals",
  "Cloud Computing",
  "ICT (HTML, CSS, JavaScript)",
  "Programming Fundamentals (C++)",
  "Data Structures & Algorithms (C++)",
  "Object-Oriented Programming (Java)",
  "Python Programming (Artificial Intelligence)",
  "Applied Databases (PostgreSQL)",
],
   notes: [
  "PBL Project: Odoo Security Scanner — developed a vulnerability assessment tool for Odoo applications to identify common security misconfigurations and potential vulnerabilities.",

  "Dark Web Crawler — built a cybersecurity research crawler to collect and analyze publicly accessible dark-web information for threat intelligence and security research.",

  "Cipher Log — developed a controlled keylogging project to study input-capture techniques, system-level behavior, and endpoint security detection and mitigation."
],
  },
];
