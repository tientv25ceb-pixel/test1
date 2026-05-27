'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function GiftBox({ open }: { open: boolean }) {
  const lidRef = useRef<THREE.Group>(null!)
  const bodyRef = useRef<THREE.Mesh>(null!)
  const [lidAngle, setLidAngle] = useState(0)

  useFrame((_, delta) => {
    if (!lidRef.current) return
    const target = open ? Math.PI * 0.6 : 0
    const speed = 6
    const current = lidRef.current.rotation.x
    const next = current + (target - current) * Math.min(1, delta * speed)
    lidRef.current.rotation.x = next
    if (open && bodyRef.current) {
      const s = 1 + (1 - Math.abs(next / (Math.PI * 0.6) - 1)) * 0.15
      bodyRef.current.scale.setScalar(s)
    }
  })

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setLidAngle(1), 100)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        {/* Body */}
        <mesh ref={bodyRef} position={[0, -0.5, 0]}>
          <boxGeometry args={[1.2, 1, 1.2]} />
          <meshPhongMaterial color="#3b82f6" />
        </mesh>
        {/* Lid */}
        <group ref={lidRef} position={[0, 0.5, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.3, 0.15, 1.3]} />
            <meshPhongMaterial color="#60a5fa" />
          </mesh>
        </group>
        {/* Ribbon horizontal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.21, 1.01, 0.08]} />
          <meshPhongMaterial color="#fbbf24" />
        </mesh>
        {/* Ribbon vertical */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 1.01, 1.21]} />
          <meshPhongMaterial color="#fbbf24" />
        </mesh>
        {/* Bow */}
        <mesh position={[0, 0.55, 0.65]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshPhongMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, 0.55, -0.65]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshPhongMaterial color="#f59e0b" />
        </mesh>
      </group>
    </Float>
  )
}

export default function GiftAnimation({
  show,
  onClose,
}: {
  show: boolean
  onClose: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [show, onClose])

  if (!visible && !show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${show && visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setVisible(false); setTimeout(onClose, 300) }} />
      <div className="relative w-[300px] h-[300px]">
        <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[4, 6, 4]} intensity={1} />
          <pointLight position={[-4, -2, -4]} intensity={0.3} color="#60a5fa" />
          <GiftBox open={show && visible} />
        </Canvas>
      </div>
      <div className="absolute bottom-[15%] text-center text-white font-bold text-lg drop-shadow-lg">
        🎉 Yêu cầu đã gửi!
      </div>
    </div>
  )
}
