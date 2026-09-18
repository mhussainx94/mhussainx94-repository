"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, CircleDashed, X, ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/Primitives";
import { certifications } from "@/data/certifications";

export function Certifications() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedCert, setExpandedCert] = useState<string | null>(null);

  const completed = certifications.filter((c) => c.status === "completed");
  const exploring = certifications.filter((c) => c.status === "exploring");

  const toggleCertificate = (id: string) => {
    setExpandedCert((current) => (current === id ? null : id));
  };

  return (
    <>
      <SectionHeading title="Certifications" />

      <div className="divide-y divide-line overflow-hidden rounded-md border border-line bg-panel">
        {completed.map((cert) => {
          const isExpanded = expandedCert === cert.id;

          return (
            <div key={cert.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-signal"
                  aria-hidden="true"
                />

                <button
                  type="button"
                  onClick={() => toggleCertificate(cert.id)}
                  className="min-w-0 flex-1 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-ink">{cert.name}</p>

                      <p className="mt-0.5 text-xs text-ink-muted">
                        {cert.issuer}
                      </p>
                    </div>

                    {cert.note && (
                      <ChevronDown
                        className={`mt-0.5 h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isExpanded && cert.note
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {cert.note && (
                        <p className="pt-2 text-2xs leading-relaxed text-ink-faint">
                          {cert.note}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-3">
                  {cert.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(cert.imageUrl!)}
                      className="font-mono text-2xs text-cyan underline-offset-4 hover:underline"
                    >
                      view
                    </button>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-2xs text-cyan underline-offset-4 hover:underline"
                    >
                      verify
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {exploring.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 font-mono text-2xs text-ink-faint">
            currently exploring
          </p>

          <div className="divide-y divide-line overflow-hidden rounded-md border border-dashed border-line">
            {exploring.map((cert) => {
              const isExpanded = expandedCert === cert.id;

              return (
                <div key={cert.id} className="px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <CircleDashed
                      className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint"
                      aria-hidden="true"
                    />

                    <button
                      type="button"
                      onClick={() => toggleCertificate(cert.id)}
                      className="min-w-0 flex-1 text-left"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-ink-muted">
                            {cert.name}
                          </p>

                          <p className="mt-0.5 text-xs text-ink-faint">
                            {cert.issuer}
                          </p>
                        </div>

                        {cert.note && (
                          <ChevronDown
                            className={`mt-0.5 h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                          isExpanded && cert.note
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          {cert.note && (
                            <p className="pt-2 text-2xs italic leading-relaxed text-ink-faint">
                              {cert.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 rounded-md border border-line bg-panel p-2 text-ink hover:text-cyan"
            aria-label="Close certificate"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Certificate"
              width={1400}
              height={1000}
              className="max-h-[90vh] w-auto rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}