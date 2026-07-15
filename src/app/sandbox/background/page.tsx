import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GamesShowcase from "@/components/GamesShowcase";
import About from "@/components/About";
import Careers from "@/components/Careers";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import BackgroundGrid from "@/components/BackgroundGrid";
import { getGames, getJobs, getSettings } from "@/utils/db";
import styles from "./SandboxBackground.module.css";

// Force dynamic so that database edits are read live, matching the homepage behavior
export const dynamic = 'force-dynamic';

export default async function SandboxBackgroundPage() {
  // Fetch games, jobs, and settings from the database in parallel
  const [games, jobs, settings] = await Promise.all([
    getGames(),
    getJobs(),
    getSettings()
  ]);

  return (
    <div className={styles.sandboxWrapper}>
      {/* Reusable premium background grid with floating, scroll-parallax SVGs */}
      <BackgroundGrid />

      <div className={styles.contentWrapper}>
        <Header />
        <main className="flex-1 relative z-10">
          <Hero />
          <GamesShowcase initialGames={games} />
          <About />
          <Careers initialJobs={jobs} />
          <ContactForm jobs={jobs} settings={settings} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
