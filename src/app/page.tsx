import Header from "@/components/Header";
import Hero from "@/components/Hero";
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

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <GamesShowcase initialGames={games} />
        <About />
        <Careers initialJobs={jobs} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
