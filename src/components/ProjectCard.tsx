import React, { Suspense, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ArrowRight, ExternalLink, Github, X } from 'lucide-react';

const Mermaid = React.lazy(() => import('./Mermaid'));

export interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  index: number;
  status?: string;
  problem?: string;
  decisions?: string[];
  endpoints?: { method: string; path: string; purpose: string }[];
  architecture?: string;
  repoLink?: string;
  liveLink?: string;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
    {children}
  </h3>
);

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack,
  status,
  problem,
  decisions,
  endpoints,
  architecture,
  repoLink,
  liveLink,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const primaryLink = repoLink || liveLink;

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => setModalActive(true), 10);
  };

  const closeModal = () => {
    setModalActive(false);
    setTimeout(() => {
      setShowModal(false);
      document.body.style.overflow = 'auto';
    }, 300);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };
    if (showModal) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleModalBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const modal = (
    <div
      className={cn(
        'fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-overlay',
        modalActive && 'active'
      )}
      onClick={handleModalBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto modal-content shadow-2xl border border-border/10',
          modalActive && 'active'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background/80 backdrop-blur-md p-6 border-b border-border/10 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {status && (
              <span className="text-[10px] font-medium px-2 py-1 rounded-full border border-border/60 text-muted-foreground uppercase tracking-wide">
                {status}
              </span>
            )}
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-full"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {problem && (
            <div>
              <SectionTitle>Problem</SectionTitle>
              <p className="text-foreground/90 leading-relaxed">{problem}</p>
            </div>
          )}

          {architecture && (
            <div>
              <SectionTitle>Architecture</SectionTitle>
              <Suspense
                fallback={<p className="text-sm text-muted-foreground">Loading diagram...</p>}
              >
                <Mermaid chart={architecture} />
              </Suspense>
            </div>
          )}

          {decisions && decisions.length > 0 && (
            <div>
              <SectionTitle>Key decisions</SectionTitle>
              <ul className="space-y-3">
                {decisions.map((d) => (
                  <li key={d} className="flex gap-3 text-foreground/90 leading-relaxed text-sm">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {endpoints && endpoints.length > 0 && (
            <div>
              <SectionTitle>API surface</SectionTitle>
              <div className="overflow-x-auto rounded-lg border border-border/40">
                <table className="w-full text-sm">
                  <tbody>
                    {endpoints.map((e) => (
                      <tr key={e.method + e.path} className="border-b border-border/40 last:border-0">
                        <td className="px-3 py-2 font-mono text-xs text-primary/80 whitespace-nowrap">
                          {e.method}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{e.path}</td>
                        <td className="px-3 py-2 text-muted-foreground">{e.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <SectionTitle>Stack</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md border border-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {(repoLink || liveLink) && (
            <div className="pt-2 flex flex-wrap gap-3">
              {repoLink && (
                <a
                  href={repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow"
                >
                  <Github size={14} /> View source
                </a>
              )}
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg hover:bg-muted transition-all"
                >
                  Live demo <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="group relative flex flex-col h-full bg-card rounded-xl border border-border/40 p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="h-0.5 w-0 bg-primary/20 group-hover:w-full transition-all duration-500 ease-out" />
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <span className="text-[10px] font-medium px-2 py-1 rounded-full border border-border/60 text-muted-foreground uppercase tracking-wide">
                {status}
              </span>
            )}
            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label={`${title} source`}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-4 flex-grow">
          {description}
        </p>

        <div className="mt-auto space-y-5">
          <div className="flex flex-wrap gap-1.5">
            {techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-medium px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-md border border-border/50"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="text-[10px] font-medium px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-md border border-border/50">
                +{techStack.length - 4}
              </span>
            )}
          </div>

          <button
            onClick={openModal}
            className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors pt-4 border-t border-border/40"
          >
            <span>Case study</span>
            <span className="bg-secondary rounded-full p-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight
                size={12}
                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
              />
            </span>
          </button>
        </div>
      </div>

      {showModal && createPortal(modal, document.body)}
    </>
  );
};

export default ProjectCard;
