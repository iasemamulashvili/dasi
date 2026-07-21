'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sliders, RefreshCw, Activity, Sparkles, Eye, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Color Palette Presets
const COLOR_PALETTES = [
  { name: 'Electric Violet', tint: '#a855f7', highlight: '#c084fc' },
  { name: 'Cyan Cyber', tint: '#06b6d4', highlight: '#67e8f9' },
  { name: 'Monochrome Snow', tint: '#e4e4e7', highlight: '#ffffff' },
  { name: 'Deep Rose', tint: '#f43f5e', highlight: '#fb7185' },
];

export default function SmokeLogoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation Parameters (Tweakable via HUD)
  const [smokeRadius, setSmokeRadius] = useState<number>(1.8);
  const [turbulence, setTurbulence] = useState<number>(2.5);
  const [dissipationSpeed, setDissipationSpeed] = useState<number>(1.2);
  const [particleSize, setParticleSize] = useState<number>(4.0);
  const [activePaletteIdx, setActivePaletteIdx] = useState<number>(0);
  const [particleCount, setParticleCount] = useState<number>(0);
  const [fps, setFps] = useState<number>(60);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hudOpen, setHudOpen] = useState<boolean>(true);

  // Uniforms Ref for live parameter updates without recreation
  const uniformsRef = useRef<{
    uTime: THREE.IUniform<number>;
    uMouse: THREE.IUniform<THREE.Vector2>;
    uVelocity: THREE.IUniform<THREE.Vector2>;
    uSmokeRadius: THREE.IUniform<number>;
    uDissipationSpeed: THREE.IUniform<number>;
    uTurbulence: THREE.IUniform<number>;
    uParticleSize: THREE.IUniform<number>;
    uAspect: THREE.IUniform<number>;
    uColorTint: THREE.IUniform<THREE.Color>;
    uHighlightColor: THREE.IUniform<THREE.Color>;
  }>({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-999, -999) },
    uVelocity: { value: new THREE.Vector2(0, 0) },
    uSmokeRadius: { value: 1.8 },
    uDissipationSpeed: { value: 1.2 },
    uTurbulence: { value: 2.5 },
    uParticleSize: { value: 4.0 },
    uAspect: { value: 1.0 },
    uColorTint: { value: new THREE.Color('#a855f7') },
    uHighlightColor: { value: new THREE.Color('#c084fc') },
  });

  // Update uniforms when state changes
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uSmokeRadius.value = smokeRadius;
      uniformsRef.current.uTurbulence.value = turbulence;
      uniformsRef.current.uDissipationSpeed.value = dissipationSpeed;
      uniformsRef.current.uParticleSize.value = particleSize;

      const palette = COLOR_PALETTES[activePaletteIdx];
      uniformsRef.current.uColorTint.value.set(palette.tint);
      uniformsRef.current.uHighlightColor.value.set(palette.highlight);
    }
  }, [smokeRadius, turbulence, dissipationSpeed, particleSize, activePaletteIdx]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let particleMesh: THREE.Points;
    let geometry: THREE.BufferGeometry;
    let material: THREE.ShaderMaterial;

    const mousePos = new THREE.Vector2(-999, -999);
    const lastMousePos = new THREE.Vector2(-999, -999);
    const mouseVelocity = new THREE.Vector2(0, 0);

    // Vertex & Fragment Shaders with 3D Simplex Curl Noise
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uVelocity;
      uniform float uSmokeRadius;
      uniform float uDissipationSpeed;
      uniform float uTurbulence;
      uniform float uParticleSize;
      uniform float uAspect;

      attribute vec3 aTarget;
      attribute vec4 aRandom;

      varying float vInfluence;
      varying float vRandom;

      // 3D Simplex Noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      vec3 curlNoise(vec3 p) {
        float e = 0.1;
        float dx = snoise(p + vec3(e, 0.0, 0.0)) - snoise(p - vec3(e, 0.0, 0.0));
        float dy = snoise(p + vec3(0.0, e, 0.0)) - snoise(p - vec3(0.0, e, 0.0));
        float dz = snoise(p + vec3(0.0, 0.0, e)) - snoise(p - vec3(0.0, 0.0, e));

        return vec3(dy - dz, dz - dx, dx - dy) / (2.0 * e);
      }

      void main() {
        vRandom = aRandom.w;

        vec3 targetPos = aTarget;

        // Calculate distance from mouse in world space
        vec2 delta = targetPos.xy - uMouse;
        float dist = length(delta);

        // Smooth influence factor decaying from mouse center
        float influence = smoothstep(uSmokeRadius, 0.0, dist);
        vInfluence = influence;

        // Velocity strength boost when moving cursor
        float velStrength = clamp(length(uVelocity) * 2.2, 0.5, 3.5);

        // 3D Curl Noise vector
        vec3 noisePos = targetPos * 0.8 + vec3(uTime * 0.3, aRandom.x * 2.0, aRandom.y * 2.0);
        vec3 curl = curlNoise(noisePos);

        // Displace particle outward and upward along fluid vectors
        vec3 offset = (curl * uTurbulence * velStrength + vec3(aRandom.x * 0.4, 0.7 + aRandom.z, aRandom.y * 0.4)) * influence;

        vec3 currentPos = mix(targetPos, targetPos + offset, influence);

        vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float sizeBoost = 1.0 + influence * 2.5;
        gl_PointSize = uParticleSize * sizeBoost * (350.0 / -mvPosition.z);
      }
    `;

    const fragmentShader = `
      uniform vec3 uColorTint;
      uniform vec3 uHighlightColor;

      varying float vInfluence;
      varying float vRandom;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Radial gaussian opacity falloff
        float alpha = smoothstep(0.5, 0.0, dist);
        alpha *= mix(0.95, 0.40, vInfluence);

        // Crisp white in solid state -> glowing tint in smoke state
        vec3 finalColor = mix(vec3(0.98, 0.98, 1.0), uColorTint, vInfluence * 0.9);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Initialize WebGL Scene
    const initWebGL = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      uniformsRef.current.uAspect.value = width / height;

      // Sample Logo Image Pixels
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onerror = () => {
        if (img.src.includes('Logo_White_PNG.png')) {
          img.src = '/assets/logo.png';
        }
      };
      img.src = '/Logo_White_PNG.png';

      img.onload = () => {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) return;

        // Resolution scaling for particle sampling
        const sampleW = 320;
        const sampleH = Math.round((sampleW * img.height) / img.width);
        offCanvas.width = sampleW;
        offCanvas.height = sampleH;

        offCtx.drawImage(img, 0, 0, sampleW, sampleH);
        const imageData = offCtx.getImageData(0, 0, sampleW, sampleH);
        const pixels = imageData.data;

        const positions: number[] = [];
        const targets: number[] = [];
        const uvs: number[] = [];
        const randoms: number[] = [];

        // Grid sampling threshold
        const scaleX = 4.2;
        const scaleY = (scaleX * sampleH) / sampleW;

        for (let y = 0; y < sampleH; y += 1) {
          for (let x = 0; x < sampleW; x += 1) {
            const idx = (y * sampleW + x) * 4;
            const alpha = pixels[idx + 3];

            if (alpha > 30) {
              // Map to centered world coordinates
              const wx = ((x / sampleW) - 0.5) * scaleX;
              const wy = (0.5 - (y / sampleH)) * scaleY;
              const wz = (Math.random() - 0.5) * 0.05;

              positions.push(wx, wy, wz);
              targets.push(wx, wy, wz);
              uvs.push(x / sampleW, 1.0 - y / sampleH);

              randoms.push(
                (Math.random() - 0.5) * 2.0,
                (Math.random() - 0.5) * 2.0,
                (Math.random() - 0.5) * 2.0,
                Math.random()
              );
            }
          }
        }

        setParticleCount(positions.length / 3);

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(targets, 3));
        geometry.setAttribute('aUv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 4));

        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: uniformsRef.current,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        particleMesh = new THREE.Points(geometry, material);
        scene.add(particleMesh);
        setIsLoaded(true);
      };
    };

    initWebGL();

    // Mouse Movement & Raycasting World Position Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Project NDC raycast to camera z=0 plane
      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      mousePos.set(worldPos.x, worldPos.y);

      if (lastMousePos.x !== -999) {
        mouseVelocity.set(worldPos.x - lastMousePos.x, worldPos.y - lastMousePos.y);
      }
      lastMousePos.copy(worldPos);
    };

    const handleMouseLeave = () => {
      mousePos.set(-999, -999);
      mouseVelocity.set(0, 0);
      lastMousePos.set(-999, -999);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      uniformsRef.current.uAspect.value = width / height;
    };

    window.addEventListener('resize', handleResize);

    // Render Loop with FPS Counter
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      frameCounter += 1;
      if (now - fpsTimer >= 1000) {
        setFps(frameCounter);
        frameCounter = 0;
        fpsTimer = now;
      }

      // Smooth mouse velocity decay
      mouseVelocity.multiplyScalar(0.92);

      uniformsRef.current.uTime.value += delta;
      uniformsRef.current.uMouse.value.copy(mousePos);
      uniformsRef.current.uVelocity.value.copy(mouseVelocity);

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Lifecycle Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  const handleResetHUD = () => {
    setSmokeRadius(1.8);
    setTurbulence(2.5);
    setDissipationSpeed(1.2);
    setParticleSize(4.0);
    setActivePaletteIdx(0);
  };

  return (
    <div ref={containerRef} className="relative w-full h-[85vh] md:h-screen bg-carbon-black overflow-hidden select-none">
      {/* Background Subtle Volumetric Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0%,rgba(6,182,212,0.05)_50%,transparent_75%)] filter blur-3xl pointer-events-none z-0" />

      {/* WebGL Canvas Container */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 cursor-crosshair" />

      {/* Loading Progress State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30 bg-carbon-black/90 backdrop-blur-md font-mono text-xs text-bright-snow">
          <div className="w-8 h-8 rounded-full border-2 border-slate-violet-light border-t-transparent animate-spin" />
          <span className="tracking-widest uppercase text-slate-violet-light">
            SAMPLING LOGO PIXEL GRID...
          </span>
        </div>
      )}

      {/* Floating HUD Parameter Control Panel */}
      <div className="absolute top-24 right-6 z-30">
        <AnimatePresence>
          {hudOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="w-80 bg-carbon-black-2/85 border border-slate-violet/30 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-4 font-mono text-xs text-bright-snow"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-slate-violet-light" />
                  <span className="font-bold tracking-wider text-slate-violet-light uppercase">
                    SHADER CONTROL HUD
                  </span>
                </div>
                <button
                  onClick={() => setHudOpen(false)}
                  className="text-alabaster-grey/60 hover:text-bright-snow text-[10px] uppercase cursor-pointer"
                >
                  [HIDE]
                </button>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-3.5">
                {/* Smoke Radius */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-alabaster-grey">
                    <span>Smoke Radius</span>
                    <span className="text-slate-violet-light font-bold">{smokeRadius.toFixed(1)}u</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={smokeRadius}
                    onChange={(e) => setSmokeRadius(parseFloat(e.target.value))}
                    className="w-full accent-slate-violet-light cursor-pointer"
                  />
                </div>

                {/* Turbulence Intensity */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-alabaster-grey">
                    <span>Turbulence Intensity</span>
                    <span className="text-slate-violet-light font-bold">{turbulence.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={turbulence}
                    onChange={(e) => setTurbulence(parseFloat(e.target.value))}
                    className="w-full accent-slate-violet-light cursor-pointer"
                  />
                </div>

                {/* Dissipation Speed */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-alabaster-grey">
                    <span>Dissipation Speed</span>
                    <span className="text-slate-violet-light font-bold">{dissipationSpeed.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={dissipationSpeed}
                    onChange={(e) => setDissipationSpeed(parseFloat(e.target.value))}
                    className="w-full accent-slate-violet-light cursor-pointer"
                  />
                </div>

                {/* Particle Size */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-alabaster-grey">
                    <span>Particle Size</span>
                    <span className="text-slate-violet-light font-bold">{particleSize.toFixed(1)}px</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.2"
                    value={particleSize}
                    onChange={(e) => setParticleSize(parseFloat(e.target.value))}
                    className="w-full accent-slate-violet-light cursor-pointer"
                  />
                </div>

                {/* Palette Selector */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[11px] text-alabaster-grey">Color Tint Palette</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {COLOR_PALETTES.map((pal, idx) => (
                      <button
                        key={pal.name}
                        onClick={() => setActivePaletteIdx(idx)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                          activePaletteIdx === idx
                            ? 'bg-white/15 border-slate-violet-light text-bright-snow shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                            : 'bg-black/30 border-white/5 text-alabaster-grey/70 hover:bg-white/5'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pal.tint }} />
                        <span className="truncate">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset & Stats Footer */}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[9px] text-alabaster-grey/70">
                  <span className="flex items-center gap-1">
                    <Activity size={10} className="text-emerald-400" />
                    {fps} FPS
                  </span>
                  <span>•</span>
                  <span>{particleCount.toLocaleString()} VTX</span>
                </div>

                <button
                  onClick={handleResetHUD}
                  className="flex items-center gap-1 text-[10px] text-slate-violet-light hover:text-bright-snow cursor-pointer"
                >
                  <RefreshCw size={10} />
                  <span>RESET</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setHudOpen(true)}
              className="px-4 py-2 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl backdrop-blur-md font-mono text-xs text-bright-snow flex items-center gap-2 hover:bg-slate-violet/20 transition-all cursor-pointer shadow-lg"
            >
              <Sliders size={14} className="text-slate-violet-light" />
              <span>SHOW SHADER HUD</span>
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Instructions Banner */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-carbon-black-2/80 border border-slate-violet/30 backdrop-blur-md text-[10px] font-mono text-bright-snow shadow-xl">
          <Sparkles size={12} className="text-slate-violet-light animate-pulse" />
          <span className="uppercase tracking-widest text-alabaster-grey">
            HOVER & SWIPE CURSOR OVER LOGO TO TRIGGER FLUID DISSIPATION
          </span>
        </div>
      </div>
    </div>
  );
}
