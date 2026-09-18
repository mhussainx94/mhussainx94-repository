"use client";

import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { SiteNav } from "@/components/nav/SiteNav";
import { Hero } from "@/components/hero/Hero";
import { BootSequence } from "@/components/terminal/BootSequence";
import { CvTerminal } from "@/components/terminal/CvTerminal";
import { SectionShell } from "@/components/sections/SectionShell";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Certifications } from "@/components/sections/Certifications";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Container } from "@/components/ui/Primitives";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import type { SectionDescriptor } from "@/hooks/useSectionProgress";
import { profile } from "@/data/profile";

const BOOT_ID = "terminal-entry";

// Three.js/R3F is inherently client-only (WebGL can't render during
// SSR) and is by far the heaviest chunk in this app — code-splitting
// it out with next/dynamic means the text content and the hanging
// card are interactive well before the 3D backdrop finishes loading.
const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  const reducedMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const certificationsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sections: SectionDescriptor[] = useMemo(
    () => [
      { id: "hero", ref: heroRef },
      { id: "about", ref: aboutRef },
      { id: "education", ref: educationRef },
      { id: "experience", ref: experienceRef },
      { id: "certifications", ref: certificationsRef },
      { id: "projects", ref: projectsRef },
      { id: "skills", ref: skillsRef },
      { id: "contact", ref: contactRef },
    ],
    []
  );

  useSectionProgress(sections);

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-2xs focus:text-void"
      >
        Skip to content
      </a>
      <SceneCanvas />
      <SiteNav />
      <main>
        <Hero reducedMotion={reducedMotion} nextSectionId={BOOT_ID} />
        <BootSequence reducedMotion={reducedMotion} id={BOOT_ID} />

        <SectionShell
          id="about"
          index={1}
          command="cat about.txt"
          sectionRef={aboutRef}
          reducedMotion={reducedMotion}
        >
          <About />
        </SectionShell>

        {/* Deliberately not a SectionShell: no rail index, no nav entry,
            not part of the `sections` array above — this is a small
            aside, not a page section. See CvTerminal.tsx. */}
        <CvTerminal reducedMotion={reducedMotion} />

        <SectionShell
          id="education"
          index={2}
          command="ls education/"
          sectionRef={educationRef}
          reducedMotion={reducedMotion}
        >
          <Education />
        </SectionShell>

        <SectionShell
          id="experience"
          index={3}
          command="cat experience.log"
          sectionRef={experienceRef}
          reducedMotion={reducedMotion}
        >
          <Experience />
        </SectionShell>

        <SectionShell
          id="certifications"
          index={4}
          command="cat certificates.log"
          sectionRef={certificationsRef}
          reducedMotion={reducedMotion}
        >
          <Certifications />
        </SectionShell>

        <SectionShell
          id="projects"
          index={5}
          command="cd projects/ && ls"
          sectionRef={projectsRef}
          reducedMotion={reducedMotion}
        >
          <Projects reducedMotion={reducedMotion} />
        </SectionShell>

        <SectionShell
          id="skills"
          index={6}
          command="grep -r . skills/"
          sectionRef={skillsRef}
          reducedMotion={reducedMotion}
        >
          <Skills />
        </SectionShell>

        <SectionShell
          id="contact"
          index={7}
          command="./contact"
          sectionRef={contactRef}
          reducedMotion={reducedMotion}
        >
          <Contact />
        </SectionShell>

        <footer className="border-t border-line py-10">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-2xs text-ink-faint">
                © {new Date().getFullYear()} {profile.name}
              </p>
              <a
                href="#hero"
                className="font-mono text-2xs text-ink-faint transition-colors hover:text-signal"
              >
                back to top ↑
              </a>
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
