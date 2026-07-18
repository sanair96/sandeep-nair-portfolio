'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Group, MathUtils, Mesh, Object3D, Vector3 } from 'three'

type Props = {
  immediatePerspective: boolean
  onReady: () => void
  onSequenceComplete: () => void
  perspective: number
}

type BuildStage = {
  camera: readonly [number, number, number]
  id: string
  target: readonly [number, number, number]
}

type StageNode = {
  basePosition: Vector3
  baseScale: Vector3
  object: Object3D
}

const INTRO_DURATION = 0.55
const STAGE_DURATION = 0.95
const REVEAL_DELAY = 0.34
const REVEAL_DURATION = 0.42
const FINAL_DURATION = 1.1
const MODEL_URL = '/models/spacejoy-showcase.glb'

const INITIAL_VIEW = {
  camera: [5.6, 3.3, 6.2],
  target: [0, -0.15, 0],
} as const

const FINAL_VIEW = {
  camera: [5.8, 3.65, 6.6],
  target: [0, -0.08, -0.05],
} as const

const BUILD_STAGES: readonly BuildStage[] = [
  { camera: [4.4, 1.45, 4.25], id: 'rug', target: [0, -0.95, 0.25] },
  { camera: [5.4, 2.05, 5.2], id: 'seating', target: [0, -0.25, -0.55] },
  { camera: [4.1, 1.6, 4.1], id: 'table', target: [0.65, -0.65, 0.8] },
  { camera: [3.8, 1.75, 5.15], id: 'reading', target: [-1.65, -0.2, 0.55] },
  { camera: [5.15, 2.15, 4.65], id: 'finishing', target: [1.25, 0.05, -0.75] },
]

const STAGE_CAMERAS = BUILD_STAGES.map((stage) => new Vector3(...stage.camera))
const STAGE_TARGETS = BUILD_STAGES.map((stage) => new Vector3(...stage.target))
const INITIAL_CAMERA = new Vector3(...INITIAL_VIEW.camera)
const INITIAL_TARGET = new Vector3(...INITIAL_VIEW.target)
const FINAL_CAMERA = new Vector3(...FINAL_VIEW.camera)
const FINAL_TARGET = new Vector3(...FINAL_VIEW.target)
const PERSPECTIVE_ROTATIONS = [0.12, -0.12, 0.28]

function easeOutBack(value: number) {
  const overshoot = 1.35
  const shifted = value - 1
  return 1 + (overshoot + 1) * shifted ** 3 + overshoot * shifted ** 2
}

function prepareModel(source: Group) {
  const model = source.clone(true)
  const stages = new Map<string, StageNode[]>()

  model.traverse((object) => {
    if (object instanceof Mesh) {
      object.castShadow = true
      object.receiveShadow = true
    }

    const stage = object.userData.buildStage
    if (typeof stage !== 'string') return

    const nodes = stages.get(stage) ?? []
    nodes.push({
      basePosition: object.position.clone(),
      baseScale: object.scale.clone(),
      object,
    })
    stages.set(stage, nodes)
    object.position.y += 0.42
    object.scale.setScalar(0.001)
    object.visible = false
  })

  return { model, stages }
}

export function SpacejoyRoomBuild({
  immediatePerspective,
  onReady,
  onSequenceComplete,
  perspective,
}: Props) {
  const { scene } = useGLTF(MODEL_URL)
  const { model, stages } = useMemo(() => prepareModel(scene), [scene])
  const modelRef = useRef<Group>(null)
  const elapsed = useRef(0)
  const completed = useRef(false)
  const readyNotified = useRef(false)
  const currentTarget = useRef(INITIAL_TARGET.clone())
  const { camera, size } = useThree()
  const cameraViews = useMemo(() => {
    const aspect = size.width / size.height
    const scale = MathUtils.clamp(1 + (1.3 - aspect) * 1.35, 1, 1.32)
    const frame = (position: Vector3, target: Vector3) =>
      target.clone().add(position.clone().sub(target).multiplyScalar(scale))

    return {
      final: frame(FINAL_CAMERA, FINAL_TARGET),
      initial: frame(INITIAL_CAMERA, INITIAL_TARGET),
      stages: STAGE_CAMERAS.map((position, index) =>
        frame(position, STAGE_TARGETS[index] ?? INITIAL_TARGET),
      ),
    }
  }, [size.height, size.width])

  useEffect(() => {
    if (readyNotified.current) return
    readyNotified.current = true
    onReady()
  }, [onReady])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const desiredRotation = PERSPECTIVE_ROTATIONS[perspective] ?? 0
    if (modelRef.current) {
      modelRef.current.rotation.y =
        completed.current || immediatePerspective
          ? desiredRotation
          : MathUtils.damp(modelRef.current.rotation.y, desiredRotation, 4, delta)
    }
    if (completed.current) return

    elapsed.current += delta
    const stageTime = elapsed.current - INTRO_DURATION

    BUILD_STAGES.forEach((stage, index) => {
      const revealStart = index * STAGE_DURATION + REVEAL_DELAY
      const progress = MathUtils.clamp((stageTime - revealStart) / REVEAL_DURATION, 0, 1)
      const eased = easeOutBack(progress)

      stages.get(stage.id)?.forEach((node) => {
        node.object.visible = progress > 0
        node.object.scale.copy(node.baseScale).multiplyScalar(Math.max(eased, 0.001))
        node.object.position.copy(node.basePosition)
        node.object.position.y += (1 - MathUtils.smoothstep(progress, 0, 1)) * 0.42
      })
    })

    const finalStart = INTRO_DURATION + BUILD_STAGES.length * STAGE_DURATION
    let desiredCamera = cameraViews.initial
    let desiredTarget = INITIAL_TARGET
    if (stageTime >= 0 && elapsed.current < finalStart) {
      const index = Math.min(Math.floor(stageTime / STAGE_DURATION), BUILD_STAGES.length - 1)
      desiredCamera = cameraViews.stages[index] ?? cameraViews.initial
      desiredTarget = STAGE_TARGETS[index] ?? INITIAL_TARGET
    } else if (elapsed.current >= finalStart) {
      desiredCamera = cameraViews.final
      desiredTarget = FINAL_TARGET
    }

    const cameraAlpha = 1 - Math.exp(-4.4 * delta)
    camera.position.lerp(desiredCamera, cameraAlpha)
    currentTarget.current.lerp(desiredTarget, cameraAlpha)
    camera.lookAt(currentTarget.current)

    if (elapsed.current < finalStart + FINAL_DURATION) return
    camera.position.copy(cameraViews.final)
    currentTarget.current.copy(FINAL_TARGET)
    camera.lookAt(currentTarget.current)
    completed.current = true
    onSequenceComplete()
  })

  return (
    <group ref={modelRef}>
      <primitive object={model} />
    </group>
  )
}

export function clearSpacejoyModelCache() {
  useGLTF.clear(MODEL_URL)
}

useGLTF.preload(MODEL_URL)
