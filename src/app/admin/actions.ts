'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession, getSession } from '@/utils/auth';
import { getGames, saveGames, getJobs, saveJobs, Game, Job } from '@/utils/db';

const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'dasigames2026';

// -------------------------------------------------------------
// Authentication Actions
// -------------------------------------------------------------
export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter both username and password.' };
  }

  if (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
    await createSession(username);
    redirect('/admin/dashboard');
  }

  return { error: 'Invalid username or password.' };
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}

// Helper to assert authorized admin
async function assertAuthorized() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
}

// -------------------------------------------------------------
// Game Actions
// -------------------------------------------------------------
export async function saveGameAction(gameData: Game) {
  await assertAuthorized();
  const games = await getGames();
  const index = games.findIndex((g) => g.id === gameData.id);

  if (index >= 0) {
    games[index] = gameData;
  } else {
    games.push(gameData);
  }

  await saveGames(games);
  return { success: true };
}

export async function deleteGameAction(gameId: string) {
  await assertAuthorized();
  let games = await getGames();
  games = games.filter((g) => g.id !== gameId);
  await saveGames(games);
  return { success: true };
}

// -------------------------------------------------------------
// Job Actions
// -------------------------------------------------------------
export async function saveJobAction(jobData: Job) {
  await assertAuthorized();
  const jobs = await getJobs();
  const index = jobs.findIndex((j) => j.id === jobData.id);

  if (index >= 0) {
    jobs[index] = jobData;
  } else {
    jobs.push(jobData);
  }

  await saveJobs(jobs);
  return { success: true };
}

export async function deleteJobAction(jobId: string) {
  await assertAuthorized();
  let jobs = await getJobs();
  jobs = jobs.filter((j) => j.id !== jobId);
  await saveJobs(jobs);
  return { success: true };
}
