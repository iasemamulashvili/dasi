import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WebGLFeaturedSlider from "@/components/WebGLFeaturedSlider";
import GamesShowcase from "@/components/GamesShowcase";
import About from "@/components/About";
import Careers from "@/components/Careers";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getGames, getJobs } from "@/utils/db";

// Force dynamic so that database edits are read live in production
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [games, jobs] = await Promise.all([
    getGames(),
    getJobs()
  ]);

  const featuredIds = ['crown-quest', 'lumber-chopper', 'hotel-manager'];
  const remainingGames = games.filter(g => !featuredIds.includes(g.id || ''));

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WebGLFeaturedSlider />
        <GamesShowcase initialGames={remainingGames} />
        <About />
        <Careers initialJobs={jobs} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
