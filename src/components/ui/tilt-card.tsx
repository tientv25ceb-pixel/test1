'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glowColor?: string;
}

export default function TiltCard({ 
  children, 
  className = '', 
  tiltAmount = 10,
  glowColor = 'rgba(59, 130, 246, 0.15)'
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltAmount, tiltAmount]), springConfig);

  const shineX = useTransform(mouseX, [0, 1], [0, 100]);
  const shineY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div className="card-3d-wrapper" style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        className={`card-3d ${className}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ scale: { type: 'spring', stiffness: 400, damping: 25 } }}
      >
        {children}

        {/* Shine overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: useTransform(
              [shineX, shineY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`
            ),
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ opacity: { duration: 0.3 } }}
        />

        {/* Glow shadow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
          animate={{
            boxShadow: isHovered
              ? `0 20px 60px ${glowColor}, 0 0 0 1px rgba(59, 130, 246, 0.1)`
              : '0 1px 3px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
}
