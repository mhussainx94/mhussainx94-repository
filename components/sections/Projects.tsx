"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { SectionHeading, Chip } from "@/components/ui/Primitives";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  reducedMotion: boolean;
}

function ProjectCard({ project, reducedMotion }: ProjectCardProps) {
  const isPlaceholder = project.status === "add-details";

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -3 }}
      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex min-w-0 h-full flex-col rounded-md border p-4 sm:p-5 md:p-6",
        isPlaceholder
          ? "border-dashed border-line"
          : "border-line bg-panel",
        project.featured && "sm:col-span-2"
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h3 className="min-w-0 break-words font-mono text-base text-ink sm:text-lg">
          {project.title}
        </h3>

        {project.status === "in-progress" && (
          <span className="shrink-0 rounded border border-line px-2 py-0.5 font-mono text-2xs text-cyan">
            in progress
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-3 min-w-0 flex-1 break-words text-sm leading-relaxed",
          isPlaceholder ? "italic text-ink-faint" : "text-ink-muted"
        )}
      >
        {project.description}
      </p>

      {project.technologies.length > 0 && (
        <div className="mt-5 flex min-w-0 flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      )}

      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-8 items-center gap-1.5 font-mono text-2xs text-ink-muted transition-colors hover:text-signal"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              code
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-8 items-center gap-1.5 font-mono text-2xs text-ink-muted transition-colors hover:text-signal"
            >
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              live
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function Projects({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <>
      <SectionHeading title="Projects" />

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-4
          sm:grid-cols-2
          sm:gap-5
          lg:gap-6
        "
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </>
  );
}