'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Play, ArrowRight, Trophy, Volume2, VolumeX, X, Cpu } from 'lucide-react';
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

const getVideoFallback = (id: string) => {
  switch (id) {
    case 'crown-quest':
      return 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-playing-a-video-game-41584-large.mp4';
    case 'lumber-chopper':
      return '/videos/lumber-chopper.mp4';
    case 'hotel-manager':
      return 'https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-hotel-swimming-pool-and-palm-trees-48744-large.mp4';
    default:
      return '';
  }
};

interface WebGLFeaturedSliderProps {
  featuredGames: (Game & {
    featuredSubtitle?: string;
    featuredImage?: string;
  })[];
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  intensity: number;
  speed: number;
}

export default function WebGLFeaturedSlider({ featuredGames }: WebGLFeaturedSliderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const transitionRef = useRef({ active: false });

  // Gameplay Preview Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // EMP Shockwave Ripple states
  const ripplesRef = useRef<Ripple[]>([]);
  const [rippleTrigger, setRippleTrigger] = useState(0);

  const gamesData = featuredGames.length > 0 
    ? featuredGames.map(g => ({
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
        videoSrc: g.videoSrc || getVideoFallback(g.id),
        stats: {
          activePlayers: g.activePlayers || '100K+',
          rating: g.rating || '4.5',
          downloads: g.downloads || '1M+',
          engine: g.engine || 'Unity'
        }
      }))
    : defaultMockGames.map(g => ({
        ...g,
        playstoreLink: g.playstoreLink || '',
        appstoreLink: g.appstoreLink || '',
        pokiLink: '',
        iconSrc: g.image,
        iconAlt: g.title,
        isAndroid: true,
        isIOS: true,
        isPoki: false,
        videoSrc: getVideoFallback(g.id),
        isFeatured: true
      }));

  // WebGL Context References
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const uProgressLocRef = useRef<WebGLUniformLocation | null>(null);
  const uCanvasSizeLocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture1LocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture2LocRef = useRef<WebGLUniformLocation | null>(null);
  const uRipplesLocRef = useRef<WebGLUniformLocation | null>(null);

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

      #define MAX_RIPPLES 8
      uniform vec4 u_ripples[MAX_RIPPLES]; // x, y, radius, intensity

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
        vec2 aspect = vec2(u_canvasSize.x / u_canvasSize.y, 1.0);

        // Accumulate EMP ripples
        vec2 rippleDistortion = vec2(0.0);
        for (int i = 0; i < MAX_RIPPLES; i++) {
          vec4 ripple = u_ripples[i];
          if (ripple.z > 0.0) {
            vec2 center = ripple.xy;
            float radius = ripple.z;
            float intensity = ripple.w;

            vec2 diff = (uv - center) * aspect;
            float dist = length(diff);

            float ringWidth = 0.06;
            if (dist > radius - ringWidth && dist < radius + ringWidth) {
              float peak = abs(dist - radius);
              float norm = peak / ringWidth;
              float force = cos(norm * 3.14159) * 0.5 + 0.5;

              // Refract outward
              vec2 displace = normalize(diff);
              rippleDistortion += displace * sin((dist - radius) * 45.0) * 0.035 * force * intensity;
            }
          }
        }

        vec2 finalUV = uv + rippleDistortion;
        vec2 imageRatio = vec2(1920.0, 1080.0); // Widescreen baseline
        
        vec2 uv1 = getCoverUV(finalUV, u_canvasSize, imageRatio);
        vec2 uv2 = getCoverUV(finalUV, u_canvasSize, imageRatio);

        // Dynamic wave liquid morph factor
        float waveNoise = noise(finalUV * 12.0 + vec2(u_progress * 2.0, u_progress * 1.5)) * 0.1;
        
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
    uRipplesLocRef.current = gl.getUniformLocation(program, 'u_ripples');

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

    // Format ripples flat array (8 items * 4 properties: x, y, radius, intensity)
    const rippleArray = new Float32Array(8 * 4);
    for (let i = 0; i < 8; i++) {
      if (i < ripplesRef.current.length) {
        const r = ripplesRef.current[i];
        rippleArray[i * 4] = r.x;
        rippleArray[i * 4 + 1] = r.y;
        rippleArray[i * 4 + 2] = r.radius;
        rippleArray[i * 4 + 3] = r.intensity;
      } else {
        rippleArray[i * 4] = 0.0;
        rippleArray[i * 4 + 1] = 0.0;
        rippleArray[i * 4 + 2] = 0.0;
        rippleArray[i * 4 + 3] = 0.0;
      }
    }
    if (uRipplesLocRef.current) {
      gl.uniform4fv(uRipplesLocRef.current, rippleArray);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const transitionTo = (targetIdx: number) => {
    if (targetIdx === activeIndex || transitionRef.current.active) return;
    transitionRef.current.active = true;

    setPrevIndex(activeIndex);
    setActiveIndex(targetIdx);
    setIsModalOpen(false);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxScale = isMobile ? 30 : 75;
    const scaleUpDuration = isMobile ? 0.45 : 0.35;
    const scaleDownDuration = isMobile ? 0.9 : 0.8;

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

      // Trigger Option C SVG Refractive Warp on active title/description text elements during transition
      const disp = document.getElementById('emp-displacement-map-slider');
      const turb = document.getElementById('emp-turbulence-slider');
      const textContainers = container.querySelectorAll('.emp-text-container');

      if (disp && turb && textContainers.length > 0) {
        gsap.killTweensOf(disp);
        gsap.killTweensOf(turb);

        textContainers.forEach(el => {
          el.classList.add('emp-warp-active');
        });

        const animationObj = { progress: 0 };
        const duration = isMobile ? 1.5 : 1.3;

        gsap.fromTo(animationObj,
          { progress: 0 },
          {
            progress: 1,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
              const p = animationObj.progress;
              // Mathematically smooth bell curve peaking at 0.5 progress and returning to 0 at 1
              const currentScale = Math.sin(p * Math.PI) * maxScale;
              const currentFreq = 0.08 + Math.sin(p * Math.PI) * 0.17;
              
              if (disp) disp.setAttribute('scale', currentScale.toFixed(2));
              if (turb) turb.setAttribute('baseFrequency', `0.01 ${currentFreq.toFixed(3)}`);
            },
            onComplete: () => {
              textContainers.forEach(el => {
                el.classList.remove('emp-warp-active');
              });
              if (disp) disp.setAttribute('scale', '0');
              if (turb) turb.setAttribute('baseFrequency', '0.01 0.08');
            }
          }
        );
      }
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

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only fire if modal is closed
    if (isModalOpen) return;

    // Ignore clicks on buttons/links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Normalize coordinates (U/V map from 0.0 to 1.0)
    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    // Trigger tech EMP shockwave ripple
    const newRipple: Ripple = {
      x: normX,
      y: normY,
      radius: 0.0,
      maxRadius: 0.55 + Math.random() * 0.15,
      intensity: 1.0,
      speed: 0.38
    };

    ripplesRef.current.push(newRipple);
    if (ripplesRef.current.length > 8) {
      ripplesRef.current.shift();
    }

    // Trigger kinetic screen shake on shader canvas
    const canvas = canvasRef.current;
    if (canvas) {
      gsap.fromTo(canvas,
        { x: () => (Math.random() - 0.5) * 8, y: () => (Math.random() - 0.5) * 8 },
        { x: 0, y: 0, duration: 0.12, ease: 'rough', clearProps: 'x,y' }
      );
    }

    // Trigger kinetic characters push offset, synchronized with ripple speed
    triggerTextEMP(clickX, clickY, rect);

    setRippleTrigger(prev => prev + 1);
  };

  const triggerTextEMP = (clickX: number, clickY: number, containerRect: DOMRect) => {
    const container = sliderRef.current;
    if (!container) return;

    const charEls = container.querySelectorAll('.emp-char') as NodeListOf<HTMLElement>;
    const rippleSpeed = 0.38 * containerRect.height; // Ripple speed matching shader (0.38 heights/sec)

    charEls.forEach((charEl) => {
      const rect = charEl.getBoundingClientRect();
      const charX = rect.left + rect.width / 2 - containerRect.left;
      const charY = rect.top + rect.height / 2 - containerRect.top;

      const dx = charX - clickX;
      const dy = charY - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Delay matches when the WebGL ripple wavefront reaches the letter
      const delay = dist / rippleSpeed;

      const len = dist || 1;
      const nx = dx / len;
      const ny = dy / len;

      const maxPush = 28;
      const force = Math.max(0, 1 - dist / 550);
      const tx = nx * maxPush * force;
      const ty = ny * maxPush * force;
      const skewVal = nx * 15 * force;

      gsap.killTweensOf(charEl);
      gsap.fromTo(charEl,
        { x: 0, y: 0, skewX: 0, scale: 1 },
        {
          x: tx,
          y: ty,
          skewX: skewVal,
          scale: 1.1,
          duration: 0.15,
          delay: delay,
          ease: 'power1.out',
          onComplete: () => {
            gsap.to(charEl, {
              x: 0,
              y: 0,
              skewX: 0,
              scale: 1,
              duration: 0.45,
              ease: 'back.out(1.5)'
            });
          }
        }
      );
    });
  };

  // Ripples Animation Ticking Effect
  useEffect(() => {
    if (ripplesRef.current.length === 0) return;

    let animationId: number;
    const runFrame = () => {
      const activeRipples = ripplesRef.current;
      for (let i = 0; i < activeRipples.length; i++) {
        const ripple = activeRipples[i];
        ripple.radius += ripple.speed * 0.016; // approx 60fps
        ripple.intensity = Math.max(0, 1.0 - (ripple.radius / ripple.maxRadius));
      }
      ripplesRef.current = activeRipples.filter(r => r.radius < r.maxRadius && r.intensity > 0);

      // Redraw WebGL frame
      const progress = transitionRef.current.active ? fadeProgress : 0;
      const prevIdx = transitionRef.current.active ? prevIndex : activeIndex;
      if (webglSupported) {
        drawWebGL(prevIdx, activeIndex, progress);
      }

      if (ripplesRef.current.length > 0) {
        animationId = requestAnimationFrame(runFrame);
      } else {
        // Redraw final frame to clear ripples
        if (webglSupported) {
          drawWebGL(activeIndex, activeIndex, 0);
        }
      }
    };

    animationId = requestAnimationFrame(runFrame);
    return () => cancelAnimationFrame(animationId);
  }, [rippleTrigger, activeIndex, prevIndex, fadeProgress, webglSupported]);

  // Keyboard and Focus Management for Modal
  useEffect(() => {
    if (isModalOpen) {
      closeBtnRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  // Video Autoplay Trigger for Modal
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      setIsModalPlaying(true);
      modalVideoRef.current.play().catch(e => {
        console.log("Autoplay blocked", e);
        setIsModalPlaying(false);
      });
    }
  }, [isModalOpen, activeIndex]);

  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play().catch(e => console.log("Play failed", e));
      } else {
        modalVideoRef.current.pause();
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
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
        <div className="hidden md:flex items-center gap-2 font-silkscreen text-[9px] text-slate-violet-light border border-slate-violet/20 bg-carbon-black-2 px-3 py-1.5 rounded-lg select-none">
          <span className="w-1.5 h-1.5 bg-muted-green rounded-full animate-ping" />
          DASI GAMES // SERVERS ONLINE
        </div>
      </div>

      {/* Slider Frame */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onClick={handleSliderClick}
        onMouseEnter={() => setCursorHovered(true)}
        onMouseLeave={() => setCursorHovered(false)}
        className={`relative w-full h-[500px] md:h-[600px] bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden flex flex-col justify-end p-8 md:p-12 select-none slider-glow ${isModalOpen ? 'cursor-default' : 'cursor-none'}`}
      >
        <style>{`
          @keyframes crt-flicker {
            0% { opacity: 0.98; }
            50% { opacity: 1; }
            100% { opacity: 0.99; }
          }
          @keyframes crt-scanlines {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes pulse-glow {
            0% { box-shadow: 0 0 5px rgba(120, 119, 198, 0.4); }
            50% { box-shadow: 0 0 15px rgba(120, 119, 198, 0.8); }
            100% { box-shadow: 0 0 5px rgba(120, 119, 198, 0.4); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-crt-flicker {
            animation: crt-flicker 0.15s infinite;
          }
          .animate-crt-scanlines {
            animation: crt-scanlines 6s linear infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 2s infinite ease-in-out;
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out forwards;
          }
          .emp-warp-active {
            filter: url(#emp-refract-slider);
          }
        `}</style>
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-[#181818] z-50 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-graphite-light border-t-platinum-silver animate-spin" />
            <span className="text-[10px] font-silkscreen tracking-widest text-slate-violet-light animate-pulse">GETTING OUR FEATURED GAMES READY FOR YOU...</span>
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

        {/* Custom Option C Minimal Tech Scope Crosshair Cursor Overlay */}
        <div 
          ref={customCursorRef}
          className="absolute pointer-events-none z-40 hidden md:flex items-center justify-center"
          style={{ 
            top: 0,
            left: 0,
            opacity: (cursorHovered && !isModalOpen) ? 1 : 0,
            transform: `translate3d(0px, 0px, 0) translate(-50%, -50%)`,
            scale: cursorHovered ? '1' : '0.2',
            transition: 'opacity 0.2s ease, scale 0.2s ease'
          }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Primary thin circular reticle with pronounced slate-violet glow */}
            <div 
              className="absolute w-10 h-10 rounded-full border border-slate-violet-light/95"
              style={{ 
                boxShadow: `0 0 10px rgba(168, 85, 247, 0.7)` 
              }}
            />
            
            {/* Precision Technical Brackets framing the scope */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-slate-violet-light/90" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-slate-violet-light/90" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-slate-violet-light/90" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-slate-violet-light/90" />

            {/* Crosshair pointer needles */}
            <div className="absolute w-[8px] h-[1.5px] bg-slate-violet-light/95 -translate-x-6" />
            <div className="absolute w-[8px] h-[1.5px] bg-slate-violet-light/95 translate-x-6" />
            <div className="absolute h-[8px] w-[1.5px] bg-slate-violet-light/95 -translate-y-6" />
            <div className="absolute h-[8px] w-[1.5px] bg-slate-violet-light/95 translate-y-6" />

            {/* Center target dot */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-bright-snow shadow-[0_0_6px_#ffffff]" />

            {/* Precision Technical Readouts */}
            <span 
              className="absolute top-11 font-mono text-[7px] bg-carbon-black/95 px-2 py-0.5 border border-slate-violet-light/30 rounded text-bright-snow tracking-widest whitespace-nowrap"
            >
              EMP // LOCK: {activeGame.title.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Foreground Content HUD */}
        <div className="relative z-20 max-w-lg pointer-events-none">
          <span className="slider-hud-element text-[9px] font-sans text-platinum-silver tracking-widest uppercase inline-flex items-center gap-1.5 mb-3.5 px-2 py-0.5 bg-graphite/50 border border-graphite-light/40 rounded-md">
            <span className="w-1 h-1 bg-platinum-silver rounded-full animate-ping" />
            FEATURED TITLE
          </span>
          <div className="emp-text-container">
            <h3 
              className="slider-hud-element text-4xl md:text-6xl font-normal text-bright-snow uppercase tracking-wider mb-4 leading-none font-russo-one retro-heading-shadow"
            >
              <EmpText text={activeGame.title} />
            </h3>
            <p className="slider-hud-element text-xs md:text-sm text-alabaster-grey leading-relaxed mb-6 font-outfit font-light">
              <EmpText text={activeGame.description} />
            </p>
          </div>
          
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
            {activeGame.videoSrc && (
              <button 
                onClick={() => {
                  setIsModalMuted(false);
                  setIsModalOpen(true);
                  setIsModalPlaying(true);
                }}
                className="inset-pixel-btn-primary group/btn inline-flex items-center py-2 px-4 cursor-pointer"
              >
                <Play size={10} className="mr-2 fill-current" /> GAMEPLAY PREVIEW <ArrowRight size={10} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
            
            {/* App Store and Google Play Download Links (Aligned directly next to single preview button) */}
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

        {/* Gameplay Preview Modal Overlay */}
        {isModalOpen && (
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn cursor-default select-none animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-label={`Gameplay Preview - ${activeGame.title}`}
          >
            {/* Modal Container with Glowing Frame and Graphite Border */}
            <div 
              className="relative w-full max-w-2xl bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(109,109,128,0.35)] z-30 flex flex-col justify-between p-5 pointer-events-auto"
              style={{ contentVisibility: 'auto' }}
            >
              {/* Top Bar inside Modal */}
              <div className="flex items-center justify-between border-b border-graphite-light/50 pb-3 mb-3">
                <span className="text-xs font-russo-one text-bright-snow tracking-wider uppercase flex items-center gap-2 select-none">
                  <Cpu size={14} className="text-slate-violet-light animate-spin" />
                  GAMEPLAY PREVIEW: {activeGame.title}
                </span>
                
                <div className="flex items-center gap-2">
                  {/* Mute/Unmute */}
                  <button
                    onClick={() => setIsModalMuted(!isModalMuted)}
                    className="p-1.5 bg-graphite hover:bg-graphite-light border border-graphite-light hover:border-slate-violet-light/50 rounded-lg text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-slate-violet-light focus-visible:outline-none"
                    title={isModalMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isModalMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-slate-violet-light animate-pulse" />}
                  </button>
                  {/* Close */}
                  <button
                    ref={closeBtnRef}
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 bg-graphite hover:bg-rose-950/40 border border-graphite-light hover:border-rose-500/40 rounded-lg text-alabaster-grey hover:text-rose-400 transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-rose-500 focus-visible:outline-none"
                    title="Close Preview"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Video Content Container */}
              <div 
                onClick={togglePlayPause}
                className="aspect-video w-full rounded-xl border border-graphite-light overflow-hidden bg-black relative group/video cursor-pointer"
              >
                {/* Subtle CRT scanline simulation overlay inside video player */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20 z-10 animate-crt-flicker" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)] opacity-60 z-10" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-violet/5 to-transparent h-[10%] w-full z-10 animate-crt-scanlines" />

                {/* Play state HUD overlay indicator */}
                <div className="absolute bottom-3 left-3 z-20 font-outfit text-[9px] bg-carbon-black/85 px-2 py-0.5 border border-graphite-light rounded text-bright-snow tracking-widest uppercase flex items-center gap-1.5 select-none pointer-events-none">
                  <span className={`w-1.5 h-1.5 rounded-full ${isModalPlaying ? 'bg-muted-green animate-pulse' : 'bg-rose-500'}`} />
                  {isModalPlaying ? 'PLAYING' : 'PAUSED'}
                </div>

                {/* Visual Pause Overlay */}
                {!isModalPlaying && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none animate-fadeIn">
                    <div className="w-12 h-12 rounded-full bg-carbon-black/90 border border-graphite-light flex items-center justify-center text-bright-snow shadow-lg">
                      <Play size={18} className="fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                <video
                  ref={modalVideoRef}
                  src={activeGame.videoSrc}
                  loop
                  muted={isModalMuted}
                  playsInline
                  onPlay={() => setIsModalPlaying(true)}
                  onPause={() => setIsModalPlaying(false)}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Modal Footer using Outfit font */}
              <div className="flex items-center justify-between text-[10px] font-outfit text-alabaster-grey/50 mt-3 uppercase tracking-wider select-none border-t border-graphite-light/50 pt-2.5">
                <span className="font-semibold text-slate-violet-light">{activeGame.subtitle}</span>
                <span>PRESS ESC, X OR OUTSIDE TO CLOSE</span>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* SVG filter definition for Option C Transition Warp */}
      <svg className="absolute w-0 h-0 pointer-events-none" style={{ visibility: 'hidden' }}>
        <defs>
          <filter id="emp-refract-slider" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              id="emp-turbulence-slider"
              type="fractalNoise" 
              baseFrequency="0.01 0.08" 
              numOctaves="2" 
              result="noise" 
            />
            <feDisplacementMap 
              id="emp-displacement-map-slider"
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
    </section>
  );
}

// Helper component to split text into characters for EMP wave propagation
function EmpText({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, cIdx) => (
            <span key={cIdx} className="emp-char inline-block origin-center">
              {char}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}