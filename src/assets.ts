import {
  CubeTexture,
  CubeTextureLoader,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  TextureLoader,
} from "three";
import { FontLoader } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ConcatenationScope } from "webpack";

export const loadLogo = async () => {
  const gltfLoader = new GLTFLoader();
  const logo = await gltfLoader.loadAsync("models/my_logo.gltf");

  const logoMesh = logo.scene.children[0] as Mesh;

  logoMesh.material = new MeshBasicMaterial({
    color: "#cab4e2",
  });

  return logoMesh;
};
export const loadLogoNew = async () => {
  const gltfLoader = new GLTFLoader();
  const logo = await gltfLoader.loadAsync("models/my_logo.gltf");

  const logoMesh = logo.scene.children[0] as Mesh;

  logoMesh.material = new MeshBasicMaterial({
    color: "#cab4e2",
  });

  return logoMesh;
};

export const loadAssets = async () => {
  const gltfLoader = new GLTFLoader();
  const textureLoader = new TextureLoader();
  const cubeTextureLoader = new CubeTextureLoader();
  const fontLoader = new FontLoader();

  try {
    const [
      environmentMapTexture,
      glassNormal,
      glassAO,
      glassRoughness,
      cloudsTex,
      crystal,
      particlesTex,
      heart,
      flowersTallStems,
      flowersTallFlower,
      flowersTallCenter,
      flowersShortStems,
      flowersShortFlowers,
      flowersShortCenter,
      grass,
      bush,
      // logo,
      font,
    ] = await Promise.all([
      new Promise<CubeTexture>((resolve, reject) => {
        cubeTextureLoader.load(
          [
            "/cubemap/px.png",
            "/cubemap/nx.png",
            "/cubemap/py.png",
            "/cubemap/ny.png",
            "/cubemap/pz.png",
            "/cubemap/nz.png",
          ],
          (texture) => resolve(texture),
          undefined,
          (error) => {
            reject(error);
          }
        );
      }),

      textureLoader.loadAsync("/textures/glass/normal.jpg"),
      textureLoader.loadAsync("/textures/glass/ao.jpg"),
      textureLoader.loadAsync("/textures/glass/roughness.jpg"),
      textureLoader.loadAsync("/textures/clouds.jpg"),
      gltfLoader.loadAsync("models/crystal.gltf"),
      textureLoader.loadAsync("textures/1.png"),
      gltfLoader.loadAsync("models/heart.glb"),
      gltfLoader.loadAsync("models/flowers_tall_stems.glb"),
      gltfLoader.loadAsync("models/flowers_tall_flowers.glb"),
      gltfLoader.loadAsync("models/flowers_tall_center.glb"),
      gltfLoader.loadAsync("models/flowers_short_stems.glb"),
      gltfLoader.loadAsync("models/flowers_short_flowers.glb"),
      gltfLoader.loadAsync("models/flowers_short_center.glb"),
      gltfLoader.loadAsync("models/grass.glb"),
      gltfLoader.loadAsync("models/bush.glb"),
      // gltfLoader.loadAsync("models/my_logo.gltf"),

      fontLoader.loadAsync("/fonts/helvetiker_regular.typeface.json"),
    ]);

    const menuMaterial = new MeshPhysicalMaterial({ color: "white" });

    const crystalMesh = crystal.scene.children[0] as Mesh;
    const crystalMaterial = new MeshPhysicalMaterial({
      color: "#fff",
      envMap: environmentMapTexture,
      normalMap: glassNormal,
      aoMap: glassAO,
      roughnessMap: glassRoughness,
      reflectivity: 1,
      roughness: 0.3,
      clearcoat: 0.8,
      transmission: 1,
      ior: 1.3,
      side: DoubleSide,
    });
    crystalMaterial.thickness = 5;
    crystalMesh.material = crystalMaterial;

    // const logoMesh = logo.scene.children[0] as Mesh;

    // logoMesh.material = new MeshPhysicalMaterial({
    //   color: "white",
    //   metalness: 0.5,
    // });

    // logoMesh.material = new MeshBasicMaterial({
    //   color: "white",
    // });

    return {
      particlesTex,
      cloudsTex,
      crystalMesh,
      crystalMaterial,
      heartMesh: heart.scene.children[0] as Mesh,
      flowersTallStemsMesh: flowersTallStems.scene.children[0] as Mesh,
      flowersTallFlowersMesh: flowersTallFlower.scene.children[0] as Mesh,
      flowersTallCenterMesh: flowersTallCenter.scene.children[0] as Mesh,
      flowersShortStemsMesh: flowersShortStems.scene.children[0] as Mesh,
      flowersShortCenterMesh: flowersShortCenter.scene.children[0] as Mesh,
      flowersShortFlowersMesh: flowersShortFlowers.scene.children[0] as Mesh,
      grassMesh: grass.scene.children[0] as Mesh,
      // logoMesh,
      bushMesh: bush.scene.children[0] as Mesh,
      font,
    };
  } catch (error) {
    console.error(error.message);
  }
};
