import type { SocialLink } from "@/types";

/**
 * Swap the placeholder email and LinkedIn URL for the real ones —
 * they're intentionally left as recognizable placeholders rather than
 * guessed values. GitHub is real.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "email",
    label: "Email",
    value: "mhussainx94@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=mhussain999444@gmail.com",
    icon: "mail",
    isPlaceholder: false,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/mhussainx94",
    href: "https://github.com/mhussainx94",
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "www.linkedin.com/in/mhussainx94",
    href: "https://www.linkedin.com/in/mhussainx94",
    icon: "linkedin",
   
  },
];
