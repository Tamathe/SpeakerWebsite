import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  anchorX: number;
  anchorY: number;
}

export function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = media.matches;
    let frame = 0;
    let points: Point[] = [];
    let pointer = { x: -1000, y: -1000 };

    const createPoints = () => {
      const count = Math.max(28, Math.min(58, Math.round(canvas.width / 30)));
      points = Array.from({ length: count }, (_, index) => {
        const column = index % 9;
        const row = Math.floor(index / 9);
        const x = ((column + 0.5) / 9) * canvas.width;
        const y = ((row + 0.7) / Math.ceil(count / 9)) * canvas.height;
        const offset = ((index * 47) % 31) - 15;
        return {
          x: x + offset,
          y: y - offset * 0.6,
          anchorX: x,
          anchorY: y,
          vx: ((index % 5) - 2) * 0.018,
          vy: (((index * 3) % 5) - 2) * 0.014,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      createPoints();
    };

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const maxDistance = Math.min(240, canvas.width * 0.15);

      points.forEach((point, index) => {
        if (!reduceMotion) {
          const distanceX = point.x - pointer.x;
          const distanceY = point.y - pointer.y;
          const pointerDistance = Math.hypot(distanceX, distanceY);
          if (pointerDistance < 180 && pointerDistance > 0) {
            point.x += (distanceX / pointerDistance) * 0.7;
            point.y += (distanceY / pointerDistance) * 0.7;
          }

          point.x += point.vx + (point.anchorX - point.x) * 0.0018;
          point.y += point.vy + (point.anchorY - point.y) * 0.0018;
        }

        for (let neighborIndex = index + 1; neighborIndex < points.length; neighborIndex += 1) {
          const neighbor = points[neighborIndex];
          if (!neighbor) continue;
          const distance = Math.hypot(point.x - neighbor.x, point.y - neighbor.y);
          if (distance > maxDistance) continue;

          const strength = 1 - distance / maxDistance;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.strokeStyle = `rgba(215, 255, 63, ${strength * 0.13})`;
          context.lineWidth = 1;
          context.stroke();
        }

        context.beginPath();
        context.arc(point.x, point.y, index % 11 === 0 ? 2.8 : 1.2, 0, Math.PI * 2);
        context.fillStyle =
          index % 11 === 0 ? "rgba(51, 214, 255, .9)" : "rgba(247, 248, 243, .34)";
        context.fill();
      });

      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ratioX = canvas.width / Math.max(rect.width, 1);
      const ratioY = canvas.height / Math.max(rect.height, 1);
      pointer = {
        x: (event.clientX - rect.left) * ratioX,
        y: (event.clientY - rect.top) * ratioY,
      };
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      window.cancelAnimationFrame(frame);
      draw();
    };

    const observer = new ResizeObserver(() => {
      resize();
      window.cancelAnimationFrame(frame);
      draw();
    });

    observer.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    media.addEventListener("change", onMotionChange);
    resize();
    draw();

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      media.removeEventListener("change", onMotionChange);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas className="signal-canvas" ref={canvasRef} aria-hidden="true" />;
}
