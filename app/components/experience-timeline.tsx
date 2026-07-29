"use client";

import Image from "next/image";
import { useState } from "react";
import { ExperienceTechChip } from "@/app/components/experience-tech-chip";
import type { ExperienceEntry } from "@/lib/experience";
import { experienceEntries } from "@/lib/experience";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ExperienceLogo({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="experience-timeline__logo">
      {entry.image ? (
        <Image
          src={entry.image}
          alt={`${entry.company} logo`}
          width={80}
          height={80}
        />
      ) : (
        <span className="text-3xl" aria-hidden>
          {entry.emoji ?? "◆"}
        </span>
      )}
    </div>
  );
}

function ExperienceContent({ entry }: { entry: ExperienceEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-w-0 flex-1">
      <h3 className="experience-timeline__title">{entry.title}</h3>
      <p className="experience-timeline__meta">{entry.company}</p>
      <p className="experience-timeline__period">{entry.period}</p>
      <p className="experience-timeline__desc">{entry.description}</p>

      <div
        className="experience-timeline__details"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="experience-timeline__details-inner">
          <div className="experience-timeline__details-panel">
            <h4>Activities</h4>
            <ul>
              {entry.activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </div>
          <div className="experience-timeline__details-panel">
            <h4>Technologies</h4>
            <ul className="experience-timeline__tech-list">
              {entry.technologies.map((tech) => (
                <ExperienceTechChip
                  key={tech}
                  name={tech}
                  showIcon={expanded}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="experience-timeline__toggle"
      >
        {expanded ? "See less" : "See more"}
        <ChevronIcon open={expanded} />
      </button>
    </div>
  );
}

export function ExperienceTimeline() {
  return (
    <ol className="experience-timeline__list">
      {experienceEntries.map((entry) => (
        <li key={entry.id} className="experience-timeline__item">
          <div className="experience-timeline__row">
            <ExperienceLogo entry={entry} />
            <ExperienceContent entry={entry} />
          </div>
        </li>
      ))}
    </ol>
  );
}
