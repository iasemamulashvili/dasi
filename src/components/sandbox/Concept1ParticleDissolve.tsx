'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Concept1ParticleDissolve() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Offscreen Canvas Logo Pixel Sampler
    const logoCanvas = document.createElement('canvas');
    const logoCtx = logoCanvas.getContext('2d');
    const logoSize = 160;
    logoCanvas.width = logoSize;
    logoCanvas.height = logoSize;

    let pointsGeometry: THREE.BufferGeometry | null = null;
    let particleSystem: THREE.Points | null = null;
    let particleMaterial: THREE.ShaderMaterial | null = null;

    // Mouse tracking uniforms & vectors
    const mouse3D = new THREE.Vector2(-9999, -9999);
    const targetMouse = new THREE.Vector2(-9999, -9999);

    const img = new Image();
    img.src = '/Images/dasigames_logo.png';
    img.onload = () => {
      if (!logoCtx) return;
      logoCtx.drawImage(img, 0, 0, logoSize, logoSize);
      const imgData = logoCtx.getImageData(0, 0, logoSize, logoSize);
      const pixels = imgData.data;

      const positions: number[] = [];
      const originPositions: number[] = [];
      const randomOffsets: number[] = [];
      const colors: number[] = [];

      // Step size for particle density balance
      const step = 2;
      for (let y = 0; y < logoSize; y += step) {
        for (let x = 0; x < logoSize; x += step) {
          const index = (y * logoSize + x) * 4;
          const alpha = pixels[index + 3];

          // Sample non-transparent pixels
          if (alpha > 40) {
            // Map 2D pixel coordinates to 3D centered world coordinates
            const posX = (x - logoSize / 2) * 2.2;
            const posY = -(y - logoSize / 2) * 2.2;
            const posZ = 0;

            positions.push(posX, posY, posZ);
            originPositions.push(posX, posY, posZ);

            randomOffsets.push(
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 60
            );

            // Purple / Platinum silver particle palette
            const r = 0.85 + Math.random() * 0.15;
            const g = 0.8 + Math.random() * 0.2;
            const b = 1.0;
            colors.push(r, g, b);
          }
        }
      }

      pointsGeometry = new THREE.BufferGeometry();
      pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      pointsGeometry.setAttribute('aOrigin', new THREE.Float32BufferAttribute(originPositions, 3));
      pointsGeometry.setAttribute('aOffset', new THREE.Float32BufferAttribute(randomOffsets, 3));
      pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      // Custom GLSL Shader Material with Curl Noise & Mouse Displacement
      particleMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(-9999, -9999) },
          uRadius: { value: 90.0 },
        },
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uRadius;

          attribute vec3 aOrigin;
          attribute vec3 aOffset;
          attribute vec3 color;

          varying vec3 vColor;
          varying float vDist;

          // GLSL Simplex Noise helper for organic curl turbulence
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }

          void main() {
            vColor = color;
            vec3 pos = aOrigin;

            // Calculate 2D distance from particle origin to mouse
            float dist = distance(pos.xy, uMouse);
            vDist = dist;

            if (dist < uRadius) {
              float force = (1.0 - dist / uRadius);
              vec2 dir = normalize(pos.xy - uMouse);

              // Push particles away along cursor vector
              pos.xy += dir * force * 70.0;
              pos.z += force * 90.0;

              // Add curl noise turbulence
              float n1 = snoise(pos.xy * 0.03 + vec2(uTime * 1.5));
              float n2 = snoise(pos.yx * 0.03 - vec2(uTime * 1.5));
              pos.x += n1 * force * 35.0;
              pos.y += n2 * force * 35.0;
            } else {
              // Subtle ambient floating motion
              float n = snoise(pos.xy * 0.01 + vec2(uTime * 0.5));
              pos.z += n * 4.0;
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (4.5 / -mvPosition.z) * 350.0;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vDist;

          void main() {
            // Soft circular particle radial gradient
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d);

            gl_FragColor = vec4(vColor, alpha * 0.9);
          }
        `,
      });

      particleSystem = new THREE.Points(pointsGeometry, particleMaterial);
      scene.add(particleSystem);
    };

    // Mouse Move Event Listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert mouse coordinates to Three.js centered world space
      targetMouse.x = (x - rect.width / 2) * (350 / (rect.width / 2));
      targetMouse.y = -(y - rect.height / 2) * (350 / (rect.height / 2));
    };

    const handleMouseLeave = () => {
      targetMouse.set(-9999, -9999);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Window Resize Listener
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 3. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate mouse uniform
      mouse3D.lerp(targetMouse, 0.1);

      if (particleMaterial) {
        particleMaterial.uniforms.uTime.value = elapsedTime;
        particleMaterial.uniforms.uMouse.value.copy(mouse3D);
      }

      if (particleSystem) {
        // Slow subtle 3D breathing rotation
        particleSystem.rotation.y = Math.sin(elapsedTime * 0.3) * 0.08;
        particleSystem.rotation.x = Math.cos(elapsedTime * 0.2) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 4. Strict Lifecycle Memory Disposal on Unmount
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      if (pointsGeometry) pointsGeometry.dispose();
      if (particleMaterial) particleMaterial.dispose();
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[500px] lg:h-[580px] flex items-center justify-center select-none overflow-hidden">
      {/* Three.js canvas container */}
      <div ref={containerRef} className="w-full h-full cursor-crosshair" />

      {/* Decorative Interactive Hint HUD */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-carbon-black-2/70 border border-white/10 rounded-full text-[10px] font-mono text-alabaster-grey/70 backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-ping" />
        <span>HOVER / DRAG CURSOR OVER LOGO TO DISSIPATE PARTICLES</span>
      </div>
    </div>
  );
}
