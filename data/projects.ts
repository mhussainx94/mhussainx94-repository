import type { Project } from "@/types";

/**
 * `githubUrl` / `liveUrl` are only set where a real, verified link
 * exists — the Projects card hides those buttons instead of guessing
 * a repo URL. Fill them in as repos go public.
 *
 * Note: a couple of Fiverr-portfolio projects (VulnBrief, PhishGuard)
 * are listed with `status: "add-details"` — only the project name was
 * on file, so the description is a placeholder for you to complete
 * rather than an invented feature list.
 */
export const projects: Project[] = [
  {
    id: "odoo-security-scanner",
    title: "Odoo Security Scanner v2.0",
    description:
      "A modular, Flask-based scanner for Odoo ERP deployments: automated CVE lookups against the running version and multi-format report generation for handoff to a client or admin.",
    category: "application-security",
    featured: true,
    technologies: ["Python", "Flask", "CVE Databases"],
    status: "shipped",
  },
  {
    id: "vdp-recon-sweep",
    title: "National VDP Recon Sweep",
    description:
      "Authorized, non-intrusive reconnaissance across provincial Pakistani government domains under NCERT/PKCERT's Vulnerability Disclosure Program. A multi-stage pipeline chains subdomain enumeration, live-host probing, and template-based scanning across a growing target list.",
    category: "recon-automation",
    featured: true,
    technologies: ["Kali Linux", "subfinder", "httpx", "nuclei"],
    status: "in-progress",
  },
  {
    id: "nutech-nims-pentest",
    title: "NUTECH NIMS Odoo Penetration Test",
    description:
      "An authorized penetration test of the university's Odoo-based NIMS platform. Documented eight findings and disclosed them responsibly to the university.",
    category: "application-security",
    technologies: ["Odoo 14 Enterprise", "Web App Testing"],
    status: "shipped",
  },
  {
    id: "metasploitable-lab-series",
    title: "Metasploitable2 Lab Series",
    description:
      "A hands-on lab series across Kali, Windows, and VMware: Nmap enumeration, OpenVAS/Greenbone vulnerability scanning, exploitation of a vsftpd backdoor via Metasploit, and a DVWA setup for web-app practice — each with a written lab report.",
    category: "offensive-security",
    technologies: ["Nmap", "OpenVAS", "Metasploit", "DVWA"],
    status: "shipped",
  },
  {
    id: "security-writeups",
    title: "security-writeups",
    description:
      "A GitHub portfolio of TryHackMe and Hack The Box machine write-ups (including Cap), with a consistent template and README structure for future machines.",
    category: "tooling",
    technologies: ["TryHackMe", "Hack The Box", "Markdown"],
    githubUrl: "https://github.com/mhussainx94",
    status: "in-progress",
  },
  {
    id: "vulnbrief",
    title: "VulnBrief",
    description: "Add a description — cybersecurity Fiverr portfolio project.",
    category: "tooling",
    technologies: [],
    status: "add-details",
  },
  {
    id: "phishguard",
    title: "PhishGuard",
    description: "Add a description — cybersecurity Fiverr portfolio project.",
    category: "tooling",
    technologies: [],
    status: "add-details",
  },
];
