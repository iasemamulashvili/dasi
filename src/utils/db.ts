import fs from 'fs';
import path from 'path';

// Define structures
export interface Game {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  playstoreLink: string;
  appstoreLink: string;
  pokiLink: string;
  isAndroid: boolean;
  isIOS: boolean;
  isPoki: boolean;
  videoSrc: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const GAMES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'games.json');
const JOBS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'jobs.json');

// Memory cache for serverless environments when DB env is not fully configured yet
let inMemoryGames: Game[] | null = null;
let inMemoryJobs: Job[] | null = null;

// Helper to determine if we are in server-side node environment and can write files
const isLocalFileSystemWritable = () => {
  try {
    const tempFile = path.join(process.cwd(), 'src', 'data', '.writable-test');
    fs.writeFileSync(tempFile, 'test');
    fs.unlinkSync(tempFile);
    return true;
  } catch (e) {
    return false;
  }
};

// Vercel KV Helper
const getKVConfig = () => {
  const url = process.env.KV_REST_API_URL || 
              process.env.UPSTASH_REDIS_REST_URL || 
              process.env.KV_URL || 
              process.env.STORAGE_URL || 
              process.env.STORAGE_KV_REST_API_URL || 
              process.env.STORAGE_KV_URL;
  const token = process.env.KV_REST_API_TOKEN || 
                process.env.UPSTASH_REDIS_REST_TOKEN || 
                process.env.KV_TOKEN || 
                process.env.STORAGE_TOKEN || 
                process.env.STORAGE_KV_REST_API_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
};

// Fetch from KV
async function fetchKV(cmd: string, body?: any): Promise<any> {
  const kv = getKVConfig();
  if (!kv) return null;

  const response = await fetch(`${kv.url}/${cmd}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${kv.token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`KV API Error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data && data.error) {
    throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
  }
  return data.result;
}

// -------------------------------------------------------------
// Games Data Methods
// -------------------------------------------------------------
export async function getGames(): Promise<Game[]> {
  // 1. Try Vercel KV first if configured
  const kv = getKVConfig();
  if (kv) {
    try {
      const kvGamesStr = await fetchKV('get/dasi_games');
      if (kvGamesStr) {
        return typeof kvGamesStr === 'string' ? JSON.parse(kvGamesStr) : kvGamesStr;
      }
    } catch (e) {
      console.error('Error fetching games from Vercel KV, falling back to local files:', e);
    }
  }

  // 2. Use in-memory cache if writable files are not available (e.g. Vercel serverless without KV configured yet)
  if (!isLocalFileSystemWritable() && inMemoryGames) {
    return inMemoryGames;
  }

  // 3. Fallback to local files
  try {
    if (fs.existsSync(GAMES_FILE_PATH)) {
      const content = fs.readFileSync(GAMES_FILE_PATH, 'utf-8');
      const games = JSON.parse(content);
      if (!isLocalFileSystemWritable()) {
        inMemoryGames = games; // populate in-memory fallback
      }
      return games;
    }
  } catch (e) {
    console.error('Error reading games file:', e);
  }

  return [];
}

export async function saveGames(games: Game[]): Promise<void> {
  // 1. Try saving to Vercel KV if configured
  const kv = getKVConfig();
  if (kv) {
    try {
      await fetchKV('set/dasi_games', games);
      console.log('Saved games to Vercel KV');
    } catch (e) {
      console.error('Failed to save games to Vercel KV:', e);
      throw e;
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database Error: Vercel KV / Upstash Redis is not configured in production. State cannot be saved.');
    }
  }

  // 2. Always update in-memory cache
  inMemoryGames = games;

  // 3. Save to local disk if writing is supported
  if (isLocalFileSystemWritable()) {
    try {
      fs.writeFileSync(GAMES_FILE_PATH, JSON.stringify(games, null, 2), 'utf-8');
      console.log('Saved games to local file');
    } catch (e) {
      console.error('Failed to write games to local file:', e);
    }
  } else {
    console.warn('Filesystem is read-only. Data saved in memory only.');
  }
}

// -------------------------------------------------------------
// Jobs Data Methods
// -------------------------------------------------------------
export async function getJobs(): Promise<Job[]> {
  // 1. Try Vercel KV
  const kv = getKVConfig();
  if (kv) {
    try {
      const kvJobsStr = await fetchKV('get/dasi_jobs');
      if (kvJobsStr) {
        return typeof kvJobsStr === 'string' ? JSON.parse(kvJobsStr) : kvJobsStr;
      }
    } catch (e) {
      console.error('Error fetching jobs from Vercel KV, falling back to local files:', e);
    }
  }

  // 2. InMemory fallback
  if (!isLocalFileSystemWritable() && inMemoryJobs) {
    return inMemoryJobs;
  }

  // 3. Local files fallback
  try {
    if (fs.existsSync(JOBS_FILE_PATH)) {
      const content = fs.readFileSync(JOBS_FILE_PATH, 'utf-8');
      const jobs = JSON.parse(content);
      if (!isLocalFileSystemWritable()) {
        inMemoryJobs = jobs;
      }
      return jobs;
    }
  } catch (e) {
    console.error('Error reading jobs file:', e);
  }

  return [];
}

export async function saveJobs(jobs: Job[]): Promise<void> {
  // 1. Try saving to Vercel KV
  const kv = getKVConfig();
  if (kv) {
    try {
      await fetchKV('set/dasi_jobs', jobs);
      console.log('Saved jobs to Vercel KV');
    } catch (e) {
      console.error('Failed to save jobs to Vercel KV:', e);
      throw e;
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database Error: Vercel KV / Upstash Redis is not configured in production. State cannot be saved.');
    }
  }

  // 2. Update memory
  inMemoryJobs = jobs;

  // 3. Write locally if possible
  if (isLocalFileSystemWritable()) {
    try {
      fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(jobs, null, 2), 'utf-8');
      console.log('Saved jobs to local file');
    } catch (e) {
      console.error('Failed to write jobs to local file:', e);
    }
  } else {
    console.warn('Filesystem is read-only. Data saved in memory only.');
  }
}
