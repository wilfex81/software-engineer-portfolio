import React from "react";
import { useInView } from "react-intersection-observer";
import ProjectCard, { ProjectCardProps } from "./ProjectCard";
import { cn } from "@/lib/utils";

type ProjectData = Omit<ProjectCardProps, "index">;

const projectsData: ProjectData[] = [
  {
    title: "APEXSYNC",
    status: "Shipped",
    description:
      "Backend for a financial management system for Mexican SMEs. A Django REST API exposes a versioned tax compliance engine, cash flow forecasting, anomaly detection and duplicate review, with generated OpenAPI docs.",
    problem:
      "Tax rates in Mexico change on a published schedule, and a calculation has to be correct as of the date it ran. Hard coding the rules means a redeploy for every change. The goal was an API where rules are data, so a rate update never touches the running service.",
    architecture: `flowchart TD
  C["API clients"] --> A["Django REST API"]
  A --> T["Tax engine"]
  A --> F["Analytics engine"]
  A --> N["Normalization"]
  T --> DB[("PostgreSQL")]
  F --> DB
  N --> DB
  A --> D["OpenAPI docs"]`,
    decisions: [
      "Tax rules are versioned data, not code. A rule set moves from draft to active to superseded, and the API resolves the active one for a given date with a single indexed lookup.",
      "Publishing a rule set is one atomic transaction that supersedes the previous one, so there is never a moment with zero or two active rule sets.",
      "Rule updates pass through a human approval step on purpose. The official publications have no clean API, so the system drafts and a person confirms before anything goes live.",
      "Forecasting and anomaly detection read only from cleaned, tested tables, so a malformed record cannot silently skew a forecast.",
      "Auto generated OpenAPI documentation with drf-spectacular keeps the API browsable and the contract explicit.",
    ],
    endpoints: [
      { method: "POST", path: "/api/tax/calculate/", purpose: "IVA and ISR against the active rule set" },
      { method: "POST", path: "/api/tax/rule-sets/{id}/publish/", purpose: "Activate a draft rule set atomically" },
      { method: "POST", path: "/api/analytics/forecast/", purpose: "Six month cash flow forecast" },
      { method: "POST", path: "/api/analytics/anomalies/", purpose: "Cash flow and inventory anomaly flags" },
      { method: "GET", path: "/api/normalization/review/", purpose: "Likely duplicates and cost spikes for review" },
    ],
    techStack: [
      "Python",
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "drf-spectacular",
      "Prophet",
      "scikit-learn",
    ],
    repoLink: "https://github.com/wilfex81/APEXsYNC#apexsync",
  },
  {
    title: "Mini Redis",
    status: "In progress",
    description:
      "A Redis compatible in-memory server written in Go. Speaks the RESP protocol over TCP, supports strings, hashes and lists with key expiry, and persists writes to an append only file.",
    problem:
      "Redis looks simple from the outside and hides a lot underneath: a wire protocol, concurrent access to shared state, expiry and durability. Building it from scratch is a direct way to work through those problems instead of reading about them.",
    architecture: `flowchart LR
  C["redis-cli or client"] --> L["TCP listener"]
  L --> P["RESP parser"]
  P --> D["Command dispatcher"]
  D --> S[("In-memory store")]
  S --> E["Expiry"]
  D --> W["AOF writer"]
  W --> F["Append only file"]`,
    decisions: [
      "Part 1 uses only the Go standard library: a TCP server, a hand written RESP parser and the command set (PING, ECHO, SET, GET, DEL, INCR, EXISTS, KEYS).",
      "Shared state is protected with a mutex, then extended with key expiry, hashes and lists.",
      "Durability comes from an append only file that records write commands so state can be rebuilt on start.",
      "Part 2 rebuilds the network layer on gnet, an event loop framework, to compare it against the standard library version.",
    ],
    techStack: ["Go", "TCP", "RESP", "Concurrency", "AOF persistence", "gnet"],
  },
];

const Projects: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto container-padding max-w-6xl">
        <div className="text-center mb-20">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4">
            Selected Work
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
            Backend Projects
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Each project is written up as a case study: the problem, the architecture,
            and the decisions behind it.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {projectsData.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "opacity-0 transform translate-y-4 transition-all duration-500",
                inView && "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <ProjectCard {...project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
