"use client";
import "./project-chrome.css";

import { useEffect, useId, useRef, useState } from "react";
import { ExternalLinkIcon } from "@/app/components/icons/external-link-icon";
import { GitHubIcon } from "@/app/components/icons/github-icon";
import { RegistryIcon } from "@/app/components/icons/registry-icon";
import { TerminalIcon } from "@/app/components/icons/terminal-icon";
import type { ProjectSite, ProjectSiteIcon } from "@/lib/projects/projects";

function SiteIcon({
  icon,
  className,
}: {
  icon?: ProjectSiteIcon;
  className?: string;
}) {
  switch (icon) {
    case "cli":
      return <TerminalIcon className={className} />;
    case "registry":
      return <RegistryIcon className={className} />;
    default:
      return <ExternalLinkIcon className={className} />;
  }
}

function ProjectSitesControl({
  projectName,
  sites,
}: {
  projectName: string;
  sites: ProjectSite[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (sites.length === 1) {
    const only = sites[0];
    return (
      <a
        href={only.href}
        target="_blank"
        rel="noopener noreferrer"
        className="project-case__action"
        aria-label={`Open ${projectName} ${only.label}`}
        title={only.label}
      >
        <ExternalLinkIcon className="project-case__action-icon" />
      </a>
    );
  }

  return (
    <div className="project-case__menu" ref={rootRef}>
      <button
        type="button"
        className="project-case__action"
        aria-label={`Open ${projectName} sites`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        title="Sites"
        onClick={() => setOpen((value) => !value)}
      >
        <ExternalLinkIcon className="project-case__action-icon" />
      </button>

      {open ? (
        <div id={menuId} className="project-case__menu-panel" role="menu">
          {sites.map((siteLink) => (
            <a
              key={siteLink.href}
              href={siteLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-case__menu-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <SiteIcon
                icon={siteLink.icon}
                className="project-case__menu-item-icon"
              />
              <span>{siteLink.label}</span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProjectCaseActions({
  projectName,
  githubHref,
  sites,
}: {
  projectName: string;
  githubHref?: string;
  sites?: ProjectSite[];
}) {
  if (!githubHref && (!sites || sites.length === 0)) {
    return null;
  }

  return (
    <div className="project-case__actions">
      {githubHref ? (
        <a
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="project-case__action"
          aria-label={`${projectName} on GitHub`}
          title="GitHub"
        >
          <GitHubIcon className="project-case__action-icon" />
        </a>
      ) : null}
      {sites && sites.length > 0 ? (
        <ProjectSitesControl projectName={projectName} sites={sites} />
      ) : null}
    </div>
  );
}
