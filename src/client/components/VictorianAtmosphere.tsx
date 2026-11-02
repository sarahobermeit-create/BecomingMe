import { useEffect, useRef } from "react";
import {
  createEmbers,
  createRainDrops,
  drawEmbers,
  drawRain,
  getImageBounds,
} from "#client/components/victorianAtmosphere.helper.ts";

export function VictorianAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const rainDrops = createRainDrops(75);
    const embers = createEmbers(30);
    let flickerTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      flickerTimer += 0.06;
      const bounds = getImageBounds(width, height);
      drawRain(ctx, rainDrops, bounds);
      drawEmbers(ctx, embers, bounds, flickerTimer);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
