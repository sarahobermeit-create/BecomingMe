const IMAGE_ASPECT = 1792 / 1024;

interface RainDrop {
  u: number;
  v: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  isWindowDrip: boolean;
}

interface Ember {
  xOffset: number;
  yProgress: number;
  size: number;
  speed: number;
  swayFreq: number;
  swayOffset: number;
  color: string;
}

const emberColors = ["#ffba08", "#f48c06", "#dc2f02", "#ffdd00", "#e85d04"];

export function createRainDrops(count = 75): RainDrop[] {
  const drops: RainDrop[] = [];
  for (let i = 0; i < count; i++) {
    drops.push({
      u: Math.random(),
      v: Math.random(),
      length: 8 + Math.random() * 16,
      speed: 0.007 + Math.random() * 0.014,
      opacity: 0.35 + Math.random() * 0.5,
      width: 1 + Math.random() * 1.5,
      isWindowDrip: Math.random() < 0.45,
    });
  }
  return drops;
}

export function createEmbers(count = 30): Ember[] {
  const embers: Ember[] = [];
  for (let i = 0; i < count; i++) {
    const col = emberColors[Math.floor(Math.random() * emberColors.length)] ?? "#ffba08";
    embers.push({
      xOffset: (Math.random() - 0.5) * 0.07,
      yProgress: Math.random(),
      size: 1.2 + Math.random() * 2.2,
      speed: 0.008 + Math.random() * 0.016,
      swayFreq: 3 + Math.random() * 4,
      swayOffset: Math.random() * Math.PI * 2,
      color: col,
    });
  }
  return embers;
}

export function getImageBounds(width: number, height: number) {
  const screenAspect = width / height;
  if (screenAspect > IMAGE_ASPECT) {
    const imgHeight = width / IMAGE_ASPECT;
    return { imgWidth: width, imgHeight, imgX: 0, imgY: (height - imgHeight) / 2 };
  }
  const imgWidth = height * IMAGE_ASPECT;
  return { imgWidth, imgHeight: height, imgX: (width - imgWidth) / 2, imgY: 0 };
}

export function drawRain(ctx: CanvasRenderingContext2D, drops: RainDrop[], bounds: ReturnType<typeof getImageBounds>) {
  const { imgWidth, imgHeight, imgX, imgY } = bounds;
  const winX1 = imgX + 0.412 * imgWidth;
  const winX2 = imgX + 0.588 * imgWidth;
  const winY1 = imgY + 0.082 * imgHeight;
  const winY2 = imgY + 0.622 * imgHeight;
  const winW = winX2 - winX1;
  const winH = winY2 - winY1;

  ctx.save();
  ctx.beginPath();
  const archTopY = winY1;
  const archShoulderY = winY1 + winH * 0.32;
  ctx.moveTo(winX1, winY2);
  ctx.lineTo(winX1, archShoulderY);
  ctx.quadraticCurveTo(winX1, archTopY, winX1 + winW * 0.5, archTopY);
  ctx.quadraticCurveTo(winX2, archTopY, winX2, archShoulderY);
  ctx.lineTo(winX2, winY2);
  ctx.closePath();
  ctx.clip();

  for (const drop of drops) {
    const dropX = winX1 + drop.u * winW;
    const dropY = winY1 + drop.v * winH;
    if (drop.isWindowDrip) {
      ctx.beginPath();
      ctx.arc(dropX, dropY, drop.width * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215, 240, 255, ${drop.opacity * 0.85})`;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(dropX, dropY - drop.length * 0.8);
      ctx.lineTo(dropX, dropY);
      ctx.strokeStyle = `rgba(195, 230, 255, ${drop.opacity * 0.45})`;
      ctx.lineWidth = drop.width * 0.85;
      ctx.stroke();
      drop.v += drop.speed * 0.35;
    } else {
      ctx.beginPath();
      ctx.moveTo(dropX, dropY);
      ctx.lineTo(dropX - 1.5, dropY + drop.length);
      ctx.strokeStyle = `rgba(205, 235, 255, ${drop.opacity * 0.75})`;
      ctx.lineWidth = drop.width;
      ctx.stroke();
      drop.v += drop.speed;
      drop.u -= 0.0006;
    }
    if (drop.v > 1) {
      drop.v = 0;
      drop.u = Math.random();
    }
    if (drop.u < 0) drop.u = 1;
  }
  ctx.restore();
}

export function drawEmbers(
  ctx: CanvasRenderingContext2D,
  embers: Ember[],
  bounds: ReturnType<typeof getImageBounds>,
  flickerTimer: number,
) {
  const { imgWidth, imgHeight, imgX, imgY } = bounds;
  const fireCenterX = imgX + 0.907 * imgWidth;
  const fireGrateY = imgY + 0.795 * imgHeight;
  const fireFlueTopY = imgY + 0.62 * imgHeight;

  const flameFlicker = Math.sin(flickerTimer * 4.2) * 12 + Math.cos(flickerTimer * 8.7) * 8;
  const glowRadius = Math.max(90, 0.16 * imgWidth + flameFlicker);

  const flameGlow = ctx.createRadialGradient(fireCenterX, fireGrateY - 15, 10, fireCenterX, fireGrateY - 15, glowRadius);
  flameGlow.addColorStop(0, "rgba(255, 185, 45, 0.55)");
  flameGlow.addColorStop(0.3, "rgba(245, 110, 20, 0.35)");
  flameGlow.addColorStop(0.65, "rgba(190, 45, 10, 0.15)");
  flameGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.save();
  ctx.fillStyle = flameGlow;
  ctx.beginPath();
  ctx.arc(fireCenterX, fireGrateY - 15, glowRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  for (const ember of embers) {
    ember.yProgress += ember.speed;
    const curY = fireGrateY - ember.yProgress * (fireGrateY - fireFlueTopY);
    const sway = Math.sin(flickerTimer * ember.swayFreq + ember.swayOffset) * (0.015 * imgWidth);
    const curX = fireCenterX + ember.xOffset * imgWidth + sway;
    const progress = ember.yProgress;
    const alpha = progress < 0.15 ? (progress / 0.15) * 0.95 : Math.max(0, (1 - progress) * 0.95);

    ctx.save();
    ctx.beginPath();
    ctx.arc(curX, curY, ember.size * (1 - progress * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = ember.color;
    ctx.shadowColor = ember.color;
    ctx.shadowBlur = 6;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();

    if (ember.yProgress >= 1) {
      ember.yProgress = 0;
      ember.xOffset = (Math.random() - 0.5) * 0.06;
      ember.speed = 0.008 + Math.random() * 0.016;
    }
  }
}
