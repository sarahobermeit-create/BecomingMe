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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Raindrop particles (streaks & window drips)
    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
      isWindowDrip: boolean;
      dripTrail: number;
    }

    const rainDropCount = Math.min(100, Math.floor(width / 15));
    const rainDrops: RainDrop[] = [];

    for (let i = 0; i < rainDropCount; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 15 + Math.random() * 25,
        speed: 12 + Math.random() * 14,
        opacity: 0.2 + Math.random() * 0.45,
        width: 1 + Math.random() * 1.5,
        isWindowDrip: Math.random() < 0.25, // 25% are slow drips trailing down the window pane
        dripTrail: 0,
      });
    }

    // 2. Fire embers (rising from the hearth)
    interface Ember {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      life: number;
      maxLife: number;
      color: string;
    }

    const emberCount = 35;
    const embers: Ember[] = [];

    // Hearth location estimate: lower center/right where fireplaces are typically placed
    const getHearthOrigin = () => ({
      x: width * 0.72 + (Math.random() * 90 - 45),
      y: height * 0.88 + (Math.random() * 30 - 15),
    });

    for (let i = 0; i < emberCount; i++) {
      const origin = getHearthOrigin();
      const maxLife = 70 + Math.random() * 80;
      const colors = ['#ffba08', '#f48c06', '#dc2f02', '#e85d04', '#ffdd00'];
      embers.push({
        x: origin.x,
        y: origin.y,
        size: 1.5 + Math.random() * 2.5,
        speedY: -(1.2 + Math.random() * 2.2),
        speedX: (Math.random() - 0.5) * 1.2,
        opacity: Math.random(),
        life: Math.random() * maxLife,
        maxLife,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Fire flickering light tracker
    let flickerTimer = 0;
    let baseGlowRadius = 240;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      flickerTimer += 0.05;

      // 1. Draw Active Rain Streaming Down the Windows
      ctx.strokeStyle = 'rgba(180, 220, 240, 0.4)';
      ctx.fillStyle = 'rgba(180, 220, 240, 0.4)';

      for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];

        if (drop.isWindowDrip) {
          // Slow droplet sliding down the glass pane
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.width * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 235, 255, ${drop.opacity * 0.8})`;
          ctx.fill();

          // Droplet wet streak trail
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y - drop.length * 0.6);
          ctx.lineTo(drop.x, drop.y);
          ctx.strokeStyle = `rgba(180, 220, 255, ${drop.opacity * 0.35})`;
          ctx.lineWidth = drop.width * 0.9;
          ctx.stroke();

          drop.y += drop.speed * 0.35; // Slower window drip slide
        } else {
          // Fast diagonal heavy pouring rain
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.strokeStyle = `rgba(190, 225, 250, ${drop.opacity})`;
          ctx.lineWidth = drop.width;
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 1.2; // Slight wind slant
        }

        // Reset if past screen bottom
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
        if (drop.x < 0) {
          drop.x = width;
        }
      }

      // 2. Fireplace Hearth Burning Glow (Pulsing warm light on bookshelves & room)
      const hearthX = width * 0.72;
      const hearthY = height * 0.88;

      // Subtle organic fire light flicker
      const flicker =
        Math.sin(flickerTimer * 3.5) * 18 +
        Math.cos(flickerTimer * 7.2) * 12 +
        (Math.random() - 0.5) * 8;
      const currentRadius = Math.max(160, baseGlowRadius + flicker);

      const fireGlow = ctx.createRadialGradient(
        hearthX,
        hearthY,
        15,
        hearthX,
        hearthY,
        currentRadius
      );
      fireGlow.addColorStop(0, 'rgba(255, 170, 40, 0.35)'); // Hot amber core
      fireGlow.addColorStop(0.35, 'rgba(240, 110, 20, 0.22)'); // Warm orange flame
      fireGlow.addColorStop(0.7, 'rgba(180, 50, 10, 0.1)'); // Crimson outer glow
      fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = fireGlow;
      ctx.beginPath();
      ctx.arc(hearthX, hearthY, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Fire Sparks & Floating Embers rising from the flame
      for (let i = 0; i < embers.length; i++) {
        const ember = embers[i];
        ember.life++;

        // Upward floating motion with gentle air sway
        ember.y += ember.speedY;
        ember.x += ember.speedX + Math.sin((ember.life + i) * 0.08) * 0.6;

        // Fade in and then fade out as they cool
        const progress = ember.life / ember.maxLife;
        const currentOpacity =
          progress < 0.2
            ? (progress / 0.2) * 0.9
            : (1 - progress) * 0.9;

        ctx.save();
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = ember.color;
        ctx.shadowColor = ember.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0, currentOpacity);
        ctx.fill();
        ctx.restore();

        // Respawn ember at fireplace
        if (ember.life >= ember.maxLife || ember.y < 0) {
          const origin = getHearthOrigin();
          ember.x = origin.x;
          ember.y = origin.y;
          ember.life = 0;
          ember.maxLife = 60 + Math.random() * 80;
          ember.speedY = -(1.2 + Math.random() * 2.2);
          ember.speedX = (Math.random() - 0.5) * 1.2;
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
