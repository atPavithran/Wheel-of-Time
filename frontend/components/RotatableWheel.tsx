"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const YEAR_STEP = 5; // More gradual year change
const ROTATION_SENSITIVITY = 0.4; // Slow down year changes

interface RotatableWheelProps {
  onYearChange: (delta: number) => void;
  onRotate: (isRotating: boolean, era?: string) => void;
}

const RotatableWheel: React.FC<RotatableWheelProps> = ({ onYearChange }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const accumulatedRotation = useRef(0);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const wheelRect = wheel.getBoundingClientRect();
      const wheelCenterX = wheelRect.left + wheelRect.width / 2;
      const wheelCenterY = wheelRect.top + wheelRect.height / 2;

      const currentAngle = Math.atan2(
        e.clientY - wheelCenterY,
        e.clientX - wheelCenterX
      );
      const previousAngle = Math.atan2(
        lastPosition.current.y - wheelCenterY,
        lastPosition.current.x - wheelCenterX
      );

      let angleDiff = (currentAngle - previousAngle) * (180 / Math.PI);
      setRotation((prev) => (prev + angleDiff) % 360);
      lastPosition.current = { x: e.clientX, y: e.clientY };

      accumulatedRotation.current += angleDiff * ROTATION_SENSITIVITY;
      if (Math.abs(accumulatedRotation.current) >= 5) {
        const direction = accumulatedRotation.current > 0 ? 1 : -1;
        onYearChange(YEAR_STEP * direction);
        accumulatedRotation.current = 0;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "";
      accumulatedRotation.current = 0;
    };

    wheel.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      wheel.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [rotation, onYearChange]);

  return (
    <div
      ref={wheelRef}
      className="relative cursor-grab active:cursor-grabbing"
      style={{ width: "170px", height: "170px", touchAction: "none" }}
    >
      <motion.div
        className="w-full h-full"
        style={{ transform: `rotate(${rotation}deg)` }}
        animate={{ rotate: rotation }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <Image
          src="/wheel.png"
          alt="Ship's Wheel"
          width={170}
          height={170}
          className="pointer-events-none"
          priority
        />
      </motion.div>
    </div>
  );
};

export default RotatableWheel;
