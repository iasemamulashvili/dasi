import { redirect } from 'next/navigation';
import { getSession } from '@/utils/auth';
import { getGames, getJobs, getSettings } from '@/utils/db';
import DashboardConsole from './DashboardConsole';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. Verify user session
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  // 2. Fetch list of games, job postings, and settings from data store
  const [games, jobs, settings] = await Promise.all([
    getGames(),
    getJobs(),
    getSettings(),
  ]);

  // 3. Render client dashboard
  return <DashboardConsole games={games} jobs={jobs} initialSettings={settings} />;
}
