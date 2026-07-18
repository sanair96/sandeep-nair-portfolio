'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'

import { SpacejoyRoomBuild } from './spacejoy-room-build.client'

export { clearSpacejoyModelCache } from './spacejoy-room-build.client'

type ViewerProps = {
  immediatePerspective: boolean
  onError: () => void
  onReady: () => void
  onSequenceComplete: () => void
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

export default function SpacejoyViewer({
  immediatePerspective,
  onError,
  onReady,
  onSequenceComplete,
  paused,
  perspective,
}: ViewerProps) {
  const [sequenceComplete, setSequenceComplete] = useState(false)

  function handleSequenceComplete() {
    setSequenceComplete(true)
    onSequenceComplete()
  }

  return (
    <Canvas
      camera={{ far: 100, fov: 33, near: 0.1, position: [5.6, 3.3, 6.2] }}
      dpr={[1, 1.5]}
      frameloop={paused ? 'never' : sequenceComplete ? 'demand' : 'always'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
    >
      <color args={['#ede9df']} attach="background" />
      <hemisphereLight args={['#fff7e8', '#53685f', 1.15]} />
      <ambientLight intensity={0.55} />
      <directionalLight castShadow intensity={2.4} position={[4.5, 6, 5]} shadow-bias={-0.0004} />
      <pointLight color="#ffd7a1" distance={5} intensity={8} position={[-2, 1.75, 0.5]} />
      <Suspense fallback={null}>
        <SpacejoyRoomBuild
          immediatePerspective={immediatePerspective}
          onReady={onReady}
          onSequenceComplete={handleSequenceComplete}
          perspective={perspective}
        />
      </Suspense>
      <OrbitControls
        enableDamping={!paused && sequenceComplete}
        enablePan={false}
        enabled={!paused && sequenceComplete}
        maxAzimuthAngle={Math.PI / 2.8}
        maxDistance={17}
        maxPolarAngle={Math.PI / 2.15}
        minAzimuthAngle={-Math.PI / 3}
        minDistance={5}
        minPolarAngle={Math.PI / 4.3}
        target={[0, -0.08, -0.05]}
      />
      <ContextObserver onError={onError} />
    </Canvas>
  )
}
