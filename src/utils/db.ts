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
  
  // Featured-specific fields for the WebGL displacement slider
  isFeatured?: boolean;
  featuredImage?: string;
  featuredSubtitle?: string;
  engine?: string;
  downloads?: string;
  activePlayers?: string;
  rating?: string;
}

export interface JobUploadField {
  id: string;
  label: string;
  placeholder: string;
  accept: string;
  isRequired: boolean;
  type?: 'file' | 'url' | 'both';
}

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  customUploads?: JobUploadField[];
  iconType?: 'default' | 'custom';
  icon?: string; // name of default or URL/path of custom
}

export interface AboutCard {
  id: string;
  metricValue: string;
  metricLabel: string;
  subtitle: string;
  description: string;
  iconType: 'default' | 'custom';
  defaultIconKey: string;
  customIconUrl?: string;
}

export interface AboutSettings {
  title: string;
  subtitle: string;
  paragraphs: string[];
  cards: AboutCard[];
}

const GAMES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'games.json');
const JOBS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'jobs.json');
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'settings.json');
const ABOUT_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'about.json');

export interface FeaturedGameSelection {
  gameId: string;
  featuredSubtitle?: string;
  featuredImage?: string;
  showStatsBox?: boolean;
}

export interface Settings {
  contactEmail: string;
  featuredGames?: FeaturedGameSelection[];
  showStatsBox?: boolean;
  uploadRequirements?: {
    [subjectKey: string]: {
      allowed: string[];
      required: string[];
    };
  };
}

// Memory cache for serverless environments when DB env is not fully configured yet
let inMemoryGames: Game[] | null = null;
let inMemoryJobs: Job[] | null = null;
let inMemorySettings: Settings | null = null;
let inMemoryAbout: AboutSettings | null = null;

// Cache the write check once at startup to avoid blocking the event loop on every request
const cachedLocalFileSystemWritable = (() => {
  try {
    const tempFile = path.join(process.cwd(), 'src', 'data', '.writable-test');
    fs.writeFileSync(tempFile, 'test');
    fs.unlinkSync(tempFile);
    return true;
  } catch (e) {
    return false;
  }
})();

// Helper to determine if we are in server-side node environment and can write files
const isLocalFileSystemWritable = () => cachedLocalFileSystemWritable;

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

// -------------------------------------------------------------
// Settings Data Methods
// -------------------------------------------------------------
export async function getSettings(): Promise<Settings> {
  const defaultFeaturedGames = [
    { gameId: 'crown-quest', featuredSubtitle: 'Epic Action RPG Adventure', featuredImage: '/crown-quest.png' },
    { gameId: 'lumber-chopper', featuredSubtitle: 'Idle Wood Empire Tycoon', featuredImage: '/lumber-chopper.png' },
    { gameId: 'hotel-manager', featuredSubtitle: '5-Star Luxury Resort Simulator', featuredImage: '/hotel-manager.png' }
  ];

  const kv = getKVConfig();
  if (kv) {
    try {
      const kvSettingsStr = await fetchKV('get/dasi_settings');
      if (kvSettingsStr) {
        const settings = typeof kvSettingsStr === 'string' ? JSON.parse(kvSettingsStr) : kvSettingsStr;
        if (!settings.featuredGames) {
          settings.featuredGames = defaultFeaturedGames;
        }
        return settings;
      }
    } catch (e) {
      console.error('Error fetching settings from Vercel KV, falling back to local files:', e);
    }
  }

  if (!isLocalFileSystemWritable() && inMemorySettings) {
    if (!inMemorySettings.featuredGames) {
      inMemorySettings.featuredGames = defaultFeaturedGames;
    }
    return inMemorySettings;
  }

  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const settings = JSON.parse(content);
      if (!settings.featuredGames) {
        settings.featuredGames = defaultFeaturedGames;
      }
      if (!isLocalFileSystemWritable()) {
        inMemorySettings = settings;
      }
      return settings;
    }
  } catch (e) {
    console.error('Error reading settings file:', e);
  }

  // Fallback to environment variable or default
  return { 
    contactEmail: process.env.CONTACT_DESTINATION_EMAIL || 'info@dasigames.com',
    featuredGames: defaultFeaturedGames
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const kv = getKVConfig();
  if (kv) {
    try {
      await fetchKV('set/dasi_settings', settings);
      console.log('Saved settings to Vercel KV');
    } catch (e) {
      console.error('Failed to save settings to Vercel KV:', e);
      throw e;
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database Error: Vercel KV / Upstash Redis is not configured in production. State cannot be saved.');
    }
  }

  inMemorySettings = settings;

  if (isLocalFileSystemWritable()) {
    try {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
      console.log('Saved settings to local file');
    } catch (e) {
      console.error('Failed to write settings to local file:', e);
    }
  } else {
    console.warn('Filesystem is read-only. Data saved in memory only.');
  }
}

// -------------------------------------------------------------
// About Us Content Methods
// -------------------------------------------------------------
export async function getAboutSettings(): Promise<AboutSettings> {
  const defaultAbout: AboutSettings = {
    title: 'About Us',
    subtitle: 'Our Studio Story',
    paragraphs: [
      "Our journey began with a shared love for gaming and a drive to create exceptional experiences. We develop our own original titles, collaborate with publishers, and offer reliable outsourcing services.",
      "We are based in our cozy office in Tbilisi, Georgia. Our team values creativity, technical precision, and a collaborative spirit, ensuring each game we produce is crafted with care and meets international standards."
    ],
    cards: [
      {
        id: 'downloads',
        metricValue: '50',
        metricLabel: 'M+ Downloads',
        subtitle: 'Worldwide Impact',
        description: 'Mobile downloads exceeding 50 million across Google Play and App Store.',
        iconType: 'default',
        defaultIconKey: 'Globe'
      },
      {
        id: 'web-plays',
        metricValue: '28',
        metricLabel: '',
        subtitle: 'M+ Web Plays',
        description: 'Over 28 million web game plays on Poki and other web platforms.',
        iconType: 'default',
        defaultIconKey: 'Gamepad'
      },
      {
        id: 'founded',
        metricValue: '2021',
        metricLabel: '',
        subtitle: 'Founded',
        description: "Crafting memorable interactive experiences since our studio's establishment in 2021.",
        iconType: 'default',
        defaultIconKey: 'Sparkles'
      },
      {
        id: 'headquarters',
        metricValue: 'Tbilisi',
        metricLabel: '',
        subtitle: 'Georgia Headquarters',
        description: 'Located in Tbilisi, our creative headquarters serves as our core design and development hub.',
        iconType: 'default',
        defaultIconKey: 'MapPin'
      }
    ]
  };

  const kv = getKVConfig();
  if (kv) {
    try {
      const kvAboutStr = await fetchKV('get/dasi_about');
      if (kvAboutStr) {
        return typeof kvAboutStr === 'string' ? JSON.parse(kvAboutStr) : kvAboutStr;
      }
    } catch (e) {
      console.error('Error fetching about settings from Vercel KV, falling back to local files:', e);
    }
  }

  if (!isLocalFileSystemWritable() && inMemoryAbout) {
    return inMemoryAbout;
  }

  try {
    if (fs.existsSync(ABOUT_FILE_PATH)) {
      const content = fs.readFileSync(ABOUT_FILE_PATH, 'utf-8');
      const about = JSON.parse(content);
      if (!isLocalFileSystemWritable()) {
        inMemoryAbout = about;
      }
      return about;
    }
  } catch (e) {
    console.error('Error reading about file:', e);
  }

  return defaultAbout;
}

export async function saveAboutSettings(about: AboutSettings): Promise<void> {
  const kv = getKVConfig();
  if (kv) {
    try {
      await fetchKV('set/dasi_about', about);
      console.log('Saved about settings to Vercel KV');
    } catch (e) {
      console.error('Failed to save about settings to Vercel KV:', e);
      throw e;
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database Error: Vercel KV / Upstash Redis is not configured in production. State cannot be saved.');
    }
  }

  inMemoryAbout = about;

  if (isLocalFileSystemWritable()) {
    try {
      fs.writeFileSync(ABOUT_FILE_PATH, JSON.stringify(about, null, 2), 'utf-8');
      console.log('Saved about settings to local file');
    } catch (e) {
      console.error('Failed to write about settings to local file:', e);
    }
  } else {
    console.warn('Filesystem is read-only. Data saved in memory only.');
  }
}

