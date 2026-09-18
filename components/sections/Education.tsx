import { GraduationCap } from "lucide-react";
import { SectionHeading, Chip } from "@/components/ui/Primitives";
import { education } from "@/data/education";
import { formatMonthYear } from "@/lib/utils";

export function Education() {
  return (
    <>
      <SectionHeading title="Education" />
      <div className="space-y-8">
        {education.map((entry) => (
          <div key={entry.id} className="rounded-md border border-line bg-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <p className="font-mono text-base text-ink sm:text-lg">
                    {entry.degree} {entry.field}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{entry.institution}</p>
                  <p className="mt-1 text-xs text-ink-faint">{entry.location}</p>
                </div>
              </div>
              <p className="font-mono text-2xs text-ink-faint">
                {formatMonthYear(entry.startDate)} – {entry.endDate}
              </p>
            </div>

            {entry.coursework.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                {entry.coursework.map((course) => (
                  <Chip key={course}>{course}</Chip>
                ))}
              </div>
            )}

            {entry.notes && entry.notes.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-line pt-5 text-xs leading-relaxed text-ink-muted">
                {entry.notes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="text-ink-faint">›</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
