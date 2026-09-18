import type { SkillGroup } from "@/types";

/**
 * Grouped as tools/technologies, not percentages — a "Cybersecurity: 95%"
 * bar doesn't mean anything verifiable, so this sticks to what was
 * actually used.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "offensive-security",
    command: "ls offensive-security/",
    label: "Offensive Security & Pentesting",
    skills: ["Nmap", "Metasploit", "OpenVAS / Greenbone", "DVWA", "Burp-style web app testing"],
  },
  {
    id: "recon",
    command: "ls recon/",
    label: "Reconnaissance & Enumeration",
    skills: ["subfinder", "httpx", "nuclei", "hcxdumptool", "hashcat"],
  },
  {
    id: "app-network-security",
    command: "ls application-security/",
    label: "Application & Network Security",
    skills: ["Broken access control", "Vulnerability assessment", "CVE research", "Responsible disclosure"],
  },
  {
    id: "linux-systems",
    command: "ls systems/",
    label: "Linux & Systems",
    skills: ["Kali Linux (daily driver)", "Dual-boot & VMware", "Bash", "Docker"],
  },
  {
    id: "languages",
    command: "ls languages/",
    label: "Languages & Databases",
    skills: ["Python", "Flask", "SQL / PostgreSQL", "x86 Assembly (NASM/MASM)", "Java"],
  },
  {
    id: "automation-ai",
    command: "ls automation/",
    label: "Automation & AI Tooling",
    skills: ["n8n workflow automation", "Local AI agents (Ollama)", "Claude via MCP"],
  },
];
