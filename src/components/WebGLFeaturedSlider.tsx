'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Play, ArrowRight, Cpu } from 'lucide-react';

const gamesData = [
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

export default function WebGLFeaturedSlider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const transitionRef = useRef({ active: false });

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
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const activeGame = gamesData[activeIndex];

  return (
    <section id="featured" className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
      {/* Section Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase flex items-center gap-1.5">
            <Cpu size={12} className="text-platinum-silver animate-pulse" />
            Featured Showcases // WebGL Node
          </span>
          <h2 className="text-2xl md:text-4xl font-normal tracking-wide text-bright-snow uppercase mt-2 font-russo-one retro-heading-shadow">
            Liquid Morphing Mainframe
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 font-silkscreen text-[9px] text-alabaster-grey/60 border border-graphite-light bg-carbon-black-2 px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-muted-green rounded-full animate-ping" />
          SYSTEM_STABLE: 60FPS
        </div>
      </div>

      {/* Slider Frame */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorHovered(true)}
        onMouseLeave={() => setCursorHovered(false)}
        className="relative w-full h-[500px] md:h-[600px] bg-carbon-black border-2 border-graphite-light overflow-hidden flex flex-col justify-end p-8 md:p-12 cursor-none select-none crt-screen crt-flicker slider-glow"
      >
        {/* 8-Bit Corner Pixel Blocks */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-graphite-light z-30" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-graphite-light z-30" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-graphite-light z-30" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-graphite-light z-30" />

        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-[#181818] z-50 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-none border-2 border-graphite-light border-t-platinum-silver animate-spin" />
            <span className="text-[9px] font-silkscreen tracking-wider text-alabaster-grey">BUFFERING MEMORY MAP...</span>
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
          className="absolute pointer-events-none z-40 transition-transform duration-75 ease-out hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px`,
            opacity: cursorHovered ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${cursorHovered ? 1 : 0.2})`
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
              className="absolute top-10 font-silkscreen text-[7px] bg-carbon-black/90 px-1.5 py-0.5 border border-graphite-light text-bright-snow tracking-widest whitespace-nowrap"
            >
              LOCK: {activeGame.title.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Foreground Content HUD */}
        <div className="relative z-20 max-w-lg pointer-events-none">
          <span className="slider-hud-element text-[9px] font-silkscreen text-platinum-silver tracking-widest uppercase inline-flex items-center gap-1.5 mb-3.5 px-2 py-0.5 bg-graphite/50 border border-graphite-light">
            <span className="w-1 h-1 bg-platinum-silver rounded-full animate-ping" />
            MAINFRAME DISPLACEMENT NODE
          </span>
          <h3 
            className="slider-hud-element text-4xl md:text-6xl font-normal text-bright-snow uppercase tracking-wider mb-4 leading-none font-russo-one retro-heading-shadow"
          >
            {activeGame.title}
          </h3>
          <p className="slider-hud-element text-xs md:text-sm text-alabaster-grey leading-relaxed mb-6 font-outfit font-light">
            {activeGame.description}
          </p>
          
          {/* Retro Diagnostic HUD Panel */}
          <div className="slider-hud-element font-mono text-[8px] text-alabaster-grey/80 border border-graphite-light bg-carbon-black-2/90 p-3.5 rounded-none space-y-1.5 mt-4 mb-6 max-w-[280px] relative">
            <div className="absolute top-0 left-0 w-1 h-1 bg-slate-violet" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-slate-violet" />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-slate-violet" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-slate-violet" />
            <div className="flex justify-between">
              <span>&gt; TRANSITION:</span>
              <span className="text-platinum-silver font-bold">COSINE_WAVE_GLSL</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; PIXEL_SAMPLING:</span>
              <span className="text-platinum-silver font-bold">BILINEAR_MAPPED</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; RENDER_STATUS:</span>
              <span className="text-muted-green font-bold animate-pulse">LOCK_OK_60FPS</span>
            </div>
          </div>

          <div className="slider-hud-element pointer-events-auto">
            <Link 
              href="#portfolio"
              className="inset-pixel-btn-primary group/btn inline-flex items-center"
            >
              <Play size={10} className="mr-2 fill-current" /> BOOT_GAME_SYS <ArrowRight size={10} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Navigation Dot Indicators */}
        <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
          {gamesData.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => transitionTo(idx)}
              className="group relative flex items-center justify-end w-12 h-12 rounded-none focus:outline-none cursor-pointer"
            >
              <span className="absolute right-full mr-4 bg-carbon-black border border-graphite-light px-3 py-1.5 rounded-none text-[8px] font-silkscreen text-alabaster-grey uppercase tracking-widest opacity-0 scale-75 origin-right transition-all group-hover:opacity-100 group-hover:scale-100 shadow-lg pointer-events-none">
                {game.title}
              </span>
              
              <span className={`text-[10px] font-silkscreen ${
                activeIndex === idx ? 'text-bright-snow scale-125' : 'text-alabaster-grey group-hover:text-bright-snow transition-colors'
              }`}>
                0{idx + 1}
              </span>

              <span className={`absolute bottom-0 right-0 w-full h-full rounded-none border transition-all ${
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