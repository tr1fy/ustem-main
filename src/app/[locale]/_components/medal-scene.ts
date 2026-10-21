/**
 * Real-time 3D FIRST Global medal on a lanyard for the numbers card.
 * Loaded lazily by impact-medal.tsx (three.js is ~150 KB gzipped, so it is
 * fetched only when the card comes near the viewport).
 *
 * World units: the medal radius is 1. The canvas origin is its centre, the
 * camera looks straight at it, so on the z = 0 plane one unit = `px` CSS
 * pixels. Physics is a small Verlet system: two ribbon straps hang from
 * anchors above the canvas top and meet at the jump ring (Q); the medal is
 * a heavy particle (C) on a rigid link under Q, plus a damped twist (yaw)
 * around that link. The medal face is a gold PBR material whose relief
 * (rim, bead ring and the official logo) comes from a normal map baked
 * into a canvas from the logo's alpha.
 */
/* The solver moves particles, textures and the canvas cursor in place. */
/* eslint-disable no-param-reassign */
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  CylinderGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Texture
} from 'three'
// three's exports map needs the full file name
// eslint-disable-next-line import/extensions
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export type MedalScene = {
  /** Starts the fall from above the canvas (once). */
  drop: () => void
  /** Shows the medal hanging still, without any motion (reduced motion). */
  still: () => void
  setVisible: (visible: boolean) => void
  /** Canvas size in CSS px and the medal radius in CSS px. */
  resize: (width: number, height: number, radius: number) => void
  dispose: () => void
}

/* ---------- geometry (medal radius = 1) ---------- */
const THICK = 0.12
const BEVEL = 0.045
/** Medal centre → top of the jump ring, where both straps meet. */
const RING = 1.22
const RIBBON_W = 0.46
const SEGMENTS = 18
/** Anchors sit this far above the canvas top, so the straps run out of view
    (on the homepage the canvas top is the bottom edge of the hero). */
const ANCHOR_LIFT = 1.9
/** Half the distance between the two strap anchors: a long, narrow V. */
const SPREAD = 0.5
/** Rest twist: a slight turn shows the edge and catches the light. */
const YAW_REST = -0.2

/* ---------- physics ---------- */
const STEP = 1 / 120
const GRAVITY = 26
const ITERATIONS = 8

type Particle = { p: Vector3; o: Vector3; w: number }
type Link = { a: Particle; b: Particle; len: number; k: number }

const particle = (x = 0, y = 0, z = 0, w = 1): Particle => ({
  p: new Vector3(x, y, z),
  o: new Vector3(x, y, z),
  w
})

/** The canvas runs this far below its slot (home.css), room for the bounce. */
const BELOW_PX = 28

/** Rest pose for a canvas box; `radius` is the medal radius in CSS px. */
function layout(width: number, height: number, radius: number) {
  const px = Math.max(24, radius)
  const worldW = width / px
  const worldH = height / px
  const centre = new Vector3(0, -worldH / 2 + BELOW_PX / px + 1 + 0.1, 0)
  const ring = centre.clone().add(new Vector3(0, RING, 0))
  const top = worldH / 2 + ANCHOR_LIFT
  return {
    px,
    worldW,
    worldH,
    centre,
    ring,
    anchors: [new Vector3(-SPREAD, top, -0.02), new Vector3(SPREAD, top, 0.02)]
  }
}

/* ---------- textures ---------- */

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Separable box blur on a height field (two passes ≈ a soft bevel). */
function blur(src: Float32Array, size: number, radius: number) {
  const tmp = new Float32Array(src.length)
  const span = radius * 2 + 1
  for (let y = 0; y < size; y += 1) {
    let acc = 0
    const row = y * size
    for (let x = -radius; x <= radius; x += 1)
      acc += src[row + Math.min(size - 1, Math.max(0, x))]
    for (let x = 0; x < size; x += 1) {
      tmp[row + x] = acc / span
      const add = Math.min(size - 1, x + radius + 1)
      const sub = Math.max(0, x - radius)
      acc += src[row + add] - src[row + sub]
    }
  }
  for (let x = 0; x < size; x += 1) {
    let acc = 0
    for (let y = -radius; y <= radius; y += 1)
      acc += tmp[Math.min(size - 1, Math.max(0, y)) * size + x]
    for (let y = 0; y < size; y += 1) {
      src[y * size + x] = acc / span
      const add = Math.min(size - 1, y + radius + 1)
      const sub = Math.max(0, y - radius)
      acc += tmp[add * size + x] - tmp[sub * size + x]
    }
  }
}

/**
 * Bakes the face: a height field (rim, bead ring, fine ring, logo) turned
 * into a tangent-space normal map, a roughness map (sand-blasted field,
 * polished relief) and an albedo map (the field a touch darker).
 */
function bakeFace(logo: HTMLImageElement, size: number) {
  const c = size / 2
  const unit = c / 1 // face radius in texels
  const draw = document.createElement('canvas')
  draw.width = size
  draw.height = size
  const g = draw.getContext('2d', { willReadFrequently: true })!

  // grey levels = height: field .26, rim 1, beads .8, fine ring .62
  g.fillStyle = '#000'
  g.fillRect(0, 0, size, size)
  g.fillStyle = 'rgb(66,66,66)'
  g.beginPath()
  g.arc(c, c, unit, 0, Math.PI * 2)
  g.fill()
  g.lineWidth = unit * 0.13
  g.strokeStyle = '#fff'
  g.beginPath()
  g.arc(c, c, unit * 0.94, 0, Math.PI * 2)
  g.stroke()
  g.fillStyle = 'rgb(204,204,204)'
  const beads = 44
  for (let i = 0; i < beads; i += 1) {
    const a = (i / beads) * Math.PI * 2
    g.beginPath()
    g.arc(
      c + Math.cos(a) * unit * 0.8,
      c + Math.sin(a) * unit * 0.8,
      unit * 0.026,
      0,
      Math.PI * 2
    )
    g.fill()
  }
  g.lineWidth = unit * 0.012
  g.strokeStyle = 'rgb(158,158,158)'
  g.beginPath()
  g.arc(c, c, unit * 0.735, 0, Math.PI * 2)
  g.stroke()
  const base = g.getImageData(0, 0, size, size).data

  // logo: the mark on top, FIRST / GLOBAL under it (crop boxes in the PNG)
  g.clearRect(0, 0, size, size)
  const scale = unit / 512
  const mark = { x: 0, y: 0, w: 332, h: 202 }
  const text = { x: 358, y: 0, w: 465, h: 202 }
  const markW = 460 * scale
  const textW = 440 * scale
  const markH = (markW * mark.h) / mark.w
  const textH = (textW * text.h) / text.w
  const gap = 30 * scale
  const top = c - (markH + gap + textH) / 2 - 6 * scale
  g.drawImage(
    logo,
    mark.x,
    mark.y,
    mark.w,
    mark.h,
    c - markW / 2,
    top,
    markW,
    markH
  )
  g.drawImage(
    logo,
    text.x,
    text.y,
    text.w,
    text.h,
    c - textW / 2,
    top + markH + gap,
    textW,
    textH
  )
  const ink = g.getImageData(0, 0, size, size).data

  const height = new Float32Array(size * size)
  for (let i = 0; i < size * size; i += 1)
    height[i] = Math.max(base[i * 4] / 255, (ink[i * 4 + 3] / 255) * 0.94)
  const relief = Float32Array.from(height)
  blur(height, size, Math.max(1, Math.round(size / 512)))
  blur(height, size, Math.max(1, Math.round(size / 400)))

  const normal = g.createImageData(size, size)
  const rough = g.createImageData(size, size)
  const albedo = g.createImageData(size, size)
  const strength = size / 170
  let seed = 7
  const noise = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647 - 0.5
  }
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = y * size + x
      const l = height[y * size + Math.max(0, x - 1)]
      const r = height[y * size + Math.min(size - 1, x + 1)]
      const u = height[Math.max(0, y - 1) * size + x]
      const d = height[Math.min(size - 1, y + 1) * size + x]
      const f = smooth(0.42, 0.7, relief[i])
      const grain = noise() * 0.12 * (1 - f)
      // texture v runs up while canvas y runs down, hence +(d - u)
      let nx = -(r - l) * strength + grain
      let ny = (d - u) * strength + noise() * 0.12 * (1 - f)
      let nz = 1
      const len = Math.hypot(nx, ny, nz)
      nx /= len
      ny /= len
      nz /= len
      const o = i * 4
      normal.data[o] = (nx * 0.5 + 0.5) * 255
      normal.data[o + 1] = (ny * 0.5 + 0.5) * 255
      normal.data[o + 2] = (nz * 0.5 + 0.5) * 255
      normal.data[o + 3] = 255
      const ro = 0.5 + noise() * 0.08
      const roughness = ro + (0.17 - ro) * f
      rough.data[o] = 255
      rough.data[o + 1] = roughness * 255
      rough.data[o + 2] = 255
      rough.data[o + 3] = 255
      // gold albedo; the recessed field is a little deeper in tone
      albedo.data[o] = 214 + 34 * f
      albedo.data[o + 1] = 160 + 40 * f
      albedo.data[o + 2] = 74 + 34 * f
      albedo.data[o + 3] = 255
    }
  }
  const toTexture = (img: ImageData, srgb = false) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    canvas.getContext('2d')!.putImageData(img, 0, 0)
    const texture = new CanvasTexture(canvas)
    if (srgb) texture.colorSpace = SRGBColorSpace
    return texture
  }
  return {
    normalMap: toTexture(normal),
    roughnessMap: toTexture(rough),
    map: toTexture(albedo, true)
  }
}

/** Satin lanyard: royal blue, light edge stripes, «FIRST GLOBAL» along it. */
function bakeRibbon() {
  const w = 128
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const g = canvas.getContext('2d')!
  g.fillStyle = '#0f3aa6'
  g.fillRect(0, 0, w, h)
  g.fillStyle = '#3a72e0'
  g.fillRect(0, 0, 9, h)
  g.fillRect(w - 9, 0, 9, h)
  g.fillStyle = '#0a2c86'
  g.fillRect(9, 0, 3, h)
  g.fillRect(w - 12, 0, 3, h)
  g.fillStyle = 'rgba(255,255,255,0.05)'
  for (let y = 0; y < h; y += 3) g.fillRect(0, y, w, 1)
  // «FIRST GLOBAL» centred along the tile, so each repeat has a blank
  // stretch around v = 0; updateStrip puts that stretch at the jump ring
  g.save()
  g.translate(w / 2, h / 2)
  g.rotate(Math.PI / 2)
  g.fillStyle = '#ffffff'
  g.textAlign = 'left'
  g.textBaseline = 'middle'
  const family = getComputedStyle(document.body).fontFamily || 'sans-serif'
  const first = `italic 800 46px ${family}`
  const global = `800 46px ${family}`
  g.font = first
  const firstW = g.measureText('FIRST').width
  g.font = global
  const globalW = g.measureText('GLOBAL').width
  const gap = 24
  const start = -(firstW + gap + globalW) / 2
  g.font = first
  g.fillText('FIRST', start, 2)
  g.font = global
  g.fillText('GLOBAL', start + firstW + gap, 2)
  g.restore()
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapT = RepeatWrapping
  return texture
}

/** Soft contact shadow cast on the card behind the medal. */
function bakeShadow() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const g = canvas.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 62)
  grad.addColorStop(0, 'rgba(12,28,60,0.6)')
  grad.addColorStop(0.5, 'rgba(12,28,60,0.3)')
  grad.addColorStop(0.78, 'rgba(12,28,60,0.08)')
  grad.addColorStop(1, 'rgba(12,28,60,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

/* ---------- meshes ---------- */

function medalBody() {
  // Lathe profile (x = radius, y = along the axis), back to front.
  const profile: Vector2[] = []
  const steps = 8
  for (let i = 0; i <= steps; i += 1) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2)
    profile.push(
      new Vector2(
        1 - BEVEL + Math.cos(a) * BEVEL,
        -THICK / 2 + BEVEL + Math.sin(a) * BEVEL
      )
    )
  }
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * (Math.PI / 2)
    profile.push(
      new Vector2(
        1 - BEVEL + Math.cos(a) * BEVEL,
        THICK / 2 - BEVEL + Math.sin(a) * BEVEL
      )
    )
  }
  const edge = new LatheGeometry(profile, 128)
  edge.rotateX(Math.PI / 2)
  return edge
}

function stripGeometry(points: number) {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(points * 2 * 3), 3)
  )
  geometry.setAttribute(
    'normal',
    new BufferAttribute(new Float32Array(points * 2 * 3), 3)
  )
  geometry.setAttribute(
    'uv',
    new BufferAttribute(new Float32Array(points * 4), 2)
  )
  const index: number[] = []
  for (let i = 0; i < points - 1; i += 1) {
    const a = i * 2
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  geometry.setIndex(index)
  return geometry
}

export function createMedalScene(
  canvas: HTMLCanvasElement,
  logo: HTMLImageElement
): MedalScene {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power'
  })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const envMap = pmrem.fromScene(room, 0.03).texture
  scene.environment = envMap
  scene.environmentIntensity = 1.15

  const key = new DirectionalLight(0xffffff, 2.2)
  key.position.set(-2.5, 3.5, 4)
  const fill = new DirectionalLight(0xfff0d8, 0.7)
  fill.position.set(3, -1.5, 2.5)
  scene.add(key, fill)

  const camera = new PerspectiveCamera(22, 1, 0.1, 100)

  /* medal */
  const textures: Texture[] = []
  const faceSize = 1024
  const face = bakeFace(logo, faceSize)
  textures.push(face.map, face.normalMap, face.roughnessMap)
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  ;[face.map, face.normalMap, face.roughnessMap].forEach(texture => {
    texture.anisotropy = anisotropy
  })
  const faceMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    map: face.map,
    metalness: 1,
    roughness: 1,
    roughnessMap: face.roughnessMap,
    normalMap: face.normalMap,
    normalScale: new Vector2(1.1, 1.1),
    clearcoat: 0.25,
    clearcoatRoughness: 0.3
  })
  const goldMaterial = new MeshPhysicalMaterial({
    color: 0xf0c66a,
    metalness: 1,
    roughness: 0.24,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25
  })

  const medal = new Group()
  const faceRadius = 1 - BEVEL
  const front = new Mesh(new CircleGeometry(faceRadius, 128), faceMaterial)
  front.position.z = THICK / 2
  const backGeometry = new CircleGeometry(faceRadius, 128)
  const uv = backGeometry.getAttribute('uv')
  for (let i = 0; i < uv.count; i += 1) uv.setX(i, 1 - uv.getX(i))
  const back = new Mesh(backGeometry, faceMaterial)
  back.rotation.y = Math.PI
  back.position.z = -THICK / 2
  const edge = new Mesh(medalBody(), goldMaterial)
  const lug = new Mesh(
    new CylinderGeometry(0.075, 0.075, THICK * 0.9, 24),
    goldMaterial
  )
  lug.rotation.x = Math.PI / 2
  lug.position.y = 1.0
  const jump = new Mesh(new TorusGeometry(0.1, 0.024, 16, 40), goldMaterial)
  jump.rotation.y = Math.PI / 2
  jump.position.y = RING - 0.1
  medal.add(front, back, edge, lug, jump)
  scene.add(medal)

  const shadowTexture = bakeShadow()
  textures.push(shadowTexture)
  const shadow = new Mesh(
    new PlaneGeometry(2.3, 2.3),
    new MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.38
    })
  )
  shadow.position.z = -0.45
  scene.add(shadow)

  /* ribbons */
  const ribbonTexture = bakeRibbon()
  ribbonTexture.anisotropy = anisotropy
  textures.push(ribbonTexture)
  const ribbonMaterial = new MeshPhysicalMaterial({
    map: ribbonTexture,
    roughness: 0.62,
    metalness: 0,
    sheen: 0.35,
    sheenColor: 0x5a8ae8,
    sheenRoughness: 0.45,
    envMapIntensity: 0.3,
    side: DoubleSide
  })
  const SAMPLES = SEGMENTS * 3 + 1
  const strips = [0, 1].map(() => {
    const mesh = new Mesh(stripGeometry(SAMPLES), ribbonMaterial)
    mesh.frustumCulled = false
    scene.add(mesh)
    return mesh
  })

  /* physics state */
  let box = layout(1, 1, 24)
  const centre = particle(0, 0, 0, 0.14)
  const ring = particle(0, 0, 0, 2)
  const straps: Particle[][] = [0, 1].map(() =>
    Array.from({ length: SEGMENTS + 1 }, (_, i) =>
      i === SEGMENTS ? ring : particle(0, 0, 0, i === 0 ? 0 : 4)
    )
  )
  let links: Link[] = []
  let yaw = YAW_REST
  let yawSpeed = 0
  let caught = false
  let lastVy = 0

  function buildLinks() {
    links = [{ a: ring, b: centre, len: RING, k: 1 }]
    straps.forEach((strap, s) => {
      const length = box.anchors[s].distanceTo(box.ring) * 1.004
      const seg = length / SEGMENTS
      for (let i = 0; i < SEGMENTS; i += 1)
        links.push({ a: strap[i], b: strap[i + 1], len: seg, k: 0.92 })
      // a little bending stiffness keeps the satin from folding sharply
      for (let i = 0; i < SEGMENTS - 1; i += 1)
        links.push({ a: strap[i], b: strap[i + 2], len: seg * 2, k: 0.08 })
    })
  }

  const place = (q: Particle, v: Vector3) => {
    q.p.copy(v)
    q.o.copy(v)
  }

  /** Everything at rest: straps straight from the anchors to the ring. */
  function restPose() {
    place(centre, box.centre)
    place(ring, box.ring)
    straps.forEach((strap, s) => {
      strap.forEach((node, i) => {
        if (node === ring) return
        place(node, box.anchors[s].clone().lerp(box.ring, i / SEGMENTS))
      })
    })
    yaw = YAW_REST
    yawSpeed = 0
  }

  /** Before the fall: the medal just above the canvas, straps slack. */
  function startPose() {
    const lift = new Vector3(0.32, box.anchors[0].y + 0.65 - box.ring.y, 0.15)
    const q = box.ring.clone().add(lift)
    const tilt = new Vector3(
      Math.sin(-0.35),
      -Math.cos(0.35),
      0
    ).multiplyScalar(RING)
    place(ring, q)
    place(centre, q.clone().add(tilt))
    straps.forEach((strap, s) => {
      const a = box.anchors[s]
      const d = a.distanceTo(q)
      const length = a.distanceTo(box.ring) * 1.004
      const sag = Math.sqrt((3 * d * Math.max(0, length - d)) / 8)
      strap.forEach((node, i) => {
        if (node === ring) return
        const t = i / SEGMENTS
        const v = a.clone().lerp(q, t)
        v.y -= sag * Math.sin(Math.PI * t)
        place(node, v)
      })
    })
    yaw = YAW_REST + 0.5
    yawSpeed = 0
    caught = false
    lastVy = 0
  }

  /* pointer */
  const pointer = new Vector3()
  const pointerPrev = new Vector3()
  let pointerTime = 0
  let grabbed = false
  let hovering = false

  /** Every moving particle once (the ring is shared by both straps). */
  const bodies = Array.from(
    new Set([centre, ring, ...straps[0], ...straps[1]])
  ).filter(q => q.w > 0)
  const target = new Vector3()

  /** Air drag per step: the medal swings long, the satin barely. */
  const drag = (q: Particle) => {
    if (q === centre) return 0.996
    if (q === ring) return 0.99
    return 0.975
  }

  function step(dt: number) {
    const g = GRAVITY * dt * dt
    bodies.forEach(q => {
      const damp = drag(q)
      const vx = (q.p.x - q.o.x) * damp
      const vy = (q.p.y - q.o.y) * damp
      const vz = (q.p.z - q.o.z) * damp
      q.o.copy(q.p)
      q.p.x += vx
      q.p.y += vy - g
      q.p.z += vz - q.p.z * 0.002
    })
    if (grabbed) {
      target.copy(pointer)
      target.x = Math.max(
        -box.worldW / 2 + 1.05,
        Math.min(box.worldW / 2 - 1.05, target.x)
      )
      target.y = Math.max(
        box.centre.y - 0.1,
        Math.min(box.centre.y + 1.1, target.y)
      )
      target.z = 0
      centre.p.lerp(target, 0.25)
    }
    for (let n = 0; n < ITERATIONS; n += 1) {
      links.forEach(({ a, b, len, k }) => {
        const dx = b.p.x - a.p.x
        const dy = b.p.y - a.p.y
        const dz = b.p.z - a.p.z
        const dist = Math.hypot(dx, dy, dz) || 1e-6
        const w = a.w + b.w
        if (w === 0) return
        const diff = ((dist - len) / dist / w) * k
        a.p.x += dx * diff * a.w
        a.p.y += dy * diff * a.w
        a.p.z += dz * diff * a.w
        b.p.x -= dx * diff * b.w
        b.p.y -= dy * diff * b.w
        b.p.z -= dz * diff * b.w
      })
    }
    // the catch: a sharp stop of the fall makes the medal twist on the ring
    const vy = (centre.p.y - centre.o.y) / dt
    if (!caught && lastVy < -4 && vy - lastVy > 2.5) {
      caught = true
      yawSpeed += 6.5
    }
    lastVy = vy
    // twist: a damped spring towards the rest angle
    yawSpeed += (-(yaw - YAW_REST) * 46 - yawSpeed * 1.5) * dt
    yaw += yawSpeed * dt
  }

  /* drawing */
  const Y = new Vector3(0, 1, 0)
  const view = new Vector3(0, 0, 1)
  const up = new Vector3()
  const align = new Quaternion()
  const twist = new Quaternion()
  const tangent = new Vector3()
  const side = new Vector3()
  const normal = new Vector3()
  const samples = Array.from({ length: SAMPLES }, () => new Vector3())

  /** Catmull-Rom through the strap nodes, 3 samples per segment. */
  function sample(nodes: Particle[]) {
    let k = 0
    for (let i = 0; i < SEGMENTS; i += 1) {
      const p0 = nodes[Math.max(0, i - 1)].p
      const p1 = nodes[i].p
      const p2 = nodes[i + 1].p
      const p3 = nodes[Math.min(SEGMENTS, i + 2)].p
      for (let j = 0; j < 3; j += 1) {
        const t = j / 3
        const t2 = t * t
        const t3 = t2 * t
        samples[k].set(
          0.5 *
            (2 * p1.x +
              (-p0.x + p2.x) * t +
              (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
              (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          0.5 *
            (2 * p1.y +
              (-p0.y + p2.y) * t +
              (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
              (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
          0.5 *
            (2 * p1.z +
              (-p0.z + p2.z) * t +
              (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
              (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3)
        )
        k += 1
      }
    }
    samples[k].copy(nodes[SEGMENTS].p)
  }

  const lengths = new Float32Array(SAMPLES)

  function updateStrip(mesh: Mesh, nodes: Particle[], s: number) {
    sample(nodes)
    const geometry = mesh.geometry as BufferGeometry
    const pos = geometry.getAttribute('position') as BufferAttribute
    const nor = geometry.getAttribute('normal') as BufferAttribute
    const tex = geometry.getAttribute('uv') as BufferAttribute
    const repeat = RIBBON_W * 4
    const sign = s === 0 ? 1 : -1
    lengths[0] = 0
    for (let i = 1; i < SAMPLES; i += 1)
      lengths[i] = lengths[i - 1] + samples[i].distanceTo(samples[i - 1])
    const total = lengths[SAMPLES - 1]
    for (let i = 0; i < SAMPLES; i += 1) {
      const a = samples[Math.max(0, i - 1)]
      const b = samples[Math.min(SAMPLES - 1, i + 1)]
      tangent.subVectors(b, a).normalize()
      side.crossVectors(tangent, view).normalize()
      // Over the last ~half radius the satin narrows and turns a little, as
      // if folding into the jump ring. It never goes edge-on: a squeezed
      // strip turned the white lettering into ragged slivers.
      const fold = 1 - smooth(0, 0.5, total - lengths[i])
      side.applyAxisAngle(tangent, fold * 0.45 * sign)
      normal.crossVectors(side, tangent).normalize()
      const half = (RIBBON_W / 2) * (1 - fold * 0.32)
      // anchored at the ring end, so the blank stretch of the tile (v = 0)
      // always sits there and no letters reach the fold
      const along = lengths[i] - total
      const p = samples[i]
      // tuck the end into the jump ring
      const tuck = i === SAMPLES - 1 ? 0.05 : 0
      const z = s === 0 ? -0.012 : 0.012
      pos.setXYZ(
        i * 2,
        p.x - side.x * half + tangent.x * tuck,
        p.y - side.y * half + tangent.y * tuck,
        p.z - side.z * half + z
      )
      pos.setXYZ(
        i * 2 + 1,
        p.x + side.x * half + tangent.x * tuck,
        p.y + side.y * half + tangent.y * tuck,
        p.z + side.z * half + z
      )
      nor.setXYZ(i * 2, normal.x, normal.y, normal.z)
      nor.setXYZ(i * 2 + 1, normal.x, normal.y, normal.z)
      tex.setXY(i * 2, 0, along / repeat)
      tex.setXY(i * 2 + 1, 1, along / repeat)
    }
    pos.needsUpdate = true
    nor.needsUpdate = true
    tex.needsUpdate = true
  }

  function render() {
    up.subVectors(ring.p, centre.p).normalize()
    align.setFromUnitVectors(Y, up)
    twist.setFromAxisAngle(Y, yaw)
    medal.quaternion.copy(align).multiply(twist)
    medal.position.copy(centre.p)
    shadow.position.x = centre.p.x + 0.16
    shadow.position.y = centre.p.y - 0.12
    shadow.scale.setScalar(1 + Math.min(0.3, Math.abs(centre.p.z) * 0.6))
    updateStrip(strips[0], straps[0], 0)
    updateStrip(strips[1], straps[1], 1)
    renderer.render(scene, camera)
  }

  /* loop */
  let raf = 0
  let running = false
  let visible = true
  let dropped = false
  let last = 0
  let acc = 0
  let calm = 0

  /** Still enough to stop drawing: under ~1 px/s and a fraction of a degree. */
  function resting() {
    const speed = centre.p.distanceTo(centre.o) / STEP
    return (
      speed * box.px < 1.2 &&
      Math.abs(yawSpeed) < 0.03 &&
      Math.abs(yaw - YAW_REST) < 0.01
    )
  }

  function frame(now: number) {
    raf = 0
    if (!running) return
    const dt = Math.min((now - last) / 1000, 1 / 20)
    last = now
    acc += dt
    while (acc >= STEP) {
      step(STEP)
      acc -= STEP
    }
    render()
    calm = !grabbed && resting() ? calm + 1 : 0
    if (calm > 45) {
      running = false
      return
    }
    raf = requestAnimationFrame(frame)
  }

  function wake() {
    calm = 0
    if (running || !visible || !dropped) return
    running = true
    last = performance.now()
    acc = 0
    raf = requestAnimationFrame(frame)
  }

  function sleep() {
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  /* pointer handlers */
  let reduced = false
  const toWorld = (event: PointerEvent, out: Vector3) => {
    const rect = canvas.getBoundingClientRect()
    out.set(
      (event.clientX - rect.left - rect.width / 2) / box.px,
      (rect.height / 2 - (event.clientY - rect.top)) / box.px,
      0
    )
    return out
  }
  const nearMedal = (v: Vector3, reach = 1.05) =>
    Math.hypot(v.x - centre.p.x, v.y - centre.p.y) < reach

  const onMove = (event: PointerEvent) => {
    if (!dropped || reduced) return
    pointerPrev.copy(pointer)
    toWorld(event, pointer)
    const now = performance.now()
    const dt = Math.max(8, now - pointerTime) / 1000
    pointerTime = now
    if (grabbed) {
      wake()
      return
    }
    const near = nearMedal(pointer)
    if (event.pointerType === 'mouse') canvas.style.cursor = near ? 'grab' : ''
    if (near && hovering) {
      // brushing past the medal pushes it a little
      const vx = Math.max(-6, Math.min(6, (pointer.x - pointerPrev.x) / dt))
      centre.o.x -= vx * 0.0011
      yawSpeed += vx * (pointer.y > centre.p.y ? -0.12 : 0.12)
      wake()
    }
    hovering = true
  }
  const onDown = (event: PointerEvent) => {
    if (!dropped || reduced) return
    toWorld(event, pointer)
    if (!nearMedal(pointer)) return
    if (event.pointerType === 'touch') {
      centre.o.x += (pointer.x < centre.p.x ? -1 : 1) * 0.022
      yawSpeed += 3.5
      wake()
      return
    }
    grabbed = true
    try {
      canvas.setPointerCapture(event.pointerId)
    } catch {
      // synthetic events carry no live pointer; dragging still works
    }
    canvas.style.cursor = 'grabbing'
    wake()
  }
  const onUp = (event: PointerEvent) => {
    if (!grabbed) return
    grabbed = false
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId)
    canvas.style.cursor = nearMedal(pointer) ? 'grab' : ''
    wake()
  }
  const onLeave = () => {
    hovering = false
    if (!grabbed) canvas.style.cursor = ''
  }
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('pointerleave', onLeave)

  function resize(width: number, height: number, radius: number) {
    if (width < 2 || height < 2) return
    box = layout(width, height, radius)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.position.set(
      0,
      0,
      box.worldH / 2 / Math.tan((22 / 2) * (Math.PI / 180))
    )
    camera.lookAt(0, 0, 0)
    camera.far = camera.position.z + 20
    camera.updateProjectionMatrix()
    buildLinks()
    if (dropped) {
      restPose()
      render()
    }
  }

  return {
    drop() {
      if (dropped) return
      dropped = true
      startPose()
      wake()
    },
    still() {
      reduced = true
      dropped = true
      restPose()
      render()
    },
    setVisible(next) {
      visible = next
      if (next) wake()
      else sleep()
    },
    resize,
    dispose() {
      sleep()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      scene.traverse(object => {
        if (object instanceof Mesh) object.geometry.dispose()
      })
      faceMaterial.dispose()
      goldMaterial.dispose()
      ribbonMaterial.dispose()
      ;(shadow.material as MeshBasicMaterial).dispose()
      textures.forEach(texture => texture.dispose())
      envMap.dispose()
      pmrem.dispose()
      room.dispose()
      renderer.dispose()
    }
  }
}
