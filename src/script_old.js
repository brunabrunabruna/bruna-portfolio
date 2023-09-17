import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { MeshPhysicalMaterial, PointLightHelper } from "three";
import {
  Camera,
  cloneUniformsGroups,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
  PointLight,
  Scene,
  SkinnedMesh,
  SphereGeometry,
} from "three";
import { RenderPass, UnrealBloomPass, EffectComposer } from "three-stdlib";
import exportedFunction, { secondFunction } from "./test";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const run = async () => {
  // Scene
  const scene = new THREE.Scene();

  //      LOADERS
  const gltfLoader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  /**
   * Textures
   */
  const matcapTexture = await textureLoader.loadAsync("textures/matcaps/8.png");
  const newTex = await textureLoader.loadAsync("textures/art1.jpg");
  const GlassDisplacement = await textureLoader.loadAsync(
    "/textures/glass/displacement.jpg"
  );
  const GlassNormal = await textureLoader.loadAsync(
    "/textures/glass/normal.jpg"
  );
  const GlassAO = await textureLoader.loadAsync("/textures/glass/ao.jpg");
  const GlassRoughness = await textureLoader.loadAsync(
    "/textures/glass/roughness.jpg"
  );
  const cloudsTex = await textureLoader.loadAsync("/textures/clouds.jpg");
  const environmentMapTexture = cubeTextureLoader.load(
    [
      "/cubemap/px.png",
      "/cubemap/nx.png",
      "/cubemap/py.png",
      "/cubemap/ny.png",
      "/cubemap/pz.png",
      "/cubemap/nz.png",
    ]
    // ,
    // () => {
    //   material.envMap = pmremGenerator.fromCubemap(
    //     environmentMapTexture
    //   ).texture;
    //   pmremGenerator.dispose();
    //   scene.background = material.envMap;
    // }
  );

  const sphereBackground = new THREE.Mesh(
    new THREE.SphereGeometry(10, 60, 60),
    new THREE.MeshBasicMaterial({
      // envMap: environmentMapTexture,
      map: cloudsTex,
      side: THREE.DoubleSide,
    })
  );
  sphereBackground.rotation.z = Math.PI;
  // scene.add(cubeBackground);
  sphereBackground.rotation.z = 30;

  //add cube background
  scene.add(sphereBackground);
  //   scene.background = cubeBackground;
  //   scene.background = material.envMap;
  //

  //
  //
  //
  //
  //              LIGHTS

  // const areaLight = new THREE.RectAreaLight("pink", 100, 2, 2);
  // areaLight.position.set(0, 1, 2);
  // const areaLightHelper = new RectAreaLightHelper(areaLight);
  // scene.add(areaLight, areaLightHelper);

  // gui.add(areaLight, "intensity", 0, 10, 0.1);

  //ambient
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight);

  //point1
  const pointLight = new THREE.PointLight("white", 6);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  pointLight.position.set(0, 4, 0.5);

  scene.add(pointLight, pointLightHelper);
  gui.add(pointLight, "intensity", 0, 10, 0.1);

  //point2
  const pointLight2 = new THREE.PointLight("pink", 4);
  pointLight2.position.set(0, 1, -3);
  const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);

  scene.add(pointLight2, pointLightHelper2);
  gui.add(pointLight2, "intensity", 0, 10, 0.1);

  //rect
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  scene.add(rectAreaLight);
  //          GEOMETRIES
  //
  //
  //      CRYSTAL
  //
  //
  //
  //

  const gltf = await gltfLoader.loadAsync("models/crystal.gltf");
  const crystalMesh = gltf.scene.children[0];
  // console.log(gltf);
  crystalMesh.material = new THREE.MeshPhysicalMaterial({
    color: "#fff",
    // map: newTex,
    envMap: environmentMapTexture,
    normalMap: GlassNormal,
    aoMap: GlassAO,
    // ior: 1,
    // aoMapIntensity: 1,
    roughnessMap: GlassRoughness,

    // displacementMap: GlassDisplacement,
    // displacementScale: 0.1,
    reflectivity: 1,
    roughness: 0.3,
    clearcoat: 0.8,
    transmission: 1,
    ior: 1.3,
    thickness: 5,
    side: THREE.DoubleSide,
    // opacity: 0.5,
    // transparent: true,
    // wireframe: true,
  });
  crystalMesh.scale.set(1.2, 1.2, 1.2);
  crystalMesh.position.set(0, 0, -0.5);
  scene.add(crystalMesh);
  gui.add(crystalMesh.material, "thickness", 0, 10, 0.1);
  gui.add(crystalMesh.material, "ior", 1, 5, 0.01);
  // areaLight.lookAt(crystalMesh.position);
  //heart
  const heart = await gltfLoader.loadAsync("models/heart.gltf");
  const heartMesh = heart.scene.children[0];
  // scene.add(heartMesh);
  // console.log(heartMesh);
  //
  //
  //
  //
  //            FLOWERS;
  //
  //
  //
  //          animation test

  //
  //
  // //

  // const aniModel = gltfLoader.load("models/flowers_short_animation2.gltf");
  // const aniModelMesh = aniModel.scene.children[0].animation[0];
  // let mixer = new THREE.AnimationMixer(aniModelMesh);
  // console.log(aniModelMesh);
  // //GLTF LOADER
  // // const gltfLoader = new GLTFLoader();
  // gltfLoader.load(
  //   "/models/flowers_short_animation2.gltf",
  //   (gltf) => {
  //     gltf.scene.scale.set(1, 1, 1);
  //     gltf.scene.position.y = -1.3;
  //     gltf.scene.position.z = -0.6;
  //     console.log(gltf);

  //     scene.add(gltf.scene);

  //     mixer = new THREE.AnimationMixer(gltf.scene);
  //     const action = mixer.clipAction(gltf.animations[0]);
  //     action.play();
  //   },
  //   undefined,
  //   (error) => {
  //     // console.log(error:${error});
  //   }
  // );

  //group
  const flowerTallGroup = new THREE.Group();
  //stems
  const flowersTallStems = await gltfLoader.loadAsync(
    "models/flowers_tall_stems.glb"
  );
  const flowersTallStemsMesh = flowersTallStems.scene.children[0];

  // flowersTallStemsMesh.material.color = { r: 0, g: 0, b: 1 };
  //flowers
  const flowersTallFlowers = await gltfLoader.loadAsync(
    "models/flowers_tall_flowers.glb"
  );
  const flowersTallFlowersMesh = flowersTallFlowers.scene.children[0];
  // flowersTallFlowersMesh.material = new THREE.MeshPhysicalMaterial({
  //   color: "blue",
  // });
  // flowersTallFlowersMesh.material.color = { r: 0, g: 0, b: 1 };

  flowerTallGroup.add(flowersTallStemsMesh, flowersTallFlowersMesh);
  // console.log(flowersTallStemsMesh.material.color);

  //position
  flowerTallGroup.position.set(-1.5, -1.3, -1.2);
  const flowerTallGroup2 = flowerTallGroup.clone();
  flowerTallGroup2.position.set(1.5, -1.3, -1.2);
  flowerTallGroup2.rotation.y = Math.PI;

  scene.add(flowerTallGroup, flowerTallGroup2);
  //
  //
  //
  //short
  // const flowerShortGroup = new THREE.Group();
  const flowersShortStems = await gltfLoader.loadAsync(
    "models/flowers_short_stems.glb"
  );
  const flowersShortFlowers = await gltfLoader.loadAsync(
    "models/flowers_short_flowers.glb"
  );
  const flowersShortCenter = await gltfLoader.loadAsync(
    "models/flowers_short_center.glb"
  );
  // const flowersShortStems2 = await gltfLoader.loadAsync(
  //   "models/flowers_short_stems.glb"
  // );
  // const flowersShortFlowers2 = await gltfLoader.loadAsync(
  //   "models/flowers_short_flowers.glb"
  // );
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(2, -1.3, 0);
  const flowersShortStemsMesh = flowersShortStems.scene.children[0];
  const flowersShortFlowersMesh = flowersShortFlowers.scene.children[0];
  const flowersShortCenterMesh = flowersShortCenter.scene.children[0];
  // flowersShortFlowersMesh.material = new THREE.MeshPhysicalMaterial({
  //   color: "pink",
  // });
  flowerGroup.add(
    flowersShortStemsMesh,
    flowersShortFlowersMesh,
    flowersShortCenterMesh
  );
  const flowerGroup2 = flowerGroup.clone();
  flowerGroup.position.set(-2, -1.3, 0);

  scene.add(flowerGroup, flowerGroup2);

  // const flowerGroup2 = new THREE.Group();
  // flowerGroup2.position.set(-2, -1.3, 0);

  // const flowersShortStemsMesh2 = flowersShortStems2.scene.children[0];
  // const flowersShortFlowersMesh2 = flowersShortFlowers2.scene.children[0];
  // flowerGroup2.add(flowersShortStemsMesh2, flowersShortFlowersMesh2);
  // flowersShortMesh.material = new THREE.MeshStandardMaterial({
  //   // color: "#fff",
  //   // transparent: true,
  //   // opacity: 1,
  //   // metalness: 0,
  //   // side: THREE.DoubleSide,
  // });

  // flowerShortGroup.add(flowerGroup);
  // console.log(flowersShortStemsMesh);
  //   directionalLight.lookAt(crystalMesh);

  //
  //
  //
  //        GRASS
  //

  const grass = await gltfLoader.loadAsync("models/grass.glb");
  const grassMesh = grass.scene.children[0];
  grassMesh.position.set(0, -1.3, 0);
  grassMesh.scale.set(2, 2, 2);
  // grassMesh.material.color = { r: 0, g: 0, b: 1 };
  scene.add(grass);
  console.log(grassMesh.material);

  // const grassNew = grassMesh.clone();
  // grassNew.position.set(2, -1.3, 0);
  // scene.add(grassNew);

  for (let i = 0; i < 50; i++) {
    const grassNew = grassMesh.clone();
    grassNew.position.x = (Math.random() - 0.5) * 4.5;
    grassNew.position.z = (Math.random() - 0.5) * 4.5;
    scene.add(grassNew);
  }
  //
  //
  //   LOGO
  //
  //
  //

  const logo = await gltfLoader.loadAsync("models/my_logo.gltf");
  const logoMesh = logo.scene.children[0];
  logoMesh.material = new THREE.MeshPhysicalMaterial({
    color: "white",
    metalness: 0.5,
  });
  logoMesh.position.set(0, 1.2, 0);
  // logoMesh.scale.set();
  scene.add(logoMesh);

  //
  //
  //
  ///
  //          MENU
  /**
   * Fonts
   */
  const fontLoader = new FontLoader();

  const font = await fontLoader.loadAsync(
    "/fonts/helvetiker_regular.typeface.json"
  );

  // Material
  // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const menuMaterial = new THREE.MeshPhysicalMaterial({ color: "white" });

  // Text

  ///
  //
  //  text parameters
  const textParameters = {
    font: font,
    size: 0.1,
    height: 0.01,
    // curveSegments: 12,
    // bevelEnabled: true,
    // bevelThickness: 0.03,
    // bevelSize: 0.02,
    // bevelOffset: 0,
    // bevelSegments: 5,
  };

  //projects
  const textGeometry1 = new TextGeometry("projects", textParameters);
  textGeometry1.center();

  const text1 = new THREE.Mesh(textGeometry1, menuMaterial);
  text1.position.set(-2.5, 1.4, 0);

  //about
  const textGeometry2 = new TextGeometry("about", textParameters);

  textGeometry2.center();

  const text2 = new THREE.Mesh(textGeometry2, menuMaterial);
  text2.position.set(-1.5, 1.4, 0);

  //ista
  const textGeometry3 = new TextGeometry("instagram", textParameters);

  textGeometry3.center();

  const text3 = new THREE.Mesh(textGeometry3, menuMaterial);
  text3.position.set(1.5, 1.4, 0);

  //more
  const textGeometry4 = new TextGeometry("more", textParameters);

  textGeometry4.center();

  const text4 = new THREE.Mesh(textGeometry4, menuMaterial);
  text4.position.set(2.5, 1.4, 0);

  //add to the scene
  scene.add(text1, text2, text3, text4);

  //cube
  const bgMaterial = textureLoader.load("textures/clouds.jpg");
  const cubeGeometry = new THREE.BoxGeometry(16, 10, 0.1);
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    map: bgMaterial,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 0, -5);
  scene.add(cube);
  // console.log(cubeMaterial);

  //
  //
  //
  //          FLOOR DISC

  ///

  const floorPlane = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.1, 5, 1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "#421d6b" })
  );
  floorPlane.position.set(0, -1.4, 0);
  scene.add(floorPlane);

  exportedFunction();
  secondFunction();

  //
  //
  //
  //        PARTICLES
  //
  //
  //
  // // Geometry
  // const particlesGeometry = new THREE.BufferGeometry();
  // const count = 500;

  // const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

  // for (
  //   let i = 0;
  //   i < count * 3;
  //   i++ // Multiply by 3 for same reason
  // ) {
  //   positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  // }

  // particlesGeometry.setAttribute(
  //   "position",
  //   new THREE.BufferAttribute(positions, 3)
  // ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
  // //
  // //
  // // Material
  // const particlesMaterial = new THREE.PointsMaterial({
  //   size: 0.02,
  //   sizeAttenuation: true,
  //   depthWrite: false,
  //   blending: THREE.AdditiveBlending,
  // });
  // // Points
  // const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  // scene.add(particles);

  //
  //
  //
  //        FOG
  //
  //
  //
  const fog = new THREE.Fog("#000", 5, 15);
  // scene.fog = fog;

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 4;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor("#000");

  //
  //
  //
  //
  //
  //             BLOOM
  //
  //
  //
  const params = {
    exposure: 1,
    bloomStrength: 0.5,
    bloomThreshold: 0.57,
    bloomRadius: 0.2,
  };
  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  //gui
  gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
    renderer.toneMappingExposure = Math.pow(value, 4.0);
  });

  gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
    bloomPass.threshold = Number(value);
  });

  gui.add(params, "bloomStrength", 0.0, 3.0).onChange(function (value) {
    bloomPass.strength = Number(value);
  });

  gui
    .add(params, "bloomRadius", 0.0, 1.0)
    .step(0.01)
    .onChange(function (value) {
      bloomPass.radius = Number(value);
    });
  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let previousTime = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // //update models animation
    // if (mixer) {
    //   mixer.update(deltaTime);
    // }

    crystalMesh.rotation.y = elapsedTime * 0.3;

    // Update controls
    controls.update();

    // Render
    // renderer.render(scene, camera);
    composer.render();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
run();
