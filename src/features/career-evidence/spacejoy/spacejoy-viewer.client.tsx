'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo } from 'react'

type ViewerProps = {
  onError: () => void
  onReady: () => void
  paused: boolean
  perspective: number
}

function ContextObserver({ onError }: { onError: () => void }) {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    const handleLoss = (event: Event) => {
      event.preventDefault()
      onError()
    }
    canvas.addEventListener('webglcontextlost', handleLoss)
    return () => canvas.removeEventListener('webglcontextlost', handleLoss)
  }, [gl, onError])

  return null
}

function RoomModel({ onReady, perspective }: { onReady: () => void; perspective: number }) {
  const { scene } = useGLTF('/models/spacejoy-showcase.glb')
  const model = useMemo(() => scene.clone(), [scene])
  const rotations = [0.16, -0.18, 0.34]

  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <Center>
      <primitive object={model} rotation={[0, rotations[perspective] ?? 0, 0]} scale={1.35} />
    </Center>
  )
}

export default function SpacejoyViewer({ onError, onReady, paused, perspective }: ViewerProps) {
  return (
    <Canvas
      camera={{ fov: 38, position: [3.5, 2.8, 4.8] }}
      dpr={[1, 1.5]}
      frameloop={paused ? 'never' : 'always'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color args={['#f1f3ef']} attach="background" />
      <ambientLight intensity={1.5} />
      <directionalLight intensity={2.2} position={[4, 6, 3]} />
      <Suspense fallback={null}>
        <RoomModel onReady={onReady} perspective={perspective} />
        <ContactShadows blur={2.5} far={4} opacity={0.28} position={[0, -1.1, 0]} scale={7} />
      </Suspense>
      <OrbitControls
        autoRotate={!paused}
        autoRotateSpeed={0.35}
        enableDamping={!paused}
        enablePan={false}
        enabled={!paused}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2.5}
      />
      <ContextObserver onError={onError} />
    </Canvas>
  )
}

useGLTF.preload('/models/spacejoy-showcase.glb')
