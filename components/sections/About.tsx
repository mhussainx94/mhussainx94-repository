import { SectionHeading } from "@/components/ui/Primitives";
import { profile } from "@/data/profile";

export function About() {
  return (
    <>
      <SectionHeading title="About" />
      <div className="max-w-measure space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
        {profile.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </>
  );
}
