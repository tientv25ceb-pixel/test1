'use client';

import { motion } from 'framer-motion';

interface Shape {
  type: 'cube' | 'ring' | 'sphere' | 'pyramid';
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
}

const SHAPES: Shape[] = [
  { type: 'cube', size: 35, x: '8%', y: '15%', color: 'hsl(221 83% 53% / VAR)', duration: 22, delay: 0, opacity: 0.12 },
  { type: 'ring', size: 50, x: '85%', y: '20%', color: 'hsl(199 89% 48% / VAR)', duration: 18, delay: -4, opacity: 0.1 },
  { type: 'sphere', size: 25, x: '15%', y: '70%', color: 'hsl(270 80% 60% / VAR)', duration: 25, delay: -8, opacity: 0.15 },
  { type: 'pyramid', size: 30, x: '75%', y: '65%', color: 'hsl(142 76% 36% / VAR)', duration: 20, delay: -2, opacity: 0.1 },
  { type: 'cube', size: 20, x: '50%', y: '10%', color: 'hsl(199 89% 48% / VAR)', duration: 30, delay: -12, opacity: 0.08 },
  { type: 'ring', size: 35, x: '92%', y: '55%', color: 'hsl(221 83% 53% / VAR)', duration: 24, delay: -6, opacity: 0.1 },
  { type: 'sphere', size: 18, x: '40%', y: '80%', color: 'hsl(38 92% 50% / VAR)', duration: 28, delay: -10, opacity: 0.12 },
  { type: 'pyramid', size: 22, x: '25%', y: '35%', color: 'hsl(350 80% 55% / VAR)', duration: 26, delay: -15, opacity: 0.08 },
];

function Cube({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const borderColor = color.replace('VAR', String(opacity));
  const bgColor = color.replace('VAR', String(opacity * 0.3));
  const half = size / 2;
  return (
    <div
      className="shape-cube"
      style={{ width: size, height: size }}
    >
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={`y-${deg}`}
          className="face"
          style={{
            width: size,
            height: size,
            borderColor: borderColor,
            backgroundColor: bgColor,
            transform: `rotateY(${deg}deg) translateZ(${half}px)`,
            position: 'absolute',
            borderRadius: size * 0.15,
            borderWidth: '1.5px',
            borderStyle: 'solid',
          }}
        />
      ))}
      {[90, -90].map((deg) => (
        <div
          key={`x-${deg}`}
          className="face"
          style={{
            width: size,
            height: size,
            borderColor: borderColor,
            backgroundColor: bgColor,
            transform: `rotateX(${deg}deg) translateZ(${half}px)`,
            position: 'absolute',
            borderRadius: size * 0.15,
            borderWidth: '1.5px',
            borderStyle: 'solid',
          }}
        />
      ))}
    </div>
  );
}

function Ring({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const borderColor = color.replace('VAR', String(opacity));
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${borderColor}`,
        borderRadius: '50%',
        boxShadow: `0 0 ${size * 0.4}px ${color.replace('VAR', String(opacity * 0.5))}`,
      }}
    />
  );
}

function Sphere({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const bgColor = color.replace('VAR', String(opacity * 0.5));
  const glowColor = color.replace('VAR', String(opacity));
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${color.replace('VAR', String(opacity * 0.8))}, ${bgColor})`,
        boxShadow: `0 0 ${size * 0.6}px ${glowColor}`,
      }}
    />
  );
}

function Pyramid({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  const borderColor = color.replace('VAR', String(opacity));
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${borderColor}`,
        filter: `drop-shadow(0 0 ${size * 0.3}px ${color.replace('VAR', String(opacity * 0.6))})`,
      }}
    />
  );
}

const shapeComponents = {
  cube: Cube,
  ring: Ring,
  sphere: Sphere,
  pyramid: Pyramid,
};

export default function FloatingShapes({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {SHAPES.map((shape, idx) => {
        const ShapeComponent = shapeComponents[shape.type];
        return (
          <motion.div
            key={idx}
            className="shape-3d"
            style={{
              left: shape.x,
              top: shape.y,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              y: [0, -20, -8, -25, 0],
              rotateX: [0, 180, 360],
              rotateY: [0, 90, 180, 270, 360],
              rotateZ: [0, 45, 0, -45, 0],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <ShapeComponent
              size={shape.size}
              color={shape.color}
              opacity={shape.opacity}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
