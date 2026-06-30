'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Play, ArrowRight, Trophy } from 'lucide-react';
import { Game } from '@/utils/db';

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

const defaultMockGames = [
  {
    id: 'crown-quest',
    title: 'Crown Quest',
    subtitle: 'Epic Action RPG Adventure',
    description: 'Embark on an epic fantasy RPG quest. Command legendary heroes, conquer tactical grid battles, and construct your royal stronghold in a war-torn kingdom.',
    accent: 'var(--color-platinum-silver)',
    accentMuted: 'var(--color-slate-violet)',
    themeColor: 'rgba(226, 232, 240, 0.7)',
    bgGradient: 'from-graphite/30 via-carbon-black-2/40 to-[#181818]',
    image: '/crown-quest.png',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.arpg.crownquest',
    appstoreLink: 'https://apps.apple.com/us/app/crown-quest-action-rpg/id6477858164',
    stats: {
      activePlayers: '1.2M+',
      rating: '4.8',
      downloads: '5M+',
      engine: 'Unity 3D'
    }
  },
  {
    id: 'lumber-chopper',
    title: 'Lumber Chopper',
    subtitle: 'Idle Wood Empire Tycoon',
    description: 'Harvest resources, optimize lumber mills, and build a massive wood-chopping dynasty. Automate operations and manage supply chains in this highly addictive idle tycoon.',
    accent: 'var(--color-muted-green)',
    accentMuted: 'var(--color-slate-violet)',
    themeColor: 'rgba(82, 122, 105, 0.7)',
    bgGradient: 'from-muted-green/20 via-carbon-black-2/40 to-[#181818]',
    image: '/lumber-chopper.png',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.prs2.lumberchopper',
    appstoreLink: 'https://apps.apple.com/us/app/lumber-chopper-harvest-empire/id6738272884',
    stats: {
      activePlayers: '850K+',
      rating: '4.6',
      downloads: '3M+',
      engine: 'Cocos Creator'
    }
  },
  {
    id: 'hotel-manager',
    title: 'Hotel Manager',
    subtitle: '5-Star Luxury Resort Simulator',
    description: 'Design, build, and run a 5-star luxury resort empire. Hire world-class chefs, staff, and design stunning suites to keep VIP clients happy and maximize profits.',
    accent: 'var(--color-slate-violet-light)',
    accentMuted: 'var(--color-slate-violet)',
    themeColor: 'rgba(146, 146, 166, 0.7)',
    bgGradient: 'from-slate-violet/20 via-carbon-black-2/40 to-[#181818]',
    image: '/hotel-manager.png',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.prs3.hotelmanager',
    appstoreLink: 'https://apps.apple.com/us/app/hotel-manager-resort-empire/id6748454899',
    stats: {
      activePlayers: '500K+',
      rating: '4.5',
      downloads: '1.5M+',
      engine: 'Unity 2D'
    }
  }
];

export default function WebGLFeaturedSlider({ initialGames }: { initialGames?: Game[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const transitionRef = useRef({ active: false });

  // Filter for featured games from props, falling back to mock data if empty
  const featuredGamesFromProps = initialGames?.filter(g => g.isFeatured) || [];
  const gamesData = featuredGamesFromProps.length > 0 
    ? featuredGamesFromProps.map(g => ({
        id: g.id,
        title: g.title,
        subtitle: g.featuredSubtitle || g.title,
        description: g.description,
        accent: g.id === 'lumber-chopper' ? 'var(--color-muted-green)' : (g.id === 'hotel-manager' ? 'var(--color-slate-violet-light)' : 'var(--color-platinum-silver)'),
        accentMuted: 'var(--color-slate-violet)',
        themeColor: g.id === 'lumber-chopper' ? 'rgba(82, 122, 105, 0.7)' : (g.id === 'hotel-manager' ? 'rgba(146, 146, 166, 0.7)' : 'rgba(226, 232, 240, 0.7)'),
        bgGradient: g.id === 'lumber-chopper' ? 'from-muted-green/20 via-carbon-black-2/40 to-[#181818]' : (g.id === 'hotel-manager' ? 'from-slate-violet/20 via-carbon-black-2/40 to-[#181818]' : 'from-graphite/30 via-carbon-black-2/40 to-[#181818]'),
        image: g.featuredImage || g.iconSrc || '/crown-quest.png',
        playstoreLink: g.playstoreLink,
        appstoreLink: g.appstoreLink,
        stats: {
          activePlayers: g.activePlayers || '100K+',
          rating: g.rating || '4.5',
          downloads: g.downloads || '1M+',
          engine: g.engine || 'Unity'
        }
      }))
    : defaultMockGames;

  // WebGL Context References
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const uProgressLocRef = useRef<WebGLUniformLocation | null>(null);
  const uCanvasSizeLocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture1LocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture2LocRef = useRef<WebGLUniformLocation | null>(null);

  // Fallback CSS fade system state
  const [prevIndex, setPrevIndex] = useState(0);
  const [fadeProgress, setFadeProgress] = useState(0);

  // Setup WebGL engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.warn("WebGL not supported in this browser, using CSS displacement fallback.");
      setWebglSupported(false);
      setLoading(false);
      return;
    }
    glRef.current = gl;

    // Shader Source Code
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y; // Flip coordinates
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture1;
      uniform sampler2D u_texture2;
      uniform float u_progress;
      uniform vec2 u_canvasSize;

      // Cover scaling helper
      vec2 getCoverUV(vec2 uv, vec2 canvasSize, vec2 imgSize) {
        float cRatio = canvasSize.x / canvasSize.y;
        float iRatio = imgSize.x / imgSize.y;
        vec2 scale = vec2(1.0);
        if (cRatio > iRatio) {
          scale.y = iRatio / cRatio;
        } else {
          scale.x = cRatio / iRatio;
        }
        return (uv - 0.5) * scale + 0.5;
      }

      // Procedural noise for displacement map
      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.71, 31.17))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        vec2 u = fp * fp * (3.0 - 2.0 * fp);
        return mix(
          mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
          mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = v_texCoord;
        vec2 canvasRatio = u_canvasSize;
        vec2 imageRatio = vec2(1920.0, 1080.0); // Widescreen baseline
        
        vec2 uv1 = getCoverUV(uv, canvasRatio, imageRatio);
        vec2 uv2 = getCoverUV(uv, canvasRatio, imageRatio);

        // Dynamic wave liquid morph factor
        float waveNoise = noise(uv * 12.0 + vec2(u_progress * 2.0, u_progress * 1.5)) * 0.1;
        
        // Displace lookups in opposite vectors based on transition step
        vec2 dist1 = uv1 + vec2(waveNoise * u_progress, waveNoise * u_progress);
        vec2 dist2 = uv2 - vec2(waveNoise * (1.0 - u_progress), waveNoise * (1.0 - u_progress));

        vec4 col1 = texture2D(u_texture1, dist1);
        vec4 col2 = texture2D(u_texture2, dist2);

        gl_FragColor = mix(col1, col2, u_progress);
      }
    `;

    // Compile Vertex Shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vs));
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    // Compile Fragment Shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fs));
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    // Create & link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setWebglSupported(false);
      setLoading(false);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Geometry vertices (Quad covering screen)
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform locations
    uProgressLocRef.current = gl.getUniformLocation(program, 'u_progress');
    uCanvasSizeLocRef.current = gl.getUniformLocation(program, 'u_canvasSize');
    uTexture1LocRef.current = gl.getUniformLocation(program, 'u_texture1');
    uTexture2LocRef.current = gl.getUniformLocation(program, 'u_texture2');

    // Load textures
    const imageUrls = gamesData.map(g => g.image);
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleLoadedImages = (imgs: HTMLImageElement[]) => {
      texturesRef.current = imgs.map((img) => {
        const tex = gl.createTexture();
        if (!tex) throw new Error("Failed texture allocation");
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        return tex;
      });

      setLoading(false);
      drawWebGL(0, 0, 0);
    };

    imageUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedImages[i] = img;
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          handleLoadedImages(loadedImages);
        }
      };
      img.onerror = () => {
        // Fallback procedural canvas
        const canvasFallback = document.createElement('canvas');
        canvasFallback.width = 512;
        canvasFallback.height = 512;
        const fallbackCtx = canvasFallback.getContext('2d');
        if (fallbackCtx) {
          const g = fallbackCtx.createLinearGradient(0, 0, 512, 512);
          if (i === 0) { g.addColorStop(0, '#f1c40f'); g.addColorStop(1, '#e05a36'); }
          else if (i === 1) { g.addColorStop(0, '#2ecc71'); g.addColorStop(1, '#27ae60'); }
          else { g.addColorStop(0, '#3498db'); g.addColorStop(1, '#9b59b6'); }
          fallbackCtx.fillStyle = g;
          fallbackCtx.fillRect(0, 0, 512, 512);
        }
        const fallbackImg = new Image();
        fallbackImg.src = canvasFallback.toDataURL();
        fallbackImg.onload = () => {
          loadedImages[i] = fallbackImg;
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            handleLoadedImages(loadedImages);
          }
        };
      };
    });

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      drawWebGL(activeIndex, activeIndex, 0);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeIndex]);

  // WebGL Render call
  const drawWebGL = (currIdx: number, targetIdx: number, progress: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const textures = texturesRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || textures.length === 0 || !canvas) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[currIdx]);
    if (uTexture1LocRef.current) gl.uniform1i(uTexture1LocRef.current, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[targetIdx]);
    if (uTexture2LocRef.current) gl.uniform1i(uTexture2LocRef.current, 1);

    if (uProgressLocRef.current) gl.uniform1f(uProgressLocRef.current, progress);
    if (uCanvasSizeLocRef.current) gl.uniform2f(uCanvasSizeLocRef.current, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const transitionTo = (targetIdx: number) => {
    if (targetIdx === activeIndex || transitionRef.current.active) return;
    transitionRef.current.active = true;

    setPrevIndex(activeIndex);
    setActiveIndex(targetIdx);

    const animationObj = { progress: 0 };

    gsap.to(animationObj, {
      progress: 1,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        setFadeProgress(animationObj.progress);
        if (webglSupported) {
          drawWebGL(activeIndex, targetIdx, animationObj.progress);
        }
      },
      onComplete: () => {
        transitionRef.current.active = false;
        setPrevIndex(targetIdx);
        setFadeProgress(0);
        if (webglSupported) {
          drawWebGL(targetIdx, targetIdx, 0);
        }
      }
    });

    const container = sliderRef.current;
    if (container) {
      gsap.fromTo(
        container.querySelectorAll('.slider-hud-element'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: 0.2 }
      );
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (customCursorRef.current) {
      customCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  };

  const activeGame = gamesData[activeIndex];

  return (
    <section id="featured" className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
      {/* Section Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase flex items-center gap-1.5">
            <Trophy size={12} className="text-platinum-silver animate-pulse" />
            Spotlight Showcase
          </span>
          <h2 className="text-2xl md:text-4xl font-normal tracking-wide text-bright-snow uppercase mt-2 font-russo-one retro-heading-shadow">
            Featured Releases
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 font-silkscreen text-[9px] text-alabaster-grey/60 border border-graphite-light bg-carbon-black-2 px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-muted-green rounded-full animate-ping" />
          SERVER STATUS: ONLINE
        </div>
      </div>

      {/* Slider Frame */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorHovered(true)}
        onMouseLeave={() => setCursorHovered(false)}
        className="relative w-full h-[500px] md:h-[600px] bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden flex flex-col justify-end p-8 md:p-12 cursor-none select-none slider-glow"
      >
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-[#181818] z-50 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-graphite-light border-t-platinum-silver animate-spin" />
            <span className="text-[9px] font-sans tracking-wider text-alabaster-grey">BUFFERING MEMORY MAP...</span>
          </div>
        )}

        {/* WebGL Canvas */}
        {webglSupported ? (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={gamesData[prevIndex].image} 
              alt={gamesData[prevIndex].title}
              className="absolute inset-0 w-full h-full object-cover" 
              style={{ 
                opacity: 1 - fadeProgress, 
                filter: `blur(${fadeProgress * 10}px)`
              }} 
            />
            <img 
              src={gamesData[activeIndex].image} 
              alt={gamesData[activeIndex].title}
              className="absolute inset-0 w-full h-full object-cover" 
              style={{ 
                opacity: fadeProgress, 
                filter: `blur(${(1 - fadeProgress) * 10}px)`
              }} 
            />
          </div>
        )}

        {/* Dark Overlay vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/45 to-carbon-black/50 z-10 pointer-events-none" />

        {/* Custom Retro Magnetic Wireframe Crosshair Cursor Overlay */}
        <div 
          ref={customCursorRef}
          className="absolute pointer-events-none z-40 hidden md:flex items-center justify-center"
          style={{ 
            top: 0,
            left: 0,
            opacity: cursorHovered ? 1 : 0,
            transform: `translate3d(0px, 0px, 0) translate(-50%, -50%)`,
            scale: cursorHovered ? '1' : '0.2',
            transition: 'opacity 0.2s ease, scale 0.2s ease'
          }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Outer dotted spinning wireframe ring */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite]"
              style={{ 
                borderColor: 'var(--color-slate-violet-light)', 
                boxShadow: `0 0 12px var(--color-slate-violet)44` 
              }}
            />
            {/* Inner solid ring */}
            <div 
              className="absolute w-8 h-8 rounded-full border border-double"
              style={{ borderColor: 'var(--color-platinum-silver)' }}
            />
            {/* Crosshair target lines */}
            <div className="absolute w-5 h-[1px] bg-slate-violet-light" />
            <div className="absolute h-5 w-[1px] bg-slate-violet-light" />
            {/* HUD Target readout text */}
            <span 
              className="absolute top-10 font-sans text-[7px] bg-carbon-black/90 px-1.5 py-0.5 border border-graphite-light rounded text-bright-snow tracking-widest whitespace-nowrap"
            >
              LOCK: {activeGame.title.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Foreground Content HUD */}
        <div className="relative z-20 max-w-lg pointer-events-none">
          <span className="slider-hud-element text-[9px] font-sans text-platinum-silver tracking-widest uppercase inline-flex items-center gap-1.5 mb-3.5 px-2 py-0.5 bg-graphite/50 border border-graphite-light/40 rounded-md">
            <span className="w-1 h-1 bg-platinum-silver rounded-full animate-ping" />
            FEATURED TITLE
          </span>
          <h3 
            className="slider-hud-element text-4xl md:text-6xl font-normal text-bright-snow uppercase tracking-wider mb-4 leading-none font-russo-one retro-heading-shadow"
          >
            {activeGame.title}
          </h3>
          <p className="slider-hud-element text-xs md:text-sm text-alabaster-grey leading-relaxed mb-6 font-outfit font-light">
            {activeGame.description}
          </p>
          
          {/* Modern Specs HUD Panel with Real Game Stats */}
          <div className="slider-hud-element font-mono text-[9px] text-alabaster-grey/85 border border-graphite-light/60 bg-carbon-black-2/95 p-4 rounded-xl space-y-1.5 mt-4 mb-6 max-w-[280px] relative backdrop-blur-md shadow-lg">
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-platinum-silver font-bold">{activeGame.stats.engine}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Downloads:</span>
              <span className="text-platinum-silver font-bold">{activeGame.stats.downloads}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Players:</span>
              <span className="text-platinum-silver font-bold">{activeGame.stats.activePlayers}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating:</span>
              <span className="text-muted-green font-bold">{activeGame.stats.rating} ★</span>
            </div>
          </div>

          <div className="slider-hud-element pointer-events-auto flex flex-wrap items-center gap-4">
            <Link 
              href="#portfolio"
              className="inset-pixel-btn-primary group/btn inline-flex items-center py-2 px-4"
            >
              <Play size={10} className="mr-2 fill-current" /> EXPLORE GAME <ArrowRight size={10} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            
            {/* App Store and Google Play Download Links */}
            <div className="flex items-center gap-2">
              {activeGame.appstoreLink && (
                <a 
                  href={activeGame.appstoreLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-carbon-black/80 border border-graphite-light/60 hover:border-platinum-silver/80 rounded-md text-alabaster-grey hover:text-bright-snow transition-all hover:scale-105"
                  title="Download on the App Store"
                >
                  <AppStoreIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {activeGame.playstoreLink && (
                <a 
                  href={activeGame.playstoreLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-carbon-black/80 border border-graphite-light/60 hover:border-platinum-silver/80 rounded-md text-alabaster-grey hover:text-bright-snow transition-all hover:scale-105"
                  title="Get it on Google Play"
                >
                  <PlayStoreIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Dot Indicators */}
        <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
          {gamesData.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => transitionTo(idx)}
              className="group relative flex items-center justify-center w-12 h-12 rounded-full focus:outline-none cursor-pointer"
            >
              <span className="absolute right-full mr-4 bg-carbon-black border border-graphite-light px-3 py-1.5 rounded-lg text-[8px] font-sans text-alabaster-grey uppercase tracking-widest opacity-0 scale-75 origin-right transition-all group-hover:opacity-100 group-hover:scale-100 shadow-lg pointer-events-none">
                {game.title}
              </span>
              
              <span className={`text-[10px] font-sans ${
                activeIndex === idx ? 'text-bright-snow scale-125' : 'text-alabaster-grey group-hover:text-bright-snow transition-colors'
              }`}>
                0{idx + 1}
              </span>

              <span className={`absolute bottom-0 right-0 w-full h-full rounded-full border transition-all ${
                activeIndex === idx 
                  ? 'border-platinum-silver scale-110' 
                  : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95 border-graphite-light'
              }`} 
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}