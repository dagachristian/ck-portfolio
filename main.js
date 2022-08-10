import * as three from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import './style.css'

const textureLoader = new three.TextureLoader()

// Scene

const scene = new three.Scene()
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new three.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
camera.position.z = 7
camera.position.x = -3

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)

const spaceTexture = textureLoader.load('/space.jpg')
scene.background = spaceTexture

// Geometry

const starGeometry = new three.SphereGeometry(0.25, 24, 24)
const starMaterial = new three.MeshStandardMaterial({ color: 0xffffff })
function addStar() {
  const star = new three.Mesh(starGeometry, starMaterial)
  const [ x, y, z ] = Array(3).fill().map(() => three.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)

const geometry = new three.TorusGeometry(10, 0.2, 16, 100)
const material = new three.MeshStandardMaterial({ color: 0xfff5db })
const torus = new three.Mesh(geometry, material)

const earthTexture = textureLoader.load('/earth.jpg')
const earthNormalTexture = textureLoader.load('/earth_normal.jpg')
const earth = new three.Mesh(
  new three.SphereGeometry(4,32,32),
  new three.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormalTexture,
  })
)

// const moonTexture = textureLoader.load('/moon.jpg')
// const moonNormalTexture = textureLoader.load('/moon_normal.jpg')
// const moon = new three.Mesh(
//   new three.SphereGeometry(4,32,32),
//   new three.MeshStandardMaterial({
//     map: moonTexture,
//     normalMap: moonNormalTexture,
//   })
// )

const meTexture = textureLoader.load('/me.jpg')
const meAngry = textureLoader.load('/me_angry.jpg')
const me = new three.Mesh(
  new three.SphereGeometry(2,10,10),
  new three.MeshBasicMaterial({ map: meTexture })
)
me.position.z = 15
me.position.x = 15
me.position.y = 5

const explTexture = textureLoader.load('/explosion.png')
const explosion = new three.Mesh(
  new three.BoxGeometry(5, 5),
  new three.MeshBasicMaterial({ map: explTexture })
)
explosion.position.z = 20

scene.add(torus, earth, me, explosion)

// Lighting

const pointLight = new three.PointLight(0xfffcdb)
pointLight.position.set(-25,-5,5)
const ambientLight = new three.AmbientLight(0xffffff, 0.2)

scene.add(pointLight, ambientLight)

// Helpers

// const lightHelper = new three.PointLightHelper(pointLight)
// const gridHelper = new three.GridHelper(200, 50)

// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement)

// Animation

let boom = false
function moveCamera() {
  const t = document.body.getBoundingClientRect().top/window.innerHeight
  console.log(t)

  if (!boom) {
    if (t < -1.9) {
      scene.remove(earth, pointLight, torus, explosion)
      me.position.set(2,0,8)
      me.material.map = meAngry
      boom = true
    } else {
      me.rotation.z = -1 + t * 3
      me.position.set(15 + t * 10, 5 + t * 4, 15 + t * 10)
    }

    if (t < -1.1) {
      explosion.scale.x = -25 - t * 20
      explosion.scale.y = -25 - t * 20
      explosion.position.z = -10 + t * -10
      ambientLight.intensity = 1
    } else {
      explosion.scale.set(0, 0, 0)
      explosion.position.z = 0
      ambientLight.intensity = 0.2
    }

    camera.position.set(-3 + t * -0.2, t * -0.2, 7 + t * -10)
    camera.rotation.y = t * 0.13
  }
}
document.body.onscroll = moveCamera
document.body.onresize = function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)

  torus.rotation.x += 0.01
  torus.rotation.y += 0.001
  torus.rotation.z += 0.01

  earth.rotation.y += 0.005

  me.rotation.y += 0.002

  // controls.update()

  renderer.render(scene, camera)
}
animate()