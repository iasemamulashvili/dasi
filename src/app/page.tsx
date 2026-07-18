import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { getGames, getJobs, getSettings, getAboutSettings } from "@/utils/db";

const WebGLFeaturedSlider = dynamic(() => import("@/components/WebGLFeaturedSlider"), { ssr: true });
const GamesShowcase = dynamic(() => import("@/components/GamesShowcase"), { ssr: true });
const About = dynamic(() => import("@/components/About"), { ssr: true });
const Careers = dynamic(() => import("@/components/Careers"), { ssr: true });
const ContactForm = dynamic(() => import("@/components/ContactForm"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

// Cache the landing page for 5 minutes, invalidated immediately in production when admin saves updates
export const revalidate = 300;

export default async function Home() {
  const [games, jobs, settings, aboutData] = await Promise.all([
    getGames(),
    getJobs(),
    getSettings(),
    getAboutSettings()
  ]);

  // Resolve the 3 featured games based on settings configuration
  const featuredSelections = settings.featuredGames || [];
  const featuredGames = featuredSelections
    .map((selection) => {
      const game = games.find((g) => g.id === selection.gameId);
      if (!game) return null;
      return {
        ...game,
        featuredSubtitle: selection.featuredSubtitle || game.title,
        featuredImage: selection.featuredImage || game.iconSrc,
        showStatsBox: selection.showStatsBox
      };
    })
    .filter(Boolean) as any[];

  // Fallback if no games are configured or matching
  if (featuredGames.length === 0) {
    featuredGames.push(...games.slice(0, 3).map(g => ({ ...g, showStatsBox: false })));
  }

  // Filter out featured games from the portfolio showcase
  const featuredIds = new Set(featuredGames.map(g => g.id));
  const remainingGames = games.filter(g => !featuredIds.has(g.id));

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WebGLFeaturedSlider featuredGames={featuredGames} />
        <GamesShowcase initialGames={remainingGames} />
        <About aboutData={aboutData} />
        <Careers initialJobs={jobs} />
        <ContactForm jobs={jobs} settings={settings} />
      </main>
      <Footer />
    </>
  );
}
