"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
  speed?: number;
  fontSize?: number;
}

export const MatrixRain = ({
  className,
  opacity = 0.15,
  speed = 50,
  fontSize = 14,
}: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / (fontSize + 4));
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコ><{}[]|\\/#@$%WraithCyber";

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff8844";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * (fontSize + 4), y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    }, speed);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [speed, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className
      )}
      style={{ opacity }}
    />
  );
};