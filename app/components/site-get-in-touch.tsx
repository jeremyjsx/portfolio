import { SocialIcon } from "@/app/components/icons/social-icon";
import { PageColumn } from "@/app/components/page-column";
import { site, socialLinks } from "@/lib/site";

export function SiteGetInTouch() {
  return (
    <PageColumn
      id="contact"
      variant="section"
      ruleTop
      className="get-in-touch-column scroll-mt-20"
    >
      <div className="get-in-touch">
        <div className="get-in-touch__copy">
          <h2 className="get-in-touch__title m-0">{site.getInTouch.title}</h2>
          <p className="get-in-touch__body m-0">
            {site.getInTouch.line1}
            <br />
            {site.getInTouch.line2}
          </p>
        </div>

        <ul className="social-grid m-0 list-none p-0">
          {socialLinks.map((link) => (
            <li key={link.label} className="social-grid__item">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-grid__link"
                aria-label={link.label}
              >
                <span className="social-grid__icon-slot" aria-hidden>
                  <SocialIcon label={link.label} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageColumn>
  );
}
