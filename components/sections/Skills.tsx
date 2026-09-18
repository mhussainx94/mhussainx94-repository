import { CommandLabel, SectionHeading, Chip } from "@/components/ui/Primitives";
import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <>
      <SectionHeading title="Skills" />

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-7
          sm:grid-cols-2
          sm:gap-8
          lg:gap-10
        "
      >
        {skillGroups.map((group) => (
          <div key={group.id} className="min-w-0">
            <CommandLabel>{group.command}</CommandLabel>

            <p className="mt-2 break-words text-sm leading-relaxed text-ink">
              {group.label}
            </p>

            <div className="mt-4 flex min-w-0 flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}