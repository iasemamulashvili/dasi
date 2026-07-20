'use client';

import { useEffect, useRef } from 'react';

export default function Concept2FluidSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isMounted = true;
    let animId: number;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 550;
    canvas.width = width;
    canvas.height = height;

    // Load Dasi Logo onto offscreen canvas for crisp vector source
    const logoCanvas = document.createElement('canvas');
    const logoCtx = logoCanvas.getContext('2d');
    const logoSize = Math.min(width * 0.45, 260);
    logoCanvas.width = logoSize;
    logoCanvas.height = logoSize;

    // Fluid Velocity Grid Parameters
    const gridScale = 8; // Grid resolution divisor
    const cols = Math.floor(width / gridScale);
    const rows = Math.floor(height / gridScale);

    // Velocity X, Velocity Y, and Density arrays
    const vx = new Float32Array(cols * rows);
    const vy = new Float32Array(cols * rows);
    const density = new Float32Array(cols * rows);

    // Mouse Tracking
    let prevMouseX = -999;
    let prevMouseY = -999;
    let isHovering = false;

    const img = new Image();
    img.src = '/Images/dasigames_logo.png';
    img.onload = () => {
      if (!logoCtx) return;
      logoCtx.drawImage(img, 0, 0, logoSize, logoSize);
    };

    // Add velocity impulse when mouse moves
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (prevMouseX > 0 && prevMouseY > 0) {
        const dx = x - prevMouseX;
        const dy = y - prevMouseY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 1) {
          // Inject velocity into local grid cells around cursor
          const gx = Math.floor(x / gridScale);
          const gy = Math.floor(y / gridScale);
          const radius = 5;

          for (let ry = -radius; ry <= radius; ry++) {
            for (let rx = -radius; rx <= radius; rx++) {
              const cx = gx + rx;
              const cy = gy + ry;
              if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
                const distSq = rx * rx + ry * ry;
                if (distSq < radius * radius) {
                  const factor = (1 - Math.sqrt(distSq) / radius);
                  const idx = cy * cols + cx;
                  vx[idx] += dx * factor * 0.4;
                  vy[idx] += dy * factor * 0.4;
                  density[idx] = Math.min(1.0, density[idx] + factor * 0.6);
                }
              }
            }
          }
        }
      }

      prevMouseX = x;
      prevMouseY = y;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      prevMouseX = -999;
      prevMouseY = -999;
      isHovering = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Main Fluid Simulation & Smoke Dissolve Render Loop
    const render = () => {
      if (!isMounted) return;
      animId = requestAnimationFrame(render);

      // Clear frame with deep carbon black background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw base crisp logo at center
      const logoX = (width - logoSize) / 2;
      const logoY = (height - logoSize) / 2;

      ctx.save();
      ctx.shadowColor = 'rgba(168,85,247,0.3)';
      ctx.shadowBlur = 25;
      ctx.drawImage(logoCanvas, logoX, logoY);
      ctx.restore();

      // 2. Compute Fluid Velocity Decay and Advection
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const idx = y * cols + x;

          // Velocity Decay & Friction
          vx[idx] *= 0.94;
          vy[idx] *= 0.94;
          density[idx] *= 0.92;

          // Velocity turbulence distortion
          const velX = vx[idx];
          const velY = vy[idx];
          const velMag = Math.sqrt(velX * velX + velY * velY);

          if (velMag > 0.1) {
            const px = x * gridScale;
            const py = y * gridScale;

            // Render organic smoke vapor trails where velocity is active
            const alpha = Math.min(0.75, velMag * 0.05 + density[idx] * 0.4);
            const radius = gridScale * (1.2 + velMag * 0.15);

            const grad = ctx.createRadialGradient(
              px + velX * 0.5, py + velY * 0.5, 0,
              px, py, radius
            );
            grad.addColorStop(0, `rgba(226, 232, 240, ${alpha})`);
            grad.addColorStop(0.4, `rgba(168, 85, 247, ${alpha * 0.6})`);
            grad.addColorStop(1, 'rgba(9, 9, 11, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 3. Render Cursor Fluid Ripple HUD
      if (isHovering && prevMouseX > 0 && prevMouseY > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(prevMouseX, prevMouseY, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    render();

    // Lifecycle Memory Disposal
    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[350px] md:h-[500px] lg:h-[580px] flex items-center justify-center select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

      {/* Decorative HUD Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-carbon-black-2/70 border border-white/10 rounded-full text-[10px] font-mono text-alabaster-grey/70 backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span>SWIPE / DRAG CURSOR TO INJECT FLUID VELOCITY & SMOKE DISSOLVE</span>
      </div>
    </div>
  );
}
