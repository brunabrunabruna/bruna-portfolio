import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  MeshPhysicalMaterial,
  Object3D,
  PlaneGeometry,
  PointLightHelper,
  Raycaster,
  Vector3,
} from "three";
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
import {
  RenderPass,
  UnrealBloomPass,
  EffectComposer,
  ThreeMFLoader,
} from "three-stdlib";
import { loadAssets, loadLogo, loadLogoNew } from "./assets";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import { lights } from "./lights";

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const run = async () => {
  const scene = new THREE.Scene();
  const gui = new dat.GUI();
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = new THREE.PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.1,
    100
  );

  scene.add(camera);
  // //orbit controls
  // const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;

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

    composer.setSize(sizes.width, sizes.height);
  });

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor("#000");

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
  bloomPass.strength = 0;
  bloomPass.radius = params.bloomRadius;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  //
  //
  //
  //          LOGO
  //
  //
  //

  const logoMesh = await loadLogo();
  logoMesh.position.set(0, 1.2, 0);

  const logoMeshNew = await loadLogoNew();
  logoMeshNew.position.set(0, 0, -3);
  camera.position.x = 0;
  camera.position.y = 1.2;
  camera.position.z = 2;

  const planeGeometry = new PlaneGeometry(10, 10);
  const loadingPlaneMaterial = new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 1,
  });
  const planeMesh = new Mesh(planeGeometry, loadingPlaneMaterial);
  planeMesh.position.z = -0.05;

  scene.add(planeMesh);
  scene.add(logoMesh);

  composer.render();

  const assets = await loadAssets();

  // camera.position.x = 0;
  // camera.position.y = 0;
  // camera.position.z = 4;

  /**
   * Textures
   */
  const sphereBackground = new THREE.Mesh(
    new THREE.SphereGeometry(10, 60, 60),
    new THREE.MeshBasicMaterial({
      map: assets.cloudsTex,
      side: THREE.DoubleSide,
    })
  );
  sphereBackground.rotation.z = Math.PI;
  sphereBackground.rotation.z = 30;

  //add cube background
  scene.add(sphereBackground);

  //

  //

  //
  //
  //
  // //              LIGHTS
  // lights();
  // scene.add(
  //   lights.pointLight,
  //   lights.pointLightHelper,
  //   lights.pointLight2,
  //   lights.pointLightHelper2,
  //   lights.rectAreaLight
  // );

  //ambient
  // const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  //point1
  const pointLight = new THREE.PointLight("#cab4e2", 6);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  pointLight.position.set(0, 4, 0.5);

  //point2
  const pointLight2 = new THREE.PointLight("pink", 4);
  pointLight2.position.set(0, 1, -3);
  const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);

  //rect
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  scene.add(
    pointLight,
    // pointLightHelper,
    // pointLight2,
    // pointLightHelper2,
    rectAreaLight
  );

  //          GEOMETRIES
  //

  //      CRYSTAL
  //
  //
  //
  //

  assets.crystalMesh.scale.set(1.2, 1.2, 1.2);
  assets.crystalMesh.position.set(0, 0, -0.5);
  scene.add(assets.crystalMesh);

  //group
  const flowerTallGroup = new THREE.Group();
  // assets.flowersTallFlowersMesh.material.color = new THREE.Color("red");
  flowerTallGroup.add(
    assets.flowersTallStemsMesh,
    assets.flowersTallFlowersMesh,
    assets.flowersTallCenterMesh
  );

  //position
  flowerTallGroup.position.set(-1.5, -1.3, -1.2);
  const flowerTallGroup2 = flowerTallGroup.clone();
  flowerTallGroup2.position.set(1.5, -1.3, -1.2);
  flowerTallGroup2.rotation.y = Math.PI;

  scene.add(flowerTallGroup, flowerTallGroup2);

  const flowerShortGroup = new THREE.Group();
  flowerShortGroup.position.set(2, -1.3, 0);

  flowerShortGroup.add(
    assets.flowersShortStemsMesh,
    assets.flowersShortFlowersMesh,
    assets.flowersShortCenterMesh
  );
  const flowerShortGroup2 = flowerShortGroup.clone();
  flowerShortGroup.position.set(-2, -1.3, 0);

  scene.add(flowerShortGroup, flowerShortGroup2);

  assets.grassMesh.position.set(0, -1.3, 0);
  assets.grassMesh.scale.set(2, 2, 2);

  for (let i = 0; i < 40; i++) {
    const grassNew = assets.grassMesh.clone();
    grassNew.position.x = (Math.random() - 0.5) * 4.5;
    grassNew.position.z = (Math.random() - 0.5) * 4.5;
    grassNew.scale.y = (Math.random() + 1) * 2;
    scene.add(grassNew);
  }

  //bush

  assets.bushMesh.position.set(1, -1.2, 0);
  assets.bushMesh.scale.set(1.5, 1.5, 1.5);
  const bush2 = assets.bushMesh.clone();
  bush2.position.set(-1, -1.2, 0);
  const bush3 = assets.bushMesh.clone();
  bush3.position.set(0.5, -1.2, 1);
  const bush4 = assets.bushMesh.clone();
  bush4.position.set(-0.5, -1.2, 1);
  scene.add(assets.bushMesh, bush2, bush3, bush4);

  // assets.logoMesh.position.set(0, 1.2, 0);
  // scene.add(assets.logoMesh);

  //
  //
  //
  ///
  //          MENU
  /**
   * Fonts
   */

  // const font = await fontLoader.loadAsync(
  //   "/fonts/helvetiker_regular.typeface.json"
  // );

  // Material

  // Text

  ///
  //
  //  text parameters

  const generateTextMesh = (text: string, position: Vector3) => {
    const textParameters = {
      font: assets.font,
      size: 0.07,
      height: 0.005,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 0.03,
      // bevelSize: 0.02,
      // bevelOffset: 0,
      // bevelSegments: 5,
    };
    const menuMaterial = new THREE.MeshPhysicalMaterial({ color: "white" });
    const geometry = new TextGeometry(text, textParameters);
    geometry.center();
    const mesh = new THREE.Mesh(geometry, menuMaterial);

    mesh.position.set(position.x, position.y, position.z);

    const boundingBoxSize = new Vector3();
    mesh.geometry.boundingBox.getSize(boundingBoxSize);
    const boundingBox = new Mesh(
      new BoxGeometry(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z),
      intersectionBoxMaterial
    );
    boundingBox.position.set(position.x, position.y, position.z);

    return [mesh, boundingBox];
  };

  //intersection box material
  const intersectionBoxMaterial = new MeshBasicMaterial({ visible: false });

  //projects
  const [text1, text1Box] = generateTextMesh(
    "projects",
    new Vector3(-2.5, 1.4, -0.1)
  );

  //      HEARTS
  assets.heartMesh.scale.set(0.2, 0.2, 0.2);
  assets.heartMesh.position.set(-1.97, 1.4, -0.1);
  gui.add(assets.heartMesh.position, "x", -3, 3, 0.01);
  gui.add(assets.heartMesh.position, "y", -3, 3, 0.01);
  scene.add(assets.heartMesh);
  //about
  const [text2, text2Box] = generateTextMesh(
    "about",
    new Vector3(-1.5, 1.4, -0.1)
  );
  const heartMesh2 = assets.heartMesh.clone();
  heartMesh2.position.set(-0.93, 1.4, -0.1);
  gui.add(heartMesh2.position, "x", -3, 3, 0.01);

  scene.add(heartMesh2);
  //ista
  const [text3, text3Box] = generateTextMesh(
    "instagram",
    new Vector3(1.5, 1.4, -0.1)
  );
  const heartMesh3 = assets.heartMesh.clone();
  heartMesh3.position.set(0.93, 1.4, -0.1);
  gui.add(heartMesh3.position, "x", -3, 3, 0.01);

  scene.add(heartMesh3);
  //more
  const [text4, text4Box] = generateTextMesh(
    "more",
    new Vector3(2.5, 1.4, -0.1)
  );
  const heartMesh4 = assets.heartMesh.clone();
  heartMesh4.position.set(2.08, 1.4, -0.1);
  gui.add(heartMesh4.position, "x", -3, 3, 0.01);
  gui.close();

  scene.add(heartMesh4);

  //add to the scene
  scene.add(text1, text2, text3, text4);
  scene.add(text1Box, text2Box, text3Box, text4Box);

  const navBarObjects = [
    [text1, text1Box],
    [text2, text2Box],
    [text3, text3Box],
    [text4, text4Box],
  ];
  //cube
  const cubeGeometry = new THREE.BoxGeometry(20, 12, 0.1);
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    map: assets.cloudsTex,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 0, -5);
  scene.add(cube);

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

  //
  //
  //
  //        PARTICLES
  //
  //

  // Geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 200;

  const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

  for (
    let i = 0;
    i < count * 3;
    i++ // Multiply by 3 for same reason
  ) {
    positions[i] = (Math.random() - 0.5) * 5; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
  //
  //
  // Material

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaMap: assets.particlesTex,
  });
  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particles);

  //
  //
  //
  //        FOG
  //
  //
  //
  const fog = new THREE.Fog("#421d6b", 5, 15);
  scene.fog = fog;

  /**
   * Sizes
   */

  //gui

  gui.add(pointLight2, "intensity", 0, 10, 0.1);

  gui.add(assets.crystalMesh.material, "thickness", 0, 10, 0.1);
  gui.add(assets.crystalMesh.material, "ior", 1, 5, 0.01);

  gui.add(pointLight, "intensity", 0, 10, 0.1);

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

  // gui.add(assets.heartMesh, "scale", 0.5, 2, 0.01);

  new Tween(camera.position)
    .to({ x: 0, y: 0, z: 5 }, 1)
    .easing(Easing.Quadratic.InOut)
    .start();

  new Tween(loadingPlaneMaterial)
    .to({ opacity: 0 }, 1)
    .easing(Easing.Quadratic.InOut)
    .start();

  new Tween(bloomPass)
    .to({ strength: params.bloomStrength }, 1)
    .easing(Easing.Cubic.In)
    .start();

  /**
   * Animate
   */
  //
  ///
  //
  //
  //

  /**
   * Mouse
   */
  //  * Mouse
  //  */
  const mouse = new THREE.Vector2(NaN, NaN);
  const targetCameraRotation = { x: 0, y: 0 };
  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    targetCameraRotation.y = -mouse.x / 20;
    targetCameraRotation.x = mouse.y / 20;
    // camera.rotation.y = -mouse.x / 20;
    // camera.rotation.x = mouse.y / 20;
  });

  // INTERFACE
  interface Hoverable {
    raycastObject: Object3D;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }

  let hoveredElement: Hoverable | undefined = undefined;

  window.addEventListener("click", () => {
    if (hoveredElement) {
    }
  });
  //
  //

  const hoverables: Hoverable[] = [];

  navBarObjects.forEach((navBarObject) => {
    const navBarHoverable: Hoverable = {
      raycastObject: navBarObject[1],
      onMouseEnter: () => {
        navBarObject[0].scale.set(1.2, 1.2, 1.2);
        navBarObject[0].material.color = new Color("purple");
        canvas.style.cursor = "pointer";
      },
      onMouseLeave: () => {
        navBarObject[0].scale.set(1, 1, 1);
        navBarObject[0].material.color = new Color("white");
        canvas.style.cursor = "auto";
      },
    };
    hoverables.push(navBarHoverable);
  });

  let crystalSpeed = 0.3;
  const crystalHoverable: Hoverable = {
    raycastObject: assets.crystalMesh,
    onMouseEnter: () => {
      crystalSpeed = 1;
      assets.crystalMesh.material = new MeshBasicMaterial();
    },
    onMouseLeave: () => {
      // assets.crystalMesh.scale.set(1.2, 1.2, 1.2);
      crystalSpeed = 0.3;
      assets.crystalMesh.material = assets.crystalMaterial;
    },
  };
  hoverables.push(crystalHoverable);

  let flowerMaterialAnimation = new Tween(
    assets.flowersShortFlowersMesh.material as MeshStandardMaterial
  ).duration(500);

  console.log(flowerMaterialAnimation);

  let flowerMaterialOriginal = assets.flowersShortFlowersMesh.material;
  const flowerHoverable: Hoverable = {
    raycastObject: assets.flowersShortFlowersMesh,
    onMouseEnter: () => {
      flowerMaterialAnimation.stop();
      flowerMaterialAnimation = new Tween(
        assets.flowersShortFlowersMesh.material as MeshStandardMaterial
      )
        .to({ emissiveIntensity: 100 })
        .start();
    },
    onMouseLeave: () => {
      flowerMaterialAnimation.stop();
      flowerMaterialAnimation = new Tween(
        assets.flowersShortFlowersMesh.material as MeshStandardMaterial
      )
        .to({ emissiveIntensity: 1 })
        .start();
    },
  };
  hoverables.push(flowerHoverable);
  console.log(assets.flowersShortFlowersMesh.material);

  //
  //
  //
  const raycaster = new Raycaster();
  const clock = new THREE.Clock();
  let previousTime = 0;

  //
  //
  //TICK
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    const deltaCameraRotationX = targetCameraRotation.x - camera.rotation.x;
    if (deltaCameraRotationX) {
      const rotationXSign =
        deltaCameraRotationX / Math.abs(deltaCameraRotationX);
      const cameraRotationXSpeed = Math.min(
        Math.abs(deltaCameraRotationX),
        0.04 * deltaTime
      );

      // Set up the easing
      const easing = 0.05;

      // Update the camera's rotation with easing
      camera.rotation.x +=
        (targetCameraRotation.x - camera.rotation.x) * easing;
      camera.rotation.y +=
        (targetCameraRotation.y - camera.rotation.y) * easing;

      // camera.rotation.x += cameraRotationXSpeed * rotationXSign;
    }
    // camera.rotation.y = targetCameraRotation.y;
    //
    //
    //
    //RAYCASTER

    // raycaster.setFromCamera(mouse, camera);
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(10, 0, 0);
    // rayDirection.normalize();
    let intersectionFound = false;
    raycaster.setFromCamera(mouse, camera);
    hoverables.forEach((hoverable) => {
      const intersects = raycaster.intersectObject(hoverable.raycastObject);
      if (intersects.length) {
        if (hoveredElement !== hoverable) {
          hoveredElement?.onMouseLeave();

          hoveredElement = hoverable;
          hoveredElement.onMouseEnter();
        }
        intersectionFound = true;
      }
    });

    if (!intersectionFound && hoveredElement) {
      hoveredElement.onMouseLeave();
      hoveredElement = undefined;
    }

    assets.crystalMesh.rotation.y += deltaTime * crystalSpeed;

    // Update controls
    // controls.update();

    update(elapsedTime * 1000);

    // Render
    // renderer.render(scene, camera);
    composer.render();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
run();
