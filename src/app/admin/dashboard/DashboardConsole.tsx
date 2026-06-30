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
  Globe,
  Video,
  X,
  Check,
  AlertCircle,
  Cog,
  Tv,
  Upload
} from 'lucide-react';
import { Game, Job, Settings } from '@/utils/db';
import {
  saveGameAction,
  deleteGameAction,
  saveJobAction,
  deleteJobAction,
  logoutAction,
  saveSettingsAction
} from '../actions';

// Official App Store & Google Play Store SVG Icons
const AppStoreIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.7-22.9-76.9-22.4-36.6.6-70.3 21.6-89.2 54.2-38 65.9-9.8 162.8 27.3 216.3 18.2 26.2 39.8 55.3 68.2 54.2 27.2-1.1 37.5-17.6 68.5-17.6 31.1 0 40.4 17.6 68.8 17.1 29-1 48.2-26.4 66.2-52.7 21-30.7 29.7-60.4 30.2-62-1-1-65.2-25.1-65.7-100zM281.2 81.7c15.2-18.3 25.4-43.9 22.6-69.5-22 1-48.8 14.8-64.6 33.2-13.8 15.9-25.9 41.7-22.7 67 24.5 2 49.7-12.4 64.7-30.7z" />
  </svg>
);

const PlayStoreIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58 33.3 60.1 60.1L512 288c0-22-13.7-47.8-40-62.4zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
  </svg>
);

interface ConsoleProps {
  games: Game[];
  jobs: Job[];
  initialSettings: Settings;
}

export default function DashboardConsole({ games: initialGames, jobs: initialJobs, initialSettings }: ConsoleProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [settingsForm, setSettingsForm] = useState<Settings>(initialSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'showcase' | 'jobs' | 'settings'>('games');
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

  // File Upload states
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isUploadingSlot, setIsUploadingSlot] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds the 5MB free tier limit. Please compress your file before uploading.');
    }

    const statusRes = await fetch('/api/upload');
    const statusData = await statusRes.json();

    if (statusData && statusData.vercelBlobEnabled) {
      const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadPromise = upload(cleanName, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timed out.')), 30000)
      );
      const blob = await Promise.race([uploadPromise, timeoutPromise]);
      return blob.url;
    } else {
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
      return uploadData.url;
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadError(null);

    try {
      const url = await handleFileUpload(file);
      setGameFormData((prev) => ({ ...prev, videoSrc: url }));
      showMessage('Video uploaded successfully.', 'success');
    } catch (error: any) {
      console.error('Video upload error:', error);
      setUploadError(error.message || 'Failed to upload video');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingIcon(true);
    setUploadError(null);

    try {
      const url = await handleFileUpload(file);
      setGameFormData((prev) => ({ ...prev, iconSrc: url }));
      showMessage('Thumbnail uploaded successfully.', 'success');
    } catch (error: any) {
      console.error('Thumbnail upload error:', error);
      setUploadError(error.message || 'Failed to upload icon');
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleSlotImageUpload = async (slotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSlot(slotIdx);
    setUploadError(null);

    try {
      const url = await handleFileUpload(file);
      setSettingsForm((prev) => {
        const featuredGames = [...(prev.featuredGames || [])];
        while (featuredGames.length <= slotIdx) {
          featuredGames.push({ gameId: '' });
        }
        featuredGames[slotIdx] = {
          ...featuredGames[slotIdx],
          featuredImage: url
        };
        return { ...prev, featuredGames };
      });
      showMessage(`Featured image for Slot ${slotIdx + 1} uploaded successfully.`, 'success');
    } catch (error: any) {
      console.error('Slot upload error:', error);
      setUploadError(error.message || 'Failed to upload featured image');
    } finally {
      setIsUploadingSlot(null);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await saveSettingsAction(settingsForm);
      if (res.success) {
        showMessage('System settings updated successfully.', 'success');
      } else {
        showMessage('Failed to save settings.', 'error');
      }
    } catch (err: any) {
      showMessage(err.message || 'Failed to save settings.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
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
    <div className="min-h-screen bg-carbon-black text-alabaster-grey">
      {/* Top Bar */}
      <header className="border-b border-graphite-light bg-carbon-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xs font-bold tracking-widest text-slate-violet-light bg-slate-violet/10 border border-slate-violet/20 px-2.5 py-1 rounded-full uppercase">
              Admin Console
            </span>
          </div>

          <button
            onClick={() => logoutAction()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest text-rose-400 hover:text-rose-300 border border-rose-500/10 hover:border-rose-500/30 rounded-xl hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Floating Notification */}
        {message && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl flex items-center gap-3 shadow-2xl border ${
            message.type === 'success' ? 'bg-carbon-black-2 border-muted-green/20 text-muted-green-light' : 'bg-carbon-black-2 border-rose-500/20 text-rose-400'
          }`}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}



        {/* Tab Header Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex bg-carbon-black border border-graphite-light p-1 rounded-xl w-max flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-graphite text-bright-snow'
                  : 'text-alabaster-grey/60 hover:text-bright-snow'
              }`}
            >
              <Gamepad2 size={14} />
              GAMES LIST
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'showcase'
                  ? 'bg-graphite text-bright-snow'
                  : 'text-alabaster-grey/60 hover:text-bright-snow'
              }`}
            >
              <Tv size={14} />
              FEATURED SHOWCASE
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-graphite text-bright-snow'
                  : 'text-alabaster-grey/60 hover:text-bright-snow'
              }`}
            >
              <Briefcase size={14} />
              CAREERS LIST
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-graphite text-bright-snow'
                  : 'text-alabaster-grey/60 hover:text-bright-snow'
              }`}
            >
              <Cog size={14} />
              SYSTEM SETTINGS
            </button>
          </div>

          {(activeTab === 'games' || activeTab === 'jobs') && (
            <button
              onClick={() => (activeTab === 'games' ? handleOpenGameForm(null) : handleOpenJobForm(null))}
              className="bg-slate-violet hover:bg-slate-violet-light text-bright-snow font-semibold px-5 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Plus size={14} />
              {activeTab === 'games' ? 'ADD NEW GAME' : 'ADD NEW JOB'}
            </button>
          )}
        </div>

        {/* Tab Content: Games List */}
        {activeTab === 'games' && (
          <div className="flex flex-col gap-6">
            {/* Desktop Table view (Visible on md and up) */}
            <div className="hidden md:block bg-carbon-black-2 border border-graphite-light rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-graphite-light bg-carbon-black/40 text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      <th className="p-6">Icon</th>
                      <th className="p-6">Game Info</th>
                      <th className="p-6">Platforms</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-graphite-light text-sm">
                    {games.map((game) => (
                      <tr key={game.id} className="hover:bg-graphite/10 transition-colors">
                        <td className="p-6">
                          <img
                            src={game.iconSrc || 'https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png'}
                            alt={game.title}
                            className="w-12 h-12 rounded-xl object-cover border border-graphite-light"
                          />
                        </td>
                        <td className="p-6">
                          <div className="font-semibold text-bright-snow tracking-wide text-base flex items-center gap-2">
                            {game.title}
                            {settingsForm.featuredGames?.some((f) => f.gameId === game.id) && (
                              <span className="px-1.5 py-0.5 bg-muted-green/10 border border-muted-green/20 rounded-md text-[8px] text-muted-green-light uppercase tracking-wider font-semibold">
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-alabaster-grey/60 mt-1 line-clamp-1 max-w-md">
                            {game.description}
                          </p>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2 text-alabaster-grey/60 items-center">
                            {game.isIOS && <span title="iOS Supported"><AppStoreIcon className="w-4 h-4 text-slate-violet-light" /></span>}
                            {game.isAndroid && <span title="Android Supported"><PlayStoreIcon className="w-4 h-4 text-slate-violet-light" /></span>}
                            {game.isPoki && <span title="Poki Supported"><Globe size={16} className="text-slate-violet-light" /></span>}
                            {game.videoSrc && <span title="Video Loaded"><Video size={16} className="text-muted-green-light" /></span>}
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenGameForm(game)}
                              className="p-2 bg-graphite hover:bg-graphite-light border border-graphite-light text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteGame(game.id)}
                              className="p-2 bg-graphite hover:bg-rose-950/20 border border-graphite-light hover:border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-xl transition-all cursor-pointer"
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

            {/* Mobile Card List (Visible on mobile only) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {games.map((game) => (
                <div key={game.id} className="bg-carbon-black-2 border border-graphite-light p-4 rounded-xl flex flex-col gap-4">
                  <div className="flex gap-3 items-start">
                    <img 
                      src={game.iconSrc || 'https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png'} 
                      alt={game.title} 
                      className="w-12 h-12 rounded-lg object-cover border border-graphite-light shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-bright-snow truncate flex flex-wrap items-center gap-2">
                        {game.title}
                        {settingsForm.featuredGames?.some((f) => f.gameId === game.id) && (
                          <span className="px-1.5 py-0.5 bg-muted-green/10 border border-muted-green/20 rounded-md text-[8px] text-muted-green-light uppercase tracking-wider font-semibold">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-alabaster-grey/60 line-clamp-2 mt-1">
                        {game.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-graphite-light/40 pt-3">
                    <div className="flex gap-2 text-alabaster-grey/60 items-center">
                      {game.isIOS && <span title="iOS Supported"><AppStoreIcon className="w-3.5 h-3.5 text-slate-violet-light" /></span>}
                      {game.isAndroid && <span title="Android Supported"><PlayStoreIcon className="w-3.5 h-3.5 text-slate-violet-light" /></span>}
                      {game.isPoki && <Globe size={14} className="text-slate-violet-light" />}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenGameForm(game)} 
                        className="p-2 bg-graphite hover:bg-graphite-light border border-graphite-light rounded-xl text-bright-snow"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteGame(game.id)} 
                        className="p-2 bg-graphite hover:bg-rose-950/20 border border-graphite-light hover:border-rose-500/30 rounded-xl text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Featured Showcase */}
        {activeTab === 'showcase' && (
          <div className="flex flex-col gap-8">
            <div className="bg-carbon-black-2 border border-graphite-light p-6 rounded-2xl">
              <h3 className="text-base font-bold text-bright-snow font-russo-one uppercase tracking-wider mb-2">
                WebGL Displacement Slider Configuration
              </h3>
              <p className="text-xs text-alabaster-grey/70 mb-6 leading-relaxed font-outfit max-w-2xl">
                Configure the three games featured in the WebGL liquid-morphing slider on the homepage. 
                Select a game for each slot, enter a featured subtitle, and upload the background morphing image. 
                Save your settings at the bottom to apply changes.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map((slotIdx) => {
                  const slot = settingsForm.featuredGames?.[slotIdx] || { gameId: '', featuredSubtitle: '', featuredImage: '' };
                  return (
                    <div key={slotIdx} className="bg-carbon-black border border-graphite-light p-5 rounded-xl flex flex-col gap-4 relative">
                      <div className="absolute top-4 right-4 text-[10px] font-silkscreen font-bold text-slate-violet-light bg-slate-violet/10 border border-slate-violet/20 px-2 py-0.5 rounded">
                        SLOT {slotIdx + 1}
                      </div>

                      {/* Select Game */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                          Select Featured Game
                        </label>
                        <select
                          value={slot.gameId}
                          onChange={(e) => {
                            setSettingsForm((prev) => {
                              const featuredGames = [...(prev.featuredGames || [])];
                              while (featuredGames.length <= slotIdx) featuredGames.push({ gameId: '' });
                              featuredGames[slotIdx] = { ...featuredGames[slotIdx], gameId: e.target.value };
                              return { ...prev, featuredGames };
                            });
                          }}
                          className="px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light cursor-pointer"
                        >
                          <option value="">-- Choose a Game --</option>
                          {games.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Featured Subtitle */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                          Featured Subtitle
                        </label>
                        <input
                          type="text"
                          value={slot.featuredSubtitle || ''}
                          onChange={(e) => {
                            setSettingsForm((prev) => {
                              const featuredGames = [...(prev.featuredGames || [])];
                              while (featuredGames.length <= slotIdx) featuredGames.push({ gameId: '' });
                              featuredGames[slotIdx] = { ...featuredGames[slotIdx], featuredSubtitle: e.target.value };
                              return { ...prev, featuredGames };
                            });
                          }}
                          placeholder="e.g. Epic Action RPG Adventure"
                          className="px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                        />
                      </div>

                      {/* Featured Image (Morph Texture) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                          Morphing Background Image URL
                        </label>
                        <input
                          type="text"
                          value={slot.featuredImage || ''}
                          onChange={(e) => {
                            setSettingsForm((prev) => {
                              const featuredGames = [...(prev.featuredGames || [])];
                              while (featuredGames.length <= slotIdx) featuredGames.push({ gameId: '' });
                              featuredGames[slotIdx] = { ...featuredGames[slotIdx], featuredImage: e.target.value };
                              return { ...prev, featuredGames };
                            });
                          }}
                          placeholder="/crown-quest.png or upload"
                          className="px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                        />
                      </div>

                      {/* Image Uploader */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                          Upload Morphing Texture
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSlotImageUpload(slotIdx, e)}
                            disabled={isUploadingSlot === slotIdx}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 disabled:cursor-not-allowed"
                          />
                          <div className="w-full px-3 py-2 bg-graphite hover:bg-graphite-light border border-graphite-light rounded-xl text-xs text-bright-snow font-semibold text-center transition-all flex items-center justify-center gap-2">
                            <Upload size={14} />
                            {isUploadingSlot === slotIdx ? 'UPLOADING...' : 'CHOOSE IMAGE FILE'}
                          </div>
                        </div>
                      </div>

                      {/* Image Preview */}
                      {slot.featuredImage && (
                        <div className="mt-2 border border-graphite-light rounded-lg overflow-hidden h-28 bg-carbon-black-2 flex items-center justify-center relative group">
                          <img
                            src={slot.featuredImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-graphite-light flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="bg-slate-violet hover:bg-slate-violet-light text-bright-snow font-semibold px-6 py-3 rounded-xl transition-all text-xs cursor-pointer disabled:opacity-50 font-silkscreen uppercase tracking-wider"
                >
                  {isSavingSettings ? 'SAVING SHOWCASE...' : 'SAVE SHOWCASE CONFIG'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Careers List */}
        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-6">
            {/* Desktop Table view (Visible on md and up) */}
            <div className="hidden md:block bg-carbon-black-2 border border-graphite-light rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-graphite-light bg-carbon-black/40 text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      <th className="p-6">Job Title</th>
                      <th className="p-6">Location</th>
                      <th className="p-6">Requirements / Responsibilities</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-graphite-light text-sm">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-graphite/10 transition-colors">
                        <td className="p-6">
                          <div className="font-semibold text-bright-snow tracking-wide text-base">{job.title}</div>
                        </td>
                        <td className="p-6">
                          <span className="text-xs text-alabaster-grey">{job.location}</span>
                        </td>
                        <td className="p-6 text-xs text-alabaster-grey/60">
                          {job.requirements?.length || 0} reqs / {job.responsibilities?.length || 0} resps
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenJobForm(job)}
                              className="p-2 bg-graphite hover:bg-graphite-light border border-graphite-light text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 bg-graphite hover:bg-rose-950/20 border border-graphite-light hover:border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-xl transition-all cursor-pointer"
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

            {/* Mobile Card List for Careers (Visible on mobile only) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {jobs.map((job) => (
                <div key={job.id} className="bg-carbon-black-2 border border-graphite-light p-4 rounded-xl flex flex-col gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-bright-snow truncate text-base">
                      {job.title}
                    </div>
                    <div className="text-xs text-slate-violet-light mt-1">
                      {job.location}
                    </div>
                    <div className="text-xs text-alabaster-grey/60 mt-2">
                      {job.requirements?.length || 0} requirements / {job.responsibilities?.length || 0} responsibilities
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end border-t border-graphite-light/40 pt-3 gap-2">
                    <button 
                      onClick={() => handleOpenJobForm(job)} 
                      className="p-2 bg-graphite hover:bg-graphite-light border border-graphite-light rounded-xl text-bright-snow"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)} 
                      className="p-2 bg-graphite hover:bg-rose-950/20 border border-graphite-light hover:border-rose-500/30 rounded-xl text-rose-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-carbon-black-2 border border-graphite-light p-6 rounded-2xl max-w-lg">
            <h3 className="text-base font-semibold text-bright-snow mb-4">Contact Form Configuration</h3>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">Destination Email</label>
              <input 
                type="email" 
                value={settingsForm.contactEmail} 
                onChange={(e) => setSettingsForm({ contactEmail: e.target.value })}
                className="px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                placeholder="info@dasigames.com"
              />
            </div>
            <button 
              onClick={handleSaveSettings} 
              disabled={isSavingSettings}
              className="bg-slate-violet hover:bg-slate-violet-light text-bright-snow font-semibold px-5 py-2.5 rounded-xl transition-all text-xs cursor-pointer disabled:opacity-50"
            >
              {isSavingSettings ? 'SAVING...' : 'SAVE SETTINGS'}
            </button>
          </div>
        )}
      </main>

      {/* Game Modal Dialog Form */}
      {isGameFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsGameFormOpen(false)}
              className="absolute top-4 right-4 text-alabaster-grey/60 hover:text-bright-snow transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleGameSubmit} className="p-4 sm:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-bright-snow tracking-wide uppercase">
                  {editingGame ? 'Edit Game Listing' : 'Add New Game'}
                </h3>
                <p className="text-xs text-alabaster-grey/60 mt-1 uppercase tracking-wider">
                  Fill in game information and platforms
                </p>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                    Game Title
                  </label>
                  <input
                    type="text"
                    required
                    value={gameFormData.title}
                    onChange={(e) => setGameFormData({ ...gameFormData, title: e.target.value })}
                    placeholder="My Epic RPG"
                    className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                    Game Slug (ID / Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={gameFormData.id}
                    disabled={!!editingGame}
                    onChange={(e) => setGameFormData({ ...gameFormData, id: e.target.value })}
                    placeholder="my-epic-rpg"
                    className="w-full px-4 py-2.5 bg-carbon-black/40 border border-graphite-light rounded-xl text-sm text-alabaster-grey/60 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={gameFormData.description}
                  onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                  placeholder="Summarize the gameplay and primary features..."
                  className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light resize-none"
                />
              </div>

              {/* Assets Link: Icon & Video */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Icon URL and Uploader */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Icon URL
                    </label>
                    <input
                      type="text"
                      required
                      value={gameFormData.iconSrc}
                      onChange={(e) => setGameFormData({ ...gameFormData, iconSrc: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Upload Icon / Thumbnail
                    </label>
                    <label className="relative cursor-pointer px-4 py-2.5 bg-graphite hover:bg-graphite-light border border-graphite-light rounded-xl text-xs font-bold text-bright-snow transition-all duration-200 flex items-center justify-center h-[42px] select-none text-center">
                      {isUploadingIcon ? 'Uploading Icon...' : 'Choose Icon File'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={isUploadingIcon}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Video URL and Uploader */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Hover Gameplay Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={gameFormData.videoSrc}
                      onChange={(e) => setGameFormData({ ...gameFormData, videoSrc: e.target.value })}
                      placeholder="https://...mp4 or upload file"
                      className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Upload Gameplay Video
                    </label>
                    <label className="relative cursor-pointer px-4 py-2.5 bg-graphite hover:bg-graphite-light border border-graphite-light rounded-xl text-xs font-bold text-bright-snow transition-all duration-200 flex items-center justify-center h-[42px] select-none text-center">
                      {isUploadingVideo ? 'Uploading Video...' : 'Choose Video File'}
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleVideoUpload}
                        disabled={isUploadingVideo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {uploadError && (
                <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                  <AlertCircle size={10} />
                  <span>{uploadError}</span>
                </p>
              )}

              {/* Supported Platforms Checkboxes */}
              <div className="flex flex-wrap gap-6 border-y border-graphite-light py-4 my-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gameFormData.isAndroid}
                    onChange={(e) => setGameFormData({ ...gameFormData, isAndroid: e.target.checked })}
                    className="rounded bg-carbon-black border-graphite-light text-slate-violet focus:ring-0"
                  />
                  <span className="text-xs font-bold text-bright-snow tracking-wide uppercase">Google Play / Android</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gameFormData.isIOS}
                    onChange={(e) => setGameFormData({ ...gameFormData, isIOS: e.target.checked })}
                    className="rounded bg-carbon-black border-graphite-light text-slate-violet focus:ring-0"
                  />
                  <span className="text-xs font-bold text-bright-snow tracking-wide uppercase">App Store / iOS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gameFormData.isPoki}
                    onChange={(e) => setGameFormData({ ...gameFormData, isPoki: e.target.checked })}
                    className="rounded bg-carbon-black border-graphite-light text-slate-violet focus:ring-0"
                  />
                  <span className="text-xs font-bold text-bright-snow tracking-wide uppercase">Poki Web Arcade</span>
                </label>
              </div>

              {/* Game Analytics & Stats (Always Editable) */}
              <div className="bg-carbon-black border border-graphite-light p-4 rounded-xl flex flex-col gap-4">
                <h4 className="text-xs font-bold text-bright-snow tracking-wider uppercase border-b border-graphite-light/40 pb-2">
                  Game Analytics & Stats (For Showcase)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Game Engine
                    </label>
                    <input
                      type="text"
                      value={gameFormData.engine || ''}
                      onChange={(e) => setGameFormData({ ...gameFormData, engine: e.target.value })}
                      placeholder="Unity 3D"
                      className="w-full px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Downloads
                    </label>
                    <input
                      type="text"
                      value={gameFormData.downloads || ''}
                      onChange={(e) => setGameFormData({ ...gameFormData, downloads: e.target.value })}
                      placeholder="5M+"
                      className="w-full px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Active Players
                    </label>
                    <input
                      type="text"
                      value={gameFormData.activePlayers || ''}
                      onChange={(e) => setGameFormData({ ...gameFormData, activePlayers: e.target.value })}
                      placeholder="1.2M+"
                      className="w-full px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Rating
                    </label>
                    <input
                      type="text"
                      value={gameFormData.rating || ''}
                      onChange={(e) => setGameFormData({ ...gameFormData, rating: e.target.value })}
                      placeholder="4.8"
                      className="w-full px-3 py-2 bg-carbon-black-2 border border-graphite-light rounded-xl text-sm text-bright-snow focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                </div>
              </div>

              {/* Store Links */}
              <div className="flex flex-col gap-4">
                {gameFormData.isAndroid && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Google Play Store Link
                    </label>
                    <input
                      type="text"
                      value={gameFormData.playstoreLink}
                      onChange={(e) => setGameFormData({ ...gameFormData, playstoreLink: e.target.value })}
                      placeholder="https://play.google.com/..."
                      className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                )}
                {gameFormData.isIOS && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      iOS App Store Link
                    </label>
                    <input
                      type="text"
                      value={gameFormData.appstoreLink}
                      onChange={(e) => setGameFormData({ ...gameFormData, appstoreLink: e.target.value })}
                      placeholder="https://apps.apple.com/..."
                      className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                )}
                {gameFormData.isPoki && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                      Poki Play Link
                    </label>
                    <input
                      type="text"
                      value={gameFormData.pokiLink}
                      onChange={(e) => setGameFormData({ ...gameFormData, pokiLink: e.target.value })}
                      placeholder="https://poki.com/..."
                      className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                    />
                  </div>
                )}
              </div>

              {/* Submit panel */}
              <button
                type="submit"
                className="w-full py-3 bg-slate-violet hover:bg-slate-violet-light text-bright-snow font-semibold rounded-xl transition-all text-sm mt-4 cursor-pointer uppercase font-silkscreen tracking-wider"
              >
                SAVE GAME ENTRY
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Job Modal Dialog Form */}
      {isJobFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsJobFormOpen(false)}
              className="absolute top-4 right-4 text-alabaster-grey/60 hover:text-bright-snow transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleJobSubmit} className="p-4 sm:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-bright-snow tracking-wide uppercase">
                  {editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
                </h3>
                <p className="text-xs text-alabaster-grey/60 mt-1 uppercase tracking-wider">
                  Fill in recruitment details and parameters
                </p>
              </div>

              {/* Job Title & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    placeholder="Unity developer"
                    className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    placeholder="Tbilisi, Georgia (On-site)"
                    className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  placeholder="Describe the scope of the role..."
                  className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light resize-none"
                />
              </div>

              {/* Requirements (One per line) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={4}
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  placeholder="- 2+ years C# experience&#10;- Good communication skills"
                  className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light resize-none"
                />
              </div>

              {/* Responsibilities (One per line) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-alabaster-grey/60 uppercase">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  value={jobFormData.responsibilities}
                  onChange={(e) => setJobFormData({ ...jobFormData, responsibilities: e.target.value })}
                  placeholder="- Write clean C# code&#10;- Optimize mobile graphics"
                  className="w-full px-4 py-2.5 bg-carbon-black border border-graphite-light rounded-xl text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-slate-violet-light resize-none"
                />
              </div>

              {/* Submit panel */}
              <button
                type="submit"
                className="w-full py-3 bg-slate-violet hover:bg-slate-violet-light text-bright-snow font-semibold rounded-xl transition-all text-sm mt-4 cursor-pointer uppercase"
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
