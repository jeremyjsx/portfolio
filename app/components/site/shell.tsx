import { Suspense } from "react";
import { ScrollToTop } from "@/app/components/ui/scroll-to-top";
import { SiteFooter } from "@/app/components/site/footer";
import { SiteGetInTouch } from "@/app/components/site/get-in-touch";
import { SiteNavbar } from "@/app/components/site/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-root min-h-screen bg-background">
      <div className="page-rail-guides" aria-hidden />

      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      <SiteNavbar />

      <main className="page-main flex-1">
        {children}
        <SiteGetInTouch />
      </main>

      <SiteFooter />
    </div>
  );
}
