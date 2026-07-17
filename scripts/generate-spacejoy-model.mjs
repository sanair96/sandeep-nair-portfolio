import { writeFile } from 'node:fs/promises'

import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Scene } from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

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

const palette = {
  blue: new MeshStandardMaterial({ color: '#3159D9', roughness: 0.72 }),
  blueSoft: new MeshStandardMaterial({ color: '#6F87DF', roughness: 0.8 }),
  floor: new MeshStandardMaterial({ color: '#E4E8E1', roughness: 0.95 }),
  green: new MeshStandardMaterial({ color: '#187255', roughness: 0.78 }),
  wall: new MeshStandardMaterial({ color: '#F8F9F6', roughness: 1 }),
}

function box(name, size, position, material) {
  const mesh = new Mesh(new BoxGeometry(...size), material)
  mesh.name = name
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

const room = new Group()
room.name = 'SpacejoyShowcase'
room.add(
  box('Floor', [5.8, 0.12, 4.4], [0, -1.08, 0], palette.floor),
  box('BackWall', [5.8, 2.8, 0.1], [0, 0.28, -2.15], palette.wall),
  box('SideWall', [0.1, 2.8, 4.4], [-2.85, 0.28, 0], palette.wall),
  box('SofaBase', [2.8, 0.52, 1.15], [0.15, -0.64, -0.36], palette.blue),
  box('SofaBack', [2.8, 1.18, 0.32], [0.15, 0.02, -0.78], palette.blueSoft),
  box('SofaArmLeft', [0.28, 0.76, 1.1], [-1.25, -0.38, -0.36], palette.blue),
  box('SofaArmRight', [0.28, 0.76, 1.1], [1.55, -0.38, -0.36], palette.blue),
  box('CoffeeTableTop', [1.7, 0.16, 0.9], [0.95, -0.44, 1.15], palette.green),
  box('CoffeeTableLeg', [0.18, 0.58, 0.18], [0.95, -0.78, 1.15], palette.green),
)

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
