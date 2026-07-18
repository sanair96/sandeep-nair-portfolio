import { writeFile } from 'node:fs/promises'

import {
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
} from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

class NodeFileReader {
  result = null
  onloadend = null

  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = value
      this.onloadend?.()
    })
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((value) => {
      const data = Buffer.from(value).toString('base64')
      this.result = `data:${blob.type};base64,${data}`
      this.onloadend?.()
    })
  }
}

globalThis.FileReader ??= NodeFileReader

const geometryCache = {
  box: new Map(),
  cylinder: new Map(),
  roundedBox: new Map(),
  sphere: new Map(),
}

const materials = {
  blue: new MeshStandardMaterial({ color: '#3159d9', roughness: 0.86 }),
  blueSoft: new MeshStandardMaterial({ color: '#7189df', roughness: 0.9 }),
  brass: new MeshStandardMaterial({
    color: '#b89458',
    metalness: 0.45,
    roughness: 0.48,
  }),
  cream: new MeshStandardMaterial({ color: '#ebe5d9', roughness: 0.96 }),
  dark: new MeshStandardMaterial({ color: '#15211d', roughness: 0.64 }),
  floor: new MeshStandardMaterial({ color: '#ac825e', roughness: 0.78 }),
  floorLight: new MeshStandardMaterial({ color: '#bd9570', roughness: 0.8 }),
  glass: new MeshPhysicalMaterial({
    color: '#d8e5e6',
    opacity: 0.48,
    roughness: 0.18,
    transparent: true,
  }),
  green: new MeshStandardMaterial({ color: '#187255', roughness: 0.78 }),
  leaf: new MeshStandardMaterial({ color: '#2e8d69', roughness: 0.84 }),
  wall: new MeshStandardMaterial({ color: '#f8f6f0', roughness: 1 }),
}

function cachedGeometry(cache, key, create) {
  const existing = cache.get(key)
  if (existing) return existing

  const geometry = create()
  cache.set(key, geometry)
  return geometry
}

function mesh(name, geometry, material, position, options = {}) {
  const item = new Mesh(geometry, material)
  item.name = name
  item.position.set(...position)
  if (options.rotation) item.rotation.set(...options.rotation)
  if (options.scale) item.scale.set(...options.scale)
  item.castShadow = options.castShadow ?? true
  item.receiveShadow = options.receiveShadow ?? true
  return item
}

function box(name, size, position, material, options) {
  const geometry = cachedGeometry(geometryCache.box, size.join(':'), () => new BoxGeometry(...size))
  return mesh(name, geometry, material, position, options)
}

function roundedBox(name, size, position, material, radius = 0.1, options) {
  const key = [...size, radius].join(':')
  const geometry = cachedGeometry(
    geometryCache.roundedBox,
    key,
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 1, radius),
  )
  return mesh(name, geometry, material, position, options)
}

function cylinder(name, radii, height, position, material, options) {
  const key = [...radii, height].join(':')
  const geometry = cachedGeometry(
    geometryCache.cylinder,
    key,
    () => new CylinderGeometry(radii[0], radii[1], height, radii[2] ?? 20),
  )
  return mesh(name, geometry, material, position, options)
}

function sphere(name, radius, position, material, scale = [1, 1, 1]) {
  const geometry = cachedGeometry(
    geometryCache.sphere,
    String(radius),
    () => new SphereGeometry(radius, 12, 8),
  )
  return mesh(name, geometry, material, position, { scale })
}

function placement(stage, name, position, ...children) {
  const group = new Group()
  group.name = name
  group.position.set(...position)
  group.userData.buildStage = stage
  group.add(...children)
  return group
}

const shell = new Group()
shell.name = 'RoomShell'
shell.add(
  box('FloorBase', [6.4, 0.12, 5], [0, -1.06, 0], materials.floor),
  box('BackWall', [6.4, 3.2, 0.12], [0, 0.48, -2.44], materials.wall),
  box('LeftWall', [0.12, 3.2, 5], [-3.14, 0.48, 0], materials.wall),
  box('BackBaseboard', [6.2, 0.16, 0.08], [0, -0.86, -2.35], materials.cream),
  box('LeftBaseboard', [0.08, 0.16, 4.8], [-3.05, -0.86, 0], materials.cream),
)

for (let index = 0; index < 8; index += 1) {
  shell.add(
    box(
      `FloorPlank${index + 1}`,
      [0.77, 0.025, 4.82],
      [-2.7 + index * 0.77, -0.985, 0],
      index % 2 === 0 ? materials.floor : materials.floorLight,
    ),
  )
}

shell.add(
  box('WindowGlass', [0.035, 1.35, 1.85], [-3.06, 0.72, 0.78], materials.glass, {
    castShadow: false,
  }),
  box('WindowTop', [0.1, 0.09, 2.05], [-3, 1.43, 0.78], materials.dark),
  box('WindowBottom', [0.1, 0.09, 2.05], [-3, 0.01, 0.78], materials.dark),
  box('WindowLeft', [0.1, 1.5, 0.09], [-3, 0.72, -0.2], materials.dark),
  box('WindowRight', [0.1, 1.5, 0.09], [-3, 0.72, 1.76], materials.dark),
  box('WindowMullion', [0.08, 1.4, 0.07], [-2.97, 0.72, 0.78], materials.dark),
)

const rug = placement(
  'rug',
  'BuildRug',
  [0, -0.95, 0.22],
  roundedBox('RugBase', [4.15, 0.055, 2.65], [0, 0, 0], materials.cream, 0.08),
  roundedBox('RugInset', [3.72, 0.025, 2.22], [0, 0.035, 0], materials.blueSoft, 0.06),
  box('RugStripeLeft', [0.09, 0.01, 1.85], [-1.48, 0.052, 0], materials.green),
  box('RugStripeRight', [0.09, 0.01, 1.85], [1.48, 0.052, 0], materials.green),
)

const seating = placement(
  'seating',
  'BuildSeating',
  [0, -0.95, -0.92],
  cylinder('SofaLegFL', [0.065, 0.065, 12], 0.22, [-1.22, 0.12, 0.38], materials.dark),
  cylinder('SofaLegFR', [0.065, 0.065, 12], 0.22, [1.22, 0.12, 0.38], materials.dark),
  cylinder('SofaLegBL', [0.065, 0.065, 12], 0.22, [-1.22, 0.12, -0.38], materials.dark),
  cylinder('SofaLegBR', [0.065, 0.065, 12], 0.22, [1.22, 0.12, -0.38], materials.dark),
  roundedBox('SofaBase', [3.1, 0.48, 1.12], [0, 0.46, 0], materials.blue, 0.15),
  roundedBox('SofaBack', [2.75, 1.08, 0.3], [0, 1.02, -0.42], materials.blue, 0.14),
  roundedBox('SofaArmLeft', [0.32, 0.74, 1.12], [-1.43, 0.68, 0], materials.blue, 0.13),
  roundedBox('SofaArmRight', [0.32, 0.74, 1.12], [1.43, 0.68, 0], materials.blue, 0.13),
  roundedBox('SeatLeft', [0.82, 0.16, 0.76], [-0.88, 0.75, 0.12], materials.blueSoft, 0.08),
  roundedBox('SeatMiddle', [0.82, 0.16, 0.76], [0, 0.75, 0.12], materials.blueSoft, 0.08),
  roundedBox('SeatRight', [0.82, 0.16, 0.76], [0.88, 0.75, 0.12], materials.blueSoft, 0.08),
  roundedBox('BackCushionLeft', [0.75, 0.62, 0.17], [-0.86, 1.1, -0.22], materials.blueSoft, 0.1, {
    rotation: [-0.08, 0, 0],
  }),
  roundedBox('BackCushionMiddle', [0.75, 0.62, 0.17], [0, 1.1, -0.22], materials.blueSoft, 0.1, {
    rotation: [-0.08, 0, 0],
  }),
  roundedBox('BackCushionRight', [0.75, 0.62, 0.17], [0.86, 1.1, -0.22], materials.blueSoft, 0.1, {
    rotation: [-0.08, 0, 0],
  }),
  roundedBox('GreenPillow', [0.46, 0.48, 0.16], [-0.92, 1.18, 0.02], materials.green, 0.09, {
    rotation: [0, 0, 0.12],
  }),
  roundedBox('CreamPillow', [0.42, 0.44, 0.16], [0.95, 1.16, 0.03], materials.cream, 0.09, {
    rotation: [0, 0, -0.1],
  }),
)

const table = placement(
  'table',
  'BuildTable',
  [0.62, -0.95, 0.82],
  cylinder('TableTop', [0.82, 0.82, 28], 0.13, [0, 0.64, 0], materials.floorLight),
  cylinder('TableShelf', [0.58, 0.58, 24], 0.07, [0, 0.31, 0], materials.floor),
  cylinder('TableLegOne', [0.055, 0.055, 12], 0.58, [-0.42, 0.34, -0.32], materials.dark),
  cylinder('TableLegTwo', [0.055, 0.055, 12], 0.58, [0.42, 0.34, -0.32], materials.dark),
  cylinder('TableLegThree', [0.055, 0.055, 12], 0.58, [0, 0.34, 0.43], materials.dark),
  roundedBox('BookBlue', [0.42, 0.06, 0.29], [-0.22, 0.75, 0.08], materials.blue, 0.025, {
    rotation: [0, 0.2, 0],
  }),
  roundedBox('BookCream', [0.38, 0.055, 0.27], [-0.18, 0.81, 0.07], materials.cream, 0.025, {
    rotation: [0, 0.12, 0],
  }),
  sphere('TableBowl', 0.22, [0.28, 0.77, -0.08], materials.green, [1, 0.32, 1]),
)

const reading = placement(
  'reading',
  'BuildReadingNook',
  [-1.8, -0.95, 0.72],
  cylinder('ChairLegFL', [0.045, 0.045, 10], 0.3, [-0.3, 0.16, 0.28], materials.dark),
  cylinder('ChairLegFR', [0.045, 0.045, 10], 0.3, [0.3, 0.16, 0.28], materials.dark),
  cylinder('ChairLegBL', [0.045, 0.045, 10], 0.3, [-0.3, 0.16, -0.28], materials.dark),
  cylinder('ChairLegBR', [0.045, 0.045, 10], 0.3, [0.3, 0.16, -0.28], materials.dark),
  roundedBox('ChairSeat', [0.92, 0.28, 0.92], [0, 0.44, 0], materials.green, 0.14),
  roundedBox('ChairBack', [0.92, 1.04, 0.24], [0, 1.06, -0.34], materials.green, 0.14, {
    rotation: [-0.12, 0, 0],
  }),
  roundedBox('ChairPillow', [0.5, 0.45, 0.14], [0, 0.98, -0.12], materials.cream, 0.08),
  cylinder('LampBase', [0.25, 0.28, 20], 0.08, [1.02, 0.05, -0.32], materials.brass),
  cylinder('LampStem', [0.035, 0.035, 12], 1.72, [1.02, 0.92, -0.32], materials.dark),
  cylinder('LampShade', [0.24, 0.42, 24], 0.5, [1.02, 1.72, -0.32], materials.cream),
  cylinder('SideTableTop', [0.38, 0.38, 20], 0.09, [0.92, 0.58, 0.42], materials.brass),
  cylinder('SideTableStem', [0.045, 0.045, 12], 0.54, [0.92, 0.3, 0.42], materials.dark),
  cylinder('SideTableBase', [0.2, 0.22, 16], 0.06, [0.92, 0.03, 0.42], materials.dark),
)

const consolePlacement = placement(
  'finishing',
  'BuildMediaConsole',
  [1.25, -0.95, -2.05],
  cylinder('ConsoleLegLeft', [0.05, 0.05, 10], 0.38, [-0.78, 0.2, 0], materials.dark),
  cylinder('ConsoleLegRight', [0.05, 0.05, 10], 0.38, [0.78, 0.2, 0], materials.dark),
  roundedBox('ConsoleBody', [2.05, 0.58, 0.44], [0, 0.64, 0], materials.floorLight, 0.09),
  box('ConsoleDoorLeft', [0.58, 0.38, 0.025], [-0.63, 0.64, 0.23], materials.floor),
  box('ConsoleDoorMiddle', [0.58, 0.38, 0.025], [0, 0.64, 0.23], materials.floor),
  box('ConsoleDoorRight', [0.58, 0.38, 0.025], [0.63, 0.64, 0.23], materials.floor),
  mesh('ConsoleMirrorFrame', new RingGeometry(0.52, 0.62, 32), materials.brass, [0, 1.48, -0.09]),
  mesh('ConsoleMirror', new CircleGeometry(0.51, 32), materials.glass, [0, 1.48, -0.04], {
    castShadow: false,
  }),
  cylinder('Vase', [0.11, 0.17, 16], 0.34, [-0.72, 1.1, 0.02], materials.blue),
  roundedBox('ConsoleBook', [0.36, 0.06, 0.24], [0.64, 1.01, 0.05], materials.cream, 0.02),
)

const plantPlacement = placement(
  'finishing',
  'BuildPlant',
  [-2.42, -0.95, -1.45],
  cylinder('PlantPot', [0.28, 0.42, 20], 0.58, [0, 0.3, 0], materials.brass),
  cylinder('PlantStemOne', [0.025, 0.035, 8], 1.12, [-0.05, 1.05, 0], materials.green, {
    rotation: [0.05, 0, -0.12],
  }),
  cylinder('PlantStemTwo', [0.022, 0.032, 8], 0.95, [0.16, 0.98, 0.03], materials.green, {
    rotation: [-0.08, 0, 0.18],
  }),
  sphere('PlantLeafOne', 0.35, [-0.3, 1.35, 0.02], materials.leaf, [1.05, 0.45, 0.72]),
  sphere('PlantLeafTwo', 0.34, [0.25, 1.48, 0.06], materials.leaf, [1.1, 0.46, 0.72]),
  sphere('PlantLeafThree', 0.3, [-0.12, 1.72, -0.03], materials.leaf, [0.78, 0.42, 1.05]),
  sphere('PlantLeafFour', 0.3, [0.38, 1.14, -0.04], materials.leaf, [0.95, 0.42, 0.76]),
  sphere('PlantLeafFive', 0.28, [-0.38, 0.98, -0.06], materials.leaf, [0.88, 0.4, 0.72]),
)

const artPlacement = placement(
  'finishing',
  'BuildWallArt',
  [-1.15, -0.95, -2.34],
  box('ArtworkFrameLarge', [1.08, 1.04, 0.08], [0, 2.02, 0], materials.dark),
  box('ArtworkCanvasLarge', [0.91, 0.87, 0.045], [0, 2.02, 0.05], materials.cream),
  box('ArtworkShapeBlue', [0.28, 0.55, 0.035], [-0.19, 2.02, 0.09], materials.blue),
  box('ArtworkShapeGreen', [0.3, 0.3, 0.035], [0.23, 1.86, 0.09], materials.green),
  box('ArtworkFrameSmall', [0.62, 0.76, 0.08], [-0.88, 1.86, 0], materials.brass),
  box('ArtworkCanvasSmall', [0.48, 0.62, 0.045], [-0.88, 1.86, 0.05], materials.wall),
)

const room = new Group()
room.name = 'SpacejoyShowcase'
room.add(shell, rug, seating, table, reading, consolePlacement, plantPlacement, artPlacement)

const scene = new Scene()
scene.name = 'SpacejoyRoomScene'
scene.add(room)

const exporter = new GLTFExporter()
const data = await exporter.parseAsync(scene, {
  binary: true,
  onlyVisible: true,
  trs: false,
})

await writeFile(
  new URL('../public/models/spacejoy-showcase.glb', import.meta.url),
  Buffer.from(data),
)
console.log('Generated public/models/spacejoy-showcase.glb')
