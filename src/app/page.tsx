import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WebGLFeaturedSlider from "@/components/WebGLFeaturedSlider";
import GamesShowcase from "@/components/GamesShowcase";
import About from "@/components/About";
import Careers from "@/components/Careers";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getGames, getJobs, getSettings } from "@/utils/db";

// Cache the landing page for 5 minutes, invalidated immediately in production when admin saves updates
export const revalidate = 300;

export default async function Home() {
  const [games, jobs, settings] = await Promise.all([
    getGames(),
    getJobs(),
    getSettings()
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
        <About />
        <Careers initialJobs={jobs} />
        <ContactForm jobs={jobs} settings={settings} />
      </main>
      <Footer />
    </>
  );
}
