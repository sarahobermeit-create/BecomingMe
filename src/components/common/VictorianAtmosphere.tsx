import React, { useEffect, useRef } from 'react';

export const VictorianAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Natural aspect ratio of the 1792x1024 wallpaper
    const IMAGE_ASPECT = 1792 / 1024;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Helper to get image rendering dimensions under `background-size: cover; background-position: center;`
    const getImageBounds = () => {
      const screenAspect = width / height;
      let imgWidth: number;
      let imgHeight: number;
      let imgX: number;
      let imgY: number;

      if (screenAspect > IMAGE_ASPECT) {
        imgWidth = width;
        imgHeight = width / IMAGE_ASPECT;
        imgX = 0;
        imgY = (height - imgHeight) / 2;
      } else {
        imgHeight = height;
        imgWidth = height * IMAGE_ASPECT;
        imgX = (width - imgWidth) / 2;
        imgY = 0;
      }

      return { imgWidth, imgHeight, imgX, imgY };
    };

    // 1. Raindrop particles restricted to window area
    interface RainDrop {
      u: number; // 0..1 relative to window width
      v: number; // 0..1 relative to window height
      length: number;
      speed: number;
      opacity: number;
      width: number;
      isWindowDrip: boolean;
    }

    const rainDropCount = 75;
    const rainDrops: RainDrop[] = [];

    for (let i = 0; i < rainDropCount; i++) {
      rainDrops.push({
        u: Math.random(),
        v: Math.random(),
        length: 8 + Math.random() * 16,
        speed: 0.007 + Math.random() * 0.014,
        opacity: 0.35 + Math.random() * 0.5,
        width: 1 + Math.random() * 1.5,
        isWindowDrip: Math.random() < 0.45, // 45% are beads of water dripping down window panes
      });
    }

    // 2. Fire embers and sparks originating from the stone fireplace hearth (far right)
    interface Ember {
      xOffset: number; // -1..1 from fire center
      yProgress: number; // 0 (grate) to 1 (flue top)
      size: number;
      speed: number;
      swayFreq: number;
      swayOffset: number;
      opacity: number;
      color: string;
    }

    const emberCount = 30;
    const embers: Ember[] = [];
    const emberColors = ['#ffba08', '#f48c06', '#dc2f02', '#ffdd00', '#e85d04'];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        xOffset: (Math.random() - 0.5) * 0.07,
        yProgress: Math.random(),
        size: 1.2 + Math.random() * 2.2,
        speed: 0.008 + Math.random() * 0.016,
        swayFreq: 3 + Math.random() * 4,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random(),
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
      });
    }

    let flickerTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      flickerTimer += 0.06;

      const { imgWidth, imgHeight, imgX, imgY } = getImageBounds();

      // ==========================================
      // A. ACTIVE RAIN ON THE GOTHIC WINDOW ONLY
      // ==========================================
      // Normalized coordinates of the window frame in the 1792x1024 image
      const winX1 = imgX + 0.412 * imgWidth;
      const winX2 = imgX + 0.588 * imgWidth;
      const winY1 = imgY + 0.082 * imgHeight;
      const winY2 = imgY + 0.622 * imgHeight;
      const winW = winX2 - winX1;
      const winH = winY2 - winY1;

      // Only render window rain if window is visible on screen
      if (winX2 > 0 && winX1 < width && winY2 > 0 && winY1 < height) {
        ctx.save();

        // Clip to the arched gothic window shape so rain doesn't touch the drapes or walls
        ctx.beginPath();
        const archTopY = winY1;
        const archShoulderY = winY1 + winH * 0.32;

        ctx.moveTo(winX1, winY2);
        ctx.lineTo(winX1, archShoulderY);
        // Gothic pointed arch curve
        ctx.quadraticCurveTo(winX1, archTopY, winX1 + winW * 0.5, archTopY);
        ctx.quadraticCurveTo(winX2, archTopY, winX2, archShoulderY);
        ctx.lineTo(winX2, winY2);
        ctx.closePath();
        ctx.clip();

        // Draw animated rain inside the window glass
        for (let i = 0; i < rainDrops.length; i++) {
          const drop = rainDrops[i];

          const dropX = winX1 + drop.u * winW;
          const dropY = winY1 + drop.v * winH;

          if (drop.isWindowDrip) {
            // Water droplet sliding down the glass surface
            ctx.beginPath();
            ctx.arc(dropX, dropY, drop.width * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(215, 240, 255, ${drop.opacity * 0.85})`;
            ctx.fill();

            // Glass wet condensation streak trail
            ctx.beginPath();
            ctx.moveTo(dropX, dropY - drop.length * 0.8);
            ctx.lineTo(dropX, dropY);
            ctx.strokeStyle = `rgba(195, 230, 255, ${drop.opacity * 0.45})`;
            ctx.lineWidth = drop.width * 0.85;
            ctx.stroke();

            drop.v += drop.speed * 0.35; // Slow trickle
          } else {
            // Heavy diagonal rain streak against the glass
            ctx.beginPath();
            ctx.moveTo(dropX, dropY);
            ctx.lineTo(dropX - 1.5, dropY + drop.length);
            ctx.strokeStyle = `rgba(205, 235, 255, ${drop.opacity * 0.75})`;
            ctx.lineWidth = drop.width;
            ctx.stroke();

            drop.v += drop.speed;
            drop.u -= 0.0006; // Wind drift
          }

          // Loop droplet when it hits bottom of window sill
          if (drop.v > 1) {
            drop.v = 0;
            drop.u = Math.random();
          }
          if (drop.u < 0) {
            drop.u = 1;
          }
        }

        ctx.restore();
      }

      // ==========================================
      // B. ACTIVE FIREPLACE (HEARTH ONLY, FAR RIGHT)
      // ==========================================
      // The fireplace hearth opening is at normalized X: 0.905, Y: 0.76
      // (The green chair is at X: 0.68, safely away to the left!)
      const fireCenterX = imgX + 0.907 * imgWidth;
      const fireGrateY = imgY + 0.795 * imgHeight;
      const fireFlueTopY = imgY + 0.62 * imgHeight;
      const hearthW = 0.14 * imgWidth;

      // Only render if fireplace is visible on screen
      if (fireCenterX > -100 && fireCenterX < width + 100) {
        // 1. Organic dancing flame glow inside the stone arch
        const flameFlicker =
          Math.sin(flickerTimer * 4.2) * 12 +
          Math.cos(flickerTimer * 8.7) * 8 +
          (Math.random() - 0.5) * 6;
        const glowRadius = Math.max(90, 0.16 * imgWidth + flameFlicker);

        const flameGlow = ctx.createRadialGradient(
          fireCenterX,
          fireGrateY - 15,
          10,
          fireCenterX,
          fireGrateY - 15,
          glowRadius
        );
        flameGlow.addColorStop(0, 'rgba(255, 185, 45, 0.55)'); // Bright golden flame core
        flameGlow.addColorStop(0.3, 'rgba(245, 110, 20, 0.35)'); // Orange flame body
        flameGlow.addColorStop(0.65, 'rgba(190, 45, 10, 0.15)'); // Warm fireplace ember wash
        flameGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.fillStyle = flameGlow;
        ctx.beginPath();
        ctx.arc(fireCenterX, fireGrateY - 15, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Rising hot embers swirling inside the stone hearth and up the chimney flue
        for (let i = 0; i < embers.length; i++) {
          const ember = embers[i];
          ember.yProgress += ember.speed;

          // Rising Y from grate towards flue
          const curY = fireGrateY - ember.yProgress * (fireGrateY - fireFlueTopY);
          // Slight horizontal heat turbulence
          const sway = Math.sin(flickerTimer * ember.swayFreq + ember.swayOffset) * (0.015 * imgWidth);
          const curX = fireCenterX + ember.xOffset * imgWidth + sway;

          // Fade out as embers rise and cool
          const progress = ember.yProgress;
          const alpha =
            progress < 0.15
              ? (progress / 0.15) * 0.95
              : Math.max(0, (1 - progress) * 0.95);

          ctx.save();
          ctx.beginPath();
          ctx.arc(curX, curY, ember.size * (1 - progress * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = ember.color;
          ctx.shadowColor = ember.color;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.restore();

          // Reset ember back to the burning logs
          if (ember.yProgress >= 1) {
            ember.yProgress = 0;
            ember.xOffset = (Math.random() - 0.5) * 0.06;
            ember.speed = 0.008 + Math.random() * 0.016;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
