'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Cpu, Sparkles, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

// Game Metadata for displacement slider
interface SandboxGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const sandboxGames: SandboxGame[] = [
  {
    id: 'crown-quest',
    title: 'Crown Quest',
    subtitle: 'Epic Action RPG Adventure',
    description: 'Embark on an epic fantasy RPG quest. Command legendary heroes, conquer tactical grid battles, and construct your royal stronghold in a war-torn kingdom.',
    image: '/crown-quest.png',
  },
  {
    id: 'lumber-chopper',
    title: 'Lumber Chopper',
    subtitle: 'Idle Wood Empire Tycoon',
    description: 'Harvest resources, optimize lumber mills, and build a massive wood-chopping dynasty. Automate operations and manage supply chains in this highly addictive idle tycoon.',
    image: '/lumber-chopper.png',
  },
  {
    id: 'hotel-manager',
    title: 'Hotel Manager',
    subtitle: '5-Star Luxury Resort Simulator',
    description: 'Design, build, and run a 5-star luxury resort empire. Hire world-class chefs, staff, and design stunning suites to keep VIP clients happy and maximize profits.',
    image: '/hotel-manager.png',
  }
];

// Interactive structures
interface SplatDrip {
  x: number; // relative to splat center
  y: number;
  size: number;
  speed: number;
  length: number;
  maxLength: number;
}

interface Splat {
  x: number; // normalized (0..1)
  y: number; // normalized (0..1)
  radius: number;
  maxRadius: number;
  opacity: number;
  createdAt: number;
  drips: SplatDrip[];
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  intensity: number;
  speed: number;
  createdAt: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  decay: number;
}

interface LaserBeam {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
  width: number;
  color: string;
}

export default function FanSandboxPage() {
  // Option State: 'A' (Radar Paintball), 'B' (Laser Vector), 'C' (Tech Scope EMP)
  const [activeOption, setActiveOption] = useState<'A' | 'B' | 'C'>('A');
  const [bulletsFired, setBulletsFired] = useState(0);
  const [telemetryLog, setTelemetryLog] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse HUD readout values
  const [cursorPos, setCursorPos] = useState({ pxX: 0, pxY: 0, normU: 0, normV: 0, azimuth: 0 });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // WebGL Refs
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const requestRef = useRef<number | null>(null);

  // Active bullet objects refs to avoid React re-render lag
  const splatsRef = useRef<Splat[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lasersRef = useRef<LaserBeam[]>([]);

  // Transition slider refs
  const prevIndexRef = useRef(0);
  const activeIndexRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const transitionActiveRef = useRef(false);

  // Mouse position ref for the continuous animation loop
  const mousePosRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);

  // WebGL Uniform Location cache
  const uniformsRef = useRef<{
    uTexture1: WebGLUniformLocation | null;
    uTexture2: WebGLUniformLocation | null;
    uProgress: WebGLUniformLocation | null;
    uCanvasSize: WebGLUniformLocation | null;
    uSplats: WebGLUniformLocation | null;
    uRipples: WebGLUniformLocation | null;
  }>({
    uTexture1: null,
    uTexture2: null,
    uProgress: null,
    uCanvasSize: null,
    uSplats: null,
    uRipples: null,
  });

  // helper to add action logs
  const addToTelemetryLog = (msg: string) => {
    setTelemetryLog(prev => [msg, ...prev].slice(0, 4));
  };

  // Helper for digital glitch text
  const glitchText = (text: string, active: boolean) => {
    if (!active) return text;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*+=_';
    return text.split('').map(char => {
      if (char === ' ' || char === ':' || char === '.' || char === '[' || char === ']') return char;
      return Math.random() > 0.3 ? chars[Math.floor(Math.random() * chars.length)] : char;
    }).join('');
  };

  // Switch cursor option helper
  const handleSwitchOption = (opt: 'A' | 'B' | 'C') => {
    setActiveOption(opt);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const labels = { A: 'RADAR HUD (PAINT)', B: 'VECTOR LASER', C: 'MINIMAL SCOPE (EMP)' };
    addToTelemetryLog(`[${timeStr}] Mode swapped to: ${labels[opt]}`);
  };

  // Slide Transitions
  const transitionTo = (targetIdx: number) => {
    if (targetIdx === activeIndexRef.current || transitionActiveRef.current) return;
    transitionActiveRef.current = true;

    const currentIdx = activeIndexRef.current;
    prevIndexRef.current = currentIdx;
    setActiveIndex(targetIdx);
    activeIndexRef.current = targetIdx;

    const animationObj = { progress: 0 };
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    addToTelemetryLog(`[${timeStr}] Mainframe loading slide: 0${targetIdx + 1} (${sandboxGames[targetIdx].title})`);

    gsap.to(animationObj, {
      progress: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        transitionProgressRef.current = animationObj.progress;
      },
      onComplete: () => {
        transitionActiveRef.current = false;
        prevIndexRef.current = targetIdx;
        transitionProgressRef.current = 0;
      }
    });
  };

  const handlePrevSlide = () => {
    const nextIdx = (activeIndex - 1 + sandboxGames.length) % sandboxGames.length;
    transitionTo(nextIdx);
  };

  const handleNextSlide = () => {
    const nextIdx = (activeIndex + 1) % sandboxGames.length;
    transitionTo(nextIdx);
  };

  // Mouse move handler relative to sandbox slider canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };

    // Calculate normalized coordinates (0..1)
    const normX = Math.min(Math.max(x / rect.width, 0), 1);
    const normY = Math.min(Math.max(y / rect.height, 0), 1);

    // Calculate azimuth from canvas center
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    if (angle < 0) angle += 360;

    setCursorPos({
      pxX: Math.round(x),
      pxY: Math.round(y),
      normU: parseFloat(normX.toFixed(3)),
      normV: parseFloat(normY.toFixed(3)),
      azimuth: angle
    });
  };

  // Mouse clicks - Bullet firing interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    const normX = pxX / rect.width;
    const normY = pxY / rect.height;

    setBulletsFired(prev => prev + 1);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    if (activeOption === 'A') {
      // Option A: Paintball
      addToTelemetryLog(`[${timeStr}] Paintball hit registered at U:${normX.toFixed(2)}, V:${normY.toFixed(2)}`);

      // Spawn paintball splat uniform parameters
      const newSplat: Splat = {
        x: normX,
        y: normY,
        radius: 0.005,
        maxRadius: 0.045 + Math.random() * 0.035,
        opacity: 1.0,
        createdAt: now.getTime(),
        drips: Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map(() => ({
          x: (Math.random() - 0.5) * 0.02,
          y: 0,
          size: 1.2 + Math.random() * 1.5,
          speed: 0.0004 + Math.random() * 0.0006,
          length: 0,
          maxLength: 0.03 + Math.random() * 0.06,
        }))
      };

      splatsRef.current.push(newSplat);
      if (splatsRef.current.length > 12) {
        splatsRef.current.shift(); // Keep at max 12 splats (shader constraint)
      }

      // Add spray particles in 2D canvas overlay
      for (let i = 0; i < 18; i++) {
        const pAngle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.5;
        particlesRef.current.push({
          id: Math.random(),
          x: pxX,
          y: pxY,
          vx: Math.cos(pAngle) * speed,
          vy: Math.sin(pAngle) * speed - 1.2, // Shoot slightly upward first
          size: 2.0 + Math.random() * 3.0,
          color: '#00ff55',
          opacity: 1.0,
          life: 1.0,
          decay: 0.025 + Math.random() * 0.025
        });
      }

    } else if (activeOption === 'B') {
      // Option B: Laser Vector
      addToTelemetryLog(`[${timeStr}] Vector laser pulse discharged at target: ${Math.round(pxX)}px, ${Math.round(pxY)}px`);

      // Laser energy beam lines (converge from top corners to click coordinate)
      lasersRef.current.push({
        id: Math.random(),
        startX: 0,
        startY: 0,
        endX: pxX,
        endY: pxY,
        opacity: 1.0,
        width: 3.5,
        color: '#00ffff'
      });
      lasersRef.current.push({
        id: Math.random(),
        startX: rect.width,
        startY: 0,
        endX: pxX,
        endY: pxY,
        opacity: 1.0,
        width: 3.5,
        color: '#ff007f'
      });

      // Spawn bright plasma burst particles
      for (let i = 0; i < 30; i++) {
        const pAngle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 6.5;
        const color = Math.random() > 0.5 ? '#00ffff' : '#ff007f';
        particlesRef.current.push({
          id: Math.random(),
          x: pxX,
          y: pxY,
          vx: Math.cos(pAngle) * speed,
          vy: Math.sin(pAngle) * speed,
          size: 1.5 + Math.random() * 4.0,
          color: color,
          opacity: 1.0,
          life: 1.0,
          decay: 0.015 + Math.random() * 0.025
        });
      }

      // Premium screen shake visual feedback using GSAP
      if (canvas) {
        gsap.fromTo(canvas,
          { x: () => (Math.random() - 0.5) * 8, y: () => (Math.random() - 0.5) * 8 },
          { x: 0, y: 0, duration: 0.12, ease: 'rough', clearProps: 'x,y' }
        );
      }

    } else if (activeOption === 'C') {
      // Option C: Minimal Tech Scope EMP
      addToTelemetryLog(`[${timeStr}] Refractive EMP shockwave triggered. Wavefront active`);

      // Trigger glitch text readout
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 280);

      // Create WebGL refractive expanding ripple
      const newRipple: Ripple = {
        x: normX,
        y: normY,
        radius: 0.0,
        maxRadius: 0.55 + Math.random() * 0.15,
        intensity: 1.0,
        speed: 0.38,
        createdAt: now.getTime()
      };

      ripplesRef.current.push(newRipple);
      if (ripplesRef.current.length > 8) {
        ripplesRef.current.shift(); // Keep at max 8 ripples
      }
    }
  };

  // Draw HUD crosshair cursor dynamically on 2D canvas overlay
  const drawAimCrosshair = (ctx: CanvasRenderingContext2D, x: number, y: number, option: 'A' | 'B' | 'C') => {
    ctx.save();
    const time = Date.now() * 0.003;

    if (option === 'A') {
      // Green Radar HUD
      const color = '#00ff55';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      // Rotating dashed outer ring
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 0.4);
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Solid inner ring
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Framing notches/brackets
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 0.1);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.arc(0, 0, 32, -0.15, 0.15);
        ctx.stroke();
      }
      ctx.restore();

      // Crosshair needle ticks
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x - 38, y); ctx.lineTo(x - 16, y);
      ctx.moveTo(x + 16, y); ctx.lineTo(x + 38, y);
      ctx.moveTo(x, y - 38); ctx.lineTo(x, y - 16);
      ctx.moveTo(x, y + 16); ctx.lineTo(x, y + 38);
      ctx.stroke();

      // Center point target dot
      ctx.beginPath();
      ctx.arc(x, y, 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Floating data readouts next to reticle
      ctx.font = '8px monospace';
      ctx.fillText(`SYS_LOCK: GREEN_A`, x + 34, y - 10);
      ctx.fillText(`AZIMUTH: ${cursorPos.azimuth}°`, x + 34, y + 2);
      ctx.fillText(`RADAR_HUD`, x - 75, y + 18);

    } else if (option === 'B') {
      // Vector Laser Reticle (Cyan/Pink)
      const cyan = '#00ffff';
      const pink = '#ff007f';

      // Inner diamond rotating
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 1.3);
      ctx.strokeStyle = cyan;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(-8, -8, 16, 16);
      ctx.stroke();
      ctx.restore();

      // Outer angle brackets rotating in reverse
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-time * 0.4);
      ctx.strokeStyle = pink;
      ctx.lineWidth = 1.5;
      const bracketOffset = 22;
      const bracketLen = 8;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(-bracketOffset, -bracketOffset + bracketLen);
      ctx.lineTo(-bracketOffset, -bracketOffset);
      ctx.lineTo(-bracketOffset + bracketLen, -bracketOffset);
      // Top-Right
      ctx.moveTo(bracketOffset, -bracketOffset + bracketLen);
      ctx.lineTo(bracketOffset, -bracketOffset);
      ctx.lineTo(bracketOffset - bracketLen, -bracketOffset);
      // Bottom-Left
      ctx.moveTo(-bracketOffset, bracketOffset - bracketLen);
      ctx.lineTo(-bracketOffset, bracketOffset);
      ctx.lineTo(-bracketOffset + bracketLen, bracketOffset);
      // Bottom-Right
      ctx.moveTo(bracketOffset, bracketOffset - bracketLen);
      ctx.lineTo(bracketOffset, bracketOffset);
      ctx.lineTo(bracketOffset - bracketLen, bracketOffset);
      ctx.stroke();
      ctx.restore();

      // Horizontal crosshair lines
      ctx.strokeStyle = cyan;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x - 34, y); ctx.lineTo(x - 14, y);
      ctx.moveTo(x + 14, y); ctx.lineTo(x + 34, y);
      ctx.stroke();

      // Readouts
      ctx.font = '8px monospace';
      ctx.fillStyle = pink;
      ctx.fillText(`LASER READY`, x + 28, y - 6);
      ctx.fillStyle = cyan;
      ctx.fillText(`CHARGE 100%`, x + 28, y + 6);

    } else if (option === 'C') {
      // Minimal Tech Scope (Platinum)
      const color = '#e5e5e5';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.0;

      // Primary thin circular reticle
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Reticle center dot
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair pointers
      ctx.beginPath();
      ctx.moveTo(x - 30, y); ctx.lineTo(x - 6, y);
      ctx.moveTo(x + 6, y); ctx.lineTo(x + 30, y);
      ctx.moveTo(x, y - 30); ctx.lineTo(x, y - 6);
      ctx.moveTo(x, y + 6); ctx.lineTo(x, y + 30);
      ctx.stroke();

      // Precision technical brackets framing the scope
      const gap = 30;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      // Top-Left
      ctx.moveTo(x - gap, y - gap + 5); ctx.lineTo(x - gap, y - gap); ctx.lineTo(x - gap + 5, y - gap);
      // Top-Right
      ctx.moveTo(x + gap, y - gap + 5); ctx.lineTo(x + gap, y - gap); ctx.lineTo(x + gap - 5, y - gap);
      // Bottom-Left
      ctx.moveTo(x - gap, y + gap - 5); ctx.lineTo(x - gap, y + gap); ctx.lineTo(x - gap + 5, y + gap);
      // Bottom-Right
      ctx.moveTo(x + gap, y + gap - 5); ctx.lineTo(x + gap, y + gap); ctx.lineTo(x + gap - 5, y + gap);
      ctx.stroke();

      // Tech details text
      ctx.font = '8px monospace';
      ctx.fillText(`MODE: EMP`, x + 34, y + 3);
    }

    ctx.restore();
  };

  // Main compilation and WebGL Context Setup on Mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.warn("WebGL not supported. Falling back.");
      setWebglSupported(false);
      setLoading(false);
      return;
    }
    glRef.current = gl;

    // Shaders
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y; // invert Y
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

      #define MAX_SPLATS 12
      uniform vec4 u_splats[MAX_SPLATS]; // x, y, radius, opacity

      #define MAX_RIPPLES 8
      uniform vec4 u_ripples[MAX_RIPPLES]; // x, y, radius, intensity

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

        // Accumulate paintball paint splats and organic refraction
        vec2 splatDistortion = vec2(0.0);
        vec4 splatColor = vec4(0.0);

        for (int i = 0; i < MAX_SPLATS; i++) {
          vec4 splat = u_splats[i];
          if (splat.z > 0.0) {
            vec2 center = splat.xy;
            float radius = splat.z;
            float opacity = splat.w;

            vec2 diff = (uv - center) * aspect;
            float dist = length(diff);

            // Procedural deform based on angle to make the splat organic
            float angle = atan(diff.y, diff.x);
            float deform = sin(angle * 6.0) * 0.08 + cos(angle * 10.0) * 0.04;
            float modifiedRadius = radius * (1.0 + deform * 0.25);

            if (dist < modifiedRadius) {
              float edge = smoothstep(modifiedRadius, modifiedRadius - 0.015, dist);
              vec4 paint = vec4(0.0, 1.0, 0.33, opacity * edge); // Lime green paint
              splatColor = mix(splatColor, paint, paint.a);

              // Inside paint refraction
              vec2 refr = normalize(diff) * (modifiedRadius - dist) * 0.15;
              splatDistortion += refr;
            } else {
              // Edge halo refraction
              float borderDist = dist - modifiedRadius;
              if (borderDist < 0.04) {
                float force = smoothstep(0.04, 0.0, borderDist) * opacity;
                vec2 refr = normalize(diff) * sin(borderDist * 90.0) * 0.015 * force;
                splatDistortion += refr;
              }
            }
          }
        }

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

        vec2 finalUV = uv + splatDistortion + rippleDistortion;

        // Image sizing
        vec2 imageRatio = vec2(1920.0, 1080.0);
        vec2 uv1 = getCoverUV(finalUV, u_canvasSize, imageRatio);
        vec2 uv2 = getCoverUV(finalUV, u_canvasSize, imageRatio);

        // Slide displacement transition
        float waveNoise = noise(finalUV * 10.0 + vec2(u_progress * 1.8, u_progress * 1.2)) * 0.08;
        vec2 dist1 = uv1 + vec2(waveNoise * u_progress, waveNoise * u_progress);
        vec2 dist2 = uv2 - vec2(waveNoise * (1.0 - u_progress), waveNoise * (1.0 - u_progress));

        vec4 col1 = texture2D(u_texture1, dist1);
        vec4 col2 = texture2D(u_texture2, dist2);
        vec4 baseColor = mix(col1, col2, u_progress);

        // Render base color mixed with paintball splashes
        gl_FragColor = mix(baseColor, vec4(splatColor.rgb, 1.0), splatColor.a);
      }
    `;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("VS compilation fail", gl.getShaderInfoLog(vs));
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("FS compilation fail", gl.getShaderInfoLog(fs));
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    // Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking fail", gl.getProgramInfoLog(program));
      setWebglSupported(false);
      setLoading(false);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Cache Uniform Locations
    uniformsRef.current = {
      uTexture1: gl.getUniformLocation(program, 'u_texture1'),
      uTexture2: gl.getUniformLocation(program, 'u_texture2'),
      uProgress: gl.getUniformLocation(program, 'u_progress'),
      uCanvasSize: gl.getUniformLocation(program, 'u_canvasSize'),
      uSplats: gl.getUniformLocation(program, 'u_splats'),
      uRipples: gl.getUniformLocation(program, 'u_ripples')
    };

    // Buffer Quad Geometry
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

    // Initialize 2D Canvas context
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      overlayCtxRef.current = overlay.getContext('2d');
    }

    // Load textures
    const imageUrls = sandboxGames.map(g => g.image);
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
        // Safe procedural fallback if assets are missing
        const canvasFallback = document.createElement('canvas');
        canvasFallback.width = 512;
        canvasFallback.height = 512;
        const fallbackCtx = canvasFallback.getContext('2d');
        if (fallbackCtx) {
          const grad = fallbackCtx.createLinearGradient(0, 0, 512, 512);
          if (i === 0) { grad.addColorStop(0, '#e5a93b'); grad.addColorStop(1, '#ff3333'); }
          else if (i === 1) { grad.addColorStop(0, '#33e533'); grad.addColorStop(1, '#117711'); }
          else { grad.addColorStop(0, '#3333e5'); grad.addColorStop(1, '#8833ff'); }
          fallbackCtx.fillStyle = grad;
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

    // Resize handlers
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.offsetWidth;
      const height = canvas.parentElement.offsetHeight;

      canvas.width = width;
      canvas.height = height;

      if (overlay) {
        overlay.width = width;
        overlay.height = height;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Start 60fps mainframe render loop
    const runFrame = () => {
      updateAndRender();
    };

    requestRef.current = requestAnimationFrame(runFrame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeOption]);

  // Update physics calculations and trigger draw cycles
  const updateAndRender = () => {
    const canvas = canvasRef.current;
    const ctx = overlayCtxRef.current;
    const gl = glRef.current;

    if (!canvas || !ctx || !gl) {
      requestRef.current = requestAnimationFrame(updateAndRender);
      return;
    }

    // Clear overlay vector contents
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // 1. Splats: Grow radius & Decay opacity
    const activeSplats = splatsRef.current;
    for (let i = 0; i < activeSplats.length; i++) {
      const splat = activeSplats[i];
      if (splat.radius < splat.maxRadius) {
        splat.radius += (splat.maxRadius - splat.radius) * 0.16;
      }
      
      const age = now - splat.createdAt;
      if (age > 5500) {
        splat.opacity = Math.max(0, 1.0 - (age - 5500) / 1500); // 1.5s fade out
      }

      // Update drips
      splat.drips.forEach(drip => {
        if (drip.length < drip.maxLength) {
          drip.length += drip.speed;
        }
      });
    }
    splatsRef.current = activeSplats.filter(s => s.opacity > 0);

    // 2. Ripples: Expand radius
    const activeRipples = ripplesRef.current;
    for (let i = 0; i < activeRipples.length; i++) {
      const ripple = activeRipples[i];
      ripple.radius += ripple.speed * 0.016; // approx 60fps
      ripple.intensity = Math.max(0, 1.0 - (ripple.radius / ripple.maxRadius));
    }
    ripplesRef.current = activeRipples.filter(r => r.radius < r.maxRadius && r.intensity > 0);

    // 3. Vector Laser Beams: draw and fade
    const activeLasers = lasersRef.current;
    for (let i = activeLasers.length - 1; i >= 0; i--) {
      const laser = activeLasers[i];
      laser.opacity -= 0.12;
      if (laser.opacity <= 0) {
        activeLasers.splice(i, 1);
        continue;
      }

      ctx.save();
      // Outer neon glowing laser beam
      ctx.shadowBlur = 12;
      ctx.shadowColor = laser.color;
      ctx.strokeStyle = laser.color;
      ctx.lineWidth = laser.width * laser.opacity;
      ctx.beginPath();
      ctx.moveTo(laser.startX, laser.startY);
      ctx.lineTo(laser.endX, laser.endY);
      ctx.stroke();

      // Core white laser line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = (laser.width * 0.3) * laser.opacity;
      ctx.beginPath();
      ctx.moveTo(laser.startX, laser.startY);
      ctx.lineTo(laser.endX, laser.endY);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Vector Particles: draw, update coordinates & decay life
    const activeParticles = particlesRef.current;
    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.11; // Gravity pull
      p.life -= p.decay;

      if (p.life <= 0) {
        activeParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Paint splats organic drip rendering (2D layer overlay)
    ctx.save();
    ctx.fillStyle = '#00ff55';
    ctx.strokeStyle = '#00ff55';
    splatsRef.current.forEach(splat => {
      const sx = splat.x * canvas.width;
      const sy = splat.y * canvas.height;
      ctx.globalAlpha = splat.opacity;
      
      splat.drips.forEach(drip => {
        const dripY = sy + drip.length * canvas.height;
        ctx.lineWidth = drip.size;
        ctx.beginPath();
        ctx.moveTo(sx + (drip.x * canvas.width), sy);
        ctx.lineTo(sx + (drip.x * canvas.width), dripY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx + (drip.x * canvas.width), dripY, drip.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.restore();

    // 6. Minimal Tech EMP Expanding vector rings
    ripplesRef.current.forEach(ripple => {
      const rx = ripple.x * canvas.width;
      const ry = ripple.y * canvas.height;
      const rPixels = ripple.radius * Math.max(canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = ripple.intensity * 0.7;
      ctx.strokeStyle = '#e5e5e5';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#e5e5e5';

      // Outer dashed tech ring
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 10]);
      ctx.beginPath();
      ctx.arc(rx, ry, rPixels, 0, Math.PI * 2);
      ctx.stroke();

      // Inner thin solid ring
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(rx, ry, rPixels * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // 7. Render dynamic Aim Crosshair Cursor
    if (hoverRef.current) {
      drawAimCrosshair(ctx, mousePosRef.current.x, mousePosRef.current.y, activeOption);
    }

    // 8. RENDER WEBGL SCENERY FRAME
    // Format splats into flat Float32Array (12 items * 4 properties: x, y, radius, opacity)
    const splatArray = new Float32Array(12 * 4);
    for (let i = 0; i < 12; i++) {
      if (i < splatsRef.current.length) {
        const s = splatsRef.current[i];
        splatArray[i * 4] = s.x;
        splatArray[i * 4 + 1] = s.y;
        splatArray[i * 4 + 2] = s.radius;
        splatArray[i * 4 + 3] = s.opacity;
      } else {
        splatArray[i * 4] = 0.0;
        splatArray[i * 4 + 1] = 0.0;
        splatArray[i * 4 + 2] = 0.0;
        splatArray[i * 4 + 3] = 0.0;
      }
    }

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

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(programRef.current);

    const prevIdx = prevIndexRef.current;
    const currIdx = activeIndexRef.current;
    const progress = transitionProgressRef.current;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[prevIdx]);
    if (uniformsRef.current.uTexture1) gl.uniform1i(uniformsRef.current.uTexture1, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[currIdx]);
    if (uniformsRef.current.uTexture2) gl.uniform1i(uniformsRef.current.uTexture2, 1);

    if (uniformsRef.current.uProgress) gl.uniform1f(uniformsRef.current.uProgress, progress);
    if (uniformsRef.current.uCanvasSize) gl.uniform2f(uniformsRef.current.uCanvasSize, canvas.width, canvas.height);
    if (uniformsRef.current.uSplats) gl.uniform4fv(uniformsRef.current.uSplats, splatArray);
    if (uniformsRef.current.uRipples) gl.uniform4fv(uniformsRef.current.uRipples, rippleArray);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestRef.current = requestAnimationFrame(updateAndRender);
  };

  const activeGame = sandboxGames[activeIndex];

  return (
    <main className="min-h-screen w-full bg-carbon-black text-bright-snow flex flex-col items-center py-16 px-6 font-sans">
      <div className="max-w-7xl w-full flex flex-col gap-8">
        
        {/* Mainframe Concept Title Bar */}
        <div className="border-b border-graphite-light pb-6 mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-slate-violet-light uppercase tracking-widest bg-graphite/40 border border-graphite-light/50 px-2.5 py-1 rounded w-fit">
              <span className="w-1.5 h-1.5 bg-slate-violet-light rounded-full animate-ping" />
              Mainframe Lab Sandbox // CONCEPT SEC-04
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-bright-snow font-russo-one uppercase leading-none retro-heading-shadow">
              Liquid Mainframe Cursors
            </h1>
            <p className="text-xs md:text-sm text-alabaster-grey/80 mt-2.5 max-w-2xl leading-relaxed font-plus-jakarta-sans">
              Test next-generation digital cursor aiming profiles. Clicking the WebGL displacement slider initiates live energy discharge, splatting organic paint droplets, or warping rendering layers with EMP micro-ripples.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                splatsRef.current = [];
                ripplesRef.current = [];
                particlesRef.current = [];
                lasersRef.current = [];
                setBulletsFired(0);
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                addToTelemetryLog(`[${timeStr}] Mainframe canvas buffer flushed clean.`);
              }}
              className="inset-pixel-btn-secondary py-2 px-4 text-[10px] font-mono flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-slate-violet-light"
              title="Clear Canvas Splats and Telemetry Counters"
            >
              <RefreshCw size={12} className="animate-[spin_10s_linear_infinite]" />
              FLUSH CANVAS BUFFER
            </button>
          </div>
        </div>

        {/* Conceptual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
          
          {/* Main Showcase Viewport (Left 2 Columns) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Viewport Box Container */}
            <div 
              ref={containerRef}
              className="relative w-full h-[380px] md:h-[500px] bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden shadow-2xl slider-glow flex items-end justify-between p-6 select-none"
              role="region"
              aria-label="Liquid Mainframe Viewport"
            >
              {/* Custom CSS overrides */}
              <style>{`
                @keyframes crt-scanlines {
                  0% { transform: translateY(-100%); }
                  100% { transform: translateY(100%); }
                }
                @keyframes crt-flicker {
                  0% { opacity: 0.985; }
                  50% { opacity: 1.0; }
                  100% { opacity: 0.99; }
                }
                .animate-crt-flicker {
                  animation: crt-flicker 0.18s infinite;
                }
                .animate-crt-scanlines {
                  animation: crt-scanlines 5.5s linear infinite;
                }
              `}</style>

              {/* Preloader */}
              {loading && (
                <div className="absolute inset-0 bg-carbon-black z-50 flex flex-col items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full border-2 border-graphite-light border-t-slate-violet-light animate-spin" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-violet-light animate-pulse">
                    LOADING SHADERS & GL IMAGE BUFFER...
                  </span>
                </div>
              )}

              {/* WebGL Canvas */}
              {webglSupported ? (
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full object-cover cursor-none"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => {
                    setIsHovered(true);
                    hoverRef.current = true;
                  }}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    hoverRef.current = false;
                  }}
                  onClick={handleCanvasClick}
                />
              ) : (
                <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center border border-red-500/30 p-8 text-center">
                  <p className="text-sm text-red-300">
                    WebGL acceleration failed to initialize. Please verify hardware acceleration settings.
                  </p>
                </div>
              )}

              {/* Interactive Vector 2D Overlay Canvas */}
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              />

              {/* Retro HUD Scanlines Layer */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_4px,6px_100%] opacity-20 z-20 animate-crt-flicker" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)] opacity-75 z-20" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-violet/5 to-transparent h-[12%] w-full z-20 animate-crt-scanlines" />

              {/* HUD Screen Text details overlay */}
              <div className="relative z-30 pointer-events-none text-left max-w-sm flex flex-col gap-2">
                <span className="text-[10px] font-mono text-platinum-silver bg-carbon-black-2/90 border border-graphite-light/50 px-2 py-0.5 w-fit rounded backdrop-blur">
                  0{activeIndex + 1} // {activeGame.subtitle.toUpperCase()}
                </span>
                <h2 className="text-3xl font-bold uppercase tracking-wider text-bright-snow font-russo-one retro-heading-shadow">
                  {activeGame.title}
                </h2>
                <p className="text-xs text-alabaster-grey/90 leading-relaxed font-light font-plus-jakarta-sans text-wrap:pretty">
                  {activeGame.description}
                </p>
              </div>

              {/* Viewport Indicator details */}
              <div className="relative z-30 pointer-events-none text-right font-mono text-[9px] text-alabaster-grey/50 flex flex-col gap-0.5 items-end">
                <div>ACCELERATION: WEBGL_2.0</div>
                <div>RENDER_TARGET: BACK_BUFFER</div>
                <div>TARGET: {activeGame.id.toUpperCase()}</div>
              </div>
            </div>

            {/* Slider Switcher buttons */}
            <div className="flex justify-between items-center bg-carbon-black-2 border border-graphite-light p-4 rounded-2xl w-full">
              <div className="flex gap-2">
                {sandboxGames.map((game, idx) => (
                  <button
                    key={game.id}
                    onClick={() => transitionTo(idx)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all border outline-none focus-visible:ring-2 focus-visible:ring-slate-violet-light ${
                      activeIndex === idx
                        ? 'bg-platinum-silver text-carbon-black border-transparent font-bold'
                        : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/30 hover:text-bright-snow'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevSlide}
                  className="p-2 border border-graphite-light hover:border-alabaster-grey/30 rounded-xl text-alabaster-grey/70 hover:text-bright-snow transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-violet-light"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="p-2 border border-graphite-light hover:border-alabaster-grey/30 rounded-xl text-alabaster-grey/70 hover:text-bright-snow transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-violet-light"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* HUD Control & Configuration Panel (Right Column) */}
          <div className="lg:col-span-1 flex flex-col gap-6 bg-carbon-black-2 border border-graphite-light p-6 rounded-2xl relative shadow-xl justify-between">
            
            {/* HUD Header */}
            <div>
              <div className="flex items-center justify-between border-b border-graphite-light/60 pb-3 mb-4">
                <span className="text-[10px] font-mono text-bright-snow tracking-wider uppercase flex items-center gap-1.5">
                  <Cpu size={12} className="text-slate-violet-light" />
                  Telemetry Display
                </span>
                <span className="text-[8px] font-mono text-alabaster-grey/50">SEC_ID: 994B</span>
              </div>

              {/* Cursor design Switcher */}
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[9px] font-mono text-alabaster-grey/60 uppercase tracking-wider">
                  Targeting Profile Select:
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSwitchOption('A')}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-mono transition-all outline-none focus-visible:ring-2 ${
                      activeOption === 'A'
                        ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                        : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/20 hover:text-bright-snow bg-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeOption === 'A' ? 'bg-emerald-400 animate-pulse' : 'bg-graphite'}`} />
                      RADAR HUD (GREEN)
                    </span>
                    <span className="text-[9px] opacity-75">PAINTBALL</span>
                  </button>

                  <button
                    onClick={() => handleSwitchOption('B')}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-mono transition-all outline-none focus-visible:ring-2 ${
                      activeOption === 'B'
                        ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                        : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/20 hover:text-bright-snow bg-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeOption === 'B' ? 'bg-cyan-400 animate-pulse' : 'bg-graphite'}`} />
                      VECTOR LASER (CYAN)
                    </span>
                    <span className="text-[9px] opacity-75">ENERGY BURST</span>
                  </button>

                  <button
                    onClick={() => handleSwitchOption('C')}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-mono transition-all outline-none focus-visible:ring-2 ${
                      activeOption === 'C'
                        ? 'bg-slate-800/40 text-slate-100 border-slate-500/40 shadow-[0_0_12px_rgba(255,255,255,0.06)]'
                        : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/20 hover:text-bright-snow bg-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeOption === 'C' ? 'bg-slate-200 animate-pulse' : 'bg-graphite'}`} />
                      TECH SCOPE (PLATINUM)
                    </span>
                    <span className="text-[9px] opacity-75">EMP SHOCKWAVE</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Telemetry dials */}
              <div className="bg-carbon-black border border-graphite-light/60 p-4 rounded-xl flex flex-col gap-2.5 mb-6 font-mono text-[10px]">
                <div className="flex justify-between border-b border-graphite-light/40 pb-1.5">
                  <span className="text-alabaster-grey/50">COORDINATE_X:</span>
                  <span className="text-bright-snow font-bold">{glitchText(`${cursorPos.pxX}px`, isGlitching)}</span>
                </div>
                <div className="flex justify-between border-b border-graphite-light/40 pb-1.5">
                  <span className="text-alabaster-grey/50">COORDINATE_Y:</span>
                  <span className="text-bright-snow font-bold">{glitchText(`${cursorPos.pxY}px`, isGlitching)}</span>
                </div>
                <div className="flex justify-between border-b border-graphite-light/40 pb-1.5">
                  <span className="text-alabaster-grey/50">NORM_COORD_U:</span>
                  <span className="text-bright-snow font-bold">{glitchText(`${cursorPos.normU}`, isGlitching)}</span>
                </div>
                <div className="flex justify-between border-b border-graphite-light/40 pb-1.5">
                  <span className="text-alabaster-grey/50">NORM_COORD_V:</span>
                  <span className="text-bright-snow font-bold">{glitchText(`${cursorPos.normV}`, isGlitching)}</span>
                </div>
                <div className="flex justify-between border-b border-graphite-light/40 pb-1.5">
                  <span className="text-alabaster-grey/50">AZIMUTH_ANGLE:</span>
                  <span className="text-bright-snow font-bold">{glitchText(`${cursorPos.azimuth}°`, isGlitching)}</span>
                </div>
                <div className="flex justify-between border-b border-graphite-light/40 pb-1.5">
                  <span className="text-alabaster-grey/50">DISCHARGES_FIRED:</span>
                  <span className="text-slate-violet-light font-bold">{glitchText(`${bulletsFired}`, isGlitching)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-alabaster-grey/50">SYSTEM_STATUS:</span>
                  <span className={`${isHovered ? 'text-emerald-400 animate-pulse' : 'text-amber-400'} font-bold`}>
                    {glitchText(isHovered ? 'LOCKED_ON' : 'WAITING', isGlitching)}
                  </span>
                </div>
              </div>
            </div>

            {/* Live action logs console */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-mono text-alabaster-grey/60 uppercase tracking-wider">
                Action Log Terminal:
              </label>
              <div className="bg-carbon-black border border-graphite-light/60 p-4 rounded-xl min-h-[90px] font-mono text-[9px] flex flex-col gap-1.5 leading-normal justify-end text-alabaster-grey/75">
                {telemetryLog.length === 0 ? (
                  <div className="text-alabaster-grey/30 italic">[Awaiting click interaction telemetry...]</div>
                ) : (
                  telemetryLog.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`truncate ${
                        idx === 0 ? 'text-bright-snow border-l border-slate-violet-light pl-1.5 font-semibold' : 'opacity-55'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Technical features summary */}
        <div className="p-6 bg-carbon-black-2 border border-graphite-light rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px] leading-relaxed">
          <div>
            <h4 className="font-bold text-emerald-400 uppercase mb-1.5">Option A: Radar Paintball</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              Distorts WebGL textures in the fragment shader based on normalized uniform vectors. On the 2D overlay, organic paint drops run down, leaving visual residuals on the slider.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-cyan-400 uppercase mb-1.5">Option B: Laser Reticle</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              Renders neon gradient beams in 2D space. Plasma particles spread radially using speed coordinates, while GSAP triggers frame-level container displacement on impact.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 uppercase mb-1.5">Option C: Tech Scope EMP</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              Expands concentric vector circles that mimic shockwaves. The WebGL shader applies sine-wave refraction, warping the render textures outwards dynamically.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
