"use client";
import { useEffect, useRef } from "react";

export default function Pointer() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);

  // Lưu vị trí mục tiêu (con trỏ)
  const targetPos = useRef<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });

  // Vị trí hiện tại của circle (có độ trễ)
  const circlePos = useRef<{ x: number; y: number }>({
    x: targetPos.current.x,
    y: targetPos.current.y,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const animateCircle = () => {
      const dx = targetPos.current.x - circlePos.current.x;
      const dy = targetPos.current.y - circlePos.current.y;

      const ease = 0.1;

      circlePos.current.x += dx * ease;
      circlePos.current.y += dy * ease;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${circlePos.current.x}px, ${circlePos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateCircle);
    };

    animateCircle();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Vòng tròn lớn có độ trễ */}
      <div
        ref={circleRef}
        className="pointer-events-none fixed z-40 -mx-[15px] -mt-[15px] h-[40px] w-[40px] rounded-lg border-2 border-blue-500 opacity-70"
      />
      {/* Dot nhỏ luôn chính giữa vòng tròn */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-50 h-[10px] w-[10px] rounded-full bg-blue-500"
      />
    </>
  );
}
