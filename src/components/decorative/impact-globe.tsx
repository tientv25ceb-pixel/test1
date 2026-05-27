'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function GlowCore() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.04
    mesh.current.scale.setScalar(s)
  })
  return (
    <Sphere ref={mesh} args={[0.8, 24, 24]}>
      <meshPhongMaterial
        color="#3b82f6"
        emissive="#60a5fa"
        emissiveIntensity={0.3}
        transparent
        opacity={0.3}
      />
    </Sphere>
  )
}

function WireframeSphere() {
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere args={[2, 36, 36]}>
        <meshPhongMaterial
          color="#3b82f6"
          transparent
          opacity={0.12}
          wireframe
        />
      </Sphere>
    </Float>
  )
}

function OrbitRing({ radius, angle, color, speed }: { radius: number; angle: number; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const ring = useMemo(() => {
    const g = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64)
    return g
  }, [radius])

  useFrame(({ clock }) => {
    ref.current.rotation.x = angle
    ref.current.rotation.z = clock.getElapsedTime() * (speed ?? 0.15)
  })

  return (
    <mesh ref={ref} geometry={ring} rotation={[angle, 0, 0]}>
      <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function OrbitRingDotted({ radius, angle, color, speed = 0.15 }: { radius: number; angle: number; color: string; speed?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const count = 80
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2
      pos[i * 3] = radius * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(theta)
      pos[i * 3 + 2] = 0
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [radius])

  useFrame(({ clock }) => {
    ref.current.rotation.x = angle
    ref.current.rotation.z = clock.getElapsedTime() * speed
  })

  return (
    <points ref={ref} geometry={geo} rotation={[angle, 0, 0]}>
      <pointsMaterial size={0.08} color={color} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function OrbitParticles({ count = 60 }) {
  const mesh = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const radii = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      radii[i] = 2.2 + Math.random() * 1.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = radii[i] * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radii[i] * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radii[i] * Math.cos(phi)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { g, radii }
  }, [count])

  const radii = geo.radii
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15
    const p = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = radii[i]
      const theta = t + (i / count) * Math.PI * 2
      const phi = Math.acos(2 * ((i / count + t * 0.02) % 1) - 1)
      p[i3] = r * Math.sin(phi) * Math.cos(theta)
      p[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      p[i3 + 2] = r * Math.cos(phi)
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh} geometry={geo.g}>
      <pointsMaterial size={0.07} color="#60a5fa" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function RisingDots({ count = 200 }) {
  const mesh = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = 1.6 * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = 1.6 * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = 1.6 * Math.cos(phi)
      speeds[i] = 0.008 + Math.random() * 0.025
      sizes[i] = 0.04 + Math.random() * 0.08
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return { g, speeds }
  }, [count])

  useFrame(() => {
    const p = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      p[i3 + 1] += geo.speeds[i]
      if (p[i3 + 1] > 4.5) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        p[i3] = 1.6 * Math.sin(phi) * Math.cos(theta)
        p[i3 + 1] = 1.6 * Math.sin(phi) * Math.sin(theta)
        p[i3 + 2] = 1.6 * Math.cos(phi)
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh} geometry={geo.g}>
      <pointsMaterial size={0.08} color="#34d399" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function Sparkles({ count = 50 }) {
  const mesh = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 2
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      p[i3] += Math.sin(t + i) * 0.002
      p[i3 + 1] += Math.cos(t + i * 0.5) * 0.002
      p[i3 + 2] += Math.sin(t + i * 0.3) * 0.002
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh} geometry={geo}>
      <pointsMaterial size={0.05} color="#fbbf24" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function PulseRing() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.3) % 1
    if (ref.current) {
      ref.current.scale.setScalar(1 + t * 2)
      const mat = ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, 1 - t)
    }
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.15, 32]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} depthWrite={false} />
    </mesh>
  )
}

function BackgroundStars({ count = 300 }) {
  const ref = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 30
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
    </points>
  )
}

export default function ImpactGlobe({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-[450px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#60a5fa" />
        <BackgroundStars />
        <GlowCore />
        <WireframeSphere />
        <OrbitRing radius={2.6} angle={0.3} color="#60a5fa" speed={0.1} />
        <OrbitRing radius={3} angle={1.2} color="#34d399" speed={-0.08} />
        <OrbitRingDotted radius={2.3} angle={0.8} color="#fbbf24" speed={0.12} />
        <OrbitParticles count={80} />
        <RisingDots count={250} />
        <Sparkles count={60} />
        <PulseRing />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}
