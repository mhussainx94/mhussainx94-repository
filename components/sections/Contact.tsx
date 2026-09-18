import { Briefcase, Github, Linkedin, Mail } from "lucide-react";
import { SectionHeading } from "@/components/ui/Primitives";
import { socialLinks } from "@/data/social";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types";

const ICONS = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  briefcase: Briefcase,
} as const;

function ContactRow({ link }: { link: SocialLink }) {
  const Icon = ICONS[link.icon];
  const isExternal = link.href.startsWith("http");

  return (
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer noopener" : undefined}
      className={cn(
        "group flex min-w-0 flex-col gap-2 border-b border-line py-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        link.isPlaceholder
          ? "text-ink-faint"
          : "text-ink hover:border-signal"
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        />

        <span className="font-mono text-sm">
          {link.label}
        </span>
      </span>

      <span
        className={cn(
          "min-w-0 break-all font-mono text-xs sm:text-right",
          link.isPlaceholder
            ? "italic text-ink-faint"
            : "text-ink-muted group-hover:text-signal"
        )}
      >
        {link.value}
      </span>
    </a>
  );
}

export function Contact() {
  return (
    <>
      <SectionHeading
        title="Contact"
        description="Currently building a freelance cybersecurity practice alongside my degree — open to internships, freelance security work, and collaboration."
      />

      <div className="w-full max-w-measure min-w-0">
        {socialLinks.map((link) => (
          <ContactRow
            key={link.id}
            link={link}
          />
        ))}
      </div>

      <p className="mt-6 break-words font-mono text-2xs text-ink-faint sm:mt-8">
        connection established — {profile.location}
      </p>
    </>
  );
}