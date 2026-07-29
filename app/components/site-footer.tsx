import { FocusMarquee } from "@/app/components/focus-marquee";
import { PageColumn } from "@/app/components/page-column";
import { contactLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer>
      <PageColumn variant="section" className="pb-20 pt-16 sm:pb-28 sm:pt-20">
        <h2 className="mb-2 font-display text-4xl leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {site.footer.headline[0]}
          <br />
          <em className="italic-role">{site.footer.headline[1]}</em>
        </h2>

        <FocusMarquee items={site.footer.focusAreas} />

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0 space-y-1">
            <p className="m-0 font-display text-xl tracking-tight text-foreground sm:text-2xl">
              {site.fullName}
            </p>
            <p className="type-body-sm m-0">
              {site.role} · {site.location}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:text-right">
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow"
            >
              Let&apos;s chat →
            </a>
            <p className="type-body-sm m-0">
              {contactLinks.map((link, index) => (
                <span key={link.label}>
                  {index > 0 ? (
                    <span className="text-muted/40" aria-hidden>
                      {" "}
                      ·{" "}
                    </span>
                  ) : null}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </PageColumn>
    </footer>
  );
}
