import { HomeBentoGrid } from "./organisms/HomeBentoGrid";
import { HomeCTA } from "./organisms/HomeCTA";
import { HomeFooter } from "./organisms/HomeFooter";
import { HomeHeader } from "./organisms/HomeHeader";
import { HomeHero } from "./organisms/HomeHero";

export function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HomeHeader />
      <main className="pt-16">
        <HomeHero />
        <HomeBentoGrid />
        <HomeCTA />
      </main>
      <HomeFooter />
    </div>
  );
}
