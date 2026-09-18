/**
 * Shared content types. Keeping these separate from the data files means
 * every section component and every data file agree on the same shape,
 * and editing content never requires touching a component.
 */

export interface Profile {
  name: string;
  handle: string;
  title: string;
  location: string;
  summary: string;
  /** Optional path under /public, e.g. "/avatar.jpg". Leave undefined to
   *  use the built-in monogram avatar on the hanging card. */
  photoUrl?: string;
  /** Path under /public to the downloadable CV/resume PDF, e.g.
   *  "/Muhammad-Hussain-CV.pdf". The CV terminal checks this URL
   *  actually resolves before claiming success — see
   *  components/terminal/CvTerminal.tsx. */
  cvUrl?: string;
  bio: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  studentId?: string;
  coursework: string[];
  notes?: string[];
}

export type CertificationStatus = "completed" | "exploring";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: CertificationStatus;
  date?: string;
  credentialUrl?: string;
  /** Optional path under /public for a certificate image/export. */
  imageUrl?: string;
  note?: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
}

export type ProjectCategory =
  | "offensive-security"
  | "recon-automation"
  | "application-security"
  | "tooling";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  featured?: boolean;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Optional path under /public for a screenshot. */
  imageUrl?: string;
  status?: "shipped" | "in-progress" | "add-details";
}

export interface SkillGroup {
  id: string;
  command: string;
  label: string;
  skills: string[];
}

export interface SocialLink {
  id: string;
  label: string;
  value: string;
  href: string;
  /** lucide-react icon name, resolved by the Contact component. */
  icon: "mail" | "github" | "linkedin" | "briefcase";
  isPlaceholder?: boolean;
}

export type SectionId =
  | "hero"
  | "about"
  | "education"
  | "experience"
  | "certifications"
  | "projects"
  | "skills"
  | "contact";

export type PerformanceTier = "high" | "medium" | "low";

export interface PerformanceConfig {
  particleCount: number;
  nodeCount: number;
  showGrid: boolean;
  dpr: [number, number];
  cameraDrift: boolean;
}
