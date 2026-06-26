'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import {
  Gamepad2,
  Briefcase,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  Smartphone,
  Laptop,
  Globe,
  Video,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Game, Job } from '@/utils/db';
import {
  saveGameAction,
  deleteGameAction,
  saveJobAction,
  deleteJobAction,
  logoutAction
} from '../actions';

interface ConsoleProps {
  games: Game[];
  jobs: Job[];
}

export default function DashboardConsole({ games: initialGames, jobs: initialJobs }: ConsoleProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activeTab, setActiveTab] = useState<'games' | 'jobs'>('games');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal / Form state for Games
  const [isGameFormOpen, setIsGameFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [gameFormData, setGameFormData] = useState<Game>({
    id: '',
    title: '',
    description: '',
    iconSrc: '',
    iconAlt: '',
    playstoreLink: '',
    appstoreLink: '',
    pokiLink: '',
    isAndroid: false,
    isIOS: false,
    isPoki: false,
    videoSrc: '',
    isFeatured: false,
    featuredImage: '',
    featuredSubtitle: '',
    engine: '',
    downloads: '',
    activePlayers: '',
    rating: ''
  });

  // Modal / Form state for Jobs
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobFormData, setJobFormData] = useState<{
    id: string;
    title: string;
    location: string;
    description: string;
    requirements: string;
    responsibilities: string;
  }>({
    id: '',
    title: '',
    location: '',
    description: '',
    requirements: '',
    responsibilities: ''
  });

  const router = useRouter();

  // Video Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB to protect Vercel Blob free tier
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB free tier limit. Please compress your video before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Check if Vercel Blob is enabled via GET diagnostics
      const statusRes = await fetch('/api/upload');
      const statusData = await statusRes.json();

      let videoUrl = '';
      if (statusData && statusData.vercelBlobEnabled) {
        // Use client-side direct upload to Vercel Blob (pre-sanitized to avoid library hang on special chars)
        const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        // Promise wrapper with a 30-second timeout to prevent UI hanging
        const uploadPromise = upload(cleanName, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Upload timed out. Please verify that your Vercel Blob store is set to Public access, has active bandwidth, and the token is correctly configured.')), 30000)
        );
        const blob = await Promise.race([uploadPromise, timeoutPromise]);
        videoUrl = blob.url;
      } else {
        // Local upload fallback (standard multipart POST request)
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || 'Upload failed');
        }
        const uploadData = await uploadRes.json();
        videoUrl = uploadData.url;
      }

      setGameFormData((prev) => ({ ...prev, videoSrc: videoUrl }));
    } catch (error: any) {
      console.error('Video upload error:', error);
      setUploadError(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // -------------------------------------------------------------
  // Game Actions
  // -------------------------------------------------------------
  const handleOpenGameForm = (game: Game | null) => {
    if (game) {
      setEditingGame(game);
      setGameFormData({
        ...game,
        isFeatured: game.isFeatured || false,
        featuredImage: game.featuredImage || '',
        featuredSubtitle: game.featuredSubtitle || '',
        engine: game.engine || '',
        downloads: game.downloads || '',
        activePlayers: game.activePlayers || '',
        rating: game.rating || ''
      });
    } else {
      setEditingGame(null);
      setGameFormData({
        id: '',
        title: '',
        description: '',
        iconSrc: '',
        iconAlt: '',
        playstoreLink: '',
        appstoreLink: '',
        pokiLink: '',
        isAndroid: false,
        isIOS: false,
        isPoki: false,
        videoSrc: '',
        isFeatured: false,
        featuredImage: '',
        featuredSubtitle: '',
        engine: '',
        downloads: '',
        activePlayers: '',
        rating: ''
      });
    }
    setIsGameFormOpen(true);
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate id from title if it's new
    const finalGameData = {
      ...gameFormData,
      id: gameFormData.id || gameFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      iconAlt: gameFormData.iconAlt || gameFormData.title.replace(/\s+/g, '_')
    };

    if (!finalGameData.id) {
      showMessage('Game Title is required.', 'error');
      return;
    }

    try {
      await saveGameAction(finalGameData);
      
      let updatedGames;
      if (editingGame) {
        updatedGames = games.map((g) => (g.id === finalGameData.id ? finalGameData : g));
        showMessage('Game details updated successfully.', 'success');
      } else {
        updatedGames = [...games, finalGameData];
        showMessage('New game added successfully.', 'success');
      }
      
      setGames(updatedGames);
      setIsGameFormOpen(false);
    } catch (err) {
      showMessage('Failed to save game.', 'error');
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;
    try {
      await deleteGameAction(id);
      setGames(games.filter((g) => g.id !== id));
      showMessage('Game deleted successfully.', 'success');
    } catch (err) {
      showMessage('Failed to delete game.', 'error');
    }
  };

  // -------------------------------------------------------------
  // Job Actions
  // -------------------------------------------------------------
  const handleOpenJobForm = (job: Job | null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        id: job.id,
        title: job.title,
        location: job.location,
        description: job.description,
        requirements: job.requirements ? job.requirements.join('\n') : '',
        responsibilities: job.responsibilities ? job.responsibilities.join('\n') : ''
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        id: '',
        title: '',
        location: '',
        description: '',
        requirements: '',
        responsibilities: ''
      });
    }
    setIsJobFormOpen(true);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalJobId = jobFormData.id || jobFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    if (!finalJobId) {
      showMessage('Job Title is required.', 'error');
      return;
    }

    const jobData: Job = {
      id: finalJobId,
      title: jobFormData.title,
      location: jobFormData.location,
      description: jobFormData.description,
      requirements: jobFormData.requirements.split('\n').map((l) => l.trim()).filter(Boolean),
      responsibilities: jobFormData.responsibilities.split('\n').map((l) => l.trim()).filter(Boolean)
    };

    try {
      await saveJobAction(jobData);

      let updatedJobs;
      if (editingJob) {
        updatedJobs = jobs.map((j) => (j.id === jobData.id ? jobData : j));
        showMessage('Job details updated successfully.', 'success');
      } else {
        updatedJobs = [...jobs, jobData];
        showMessage('New job posting created successfully.', 'success');
      }

      setJobs(updatedJobs);
      setIsJobFormOpen(false);
    } catch (err) {
      showMessage('Failed to save job.', 'error');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to remove this job posting?')) return;
    try {
      await deleteJobAction(id);
      setJobs(jobs.filter((j) => j.id !== id));
      showMessage('Job posting removed successfully.', 'success');
    } catch (err) {
      showMessage('Failed to delete job.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-dasi-black-950 text-dasi-steel-300">
      {/* Top Bar */}
      <header className="border-b border-white/5 bg-dasi-black-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xs font-bold tracking-widest text-dasi-alice-400 bg-dasi-alice-950/40 border border-dasi-alice-500/20 px-2.5 py-1 rounded-full uppercase">
              Admin Console
            </span>
          </div>

          <button
            onClick={() => logoutAction()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest text-rose-400 hover:text-white border border-rose-500/10 hover:border-rose-500/30 rounded-lg hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Floating Notification */}
        {message && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl flex items-center gap-3 shadow-2xl border ${
            message.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/90 border-rose-500/30 text-rose-400'
          }`}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        {/* Tab Header Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex bg-dasi-black-900/60 border border-white/5 p-1 rounded-xl w-max">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-dasi-black-500 text-white shadow-lg'
                  : 'text-dasi-steel-400 hover:text-white'
              }`}
            >
              <Gamepad2 size={16} />
              GAMES LIST
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-dasi-black-500 text-white shadow-lg'
                  : 'text-dasi-steel-400 hover:text-white'
              }`}
            >
              <Briefcase size={16} />
              CAREERS LIST
            </button>
          </div>

          <button
            onClick={() => (activeTab === 'games' ? handleOpenGameForm(null) : handleOpenJobForm(null))}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-dasi-alice-500 hover:bg-dasi-alice-600 text-white font-bold tracking-wider text-xs rounded-xl shadow-lg shadow-dasi-alice-950/40 transition-all cursor-pointer"
          >
            <Plus size={16} />
            {activeTab === 'games' ? 'ADD NEW GAME' : 'ADD NEW JOB'}
          </button>
        </div>

        {/* Tab Content: Games List */}
        {activeTab === 'games' && (
          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-dasi-black-900/40 text-[10px] font-bold tracking-widest text-dasi-steel-500 uppercase">
                    <th className="p-6">Icon</th>
                    <th className="p-6">Game Info</th>
                    <th className="p-6">Platforms</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {games.map((game) => (
                    <tr key={game.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-6">
                        <img
                          src={game.iconSrc || 'https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png'}
                          alt={game.title}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                        />
                      </td>
                      <td className="p-6">
                        <h4 className="font-bold text-white tracking-wide text-base">{game.title}</h4>
                        <p className="text-xs text-dasi-steel-500 mt-1 line-clamp-1 max-w-md">
                          {game.description}
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2 text-dasi-steel-500">
                          {game.isIOS && <span title="iOS Supported"><Smartphone size={16} className="text-dasi-alice-400" /></span>}
                          {game.isAndroid && <span title="Android Supported"><Laptop size={16} className="text-dasi-alice-400" /></span>}
                          {game.isPoki && <span title="Poki Supported"><Globe size={16} className="text-dasi-alice-400" /></span>}
                          {game.videoSrc && <span title="Video Loaded"><Video size={16} className="text-emerald-400" /></span>}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenGameForm(game)}
                            className="p-2 bg-dasi-ink-900 hover:bg-dasi-ink-800 border border-white/5 hover:border-dasi-alice-500/30 text-dasi-steel-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 bg-dasi-ink-900 hover:bg-rose-950/40 border border-white/5 hover:border-rose-500/30 text-dasi-steel-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Careers List */}
        {activeTab === 'jobs' && (
          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-dasi-black-900/40 text-[10px] font-bold tracking-widest text-dasi-steel-500 uppercase">
                    <th className="p-6">Job Title</th>
                    <th className="p-6">Location</th>
                    <th className="p-6">Subscribers / Lists count</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-6">
                        <h4 className="font-bold text-white tracking-wide text-base">{job.title}</h4>
                      </td>
                      <td className="p-6">
                        <span className="text-xs text-dasi-steel-400">{job.location}</span>
                      </td>
                      <td className="p-6 text-xs text-dasi-steel-500">
                        {job.requirements?.length || 0} reqs / {job.responsibilities?.length || 0} resps
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenJobForm(job)}
                            className="p-2 bg-dasi-ink-900 hover:bg-dasi-ink-800 border border-white/5 hover:border-dasi-alice-500/30 text-dasi-steel-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 bg-dasi-ink-900 hover:bg-rose-950/40 border border-white/5 hover:border-rose-500/30 text-dasi-steel-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Game Modal Dialog Form */}
      {isGameFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-dasi-black-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl glass-panel relative">
            <button
              onClick={() => setIsGameFormOpen(false)}
              className="absolute top-4 right-4 text-dasi-steel-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleGameSubmit} className="p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                  {editingGame ? 'Edit Game Listing' : 'Add New Game'}
                </h3>
                <p className="text-xs text-dasi-steel-500 mt-1 uppercase tracking-wider">
                  Fill in game information and platforms
                </p>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                    Game Title
                  </label>
                  <input
                    type="text"
                    required
                    value={gameFormData.title}
                    onChange={(e) => setGameFormData({ ...gameFormData, title: e.target.value })}
                    placeholder="My Epic RPG"
                    className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                    Game Slug (ID / Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={gameFormData.id}
                    disabled={!!editingGame}
                    onChange={(e) => setGameFormData({ ...gameFormData, id: e.target.value })}
                    placeholder="my-epic-rpg"
                    className="w-full px-4 py-2.5 bg-dasi-ink-950/40 border border-white/5 rounded-xl text-sm text-dasi-steel-500 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={gameFormData.description}
                  onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                  placeholder="Summarize the gameplay and primary features..."
                  className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 resize-none"
                />
              </div>

              {/* Assets Link: Icon & Video */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    required
                    value={gameFormData.iconSrc}
                    onChange={(e) => setGameFormData({ ...gameFormData, iconSrc: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                  />
                </div>
                 <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                    Hover Gameplay Video URL (Optional)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={gameFormData.videoSrc}
                      onChange={(e) => setGameFormData({ ...gameFormData, videoSrc: e.target.value })}
                      placeholder="https://...mp4 or upload file"
                      className="flex-1 min-w-0 px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                    />
                    <label className="relative cursor-pointer px-4 py-2.5 bg-dasi-black-500 hover:bg-dasi-black-600 border border-white/5 rounded-xl text-xs font-bold text-white transition-all duration-200 flex items-center justify-center shrink-0 min-w-[100px] h-[42px] select-none text-center">
                      {isUploading ? 'Uploading...' : 'Upload Video'}
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleVideoUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadError && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                      <AlertCircle size={10} />
                      <span>{uploadError}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Supported Checkboxes */}
              <div className="flex flex-wrap gap-6 border-y border-white/5 py-4 my-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gameFormData.isAndroid}
                    onChange={(e) => setGameFormData({ ...gameFormData, isAndroid: e.target.checked })}
                    className="rounded bg-dasi-ink-950 border-white/10 text-dasi-alice-500 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">Google Play / Android</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gameFormData.isIOS}
                    onChange={(e) => setGameFormData({ ...gameFormData, isIOS: e.target.checked })}
                    className="rounded bg-dasi-ink-950 border-white/10 text-dasi-alice-500 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">App Store / iOS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gameFormData.isPoki}
                    onChange={(e) => setGameFormData({ ...gameFormData, isPoki: e.target.checked })}
                    className="rounded bg-dasi-ink-950 border-white/10 text-dasi-alice-500 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">Poki Web Arcade</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-6">
                  <input
                    type="checkbox"
                    checked={gameFormData.isFeatured || false}
                    onChange={(e) => setGameFormData({ ...gameFormData, isFeatured: e.target.checked })}
                    className="rounded bg-dasi-ink-950 border-white/10 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">★ Feature on Mainframe Slider</span>
                </label>
              </div>

              {/* Featured Slider Fields (Only shown if isFeatured is checked) */}
              {gameFormData.isFeatured && (
                <div className="flex flex-col gap-4 p-4 bg-dasi-ink-950/40 border border-emerald-500/20 rounded-xl my-2 animate-fadeIn">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                    ★ Mainframe displacement featured details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                        Featured Showcase Image URL
                      </label>
                      <input
                        type="text"
                        value={gameFormData.featuredImage || ''}
                        onChange={(e) => setGameFormData({ ...gameFormData, featuredImage: e.target.value })}
                        placeholder="/crown-quest.png"
                        className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                        Featured Subtitle
                      </label>
                      <input
                        type="text"
                        value={gameFormData.featuredSubtitle || ''}
                        onChange={(e) => setGameFormData({ ...gameFormData, featuredSubtitle: e.target.value })}
                        placeholder="Epic Action RPG Adventure"
                        className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                        Engine
                      </label>
                      <input
                        type="text"
                        value={gameFormData.engine || ''}
                        onChange={(e) => setGameFormData({ ...gameFormData, engine: e.target.value })}
                        placeholder="Unity 3D"
                        className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                        Downloads
                      </label>
                      <input
                        type="text"
                        value={gameFormData.downloads || ''}
                        onChange={(e) => setGameFormData({ ...gameFormData, downloads: e.target.value })}
                        placeholder="5M+"
                        className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                        Active Players
                      </label>
                      <input
                        type="text"
                        value={gameFormData.activePlayers || ''}
                        onChange={(e) => setGameFormData({ ...gameFormData, activePlayers: e.target.value })}
                        placeholder="1.2M+"
                        className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                        Rating
                      </label>
                      <input
                        type="text"
                        value={gameFormData.rating || ''}
                        onChange={(e) => setGameFormData({ ...gameFormData, rating: e.target.value })}
                        placeholder="4.8"
                        className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Store Links */}
              <div className="flex flex-col gap-4">
                {gameFormData.isAndroid && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                      Google Play Store Link
                    </label>
                    <input
                      type="text"
                      value={gameFormData.playstoreLink}
                      onChange={(e) => setGameFormData({ ...gameFormData, playstoreLink: e.target.value })}
                      placeholder="https://play.google.com/..."
                      className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                    />
                  </div>
                )}
                {gameFormData.isIOS && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                      iOS App Store Link
                    </label>
                    <input
                      type="text"
                      value={gameFormData.appstoreLink}
                      onChange={(e) => setGameFormData({ ...gameFormData, appstoreLink: e.target.value })}
                      placeholder="https://apps.apple.com/..."
                      className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                    />
                  </div>
                )}
                {gameFormData.isPoki && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                      Poki Play Link
                    </label>
                    <input
                      type="text"
                      value={gameFormData.pokiLink}
                      onChange={(e) => setGameFormData({ ...gameFormData, pokiLink: e.target.value })}
                      placeholder="https://poki.com/..."
                      className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                    />
                  </div>
                )}
              </div>

              {/* Submit panel */}
              <button
                type="submit"
                className="w-full py-4 bg-dasi-alice-500 hover:bg-dasi-alice-600 text-white font-bold tracking-widest text-sm rounded-xl transition-all shadow-lg mt-4 cursor-pointer"
              >
                SAVE GAME ENTRY
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Job Modal Dialog Form */}
      {isJobFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-dasi-black-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl glass-panel relative">
            <button
              onClick={() => setIsJobFormOpen(false)}
              className="absolute top-4 right-4 text-dasi-steel-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleJobSubmit} className="p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                  {editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
                </h3>
                <p className="text-xs text-dasi-steel-500 mt-1 uppercase tracking-wider">
                  Fill in recruitment details and parameters
                </p>
              </div>

              {/* Job Title & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    placeholder="Unity developer"
                    className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    placeholder="Tbilisi, Georgia (On-site)"
                    className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  placeholder="Describe the scope of the role..."
                  className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 resize-none"
                />
              </div>

              {/* Requirements (One per line) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={4}
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  placeholder="- 2+ years C# experience&#10;- Good communication skills"
                  className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 resize-none"
                />
              </div>

              {/* Responsibilities (One per line) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  value={jobFormData.responsibilities}
                  onChange={(e) => setJobFormData({ ...jobFormData, responsibilities: e.target.value })}
                  placeholder="- Write clean C# code&#10;- Optimize mobile graphics"
                  className="w-full px-4 py-2.5 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 resize-none"
                />
              </div>

              {/* Submit panel */}
              <button
                type="submit"
                className="w-full py-4 bg-dasi-alice-500 hover:bg-dasi-alice-600 text-white font-bold tracking-widest text-sm rounded-xl transition-all shadow-lg mt-4 cursor-pointer"
              >
                SAVE JOB LISTING
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
