import { Briefcase } from "lucide-react";
import { SectionHeading, Chip } from "@/components/ui/Primitives";
import { experience } from "@/data/experience";
import { formatMonthYear } from "@/lib/utils";

export function Experience() {
  return (
    <>
      <SectionHeading title="Experience" />
      <div className="space-y-8">
        {experience.map((entry) => (
          <div key={entry.id} className="rounded-md border border-line bg-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-base text-ink sm:text-lg">{entry.role}</p>
                    {entry.current && (
                      <span className="rounded border border-line px-2 py-0.5 font-mono text-2xs text-cyan">
                        current
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{entry.organization}</p>
                  <p className="mt-1 text-xs text-ink-faint">{entry.location}</p>
                </div>
              </div>
              <p className="font-mono text-2xs text-ink-faint">
                {formatMonthYear(entry.startDate)} – {entry.current ? "Present" : entry.endDate}
              </p>
            </div>

            <p className="mt-5 max-w-measure border-t border-line pt-5 text-sm leading-relaxed text-ink-muted">
              {entry.description}
            </p>

            {entry.technologies.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {entry.technologies.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
